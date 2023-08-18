const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

// const STORAGE_KEY = 'solitaire'

// const DECK_SIZE = 52
const SUIT_SIZE = 13

// const cardImg = new Image()
// cardImg.src = 'img/cards/simple/hearts-4.svg'

// const backImage = new Image()
// backImage.src = 'img/cards/simple/back.svg'

// ---------------------
// Images
// ---------------------

class CardImageCache {
  images = {}

  constructor (theme) {
    this.theme = theme
    this.load()
  }

  getImage (suit, number) {
    const imageName = this._generateImageName(suit, number)
    return this.images[imageName]
  }

  getBack () {
    return this.images.back
  }

  _generateImageName (suit, number) {
    return 'hearts-4'
    // return suit + '-' + number // TODO uncomment when we have all the images
  }

  _generateImagePath (name) {
    return 'img/cards/' + this.theme + '/' + name + '.svg'
  }

  _setImage (name) {
    if (isUndefined(this.images[name])) {
      this.images[name] = new Image()
    }

    const imagePath = this._generateImagePath(name)
    this.images[name].src = imagePath
  }

  load () {
    // Card back image
    this._setImage('back')

    // Number value images
    for (const [suit] of Object.entries(Suits)) {
      for (let number = 0; number < SUIT_SIZE; ++number) {
        const imageName = this._generateImageName(suit, number)
        this._setImage(imageName)
      }
    }
  }
}

// ---------------------
// Game logic
// ---------------------

function makeEnum (arr) {
  const obj = Object.create(null)
  for (const val of arr) {
    obj[val] = Symbol(val)
  }
  return Object.freeze(obj)
}

const Suits = makeEnum(['spades', 'hearts', 'clubs', 'diamonds'])
const Colors = makeEnum(['red', 'black'])

function suitColor (suit) {
  if (suit === Suits.spades || suit === Suits.clubs) {
    return Colors.black
  }
  return Colors.red
}

class Card {
  constructor (number, suit) {
    this.number = number
    this.suit = suit
    this.color = suitColor(suit)
  }
}

function shuffleArray (array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]
  }
}

function isUndefined (x) {
  return typeof x === 'undefined'
}

class Deck {
  #cards = []

  static full () {
    const deck = new Deck()
    for (const [suit] of Object.entries(Suits)) {
      for (let number = 0; number < SUIT_SIZE; number++) {
        deck.addToBottom(new Card(number, suit))
      }
    }
  }

  shuffle () {
    shuffleArray(this.#cards)
  }

  // Returns the first element in the array.
  // Does not modify the deck.
  // Undefined if the array is empty.
  peek () {
    return this.#cards[0]
  }

  take (nCards) {
    const taken = []
    for (let i = 0; i < nCards; ++i) {
      taken.push(this.#cards.shift())
    }
    // When we run out of cards we will get undefined values.
    taken.filter((x) => isUndefined(x))
    return taken
  }

  addToBottom (cards) {
    this.#cards.push(cards)
  }

  addToTop (cards) {
    this.#cards.unshift(cards)
  }

  empty () {
    return this.#cards.length === 0
  }
}

class Foundation {
  #cards = new Deck()

  isPlayable (card) {
    const topCard = this.#cards.peek()

    if (isUndefined(topCard) && card.number === 1) {
      // Ace
      return true
    }

    if (topCard.suit === card.suit && topCard.number === card.number - 1) {
      return true
    }

    return false
  }

  ncards () {
    return this.#cards.length
  }
}

class Foundations {
  #foundations = [] // Decks

  constructor () {
    for (const [,] of Object.entries(Suits)) {
      this.#foundations.push(new Foundation())
    }
  }

  isPlayable (card) {
    // Can this card be played on a foundation?
    // Returns indexes of foundations that it is playable on.
    const playable = Array(this.#foundations.length).fill(false)

    for (const [i, foundation] of Object.entries(this.#foundations)) {
      playable[i] = foundation.isPlayable(card)
    }

    return playable
  }

  full () {
    for (const [, foundation] of Object.entries(this.#foundations)) {
      if (foundation.ncards() !== SUIT_SIZE) {
        return false
      }
    }
    return true
  }
}

class TableauColumn {
  #facedown = new Deck()
  #faceup = new Deck()

  isPlayable (card) {
    const topCard = this.topCard()

    if (card.color !== topCard.color && card.number === topCard.number - 1) {
      return true
    }

    return false
  }

  topCard () {
    return this.#faceup.peek()
  }
}

class Tableau {
  #ncolumns = 5
  #columns = []

  constructor () {
    for (let i = 0; i < this.#ncolumns; ++i) {
      this.#columns.push(new TableauColumn())
    }
  }

  isPlayable (card) {
    const playable = Array(this.#columns.length).fill(false)

    for (const [i, column] of Object.entries(this.#columns)) {
      playable[i] = column.isPlayable(card)
    }

    return playable
  }
}

class Game {
  constructor (drawRate) {
    this.drawRate = drawRate

    this.drawPile = Deck.full() // Cards
    this.wastePile = new Deck() // Cards
    this.foundations = new Foundations() // Where the aces stack upwards
    this.tableau = new Tableau() // Where you play solitaire
  }

  drawStep () {
    const drawnCards = this.drawPile.take(this.drawRate)
    this.wastePile.addToTop(drawnCards)
  }

  won () {
    return this.foundations.full()
  }
}

// ---------------------
// UI
// ---------------------

const game = new Game()
const cardImages = new CardImageCache('simple')

const sampleCard = new Card(4, Suits.hearts)

function drawDrawPile () {
  CardView.draw(300, 50, sampleCard)
}

function drawWastePile () {
  CardView.draw(200, 50, sampleCard)
}

function drawFoundations () {
  CardView.draw(50, 50, sampleCard)
}

function drawTableau () {
  CardView.draw(500, 200, sampleCard)
}

function drawGame () {
  if (game.won()) {
    console.log('we won')
  }

  drawDrawPile()
  drawWastePile()
  drawFoundations()
  drawTableau()
}

class CardView {
  static width = 50
  static height = this.width * 89 / 59
  static cornerRadius = 5

  static draw (x, y, card) {
    ctx.beginPath()
    ctx.roundRect(x, y, this.width, this.height, this.cornerRadius)
    ctx.strokeStyle = '#ccc'
    ctx.stroke()

    const img = cardImages.getImage(card.suit, card.number)
    ctx.drawImage(img, x, y, this.width, this.height)
    ctx.closePath()
  }
}

onresize = (event) => {
  setCanvasSize()
}

function setCanvasSize () {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

function init () {
  setCanvasSize()
}

function draw () {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawGame()
  requestAnimationFrame(draw)
}

init()
draw()

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
