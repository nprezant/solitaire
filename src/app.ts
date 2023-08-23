// import './style.css';

function throwExpression(errorMessage: string): never {
  throw new Error(errorMessage);
}

const canvas: any = document.getElementById('canvas'); // Should be HTMLCanvasElement
const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;


// const STORAGE_KEY = 'solitaire'

// const DECK_SIZE = 52
const SUIT_SIZE = 13;

// ---------------------
// Images
// ---------------------

/**
 * Manages card images (fronts and backs)
 */
class CardImageCache {
  images: { [id: string] : HTMLImageElement; } = {};
  theme: string;

  constructor(theme: string) {
    this.theme = theme;
    this.load();
  }

  /**
   * Gets the image for a particular suite and number.
   */
  getImage(suit: string, number: number) {
    const imageName = this._generateImageName(suit, number);
    return this.images[imageName];
  }

  /**
   * Gets an image for a card.
   * Handles undefined and card orientation (faceup/facedown)
   */
  getCardImage(card: Card | undefined) {
    if (card === undefined) {
      return this.getBlank();
    }

    if (card.facedown) {
      return this.getBack();
    }

    return this.getImage(card.suit, card.number);
  }

  /**
   * Gets the image for the back of a card.
   */
  getBack() {
    return this.images.back;
  }

  /**
   * Gets the image for a blank card (the lack of a card).
   */
  getBlank() {
    return this.images.blank;
  }

  /**
   * Generates the image name as stored on disk.
   */
  _generateImageName(_suit: string, number: number) {
    return 'hearts-' + number;
    // return suit + '-' + number // TODO uncomment when we have all the images
  }

  /**
   * Generates the path of an image in the current theme.
   * @param {string} name no extension
   */
  _generateImagePath(name: string) {
    return 'img/cards/' + this.theme + '/' + name + '.svg';
  }

  /**
   * Sets the image with a particular name to the current theme.
   * @param {string} name no extension
   */
  _setImage(name: string): void {
    if (isUndefined(this.images[name])) {
      this.images[name] = new Image();
    }

    const imagePath = this._generateImagePath(name);
    this.images[name].src = imagePath;
  }

  /**
   * Loads all images for the theme.
   */
  load() {
    // Special images
    this._setImage('back');
    this._setImage('blank');

    // Number value images
    for (const [suit] of Object.entries(Suit)) {
      for (let number = 1; number <= SUIT_SIZE; ++number) {
        const imageName = this._generateImageName(suit, number);
        this._setImage(imageName);
      }
    }
  }
}

// ---------------------
// Game logic
// ---------------------

enum Suit {
  Spades = "spades",
  Hearts = "hearts",
  Clubs = "clubs",
  Diamonds = "diamonds",
}

enum Color {
  Red,
  Black,
}

/**
 * Gets the color of a suite.
 */
function suitColor(suit: Suit) {
  if (suit === Suit.Spades || suit === Suit.Clubs) {
    return Color.Black;
  }
  return Color.Red;
}

/**
 * A playing card.
 */
class Card {
  _faceup: boolean;
  number: any;
  suit: any;
  color: any;

  /**
   *
   * @param {number} number card number, 1-13
   */
  constructor(number: number, suit: Suit) {
    this.number = number;
    this.suit = suit;
    this.color = suitColor(suit);
    this._faceup = false;
  }

  /**
   * Flips the card from faceup to facedown
   * or facedown to faceup.
   */
  flip() {
    this._faceup = !this._faceup;
  }

  /**
   * True if the card is faceup
   */
  get faceup() {
    return this._faceup;
  }

  /**
   * Sets the card to faceup or facedown.
   */
  set faceup(value: boolean) {
    this._faceup = value;
  }

  /**
   * True if the card is facedown
   */
  get facedown() {
    return !this._faceup;
  }

  /**
   * Sets the card to faceup or facedown.
   */
  set facedown(value: boolean) {
    this._faceup = !value;
  }
}

/**
 * Algorithm to shuffle an arbitrary array.
 */
function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/**
 * Conveneince for checking if a value is undefined.
 */
