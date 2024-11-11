import FallingCharacter from './character.js';
import { generateRomajiOptions, drawRomajiOptions } from './romajioptions.js';

export default class Game {
  constructor(canvas, ctx, KanaConverter) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.KanaConverter = KanaConverter;
    this.resetGameState();

    this.init();
  }

  init() {
    this.bindEventListeners();
    this.startGame();
  }

  bindEventListeners() {
    this.canvas.addEventListener('mousedown', this.handleClick.bind(this));
    this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
  }

  resetGameState() {
    this.fallingCharacters = [];
    this.romajiOptions = [];
    this.gameSpeed = 1000; // Control character spawn speed in milliseconds
    this.characterFallSpeed = 1.2; // Initial fall speed for characters
    this.currentDensity = 1; // Start with 1 character density
    this.score = 0;
    this.highScore = localStorage.getItem('highScore') || 0;
    this.selectedOptionIndex = -1;
    this.isGameOver = false;
    this.maxMistakes = 3;
    this.mistakesMade = 0;
    this.correctStreak = 0; // Track correct answers in a row for speed increase
    this.version = "v1.101"; // Version identifier for debugging
  }

  startGame() {
    this.resetGameState();
    this.clearIntervals();

    this.spawnCharacter();
    this.updateGame();

    // Spawn characters at a fixed rate
    this.gameLoop = setInterval(() => this.spawnCharacter(), this.gameSpeed);
    this.densityInterval = setInterval(() => this.increaseDensity(), 30000);
  }

  clearIntervals() {
    clearInterval(this.gameLoop);
    clearInterval(this.densityInterval);
  }

  spawnCharacter() {
    if (this.fallingCharacters.length >= this.currentDensity) return;

    const hiragana = this.KanaConverter.getRandomHiragana();
    if (!hiragana || typeof hiragana !== 'string') {
      console.error("Failed to generate a valid hiragana character:", hiragana);
      return;
    }

    const x = Math.random() * (this.canvas.width - 50);
    const speed = this.characterFallSpeed;

    this.fallingCharacters.push(new FallingCharacter(hiragana, x, speed, this.ctx));
    console.log(`New character spawned: ${hiragana}`);

    // Generate romaji options if necessary
    if (this.fallingCharacters.length === 1) {
      this.generateRomajiOptionsForFirstCharacter(hiragana);
    }
  }

  generateRomajiOptionsForFirstCharacter(hiragana) {
    this.romajiOptions = generateRomajiOptions(hiragana);
    if (!this.romajiOptions.includes(this.KanaConverter.toRomaji(hiragana))) {
      console.error("Generated options do not include the correct answer. Character:", hiragana);
    }
    drawRomajiOptions(this.ctx, this.canvas, this.romajiOptions, this.selectedOptionIndex);
  }

  increaseDensity() {
    if (this.currentDensity < 4) {
      this.currentDensity++;
      console.log("Increased character density to:", this.currentDensity);
    }
  }

  updateGame() {
    if (this.isGameOver) return;

    this.clearGameCanvas();
    this.updateFallingCharacters();
    this.drawMistakes();
    this.drawVersion();

    requestAnimationFrame(this.updateGame.bind(this));
  }

  clearGameCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height - this.canvas.height / 6);
  }

  updateFallingCharacters() {
    let bottomMostIndex = -1;
    let bottomMostY = -1;

    for (let i = 0; i < this.fallingCharacters.length; i++) {
      const char = this.fallingCharacters[i];
      char.update();

      if (char.y > bottomMostY) {
        bottomMostY = char.y;
        bottomMostIndex = i;
      }

      if (char.y > this.canvas.height) {
        this.handleMistake();
        this.fallingCharacters.splice(i, 1);
        i--;
      } else {
        char.draw(i === bottomMostIndex);
      }
    }
  }

  gameOver() {
    this.isGameOver = true;  // Ensure the game stops updating
    this.clearIntervals();   // Stop any ongoing intervals

    this.updateHighScore();
    this.drawGameOverScreen();
    this.addPlayAgainButtonListener();
  }

  updateHighScore() {
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('highScore', this.highScore);
    }
  }

  drawGameOverScreen() {
    // Draw Game Over overlay
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw Game Over text
    this.ctx.font = '36px Arial';
    this.ctx.fillStyle = '#fff';
    this.ctx.fillText('Game Over', this.canvas.width / 2 - 80, this.canvas.height / 2 - 60);
    this.ctx.fillText(`Score: ${this.score}`, this.canvas.width / 2 - 60, this.canvas.height / 2 - 20);
    this.ctx.fillText(`High Score: ${this.highScore}`, this.canvas.width / 2 - 90, this.canvas.height / 2 + 20);

    // Draw Play Again Button
    const buttonWidth = 150;
    const buttonHeight = 50;
    const buttonX = (this.canvas.width - buttonWidth) / 2;
    const buttonY = this.canvas.height / 2 + 100;

    this.ctx.fillStyle = '#00bfff';
    this.ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
    this.ctx.font = '24px Arial';
    this.ctx.fillStyle = '#fff';
    this.ctx.fillText('Play Again', buttonX + 20, buttonY + 32);
  }


  addPlayAgainButtonListener() {
    const buttonX = this.canvas.width / 2 - 75;
    const buttonY = this.canvas.height / 2 + 60;

    const handlePlayAgainClick = (event) => {
      const { clientX, clientY } = event;
      const mouseX = clientX - this.canvas.offsetLeft;
      const mouseY = clientY - this.canvas.offsetTop;

      if (mouseX >= buttonX && mouseX <= buttonX + 150 && mouseY >= buttonY && mouseY <= buttonY + 50) {
        this.canvas.removeEventListener('click', handlePlayAgainClick);
        this.startGame();
      }
    };

    this.canvas.removeEventListener('click', this.handlePlayAgainClick);
    this.handlePlayAgainClick = handlePlayAgainClick;
    this.canvas.addEventListener('click', handlePlayAgainClick);
  }

  handleClick(event) {
    if (this.isGameOver) return;

    const { clientX, clientY } = event;
    const mouseX = clientX - this.canvas.offsetLeft;
    const mouseY = clientY - this.canvas.offsetTop;
    this.checkOptionSelection(mouseX, mouseY);
  }

  checkOptionSelection(mouseX, mouseY) {
    const y = this.canvas.height - this.canvas.height / 12 * 1.5;
    const optionBoxWidth = this.canvas.width / 6;
    const optionBoxHeight = this.canvas.height / 12;
    const spacing = optionBoxWidth / 6;
    const totalWidth = (optionBoxWidth + spacing) * this.romajiOptions.length - spacing;
    const startX = (this.canvas.width - totalWidth) / 2;

    this.romajiOptions.forEach((option, index) => {
      const x = startX + index * (optionBoxWidth + spacing);
      if (mouseX >= x && mouseX <= x + optionBoxWidth && mouseY >= y && mouseY <= y + optionBoxHeight) {
        this.handleOptionSelection(index, option);
      }
    });
  }

  handleOptionSelection(index, option) {
    this.selectedOptionIndex = index;
    drawRomajiOptions(this.ctx, this.canvas, this.romajiOptions, this.selectedOptionIndex);

    if (option === this.KanaConverter.toRomaji(this.fallingCharacters[0]?.hiragana)) {
      this.handleCorrectAnswer();
    } else {
      this.handleMistake();
    }
  }

  handleCorrectAnswer() {
    this.fallingCharacters.shift();
    this.score += 10;
    this.correctStreak++;

    if (this.correctStreak % 5 === 0) {
      this.characterFallSpeed += 0.2;
      console.log("Increased character fall speed to:", this.characterFallSpeed);
    }

    if (this.fallingCharacters.length > 0) {
      this.romajiOptions = generateRomajiOptions(this.fallingCharacters[0].hiragana);
      drawRomajiOptions(this.ctx, this.canvas, this.romajiOptions, this.selectedOptionIndex);
    }
  }

  handleMouseUp() {
    this.selectedOptionIndex = -1;
    drawRomajiOptions(this.ctx, this.canvas, this.romajiOptions, this.selectedOptionIndex);
  }

  handleMistake() {
    this.mistakesMade++;
    this.correctStreak = 0;
    console.log(`Mistake made: ${this.mistakesMade}`);
    if (this.mistakesMade >= this.maxMistakes) {
      this.gameOver();
    }
  }

  drawMistakes() {
    this.ctx.font = '20px Arial';
    this.ctx.fillStyle = '#ff0000';
    this.ctx.fillText(`Mistakes: ${this.maxMistakes - this.mistakesMade}`, 10, 30);
  }

  drawVersion() {
    this.ctx.font = '12px Arial';
    this.ctx.fillStyle = '#888';
    this.ctx.fillText(`Version: ${this.version}`, this.canvas.width - 200, this.canvas.height - 10);
  }
}
