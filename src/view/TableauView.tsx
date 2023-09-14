
import CardView from "./CardView";
import ColumnView from "./ColumnView";
import PositionedView from "./PositionedView";
import StackLocation from "../model/solitaire/StackLocation";
import CardLocation from "../model/solitaire/CardLocation";

 class TableauView extends PositionedView {
   private columns: ColumnView[];

   constructor(scene: Phaser.Scene, x: number, y: number) {
     super(x, y);

     this.columns = [];
     for (var i = 0; i < 5; ++i) {
       const column = new ColumnView(scene, x, y, CardLocation.tableau(i));
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

   cardsOnTopOf(card: CardView): CardView[] {
    for (var column of this.columns) {
      if (column.containsCard(card)) {
        return column.cardsOnTopOf(card);
      }
    }
    return [];
   }
}

export default TableauView;
