let isPlay = false;
//board - khai báo phần chơi
let board;
let boardWidth = 400; //360
let boardHeight = 680; // 640
let context;

//bird 
let birdWidth = 34; //tỉ lệ hình ảnh = 408/228  ~ 17/12
let birdHeigth = 24;
// toạ đọ bird 
let birdX = boardWidth / 8; // toạ độ x của bird nằm  gần sát trái (chia làm 8 phần)
let birdY = boardHeight / 2; // toạ độ y của bird = chiều cao / 2

let birdImg;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeigth,
}

//pipe
let pipeArray = [];
let pipeWidth = 64; // tỉ lệ hình ảnh = 384/3072 ~ 1/8
let pipeHeight = 512;
//toạ độ đường ống xuất hiện
let pipeX = boardWidth;// x lấy gốc trái độ làm  (0, 0)  thì gốc phải là chiều dài khung hình
let pipeY = 0;//y: sát trên cùng

let topPipeImg;
let bottomPipeImg;


//physics
let velocityX = -2; // tốc đọ pipe di chuyển sang trái
let velocityY = 0; // tốc độ bird jump
let gravity = 0.05; //tốc độ rơi

let gameOver = false;
let score = 0;

//function

window.onload = function () {
    // gọi biến board được khai báo ở trên tới id"board" bên html
    board = document.getElementById("board");
    //set length
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");// sử dụng để vẽ trên board

    //draw bird
    birdImg = new Image();
    birdImg.src = "./font/img/flappybird.png"
    birdImg.onload = function () {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    //draw pipe
    topPipeImg = new Image();
    topPipeImg.src = "./font/img/toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./font/img/bottompipe.png";


    //gọi hàm update để cập nhật lại các bố cục
    requestAnimationFrame(update);
    setInterval(placePipes, 1500);// 1500 ms ~ 1.5 seconds
    document.addEventListener("keydown", moveBird);

}

function update() {
    //khi cập nhật lại thì xoá các cập nhật trước
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (isPlay) {
        //update bird
        bird.y = Math.max(bird.y + velocityY, 0); // tác dụng vào trọng lực để bird không vượt qua khung hình (limit top)
        velocityY += gravity;

        if (bird.y > board.height) {
            gameOver = true;
        }

        //update pipe
        for (let i = 0; i < pipeArray.length; i++) {
            let pipe = pipeArray[i];
            //sau 1.5 second sẽ dịch chuyển sang trái một khoảng ...
            pipe.x += velocityX;
            context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

            if (!pipe.passed && bird.x > pipe.x + pipe.width) {
                score += 0.5;// có 2 pipe trên dưới 
                pipe.passed = true;
            }

            if (detectCollision(bird, pipe)) {
                gameOver = true;
            }
        }

        // clear pipe ( xoá những đường ống đã đi qua để tránh bộ nhớ quá tải)

        while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
            pipeArray.shift(); //method remove first element of array
        }

        //score
        context.fillStyle = "black";
        context.font = "35px sans-serif";
        context.fillText(score, 185, 35);

        if (gameOver) {
            context.fillStyle = "red";
            context.font = "45px sans-serif";
            context.fillText("GAME OVER !!", 50, 355);
            context.font = "20px sans-serif"; 
            context.fillText("Play Again ?(Space)", 115, 390);

        }
    } else {
        context.fillStyle = "#f0bb40";
        context.font = "45px sans-serif";
        context.fillText("Start", 150, 350);
        context.font = "20px sans-serif"; 
        context.fillText("Press Space To Play", 115, 390);
        

        document.addEventListener("keydown", event => {
            if (event.code === "Space") {
                isPlay = true;
            }
        })
    }

}


function placePipes() {

    if (gameOver) {
        return;
    }

    // random lên xuống của pipe
    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);

    //khoảng trống 
    let openSpace = board.height / 4;


    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }

    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp") {
        //jump
        velocityY = -2;

        // reset game
        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

// function check  bird touch the pipe
function detectCollision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;

}           