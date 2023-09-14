import CardView from "./CardView";
import PositionedView from "./PositionedView";
import StackLocation from "../model/solitaire/StackLocation";
import StackView from "./StackView";
import CardLocation from "../model/solitaire/CardLocation";
import { TweenConfig } from "../model/solitaire/TypeUtils";

 class FoundationView extends PositionedView {
   private stacks: StackView[];

   constructor(scene: Phaser.Scene, x: number, y: number) {
     super(x, y);

     this.stacks = [];
     for (var i = 0; i < 4; ++i) {
       const stack = new StackView(scene, x, y, CardLocation.foundation(i));
       this.stacks.push(stack);
       x += 80; // width of a card + margin
     }
   }

   addCard(card: CardView, tweenConfig?: TweenConfig) {
    let stackIndex = card.location.index ?? 0;
    card.stackLocation = StackLocation.Top;
     this.stacks[stackIndex].addCard(card, tweenConfig);
   }

   removeCard(card: CardView, tweenConfig?: TweenConfig) {
     for (var stack of this.stacks) {
       stack.removeCard(card, tweenConfig);
     }
   }
}

export default FoundationView;