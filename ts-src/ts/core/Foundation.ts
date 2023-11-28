import { Deck } from "./Deck";
import { Card } from "./Card";

/**
 * A single foundation.
 * In solitaire, a foundation is one of the piles at the top
 * that starts with an Ace and builds upwards.
 */
 class Foundation {
  cards = new Deck();

  /**
   * Whether or not a card is playable on this foundation.
   */
  isPlayable(card: Card) {
    const topCard = this.cards.peek();

    if (topCard === undefined) {
      if (card.number === 1) { // Ace
        return true;
      } else {
        return false;
      }
    }

    if (topCard.suit === card.suit && topCard.number === card.number - 1) {
      return true;
    }

    return false;
  }

  /**
   * Number of cards in the stack.
   * @return {number}
   */
  ncards(): number {
    return this.cards.length;
  }

  /**
   * The top (playable) card.
   */
  topCard(): Card | undefined {
    return this.cards.peek();
  }

  /**
   * Clears the cards from this foundation.
   */
  clear() {
    this.cards.clear();
  }
}

export { Foundation }