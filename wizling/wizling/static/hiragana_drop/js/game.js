// game.js
import ResponsiveGame from './ResponsiveGame.js';
import FallingCharacter from './FallingCharacter.js';
import GameOverScreen from './GameOverScreen.js';
import { StartScreenManager } from './StartScreenManager.js';
import GameUI from './GameUI.js';
import GameOptions from './GameOptions.js';
import ParticleSystem from './ParticleSystem.js';
import Theme from './Theme.js';
import { GameDataProvider } from './GameDataProvider.js';

//import { GroupSelector } from './GroupSelector.js';


export default class Game {
    constructor(canvas, ctx, queryString) {

        this.version = "v1.1.72";
        // Core initialization
        console.log('Canvas width:', canvas.width);
        this.canvas = canvas;
        this.ctx = ctx;

        this.queryString = queryString;
        console.log('queryString in Game constructor: ', queryString);
        console.log('Game version:', this.version);
        // Game state flags
        this.isLoading = true;
        this.gameStarted = false;  // Add flag to track if game has started
        console.log('Initializing game with query string:', queryString);
        this.backgroundImage = new Image();
        this.backgroundImage.src = '/static/images/cloud3.png';
        // Visual properties
        this.colors = Theme.colors;
        this.responsive = new ResponsiveGame(canvas, this);
        this.targetStyle = {
            color: '#FF6B6B',
            glowColor: 'rgba(255, 107, 107, 0.5)',
            glowBlur: 15,
            nonTargetColor: '#2C3E50'
        };

        this.fonts = Theme.fonts;

        this.gameUI = new GameUI(this.ctx);
        this.gameOptions = new GameOptions(this.ctx);
        this.particleSystem = new ParticleSystem(this.ctx);

        // Initialize game properties
        this.resetGameState();

        // Initialize screens
        this.initializeScreens();

        // Bind core methods
        this.bindCoreMethods();

        // Initialize event listeners
        this.bindEventListeners();

        // Show the start screen
        this.showStartScreen();

        this.setupBindings();

    }




    resetGameState() {
        console.log('Resetting game state...');

        this.fallingCharacters = [];
        this.options = [];
        this.gameLoop = null;
        this.densityInterval = null;
        this.gameSpeed = 1000;
        this.characterFallSpeed = 1.0;
        this.currentDensity = 4;
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

        this.characterConfig = {
            baseStaggerDistance: 100,     // Base pixels between characters
            minStaggerDistance: 100,       // Minimum stagger distance allowed
            staggerReductionPerLevel: 5   // How much to reduce stagger per level
        };
        this.levelConfig = {
            baseSpeed: this.characterFallSpeed, // Increased base speed
            speedIncreasePerLevel: 0.1,         // Doubled speed increase
            maxSpeed: 5.0,                      // Increased max speed

            baseDensity: 2,
            densityLevels: [
                { level: 1, density: 1 },
                { level: 2, density: 2 },      // Reduced level requirement
                { level: 3, density: 3 },      // Reduced level requirement
                { level: 4, density: 4 }       // Reduced level requirement
            ],


            pointsToNextLevel: 80,             // Reduced points needed
            maxLevel: 10
        };

        this.currentLevel = 1;
    }

    // Add this method to handle level progression
    updateLevel() {
        const previousLevel = this.currentLevel;
        this.currentLevel = Math.min(
            Math.floor(this.score / this.levelConfig.pointsToNextLevel) + 1,
            this.levelConfig.maxLevel
        );

        // If level changed, update game parameters
        if (previousLevel !== this.currentLevel) {
            this.updateGameParameters();
            this.showLevelUpMessage();
        }
    }

    // Update game parameters based on current level
    updateGameParameters() {
        // Update fall speed
        this.characterFallSpeed = Math.min(
            this.levelConfig.baseSpeed +
            (this.currentLevel - 1) * this.levelConfig.speedIncreasePerLevel,
            this.levelConfig.maxSpeed
        );

        // Update density based on level thresholds
        const densityConfig = this.levelConfig.densityLevels
            .filter(config => config.level <= this.currentLevel)
            .pop();
        this.currentDensity = densityConfig ? densityConfig.density : this.levelConfig.baseDensity;

        console.log(`Level ${this.currentLevel}: Speed ${this.characterFallSpeed.toFixed(2)}, Density ${this.currentDensity}`);
    }

    // Visual feedback for level up
    showLevelUpMessage() {
        // Store the level up time to show the message temporarily
        this.levelUpTime = Date.now();

        // Create a particle effect for level up
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        this.particleSystem.createEffect(centerX, centerY, 'levelUp');
    }

    handleResize(width, height) {
        // Update any size-dependent game properties
        if (this.gameUI) {
            this.gameUI.handleResize(width, height);
        }
        if (this.gameOptions) {
            this.gameOptions.handleResize(width, height);
        }
        // Redraw the current game state
        this.setupCanvas();
    }

