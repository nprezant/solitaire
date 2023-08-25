import { Card } from "./Card";
import { Deck } from "./Deck";

/**
 * A single column of the tableau.
 */
 class TableauColumn {
  cards = new Deck();

  /**
   * Whether or not a card can be played on this column
   * @param {Card} card card to test
   */
  isPlayable(card: Card) {
    const topCard = this.topCard();

    if (topCard === undefined) {
      if (card.number === 13) { // king
        return true;
      } else {
        return false;
      }
    }

    if (card.color !== topCard.color && card.number === topCard.number - 1) {
      return true;
    }

    return false;
  }

  /**
   * The topmost card in the column.
   * This card can either be moved or have the next lower number card
   * of the opposite color played on it.
   * @return {Card}
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

export { TableauColumn }