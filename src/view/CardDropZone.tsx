import CardLocation from "../model/solitaire/CardLocation";

class CardDropZone extends Phaser.GameObjects.Zone {

  // Location on the board
  public location: CardLocation;

  constructor(scene: Phaser.Scene, location: CardLocation, x: number, y: number, width?: number, height?: number) {
    super(scene, x, y, width, height);
    scene.add.existing(this);

    this.location = location;
  }

  public bringToTop() {
    this.scene.children.bringToTop(this);
  }

  public didDragTo(x: number, y: number) {
    this.x = x;
    this.y = y;

    // TODO also update drag dependencies
  }
}

export default CardDropZone;