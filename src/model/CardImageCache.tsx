import { Suit, SUIT_SIZE } from './solitaire/Suit';
import Card from './solitaire/Card';

/**
 * Manages card images (fronts and backs)
 */
 class CardImageCache {
  images: { [id: string] : HTMLImageElement; } = {};
  theme: string;

  constructor(theme: string) {
    this.theme = theme;
    this.load();
  }

  /**
   * Gets the image for a particular suite and number.
   */
  getImage(suit: string, number: number) {
    const imageName = this._generateImageName(suit, number);
    return this.images[imageName];
  }

  /**
   * Gets an image for a card.
   * Handles undefined and card orientation (faceup/facedown)
   */
  getCardImage(card: Card | undefined) {
    if (card === undefined) {
      return this.getBlank();
    }

    return this.getImage(card.suit, card.number);
  }

  /**
   * Gets the image for the back of a card.
   */
  getBack() {
    return this.images.back;
  }

  /**
   * Gets the image for a blank card (the lack of a card).
   */
  getBlank() {
    return this.images.blank;
  }

  /**
   * Generates the image name as stored on disk.
   */
  _generateImageName(_suit: string, number: number) {
    return 'hearts-' + number;
    // return suit + '-' + number // TODO uncomment when we have all the images
  }

  /**
   * Generates the path of an image in the current theme.
   * @param {string} name no extension
   */
  _generateImagePath(name: string) {
    return 'img/cards/' + this.theme + '/' + name + '.svg';
  }

  /**
   * Sets the image with a particular name to the current theme.
   * @param {string} name no extension
   */
  _setImage(name: string): void {
    if (this.images[name] === undefined) {
      this.images[name] = new Image();
    }

    const imagePath = this._generateImagePath(name);
    this.images[name].src = imagePath;
  }

  /**
   * Loads all images for the theme.
   */
  load() {
    // Special images
    this._setImage('back');
    this._setImage('blank');

    // Number value images
    for (const [suit] of Object.entries(Suit)) {
      for (let number = 1; number <= SUIT_SIZE; ++number) {
        const imageName = this._generateImageName(suit, number);
        this._setImage(imageName);
      }
    }
  }
}

const cardImages = new CardImageCache('simple');

export { cardImages }

