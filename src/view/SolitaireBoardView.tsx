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

  public handleCardsMoved(data: MoveData) {
    const nCards = data.cards.length;
    for (var i = 0; i < nCards; ++i) {
      this.moveOneCard(data, i);
    }
  }

  private moveOneCard(data: MoveData, cardIndex: number) {

    console.log('moving card ' + data.cards[cardIndex] + ' from ' + data.from + ' to ' + data.to + ': ' + data.msg);

    const card = this.getCard(data.cards[cardIndex])!
    card.bringToTop();

    // Remove from exising collection
    switch (card.parentEntity) {
      case BoardEntity.DrawPile:
        this.drawPile.removeCard(card);
        break;
      case BoardEntity.WastePile:
        this.wastePile.removeCard(card);
        break;
      case BoardEntity.Tableau:
        this.tableau.removeCard(card);
        break;
      case BoardEntity.Foundation:
        this.foundation.removeCard(card);
        break;
      default:
        console.warn('no valid target entity found for ' + data.to);;
        break;
    }

    // Add to new collection
    card.parentEntity = data.to;
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