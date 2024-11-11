#!/bin/bash

# Create the main game directory
mkdir -p hiragana_drop
cd hiragana_drop

# Create subdirectories
mkdir -p css js assets/sounds

# Create index.html
cat <<EOL > index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Hiragana Drop</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <canvas id="gameCanvas" width="400" height="600"></canvas>
  <input type="text" id="inputField" autocomplete="off" placeholder="Type romaji here">
  <button id="shareButton">Share Score</button>
  <script src="js/kana_converter.js"></script>
  <script src="js/game.js"></script>
</body>
</html>
EOL

# Create css/style.css
cat <<EOL > css/style.css
body {
  margin: 0;
  background-color: #222;
  display: flex;
  flex-direction: column;
  align-items: center;
}

#gameCanvas {
  background-color: #fff;
  border: 2px solid #000;
  margin-top: 20px;
}

#inputField {
  margin-top: 10px;
  padding: 10px;
  font-size: 18px;
  width: 380px;
}

#shareButton {
  margin-top: 10px;
  padding: 10px;
  font-size: 16px;
}
EOL

# Create js/kana_converter.js
cat <<'EOL' > js/kana_converter.js
// js/kana_converter.js

const KanaConverter = {
  hiraganaMap: {
    "あ": "a", "い": "i", "う": "u", "え": "e", "お": "o",
    "か": "ka", "き": "ki", "く": "ku", "け": "ke", "こ": "ko",
    "さ": "sa", "し": "shi", "す": "su", "せ": "se", "そ": "so",
    "た": "ta", "ち": "chi", "つ": "tsu", "て": "te", "と": "to",
    "な": "na", "に": "ni", "ぬ": "nu", "ね": "ne", "の": "no",
    "は": "ha", "ひ": "hi", "ふ": "fu", "へ": "he", "ほ": "ho",
    "ま": "ma", "み": "mi", "む": "mu", "め": "me", "も": "mo",
    "や": "ya", "ゆ": "yu", "よ": "yo",
    "ら": "ra", "り": "ri", "る": "ru", "れ": "re", "ろ": "ro",
    "わ": "wa", "を": "wo", "ん": "n",
    // Add more combinations if desired
  },

  getRandomHiragana() {
    const hiraganaChars = Object.keys(this.hiraganaMap);
    return hiraganaChars[Math.floor(Math.random() * hiraganaChars.length)];
  },

  toRomaji(hiraganaChar) {
    return this.hiraganaMap[hiraganaChar];
  },
};
EOL

# Create js/game.js
cat <<'EOL' > js/game.js
// js/game.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const inputField = document.getElementById('inputField');
const shareButton = document.getElementById('shareButton');

let fallingCharacters = [];
let gameSpeed = 1000; // Initial speed in milliseconds
let score = 0;
let isGameOver = false;
let highScore = localStorage.getItem('highScore') || 0;

// Character class
class FallingCharacter {
  constructor(hiragana, x, y, speed) {
    this.hiragana = hiragana;
    this.x = x;
    this.y = y;
    this.speed = speed;
  }

  draw() {
    ctx.font = '48px Arial';
    ctx.fillStyle = '#000';
    ctx.fillText(this.hiragana, this.x, this.y);
  }

  update() {
    this.y += this.speed;
  }
}

// Game functions
function spawnCharacter() {
  const hiragana = KanaConverter.getRandomHiragana();
  const x = Math.random() * (canvas.width - 50);
  const speed = 2 + score / 100; // Increase speed as score increases
  const character = new FallingCharacter(hiragana, x, 0, speed);
  fallingCharacters.push(character);
}

function updateGame() {
  if (isGameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw and update characters
  for (let i = 0; i < fallingCharacters.length; i++) {
    const char = fallingCharacters[i];
    char.update();
    char.draw();

    // Check if character has reached the bottom
    if (char.y > canvas.height) {
      gameOver();
      return;
    }
  }

  requestAnimationFrame(updateGame);
}

function startGame() {
  isGameOver = false;
  fallingCharacters = [];
  score = 0;
  gameSpeed = 1000;
  spawnCharacter();
  updateGame();
  gameLoop = setInterval(spawnCharacter, gameSpeed);
}

function gameOver() {
  isGameOver = true;
  clearInterval(gameLoop);

  if (score > highScore) {
    highScore = score;
    localStorage.setItem('highScore', highScore);
  }

  // Display Game Over screen
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = '36px Arial';
  ctx.fillStyle = '#fff';
  ctx.fillText('Game Over', canvas.width / 2 - 80, canvas.height / 2 - 20);
  ctx.fillText(`Score: ${score}`, canvas.width / 2 - 60, canvas.height / 2 + 20);
  ctx.fillText(`High Score: ${highScore}`, canvas.width / 2 - 90, canvas.height / 2 + 60);

  // Restart game on click
  canvas.addEventListener('click', restartGame);
}

function restartGame() {
  canvas.removeEventListener('click', restartGame);
  startGame();
}

// Event listeners
inputField.addEventListener('keyup', (e) => {
  const userInput = inputField.value.trim().toLowerCase();

  for (let i = 0; i < fallingCharacters.length; i++) {
    const char = fallingCharacters[i];
    const correctRomaji = KanaConverter.toRomaji(char.hiragana);

    if (userInput === correctRomaji) {
      // Remove character and increase score
      fallingCharacters.splice(i, 1);
      inputField.value = '';
      score += 10;
      return;
    }
  }
});

shareButton.addEventListener('click', () => {
  const shareText = `I scored ${score} points in Hiragana Drop! Can you beat my score?`;
  const shareUrl = encodeURIComponent(window.location.href);
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${shareUrl}`;
  window.open(twitterUrl, '_blank');
});

// Start the game on page load
window.onload = startGame;
EOL

# Create assets/sounds/ (empty for now, but ready for future sound files)
touch assets/sounds/.gitkeep

# Create README.md
cat <<EOL > README.md
# Hiragana Drop

Hiragana Drop is a fast-paced, Tetris-inspired game designed to help players memorize hiragana characters. Type the correct romaji transliteration to eliminate falling hiragana characters before they stack up to the top.

## How to Play

- Open \`index.html\` in your web browser.
- Hiragana characters will start falling from the top of the screen.
- Type the corresponding romaji in the input field to eliminate them.
- If a character reaches the bottom, the game is over.
- Your score increases with each correct answer.
- Try to beat your high score!

## Features

- Simple, addictive gameplay.
- Progressive difficulty: the game speeds up as your score increases.
- High score tracking using local storage.
- Share your score on Twitter.

## Future Enhancements

- Add sound effects and background music.
- Include all hiragana combinations and diacritic marks.
- Implement a global leaderboard.
- Add power-ups and special characters.

## License

This project is released under the MIT License.
EOL

echo "Setup complete! Navigate to the 'hiragana_drop' directory and open 'index.html' in your web browser to start the game."