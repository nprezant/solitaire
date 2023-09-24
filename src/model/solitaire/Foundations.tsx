import Foundation from "./Foundation";
import Card from "./Card";
import { Suit, SUIT_SIZE } from "./Suit";
import CardAndPlace from "./CardAndPlace";
import CardLocation from "./CardLocation";

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
   * Checks if a card is playable on a particular foundation
   */
  isPlayable(card: Card, n: integer): boolean {
    return this.foundations[n].isPlayable(card);
  }

  /**
   * Checks which if any foundations this card can be played on.
   * @param {Card} card card to test
   * @return {boolean[]} true/false mask of playable foundations.
   */
  wherePlayable(card: Card): boolean[] {
    const playable: boolean[] = Array(this.foundations.length).fill(false);

    for (const [i, foundation] of Object.entries(this.foundations)) {
      playable[Number(i)] = foundation.isPlayable(card);
    }

    return playable;
  }

  /**
   * Checks if any of the foundations is topped by a particular card.
   */
  isCardOnTop(cardName: string): boolean {
    for (const foundation of this.foundations) {
      if (cardName === foundation.cards.peek()?.name) {
        return true;
      }
    }

    return false;
  }

  findCard(cardName: string): CardAndPlace | undefined {
    for (const [index, foundation] of this.foundations.entries()) {
      
      let card = foundation.findCard(cardName);
      if (card !== undefined) {
        return new CardAndPlace(card, CardLocation.foundation(index));
      }

    }

    return undefined;
  }

  public isCardAllowedToMove(card: Card, index: number) {
    return this.foundations[index].isCardAllowedToMove(card);
  }


  addToFoundation(n?: integer, ...cards: Card[]) {
    this.foundations[n ?? 0].cards.addToTop(...cards);
  }

  takeByName(names: string[]): Card[] {
    return this.foundations.reduce((taken: Card[], foundation: Foundation): Card[] => {
      return taken.concat(foundation.takeByName(names));
    }, [] as Card[]);
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

export default Foundations;