
// No interface in JS so abstract class for this
class GeoInterface {
	constructor() {
	}

	Init() {}
}

class Geo extends GeoInterface {
	constructor(cvs, obj) {
		super();
		let elemdrag=null;
		let decx=null;
		let decy=null;
		let rar=false;

		this.obj_json= obj;
		this.cvs=document.getElementById(cvs);

		let tb_image=[];
		let tb_pos=[];
		let index=0;
		let nbimage=0;
		let ftc='';
	}

	Init() {
		super.Init();
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

	Rectangle(ctx, element) {
		ctx.beginPath();
		ctx.rect(element.gauche,element.haut,element.largeur,element.hauteur);
		ctx.fill();
	}

	Image(ctx,element,i) {
		ctx.drawImage(this.tb_image[this.tb_pos[i]],element.gauche,element.haut,element.largeur,element.hauteur);
	}

	Cercle(ctx,element) {
		ctx.beginPath();
		ctx.arc(element.gauche+element.rayon,element.haut+element.rayon, element.rayon, 0, Math.PI*2);
		ctx.fill();
	}

	Texte(ctx, element) {
		ctx.fillStyle=element.couleur;
		ctx.font = element.police;
		ctx.fillText(element.texte, element.gauche, (element.haut+element.hauteur));
	}

	InitMouse(s) {
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

	Lien(val) {
		window.location.assign(this.obj_json[val].adresse)
	}

	InitDrag(i) {
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

	Position(s) {
		var setX =s.pageX;
		var setY =s.pageY;

		this.obj_json[this.index].haut = s.pageY - (this.cvs.offsetTop+this.decy_b);
		this.obj_json[this.index].gauche = s.pageX - (this.cvs.offsetLeft+this.decx_b);

		this.cvs_dessin(this);
	}

	EndDrag() {
		if(this.rar==false){

			document.documentElement.removeEventListener("mousemove", this.ftc, false);

			this.rar=true;
		}
	}

	Colision(val) {
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

	Precharge() {
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

	StyleCursor(s) {
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

	CvsDessin() {
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
}


function InitAll(nb) {
	nb.Init()
	nb.Rectangle()
	nb.Image()
	nb.Cercle()
	nb.Texte()
	nb.InitMouse()
	nb.Lien()
	nb.InitDrag()
	nb.Position()
	nb.EndDrag()
	nb.Colision()
	nb.Precharge()
	nb.StyleCursor()
	nb.CvsDessin()
}


//////////////creation des instances////////////////

function lancer(){
	const z1 = new Geo("zone", cvs_elem)
	InitAll(z1)

	const z2 = new Geo("zone2", cvs_elem2)
	InitAll(z2)
}

window.addEventListener("load",lancer, false);

//////////////////////////////////////////////////