function isUndefined(x: any) {
  return typeof x === 'undefined';
}

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
   * @return {Card}
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
  peek(): Card {
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

    if (isUndefined(topCard) && card.number === 1) {
      // Ace
      return true;
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
   * @return {Card}
   */
  topCard(): Card {
    return this.cards.peek();
  }

  /**
   * Clears the cards from this foundation.
   */
  clear() {
    this.cards.clear();
  }
}

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
  topCard(): Card {
    return this.cards.peek();
  }

  /**
   * Clears the cards from this column.
   */
  clear() {
    this.cards.clear();
  }
}

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

/**
 * The main solitaire game.
 */
class Game {
  drawRate: any;
  drawPile: Deck;
  wastePile: Deck;
  foundations: Foundations;
  tableau: Tableau;
  /**
   * Initializer
   * @param {number} drawRate how many cards to draw at a time.
   */
  constructor(drawRate: number) {
    this.drawRate = drawRate;

    /**
     * The draw pile
     * @type {Deck}
     * @public
     */
    this.drawPile = new Deck();
    this.wastePile = new Deck(); // Cards
    this.foundations = new Foundations(); // Where the aces stack upwards
    this.tableau = new Tableau(); // Where you play solitaire
  }

  /**
   * Sets up a new game.
   */
  setup() {
    // Draw pile
    this.drawPile.fill();
    this.drawPile.shuffle();

    // Waste pile
    this.wastePile.clear();

    // Foundations
    this.foundations.clear();

    // Tableau
    this.tableau.clear();
    const nColumns = this.tableau.columns.length;
    for (let n = nColumns; n > 0; --n) {
      for (let j = 0; j < n; ++j) {
        const columnIndex = nColumns - j - 1;
        const card = this.drawPile.take()[0];
        if (card == null)
          throw new Error("Cannot setup board. Not enough cards.");
        if (j === n - 1) {
          card.faceup = true;
        }
        this.tableau.columns[columnIndex].cards.addToTop(card);
      }
    }
  }

  /**
   * Perform the draw step of solitaire.
   */
  drawStep() {
    const drawnCards = this.drawPile.take(this.drawRate);
    this.wastePile.addToTop(...drawnCards);
  }

  /**
   * Whether the win condition has been met.
   * @return {boolean}
   */
  won(): boolean {
    return this.foundations.full();
  }
}

// ---------------------
// UI
// ---------------------

const startDrawRate = 3;
const game = new Game(startDrawRate);
game.setup();

const cardImages = new CardImageCache('simple');

// const sampleCard = new Card(4, Suits.hearts);

/**
 * Draws a stack of cards.
 * @param {Deck} deck cards in the draw pile
 */
function drawCardStack(deck: Deck, x: number, y: number) {
  const card = deck.peek();
  CardView.draw(x, y, card);
}

/**
 * Draws the foundation portion of the game board.
 */
function drawFoundations(foundations: Foundations, x: number, y: number) {
  for (const foundation of foundations.foundations) {
    drawFoundation(foundation, x, y);
    x += CardView.bbox.w;
  }
}

/**
 * Draws the foundation portion of the game board.
 */
function drawFoundation(foundation: Foundation, x: number, y: number) {
  const card = foundation.topCard();
  CardView.draw(x, y, card);
}

/**
 * Draws the tableau portion of the game board.
 */
function drawTableau(tableau: Tableau, x: number, y: number) {
  for (const column of tableau.columns) {
    drawTableauColumn(column, x, y);
    x += CardView.bbox.w;
  }
}

/**
 * Draws a single tableau column
 */
function drawTableauColumn(tableauColumn: TableauColumn, x: number, y: number) {
  const nCards = tableauColumn.cards.length;
  for (let i = nCards - 1; i >= 0; --i) {
    const card = tableauColumn.cards.at(i) ?? throwExpression("Card does not exist.");
    CardView.draw(x, y, card);
    y += CardView.cascadeY;
  }

  if (tableauColumn.cards.empty()) {
    CardView.draw(x, y, undefined);
  }
}

/**
 * Draws the entire game.
 */
