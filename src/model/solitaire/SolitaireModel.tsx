import Stack from './Stack'
import Foundations from './Foundations'
import Tableau from './Tableau'
import BoardEntity from './BoardEntity';
import { MoveData, WithoutMethods } from './MoveData';

/**
 * The main solitaire game.
 */
 class SolitaireModel {
  drawRate: any;
  drawPile: Stack;
  wastePile: Stack;
  foundations: Foundations;
  tableau: Tableau;

  constructor(drawRate: number) {
    this.drawRate = drawRate;

    this.drawPile = new Stack();
    this.wastePile = new Stack(); // Cards
    this.foundations = new Foundations(); // Where the aces stack upwards
    this.tableau = new Tableau(); // Where you play solitaire
  }

  // The move hook is called whenever the solitaire model moves a card.
  public moveHook: (data: MoveData) => void = () => { };

  private sendMoveMessage(data: WithoutMethods<MoveData>) {
    this.moveHook(new MoveData(data));
  }

  setup() {
    // Draw pile
    this.drawPile.fillDeck();
    // this.drawPile.shuffle();

    // Update dependents with the shuffled deck.
    // for (const card of this.drawPile) {
    //   this.sendMoveMessage({ cards: [card.name], from: BoardEntity.DrawPile, to: BoardEntity.DrawPile, msg: "shuffling" });
    // }
    // or
    this.sendMoveMessage({ cards: this.drawPile.cards.map(x => x.name), from: BoardEntity.DrawPile, to: BoardEntity.DrawPile, msg: "shuffling" });

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

        if (card === null)
          throw new Error("Cannot setup board. Not enough cards.");

        let column = this.tableau.columns[columnIndex];

        if (i !== ncol - 1) {
          column.nHidden += 1;
        }

        column.cards.addToTop(card);

        this.sendMoveMessage({ cards: [card.name], from: BoardEntity.DrawPile, to: BoardEntity.Tableau, toIndex: columnIndex, msg: "dealing" });
      }
    }
  }

  /**
   * Perform the draw step of solitaire.
   */
  drawStep() {
    const drawnCards = this.drawPile.take(this.drawRate);
    this.wastePile.addToTop(...drawnCards);
    this.sendMoveMessage({cards: drawnCards.map(x => x.name), from: BoardEntity.DrawPile, to: BoardEntity.WastePile, msg: "drawing" });
  }

  /**
   * Whether the win condition has been met.
   */
  won(): boolean {
    return this.foundations.full();
  }
}

export default SolitaireModel;