import { Suit, Color, suitColor } from './Suit';

/**
 * A playing card.
 */
 class Card {
  number: number;
  suit: Suit;
  color: Color;

  constructor(number: number, suit: Suit) {
    this.number = number;
    this.suit = suit;
    this.color = suitColor(suit);
  }

  public get name(): string {
    return this.suit + this.number;
  }
}

export default Card;