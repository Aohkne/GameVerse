import { LEVEL, OBJECT_TYPE } from './setup.js';
import { randomMovement } from './GhostMove.js';

//Classes
import GameBoard from './GameBoard.js';
import Pacman from './Pacman.js';
import Ghost from './Ghost.js';

//Sounds
// import soundDot from './asset/sounds/munch.wav';
// import soundPill from './asset/sounds/pill.wav';
// import soundGameStart from './asset/sounds/game_start.wav';
// import soundGameOver from './asset/sounds/death.wav';
// import soundGhost from './asset/sounds/eat_ghost.wav';

//Thành phần Dom(html)
const gameGrid = document.querySelector('#game');
const scoreTable = document.querySelector('#score');
const startButton = document.querySelector('#start-button');

//Thành phần trong game
const POWER_PILL_TIME = 10000;// hiệu ứng sức mạnh pacman trong 10s
const GLOBAL_SPEED = 80; //tốc độ vòng lặp trò chơi 80/1000 ms
const gameBoard = GameBoard.createGameBoard(gameGrid, LEVEL);

//Các thiết lập ban đầu
let score = 0;
let timer = null;
let gameWin = false;
let powerPillActive = false;
//Thời gian khi pacman ăn thuốc có cộng dồn
let powerPillTimer = null;

//Method

function gameOver(pacman, grid) {
    document.removeEventListener('keydown', e =>
        pacman.handleKeyInput(e, gameBoard.objectExist)
    )

    //Show notification
    gameBoard.showGameStatus(gameWin);

    //Clear time
    clearInterval(timer);

    //Show start button
    startButton.classList.remove('hide');
}

//Kiểm tra va chạm với các vật thể
function checkCollision(pacman, ghosts) {
    const collidedGhost = ghosts.find((ghost) => pacman.pos === ghost.pos);

    if (collidedGhost) {
        //Check if pacman eat powerpill
        if (pacman.powerPill) {
            gameBoard.removeObject(collidedGhost.pos, [
                OBJECT_TYPE.GHOST,
                OBJECT_TYPE.SCARED,
                collidedGhost.name
            ]);
            //Revival ghost
            collidedGhost.pos = collidedGhost.startPos;
            score += 100;
        } else {
            gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.PACMAN]);
            gameBoard.rotateDiv(pacman.pos, 0);
            gameOver(pacman, gameGrid);
        }
    }
}

function gameLoop(pacman, ghosts) {
    //Move pacman
    gameBoard.moveCharacter(pacman);

    //Check collision of pacman and ghost old position
    checkCollision(pacman, ghosts);


    //Move ghost random
    ghosts.forEach((ghost) => gameBoard.moveCharacter(ghost));

    //Check collision of pacman and ghost new position
    checkCollision(pacman, ghosts);

    //Check pacman eat a dot
    if (gameBoard.objectExist(pacman.pos, OBJECT_TYPE.DOT)) {
        gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.DOT]);
        gameBoard.dotCount--;
        score += 10;
    }

    //Check pacman eat a power pill
    if (gameBoard.objectExist(pacman.pos, OBJECT_TYPE.PILL)) {
        gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.PILL]);

        pacman.powerPill = true;
        score += 50;

        clearTimeout(powerPillTimer);
        powerPillTimer = setTimeout(
            () => (pacman.powerPill = false),
            POWER_PILL_TIME
        );
    }

    //Change ghost scare mode when pacman eat power pill
    if (pacman.powerPill !== powerPillActive) {
        powerPillActive = pacman.powerPill;
        ghosts.forEach((ghost) => (ghost.isScared = pacman.powerPill));
    }

    //Check if pacman eat all dots
    if (gameBoard.dotCount === 0) {
        gameWin = true;
        gameOver(pacman, ghosts);
    }

    //Show score
    scoreTable.innerHTML = score;

}

function startGame() {
    gameWin = false;
    powerPillActive = false;
    score = 0;

    //hide button start game
    startButton.classList.add('hide');

    gameBoard.createGrid(LEVEL);

    // create pacman
    const pacman = new Pacman(2, 287);

    gameBoard.addObject(287, [OBJECT_TYPE.PACMAN]);
    document.addEventListener('keydown', (e) =>
        pacman.handleKeyInput(e, gameBoard.objectExist)
    );

    const ghosts = [
        //create 4 ghost 
        new Ghost(5, 188, randomMovement, OBJECT_TYPE.BLINKY),
        new Ghost(4, 209, randomMovement, OBJECT_TYPE.PINKY),
        new Ghost(3, 230, randomMovement, OBJECT_TYPE.INKY),
        new Ghost(2, 251, randomMovement, OBJECT_TYPE.CLYDE)
    ];

    timer = setInterval(() => gameLoop(pacman, ghosts), GLOBAL_SPEED);
}

//Initialize
startButton.addEventListener('click', startGame);