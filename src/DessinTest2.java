/****************************************************************************
 * @author Josaphat Mayuba Ndele	et Andres Garcia Cotton					*					*
 * Les programmes permet a faire de dessin de forme rectanglulaire et 		*
 * les ellipses	on peut l'enregistre et ouvrir le meme fichier.				*											*
 * 																			*
 ****************************************************************************/
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.EventQueue;
import java.awt.FlowLayout;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.geom.Rectangle2D;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import javax.swing.ButtonGroup;
import javax.swing.ImageIcon;
import javax.swing.JColorChooser;
import javax.swing.JComponent;
import javax.swing.JFileChooser;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JMenu;
import javax.swing.JMenuBar;
import javax.swing.JMenuItem;
import javax.swing.JPanel;
import javax.swing.JRadioButton;
import javax.swing.KeyStroke;

public class DessinTest2 {

	public static void main(String[] args) {
		EventQueue.invokeLater(new Runnable() {
			public void run() {
				DessinFrame application = new DessinFrame("paint drawing");
				application.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

				application.setSize(800, 600);
				application.setVisible(true);

			}
		});
	}
}

/**
 * 
 * @param DessinFrame
 *            permet de construire l'apparence du programme ,ils contiennent les
 *            boutons et de lier les actions aux boutons
 * @see PanelDesign
 *            le panneau qui permet a faire le dessin
 */
class DessinFrame extends JFrame {
	private DessinPanel2 PanelDesign;
	private ColorComponent couleur;

