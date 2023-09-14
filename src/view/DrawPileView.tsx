import CardLocation from "../model/solitaire/CardLocation";
import StackView from "./StackView";

 class DrawPileView extends StackView {

   constructor(scene: Phaser.Scene, x: number, y: number) {
     super(scene, x, y, CardLocation.drawPile());
   }
   
}

export default DrawPileView;