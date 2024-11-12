// game.js
import FallingCharacter from './FallingCharacter.js';
import GameOverScreen from './GameOverScreen.js';
import { StartScreen } from './GameStartScreen.js';
import GameUI from './GameUI.js';
import GameOptions from './GameOptions.js';
import ParticleSystem from './ParticleSystem.js';
import Theme from './Theme.js';
import { CHARACTER_GROUPS, GameDataProvider } from './GameDataProvider.js';
import { GroupSelector } from './GroupSelector.js';


export default class Game {
    constructor(canvas, ctx, queryString) {
        // Core initialization
        this.canvas = canvas;
        this.ctx = ctx;
        this.version = "v1.1.57";
        this.queryString = queryString;
        console.log('queryString in Game constructor: ', queryString);
        console.log('Game version:', this.version);
        // Game state flags
        this.isLoading = true;
        this.gameStarted = false;  // Add flag to track if game has started
        console.log('Initializing game with query string:', queryString);

        // Visual properties
        this.colors = {
            background: '#F3F7F9',
            primary: '#4A90E2',
            secondary: '#E8F4FF',
            accent: '#FF6B6B',
            text: '#2C3E50',
            success: '#2ECC71',
            overlay: 'rgba(44, 62, 80, 0.85)'
        };

        this.targetStyle = {
            color: '#FF6B6B',
            glowColor: 'rgba(255, 107, 107, 0.5)',
            glowBlur: 15,
            nonTargetColor: '#2C3E50'
        };

        this.fonts = {
            primary: "'Nunito', sans-serif",
            display: "'Poppins', sans-serif"
        };

        this.gameUI = new GameUI(this.ctx);
        this.gameOptions = new GameOptions(this.ctx);
        this.particleSystem = new ParticleSystem(this.ctx);

        // Initialize game properties
        this.initializeGameProperties();

        // Initialize screens
        this.initializeScreens();

        // Bind core methods
        this.bindCoreMethods();

        // Initialize event listeners
        this.bindEventListeners();

        // Show the start screen
        this.showStartScreen();

        this.setupBindings();



        // In Game class, add this at the end of constructor:


    }

    initializeGameProperties() {
        console.log('qstring in initprops...' + this.queryString);
        this.fallingCharacters = [];
        this.options = [];
        this.gameLoop = null;
        this.densityInterval = null;
        this.gameSpeed = 1000;
        this.characterFallSpeed = 1.2;
        this.currentDensity = 2;
        this.score = 0;
        this.highScore = localStorage.getItem('highScore') || 0;
        this.selectedOptionIndex = -1;
        this.isGameOver = false;
        this.maxMistakes = 4;
        this.mistakesMade = 0;
        this.currentStreak = 0;
        this.bestStreak = 0;
        this.particles = [];
        this.lastSpawnTime = 0;
        this.spawnInterval = 2000;
    }

    initializeScreens() {
        // Initialize GameOver screen
        this.gameOverScreen = new GameOverScreen({
            colors: {
                primary: this.colors.primary,
                text: this.colors.text,
            },
            texts: {
                gameOver: 'Game Over!',
                score: 'Final Score',
                highScore: 'Best Score',
                playAgain: 'Try Again'
            }
        });

        // Initialize Start screen with access to queryString
        this.startScreen = new StartScreen({
            colors: this.colors,
            fonts: this.fonts,
            mode: this.queryString,
            onStart: (selection) => {
                const gameData = GameDataProvider.getData(this.queryString, selection);
                this.dictionary = gameData.data.dictionary;
                this.gameTitle = gameData.data.title;
                this.gameStarted = true;
                this.startGame();
            }
        });

    }

