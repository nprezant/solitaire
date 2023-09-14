import BoardEntity from './BoardEntity';
import CardLocation from './CardLocation';
import { MembersOf } from './TypeUtils';

class MoveData {
  public cards!: string[];
  public from!: CardLocation;
  public to!: CardLocation;
  public msg?: string;

  constructor(data: MembersOf<MoveData>) {
    Object.assign(this, data);
  }

  method() { }
}

export default MoveData;

// Example usage
// const item = new MoveData({ });  // card is required
// const item1 = new MoveData({ cards: ["a"] });  // others fields are not
// const item2 = new MoveData({ card: "b", method() {}  }); // error method is not allowed 
