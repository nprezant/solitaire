import StackView from "./StackView";

class FoundationStackView extends StackView {

  // Only the top card can be dragged
  protected canDragNthCard(n: number): boolean {
    return (n === this.cards.length - 1);
  }

}

export default FoundationStackView;