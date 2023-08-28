import BoardEntity from "./BoardEntity";
import CardView from "./CardView";
import DrawPileView from "./DrawPileView";
import FoundationView from "./FoundationView";
import StackLocation from "./StackLocation";
import TableauView from "./TableauView";
import WastePileView from "./WastePileView";

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

  drawCards(n: number) {

  }

  moveCard(card: string | CardView, toEntity: BoardEntity, index: number = 0, location: StackLocation = StackLocation.Top) {
    if (typeof card === 'string') {
      card = this.cards[0] // TODO get the card with the right name
    }
    switch (toEntity) {
      case BoardEntity.DrawPile:
        this.drawPile.addCard(card, location);
        break;
      case BoardEntity.WastePile:
        this.wastePile.addCard(card, location);
        break;
      case BoardEntity.Tableau:
        this.tableau.addCard(card, index);
        break;
      case BoardEntity.Foundation:
        this.foundation.addCard(card, index);
        break;
      default:
        console.warn('no valid target entity found for ' + toEntity);;
        break;
    }
  }
}

export default SolitaireBoardView;