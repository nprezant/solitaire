import CardView from "./CardView";
import PositionedView from "./PositionedView";
import StackLocation from "./StackLocation";
import StackView from "./StackView";

 class FoundationView extends PositionedView {
   private stacks: StackView[];

   constructor(x: number, y: number) {
     super(x, y);

     this.stacks = [];
     for (var i = 0; i < 4; ++i) {
       const stack = new StackView(x, y);
       this.stacks.push(stack);
       x += 80; // width of a card + margin
     }
   }

   addCard(card: CardView, stackIndex: number) {
     this.stacks[stackIndex].addCard(card, StackLocation.Top);
   }
}

export default FoundationView;