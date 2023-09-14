import BoardEntity from './BoardEntity';
import StackLocation from './StackLocation';
import { MembersOf } from './TypeUtils';

// A card's location on the board
class CardLocation {
  public loc!: BoardEntity;
  public index?: integer;
  public stackLocation?: StackLocation;

  constructor(data: MembersOf<CardLocation>) {
    Object.assign(this, data);
  }

  public toString() {
    let s = BoardEntity[this.loc]; // reverse mapping
    if (this.index !== undefined) {
      s += '.' + this.index;
    }
    if (this.stackLocation !== undefined) {
      s += '.' + StackLocation[this.stackLocation]; // reverse mapping
    }
    return s;
  }

  public static none() {
    return new CardLocation({ loc : BoardEntity.None });
  }

  public static drawPile() {
    return new CardLocation({ loc: BoardEntity.DrawPile });
  }

  public static wastePile() {
    return new CardLocation({ loc: BoardEntity.WastePile });
  }

  public static tableau(index: integer = 0) {
    return new CardLocation({ loc: BoardEntity.Tableau, index: index });
  }

  public static foundation(index: integer = 0) {
    return new CardLocation({ loc: BoardEntity.Foundation, index: index });
  }
}

export default CardLocation;
