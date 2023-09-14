import { MoveDuration } from "./Animations";
import CardView from "./CardView";
import Point from "./Point";
import PositionedView from "./PositionedView";
import StackLocation from "../model/solitaire/StackLocation";
import CardDropZone from "./CardDropZone";
import CardLocation from "../model/solitaire/CardLocation";

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

  public addCard(card: CardView, location: StackLocation | undefined) {
    
    if (location === StackLocation.Top) {
      card.bringToTop();
    }

    this.cards.push(card);

    if (this.repositionAfterAdd) {
      this.repositionAllCards();
    } else {
      this.repositionCard(this.cards.length - 1);
      this.repositionDropZone();
    }
  }

  public removeCard(card: CardView) {
    let preFilterLength = this.cards.length;
    this.cards = this.cards.filter(x => x.cardName !== card.cardName); // Should this use another compare function?

    if (preFilterLength !== this.cards.length) {
      this.repositionAllCards(); // A card was removed
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

  private repositionCard(index: number) {

    const p = this.positionOfNthCard(index);
    const card = this.cards[index];

    card.scene.tweens.add({
      targets: card,
      x: p.x,
      y: p.y,
      ease: 'cubic.out',
      duration: MoveDuration,
    });
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

  private repositionAllCards() {

    for (var i = 0; i < this.cards.length; ++i) {
      this.repositionCard(i);
    }

    this.repositionDropZone();

  }
}

export default StackView;