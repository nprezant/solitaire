import Card from "./Card";
import Stack from "./Stack";
import { FaceCard } from "./Suit"

/**
 * A single column of the tableau.
 */
 class TableauColumn {
  cards = new Stack();
  nHidden = 0; // Some number of the cards at the bottom start out facedown.

  /**
   * Whether or not a card can be played on this column
   */
  isPlayable(card: Card) {
    const topCard = this.topCard();

    // Only kings are playable on an empty stack
    if (topCard === undefined) {
      if (card.number === FaceCard.King) {
        return true;
      } else {
        return false;
      }
    }

    // Cards are playable if they are the opposite color and one less in value.
    if (card.color !== topCard.color && card.number === topCard.number - 1) {
      return true;
    }

    return false;
  }

  /**
   * The topmost card in the column.
   * This card can either be moved or have the next lower number card
   * of the opposite color played on it.
   */
  topCard(): Card | undefined {
    return this.cards.peek();
  }

  /**
   * Checks if a card with `cardName` is visible in the column.
   */
  isCardVisible(cardName: string): boolean {
    for (let i = this.nHidden; i < this.cards.length; ++i) {

      if (this.cards.at(i)?.name === cardName) {
        return true;
      }

    }

    return false;
  }

  findCard(cardName: string): Card | undefined {

    return this.cards.findCard(cardName);
    
  }

  public takeByName(names: string[]): Card[] {
    return this.cards.takeByName(names);
  }

  public cardsOnTopOf(card: Card): Card[] {
    return this.cards.cardsOnTopOf(card);
  }

  /**
   * Clears the cards from this column.
   */
  clear() {
    this.cards.clear();
  }

  /**
   * Fixes the number of hidden cards to reveal the top one if necessary.
   * Returns the card revealed, or undefined if nothing changed.
   */
  fixOrientations(): Card | undefined {
    if (this.nHidden < this.cards.length) {
      return; // All is well, at least one card is visible.
    }

    this.nHidden = this.cards.length - 1;
    return this.cards.peek();
  }
}

export default TableauColumn;