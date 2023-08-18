const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

// const STORAGE_KEY = 'solitaire'

// const cardWidth = 64
// const cardHeight = 89

// const DECK_SIZE = 52
const SUIT_SIZE = 13

const cardImg = new Image()
cardImg.src = 'img/cards/simple/heart-4.svg'

const ballRadius = 10
const x = canvas.width / 2
const y = canvas.height - 30
// var dx = 2;
// var dy = -2;
const paddleHeight = 10
const paddleWidth = 75
const paddleX = (canvas.width - paddleWidth) / 2
// var rightPressed = false;
// var leftPressed = false;
// var brickRowCount = 5;
// var brickColumnCount = 3;
// var brickWidth = 75;
// var brickHeight = 20;
// var brickPadding = 10;
// var brickOffsetTop = 30;
// var brickOffsetLeft = 30;
// var score = 0;
// var lives = 3;

// class CardView {
//   width = 20
//   height = this.width * 89 / 59
//   constructor (type) {
//     this.type = type
//   }

//   draw (x, y) {
//     ctx.beginPath()
//     ctx.roundRect(cardX, cardY, cardWidth, cardHeight, 5)
//     ctx.strokeStyle = '#ccc'
//     ctx.stroke()
//     ctx.drawImage(cardImg, cardX, cardY, cardWidth, cardHeight)
//     ctx.closePath()
//   }
// }

// const Suits = Object.freeze({
//     SPADES:   Symbol("spades"),
//     HEARTS:   Symbol("hearts"),
//     CLUBS:    Symbol("clubs"),
//     DIAMONDS: Symbol("diamonds")
// });

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

const game = new Game()

function drawGame () {
  if (game.won()) {
    console.log('we won')
  }
  ctx.beginPath()
  ctx.arc(x, y + 20, ballRadius, 0, Math.PI * 2)
  ctx.fillStyle = '#0095DD'
  ctx.fill()
  ctx.closePath()
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

function drawCard (cardWidth) {
  const cardHeight = cardImg.height / cardImg.width * cardWidth
  ctx.beginPath()
  const cardX = canvas.width / 2 - cardWidth / 2
  const cardY = canvas.height / 2 - cardHeight / 2
  ctx.roundRect(cardX, cardY, cardWidth, cardHeight, 5)
  ctx.strokeStyle = '#ccc'
  ctx.stroke()
  ctx.drawImage(cardImg, cardX, cardY, cardWidth, cardHeight)
  ctx.closePath()
}
function drawBall () {
  ctx.beginPath()
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2)
  ctx.fillStyle = '#0095DD'
  ctx.fill()
  ctx.closePath()
}
function drawPaddle () {
  ctx.beginPath()
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight)
  ctx.fillStyle = '#0095DD'
  ctx.fill()
  ctx.closePath()
}

function draw () {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawCard(100)
  drawBall()
  drawPaddle()
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
