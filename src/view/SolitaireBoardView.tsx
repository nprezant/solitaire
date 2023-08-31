import BoardEntity from "../model/solitaire/BoardEntity";
import CardView from "./CardView";
import DrawPileView from "./DrawPileView";
import FoundationView from "./FoundationView";
import StackLocation from "../model/solitaire/StackLocation";
import TableauView from "./TableauView";
import WastePileView from "./WastePileView";
import { MoveData } from "../model/solitaire/MoveData";

/**
 * Service for managing the solitaire board.
 */
 class SolitaireBoardView {

  private x: number;
  private y: number;

  private cards: CardView[];

  private drawPile: DrawPileView;
  private wastePile: WastePileView;
  private tableau: TableauView;
  private foundation: FoundationView;

  constructor(x: number, y: number, cards: CardView[]) {
    this.x = x;
    this.y = y;
    this.cards = cards;

    this.drawPile = new DrawPileView(450, 100);
    this.wastePile = new WastePileView(350, 100);
    this.tableau = new TableauView(100, 300);
    this.foundation = new FoundationView(100, 200);
  }

  private getCard(name: string) {
    const filtered = this.cards.filter(x => x.cardName == name);
    if (filtered.length > 0) {
      return filtered[0];
    }
    return undefined;
  }

  handleCardsMoved(data: MoveData) {
    const nCards = data.cards.length;
    for (var i = 0; i < nCards; ++i) {
      this.moveOneCard(data);
      data.cards.shift(); // Shift 1st element to 0th position.
    }
  }

  moveOneCard(data: MoveData) {

    const card = this.getCard(data.cards[0])!
    switch (data.to) {
      case BoardEntity.DrawPile:
        this.drawPile.addCard(card, data.toLocation);
        break;
      case BoardEntity.WastePile:
        this.wastePile.addCard(card, data.toLocation);
        break;
      case BoardEntity.Tableau:
        this.tableau.addCard(card, data.toIndex);
        break;
      case BoardEntity.Foundation:
        this.foundation.addCard(card, data.toIndex);
        break;
      default:
        console.warn('no valid target entity found for ' + data.to);;
        break;
    }
  }
}

export default SolitaireBoardView;