// GameOverScreen.js
export default class GameOverScreen {
    constructor(options = {}) {
        this.colors = {
            overlay: 'rgba(44, 62, 80, 0.85)',
            primary: '#4A90E2',
            text: '#2C3E50',
            buttonHover: '#3A80D2',
            ...options.colors
        };

        this.fonts = {
            primary: "'Nunito', sans-serif",
            display: "'Poppins', sans-serif",
            ...options.fonts
        };

        // Configurable text
        this.texts = {
            gameOver: 'Game Over',
            score: 'Score',
            highScore: 'High Score',
            playAgain: 'Play Again',
            ...options.texts
        };
    }

    draw(ctx, canvas, gameStats, onPlayAgain) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.gameStats = gameStats;
        this.onPlayAgain = onPlayAgain;

        this.drawOverlay();
        this.drawContainer();
        this.drawContent();
        this.drawPlayAgainButton();

        // Add click handler if not already added
        if (!this.clickHandler) {
            this.clickHandler = this.handleClick.bind(this);
            this.canvas.addEventListener('click', this.clickHandler);
        }
    }

    // In GameOverScreen.js
    drawOverlay() {
        // Ensure we clear any existing content first
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw the overlay
        this.ctx.save();
        this.ctx.fillStyle = 'rgb(44, 62, 80)';  // Solid dark blue-gray color
        this.ctx.globalAlpha = 0.95;  // Makes overlay slightly translucent
        // Make sure we fill the entire canvas, including any extra space
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height + 200); // Add extra height
        this.ctx.globalAlpha = 1.0;  // Reset alpha for subsequent drawings
        this.ctx.restore();
    }


    drawContainer() {
        const containerWidth = this.canvas.width * 0.8;
        const containerHeight = this.canvas.height * 0.6;
        const x = (this.canvas.width - containerWidth) / 2;
        const y = (this.canvas.height - containerHeight) / 2;

        this.containerBounds = { x, y, width: containerWidth, height: containerHeight };

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.roundRect(x, y, containerWidth, containerHeight, 20);
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        this.ctx.shadowBlur = 20;
        this.ctx.shadowOffsetY = 10;
        this.ctx.fill();
        this.ctx.restore();
    }

    drawContent() {
        const { x, y } = this.containerBounds;
        const containerHeight = this.containerBounds.height;

        // Calculate spacing to avoid overlap
        const titleSpacing = 80;           // Distance from top for "Game Over"
        const statsStartY = titleSpacing + 60;  // Start stats below title
        const statSpacing = 45;           // Space between each stat line
        const buttonOffset = 120;         // Space to reserve for button at bottom

        // Game Over Text
        this.ctx.font = `bold 48px ${this.fonts.display}`;
        this.ctx.fillStyle = this.colors.text;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.texts.gameOver, this.canvas.width / 2, y + titleSpacing);

        // Draw all stats with consistent spacing
        this.ctx.font = `32px ${this.fonts.primary}`;
        let currentY = y + statsStartY;

        // Main stats (score and high score)
        this.ctx.fillText(
            `${this.texts.score}: ${this.gameStats.score}`,
            this.canvas.width / 2,
            currentY
        );
        currentY += statSpacing;

        this.ctx.fillText(
            `${this.texts.highScore}: ${this.gameStats.highScore}`,
            this.canvas.width / 2,
            currentY
        );
        currentY += statSpacing;

        // Additional stats with smaller font
        if (this.gameStats.additionalStats) {
            this.ctx.font = `24px ${this.fonts.primary}`;
            for (const [label, value] of Object.entries(this.gameStats.additionalStats)) {
                // Check if we're getting too close to the button
                if (currentY < y + containerHeight - buttonOffset) {
                    this.ctx.fillText(
                        `${label}: ${value}`,
                        this.canvas.width / 2,
                        currentY
                    );
                    currentY += statSpacing * 0.8; // Slightly smaller spacing for additional stats
                }
            }
        }
    }

    drawPlayAgainButton(isHovered = false) {
        const buttonWidth = 200;
        const buttonHeight = 60;
        const buttonX = (this.canvas.width - buttonWidth) / 2;
        // Position button a fixed distance from bottom of container
        const buttonY = this.containerBounds.y + this.containerBounds.height - 90;

        this.buttonBounds = { x: buttonX, y: buttonY, width: buttonWidth, height: buttonHeight };

        // Add button shadow
        this.ctx.save();
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        this.ctx.shadowBlur = 10;
        this.ctx.shadowOffsetY = 5;

        // Draw button background
        this.ctx.beginPath();
        this.ctx.roundRect(buttonX, buttonY, buttonWidth, buttonHeight, 30);
        this.ctx.fillStyle = isHovered ? this.colors.buttonHover : this.colors.primary;
        this.ctx.fill();

        // Draw button text
        this.ctx.font = `bold 24px ${this.fonts.primary}`;
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(
            this.texts.playAgain,
            this.canvas.width / 2,
            buttonY + buttonHeight / 2 + 8
        );

        this.ctx.restore();
    }

    handleClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        if (this.isPointInButton(x, y)) {
            this.destroy();
            this.onPlayAgain();
        }
    }

    isPointInButton(x, y) {
        return x >= this.buttonBounds.x &&
            x <= this.buttonBounds.x + this.buttonBounds.width &&
            y >= this.buttonBounds.y &&
            y <= this.buttonBounds.y + this.buttonBounds.height;
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