	public DessinFrame(String titre) {
		setTitle(titre);
		
		
		// PANNEAU DE DESSIN
		PanelDesign = new DessinPanel2();
		PanelDesign.setCouleur(Color.BLACK);
		PanelDesign.setBackground(Color.WHITE);
		this.add(PanelDesign, BorderLayout.CENTER);
		this.add(new JLabel("Clic et drag pour dessiner"), BorderLayout.SOUTH);

		// construction du menu
		JMenuBar fileMenu = new JMenuBar();
		setJMenuBar(fileMenu);
		JMenu fichierMenu = new JMenu("Fichier");
		fileMenu.add(fichierMenu);
		JMenuItem openItem = new JMenuItem("Ouvrir");
		JMenuItem sauvegarderItem = new JMenuItem("Enregistrer");
		
		
		// TOUCHE RELIER AU MENU
		openItem.setAccelerator(KeyStroke.getKeyStroke("ctrl O"));
		sauvegarderItem.setAccelerator(KeyStroke.getKeyStroke("ctrl S"));
		
		
		// LES ACTION POUR SOUS MENU OUVRIR ET SAUVERGARDER
		openItem.addActionListener(new ActionListener() {

			public void actionPerformed(ActionEvent e) {
				JFileChooser fileChooser = new JFileChooser();
				int result = fileChooser.showOpenDialog(null);
				if (result == JFileChooser.APPROVE_OPTION) {
					try {
						File file2 = fileChooser.getSelectedFile();
						FileInputStream ouvre = new FileInputStream(file2);
						ObjectInputStream ouvrir = new ObjectInputStream(ouvre);
						PanelDesign.lireInfo(ouvrir);

					} catch (IOException io) {
						System.exit(1);
					}
				}
			}
		});
		sauvegarderItem.addActionListener(new ActionListener() {

			public void actionPerformed(ActionEvent e) {
				JFileChooser fileChooser = new JFileChooser();
				int result = fileChooser.showSaveDialog(null);
				if (result == JFileChooser.APPROVE_OPTION) {
					try {
						File file = fileChooser.getSelectedFile();
						FileOutputStream enr = new FileOutputStream(file);
						ObjectOutputStream enregistre = new ObjectOutputStream(
								enr);

						PanelDesign.enregistre(enregistre);

					} catch (IOException io) {
						System.exit(1);
					}
				}
			}
		});

		// affche menu ouvrir
		fichierMenu.add(openItem);
		fichierMenu.add(sauvegarderItem);
		
		
		// SEPARATEUR
		fichierMenu.addSeparator();

		// AUTRE SOUS MENU,LEURS TOUCHES ET LEURS ACTIONS
		JMenuItem effacerItem = new JMenuItem("Effacer");
		fichierMenu.add(effacerItem);
		effacerItem.setAccelerator(KeyStroke.getKeyStroke("ctrl C"));
		effacerItem.addActionListener(new ActionListener() {

			public void actionPerformed(ActionEvent e) {
				PanelDesign.clearAll();
			}
		});

		JMenu selectionMenu = new JMenu("Selection");
		fileMenu.add(selectionMenu);
		
		JMenuItem Tout = new JMenuItem("Tout");
		selectionMenu.add(Tout);
		Tout.setAccelerator(KeyStroke.getKeyStroke("ctrl A"));
		Tout.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {

				PanelDesign.selectTout();
			}

		});

		JMenuItem Aucun = new JMenuItem("Aucun");
		selectionMenu.add(Aucun);
		Aucun.setAccelerator(KeyStroke.getKeyStroke("ESCAPE"));
		Aucun.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {

				PanelDesign.clearSelected();
			}

		});
		JMenuItem Colore = new JMenuItem("Colore");
		selectionMenu.add(Colore);
		Colore.setAccelerator(KeyStroke.getKeyStroke("ctrl R"));
		selectionMenu.addSeparator();
		Colore.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {

				PanelDesign.coloreSelected();
			}

		});

		JMenuItem Supprime = new JMenuItem("Supprime");
		selectionMenu.add(Supprime);
		Supprime.setAccelerator(KeyStroke.getKeyStroke("BACK_SPACE"));
		Supprime.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {

				PanelDesign.deleteSelected();
			}

		});
		// PANNEAU DE BOUTON RADIO
		/**
		 * @param laBarreOutils
		 *            laBarreOutils contient des boutons qui permet a
		 *            l'utilisation ou la selecion de couleur et des different
		 *            forme a dessiner
		 * 
		 */
		JPanel laBarreOutils = new JPanel();

		String chemin_img = System.getProperty("user.dir") + File.separator
				+ "images" + File.separator;
		// *BOUTON RADIO
		JRadioButton ellipse = new JRadioButton(new ImageIcon(chemin_img
				+ "ellipse.png"));
		ellipse.setSelectedIcon(new ImageIcon(chemin_img + "ellipseSelect.png"));

		JRadioButton rectangle = new JRadioButton(new ImageIcon(chemin_img
				+ "rectangle.png"));
		rectangle.setSelectedIcon(new ImageIcon(chemin_img
				+ "rectangleSelect.png"));

		laBarreOutils.add(rectangle);
		laBarreOutils.add(ellipse);
		couleur = new ColorComponent(Color.BLACK);
		couleur.addMouseListener(new MouseAdapter() {

			public void mouseClicked(MouseEvent e) {
				Color defeaultColor = getBackground();
				Color selected = JColorChooser.showDialog(DessinFrame.this,
						"Palette de Couleur", defeaultColor);

				if (selected != null) {
					couleur.setColor(selected);
					PanelDesign.setCouleur(selected);
				}
			}
		});

		// on doit cr�er un groupe de boutons pour pouvoir cocher seulment un
		// seul bouton et non les deux boutonr

		ButtonGroup group = new ButtonGroup();
		group.add(ellipse);
		group.add(rectangle);

		rectangle.setSelected(true);
		rectangle.addItemListener(new RadioButtonHandler("Rectangle"));
		ellipse.addItemListener(new RadioButtonHandler("Ellipse"));

		laBarreOutils.add(couleur);
		laBarreOutils.setPreferredSize(new Dimension(54, 70));

		laBarreOutils.setLayout(new FlowLayout(FlowLayout.LEFT, 15, 15));

		this.add(laBarreOutils, BorderLayout.NORTH);

	}

	/**
	 * @param RadioButtonHandler
	 *            une facon pour permettre la selection plus simple en nommant
	 *            un nom qui peut etre verifier
	 * 
	 * 
	 */
	private class RadioButtonHandler implements ItemListener {
		private String name;

		public RadioButtonHandler(String s) {
			name = s;
		}

		/**
		 * @param itemStateChanged
		 *            pour selectionnner par rapport au bouton radio cliquer
		 */
		public void itemStateChanged(ItemEvent e) {
			if (name.equals("Rectangle"))
				PanelDesign.setTypeDessin(FormGeo.Type.RECT);
			if (name.equals("Ellipse"))
				PanelDesign.setTypeDessin(FormGeo.Type.ELLIPSE);

		}

	}

	// TAILLE AFFICHAGE
	public static final int DEFAULT_WIDTH = 300;
	public static final int DEFAULT_HEIGHT = 400;

}

/**
 * 
 * @param ColorComponent
 *            Pallette de couleur
 */

class ColorComponent extends JComponent {
	private Color c;
	private Rectangle2D rect;

	public ColorComponent(Color c) {
		super();
		this.c = c;
		this.rect = new Rectangle2D.Double(5, 5, 15, 15);
		this.setPreferredSize(new Dimension(20, 20));
		this.setMaximumSize(new Dimension(25, 25));
	}

	public void paintComponent(Graphics g) {
		Graphics2D g2 = (Graphics2D) g;
		g2.setPaint(c);
		g2.fill(rect);

	}

	public Color getColor() {
		return c;
	}

	public void setColor(Color c) {
		this.c = c;
		repaint();
	}
}
