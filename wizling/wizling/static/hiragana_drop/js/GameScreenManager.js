// GameScreenManager.js

import GameOverScreen from './GameOverScreen.js';
import { StartScreen } from './GameStartScreen.js';

export default class GameScreenManager {
    constructor(ctx, queryString, canvas, colors, targetStyle, fonts, onStartGame) {
        this.ctx = ctx;
        this.queryString = queryString;
        this.canvas = canvas;
        this.colors = colors;
        this.targetStyle = targetStyle;  // Store targetStyle for use in screens
        this.fonts = fonts;
        this.onStartGame = onStartGame;

        // Initialize StartScreen and GameOverScreen with colors, fonts, and targetStyle
        this.startScreen = new StartScreen({
            colors: this.colors,
            fonts: this.fonts,
            targetStyle: this.targetStyle,
            mode: this.queryString,
            onStart: (selection) => this.onStartGame(selection)
        });
        this.gameOverScreen = new GameOverScreen({
            colors: this.colors,
            fonts: this.fonts,
            targetStyle: this.targetStyle,
            texts: {
                gameOver: 'Game Over!',
                score: 'Final Score',
                highScore: 'Best Score',
                playAgain: 'Try Again'
            }
        });
    }



    showStartScreen() {
        this.clearScreen();
        this.startScreen.draw(this.ctx, this.canvas);

        // Forward click events to StartScreen's handleClick
        this.canvas.addEventListener('click', this.handleCanvasClick);
    }

    handleCanvasClick = (event) => {
        const x = event.clientX - this.canvas.offsetLeft;
        const y = event.clientY - this.canvas.offsetTop;
        console.log("GameScreenManager: Click detected at", x, y);
        this.startScreen.handleClick(x, y, this.canvas);
    };

    showGameOverScreen(score, highScore, onRetry) {
        this.clearScreen();
        this.gameOverScreen.draw(
            this.ctx,
            this.canvas,
            {
                score,
                highScore,
                additionalStats: {
                    'Best Streak': this.bestStreak,
                    'Characters Cleared': Math.floor(score / 10)
                }
            },
            onRetry
        );
    }

    clearScreen() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
