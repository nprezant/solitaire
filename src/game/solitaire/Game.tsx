import Stack from './Stack'
import Foundations from './Foundations'
import Tableau from './Tableau'

/**
 * The main solitaire game.
 */
 class Game {
  drawRate: any;
  drawPile: Stack;
  wastePile: Stack;
  foundations: Foundations;
  tableau: Tableau;

  /**
   * Initializer
   * @param {number} drawRate how many cards to draw at a time.
   */
  constructor(drawRate: number) {
    this.drawRate = drawRate;

    /**
     * The draw pile
     * @type {Stack}
     * @public
     */
    this.drawPile = new Stack();
    this.wastePile = new Stack(); // Cards
    this.foundations = new Foundations(); // Where the aces stack upwards
    this.tableau = new Tableau(); // Where you play solitaire
  }

  /**
   * Sets up a new game.
   */
  setup() {
    // Draw pile
    this.drawPile.fillDeck();
    this.drawPile.shuffle();

    // Waste pile
    this.wastePile.clear();

    // Foundations
    this.foundations.clear();

    // Tableau
    this.tableau.clear();
    const nColumns = this.tableau.columns.length;
    for (let ncol = nColumns; ncol > 0; --ncol) { // Columns in reverse
      for (let i = 0; i < ncol; ++i) { // Cards in the column
        
        const columnIndex = nColumns - i - 1;
        const card = this.drawPile.take()[0];

        if (card == null)
          throw new Error("Cannot setup board. Not enough cards.");

        let column = this.tableau.columns[columnIndex];

        if (i !== ncol - 1) {
          column.nHidden += 1;
        }

        column.cards.addToTop(card);
      }
    }
  }

  /**
   * Perform the draw step of solitaire.
   */
  drawStep() {
    const drawnCards = this.drawPile.take(this.drawRate);
    this.wastePile.addToTop(...drawnCards);
  }

  /**
   * Whether the win condition has been met.
   */
  won(): boolean {
    return this.foundations.full();
  }
}

export default Game;