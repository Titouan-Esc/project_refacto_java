/****************************************************************************
 * @author Josaphat Mayuba Ndele	et Andres Garcia Cotton					*					*
 * Les programmes permet a faire de dessin de forme rectanglulaire et 		*
 * les ellipses	on peut l'enregistre et ouvrir le meme fichier.				*											*
 * 																			*
 ****************************************************************************/
import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.geom.Ellipse2D;
import java.awt.geom.Point2D;
import java.awt.geom.Rectangle2D;
import java.awt.geom.RectangularShape;
import java.io.Serializable;

/**
 * @param FormGeo
 *            une classe pour permettre a utiliser le meme coordonner pour
 *            dessiner le different forme
 * @param Type
 *            le type de forme geometrique
 * 
 */
public class FormGeo implements Serializable {
	public static enum Type {
		RECT, ELLIPSE
	};

	// couleur qu'aura le prochain objet dessin�
	private static Color couleurCourante = Color.BLACK;
	protected static FormGeo.Type Type;
	private boolean selected;
	private RectangularShape rs;
	// champs pourla couleur de l'objet et son type
	private Color couleur; // la couleur de l'objet
	private Type type;

	/**
	 * Constructeur, qui selon le type pass� en argument, va initialiser rs avec
	 * une ellipse ou un rectangle.
	 * 
	 * @param td
	 *            le type de forme g�om�trique � cr�er
	 * @param x
	 *            la position
	 * @param y
	 *            la position
	 * @param w
	 *            la largeur
	 * @param h
	 *            la hauteur
	 */
	public FormGeo(Type td, double x, double y, double w, double h) {

		this.type = td;
		if (td == Type.RECT) {
			this.rs = new Rectangle2D.Double(x, y, w, h);
		} else if (td == Type.ELLIPSE) {
			this.rs = new Ellipse2D.Double(x, y, w, h);
		}

	}

	public FormGeo(Type td) {
		this(td, 0, 0, 0, 0);
	}

	public static void setCouleurCourante(Color c) {
		couleurCourante = c;
	}

	public static Color getCouleurCourante() {
		return couleurCourante;
	}

	public void dessine(Graphics2D g) {
		g.setPaint(couleur);
		g.fill(rs);

	}

	public void setSelected(boolean b) {
		selected = b;
	}

	public void setCouleur(Color c) {
		couleur = c;
	}

	public Color getCouleur() {
		return couleur;
	}

	public boolean isSelected() {
		return selected;
	}

	public boolean contains(Point2D p) {
		return rs.contains(p);
	}

	public double getWidth() {
		return rs.getWidth();
	}

	public double getX() {
		return rs.getX();
	}

	public double getHeight() {
		return rs.getHeight();
	}

	public double getY() {
		return rs.getY();
	}

	// faire de mouvement
	/**
	 * 
	 * @param moveBy
	 *            permet a faire les differentes mouvement de la souris
	 * 
	 */
	public void moveBy(double dx, double dy) {
		double x = this.rs.getX();
		double y = this.rs.getY();
		double w = this.rs.getWidth();
		double h = this.rs.getHeight();
		this.rs.setFrame(x + dx, y + dy, w, h);
	}

	public void setFrameFromDiagonal(Point2D lastPointPress, Point2D p) {
		this.rs.setFrameFromDiagonal(lastPointPress, p);
	}
}