    // Add level up message display
    drawLevelUpMessage() {
        const opacity = Math.max(0, 1 - (Date.now() - this.levelUpTime) / 2000);

        this.ctx.save();
        const mainColor = Theme.colors.secondary.medium;
        const subColor = Theme.colors.primary.medium;

        // Main level text with fade
        this.ctx.fillStyle = `rgba(${this.hexToRgb(mainColor)}, ${opacity})`;
        this.ctx.font = `bold 48px ${Theme.fonts.system.display}`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(`Level ${this.currentLevel}!`, this.canvas.width / 2, this.canvas.height / 2);

        // Subtitle with fade
        this.ctx.font = `24px ${Theme.fonts.system.display}`;
        this.ctx.fillStyle = `rgba(${this.hexToRgb(subColor)}, ${opacity})`;
        this.ctx.fillText('Speed Increased!', this.canvas.width / 2, this.canvas.height / 2 + 40);

        this.ctx.restore();
    }

    hexToRgb(hex) {
        // Remove the # if present
        hex = hex.replace(/^#/, '');

        // Parse hex to RGB
        const bigint = parseInt(hex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;

        return `${r}, ${g}, ${b}`;
    }

    initializeScreens() {
        // Initialize GameOver screen
        this.gameOverScreen = new GameOverScreen({
            colors: {
                primary: this.colors.background.primary,
                text: this.colors.text.primary,
            },
            // Add callback handlers
            onTryAgain: () => {
                console.log('Try Again clicked');
                this.startGame();
            },
            onStartOver: () => {
                console.log('Start Over clicked');
                window.location.reload();
            },
            onExit: () => {
                console.log('Exit clicked');
                window.location.href = '/';
            }
        });


        // Initialize Start screen with access to queryString
        this.startScreen = new StartScreenManager({
            colors: this.colors,
            fonts: Theme.fonts,
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

            // Calculate current level's stagger distance
            const staggerReduction = this.currentLevel * this.characterConfig.staggerReductionPerLevel;
            const currentStaggerDistance = Math.max(
                this.characterConfig.baseStaggerDistance - staggerReduction,
                this.characterConfig.minStaggerDistance
            );

            // Check stagger distance
            const lastCharacterY = this.fallingCharacters.length > 0
                ? this.fallingCharacters[this.fallingCharacters.length - 1].y
                : -currentStaggerDistance;

            // Only check stagger if we haven't reached density limit
            if (this.fallingCharacters.length < this.currentDensity) {
                if (lastCharacterY < -currentStaggerDistance) return;

                const keys = Object.keys(this.dictionary);
                const character = keys[Math.floor(Math.random() * keys.length)];

                const characterSize = 40;
                const margin = characterSize;
                const x = margin + Math.random() * (this.canvas.width - characterSize - margin * 2);

                // Calculate initial Y position based on character's position in sequence
                const initialY = -characterSize - (this.fallingCharacters.length * currentStaggerDistance);

                console.log("Spawning character with fall speed:", this.characterFallSpeed);
                const newChar = new FallingCharacter(character, x, this.characterFallSpeed, this.ctx, this);
                newChar.y = initialY; // Set initial Y position with spacing

                this.fallingCharacters.push(newChar);
                this.lastSpawnTime = currentTime;

                if (this.fallingCharacters.length === 1) {
                    console.log('Setting initial target:', character);
                    this.targetCharacter = character;
                    this.generateOptions(character);
                }
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


            this.updateParticles(); // This should call particleSystem.update()


            this.drawUI();
            if (this.gameOptions.options.length > 0) {
                this.gameOptions.draw();
            }

            requestAnimationFrame(this.updateGame);
        };


        this.handleClick = (event) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = (event.clientX - rect.left) * (this.canvas.width / rect.width);
            const mouseY = (event.clientY - rect.top) * (this.canvas.height / rect.height);

            if (this.isGameOver) {
                // Simply pass the click event to GameOverScreen
                this.gameOverScreen.handleClick(event);
                return;
            }

            if (!this.gameStarted) {
                this.startScreen.handleClick(mouseX, mouseY, this.canvas);
                return;
            }
            this.checkOptionSelection(mouseX, mouseY);
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
        this.currentLevel = 1;
        this.updateGameParameters();
        // Validate dictionary
        const characterCount = Object.keys(this.dictionary).length;
        if (characterCount === 0) {
            this.showErrorMessage('No characters loaded. Please check game configuration.');
            throw new Error('Empty dictionary loaded');
        }
        console.log(`Starting game with ${characterCount} characters`);

        // Start game loops
        requestAnimationFrame(this.updateGame);

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
            background: ${Theme.colors.background.primary};
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            font-family: ${Theme.fonts.system.display};
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
        this.lastSpawnTime = 0;
    }

    isPointInRect(x, y, rect) {
        return x >= rect.x && x <= rect.x + rect.width &&
            y >= rect.y && y <= rect.y + rect.height;
    }

    showLoadingScreen() {
        this.ctx.fillStyle = this.colors.background.primary;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.font = `600 24px ${Theme.fonts.system.display}`;
        this.ctx.fillStyle = this.colors.text.primary;
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Loading...', this.canvas.width / 2, this.canvas.height / 2);
    }

    hideLoadingScreen() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    setupCanvas() {
        if (this.backgroundImage) {
            this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
        } else {
            // Fallback gradient if image hasn't loaded
            const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
            gradient.addColorStop(0, this.colors.background.primary);
            gradient.addColorStop(1, this.colors.background.secondary);
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
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
        // First, sort characters by Y position to ensure proper order
        this.fallingCharacters.sort((a, b) => b.y - a.y);

        // Always set the lowest character as target
        if (this.fallingCharacters.length > 0) {
            const lowestChar = this.fallingCharacters[0];
            if (this.targetCharacter !== lowestChar.character) {
                console.log('Setting new target to lowest character:', lowestChar.character);
                this.targetCharacter = lowestChar.character;
                this.generateOptions(lowestChar.character);
            }
        }

        // Then do our normal update loop
        for (let i = this.fallingCharacters.length - 1; i >= 0; i--) {
            const char = this.fallingCharacters[i];
            char.update();

            if (char.y > this.canvas.height) {
                if (char.character === this.targetCharacter) {
                    console.log('Target character missed');
                    this.handleMistake();
                }
                this.fallingCharacters.splice(i, 1);
            } else {
                // Pass true if this character is the target character
                char.draw(char.character === this.targetCharacter);
            }
        }

        // If we have no characters left, clear the target
        if (this.fallingCharacters.length === 0) {
            this.targetCharacter = null;
        }
    }

    updateParticles() {
        // console.log('updateParticles checking particle system:', {
        //     particleSystem: this.particleSystem,
        //     particleCount: this.particleSystem?.particles?.length || 0
        // });

        // Add error handling to catch any issues
        try {
            if (this.particleSystem) {
                this.particleSystem.update();
            } else {
                console.error('Particle system is not initialized');
            }
        } catch (error) {
            console.error('Error updating particles:', error);
        }
    }

    drawUI() {
        const gameState = {
            version: this.version,
            score: this.score,
            currentStreak: this.currentStreak,
            bestStreak: this.bestStreak,
            maxMistakes: this.maxMistakes,
            mistakesMade: this.mistakesMade,
            gameTitle: this.gameTitle,
            currentLevel: this.currentLevel,
            nextLevelPoints: (this.currentLevel * this.levelConfig.pointsToNextLevel) - this.score
        };

        this.gameUI.drawUI(gameState);

        // Show level up message if within 2 seconds of leveling up
        if (this.levelUpTime && Date.now() - this.levelUpTime < 2000) {
            this.drawLevelUpMessage();
        }
    }

    gameOver() {
        this.isGameOver = true;
        this.clearIntervals();

        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('highScore', this.highScore);
        }

        // Clear remaining game elements
        this.fallingCharacters = [];
        this.options = [];
        this.gameOptions.reset();

        // Draw the game over screen
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
            }
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

    destroy() {
        this.clearIntervals();
        this.canvas.removeEventListener('mousedown', this.handleClick);
        this.canvas.removeEventListener('mouseup', this.handleMouseUp);
    }


    handleCorrectAnswer() {
        if (this.fallingCharacters.length === 0) return;

        const character = this.fallingCharacters[0];
        // Get character position in canvas coordinates
        const charX = character.x;
        const charY = character.y;

        console.log('Raw character position:', { charX, charY });

        // Convert to screen coordinates using responsive handler
        const screenPos = this.responsive.convertToCanvasCoords(charX, charY);
        console.log('Converted screen position:', screenPos);

        this.fallingCharacters.shift();

        // Use converted coordinates for particle effect
        this.addParticleEffect(screenPos.x, screenPos.y, 'success');

        // Update score and streak
        this.score += 10;
        this.currentStreak++;
        if (this.currentStreak > this.bestStreak) {
            this.bestStreak = this.currentStreak;
        }

        // Check for level progression
        this.updateLevel();

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

        console.log('Comparing:', {
            selected: selectedAnswer,
            correct: correctAnswer,
            isMatch: selectedAnswer === correctAnswer
        });

        if (selectedAnswer === correctAnswer) {
            console.log('Correct answer - calling handleCorrectAnswer');
            this.handleCorrectAnswer();
        } else {
            console.log('Wrong answer - calling handleWrongAnswer');
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
        console.log('addParticleEffect called:', { x, y, type });
        this.particleSystem.createEffect(x, y, type);
    }
}