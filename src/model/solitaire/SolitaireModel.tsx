import Stack from './Stack'
import Foundations from './Foundations'
import Tableau from './Tableau'
import BoardEntity from './BoardEntity';
import MoveData from './MoveData';
import { MembersOf } from './TypeUtils';
import CardLocation from './CardLocation';

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

  private sendMoveMessage(data: MembersOf<MoveData>) {
    this.moveHook(new MoveData(data));
  }

  /**
   * This card was moved externally so we need to validate that change
   * in the model
   */
  public handleCardWasMovedByHand(data_: MembersOf<MoveData>) {
    let data = new MoveData(data_);

    let accept = () => this.acceptHandMove(data);
    let reject = () => this.rejectHandMove(data);

    let movingTo = data.to?.loc;
    if (movingTo === undefined) { reject(); }

    let movingFrom = data.from?.loc;

    switch (movingTo) {
      case BoardEntity.DrawPile:
      case BoardEntity.WastePile:
        // Only valid if this is undoing the last move
        console.warn('moving to draw/waste piles by hand is undo-ing; not yet supported');
        reject();
        break;
      case BoardEntity.Tableau:
        // Maybe valid.
        // Can generally move within tableau
        // Can move from top of waste to tableau
        // Can move from foundation to tableau if undo-ing

        if (movingFrom === undefined) {
          // Idk if this would happen
          accept();
          break;
        }

        switch (movingFrom) {
          case BoardEntity.DrawPile:
            reject();
            break;
          case BoardEntity.WastePile:
            // todo check if it's we're at the top of the waste pile
            accept();
            break;
          case BoardEntity.Foundation:
            // todo check if the colors/numbers are okay
            accept();
            break;
          case BoardEntity.Tableau:
            // todo check if the colors/numbers are okay
            accept();
            break;
          default:
            reject();
        }
        break;
      case BoardEntity.Foundation:
        // Maybe valid.
        // Can move tableau to foundation.
        // Can move top of waste to foundation
        // Otherwise, maybe if undoing
        console.warn('lol what does progressing the game even mean');
        accept();
        break;
      default:
        reject();
    }
  }

  private acceptHandMove(data: MoveData) {
    console.log('accepted move');
    this.sendMoveMessage(data);
  }

  private rejectHandMove(data: MoveData) {
    // Cancel the move by sending it back where it came from.
    console.log('rejected move');
    let rejectedData = new MoveData(data);
    rejectedData.to = rejectedData.from;
    rejectedData.from = { loc: BoardEntity.None };
    this.sendMoveMessage(rejectedData);
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
    this.sendMoveMessage({ cards: this.drawPile.cards.map(x => x.name), from: CardLocation.drawPile(), to: CardLocation.drawPile(), msg: "shuffling" });

    // Waste pile
    this.wastePile.clear();

    // Foundations
    this.foundations.clear();

    // Tableau
    this.tableau.clear();
    const nColumns = this.tableau.columns.length;
    const nRows = nColumns; // Max length of rows out of all columns.

    for (let nrow = 0; nrow < nRows; ++nrow) {
      for (let ncol = 0; ncol < nColumns; ++ncol) { // Columns

        const nCardsInColumn = ncol + 1;

        if (nrow < nCardsInColumn) {
          const card = this.drawPile.take()[0];
  
          if (card === null)
            throw new Error("Cannot setup board. Not enough cards.");
  
          let column = this.tableau.columns[ncol];
  
          if (nrow !== nCardsInColumn - 1) {
            column.nHidden += 1;
          }
  
          column.cards.addToTop(card);
  
          this.sendMoveMessage({ cards: [card.name], from: CardLocation.drawPile(), to: CardLocation.tableau(ncol), msg: "dealing" });
        }
      }
    }
  }

  /**
   * Perform the draw step of solitaire.
   */
  drawStep() {
    const drawnCards = this.drawPile.take(this.drawRate);
    this.wastePile.addToTop(...drawnCards);
    this.sendMoveMessage({cards: drawnCards.map(x => x.name), from: CardLocation.drawPile(), to: CardLocation.wastePile(), msg: "drawing" });
  }

  /**
   * Resets the waste pile when there are no cards left to draw.
   */
  resetWastePile() {
    if (!this.drawPile.empty()) { return; }
    const wasteCards = this.wastePile.takeAll();
    this.drawPile.addToTop(...wasteCards);
    this.sendMoveMessage({cards: wasteCards.map(x => x.name), from: CardLocation.wastePile(), to: CardLocation.drawPile(), msg: "resetting waste" });
  }

  /**
   * Whether the win condition has been met.
   */
  won(): boolean {
    return this.foundations.full();
  }
}

export default SolitaireModel;