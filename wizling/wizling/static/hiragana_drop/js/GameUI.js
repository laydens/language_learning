// GameUI.js
export default class GameUI {
    constructor(ctx, colors, fonts) {
        this.ctx = ctx;
        this.colors = colors;
        this.fonts = fonts;
    }

    drawVersion(version) {
        this.ctx.font = '16px Arial';
        this.ctx.fillStyle = '#666666';
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`v${version}`, this.ctx.canvas.width - 20, 30);
    }

    drawScore(score) {
        this.ctx.textAlign = 'left';
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = `600 24px ${this.fonts.primary}`;
        this.ctx.fillText(`Score: ${score}`, 20, 40);
    }

    drawStreak(currentStreak, bestStreak) {
        this.ctx.font = `16px ${this.fonts.primary}`;
        this.ctx.fillText(`Streak: ${currentStreak} (Best: ${bestStreak})`, 20, 65);
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

    drawLives(maxMistakes, mistakesMade) {
        const mistakeX = this.ctx.canvas.width - 150;
        const hearts = maxMistakes - mistakesMade;
        for (let i = 0; i < maxMistakes; i++) {
            const color = i < hearts ? this.colors.accent : '#D8D8D8';
            this.drawHeart(mistakeX + (i * 30), 30, 12, color);
        }
    }

    drawGameTitle(title) {
        this.ctx.font = `600 24px ${this.fonts.primary}`;
        this.ctx.fillStyle = this.colors.text;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(title, this.ctx.canvas.width / 2, 30);
    }

    drawUI(gameState) {
        const {
            version,
            score,
            currentStreak,
            bestStreak,
            maxMistakes,
            mistakesMade,
            gameTitle
        } = gameState;

        this.drawVersion(version);
        this.drawScore(score);
        this.drawStreak(currentStreak, bestStreak);
        this.drawLives(maxMistakes, mistakesMade);
        this.drawGameTitle(gameTitle);
    }
}