import { canvas, ctx } from "./ts/core/ctx";
import { Game } from "./ts/core/Game";
import { drawGame } from "./ts/ui/naiveui";

// const STORAGE_KEY = 'solitaire'

const startDrawRate = 3;
const game = new Game(startDrawRate);
game.setup();

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
  drawGame(game);
  requestAnimationFrame(draw);
}

init();
draw();










/*
extra stuff I'm keeping around for no reason


// Conveneince for checking if a value is undefined.
function isUndefined(x: any) {
  return typeof x === 'undefined';
}

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