    bindCoreMethods() {
        this.spawnCharacter = () => {
            const currentTime = Date.now();
            if (currentTime - this.lastSpawnTime < this.spawnInterval) return;
            if (this.fallingCharacters.length >= this.currentDensity) return;

            const keys = Object.keys(this.dictionary);
            const character = keys[Math.floor(Math.random() * keys.length)];

            const characterSize = 40;
            const margin = characterSize;
            const x = margin + Math.random() * (this.canvas.width - characterSize - margin * 2);

            console.log("Spawning character with fall speed:", this.characterFallSpeed);
            const newChar = new FallingCharacter(character, x, this.characterFallSpeed, this.ctx, this);
            this.fallingCharacters.push(newChar);
            this.lastSpawnTime = currentTime;

            if (this.fallingCharacters.length === 1) {
                console.log('Setting initial target:', character);
                this.targetCharacter = character;
                this.generateOptions(character);
            }
        };

        this.updateGame = () => {
            if (this.isGameOver) {
                // If game is over, keep drawing the game over screen
                this.gameOverScreen.draw(
                    this.ctx,
                    this.canvas,
                    {
                        score: this.score,
                        highScore: this.highScore,
                        additionalStats: {
                            'Best Streak': this.bestStreak,
                            'Characters Cleared': Math.floor(this.score / 10)
                        }
                    },
                    () => this.startGame()
                );
                requestAnimationFrame(this.updateGame);
                return;
            }

            this.setupCanvas();
            this.spawnCharacter();
            this.updateFallingCharacters();
            this.updateParticles();
            this.drawUI();
            this.particleSystem.update();

            if (this.gameOptions.options.length > 0) {
                this.gameOptions.draw();
            }

            requestAnimationFrame(this.updateGame);
        };


        this.handleClick = (event) => {
            const mouseX = event.clientX - this.canvas.offsetLeft;
            const mouseY = event.clientY - this.canvas.offsetTop;

            if (!this.gameStarted) {
                this.startScreen.handleClick(mouseX, mouseY, this.canvas);
                return;
            }

            if (this.isGameOver) {
                const buttonBounds = this.getPlayAgainButtonBounds();
                if (this.isPointInRect(mouseX, mouseY, buttonBounds)) {
                    this.startGame();
                    return;
                }
            }

            this.checkOptionSelection(mouseX, mouseY);
        };

        this.increaseDensity = () => {
            if (this.currentDensity < 4) {
                this.currentDensity++;
            }
        };
    }

    checkOptionSelection(mouseX, mouseY) {
        const selectedAnswer = this.gameOptions.checkSelection(mouseX, mouseY);
        if (selectedAnswer !== null) {
            this.handleOptionSelection(this.gameOptions.selectedOptionIndex, selectedAnswer);
        }
    }

    showStartScreen() {
        this.startScreen.draw(this.ctx, this.canvas);
    }

    // In Game class
    handleMouseUp() {
        console.log("Game: handleMouseUp called");
        this.gameOptions.handleMouseUp();
    }

    bindEventListeners() {
        // Explicitly bind these methods to preserve 'this' context
        this.handleClick = this.handleClick.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);

