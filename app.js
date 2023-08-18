const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

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
  images = {};

  /**
   * Creates a card image cache for a theme.
   * @param {string} theme
   */
  constructor(theme) {
    this.theme = theme;
    this.load();
  }

  /**
   * Gets the image for a particular suite and number.
   * @param {string} suit
   * @param {integer} number
   * @return {Image}
   */
  getImage(suit, number) {
    const imageName = this._generateImageName(suit, number);
    return this.images[imageName];
  }

  /**
   * Gets an image for a card.
   * Handles undefined and card orientation (faceup/facedown)
   * @param {Card} card
   * @return {Image}
   */
  getCardImage(card) {
    if (isUndefined(card)) {
      return this.getBlank();
    }

    if (card.facedown) {
      return this.getBack();
    }

    return this.getImage(card.suit, card.number);
  }

  /**
   * Gets the image for the back of a card.
   * @return {Image}
   */
  getBack() {
    return this.images.back;
  }

  /**
   * Gets the image for a blank card (the lack of a card).
   * @return {Image}
   */
  getBlank() {
    return this.images.blank;
  }

  /**
   * Generates the image name as stored on disk.
   * @param {string} _suit
   * @param {string} _number
   * @return {string}
   */
  _generateImageName(_suit, _number) {
    return 'hearts-4';
    // return suit + '-' + number // TODO uncomment when we have all the images
  }

  /**
   * Generates the path of an image in the current theme.
   * @param {string} name no extension
   * @return {string}
   */
  _generateImagePath(name) {
    return 'img/cards/' + this.theme + '/' + name + '.svg';
  }

  /**
   * Sets the image with a particular name to the current theme.
   * @param {string} name no extension
   */
  _setImage(name) {
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
    for (const [suit] of Object.entries(Suits)) {
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

/**
 * Generates a type that acts a bit like an enum.
 * @param {string[]} arr enum names
 * @return {enum}
 */
function makeEnum(arr) {
  const obj = Object.create(null);
  for (const val of arr) {
    obj[val] = Symbol(val);
  }
  return Object.freeze(obj);
}

const Suits = makeEnum(['spades', 'hearts', 'clubs', 'diamonds']);
const Colors = makeEnum(['red', 'black']);

/**
 * Gets the color of a suite.
 * @param {symbol} suit from the suits enum
 * @return {symbol} red or black enum color
 */
function suitColor(suit) {
  if (suit === Suits.spades || suit === Suits.clubs) {
    return Colors.black;
  }
  return Colors.red;
}

/**
 * A playing card.
 */
class Card {
  #faceup;

  /**
   *
   * @param {number} number card number, 1-13
   * @param {symbol} suit
   */
  constructor(number, suit) {
    this.number = number;
    this.suit = suit;
    this.color = suitColor(suit);
    this.#faceup = false;
  }

  /**
   * Flips the card from faceup to facedown
   * or facedown to faceup.
   */
  flip() {
    this.#faceup = !this.#faceup;
  }

  /**
   * True if the card is faceup
   */
  get faceup() {
    return this.#faceup;
  }

  /**
   * Sets the card to faceup or facedown.
   * @param {boolean} value
   */
  set faceup(value) {
    this.#faceup = value;
  }

  /**
   * True if the card is facedown
   */
  get facedown() {
    return !this.#faceup;
  }

  /**
   * Sets the card to faceup or facedown.
   * @param {boolean} value
   */
  set facedown(value) {
    this.#faceup = !value;
  }
}

/**
 * Algorithm to shuffle an arbitrary array.
 * @param {array} array any array
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/**
 * Conveneince for checking if a value is undefined.
 * @param {any} x any value
 * @return {boolean}
 */
function isUndefined(x) {
  return typeof x === 'undefined';
}

/**
 * A deck of cards.
 * Or a stack of cards.
 * Supports adding, removing, peeking, shuffling.
 */
class Deck {
  #cards = [];

  /**
   * Static constructor for a full deck of 52 cards.
   * Unshuffled.
   * @return {Deck}
   */
  static full() {
    const deck = new Deck();
    for (const [suit] of Object.entries(Suits)) {
      for (let number = 1; number <= SUIT_SIZE; number++) {
        deck.addToBottom(new Card(number, suit));
      }
    }
    return deck;
  }

  /**
   * Convenience iterator
   * @return {Card}
   */
  [Symbol.iterator]() {
    return this.#cards.values();
  }

  /**
   * Shuffles the deck.
   */
  shuffle() {
    shuffleArray(this.#cards);
  }

  /**
   * Returns the top card.
   * Does not modify the deck.
   * Undefined if there are no cards.
   * @return {Card}
   */
  peek() {
    return this.#cards[0];
  }

  /**
   * Takes cards from the top of the deck.
   * @param {number} nCards
   * @return {Card[]} cards taken out of this deck
   */
  take(nCards) {
    const taken = [];
    for (let i = 0; i < nCards; ++i) {
      taken.push(this.#cards.shift());
    }
    // When we run out of cards we will get undefined values.
    taken.filter((x) => isUndefined(x));
    return taken;
  }

  /**
   * Add cards to the bottom of the deck.
   * @param {Card[]} cards
   */
  addToBottom(cards) {
    this.#cards.push(cards);
  }

  /**
   * Add cards to the top of the deck.
   * @param {Card[]} cards
   */
  addToTop(cards) {
    this.#cards.unshift(cards);
  }

  /**
   * True if there are no cards in the deck.
   * @return {boolean}
   */
  empty() {
    return this.#cards.length === 0;
  }
}

/**
 * A single foundation.
 * In solitaire, a foundation is one of the piles at the top
 * that starts with an Ace and builds upwards.
 */
class Foundation {
  #cards = new Deck();

  /**
   * Whether or not a card is playable on this foundation.
   * @param {Card} card card to test
   * @return {boolean}
   */
  isPlayable(card) {
    const topCard = this.#cards.peek();

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
  ncards() {
    return this.#cards.length;
  }

  /**
   * The top (playable) card.
   * @return {Card}
   */
  topCard() {
    return this.#cards.peek();
  }
}

/**
 * The set of foundations (one for each suit)
 * At the top of the game board.
 */
class Foundations {
  foundations = [];

  /**
   * Initializer.
   */
  constructor() {
    for (const [,] of Object.entries(Suits)) {
      this.foundations.push(new Foundation());
    }
  }

  /**
   * Checks which if any foundations this card can be played on.
   * @param {Card} card card to test
   * @return {boolean[]} true/false mask of playable foundations.
   */
  isPlayable(card) {
    const playable = Array(this.foundations.length).fill(false);

    for (const [i, foundation] of Object.entries(this.foundations)) {
      playable[i] = foundation.isPlayable(card);
    }

    return playable;
  }

  /**
   * Tests whether the foundations are full.
   * @return {boolean} true if the foundations are full.
   */
  full() {
    for (const [, foundation] of Object.entries(this.foundations)) {
      if (foundation.ncards() !== SUIT_SIZE) {
        return false;
      }
    }
    return true;
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
   * @return {boolean}
   */
  isPlayable(card) {
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
  topCard() {
    return this.cards.peek();
  }
}

/**
 * The tableau is where the 'solitaire' part of the game happens.
 * It takes up the majority of the board.
 * Cards are played downwards in alternating colors.
 */
class Tableau {
  #ncolumns = 5;
  columns = [];

  /**
   * Initializer
   */
  constructor() {
    for (let i = 0; i < this.#ncolumns; ++i) {
      this.columns.push(new TableauColumn());
    }
  }

  /**
   * Checks which if any columns a card is playable on.
   * @param {Card} card card to test
   * @return {boolean[]} true/false mask of playable columns.
   */
  isPlayable(card) {
    const playable = Array(this.columns.length).fill(false);

    for (const [i, column] of Object.entries(this.columns)) {
      playable[i] = column.isPlayable(card);
    }

    return playable;
  }
}

/**
 * The main solitaire game.
 */
class Game {
  /**
   * Initializer
   * @param {number} drawRate how many cards to draw at a time.
   */
  constructor(drawRate) {
    this.drawRate = drawRate;

    this.drawPile = Deck.full(); // Cards
    this.wastePile = new Deck(); // Cards
    this.foundations = new Foundations(); // Where the aces stack upwards
    this.tableau = new Tableau(); // Where you play solitaire
  }

  /**
   * Perform the draw step of solitaire.
   */
  drawStep() {
    const drawnCards = this.drawPile.take(this.drawRate);
    this.wastePile.addToTop(drawnCards);
  }

  /**
   * Whether the win condition has been met.
   * @return {boolean}
   */
  won() {
    return this.foundations.full();
  }
}

// ---------------------
// UI
// ---------------------

const game = new Game();
const cardImages = new CardImageCache('simple');

// const sampleCard = new Card(4, Suits.hearts);

/**
 * Draws a stack of cards.
 * @param {Deck} deck cards in the draw pile
 * @param {number} x
 * @param {number} y
 */
function drawCardStack(deck, x, y) {
  const card = deck.peek();
  const img = cardImages.getCardImage(card);
  CardView.draw(x, y, img);
}

/**
 * Draws the foundation portion of the game board.
 * @param {Foundations} foundations
 * @param {number} x
 * @param {number} y
 */
function drawFoundations(foundations, x, y) {
  for (const foundation of foundations.foundations) {
    drawFoundation(foundation, x, y);
    x += CardView.width;
  }
}

/**
 * Draws the foundation portion of the game board.
 * @param {Foundation} foundation
 * @param {number} x
 * @param {number} y
 */
function drawFoundation(foundation, x, y) {
  const card = foundation.topCard();
  CardView.draw(x, y, card);
}

/**
 * Draws the tableau portion of the game board.
 * @param {Tableau} tableau
 * @param {number} x
 * @param {number} y
 */
function drawTableau(tableau, x, y) {
  for (const column of tableau.columns) {
    drawTableauColumn(column, x, y);
    x += CardView.width;
  }
}

/**
 * Draws a single tableau column
 * @param {TableauColumn} tableauColumn
 * @param {number} x
 * @param {number} y
 */
function drawTableauColumn(tableauColumn, x, y) {
  for (const card of tableauColumn.cards) {
    CardView.draw(x, y, card);
    y += 5;
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

  const marginX = 20;
  const marginY = 10;

  const foundationTop = 20;
  const tableauTop = foundationTop + CardView.height + marginY;

  const foundationLeft = 20;
  const tableauLeft = foundationLeft;

  const drawPileTop = foundationTop;
  const wastePileTop = foundationTop;

  const wastePileLeft = foundationLeft + (CardView.width + marginX) * 5;
  const drawPileLeft = foundationLeft + (CardView.width + marginX) * 6;

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
 * A view of a card.
 */
class CardView {
  static width = 50;
  static height = this.width * 89 / 59;

  /**
   * Draws a card.
   * @param {number} x screen coordinate
   * @param {number} y screen coordinate
   * @param {Card} card card to draw
   */
  static draw(x, y, card) {
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
