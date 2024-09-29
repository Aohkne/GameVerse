const initFieldData = (board) => {
  let isRunning = false;
  let isGameover = false;
  let fieldData;
  let fieldVisualization;
  let fieldWidth;
  let fieldHeight;
  let fieldBombs;
  let mouseDownCell;
  let closedCells;
  let currentStates = {};

  const states = {
    standard: { next: "protected", html: ``, protected: false },
    protected: {
      next: "question",
      html: `<div class="flag"></div>`,
      protected: true,
    },
    question: { next: "standard", html: `?`, protected: false },
    default: "standard",
  };

  const createCell = (row, x, y) => {
    const cell = document.createElement("div");
    cell.setAttribute("data-coord-x", x);
    cell.setAttribute("data-coord-y", y);
    cell.classList.add("cell", "cell-box", "closed");
    cell.setAttribute("data-state", states.default);
    row.appendChild(cell);
    return cell;
  };

  const createRow = (board, rowData, y) => {
    const row = document.createElement("div");
    row.classList.add("row");
    board.appendChild(row);
    return rowData.map((cell, x) => createCell(row, x, y));
  };

  const initBombs = (clickX, clickY) => {
    let counter = fieldBombs;
    while (counter > 0) {
      let x = Math.floor(Math.random() * fieldWidth);
      let y = Math.floor(Math.random() * fieldHeight);
      if (clickX === x && clickY === y) continue;

      if (fieldData[y][x] === 0) {
        fieldData[y][x] = -1;
        for (const [neighborX, neighborY] of getNeighbors(x, y)) {
          if (fieldData[neighborY][neighborX] != -1) {
            fieldData[neighborY][neighborX]++;
          }
        }
        counter--;
      }
    }
  };

  //~~ là cách viết tắt để lấy phần nguyên của phép chia (tương tự như Math.floor)
  const getNeighbors = (x, y) => {
    return Array(9)
      .fill([x - 1, y - 1])
      .map((elem, i) => [elem[0] + (i % 3), elem[1] + ~~(i / 3)])
      .filter((elem) => elem[0] >= 0 && elem[1] >= 0)
      .filter((elem) => elem[0] < fieldWidth && elem[1] < fieldHeight)
      .filter((elem) => elem[0] != x || elem[1] != y);
  };

  const getCoords = (cell) => {
    const x = +cell.getAttribute("data-coord-x");
    const y = +cell.getAttribute("data-coord-y");
    return [x, y];
  };

  const getState = (cell) => cell.getAttribute("data-state");
  const setState = (cell, state) => {
    cell.setAttribute("data-state", state);
    cell.innerHTML = states[state]?.html ?? "";
  };
  const openCell = (cell) => {
    if (isGameover) return;
    if (!cell.classList.contains("closed")) return;

    if (getState(cell) === "protected") return;
    const [x, y] = getCoords(cell);
    if (!isRunning) {
      isRunning = true;
      initBombs(x, y);
      board.dispatchEvent(new CustomEvent("gamestart"));
    }
    cell.classList.remove("closed");
    closedCells--;
    if (fieldData[y][x] === -1) {
      cell.innerHTML = `
      <div class="bomb">
        <img src="./asset/img/bomb_img.png" alt="">
      </div>
      `;
      gameover(false);
      return;
    }
    if (closedCells - fieldBombs === 0) {
      gameover(true);
      return;
    }
    let neighborBombs = 0;
    const neighbors = getNeighbors(x, y);
    for (const [neighborX, neighborY] of neighbors) {
      if (fieldData[neighborY][neighborX] === -1) neighborBombs++;
    }
    cell.innerHTML = neighborBombs
      ? `<span class="digit--${neighborBombs}">${neighborBombs}</span>`
      : ``;
    if (neighborBombs === 0) {
      for (const [neighborX, neighborY] of neighbors) {
        openCell(fieldVisualization[neighborY][neighborX]);
      }
    }
  };

  const openNeighbors = (cell) => {
    if (cell.classList.contains("closed")) return;
    const [x, y] = getCoords(cell);
    const neighbors = getNeighbors(x, y);
    let flagCounter = 0;
    for (const [neighborX, neighborY] of neighbors) {
      if (
        states[getState(fieldVisualization[neighborY][neighborX])]?.protected
      ) {
        flagCounter++;
      }
    }
    if (fieldData[y][x] !== flagCounter) return;
    for (const [neighborX, neighborY] of neighbors) {
      openCell(fieldVisualization[neighborY][neighborX]);
    }
  };

  const changeState = ({ target }) => {
    const cell = target.closest(".cell");
    if (!cell.classList.contains("closed")) return;
    let state = getState(cell);
    currentStates[state] = (currentStates[state] || 0) - 1;
    state = states[state]?.next ?? "";
    setState(cell, state);
    currentStates[state] = (currentStates[state] || 0) + 1;
    board.dispatchEvent(
      new CustomEvent("changestate", { detail: { states: currentStates } })
    );
  };

  const newGame = (width, height, bombs) => {
    fieldWidth = width;
    fieldHeight = height;
    fieldBombs = bombs;
    isRunning = false;
    isGameover = false;

    fieldData = Array(height)
      .fill(0)
      .map((_) => Array(width).fill(0));
    fillVisualization();
  };

  const fillVisualization = () => {
    board.innerHTML = "";
    fieldVisualization = fieldData.map((row, y) => createRow(board, row, y));
    closedCells = fieldWidth * fieldHeight;
    currentStates[states.default] = closedCells;
  };

  const reset = () => {
    isRunning = false;
    isGameover = false;
    fieldData = fieldData.map((row) => row.map((_) => 0));
    currentStates = {};
    fillVisualization();
  };
  const gameover = (isWin) => {
    isRunning = false;
    isGameover = true;
    board.dispatchEvent(
      new CustomEvent("gameover", { detail: { win: isWin } })
    );
  };

  board.addEventListener("click", (e) => openCell(e.target.closest(".cell")));
  board.addEventListener("contextmenu", changeState);
  board.addEventListener("mousedown", ({ button, target }) => {
    if (button === 1) {
      const cell = target.closest(".cell");
      mouseDownCell = cell;
    }
  });
  board.addEventListener("mouseup", ({ button, target }) => {
    const cell = target.closest(".cell");

    if (button === 1 && cell === mouseDownCell) {
      openNeighbors(cell);
    }
    mouseDownCell = undefined;
  });

  return [reset, newGame];
};

