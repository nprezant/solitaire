import { MoveDuration } from "./Animations";
import CardView from "./CardView";
import Point from "./Point";
import PositionedView from "./PositionedView";
import StackLocation from "./StackLocation";

/**
 * Stack of cards.
 */
 class StackView extends PositionedView {

  addCard(card: CardView, location: StackLocation) {
    
    if (location === StackLocation.Top) {
      card.scene.children.bringToTop(card);
    }

    this.animateMove(card);
  }

  // Override this to change where the next card gets added to the stack
  protected nextPosition() {
    return new Point(this.x, this.y);
  }

  private animateMove(card: CardView) {
    const p = this.nextPosition();
    card.scene.tweens.add({
      targets: card,
      x: p.x,
      y: p.y,
      ease: 'cubic.out',
      delay: 1200,
      duration: MoveDuration,
    });
  }
}

export default StackView;