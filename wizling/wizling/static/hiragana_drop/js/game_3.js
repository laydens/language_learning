import FallingCharacter from './character.js';
import { generateRomajiOptions, drawRomajiOptions } from './romajioptions.js';
import GameOverScreen from './GameOverScreen.js';

export default class Game {
    constructor(canvas, ctx, KanaConverter) {
        // Initialize core properties first
        // this.version = "v1.104";
        this.canvas = canvas;
        this.ctx = ctx;
        this.KanaConverter = KanaConverter;

        // Initialize intervals container
        this.gameLoop = null;
        this.densityInterval = null;

        // Add visual properties
        this.colors = {
            background: '#F3F7F9',  // Soft blue-grey background
            primary: '#4A90E2',     // Vibrant but calm blue
            secondary: '#E8F4FF',   // Light blue for contrast
            accent: '#FF6B6B',      // Warm red for mistakes/alerts
            text: '#2C3E50',        // Dark blue-grey for text
            success: '#2ECC71',     // Soft green for correct answers
            overlay: 'rgba(44, 62, 80, 0.85)', // Semi-transparent overlay
        };

        this.fonts = {
            primary: "'Nunito', sans-serif",
            japanese: "'Noto Sans JP', sans-serif",
            display: "'Poppins', sans-serif",
        };

        this.gameOverScreen = new GameOverScreen({
            colors: {
                primary: '#4A90E2',
                text: '#2C3E50',
            },
            texts: {
                gameOver: 'Game Over!',
                score: 'Final Score',
                highScore: 'Best Score',
                playAgain: 'Try Again'
            }
        });

        // Initialize game state before binding methods
        this.resetGameState();

        // Bind methods after all properties are initialized
        this._bindMethods();

        // Initialize the game
        this.init();
    }

    _bindMethods() {
        // Bind all methods that need binding
        this.handleClick = this.handleClick.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.updateGame = this.updateGame.bind(this);
        this.spawnCharacter = this.spawnCharacter.bind(this);
        this.increaseDensity = this.increaseDensity.bind(this);
    }

    init() {
        this.bindEventListeners();
        this.startGame();
        this.setupCanvas();
    }
    // Add keyboard shortcuts for options
    bindEventListeners() {
        this.canvas.addEventListener('mousedown', this.handleClick);
        this.canvas.addEventListener('mouseup', this.handleMouseUp);
    }

    clearIntervals() {
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
        if (this.densityInterval) {
            clearInterval(this.densityInterval);
            this.densityInterval = null;
        }
    }

    resetGameState() {


        this.version = "v1.105";
        console.log('Resetting game state...');
        console.log('Previous fall speed:', this.characterFallSpeed);
        this.fallingCharacters = [];
        this.romajiOptions = [];
        this.gameSpeed = 1000;
        this.characterFallSpeed = 1.2;  // Reset to initial speed
        this.currentDensity = 1;
        this.score = 0;
        this.highScore = localStorage.getItem('highScore') || 0;
        this.selectedOptionIndex = -1;
        this.isGameOver = false;
        this.maxMistakes = 3;
        this.mistakesMade = 0;
        this.currentStreak = 0;    // Streak for gameplay/speed increases
        this.bestStreak = 0;       // Best streak achieved this game
        this.score = 0;

        this.particles = [];
        this.animations = [];

        console.log('Game state reset - New fall speed:', this.characterFallSpeed);
    }

