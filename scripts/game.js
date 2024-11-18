// Game board parameters
let game;
let gameWidth = 1000;
let gameHeight = 1000;
let context;

// Paddle parameters
let paddleWidth = 160;
let paddleHeight = 20;
let paddleSpeedX = 20;

// Paddle object that is drawn on canvas
let paddle = {
   x: gameWidth / 2 - paddleWidth / 2,
   y: gameHeight - paddleHeight - 10,
   width: paddleWidth,
   height: paddleHeight,
   speedX: paddleSpeedX
}

// Ball parameters
let ballWidth = 15;
let ballHeight = 20;
let ballSpeedX = 2;
let ballSpeedY = 2.5;

// Ball object that is drawn on canvas
let ball = {
   x: gameWidth/2 - ballWidth/2,
   y: gameHeight - 15 -paddleHeight - ballHeight,
   width: ballWidth,
   height: ballHeight,
   speedX: ballSpeedX,
   speedY: ballSpeedY
}

// Block parameters
let blocks = [];
let blockWidth = 100;
let blockHeight = 25;
let blockColumns = 8; // Blocks in row
let blockRows = 4; // Blocks in column
let blockCount = 0;

// Inital block drawing position
let blockX = 30;
let blockY = 45;

// Score
let score = 0;
let highScore = localStorage.getItem('highScore');

// Game start
let gameover = false;

window.onload = function(){

   // Get canvas context
   game = document.getElementById('canvas');
   game.width = gameWidth;
   game.height = gameHeight;
   context = game.getContext('2d');

   if(!highScore){
      highScore = 0;
   }

   // Fill blocks array
   createBlocks();

   // Random starting direction of ball in range of +- 20
   ball.speedX = Math.random() * 2 * 20 - 20;

   // Add key press event listener
   document.addEventListener('keydown', movepaddle);

   // Start game loop
   requestAnimationFrame(update);
}

// Game loop
function update(){
   requestAnimationFrame(update);

   // Check if all are blocks broken
   if(blockCount == 0){
      context.font = '50px Arial';
      context.fillStyle = 'White';
      context.fillText('YOU WIN!!!', gameWidth/2 - 150, gameHeight/2);
      if (score > highScore){
         localStorage.setItem('highScore', score);
      }
      gameover = true;
   }

   if(gameover){
      return;
   }
   // Clear the canvas
   context.clearRect(0, 0, gameWidth, gameHeight);
   

   // Draw paddle

   // Create a vertical linear gradient for the paddle
   let verticalGradient = context.createLinearGradient(0, paddle.y, 0, paddle.y + paddle.height);

   // Add color stops for the gradient
   verticalGradient.addColorStop(0, 'darkred');   // Dark red at the top edge
   verticalGradient.addColorStop(0.5, 'red');     // Red in the center
   verticalGradient.addColorStop(1, 'darkred');   // Dark red at the bottom edge

   // Set the gradient as the fill style
   context.fillStyle = verticalGradient;

   // Draw the paddle
   context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

   // Draw ball

   context.fillStyle = 'white';
   ball.x += ball.speedX; // Move the ball on x-axis
   ball.y += ball.speedY; // Move the ball on y-axis

   // Draw the ball
   context.fillRect(ball.x, ball.y, ball.width, ball.height);

   // Bounce the ball off walls
   if (ball.y <= 0){
      // Top of canvas
      ball.speedY *= -1;
   } else if ( ball.x <= 0 || ball.x + ball.width >= gameWidth){
      // Left or right of canvas
      ball.speedX *= -1;
   } else if (ball.y + ball.height >= gameHeight){
      // Bottom of canvas
      // GAME OVER
      context.font = '50px Arial';
      context.fillText('GAME OVER!', gameWidth/2 - 150, gameHeight/2);
      if (score > highScore){
         localStorage.setItem('highScore', score);
      }
      gameover = true;
   }

   // Bounce the ball off paddle
   if (topCollision(ball, paddle) || bottomCollision(ball, paddle) ||
         leftCollision(ball, paddle) || rightCollision(ball, paddle)){
      ball.speedY *= -1;
      // Adjuct ball speed on x-axis based on where it hits the paddle 
      let hitPoint = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
      ball.speedX = hitPoint * ballSpeedX;
   }


   // Draw blocks
   for(i = 0; i < blocks.length; i++){
      let block = blocks[i];
      if (!block.break) {
         // Check ball collision with block
         if (topCollision(ball, block) || bottomCollision(ball, block)){
            ball.speedY *= -1;
            block.break = true;
            blockCount--;
            score += 1;
         } else if (leftCollision(ball, block) || rightCollision(ball, block)){
            ball.speedX *= -1;
            block.break = true;
            blockCount--;
            score += 1;
         }

         // Draw block

         // Create a vertical linear gradient for the block
         let verticalGradient = context.createLinearGradient(0, block.y, 0, block.y + block.height);

         // Add color stops for the gradient
         verticalGradient.addColorStop(0, 'darkred');   // Dark red at the top edge
         verticalGradient.addColorStop(0.5, 'red');     // Red in the center
         verticalGradient.addColorStop(1, 'darkred');   // Dark red at the bottom edge

         // Set the gradient as the fill style
         context.fillStyle = verticalGradient;
         // Draw the block
         context.fillRect(block.x, block.y, block.width, block.height);
      }
   }


   // Draw score board
   context.font = '20px Arial';
   context.fillText('Score: ' + score, gameWidth-280, 30);
   context.fillText('High Score: ' + highScore, gameWidth-160, 30);
}

// Paddle movement on key press
function movepaddle(e) {
   if(e.code == "ArrowLeft"){
      var x = paddle.x - paddle.speedX; // Next x position of paddle
      if(x >= 0){ // Check if out of bounds
         paddle.x = x;
      }
   } else if (e.code == "ArrowRight"){
      var x = paddle.x + paddle.speedX;
      if(x + paddle.width <= gameWidth){
         paddle.x = x;
      }
   }

}


//Collision detection

function detectCollision(a, b) {
   // Intersection of two rectangles
   return a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
}

// Ball above block/paddle
function topCollision(ball, block) {
   return detectCollision(ball, block) &&  // Rectangles interesect
   (ball.y + ball.height) >= block.y &&  // Ball bottom passed block top
   ball.y < block.y // Ball top above block top
}
// Ball below block/paddle
function bottomCollision(ball, block) {
   return detectCollision(ball, block) &&  // Rectangles interesect
   ball.y <= (block.y + block.height) &&  // Ball top passed block bottom
   (ball.y + ball.height) > (block.y + block.height) // ball bottom below block bottom
}
// Ball left of block/paddle
function leftCollision(ball, block) {
   return detectCollision(ball, block) &&  // Rectangles interesect
   (ball.x + ball.width) >= block.x && // Ball right passed block left
   ball.x < block.x // Ball left is left of block left
}
// Ball right of block/paddle
function rightCollision(ball, block) {
   return detectCollision(ball, block) &&  // Rectangles interesect
   ball.x <= (block.x + block.width) && // Ball left passed block right
   (ball.x + ball.width) > (block.x + block.width) // Ball right is right of block right
}

function createBlocks(){
   blocks = []; // Clear array
   for (let i = 0; i < blockColumns; i++){
      for (let j = 0; j < blockRows; j++){
         blocks.push({
            x: blockX + i * (blockWidth + 20),
            y: blockY + j * (blockHeight + 25),
            width: blockWidth,
            height: blockHeight,
            break: false
         });
      }
   }
   blockCount = blocks.length;
}