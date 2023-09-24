
import CardView from "./CardView";
import Point from "./Point";
import StackView from "./StackView";

class ColumnView extends StackView {
  
  protected positionOfNthCard(n: number): Point {
    const cardOffset = CardView.displayWidth / 3;
    return new Point(this.x, this.y + (n * cardOffset));
  }

  // Any card that isn't hidden can be viewed
  protected canDragNthCard(n: number): boolean {
    return this.cards[n].isFaceUp;
  }
}

export default ColumnView;
