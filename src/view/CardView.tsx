import BoardEntity from "./BoardEntity";

/**
 * A card that can flip and be dragged around.
 */
class CardView extends Phaser.GameObjects.Sprite {

  public static DisplayWidth: number = 48;

  private _parentEntity: BoardEntity | undefined;
  private _canBeMoved: boolean = false;

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
    this.setScale(CardView.DisplayWidth / this.width);
    scene.add.existing(this);
  }
}

export default CardView;