function drawGame() {
  if (game.won()) {
    console.log('we won');
  }

  // const w = canvas.width;
  // const h = canvas.height;

  const foundationTop = 20;
  const tableauTop = foundationTop + CardView.bbox.h;

  const foundationLeft = 20;
  const tableauLeft = foundationLeft;

  const drawPileTop = foundationTop;
  const wastePileTop = foundationTop;

  const wastePileLeft = foundationLeft + CardView.bbox.w * 5;
  const drawPileLeft = foundationLeft + CardView.bbox.w * 6;

  // Draw pile
  drawCardStack(game.drawPile, drawPileLeft, drawPileTop);

  // Waste pile
  drawCardStack(game.wastePile, wastePileLeft, wastePileTop);

  // Foundations
  drawFoundations(game.foundations, foundationLeft, foundationTop);

  // Tableau
  drawTableau(game.tableau, tableauLeft, tableauTop);
}

/**
 * Graphical primitive bounding box
 */
class BBox {
  w: any;
  h: number;
  x: any;
  y: any;

  
  constructor(x: number, y: number, w: number, h: number) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
}

/**
 * A view of a card.
 */
class CardView {
  static mmWidth = 59; // Official width in mm
  static mmHeight = 89; // Official height in mm

  static width = 50;
  static height = this.width * this.mmHeight / this.mmWidth;

  static marginX = 10;
  static marginY = 5;

  static cascadeY = 5;

  static bbox = new BBox(
      0,
      0,
      this.width + this.marginX * 2,
      this.height + this.marginY * 2);

  /**
   * Draws a card.
   * @param {number} x screen coordinate
   * @param {number} y screen coordinate
   */
  static draw(x: number, y: number, card: Card | undefined) {
    ctx.beginPath();

    const img = cardImages.getCardImage(card);

    ctx.drawImage(img, x, y, this.width, this.height);
    ctx.closePath();
  }
}

onresize = (_event) => {
  setCanvasSize();
};

/**
 * Matches the canvas to the window size.
 * Useful when the window resizes.
 */
function setCanvasSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

/**
 * Startup.
 */
function init() {
  setCanvasSize();
}

/**
 * Main loop.
 */
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGame();
  requestAnimationFrame(draw);
}

init();
draw();

/*
// Listen to form submissions.
newPeriodFormEl.addEventListener("submit", (event) => {
    event.preventDefault();
    const startDate = startDateInputEl.value;
    const endDate = endDateInputEl.value;
    if (checkDatesInvalid(startDate, endDate)) {
        return;
    }
    storeNewPeriod(startDate, endDate);
    renderPastPeriods();
    newPeriodFormEl.reset();
});

function checkDatesInvalid(startDate, endDate) {
    if (!startDate || !endDate || startDate > endDate) {
        newPeriodFormEl.reset();
        return true;
    }
    return false;
}

function storeNewPeriod(startDate, endDate) {
    const periods = getAllStoredPeriods();
    periods.push({ startDate, endDate });
    periods.sort((a, b) => {
        return new Date(b.startDate) - new Date(a.startDate);
    });
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(periods));
}

function getAllStoredPeriods() {
    const data = window.localStorage.getItem(STORAGE_KEY);
    const periods = data ? JSON.parse(data) : [];
    console.dir(periods);
    console.log(periods);
    return periods;
}

function renderPastPeriods() {
    const pastPeriodHeader = document.createElement("h2");
    const pastPeriodList = document.createElement("ul");
    const periods = getAllStoredPeriods();
    if (periods.length === 0) {
        return;
    }
    pastPeriodContainer.innerHTML = "";
    pastPeriodHeader.textContent = "Past periods";
    periods.forEach((period) => {
        const periodEl = document.createElement("li");
        periodEl.textContent = `From ${formatDate(
            period.startDate,
            )} to ${formatDate(period.endDate)}`;
            pastPeriodList.appendChild(periodEl);
        });

    pastPeriodContainer.appendChild(pastPeriodHeader);
    pastPeriodContainer.appendChild(pastPeriodList);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { timeZone: "UTC" });
}

renderPastPeriods();
*/
