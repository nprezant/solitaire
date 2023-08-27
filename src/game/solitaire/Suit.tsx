
const SUIT_SIZE = 13; // 13 cards per suit

enum Suit {
  Spades = "spades",
  Hearts = "hearts",
  Clubs = "clubs",
  Diamonds = "diamonds",
}

enum Color {
  Red,
  Black,
}

/**
 * Gets the color of a suite.
 */
 function suitColor(suit: Suit) {
  if (suit === Suit.Spades || suit === Suit.Clubs) {
    return Color.Black;
  }
  return Color.Red;
}

enum FaceCard {
  Jack = 11,
  Queen = 12,
  King = 13,
}

export { SUIT_SIZE, Suit, Color, suitColor, FaceCard }