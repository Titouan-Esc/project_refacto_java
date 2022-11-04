
//-------------------------------------------------------------
//  Nom Document : cvs_drag
//  Auteur       : kazma (Kamel A) http://codes-sources.commentcamarche.net/
//  Objet        : deplacer les elements d'un canvas a la souris
//  Création     : 01.04.2015
//-------------------------------------------------------------
//  Mise à Jour  : 
//-------------------------------------------------------------


function kvs_drag(cvs,oj){

	this.elemdrag=null;
	this.decx=null;
	this.decy=null;
	this.rar=true;
	
	this.obj_json=oj;
	this.cvs=document.getElementById(cvs);

	this.tb_image=[];
	this.tb_pos=[];
	this.index=0;
	this.nbimage=0;
	this.ftc='';
	
	this.init();
}


kvs_drag.prototype.init_mousedown=function(s){				//reception du l'evenement mousedown

	if(this.rar){
		
		this.decx = s.pageX - (this.cvs.offsetLeft);
		this.decy = s.pageY - (this.cvs.offsetTop);
		
		for(var i=this.tb_pos.length-1;i>=0;i--){
			
			var val=this.tb_pos[i];
			
			if(this.obj_json[val].deplacable==false && this.obj_json[val].type!="texte_lien"){
				
				continue;	
			}		
			
			if(this.colision(val)){
				
				if(this.obj_json[val].type=="texte_lien"){
					
					this.lien(val)
					break
				}
				else{
					this.init_drag(i)
					s.preventDefault();
					break;
				}
			}
		}
	}
}


kvs_drag.prototype.lien=function(val){		//modifie l'url
	
	window.location.assign(this.obj_json[val].adresse)
	
}


kvs_drag.prototype.init_drag=function(i){			// initialisation du deplacement

	var change =parseInt(this.tb_pos.splice(i,1));
	this.tb_pos.push(change);
	
	this.index=this.tb_pos[this.tb_pos.length-1];
	
	this.decx_b=this.decx-this.obj_json[this.index].gauche;
	this.decy_b=this.decy-this.obj_json[this.index].haut;
	
	var that=this;
	
	this.ftc=function(s){that.posi.call(that,s)};
	
	document.documentElement.addEventListener("mousemove", that.ftc, false);
	
	
	this.rar=false;
}


kvs_drag.prototype.posi=function(s){		// deplacement

	var setX =s.pageX;
	var setY =s.pageY;
	
	this.obj_json[this.index].haut = s.pageY - (this.cvs.offsetTop+this.decy_b);
	this.obj_json[this.index].gauche = s.pageX - (this.cvs.offsetLeft+this.decx_b);
	
	this.cvs_dessin(this);
	
}


kvs_drag.prototype.fin_drag=function(){			//fin du deplacement
	
	if(this.rar==false){
		
		document.documentElement.removeEventListener("mousemove", this.ftc, false);
		
		this.rar=true;
	}
}


kvs_drag.prototype.colision=function(val){		//interception de la position des elements
	
	if(this.decy >= this.obj_json[val].haut + this.obj_json[val].hauteur		// trop en bas
			|| this.decy <= this.obj_json[val].haut						// trop en haut
			|| this.decx>=this.obj_json[val].gauche + this.obj_json[val].largeur	// trop à droite
			|| this.decx<=this.obj_json[val].gauche){					// trop à gauche
		
		return false;	
	}
	else{
		
		return true;
	}
}


kvs_drag.prototype.init=function(){		//lecture du fichier json et configuration des variables et array

	for(var i=0;i<this.obj_json.length;i++){
		
		if(this.obj_json[i].type=="image"){
			
			this.tb_image.push(new Image());
			this.tb_image[i].src=this.obj_json[i].image;
			this.nbimage++
		}

		else if(this.obj_json[i].type=="rectangle"){
			this.tb_image.push("vide");
		}
		
		else if(this.obj_json[i].type=="cercle"){
			
			this.obj_json[i].hauteur=this.obj_json[i].rayon*2;
			this.obj_json[i].largeur=this.obj_json[i].rayon*2;
			this.obj_json[i].haut=this.obj_json[i].haut-this.obj_json[i].rayon;
			this.obj_json[i].gauche=this.obj_json[i].gauche-this.obj_json[i].rayon;
			this.tb_image.push("vide");
		}
		
		else if(this.obj_json[i].type=="texte"|| this.obj_json[i].type=="texte_lien"){
			
			var ctx = this.cvs.getContext("2d");
			ctx.font = this.obj_json[i].police;
			this.obj_json[i].largeur= ctx.measureText(this.obj_json[i].texte).width;
			this.tb_image.push("vide");
		}
		
		if(this.obj_json[i].deplacable || this.obj_json[i].type=="texte" || this.obj_json[i].type=="texte_lien"){
			
			this.tb_pos.push(i);
		}
		else{
			this.tb_pos.unshift(i);
		}
	}
	this.precharge();
}


