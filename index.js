console.log("helllo!!");

let ball = document.getElementById("ball");
let rod1 = document.getElementById("rod1");
let rod2 = document.getElementById("rod2");

const storeName = "PPName"; //winner rod name in localStorage
const storeScore = "PPMaxScore"; // maximum score
const rod1Name = "Rod 1";
const rod2Name = "Rod 2";

let score, // current score of winner rod
  maxScore, // maximum score till now
  movement, // a function
  rod, // winner rod name
  ballSpeedX = 2, // ball speed horizontally
  ballSpeedY = 2; // ball speed vertically

let gameOn = false;

let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

(function () {
  console.log("winner announcement");

  rod = localStorage.getItem(storeName); // returning the winner rodName to rod
  maxScore = localStorage.getItem(storeScore);
  if (rod === "null" || maxScore === "null") {
    alert("Welcome!!  Let's play");
    maxScore = 0;
    rod = "Rod1";
  } else {
    alert("Winner is: " + rod + "  with Maximum score of: " + maxScore * 100);
  }
  resetBoard(rod);
})();

function resetBoard(rodName) {
  console.log("restBoard started");
  rod1.style.left = (window.innerWidth - rod1.offsetWidth) / 2 + "px";
  rod2.style.left = (window.innerWidth - rod2.offsetWidth) / 2 + "px";
  ball.style.left = (windowWidth - ball.offsetWidth) / 2 + "px";
  //   ball.style.top = (windowHeight - ball.offSetHeight) / 2 + "px"; // this is not required as ball will be on loosing rod

  if (rodName === rod1Name) {
    // if winner is rod1 the ball should be on rod2
    ball.style.top = rod2.offsetTop - rod2.offsetHeight + "px";
    ballSpeedY = 2;
  } else if (rodName === rod2Name) {
    // if winner is rod2 the ball should be on rod1
    ball.style.top = rod1.offsetTop + rod1.offsetHeight + "px";
    ballSpeedY = -2;
  }
  score = 0;
  gameOn = false;
}

function storeWin(rod, score) {
  if (score > maxScore) {
    maxScore = score;
    localStorage.setItem(storeScore, score);
    localStorage.setItem(storeName, rod);
  }
  clearInterval(movement);
  resetBoard(rod);
  alert(
    "Winner: " + rod + " Score:" + score * 100 + " MaxScore:" + maxScore * 100
  );
}

window.addEventListener("keypress", function () {
  console.log("keypressed Event started");
  let rodSpeed = 20;
  let rodRect = rod1.getBoundingClientRect();
  if (event.code === "KeyD" && window.innerWidth > rodRect.x + rodRect.width) {
    rod1.style.left = rodRect.x + rodSpeed + "px";
    rod2.style.left = rod1.style.left;
  } else if (event.code === "KeyA" && rodRect.x > 0) {
    rod1.style.left = rodRect.x - rodSpeed + "px";
    rod2.style.left = rod1.style.left;
  }

  if (event.code === "Enter") {
    if (!gameOn) {
      gameOn = true;
      let ballRect = ball.getBoundingClientRect();
      let ballX = ballRect.x;
      let ballY = ballRect.y;
      let ballDia = ballRect.width;

      let rod1Height = rod1.offsetHeight;
      let rod2Height = rod2.offsetHeight;
      let rod1Width = rod1.offsetWidth;
      let rod2Width = rod2.offsetWidth;

      //move ball function
      movement = setInterval(() => {
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        rod1X = rod1.getBoundingClientRect().x;
        rod2X = rod2.getBoundingClientRect().x;
        ball.style.left = ballX + "px";
        ball.style.top = ballY + "px";
        //for left and right strike direction will get change
        if (ballX + ballDia > windowWidth || ballX < 0) {
          ballSpeedX = -ballSpeedX;
        }
        let ballPos = ballX + ballDia / 2;

        // if ball has touched the line of return-back of rod1
        if (ballY <= rod1Height) {
          ballSpeedY = -ballSpeedY;
          score++;
          if (ballPos < rod1X || ballPos > rod1X + rod1Width) {
            storeWin(rod2Name, score);
          }
        } else if (ballY + ballDia >= windowHeight - rod2Height) {
          ballSpeedY = -ballSpeedY;
          score++;
          if (ballPos < rod2X || ballPos > rod2X + rod2Width) {
            storeWin(rod1Name, score);
          }
        }
      }, 10);
    }
  }
});
