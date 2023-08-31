import BoardEntity from './BoardEntity';
import StackLocation from './StackLocation';

// https://stackoverflow.com/questions/49061774/how-to-build-a-typescript-class-constructor-with-object-defining-class-fields
type NonMethodKeys<T> = {[P in keyof T]: T[P] extends Function ? never : P }[keyof T];  
export type WithoutMethods<T> = Pick<T, NonMethodKeys<T>>; 

export class MoveData {
  public cards!: string[];
  public from?: BoardEntity;
  public to?: BoardEntity;
  public toIndex?: number;
  public toLocation?: StackLocation;
  public msg?: string;

  constructor(data: WithoutMethods<MoveData>) {
    Object.assign(this, data);
  }

  method() { }
}

// Example usage
// const item = new MoveData({ });  // card is required
// const item1 = new MoveData({ cards: ["a"] });  // others fields are not
// const item2 = new MoveData({ card: "b", method() {}  }); // error method is not allowed 
