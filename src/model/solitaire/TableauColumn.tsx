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
   * Clears the cards from this column.
   */
  clear() {
    this.cards.clear();
  }
}

export default TableauColumn;