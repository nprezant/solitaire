import Card from "./Card";
import TableauColumn from './TableauColumn'

/**
 * The tableau is where the 'solitaire' part of the game happens.
 * It takes up the majority of the board.
 * Cards are played downwards in alternating colors.
 */
 class Tableau {
  ncolumns = 5;

  /**
   * A playable column.
   */
  columns: TableauColumn[] = [];

  /**
   * Initializer
   */
  constructor() {
    for (let i = 0; i < this.ncolumns; ++i) {
      this.columns.push(new TableauColumn());
    }
  }

  /**
   * Checks which if any columns a card is playable on.
   * @param {Card} card card to test
   * @return {boolean[]} true/false mask of playable columns.
   */
  isPlayable(card: Card): boolean[] {
    const playable = Array(this.columns.length).fill(false);

    for (const [i, column] of Object.entries(this.columns)) {
      playable[Number(i)] = column.isPlayable(card);
    }

    return playable;
  }

  /**
   * Clears the underlying columns
   */
  clear() {
    for (const column of this.columns) {
      column.clear();
    }
  }
}

export default Tableau;