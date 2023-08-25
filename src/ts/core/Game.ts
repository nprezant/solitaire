import { Deck } from './Deck'
import { Foundations } from './Foundations'
import { Tableau } from './Tableau'

/**
 * The main solitaire game.
 */
 class Game {
  drawRate: any;
  drawPile: Deck;
  wastePile: Deck;
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
     * @type {Deck}
     * @public
     */
    this.drawPile = new Deck();
    this.wastePile = new Deck(); // Cards
    this.foundations = new Foundations(); // Where the aces stack upwards
    this.tableau = new Tableau(); // Where you play solitaire
  }

  /**
   * Sets up a new game.
   */
  setup() {
    // Draw pile
    this.drawPile.fill();
    this.drawPile.shuffle();

    // Waste pile
    this.wastePile.clear();

    // Foundations
    this.foundations.clear();

    // Tableau
    this.tableau.clear();
    const nColumns = this.tableau.columns.length;
    for (let n = nColumns; n > 0; --n) {
      for (let j = 0; j < n; ++j) {
        const columnIndex = nColumns - j - 1;
        const card = this.drawPile.take()[0];
        if (card == null)
          throw new Error("Cannot setup board. Not enough cards.");
        if (j === n - 1) {
          card.faceup = true;
        }
        this.tableau.columns[columnIndex].cards.addToTop(card);
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
   * @return {boolean}
   */
  won(): boolean {
    return this.foundations.full();
  }
}

export { Game }