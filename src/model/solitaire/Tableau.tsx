import Card from "./Card";
import CardAndPlace from "./CardAndPlace";
import CardLocation from "./CardLocation";
import TableauColumn from './TableauColumn'

/**
 * The tableau is where the 'solitaire' part of the game happens.
 * It takes up the majority of the board.
 * Cards are played downwards in alternating colors.
 */
 class Tableau {
  public static ncolumns = 7;

  /**
   * A playable column.
   */
  columns: TableauColumn[] = [];

  /**
   * Initializer
   */
  constructor() {
    for (let i = 0; i < Tableau.ncolumns; ++i) {
      this.columns.push(new TableauColumn());
    }
  }

  /**
   * Checks if a card is playable on a particular column
   */
  isPlayable(card: Card, n: integer): boolean {
    return this.columns[n].isPlayable(card);
  }

  /**
   * Checks which if any columns a card is playable on.
   * @param {Card} card card to test
   * @return {boolean[]} true/false mask of playable columns.
   */
  wherePlayable(card: Card): boolean[] {
    const playable = Array(this.columns.length).fill(false);

    for (const [i, column] of Object.entries(this.columns)) {
      playable[Number(i)] = column.isPlayable(card);
    }

    return playable;
  }

  /**
   * Checks if a card with `cardName` is visible in the tableau.
   */
  isCardVisible(cardName: string): boolean {
    for (const column of this.columns) {

      if (column.isCardVisible(cardName)) {
        return true;
      }

    }

    return false;
  }

  findCard(cardName: string): CardAndPlace | undefined {
    for (const [index, column] of this.columns.entries()) {

      let card = column.findCard(cardName);
      if (card !== undefined) {
        return new CardAndPlace(card, CardLocation.tableau(index));
      }

    }
    
    return undefined;
  }

  public isCardAllowedToMove(card: Card, index: number) {
    return this.columns[index].isCardAllowedToMove(card);
  }

  addToColumn(n?: integer, ...cards: Card[]) {
    this.columns[n ?? 0].cards.addToTop(...cards);
  }

  takeByName(names: string[]): Card[] {
    return this.columns.reduce((taken: Card[], column: TableauColumn): Card[] => {
      return taken.concat(column.takeByName(names));
    }, [] as Card[]);
  }

  /**
   * Clears the underlying columns
   */
  clear() {
    for (const column of this.columns) {
      column.clear();
    }
  }

  public fixOrientations(n: integer) {
    const fixedCard = this.columns[n]?.fixOrientations();

    if (fixedCard !== undefined) {
      return [fixedCard];
    }

    return [];
  }

  public fixAllOrientations(): Card[] {
    return this.columns.reduce((taken: Card[], column: TableauColumn): Card[] => {
      const fixedCard = column.fixOrientations();
      if (fixedCard !== undefined) {
        taken.push(fixedCard);
      }
      return taken;
    }, [] as Card[]);
  }
}

export default Tableau;