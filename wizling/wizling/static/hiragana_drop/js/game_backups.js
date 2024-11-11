// js/game.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let fallingCharacters = [];
let gameSpeed = 1000;  // Initial speed (in milliseconds)
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let romajiOptions = [];
let currentDensity = 1; // Start with 1 character
let gameLoop, densityInterval;
let isGameOver = false;
let selectedOptionIndex = -1; // Track the selected option for visual feedback

// Character class for falling hiragana characters
class FallingCharacter {
  constructor(hiragana, x, speed) {
    this.hiragana = hiragana;
    this.x = x;
    this.y = 0;  // Start at the top of the canvas
    this.speed = speed;
  }

  draw(isActive = false) {
    ctx.font = `${0.06 * canvas.width}px Arial`;
    ctx.fillStyle = isActive ? '#ff0000' : '#000'; // Highlight bottom-most character
    ctx.fillText(this.hiragana, this.x, this.y);
  }

  update() {
    this.y += this.speed;
  }
}

// Function to spawn a new hiragana character
function spawnCharacter() {
  if (fallingCharacters.length < currentDensity) {
    const hiragana = KanaConverter.getRandomHiragana();
    const x = Math.random() * (canvas.width - 50);
    const speed = 1 + Math.random() * 1.5; // Random speed for falling characters
    fallingCharacters.push(new FallingCharacter(hiragana, x, speed));

    // Generate new romaji options only if this is the first character
    if (fallingCharacters.length === 1) {
      generateRomajiOptions();
      drawRomajiOptions(); // Draw immediately to prevent flashing
    }
  }
}

// Function to generate romaji options for the current bottom-most character
function generateRomajiOptions() {
  romajiOptions = [];
  const correctRomaji = KanaConverter.toRomaji(fallingCharacters[0].hiragana);
  romajiOptions.push(correctRomaji);

  // Fill the rest of the options with random romaji
  while (romajiOptions.length < 5) {
    const randomRomaji = KanaConverter.getRandomRomaji();
    if (!romajiOptions.includes(randomRomaji)) {
      romajiOptions.push(randomRomaji);
    }
  }

  // Shuffle the options
  romajiOptions.sort(() => Math.random() - 0.5);
}

// Function to draw the romaji options at the bottom of the canvas
function drawRomajiOptions() {
  const optionBoxWidth = canvas.width / 6;
  const optionBoxHeight = canvas.height / 12;
  const spacing = optionBoxWidth / 6;
  const totalWidth = (optionBoxWidth + spacing) * romajiOptions.length - spacing;
  const startX = (canvas.width - totalWidth) / 2;
  const y = canvas.height - optionBoxHeight * 1.5;

  ctx.font = `${0.025 * canvas.width}px Arial`;

  romajiOptions.forEach((option, index) => {
    const x = startX + index * (optionBoxWidth + spacing);

    // Draw bounding box for each option
    ctx.fillStyle = (selectedOptionIndex === index) ? '#aaa' : '#ddd'; // Highlight if selected
    ctx.fillRect(x, y, optionBoxWidth, optionBoxHeight);

    // Draw the text in the center of each box
    ctx.fillStyle = '#000';
    const textX = x + optionBoxWidth / 2 - ctx.measureText(option).width / 2;
    const textY = y + optionBoxHeight / 2 + 8;
    ctx.fillText(option, textX, textY);
  });
}

// Function to update the game state
function updateGame() {
  if (isGameOver) return;

  // Clear only the area used for falling characters, leave options intact
  ctx.clearRect(0, 0, canvas.width, canvas.height - canvas.height / 6);

  // Update and draw falling characters
  let bottomMostIndex = -1;
  let bottomMostY = -1;

  for (let i = 0; i < fallingCharacters.length; i++) {
    const char = fallingCharacters[i];
    char.update();

    // Identify the bottom-most character
    if (char.y > bottomMostY) {
      bottomMostY = char.y;
      bottomMostIndex = i;
    }

    // If character has reached the bottom, trigger game over
    if (char.y > canvas.height) {
      gameOver();
      return;
    }

    char.draw(i === bottomMostIndex);
  }

  // Continue the game loop
  requestAnimationFrame(updateGame);
}

// Function to handle game over
function gameOver() {
  isGameOver = true;
  clearInterval(gameLoop);
  clearInterval(densityInterval);

  if (score > highScore) {
    highScore = score;
    localStorage.setItem('highScore', highScore);
  }

  // Display Game Over message
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = '36px Arial';
  ctx.fillStyle = '#fff';
  ctx.fillText('Game Over', canvas.width / 2 - 80, canvas.height / 2 - 20);
  ctx.fillText(`Score: ${score}`, canvas.width / 2 - 60, canvas.height / 2 + 20);
  ctx.fillText(`High Score: ${highScore}`, canvas.width / 2 - 90, canvas.height / 2 + 60);

  canvas.addEventListener('click', restartGame);
}

// Function to restart the game
function restartGame() {
  canvas.removeEventListener('click', restartGame);
  startGame();
}

// Function to start the game
function startGame() {
  isGameOver = false;
  fallingCharacters = [];
  score = 0;
  currentDensity = 1;

  // Set up the main game loop
  gameLoop = setInterval(spawnCharacter, gameSpeed);

  // Gradually increase the density of falling characters over time
  densityInterval = setInterval(() => {
    if (currentDensity < 4) { // Hard-coded max density of 4 for simplicity
      currentDensity++;
    }
  }, 15000); // Increase density every 15 seconds

  // Initial draw for romaji options
  drawRomajiOptions();
  updateGame();
}

// Event listener for clicking on romaji options
canvas.addEventListener('mousedown', (event) => {
  if (isGameOver) return;

  const mouseX = event.clientX - canvas.offsetLeft;
  const mouseY = event.clientY - canvas.offsetTop;
  const y = canvas.height - canvas.height / 12 * 1.5;

  const optionBoxWidth = canvas.width / 6;
  const optionBoxHeight = canvas.height / 12;
  const spacing = optionBoxWidth / 6;
  const totalWidth = (optionBoxWidth + spacing) * romajiOptions.length - spacing;
  const startX = (canvas.width - totalWidth) / 2;

  romajiOptions.forEach((option, index) => {
    const x = startX + index * (optionBoxWidth + spacing);
    if (
      mouseX >= x &&
      mouseX <= x + optionBoxWidth &&
      mouseY >= y &&
      mouseY <= y + optionBoxHeight
    ) {
      // Set the selected option index for visual feedback
      selectedOptionIndex = index;
      drawRomajiOptions();

      // If the answer is correct, handle the result
      if (option === KanaConverter.toRomaji(fallingCharacters[0].hiragana)) {
        fallingCharacters.shift(); // Remove the correct character
        score += 10;

        // Generate new options after correct answer
        generateRomajiOptions();
      }
    }
  });
});

// Event listener for mouse up to remove visual feedback
canvas.addEventListener('mouseup', () => {
  selectedOptionIndex = -1;
  drawRomajiOptions();
});

// Start the game when the page loads
window.onload = startGame;