    setupCanvas() {
        // Add subtle gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, this.colors.background);
        gradient.addColorStop(1, '#E8F4FF');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    startGame() {
        console.log('Starting new game...');
        this.resetGameState();
        this.clearIntervals();

        this.spawnCharacter();
        requestAnimationFrame(this.updateGame);

        this.gameLoop = setInterval(() => this.spawnCharacter(), this.gameSpeed);
        this.densityInterval = setInterval(() => this.increaseDensity(), 30000);

        console.log('Game started with initial settings:', {
            fallSpeed: this.characterFallSpeed,
            gameSpeed: this.gameSpeed,
            density: this.currentDensity
        });
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
        this.checkOptionSelection(mouseX, mouseY);
    }

    handleMouseUp() {
        this.selectedOptionIndex = -1;
        if (this.romajiOptions.length > 0) {
            drawRomajiOptions(this.ctx, this.canvas, this.romajiOptions, this.selectedOptionIndex);
        }
    }

    spawnCharacter() {
        if (this.fallingCharacters.length >= this.currentDensity) return;

        const hiragana = this.KanaConverter.getRandomHiragana();
        if (!hiragana || typeof hiragana !== 'string') {
            console.error("Failed to generate a valid hiragana character:", hiragana);
            return;
        }

        const characterSize = 40;
        const margin = characterSize;
        const x = margin + Math.random() * (this.canvas.width - characterSize - margin * 2);
        const speed = this.characterFallSpeed;

        this.fallingCharacters.push(new FallingCharacter(hiragana, x, speed, this.ctx));

        if (this.fallingCharacters.length === 1) {
            // Use the imported function directly
            this.romajiOptions = generateRomajiOptions(hiragana);
            drawRomajiOptions(this.ctx, this.canvas, this.romajiOptions, this.selectedOptionIndex);
        }
    }

    increaseDensity() {
        if (this.currentDensity < 4) {
            this.currentDensity++;
            console.log("Increased character density to:", this.currentDensity);
        }
    }

    updateGame() {
        if (this.isGameOver) return;

        this.setupCanvas();
        this.updateFallingCharacters();
        this.updateParticles();
        this.drawUI();

        // Add this line to continuously draw the options
        if (this.romajiOptions.length > 0) {
            drawRomajiOptions(this.ctx, this.canvas, this.romajiOptions, this.selectedOptionIndex);
        }

        requestAnimationFrame(this.updateGame);
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
        console.log('Game Over - Stats:', {
            score: this.score,
            highScore: this.highScore,
            bestStreak: this.bestStreak,
            finalCurrentStreak: this.currentStreak,
            charactersCleared: Math.floor(this.score / 10)
        });

        this.isGameOver = true;
        this.clearIntervals();

        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('highScore', this.highScore);
        }

        // Clear any remaining characters and options
        this.fallingCharacters = [];
        this.romajiOptions = [];

        // Clear the entire canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw game over screen with best streak
        this.gameOverScreen.draw(
            this.ctx,
            this.canvas,
            {
                score: this.score,
                highScore: this.highScore,
                additionalStats: {
                    'Best Streak': this.bestStreak,  // Changed from 'Correct Streak'
                    'Characters Cleared': Math.floor(this.score / 10)
                }
            },
            () => this.startGame()
        );
    }


    // Make sure to clean up in your destroy method
    destroy() {
        this.gameOverScreen.destroy();
        // ... other cleanup code ...
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

    isPointInRect(x, y, rect) {
        return x >= rect.x &&
            x <= rect.x + rect.width &&
            y >= rect.y &&
            y <= rect.y + rect.height;
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

    // Updated option selection check to use the full tile area
    checkOptionSelection(mouseX, mouseY) {
        const optionBoxWidth = this.canvas.width / 5;
        const optionBoxHeight = this.canvas.height / 10;
        const spacing = optionBoxWidth / 4;  // Match the new spacing
        const totalWidth = (optionBoxWidth + spacing) * this.romajiOptions.length - spacing;
        const startX = (this.canvas.width - totalWidth) / 2;
        const y = this.canvas.height - optionBoxHeight * 1.3;

        this.romajiOptions.forEach((option, index) => {
            const x = startX + index * (optionBoxWidth + spacing);
            if (mouseX >= x && mouseX <= x + optionBoxWidth &&
                mouseY >= y && mouseY <= y + optionBoxHeight) {
                this.handleOptionSelection(index, option);
            }
        });
    }

    handleOptionSelection(index, selectedRomaji) {
        this.selectedOptionIndex = index;
        drawRomajiOptions(this.ctx, this.canvas, this.romajiOptions, this.selectedOptionIndex);

        // Get the correct romaji for the current character
        const currentHiragana = this.fallingCharacters[0]?.hiragana;
        const correctRomaji = this.KanaConverter.toRomaji(currentHiragana);

        if (selectedRomaji === correctRomaji) {
            this.handleCorrectAnswer();
        } else {
            this.handleWrongAnswer(); // Changed from handleMistake to separate wrong answers from missed characters
        }
    }

    handleCorrectAnswer() {
        const char = this.fallingCharacters[0];
        this.addParticleEffect(char.x + char.size / 2, char.y + char.size / 2, 'success');

        this.fallingCharacters.shift();
        this.score += 10;

        // Update streaks
        this.currentStreak++;
        if (this.currentStreak > this.bestStreak) {
            this.bestStreak = this.currentStreak;
            console.log('New best streak!', this.bestStreak);
        }

        // Speed up based on current streak
        if (this.currentStreak % 5 === 0) {
            this.characterFallSpeed += 0.2;
            console.log(`Speed increased! Current streak: ${this.currentStreak}, New speed: ${this.characterFallSpeed}`);
        }

        if (this.fallingCharacters.length > 0) {
            this.romajiOptions = generateRomajiOptions(this.fallingCharacters[0].hiragana);
            drawRomajiOptions(this.ctx, this.canvas, this.romajiOptions, -1);
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
        const colors = type === 'success' ?
            [this.colors.success, '#A8E6CF', '#1AB571'] :
            [this.colors.accent, '#FFB6B6', '#FF8787'];

        for (let i = 0; i < 20; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                size: Math.random() * 6 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 1
            });
        }
    }
}