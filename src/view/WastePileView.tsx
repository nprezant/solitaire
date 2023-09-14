import CardView from "./CardView";
import Point from "./Point";
import StackView from "./StackView";

 class WastePileView extends StackView {

  protected repositionAfterAdd: boolean = true;

  protected positionOfNthCard(n: number): Point {
    const len = this.cards.length;

    if (n > len - 4) {
      const cardOffset = CardView.displayWidth / 3;
      const nFromTop = 3 - (len - n);
      const x = this.x + (nFromTop * cardOffset);
      return new Point(x, this.y);
    }

    return new Point(this.x, this.y);
  }
}

export default WastePileView;