import { Foundation } from "./Foundation";
import { Card } from "./Card";
import { Suit, SUIT_SIZE } from "./Suit";

/**
 * The set of foundations (one for each suit)
 * At the top of the game board.
 */
 class Foundations {
  /**
   * A foundation for each suit.
   */
  foundations: Foundation[] = [];

  /**
   * Initializer.
   */
  constructor() {
    for (const [,] of Object.entries(Suit)) {
      this.foundations.push(new Foundation());
    }
  }

  /**
   * Checks which if any foundations this card can be played on.
   * @param {Card} card card to test
   * @return {boolean[]} true/false mask of playable foundations.
   */
  isPlayable(card: Card): boolean[] {
    const playable: boolean[] = Array(this.foundations.length).fill(false);

    for (const [i, foundation] of Object.entries(this.foundations)) {
      playable[Number(i)] = foundation.isPlayable(card);
    }

    return playable;
  }

  /**
   * Tests whether the foundations are full.
   * @return {boolean} true if the foundations are full.
   */
  full(): boolean {
    for (const [, foundation] of Object.entries(this.foundations)) {
      if (foundation.ncards() !== SUIT_SIZE) {
        return false;
      }
    }
    return true;
  }

  /**
   * Clears the underlying foundations.
   */
  clear() {
    for (const foundation of this.foundations) {
      foundation.clear();
    }
  }
}

export { Foundations }