const board = document.querySelector("#board");
const resetBtn = document.querySelector("#reset");
const scrTemplates = document.querySelector("#screens");
const timer = document.querySelector("#timer");
const flags = document.querySelector("#flags");
const newgameBtn = document.querySelector("#newgame");
const newgameSelectors = document.querySelector("#newgameItems");

let width = 12;
let height = 10;
let bombs = 10;
let time = 0;
let interval = undefined;

const [reset, newGame] = initFieldData(board);
newGame(width, height, bombs);

const intToTimeString = (time) => {
  const minutes = ("0" + ~~(time / 60)).slice(-2);
  const seconds = ("0" + (time % 60)).slice(-2);

  return `
    <i class="fa-solid fa-clock"></i>
    ${minutes}:${seconds}
  `;
};
const newgameClickHandler = ({ target }) => {
  target
    .closest(".dropdown-menu-container")
    ?.querySelector(".dropdown-menu")
    ?.classList.toggle("visible");
};

const outsideClickHandler = ({ target }) => {
  if (target.classList.contains("dropdown-button")) return;
  const dropdowns = document.querySelectorAll(".dropdown-menu");
  dropdowns.forEach((dd) => {
    dd.classList.remove("visible");
  });
};

const newgameOptionClickHandler = ({ target }) => {
  if (target.hasAttribute("data-width")) {
    width = +target.getAttribute("data-width") || width;
    height = +target.getAttribute("data-height") || height;
    bombs = +target.getAttribute("data-bombs") || bombs;

    newGame(width, height, bombs);
    resetGameData();
  }
};

const gameoverEventHandler = (e) => {
  clearInterval(interval);
  const className = e.detail.win ? "win" : "lost";
  const gameoverScreen = scrTemplates.content
    .querySelector(`.${className}`)
    .cloneNode(true);
  board.append(gameoverScreen);
  setTimeout(() => {
    gameoverScreen.classList.remove("hidden");
  }, 0);
};
const gamestartEventHandler = () => {
  interval = setInterval(updateTimer, 1000);
};

const resetButtonHandler = () => {
  resetGameData();
  reset();
};

const changestateEventHandler = ({ detail }) => {
  flags.innerHTML = `
    <i class="fa-solid fa-flag"></i>
    ${detail.states?.protected}/${bombs}
  `;
};

const updateTimer = () => {
  time++;
  timer.innerHTML = intToTimeString(time);
};

const resetGameData = () => {
  flags.innerHTML = `
    <i class="fa-solid fa-flag"></i>  
    0/${bombs}
    `;
  clearInterval(interval);
  time = 0;
  timer.innerHTML = intToTimeString(time);
};

window.addEventListener("click", outsideClickHandler);
board.addEventListener("gameover", gameoverEventHandler);
board.addEventListener("gamestart", gamestartEventHandler);
board.addEventListener("changestate", changestateEventHandler);
newgameBtn.addEventListener("click", newgameClickHandler);
resetBtn.addEventListener("click", resetButtonHandler);
newgameSelectors.addEventListener("click", newgameOptionClickHandler);

document.addEventListener("contextmenu", (e) => e.preventDefault());

resetGameData();
