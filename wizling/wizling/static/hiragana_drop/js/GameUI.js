// GameUI.js
import Theme from './Theme.js';

export default class GameUI {
    constructor(ctx) {
        this.ctx = ctx;
        this.effectStart = 0;
        this.isAnimatingEffect = false;
        this.currentEffect = null;

        // Base dimensions for reference
        this.baseWidth = 1129;
        this.baseHeight = 725;

        // Initialize scales
        this.scaleX = 1;
        this.scaleY = 1;

        // Initialize layout
        this.initializeLayout();
    }


    initializeLayout() {
        this.layout = {
            header: {
                height: 52,
                padding: 16
            },
            score: {
                x: 24,
                y: 24,
                fontSize: 24
            },
            progress: {
                startX: 120,
                y: 24,
                spacing: 24
            }
        };
    }




    // GameUI.js
    // Add this method to your existing GameUI class

    drawUI(gameState) {
        if (!this.ctx) return;

        const {
            version,
            score,
            currentStreak,
            bestStreak,
            maxMistakes,
            mistakesMade,
            gameTitle
        } = gameState;

        // Draw header overlay
        this.drawHeaderOverlay();

        // Draw content within header
        this.drawHeaderContent(gameState);
    }

    drawHeaderOverlay() {
        if (!this.ctx) return;

        const headerHeight = this.layout.header.height;
        const canvasWidth = this.ctx.canvas?.width || this.width || this.baseWidth;

        this.ctx.save();

        // Semi-transparent background
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
        this.ctx.shadowBlur = 8;
        this.ctx.shadowOffsetY = 2;

        // Draw header background with bottom border radius
        this.ctx.beginPath();
        this.ctx.roundRect(0, 0, canvasWidth, headerHeight, [0, 0, 12, 12]);
        this.ctx.fill();

        this.ctx.restore();
    }


    drawHeaderContent(gameState) {
        if (!this.ctx) return;

        const {
            version,
            score,
            bestStreak,
            maxMistakes,
            mistakesMade,
            gameTitle
        } = gameState;

        const canvasWidth = this.ctx.canvas?.width || this.width || this.baseWidth;

        this.ctx.save();

        // Game title - centered
        this.ctx.font = `${Theme.fonts.weights.medium} ${Theme.fonts.sizes.ui.normal} ${Theme.fonts.system.display}`;
        this.ctx.fillStyle = Theme.colors.text.primary;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(gameTitle, canvasWidth / 2, this.layout.score.y);

        // Score - left side
        this.ctx.textAlign = 'left';
        this.ctx.font = `${Theme.fonts.weights.bold} ${Theme.fonts.sizes.ui.large} ${Theme.fonts.system.display}`;
        this.ctx.fillStyle = Theme.colors.primary.main;
        this.ctx.fillText(score.toString(), this.layout.score.x, this.layout.score.y);

        if (bestStreak > 0) {
            this.ctx.font = `${Theme.fonts.weights.normal} ${Theme.fonts.sizes.ui.small} ${Theme.fonts.system.display}`;
            this.ctx.fillStyle = Theme.colors.text.secondary;
            this.ctx.fillText(`Best: ${bestStreak}`, this.layout.score.x, this.layout.score.y + 18);
        }

        // Progress indicators - right side
        const progressStartX = canvasWidth - this.layout.progress.startX;
        this.drawProgressLives(maxMistakes, mistakesMade, null, progressStartX, this.layout.progress.y);

        // Version - far right
        this.ctx.font = `${Theme.fonts.weights.normal} ${Theme.fonts.sizes.ui.small} ${Theme.fonts.system.display}`;
        this.ctx.fillStyle = Theme.colors.text.secondary;
        this.ctx.textAlign = 'right';
        this.ctx.fillText(version, canvasWidth - this.layout.header.padding, this.layout.score.y);

        this.ctx.restore();
    }

    drawProgressLives(maxMistakes, mistakesMade, highlightIndex, startX, centerY) {
        if (!this.ctx) return;

        const spacing = this.layout.progress.spacing;
        const remainingLives = maxMistakes - mistakesMade;

        for (let i = 0; i < maxMistakes; i++) {
            const x = startX + (i * spacing);
            const isHighlight = highlightIndex === i;
            const isActive = i < remainingLives;

            this.ctx.save();

            const radius = Math.round(8 * this.scaleX);
            const innerRadius = Math.round(4 * this.scaleX);

            // Outer circle
            this.ctx.beginPath();
            this.ctx.arc(x, centerY, radius, 0, Math.PI * 2);

            if (isHighlight && isActive) {
                this.ctx.fillStyle = Theme.colors.progress.active.outer;
                this.ctx.shadowColor = Theme.colors.progress.active.glow;
                this.ctx.shadowBlur = Theme.game.effects.progressGlow.blur;
            } else {
                this.ctx.fillStyle = isActive ?
                    Theme.colors.progress.active.outer :
                    Theme.colors.progress.inactive.outer;
            }
            this.ctx.fill();

            // Inner dot
            this.ctx.beginPath();
            this.ctx.arc(x, centerY, innerRadius, 0, Math.PI * 2);
            this.ctx.fillStyle = isActive ?
                Theme.colors.progress.active.inner :
                Theme.colors.progress.inactive.inner;

            if (isHighlight && isActive) {
                this.ctx.shadowColor = Theme.colors.progress.active.glow;
                this.ctx.shadowBlur = Theme.game.effects.progressGlow.blur;
            }
            this.ctx.fill();

            this.ctx.restore();
        }
    }

