import CardLocation from "../model/solitaire/CardLocation";

class CardDropZone extends Phaser.GameObjects.Zone {

  public location: CardLocation;

  constructor(scene: Phaser.Scene, location: CardLocation, x: number, y: number, width?: number, height?: number) {
    super(scene, x, y, width, height);
    scene.add.existing(this);

    this.location = location;
  }
}

export default CardDropZone;