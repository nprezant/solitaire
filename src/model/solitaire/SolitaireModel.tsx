import Stack from './Stack'
import Foundations from './Foundations'
import Tableau from './Tableau'
import BoardEntity from './BoardEntity';
import MoveData from './MoveData';
import { MembersOf } from './TypeUtils';
import CardLocation from './CardLocation';
import Card from './Card';
import SimpleEvent from './SimpleEvent';
import StackLocation from './StackLocation';
import CardAndPlace from './CardAndPlace';

/**
 * The main solitaire game.
 */
 class SolitaireModel {
  drawRate: any;
  drawPile: Stack;
  wastePile: Stack;
  foundations: Foundations;
  tableau: Tableau;

  constructor(drawRate: number) {
    this.drawRate = drawRate;

    this.drawPile = new Stack();
    this.wastePile = new Stack(); // Cards
    this.foundations = new Foundations(); // Where the aces stack upwards
    this.tableau = new Tableau(); // Where you play solitaire
  }

  // The move hook is called whenever the solitaire model moves a card.
  public moveHook: (data: MoveData) => void = () => { };

  private sendMoveMessage(data: MembersOf<MoveData>) {
    this.moveHook(new MoveData(data));
  }

  /**
   * This card was moved externally so we need to validate that change
   * in the model
   */
  public handleCardWasMovedByHand(data_: MembersOf<MoveData>) {
    let data = new MoveData(data_);

    let e = new SimpleEvent(
      () => { this.acceptHandMove(data) },
      () => { this.rejectHandMove(data) }
    );

    let movingTo = data.to?.loc;
    if (movingTo === undefined) { e.reject(); }

    let cardName = data.cards[0];
    if (cardName === undefined) { e.reject(); }

    let cardAndPlace = this.findCard(cardName);
    if (cardAndPlace === undefined) {
      console.error('Could not find card ' + cardName + ' in deck.');
      e.reject();
    }

    if (e.resolved) { return; }
    const card = cardAndPlace!.card; // If we have not resolved, card must not be undefined

    let movingFrom = data.from?.loc;

    // First, check where we are moving from. Some easy rejections here.
    switch (movingFrom) {
      case BoardEntity.DrawPile:
        // Cannot move from the draw pile.
        e.reject();
        break;
      case BoardEntity.WastePile:
        // Can only move from the top of the waste pile.
        if (card !== this.wastePile.peek()) {
          e.reject();
        }
        break;
      case BoardEntity.Foundation:
        // Can only move from the top of a foundation.
        if (!this.foundations.isCardOnTop(card.name)) {
          e.reject();
        }
        break;
      case BoardEntity.Tableau:
        // Can move any _visible_ card in the tableau
        if (!this.tableau.isCardVisible(card.name)) {
          e.reject();
        }
        break;
      default:
        e.reject();
    }

    if (e.resolved) { return; }

    // Now, the fun part, is it okay to be moving to where we want?
    switch (movingTo) {
      case BoardEntity.DrawPile:
      case BoardEntity.WastePile:
        // Only valid if this is undoing the last move
        console.warn('moving to draw/waste piles by hand is undo-ing; not yet supported');
        e.reject();
        break;
      case BoardEntity.Tableau:
        // Valid if it's allowed by the game rules.
        if (this.tableau.isPlayable(card, data.to?.index ?? 0)) {
          e.accept();
        }
        break;
      case BoardEntity.Foundation:
        // Valid if it's allowed by the game rules.
        if (this.foundations.isPlayable(card, data.to?.index ?? 0)) {
          e.accept();
        }
        break;
      default:
        e.reject();
    }

    if (!e.resolved) {
      e.reject();
    }
  }

  private acceptHandMove(data: MoveData) {
    this.performMove(data);
    this.sendMoveMessage(data);
  }

  private acceptAutoMove(data: MoveData) {
    this.performMove(data);
    this.sendMoveMessage(data);
  }

  private rejectHandMove(data: MoveData) {
    // Cancel the move by sending it back where it came from.
    let rejectedData = new MoveData(data);

    rejectedData.msg ??= '';
    rejectedData.msg += ' (rejected move to ' + data.to + ')';
    rejectedData.to = rejectedData.from;
    rejectedData.from = CardLocation.none();

    this.sendMoveMessage(rejectedData);
  }

  private performMove(data: MoveData) {
    var names = data.cards; // Card names
    var cards: Card[];

    switch (data.from?.loc) {
      case BoardEntity.DrawPile:
        cards = this.drawPile.takeByName(names);
        break;
      case BoardEntity.WastePile:
        cards = this.wastePile.takeByName(names);
        break;
      case BoardEntity.Foundation:
        cards = this.foundations.takeByName(names);
        break;
      case BoardEntity.Tableau:
        cards = this.tableau.takeByName(names);
        break;
      default:
        console.error('Cannot perform move from location ' + data.from);
        return;
    }

    switch (data.to?.loc) {
      case BoardEntity.DrawPile:
        this.drawPile.add(data.to.stackLocation, ...cards);
        break;
      case BoardEntity.WastePile:
        this.wastePile.add(data.to.stackLocation, ...cards);
        break;
      case BoardEntity.Tableau:
        this.tableau.addToColumn(data.to.index, ...cards);
        break;
      case BoardEntity.Foundation:
        this.foundations.addToFoundation(data.to.index, ...cards);
        break;
      default:
        console.error('Cannot perform move to location ' + data.to);
        return;
    }
  }

  private findCard(cardName: string): CardAndPlace | undefined {
    var card: Card | undefined;

    card = this.drawPile.findCard(cardName);
    if (card !== undefined) { return new CardAndPlace(card, CardLocation.drawPile()); }

    card = this.wastePile.findCard(cardName);
    if (card !== undefined) { return new CardAndPlace(card, CardLocation.wastePile()); }

    let tableauCard = this.tableau.findCard(cardName);
    if (tableauCard !== undefined) { return tableauCard; }

    let foundationCard = this.foundations.findCard(cardName);
    if (foundationCard !== undefined) { return foundationCard; }
    
    return undefined;
  }

  setup() {
    // Draw pile
    this.drawPile.fillDeck();
    this.drawPile.shuffle();

    // Update dependents with the shuffled deck.
    this.sendMoveMessage({
      cards: this.drawPile.cards.map(x => x.name),
      from: CardLocation.drawPile(),
      to: CardLocation.drawPile(),
      msg: "shuffling"
    });

    // Waste pile
    this.wastePile.clear();

    // Foundations
    this.foundations.clear();

    // Tableau
    this.tableau.clear();
    const nColumns = this.tableau.columns.length;
    const nRows = nColumns; // Max length of rows out of all columns.

    for (let nrow = 0; nrow < nRows; ++nrow) {
      for (let ncol = 0; ncol < nColumns; ++ncol) { // Columns

        const nCardsInColumn = ncol + 1;

        if (nrow < nCardsInColumn) {
          const card = this.drawPile.take()[0];
  
          if (card === null)
            throw new Error("Cannot setup board. Not enough cards.");
  
          let column = this.tableau.columns[ncol];

          let shouldFlip = false;
  
          if (nrow !== nCardsInColumn - 1) {
            column.nHidden += 1;
          } else {
            shouldFlip = true;
          }
  
          column.cards.addToTop(card);
  
          this.sendMoveMessage({ cards: [card.name], from: CardLocation.drawPile(), to: CardLocation.tableau(ncol), flip: shouldFlip, msg: "dealing" });
        }
      }
    }
  }

  /**
   * Perform the draw step of solitaire.
   */
  drawStep() {
    const drawnCards = this.drawPile.take(this.drawRate);
    this.wastePile.addToTop(...drawnCards);
    this.sendMoveMessage({cards: drawnCards.map(x => x.name), from: CardLocation.drawPile(), to: CardLocation.wastePile(), flip: true, msg: "drawing" });
  }

  /**
   * Resets the waste pile when there are no cards left to draw.
   */
  resetWastePile() {
    if (!this.drawPile.empty()) { return; }
    const wasteCards = this.wastePile.takeAll();
    this.drawPile.addToTop(...wasteCards);
    this.sendMoveMessage({cards: wasteCards.map(x => x.name), from: CardLocation.wastePile(), to: CardLocation.drawPile(), flip: true, msg: "resetting waste" });
  }

  // Flips the end card over if necessary.
  // Returns whether or not a flip was performed.
  public fixTableauOrientations(n: integer | undefined): boolean {
    const flippedCards =
      (n === undefined)
      ? this.tableau.fixAllOrientations()
      : this.tableau.fixOrientations(n);
    this.sendMoveMessage({
      cards: flippedCards.map(x => x.name),
      flip: true,
      msg: 'fixing tableau orientations',
    });
    return flippedCards.length > 0;
  }

  public autoPlay(cardName: string): boolean {
    let cardAndPlace = this.findCard(cardName);
    if (cardAndPlace === undefined) {
      console.error('Could not find card ' + cardName + ' in deck.');
      return false;
    }

    let currentLocation = cardAndPlace.place;
    let card = cardAndPlace.card;

    // Must overwrite this before accepting the event
    let playTo: CardLocation | undefined = undefined;

    // May modify this is more cards will be moved
    let playCards = [cardName];

    let e = new SimpleEvent(
      () => { this.acceptAutoMove(new MoveData({cards: playCards, from: currentLocation, to: playTo})); },
      () => { /* ignore rejections */ }
    );

    // Move to a foundation if possible
    for (const [index, isPlayable] of this.foundations.wherePlayable(card).entries()) {
      if (isPlayable) {
        playTo = CardLocation.foundation(index);
        e.accept();
        return true;
      }
    }

    // Can also move to a tableau column
    for (const [index, isPlayable] of this.tableau.wherePlayable(card).entries()) {
      if (isPlayable) {
        playTo = CardLocation.tableau(index);
        playCards.push(...this.tableau.columns[currentLocation.index ?? 0].cardsOnTopOf(card).map(x => x.name));
        e.accept();
        return true;
      }
    }

    return false;

  }

  /**
   * Whether the win condition has been met.
   */
  won(): boolean {
    return this.foundations.full();
  }
}

export default SolitaireModel;