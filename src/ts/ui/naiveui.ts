import { Card } from "../core/Card";
import { cardImages } from "../core/CardImageCache";
import { ctx } from "../core/ctx";
import { Deck } from "../core/Deck";
import { Foundation } from "../core/Foundation";
import { Foundations } from "../core/Foundations";
import { Game } from "../core/Game";
import { Tableau } from "../core/Tableau";
import { TableauColumn } from "../core/TableauColumn";
import { throwExpression } from "../core/util";


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
function drawGame(game: Game) {
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

export { drawGame }