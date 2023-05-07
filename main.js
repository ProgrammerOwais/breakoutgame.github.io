const grid = document.querySelector(".grid");
const result = document.querySelector(".result");
const start = document.querySelector(".start");
const playAgain = document.querySelector(".play-again");
let bgSound = new Audio("./audio/bgSound.mp3");
let blockCollideSound = new Audio("./audio/blockCollide.mp3");
let winSound = new Audio("./audio/win.mp3");
let loseSound = new Audio("./audio/lose.mp3");
playAgain.style.display = "none";

let score = 0;
const blockWidth = 100;
const blockHeight = 20;
const boardWidth = 560;
const boardHeight = 300;
const userStart = [230, 10];
let userCurrentPosition = userStart;
const ballStart = [270, 40];
let ballCurrentPosition = ballStart;
let xDirection = -2;
let yDirection = 2;
let ballTimer;
let ballDiameter = 20;

class Block {
  constructor(xAxis, yAxis) {
    this.bottomLeft = [xAxis, yAxis];
    this.bottomRight = [xAxis + blockWidth, yAxis];
    this.topLeft = [xAxis, yAxis + blockHeight];
    (this.topRight = xAxis + blockWidth), yAxis + blockHeight;
  }
}

const blocks = [
  new Block(10, 270),
  new Block(120, 270),
  new Block(230, 270),
  new Block(340, 270),
  new Block(450, 270),
  new Block(10, 240),
  new Block(120, 240),
  new Block(230, 240),
  new Block(340, 240),
  new Block(450, 240),
  new Block(10, 210),
  new Block(120, 210),
  new Block(230, 210),
  new Block(340, 210),
  new Block(450, 210),
];
// Add blocks
function addBlocks(params) {
  for (let i = 0; i < blocks.length; i++) {
    const block = document.createElement("div");
    block.classList.add("block");

    block.style.left = blocks[i].bottomLeft[0] + "px";
    block.style.bottom = blocks[i].bottomLeft[1] + "px";
    grid.appendChild(block);
  }
}
addBlocks();

// Add user
const user = document.createElement("div");
user.classList.add("user");
user.style.bottom = userCurrentPosition[1] + "px";
drawUser();
grid.appendChild(user);

// draw user
function drawUser(params) {
  user.style.left = userCurrentPosition[0] + "px";
}

// Move User
function moveUser(e) {
  switch (e.key) {
    case "ArrowLeft":
      if (userCurrentPosition[0] > 0) {
        userCurrentPosition[0] -= 10;
        drawUser();
      }
      break;
    case "ArrowRight":
      if (userCurrentPosition[0] < boardWidth - blockWidth) {
        userCurrentPosition[0] += 10;
        drawUser();
      }
      break;
    default:
      break;
  }
}
document.addEventListener("keydown", moveUser);

// add ball
const ball = document.createElement("div");
ball.classList.add("ball");
drawBall();
grid.appendChild(ball);

// draw ball
function drawBall(params) {
  ball.style.left = ballCurrentPosition[0] + "px";
  ball.style.bottom = ballCurrentPosition[1] + "px";
}
let playsound = 0;
function moveBall(params) {
  ballCurrentPosition[0] += xDirection;
  ballCurrentPosition[1] += yDirection;
  drawBall();

  checkForCollisions();
}

function checkForCollisions(params) {
  // check for block collision
  for (let i = 0; i < blocks.length; i++) {
    if (
      ballCurrentPosition[0] > blocks[i].bottomLeft[0] &&
      ballCurrentPosition[0] < blocks[i].bottomRight[0] &&
      ballCurrentPosition[1] + ballDiameter > blocks[i].bottomLeft[1] &&
      ballCurrentPosition[1] < blocks[i].topLeft[1]
    ) {
      const allBlocks = Array.from(document.querySelectorAll(".block"));
      allBlocks[i].classList.remove("block");
      blocks.splice(i, 1);
      blockCollideSound.play();
      setTimeout(() => {
        blockCollideSound.pause();
        blockCollideSound.currentTime = 0;
      }, 200);

      score++;
      result.textContent = score;
      changeDiraction();

      // check for win
      if (blocks.length === 0) {
        result.textContent = "You Win";
        playAgain.style.display = "block";
        clearInterval(ballTimer);
        document.removeEventListener("keydown", moveUser);
        winSound.play();
        bgSound.pause();
        bgSound.currentTime = 0;
      }
    }
  }
  // check for border collision
  if (
    ballCurrentPosition[0] >= boardWidth - ballDiameter ||
    ballCurrentPosition[1] >= boardHeight - ballDiameter ||
    ballCurrentPosition[0] <= 0
  ) {
    changeDiraction();
  }

  // check for user collision
  if (
    ballCurrentPosition[0] > userCurrentPosition[0] &&
    ballCurrentPosition[0] < userCurrentPosition[0] + blockWidth &&
    ballCurrentPosition[1] > userCurrentPosition[1] &&
    ballCurrentPosition[1] < userCurrentPosition[1] + blockHeight
  ) {
    blockCollideSound.play();
    changeDiraction();
  }
  if (ballCurrentPosition[1] <= 0) {
    // check for bottom border collision
    clearInterval(ballTimer);
    result.textContent = "You Lose";
    loseSound.play();
    bgSound.pause();

    playAgain.style.display = "block";
    bgSound.currentTime = 0;
  }
}
// Change the ball direction
function changeDiraction(params) {
  if (xDirection === 2 && yDirection === 2) {
    yDirection = -2;
    return;
  }
  if (xDirection === 2 && yDirection === -2) {
    xDirection = -2;
    return;
  }
  if (xDirection === -2 && yDirection === -2) {
    yDirection = 2;
    return;
  }
  if (xDirection === -2 && yDirection === 2) {
    xDirection = 2;
    return;
  }
}
start.addEventListener("click", () => {
  ballTimer = setInterval(moveBall, 20);
  bgSound.play();
  start.style.display = "none";
});
playAgain.addEventListener("click", () => document.location.reload());
