//reference:
//Colorful Coding
//https://www.youtube.com/watch?v=gZ7wWQEvUBQ&t=324s
//Mr. Erdreich
//https://www.youtube.com/watch?v=FZlpuQeCvlk
//Coding Train
//https://www.youtube.com/watch?v=AaGK-fj-BAM
//flower ong
//https://www.cleanpng.com/png-cherry-blossom-flower-clip-art-sakura-flower-4786533/

//To do list was moved to Trello, a png is on git

const WELCOME_SCREEN = 0;
const INTERMEDIATE_SCREEN = 1;
const GAMEOVER_SCREEN = 2;
const GAME_WON = 3;

let currentScreen = WELCOME_SCREEN;

let pauseOn;

let gridSize;

let spaceBuffer;

//snake
let snakeX;
let snakeY;
let direction = 0;
let snakeSpeed;
let snakeTail = [];
let snakeLength;
let snakeSegment;

//food
let foodX;
let foodY;

let poisonX;
let poisonY;

function preload() {
  cherryBlossom = loadImage("cherry-blossom.png");
  poisonBottle = loadImage("poison.png");
}

function setup() {
  var canvas = createCanvas((windowHeight - 20) * 1.4, windowHeight - 20);
  background(53);
  frameRate(15);

  canvas.parent("snake-game");

  gridSize = height / 25;

  rectMode(CENTER);
}

function createGrid(gridSize) {
  stroke(231, 206, 199);
  let x = 0;
  let y = 0;
  fill(255);
  textAlign(LEFT);
  //The loop runs 35 times, because the of the canvas width
  for (let i = 0; i < 35; i++) {
    line(x, 0, x, height);
    x += gridSize;
    line(0, y, width, y);
    y += gridSize;
  }
}

function draw() {
  //Jason helped me implement the switch statement, to make my code cleaner
  switch (currentScreen) {
    case WELCOME_SCREEN:
      screen_Welcome();
      break;
    case INTERMEDIATE_SCREEN:
      screen_Intermediate();
      break;
    case GAME_WON:
      screen_Won();
      break;
    case GAMEOVER_SCREEN:
      screen_Lost();
      break;
  }
}

function screen_Welcome() {
  console.log("Entering Welcome Screen");
  background(251, 226, 219, 200);
  gridSize = height / 25;
  createGrid(gridSize);

  push();
  fill(94, 80, 103);
  textAlign(CENTER, CENTER);
  textSize(gridSize);
  text(
    "Use the arrow keys to navigate the snake. \nEat the flowers to grow the Snake, as long as you can. \nDon't eat the poison, it makes you shrink! \nPress SPACE to start. Press SPACE to pause the game.\nGood luck!",
    width / 2,
    height / 2 - 50
  );
  pop();

  image(
    cherryBlossom,
    width / 2 - gridSize * 2,
    height / 2 + 70,
    gridSize * 4,
    gridSize * 4
  );

  snakeX = width / 2;
  snakeY = height / 2;
  snakeSpeed = 1;
  snakeLength = 1;
  snakeSegment = 1;
  snakeTail = [];

  snake();

  direction = 0;

  pauseOn = false;

  foodX = Math.floor(random(gridSize * 2, width - gridSize * 2));
  foodY = Math.floor(random(gridSize * 2, height - gridSize * 2));

  poisonX = Math.floor(random(gridSize * 2, width - gridSize * 2));
  poisonY = Math.floor(random(gridSize * 2, height - gridSize * 2));

  //border
  push();
  noFill();
  stroke("#5e5067");
  strokeWeight(gridSize * 2);

  rect(width / 2, height / 2, width, height);
  pop();

  if (keyIsDown(32)) {
    spaceBuffer = second();
    currentScreen = INTERMEDIATE_SCREEN;
  }
}

