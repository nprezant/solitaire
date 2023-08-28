
import CardView from "./CardView";
import Point from "./Point";
import StackLocation from "./StackLocation";
import StackView from "./StackView";

class ColumnView extends StackView {
  
  private nCards: number;
  
  constructor(x: number, y: number) {
    super(x, y);
    this.nCards = 0;
  }

  addCard(card: CardView, location: StackLocation): void {
    super.addCard(card, location);  
    this.nCards += 1;
  }
  
  protected nextPosition(): Point {
    const cardOffset = CardView.DisplayWidth / 3;
    return new Point(this.x, this.y + (this.nCards * cardOffset));
  }
}

export default ColumnView;