    handleResize(width, height) {
        // Store the new dimensions
        this.width = width;
        this.height = height;

        // Calculate new scale factors
        this.scaleX = width / this.baseWidth;
        this.scaleY = height / this.baseHeight;

        // Update layout values if needed
        this.updateLayoutForSize();
    }

    updateLayoutForSize() {
        // Scale layout values based on current size
        this.layout = {
            header: {
                height: Math.round(52 * this.scaleY),
                padding: Math.round(16 * this.scaleX)
            },
            score: {
                x: Math.round(24 * this.scaleX),
                y: Math.round(24 * this.scaleY),
                fontSize: Math.round(24 * this.scaleY)
            },
            progress: {
                startX: Math.round(120 * this.scaleX),
                y: Math.round(24 * this.scaleY),
                spacing: Math.round(24 * this.scaleX)
            }
        };
    }

    drawScoreArea(score, currentStreak, bestStreak) {
        // Score container with subtle background
        this.ctx.save();
        this.ctx.fillStyle = Theme.colors.background.primary;
        this.ctx.shadowColor = Theme.colors.primary.pale;
        this.ctx.shadowBlur = 10;
        this.ctx.beginPath();
        this.ctx.roundRect(20, 15, 160, 60, 12);
        this.ctx.fill();
        this.ctx.restore();

        // Main score
        this.ctx.font = `${Theme.fonts.weights.bold} ${Theme.fonts.sizes.ui.title} ${Theme.fonts.system.display}`;
        this.ctx.fillStyle = Theme.colors.primary.main;
        this.ctx.textAlign = 'left';
        this.ctx.fillText(score.toString(), 35, 55);

        // Streak display
        if (currentStreak > 0) {
            this.ctx.save();
            // Streak container
            this.ctx.fillStyle = Theme.colors.secondary.pale;
            this.ctx.beginPath();
            this.ctx.roundRect(130, 25, 40, 30, 8);
            this.ctx.fill();

            // Streak count
            this.ctx.font = `${Theme.fonts.weights.medium} ${Theme.fonts.sizes.ui.small} ${Theme.fonts.system.display}`;
            this.ctx.fillStyle = Theme.colors.secondary.main;
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`${currentStreak}×`, 150, 45);
            this.ctx.restore();
        }

        // Best streak (subtle display)
        this.ctx.font = `${Theme.fonts.weights.normal} ${Theme.fonts.sizes.ui.small} ${Theme.fonts.system.display}`;
        this.ctx.fillStyle = Theme.colors.text.secondary;
        this.ctx.fillText(`Best: ${bestStreak}`, 35, 70);
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

        const opacity = Math.sin(progress * Math.PI);
        this.ctx.save();

        if (this.currentEffect === 'success') {
            this.ctx.fillStyle = `rgba(${this.hexToRgb(Theme.colors.success.glow)}, ${opacity * 0.3})`;
        } else if (this.currentEffect === 'mistake') {
            this.ctx.fillStyle = `rgba(${this.hexToRgb(Theme.colors.mistake.glow)}, ${opacity * 0.3})`;
        }

        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.restore();

        requestAnimationFrame(this.animateEffect.bind(this));
    }

    drawVersion(version) {
        this.ctx.font = `${Theme.fonts.weights.normal} ${Theme.fonts.sizes.ui.small} ${Theme.fonts.system.display}`;
        this.ctx.fillStyle = Theme.colors.text.secondary;
        this.ctx.textAlign = 'right';
        this.ctx.fillText(version, this.ctx.canvas.width - 20, 30);
    }

    drawGameTitle(title) {
        this.ctx.save();

        // Title background
        const textMetrics = this.ctx.measureText(title);
        const padding = 20;
        const width = textMetrics.width + padding * 2;

        this.ctx.fillStyle = Theme.colors.surface.white;
        this.ctx.shadowColor = Theme.colors.primary.pale;
        this.ctx.shadowBlur = 8;
        this.ctx.beginPath();
        this.ctx.roundRect(
            (this.ctx.canvas.width - width) / 2,
            10,
            width,
            40,
            8
        );
        this.ctx.fill();

        // Title text
        this.ctx.font = `${Theme.fonts.weights.medium} ${Theme.fonts.sizes.ui.title} ${Theme.fonts.system.display}`;
        this.ctx.fillStyle = Theme.colors.primary.main;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(title, this.ctx.canvas.width / 2, 30);

        this.ctx.restore();
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ?
            `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` :
            '0, 0, 0';
    }
}