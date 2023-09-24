import { MoveDuration } from "./Animations";
import CardView from "./CardView";
import Point from "./Point";
import PositionedView from "./PositionedView";
import StackLocation from "../model/solitaire/StackLocation";
import CardDropZone from "./CardDropZone";
import CardLocation from "../model/solitaire/CardLocation";
import { TweenConfig } from "../model/solitaire/TypeUtils";

/**
 * Stack of cards.
 */
 class StackView extends PositionedView {

  protected cards: CardView[];
  protected repositionAfterAdd: boolean = false;
  protected dropZone: CardDropZone;

  constructor(scene: Phaser.Scene, x: number, y: number, location: CardLocation) {
    super(x, y);
    this.cards = [];
    this.dropZone = new CardDropZone(scene, location, x, y, CardView.displayWidth, CardView.displayHeight);
    this.dropZone.setInteractive({ dropZone: true });
  }

  public addCard(card: CardView, tweenConfig?: TweenConfig) {
    
    if (card.stackLocation === StackLocation.Top) {
      card.bringToTop();
    }

    this.cards.push(card);

    card.flipIfNeeded();

    if (this.repositionAfterAdd) {
      this.repositionAllCards(tweenConfig);
    } else {
      this.repositionCard(this.cards.length - 1, tweenConfig);
      this.repositionDropZone();
    }
  }

  public removeCard(card: CardView, tweenConfig?: TweenConfig) {
    let preFilterLength = this.cards.length;
    let isAtEnd = card === this.cards[this.cards.length - 1];
    this.cards = this.cards.filter(x => x.cardName !== card.cardName);

    if (preFilterLength === this.cards.length) {
      return; // Nothing happened
    }

    if (!isAtEnd) {
      this.repositionAllCards(tweenConfig); // A card was removed from the middle
    } else {
      this.repositionDropZone();
    }
  }

  public containsCard(card: CardView) {
    return this.cards.indexOf(card) !== -1;
  }

  public cardsOnTopOf(card: CardView): CardView[] {
    let index = this.cards.indexOf(card);
    if (index === -1) { return []; }

    return this.cards.slice(index + 1);
  }

  // Override this to change where the next card gets added to the stack
  // n is counted from the bottom of the stack
  protected positionOfNthCard(n: number) {
    return new Point(this.x, this.y);
  }

  // Override this to allow cards in certain positions to be dragged
  protected canDragNthCard(n: number) {
    return false;
  }

  private repositionCard(index: number, tweenConfig?: TweenConfig) {

    const p = this.positionOfNthCard(index);
    const card = this.cards[index];

    card.canBeMoved = this.canDragNthCard(index);

    let fullTweenConfig = {
      targets: card,
      x: p.x,
      y: p.y,
      ease: 'cubic.out',
      duration: MoveDuration,
    };

    if (tweenConfig !== undefined) {
      Object.assign(fullTweenConfig, tweenConfig);
    }

    card.scene.tweens.add(fullTweenConfig);
  }

  // Where the next card would go.
  private dropPoint() {
    return this.positionOfNthCard(this.cards.length);
  }

  private repositionDropZone() {
    const p = this.dropPoint();
    this.dropZone.x = p.x;
    this.dropZone.y = p.y;
  }

  private repositionAllCards(tweenConfig?: TweenConfig) {

    for (var i = 0; i < this.cards.length; ++i) {
      this.repositionCard(i, tweenConfig);
    }

    this.repositionDropZone();

  }
}

export default StackView;