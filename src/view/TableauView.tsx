
import CardView from "./CardView";
import ColumnView from "./ColumnView";
import PositionedView from "./PositionedView";
import StackLocation from "./StackLocation";

 class TableauView extends PositionedView {
   private columns: ColumnView[];

   constructor(x: number, y: number) {
     super(x, y);

     this.columns = [];
     for (var i = 0; i < 5; ++i) {
       const column = new ColumnView(x, y);
       this.columns.push(column);
       x += 80; // width of a card + margin
     }
   }

   addCard(card: CardView, stackIndex: number) {
     this.columns[stackIndex].addCard(card, StackLocation.Top);
   }
}

export default TableauView;
