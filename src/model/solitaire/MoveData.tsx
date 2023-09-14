import BoardEntity from './BoardEntity';
import CardLocation from './CardLocation';
import { MembersOf, TweenConfig } from './TypeUtils';

class MoveData {
  public cards!: string[]; // Cards to move
  public from!: CardLocation; // Where the card is/was
  public to!: CardLocation; // Where the card is heading
  public msg?: string; // Why it is moving
  public tweenConfig?: TweenConfig; // Specific configuration for this movement

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
