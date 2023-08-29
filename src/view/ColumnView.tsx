
import CardView from "./CardView";
import Point from "./Point";
import StackView from "./StackView";

class ColumnView extends StackView {
  
  protected positionOfNthCard(n: number): Point {
    const cardOffset = CardView.DisplayWidth / 3;
    return new Point(this.x, this.y + (this.cards.length * cardOffset));
  }
}

export default ColumnView;