kvs_drag.prototype.precharge=function(){		//prechargement des images

	for (var i = 0; i < this.tb_image.length; i++){
		if(this.tb_image[i] !="vide"){

			if(this.tb_image[i].complete== true || this.tb_image[i].height>0){
				
				this.nbimage--;
			}
		}
	}
	
	if(this.nbimage==0){
		
		this.cvs.addEventListener("mousemove",this.style_curseur.bind(this), false);
		this.cvs.addEventListener("mousedown",this.init_mousedown.bind(this), false);
		this.cvs.addEventListener("mouseup",this.fin_drag.bind(this), false);
		
		this.cvs_dessin();
		return false
		
	}
	setTimeout(this.precharge.bind(this),100);
}


kvs_drag.prototype.style_curseur=function(s){		//gestion du curseur
	
	this.decx = s.pageX - (s.currentTarget.offsetLeft);
	this.decy = s.pageY - (s.currentTarget.offsetTop);

	for(var i=this.tb_pos.length-1;i>=0;i--){
		
		var val=this.tb_pos[i];
		
		if(this.obj_json[val].deplacable==false && this.obj_json[val].type!="texte_lien"){
			
			continue;	
		}
		
		if(this.colision(val) && this.obj_json[val].type!="texte_lien"){
			
			this.cvs.style.cursor='move';
			break;
		}
		
		else if(this.colision(val) && this.obj_json[val].type=="texte_lien"){
			
			this.cvs.style.cursor='pointer';
			break;
		}
		
		else{

			this.cvs.style.cursor='default';
		}
	}
}


kvs_drag.prototype.cvs_dessin=function(){		// dessin du canvas

	var cvs=this.cvs;
	var ctx = cvs.getContext("2d");

	ctx.clearRect(0,0,cvs.width,cvs.height);
	
	for(var i=0;i<=this.tb_pos.length-1;i++){
		
		var element=this.obj_json[this.tb_pos[i]]
		
		ctx.fillStyle=element.couleur;  

		switch (element.type) {
			
		case "rectangle":
			this.rectangle(ctx,element)
			break;
			
		case "image":
			this.image(ctx,element,i)
			break;

		case "cercle":
			this.cercle(ctx,element)
			break;
			
		case "texte":
			this.texte(ctx,element)
			break;
			
		case "texte_lien":
			this.texte(ctx,element)
			break;
		}
	}
}
	
	
kvs_drag.prototype.rectangle=function(ctx,element){
	
	ctx.beginPath();
	ctx.rect(element.gauche,element.haut,element.largeur,element.hauteur);
	ctx.fill();
}
		
		
kvs_drag.prototype.image=function(ctx,element,i){
	
	ctx.drawImage(this.tb_image[this.tb_pos[i]],element.gauche,element.haut,element.largeur,element.hauteur);
}
		
		
kvs_drag.prototype.cercle=function(ctx,element){
	
	ctx.beginPath();
	ctx.arc(element.gauche+element.rayon,element.haut+element.rayon, element.rayon, 0, Math.PI*2);
	ctx.fill();
}


kvs_drag.prototype.texte=function(ctx,element){
	
	ctx.fillStyle=element.couleur;
	ctx.font = element.police;
	ctx.fillText(element.texte, element.gauche, (element.haut+element.hauteur));
}


//////////////creation des instances////////////////

function lancer(){
	
	new kvs_drag("zone",cvs_elem);	//mettre le nom du canvas cible et le nom du fichier json//
	new kvs_drag( "zone2",cvs_elem2);	//mettre le nom du canvas cible et le nom du fichier json//	
}

window.addEventListener("load",lancer, false);

//////////////////////////////////////////////////



