
import CardView from "./CardView";
import ColumnView from "./ColumnView";
import PositionedView from "./PositionedView";
import StackLocation from "../model/solitaire/StackLocation";

 class TableauView extends PositionedView {
   private columns: ColumnView[];

   constructor(x: number, y: number, scene: Phaser.Scene) {
     super(x, y);

     this.columns = [];
     for (var i = 0; i < 5; ++i) {
       const column = new ColumnView(x, y, scene);
       this.columns.push(column);
       x += 80; // width of a card + margin
     }
   }

   addCard(card: CardView, stackIndex: number | undefined) {
     stackIndex ??= 0;
     this.columns[stackIndex].addCard(card, StackLocation.Top);
   }

   removeCard(card: CardView) {
     for (var column of this.columns) {
       column.removeCard(card);
     }
   }
}

export default TableauView;
