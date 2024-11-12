// GameUI.js
import Theme from './Theme.js';

export default class GameUI {
    constructor(ctx) {
        this.ctx = ctx;

        this.effectStart = 0;
        this.isAnimatingEffect = false;
        this.currentEffect = null;
    }

    drawLives(maxMistakes, mistakesMade, highlightIndex = null) {
        const centerY = 30;
        const startX = this.ctx.canvas.width - 150;
        const spacing = 30;
        const hearts = maxMistakes - mistakesMade;

        for (let i = 0; i < maxMistakes; i++) {
            const x = startX + (i * spacing);
            const isHighlight = highlightIndex === i;
            const isActive = i < hearts;

            // Outer circle
            this.ctx.beginPath();
            this.ctx.arc(x, centerY, 10, 0, Math.PI * 2);

            if (isHighlight && isActive) {
                this.ctx.fillStyle = Theme.colors.progress.active.outer;
                this.ctx.shadowColor = Theme.colors.progress.active.glow;
                this.ctx.shadowBlur = Theme.game.effects.progressGlow.blur;
            } else {
                this.ctx.fillStyle = isActive ?
                    Theme.colors.progress.active.outer :
                    Theme.colors.progress.inactive.outer;
                this.ctx.shadowBlur = 0;
            }
            this.ctx.fill();

            // Inner circle
            this.ctx.beginPath();
            this.ctx.arc(x, centerY, 5, 0, Math.PI * 2);
            this.ctx.fillStyle = isActive ?
                Theme.colors.progress.active.inner :
                Theme.colors.progress.inactive.inner;

            if (isHighlight && isActive) {
                this.ctx.shadowColor = Theme.colors.progress.active.glow;
                this.ctx.shadowBlur = Theme.game.effects.progressGlow.blur;
            }
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        }
    }

    startEffect(type) {
        this.isAnimatingEffect = true;
        this.currentEffect = type;
        this.effectStart = performance.now();
        this.animateEffect();
    }

    animateEffect(timestamp) {
        if (!this.isAnimatingEffect) return;

        const progress = (timestamp - this.effectStart) / Theme.game.effects.duration;

        if (progress >= 1) {
            this.isAnimatingEffect = false;
            this.currentEffect = null;
            return;
        }

        // Calculate fade opacity using sine wave for smooth fade in/out
        const opacity = Math.sin(progress * Math.PI);

        if (this.currentEffect === 'success') {
            this.ctx.fillStyle = Theme.colors.background.effects.success;
            this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        } else if (this.currentEffect === 'mistake') {
            this.ctx.fillStyle = Theme.colors.background.effects.mistake;
            this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        }

        requestAnimationFrame(this.animateEffect.bind(this));
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