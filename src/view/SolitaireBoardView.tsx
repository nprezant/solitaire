import BoardEntity from "../model/solitaire/BoardEntity";
import CardView from "./CardView";
import DrawPileView from "./DrawPileView";
import FoundationView from "./FoundationView";
import TableauView from "./TableauView";
import WastePileView from "./WastePileView";
import MoveData from "../model/solitaire/MoveData";
import StackLocation from "../model/solitaire/StackLocation";
import StackView from "./StackView";

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

  constructor(x: number, y: number, cards: CardView[], scene: Phaser.Scene) {
    this.x = x;
    this.y = y;
    this.cards = cards;

    this.drawPile = new DrawPileView(scene, 450, 100);
    this.wastePile = new WastePileView(scene, 350, 100);
    this.tableau = new TableauView(scene, 100, 300);
    this.foundation = new FoundationView(scene, 100, 200);
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

  public cardIsDragging(card: CardView) {
    // Card may have associated cards to be dragged alongside it
    if (card.parentEntity === BoardEntity.Tableau) {
      let dragAlongCards = this.tableau.cardsOnTopOf(card);
      card.dragAlongCards = dragAlongCards;
    }
    this.removeCardFromParentCollection(card);
  }

  public cardIsDoneDragging(card: CardView) {
    this.addCardToNewCollection(card);
  }

  private removeCardFromParentCollection(card: CardView) {
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
        console.warn('no valid target entity found for ' + card.parentEntity);;
        break;
    }
  }

  private addCardToNewCollection(card: CardView, toIndex?: number, toLocation?: StackLocation) {
    switch (card.parentEntity) {
      case BoardEntity.DrawPile:
        this.drawPile.addCard(card, toLocation);
        break;
      case BoardEntity.WastePile:
        this.wastePile.addCard(card, toLocation);
        break;
      case BoardEntity.Tableau:
        this.tableau.addCard(card, toIndex);
        break;
      case BoardEntity.Foundation:
        this.foundation.addCard(card, toIndex);
        break;
      default:
        console.warn('no valid target collection found for ' + card.parentEntity);;
        break;
    }
  }

  private moveOneCard(data: MoveData, cardIndex: number) {

    console.log('moving ' + data.cards[cardIndex] + ' from ' + data.from + ' to ' + data.to + ': ' + data.msg);

    const card = this.getCard(data.cards[cardIndex])!
    card.bringToTop();

    // Remove from exising collection
    this.removeCardFromParentCollection(card);

    // Add to new collection
    card.location = data.to;
    this.addCardToNewCollection(card, data.to.index, data.to.stackLocation);
  }
}

export default SolitaireBoardView;