        this.canvas.addEventListener('mousedown', this.handleClick);
        this.canvas.addEventListener('mouseup', this.handleMouseUp);
        // Remove the mousemove listener if hover effects aren't needed
    }

    startGame() {
        if (!this.gameStarted) return;  // Don't start if we haven't selected groups

        // Reset state
        this.resetGameState();
        this.clearIntervals();

        // Validate dictionary
        const characterCount = Object.keys(this.dictionary).length;
        if (characterCount === 0) {
            this.showErrorMessage('No characters loaded. Please check game configuration.');
            throw new Error('Empty dictionary loaded');
        }
        console.log(`Starting game with ${characterCount} characters`);

        // Start game loops
        requestAnimationFrame(this.updateGame);
        this.densityInterval = setInterval(this.increaseDensity, 30000);
    }

    // Add this method for error message display
    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'game-error';
        errorDiv.style.cssText = `
            position: absolute;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            background: ${this.colors.accent};
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            font-family: ${this.fonts.primary};
            z-index: 1000;
            opacity: 0.9;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        `;
        errorDiv.textContent = message;
        this.canvas.parentElement.appendChild(errorDiv);

        // Fade out and remove after delay
        setTimeout(() => {
            errorDiv.style.transition = 'opacity 0.5s ease';
            errorDiv.style.opacity = '0';
            setTimeout(() => errorDiv.remove(), 500);
        }, 4500);
    }

    setupBindings() {
        // Bind all necessary methods
        this.handleClick = this.handleClick.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.updateGame = this.updateGame.bind(this);
        this.spawnCharacter = this.spawnCharacter.bind(this);
        this.increaseDensity = this.increaseDensity.bind(this);
    }

    resetGameState() {
        console.log('Resetting game state...');

        this.fallingCharacters = [];
        this.options = [];
        this.gameLoop = null;
        this.densityInterval = null;
        this.gameSpeed = 1000;
        this.characterFallSpeed = 1.2;
        this.currentDensity = 1;
        this.score = 0;
        this.highScore = localStorage.getItem('highScore') || 0;
        this.selectedOptionIndex = -1;
        this.isGameOver = false;
        this.maxMistakes = 3;
        this.mistakesMade = 0;
        this.currentStreak = 0;
        this.bestStreak = 0;
        this.particles = [];
        this.targetCharacter = null;  // Reset target character
        this.particleSystem.reset();
        this.gameOptions.reset();
        console.log('Game state reset - New fall speed:', this.characterFallSpeed);
    }

    init() {
        this.bindEventListeners();
        this.startGame();
        this.setupCanvas();
    }

    increaseDensity() {
        if (this.currentDensity < 4) {
            this.currentDensity++;
            console.log("Increased character density to:", this.currentDensity);
        }
    }

    handleClick(event) {

        if (this.isGameOver) {
            const buttonBounds = this.getPlayAgainButtonBounds();
            const mouseX = event.clientX - this.canvas.offsetLeft;
            const mouseY = event.clientY - this.canvas.offsetTop;

            if (this.isPointInRect(mouseX, mouseY, buttonBounds)) {
                this.startGame();
                return;
            }
        }

        const mouseX = event.clientX - this.canvas.offsetLeft;
        const mouseY = event.clientY - this.canvas.offsetTop;

        if (!this.gameStarted) {
            this.startScreen.handleClick(mouseX, mouseY, this.canvas);
            return;
        }
        this.checkOptionSelection(mouseX, mouseY);
    }

    clearIntervals() {
        if (this.gameLoop) {
            cancelAnimationFrame(this.gameLoop);
            this.gameLoop = null;
        }
        if (this.densityInterval) {
            clearInterval(this.densityInterval);
            this.densityInterval = null;
        }
        this.lastSpawnTime = 0;  // Reset spawn timer
    }

    isPointInRect(x, y, rect) {
        return x >= rect.x && x <= rect.x + rect.width &&
            y >= rect.y && y <= rect.y + rect.height;
    }

    showLoadingScreen() {
        this.ctx.fillStyle = this.colors.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.font = `600 24px ${this.fonts.primary}`;
        this.ctx.fillStyle = this.colors.text;
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Loading...', this.canvas.width / 2, this.canvas.height / 2);
    }

    hideLoadingScreen() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    setupCanvas() {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, this.colors.background);
        gradient.addColorStop(1, '#E8F4FF');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    updateGame() {
        if (this.isGameOver) return;

        this.setupCanvas();
        this.updateFallingCharacters();
        this.updateParticles();
        this.drawUI();

        if (this.options.length > 0) {
            this.drawOptions();
        }

        requestAnimationFrame(this.updateGame);
    }

    updateFallingCharacters() {
        for (let i = this.fallingCharacters.length - 1; i >= 0; i--) {
            const char = this.fallingCharacters[i];
            char.update();

            if (char.y > this.canvas.height) {
                if (i === 0) {
                    console.log('Target character missed');
                    this.handleMistake();

                    if (this.fallingCharacters.length > 1) {
                        const newTarget = this.fallingCharacters[1].character;
                        console.log('Setting new target after miss:', newTarget);
                        this.targetCharacter = newTarget;
                        this.generateOptions(newTarget);
                    }
                }
                this.fallingCharacters.splice(i, 1);
            } else {
                // Pass true if this character is the target character
                char.draw(char.character === this.targetCharacter);
            }
        }
    }

    updateParticles() {
        this.particleSystem.update();
    }

    drawUI() {
        const gameState = {
            version: this.version,
            score: this.score,
            currentStreak: this.currentStreak,
            bestStreak: this.bestStreak,
            maxMistakes: this.maxMistakes,
            mistakesMade: this.mistakesMade,
            gameTitle: this.gameTitle
        };

        this.gameUI.drawUI(gameState);
    }

    drawHeart(x, y, size, color) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(x, y + size / 4);
        this.ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + size / 4);
        this.ctx.bezierCurveTo(x - size / 2, y + size / 2, x, y + size * 3 / 4, x, y + size);
        this.ctx.bezierCurveTo(x, y + size * 3 / 4, x + size / 2, y + size / 2, x + size / 2, y + size / 4);
        this.ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + size / 4);
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.restore();
    }

    gameOver() {
        this.isGameOver = true;
        this.clearIntervals();

        if (this.gameLoop) {
            cancelAnimationFrame(this.gameLoop);
            this.gameLoop = null;
        }

        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('highScore', this.highScore);
        }

        // Clear remaining game elements
        this.fallingCharacters = [];
        this.options = [];
        this.gameOptions.reset();

        // Let GameOverScreen handle drawing completely
        this.gameOverScreen.draw(
            this.ctx,
            this.canvas,
            {
                score: this.score,
                highScore: this.highScore,
                additionalStats: {
                    'Best Streak': this.bestStreak,
                    'Characters Cleared': Math.floor(this.score / 10)
                }
            },
            () => this.startGame()
        );
    }

    // Make sure to clean up in your destroy method
    destroy() {
        this.clearIntervals();
        if (this.gameOverScreen) {
            this.gameOverScreen.destroy();
        }
        this.canvas.removeEventListener('mousedown', this.handleClick);
        this.canvas.removeEventListener('mouseup', this.handleMouseUp);
    }

    updateHighScore() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('highScore', this.highScore);
        }
    }

    getPlayAgainButtonBounds() {
        const containerWidth = this.canvas.width * 0.8;
        const containerHeight = this.canvas.height * 0.6;
        const x = (this.canvas.width - containerWidth) / 2;
        const y = (this.canvas.height - containerHeight) / 2;

        const buttonWidth = 200;
        const buttonHeight = 60;
        const buttonX = (this.canvas.width - buttonWidth) / 2;
        const buttonY = y + containerHeight - 100;

        return { x: buttonX, y: buttonY, width: buttonWidth, height: buttonHeight };
    }


    // In Game class, add version display to drawUI method
    drawUI() {
        // Version in top right
        this.ctx.font = '16px Arial';
        this.ctx.fillStyle = '#666666';
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`v${this.version}`, this.canvas.width - 20, 30);

        // Score and streak on left side
        this.ctx.textAlign = 'left';
        this.ctx.fillStyle = this.colors.text;

        // Score
        this.ctx.font = `600 24px ${this.fonts.primary}`;
        this.ctx.fillText(`Score: ${this.score}`, 20, 40);

        // Current/Best Streak below score
        this.ctx.font = `16px ${this.fonts.primary}`;
        this.ctx.fillText(`Streak: ${this.currentStreak} (Best: ${this.bestStreak})`, 20, 65);

        // Hearts/Lives in top right
        const mistakeX = this.canvas.width - 150;
        const hearts = this.maxMistakes - this.mistakesMade;
        for (let i = 0; i < this.maxMistakes; i++) {
            const color = i < hearts ? this.colors.accent : '#D8D8D8';
            this.drawHeart(mistakeX + (i * 30), 30, 12, color);
        }
    }



    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.02;

            if (p.life <= 0) {
                this.particles.splice(i, 1);
                continue;
            }

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `${p.color}${Math.floor(p.life * 255).toString(16).padStart(2, '0')}`;
            this.ctx.fill();
        }
    }

    destroy() {
        this.clearIntervals();
        this.canvas.removeEventListener('mousedown', this.handleClick);
        this.canvas.removeEventListener('mouseup', this.handleMouseUp);
    }


    handleCorrectAnswer() {
        if (this.fallingCharacters.length === 0) return;

        const character = this.fallingCharacters[0]; // Get reference without removing

        // Get position before removal
        const charX = character.x;
        const charY = character.y;

        // Now remove the character
        this.fallingCharacters.shift();

        // Create particle effect at the stored position
        this.addParticleEffect(charX + 20, charY + 20, 'success'); // Using fixed offset of 20 for center

        // Update score and streak
        this.score += 10;
        this.currentStreak++;
        if (this.currentStreak > this.bestStreak) {
            this.bestStreak = this.currentStreak;
        }

        // Set new target if there are more characters
        if (this.fallingCharacters.length > 0) {
            const newTarget = this.fallingCharacters[0].character;
            console.log('Setting new target:', newTarget);
            this.targetCharacter = newTarget;
            this.generateOptions(newTarget);
        } else {
            this.targetCharacter = null;
        }
    }

    generateOptions(character) {
        this.gameOptions.generateOptions(character, this.dictionary);
    }

    drawOptions() {
        this.gameOptions.draw();
    }

    checkOptionSelection(mouseX, mouseY) {
        const selectedAnswer = this.gameOptions.checkSelection(mouseX, mouseY);
        if (selectedAnswer !== null) {
            this.handleOptionSelection(this.gameOptions.selectedOptionIndex, selectedAnswer);
        }
    }

    handleOptionSelection(index, selectedAnswer) {
        console.log('Selected option:', selectedAnswer);

        if (this.fallingCharacters.length === 0) {
            console.warn('No characters to match');
            return;
        }

        // Get the bottom-most character (first in array)
        const targetChar = this.fallingCharacters[0];
        console.log('Current target character:', targetChar.character);
        const correctAnswer = this.dictionary[targetChar.character];

        console.log('Selected:', selectedAnswer, 'Correct:', correctAnswer);

        if (selectedAnswer === correctAnswer) {
            console.log('Correct answer!');
            this.handleCorrectAnswer();
        } else {
            console.log('Wrong answer');
            this.handleWrongAnswer();
        }
    }

    handleWrongAnswer() {
        console.log(`Wrong answer. Current streak ended at: ${this.currentStreak}. Best streak remains: ${this.bestStreak}`);
        this.currentStreak = 0;  // Only reset current streak
        this.mistakesMade++;

        if (this.mistakesMade >= this.maxMistakes) {
            this.gameOver();
        }
    }

    handleMistake() {
        console.log(`Mistake made. Current streak ended at: ${this.currentStreak}. Best streak remains: ${this.bestStreak}`);
        this.currentStreak = 0;  // Only reset current streak
        this.mistakesMade++;

        if (this.mistakesMade >= this.maxMistakes) {
            this.gameOver();
        }
    }

    addParticleEffect(x, y, type) {
        this.particleSystem.createEffect(x, y, type);
    }
}