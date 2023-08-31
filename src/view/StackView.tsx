import { MoveDuration } from "./Animations";
import CardView from "./CardView";
import Point from "./Point";
import PositionedView from "./PositionedView";
import StackLocation from "../model/solitaire/StackLocation";

/**
 * Stack of cards.
 */
 class StackView extends PositionedView {

  protected cards: CardView[];
  protected repositionAfterAdd: boolean = false;

  constructor(x: number, y: number) {
    super(x, y);
    this.cards = [];
  }

  public addCard(card: CardView, location: StackLocation | undefined) {
    
    if (location === StackLocation.Top) {
      card.scene.children.bringToTop(card);
    }

    this.cards.push(card);

    if (this.repositionAfterAdd) {
      this.repositionAllCards();
    } else {
      this.repositionCard(this.cards.length - 1);
    }
  }

  public removeCard(card: CardView) {
    this.cards = this.cards.filter(x => x.cardName !== card.cardName); // Should this use another compare function?
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

  private repositionAllCards() {

    for (var i = 0; i < this.cards.length; ++i) {
      this.repositionCard(i);
    }

  }
}

export default StackView;