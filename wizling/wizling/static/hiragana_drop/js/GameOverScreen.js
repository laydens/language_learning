import Theme from './Theme.js';
// GameOverScreen.js
export default class GameOverScreen {
    constructor(options = {}) {
        this.colors = Theme.colors;
        this.fonts = Theme.fonts;
        this.texts = {
            gameOver: 'Practice Complete',
            score: 'Score',
            highScore: 'Personal Best',
            playAgain: 'Try Again',
            startOver: 'Start Over',
            exit: 'Exit to Wizling',
            ...options.texts
        };

        // Add event callbacks object
        this.callbacks = {
            onTryAgain: options.onTryAgain || (() => { }),
            onStartOver: options.onStartOver || (() => { }),
            onExit: options.onExit || (() => { })
        };
    }

    draw(ctx, canvas, gameStats) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.gameStats = gameStats;

        this.drawOverlay();
        this.drawContent();
        this.drawButtons();
    }

    drawOverlay() {
        const ctx = this.ctx;

        // Gradient overlay
        const gradient = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, `${Theme.colors.primary.main}F0`);
        gradient.addColorStop(1, `${Theme.colors.primary.dark}F0`);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Center container
        const containerWidth = Math.min(500, this.canvas.width * 0.9);
        const containerHeight = 400;
        const x = (this.canvas.width - containerWidth) / 2;
        const y = (this.canvas.height - containerHeight) / 2;

        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetY = 5;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.beginPath();
        ctx.roundRect(x, y, containerWidth, containerHeight, 24);
        ctx.fill();

        ctx.restore();

        this.containerBounds = { x, y, width: containerWidth, height: containerHeight };
    }

    drawContent() {
        const { x, y, width } = this.containerBounds;
        const centerX = x + width / 2;

        // Title
        this.ctx.font = `${Theme.fonts.weights.bold} ${Theme.fonts.sizes.ui.large}px ${Theme.fonts.system.display}`;
        this.ctx.fillStyle = Theme.colors.primary.main;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.texts.gameOver, centerX, y + 60);

        // Main score display
        this.ctx.font = `700 64px ${Theme.fonts.system.display}`;
        this.ctx.fillStyle = Theme.colors.primary.dark;
        this.ctx.fillText(this.gameStats.score.toString(), centerX, y + 140);

        // Stats section
        this.ctx.font = `400 18px ${Theme.fonts.system.display}`;
        this.ctx.fillStyle = Theme.colors.text.secondary;

        const statsY = y + 180;
        const statSpacing = 30;

        // High score
        if (this.gameStats.score >= this.gameStats.highScore) {
            this.ctx.fillStyle = Theme.colors.secondary.medium;
            this.ctx.fillText('New Personal Best!', centerX, statsY);
        } else {
            this.ctx.fillText(
                `${this.texts.highScore}: ${this.gameStats.highScore}`,
                centerX,
                statsY
            );
        }

        // Additional stats
        let currentY = statsY + statSpacing;
        if (this.gameStats.additionalStats) {
            Object.entries(this.gameStats.additionalStats).forEach(([label, value]) => {
                this.ctx.fillStyle = Theme.colors.text.secondary;
                this.ctx.fillText(`${label}: ${value}`, centerX, currentY);
                currentY += statSpacing;
            });
        }
    }

    drawButtons() {
        const { x, y, width, height } = this.containerBounds;
        const buttonWidth = width * 0.9;
        const buttonHeight = 48;
        const startY = y + height - 140;

        // Store button bounds for click detection
        this.buttonBounds = {
            playAgain: {
                x: x + (width - buttonWidth) / 2,
                y: startY,
                width: buttonWidth,
                height: buttonHeight
            },
            startOver: {
                x: x + (width - buttonWidth) / 2,
                y: startY + buttonHeight + 16,
                width: buttonWidth / 2 - 8,
                height: buttonHeight
            },
            exit: {
                x: x + (width - buttonWidth) / 2 + buttonWidth / 2 + 8,
                y: startY + buttonHeight + 16,
                width: buttonWidth / 2 - 8,
                height: buttonHeight
            }
        };

        // Draw main "Try Again" button
        this.drawButton(
            this.buttonBounds.playAgain,
            this.texts.playAgain,
            Theme.colors.secondary.medium
        );

        // Draw secondary buttons side by side
        this.drawButton(
            this.buttonBounds.startOver,
            this.texts.startOver,
            Theme.colors.primary.medium
        );

        this.drawButton(
            this.buttonBounds.exit,
            this.texts.exit,
            Theme.colors.primary.medium
        );
    }

    drawButton(bounds, text, color) {
        this.ctx.save();

        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
        this.ctx.shadowBlur = 10;
        this.ctx.shadowOffsetY = 2;

        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.roundRect(bounds.x, bounds.y, bounds.width, bounds.height, bounds.height / 2);
        this.ctx.fill();

        this.ctx.font = `500 16px ${Theme.fonts.system.display}`;
        this.ctx.fillStyle = Theme.colors.surface.white;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(text, bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);

        this.ctx.restore();
    }

    handleClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Convert to canvas coordinates
        const canvasX = x * (this.canvas.width / rect.width);
        const canvasY = y * (this.canvas.height / rect.height);

        if (this.isPointInRect(canvasX, canvasY, this.buttonBounds.playAgain)) {
            this.callbacks.onTryAgain();
        }
        else if (this.isPointInRect(canvasX, canvasY, this.buttonBounds.startOver)) {
            this.callbacks.onStartOver();
        }
        else if (this.isPointInRect(canvasX, canvasY, this.buttonBounds.exit)) {
            this.callbacks.onExit();
        }
    }

    isPointInRect(x, y, rect) {
        return x >= rect.x && x <= rect.x + rect.width &&
            y >= rect.y && y <= rect.y + rect.height;
    }

    destroy() {
        if (this.clickHandler) {
            this.canvas.removeEventListener('click', this.clickHandler);
            this.clickHandler = null;
        }
    }
}

/*
javascript
HOW DO USE THIS CODE?
// Import the GameOverScreen class
// Initialize
const gameOver = new GameOverScreen({
    colors: { primary: '#4A90E2' },    // optional: customize colors
    texts: { gameOver: 'Game Over!' }  // optional: customize text
});

// Display game over screen
gameOver.draw(
    canvasContext,
    canvasElement,
    {
        score: 1000,
        highScore: 2000,
        additionalStats: {  // optional
            'Time': '2:30',
            'Level': 5
        }
    },
    () => startNewGame()  // play again callback
);

// Cleanup
gameOver.destroy();
*/