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
}

export default Card;