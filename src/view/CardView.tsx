import BoardEntity from "../model/solitaire/BoardEntity";

/**
 * A card that can flip and be dragged around.
 */
class CardView extends Phaser.GameObjects.Sprite {

  public static mmWidth = 59; // Official width in mm
  public static mmHeight = 89; // Official height in mm

  public static displayWidth: number = 48;
  public static displayHeight: number = this.displayWidth * this.mmHeight / this.mmWidth;

  private _parentEntity: BoardEntity | undefined;
  private _canBeMoved: boolean = false;

  public cardName: string;

  public get canBeMoved() {
    return this._canBeMoved;
  }

  public set canBeMoved(value: boolean) {
    if (this._canBeMoved === value) {
      return; // No change
    }
    this._canBeMoved = value;
    this.setInteractive({ draggable: this._canBeMoved });
  }

  public get parentEntity(): BoardEntity | undefined {
    return this._parentEntity;
  }

  public set parentEntity(value: BoardEntity | undefined) {
    this._parentEntity = value;
  }

  constructor(scene: Phaser.Scene, x: number, y: number, cardstexture: string | Phaser.Textures.Texture, frame?: string | number) {
    super(scene, x, y, cardstexture, frame);
    this.cardName = frame as string;
    this.setScale(CardView.displayWidth / this.width);
    scene.add.existing(this);
  }

  public bringToTop() {
    this.scene.children.bringToTop(this);
  }
}

export default CardView;