function screen_Intermediate() {
  console.log("Entering Intermediate Screen");
  background(251, 226, 219, 200);

  createGrid(gridSize);

  ////game controls
  if (keyIsDown(37) && direction !== 2) {
    direction = 0; //left
  }
  if (keyIsDown(38) && direction !== 3) {
    direction = 1; //up
  }
  if (keyIsDown(39) && direction !== 0) {
    direction = 2; //right
  }
  if (keyIsDown(40) && direction !== 1) {
    direction = 3; //down
  }

  //My keyPressed function didn't work, so Jason helped me implement the switch statement to change the direction of the snake.
  switch (direction) {
    case 0: //left
      snakeX -= gridSize * snakeSpeed;
      break;
    case 1: //up
      snakeY -= gridSize * snakeSpeed;
      break;
    case 2: //right
      snakeX += gridSize * snakeSpeed;
      break;
    case 3: //down
      snakeY += gridSize * snakeSpeed;
      break;
  } //close game controls

  //edge death
  if (
    snakeX > width - gridSize ||
    snakeX < gridSize ||
    snakeY > height - gridSize ||
    snakeY < gridSize
  ) {
    currentScreen = GAMEOVER_SCREEN;
  }

  //makes a new food item appear at a random postition, once the position of the snake and the old food item match up the counter adds length to the snake with each food item
  if (
    snakeX + gridSize >= foodX &&
    snakeX - gridSize <= foodX &&
    snakeY + gridSize >= foodY &&
    snakeY - gridSize <= foodY
  ) {
    foodX = Math.floor(random(20, width - 20));
    foodY = Math.floor(random(20, height - 20));
    //pickUp.play();
    snakeLength += snakeSegment;
    console.log("Score: " + snakeLength);
    console.log("Food has been eaten");
  }

  if (
    snakeX + gridSize >= poisonX &&
    snakeX - gridSize <= poisonX &&
    snakeY + gridSize >= poisonY &&
    snakeY - gridSize <= poisonY
  ) {
    poisonX = Math.floor(random(20, width - 20));
    poisonY = Math.floor(random(20, height - 20));
    snakeLength -= 2;
    console.log("Score: " + snakeLength);
    console.log("Poison has been ingested.");
  }

  if (snakeSpeed > 0) {
    snakeTail.push({ x: snakeX, y: snakeY });
    //Nils helped me with the if condition, to make the snake grow corrently
    if (snakeTail.length > snakeLength) {
      snakeTail.shift();
    }
  }

  food(foodX, foodY);

  if (second() % 5 == 0) {
    poisonX = Math.floor(random(20, width - 20));
    poisonY = Math.floor(random(20, height - 20));
  }

  poison(poisonX, poisonY);
  if (snakeTail.length > snakeLength) {
    snakeTail.shift();
  }

  snake(snakeX, snakeY);

  showTail();

  eatsItself();

  if (snakeLength <= 0) {
    currentScreen = GAMEOVER_SCREEN;
  }

  //shows score
  push();
  noStroke();
  fill(94, 80, 103, 200);
  textAlign(CENTER, CENTER);
  textSize(gridSize * 1.5);
  text("Score: " + snakeLength, width / 2, gridSize * 3);
  pop();

  //pause
  if (spaceBuffer !== second()) {
    if (keyIsDown(32)) {
      spaceBuffer = second();
      if (pauseOn === true) {
        snakeSpeed = 1;
        pauseOn = false;
      } else {
        pauseOn = true;
        snakeSpeed = 0;
      }
    }
  }

  if (pauseOn == true) {
    screen_Pause();
    snakeSpeed = 0;
  } //pause close

  //border
  push();
  noFill();
  stroke("#5e5067");
  strokeWeight(gridSize * 2);

  rect(width / 2, height / 2, width, height);
  pop();
}

function screen_Pause() {
  push();
  rectMode(CENTER);
  fill(94, 80, 103);
  rect(width / 2, height / 2, gridSize * 13, gridSize * 5, 8);
  fill(251, 226, 219);
  textAlign(CENTER, CENTER);
  textSize(gridSize * 2);
  text("PAUSE", width / 2, height / 2 - gridSize);
  textSize(gridSize);
  text("Press SPACE to continue.", width / 2, height / 2 + gridSize);
  pop();
  //some sort of pop up, code some square or add a png?
}

function screen_Lost() {
  push();
  noStroke();
  rectMode(CENTER);
  fill(94, 80, 103);
  rect(width / 2, height / 2, gridSize * 17, gridSize * 7, 8);
  fill(251, 226, 219);
  textAlign(CENTER, CENTER);
  textSize(gridSize * 2);
  text("Your Score is " + snakeLength, width / 2, height / 2 - gridSize / 2);
  textSize(gridSize);
  text("You bumped something.", width / 2, height / 2 + gridSize);
  text("Press SPACE to restart.", width / 2, height / 2 + gridSize * 2.1);
  pop();
  snakeSpeed = 0;
  statusMessage = 1;

  if (keyIsDown(32)) {
    console.log("restart");
    spaceBuffer = second();
    currentScreen = WELCOME_SCREEN;
  }
}

function snake(snakeX, snakeY) {
  fill(94, 80, 103, 200);
  stroke(94, 80, 103);
  rect(snakeX, snakeY, gridSize, gridSize, 20);
}

function showTail() {
  for (let i = 0; i < snakeTail.length; i++) {
    fill(94, 80, 103, 200);
    stroke(94, 80, 103);
    rect(snakeTail[i].x, snakeTail[i].y, gridSize, gridSize, 3);
  }
}

function food(foodX, foodY) {
  noStroke();
  fill(217, 169, 191);
  image(
    cherryBlossom,
    foodX - gridSize / 2,
    foodY - gridSize / 2,
    gridSize,
    gridSize
  );
}

function poison(poisonX, poisonY) {
  noStroke();
  fill(0, 0, 255);
  image(
    poisonBottle,
    poisonX - gridSize / 2,
    poisonY - gridSize / 2,
    gridSize,
    gridSize
  );
}

//Nils helped me figure out the correct way for implementing the for loop that checks, whether the snake hit itself
function eatsItself() {
  for (let i = 0; i < snakeTail.length - 1; i++) {
    if (
      snakeTail[i].x === snakeTail[snakeTail.length - 1].x &&
      snakeTail[i].y === snakeTail[snakeTail.length - 1].y
    ) {
      console.log("Snake is dead.");
      currentScreen = GAMEOVER_SCREEN;
    }
  }
}
