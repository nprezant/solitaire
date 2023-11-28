import { shuffleArray } from './algorithm';
import { Suit, SUIT_SIZE } from './Suit';
import { Card } from './Card';

/**
 * A deck of cards.
 * Or a stack of cards.
 * Supports adding, removing, peeking, shuffling.
 */
 class Deck {
  cards: Card[] = [];

  /**
   * Static constructor for a full deck of 52 cards.
   * Unshuffled.
   */
  static full() {
    const deck = new Deck();
    deck.fill();
    return deck;
  }

  /**
   * Fills (or refills) the deck with 52 unshuffled cards.
   */
  fill() {
    this.clear();
    for (const [key, value] of Object.entries(Suit)) {
      for (let number = 1; number <= SUIT_SIZE; number++) {
        this.addToBottom(new Card(number, value));
      }
    }
  }

  /**
   * Removes all cards from the deck
   */
  clear() {
    this.cards.length = 0;
  }

  /**
   * Convenience iterator
   */
  [Symbol.iterator]() {
    return this.cards.values();
  }

  /**
   * Shuffles the deck.
   */
  shuffle() {
    shuffleArray(this.cards);
  }

  /**
   * Returns the top card.
   * Does not modify the deck.
   * Undefined if there are no cards.
   * @return {Card}
   */
  peek(): Card | undefined {
    return this.cards[0];
  }

  /**
   * Takes cards from the top of the deck.
   * @return {Card[]} cards taken out of this deck
   */
  take(nCards = 1): Card[] {
    const taken = [];

    for (let i = 0; i < nCards; ++i) {
      const took = this.cards.shift();
      if (took) { // When we run out of cards we will get undefined values.
        taken.push(took);
      }
    }

    return taken;
  }

  /**
   * Add cards to the bottom of the deck.
   */
  addToBottom(...cards: Card[]) {
    this.cards.push(...cards);
  }

  /**
   * Add cards to the top of the deck.
   */
  addToTop(...cards: Card[]) {
    this.cards.unshift(...cards);
  }

  /**
   * True if there are no cards in the deck.
   */
  empty() {
    return this.cards.length === 0;
  }

  /**
   * Number of cards in this deck.
   */
  get length() {
    return this.cards.length;
  }

  /**
   * Allows access to individual cards.
   * @param {number} index between 0 and length
   */
  at(index: number): Card | undefined {
    return this.cards[index];
  }
}

export { Deck }