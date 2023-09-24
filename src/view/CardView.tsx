import BoardEntity from "../model/solitaire/BoardEntity";
import CardLocation from "../model/solitaire/CardLocation";
import StackLocation from "../model/solitaire/StackLocation";
import { MembersOf } from "../model/solitaire/TypeUtils";
import EventLog from "./EventLog";

/**
 * A card that can flip and be dragged around.
 */
class CardView extends Phaser.GameObjects.Sprite {

  public static mmWidth = 59; // Official width in mm
  public static mmHeight = 89; // Official height in mm

  public static displayWidth: number = 48;
  public static displayHeight: number = this.displayWidth * this.mmHeight / this.mmWidth;

  // Location on the board
  private _location: CardLocation = new CardLocation({ loc: BoardEntity.None });

  // Whether or not this card can be moved
  private _canBeMoved: boolean = false;

  public isDragging: boolean = false;

  public cardName: string;

  public faceFrame: string | number;
  public backFrame: string | number;

  public isFaceUp: boolean = false;

  private eventLog: EventLog = new EventLog();

  private get currentFrame() {
    return this.isFaceUp ? this.faceFrame : this.backFrame;
  }

  private swapFrame() {
    this.setFrame(this.currentFrame);
  }

  public dragAlongCards: CardView[] = [];

  public get draggedCardNames(): string[] {
    return this.draggedCards.map(x => x.cardName);
  }

  public get draggedCards(): CardView[] {
    return [this as CardView].concat(this.dragAlongCards);
  }

  public dragDidEnd() {
    this.dragAlongCards.length = 0;
    this.isDragging = false;
  }

  public registerEvent(eventName: string) {
    this.eventLog.log(eventName);
  }

  public wasClicked(): boolean {
    return this.eventLog.wasClick();
  }

  public get canBeMoved() {
    return this._canBeMoved;
  }

  public set canBeMoved(value: boolean) {
    if (this._canBeMoved === value) {
      return; // No change
    }
    this._canBeMoved = value;
    this.scene.input.setDraggable(this, value);
  }

  public get parentEntity(): BoardEntity {
    return this._location.loc;
  }

  public get stackLocation(): StackLocation | undefined {
    return this._location.stackLocation;
  }

  public set stackLocation(value: StackLocation | undefined) {
    this._location.stackLocation = value;
  }

  public set parentEntity(value: BoardEntity) {
    this._location.loc = value;
    this._location.stackLocation = undefined;
    this._location.index = undefined;
  }

  public set parentEntityIndex(value: integer | undefined) {
    this._location.index = value;
  }

  public get parentEntityIndex() {
    return this._location.index;
  }

  public get location(): CardLocation {
    return this._location;
  }

  public set location(value: Partial<CardLocation>) {
    Object.assign(this._location, value);
  }

  constructor(scene: Phaser.Scene, x: number, y: number, cardstexture: string | Phaser.Textures.Texture, frame: string | number) {
    super(scene, x, y, cardstexture, frame);
    this.cardName = frame as string;
    this.faceFrame = frame;
    this.backFrame = 'back';
    this.setScale(CardView.displayWidth / this.width);
    this.setInteractive();
    scene.add.existing(this);
  }

  public bringToTop() {
    this.scene.children.bringToTop(this);
  }

  public didDragTo(x: number, y: number) {

    let deltaX = x - this.x;
    let deltaY = y - this.y;

    this.x = x;
    this.y = y;

    for (const additionalCard of this.dragAlongCards) {
      additionalCard.x += deltaX;
      additionalCard.y += deltaY;
    }
  }

  public flipIfNeeded() {
    if (this.frame.name !== this.currentFrame) {
      this.flip();
    }
  }

  private flip() {
    const originalScaleX = this.scaleX;

    this.scene.tweens.chain({
      targets: this,
      tweens: [
        {
          scaleX: 0.01,
          ease: 'power2',
          duration: 100,
        },
        {
          onActive: () => { this.swapFrame(); },
          duration: 0,
        },
        {
          scaleX: originalScaleX,
          ease: 'power1',
          duration: 100,
        },
      ]
    })
  }
}

export default CardView;