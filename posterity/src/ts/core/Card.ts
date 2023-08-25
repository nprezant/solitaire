import { Suit, Color, suitColor } from './Suit';

/**
 * A playing card.
 */
 class Card {
  _faceup: boolean;
  number: any;
  suit: any;
  color: Color;

  /**
   *
   * @param {number} number card number, 1-13
   */
  constructor(number: number, suit: Suit) {
    this.number = number;
    this.suit = suit;
    this.color = suitColor(suit);
    this._faceup = false;
  }

  /**
   * Flips the card from faceup to facedown
   * or facedown to faceup.
   */
  flip() {
    this._faceup = !this._faceup;
  }

  /**
   * True if the card is faceup
   */
  get faceup() {
    return this._faceup;
  }

  /**
   * Sets the card to faceup or facedown.
   */
  set faceup(value: boolean) {
    this._faceup = value;
  }

  /**
   * True if the card is facedown
   */
  get facedown() {
    return !this._faceup;
  }

  /**
   * Sets the card to faceup or facedown.
   */
  set facedown(value: boolean) {
    this._faceup = !value;
  }
}

export { Card }