// UIRenderer.js
import { CHARACTER_GROUPS, SCRIPT_OPTIONS, GameDataProvider } from './GameDataProvider.js';
import Theme from './Theme.js';

export class StartScreenUI {
    constructor() {

        this.bounds = {
            mainButton: canvas => ({
                x: (canvas.width - this.layout.mainButton.width) / 2,
                y: this.layout.mainButton.y,
                width: this.layout.mainButton.width,
                height: this.layout.mainButton.height
            }),
            customizeLink: canvas => ({
                x: canvas.width / 2 - 120,
                y: this.layout.links.customize.y - this.layout.links.customize.height / 2,
                width: 240,
                height: this.layout.links.customize.height
            }),
            homeLink: canvas => ({
                x: canvas.width / 2 - 120,
                y: this.layout.links.home.y - this.layout.links.home.height / 2,
                width: 240,
                height: this.layout.links.home.height
            })
        };


        // Layout configuration (needed by UIRenderer)
        this.layout = {
            title: {
                y: 80,
                fontSize: 56,
                subtitleSpacing: 35
            },
            mainButton: {
                width: 280,
                height: 56,
                y: 300,
                radius: 28
            },
            links: {
                customize: { y: 390, fontSize: 16, height: 40 },
                home: { y: 440, fontSize: 16, height: 40 }
            }
        };
    }

    drawTitle(ctx, canvas, gameTitle) {
        ctx.save();

        // Main title
        ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
        ctx.shadowBlur = 15;
        ctx.font = `600 ${this.layout.title.fontSize}px ${Theme.fonts.system.display}`;
        ctx.fillStyle = Theme.colors.primary.main;
        ctx.textAlign = 'center';
        ctx.fillText('Kana Drop', canvas.width / 2, this.layout.title.y);

        // Mode subtitle
        ctx.shadowBlur = 0;
        ctx.font = `${Theme.fonts.sizes.ui.normal} ${Theme.fonts.system.display}`;
        ctx.fillStyle = Theme.colors.text.secondary;
        ctx.fillText(
            gameTitle,
            canvas.width / 2,
            this.layout.title.y + this.layout.title.subtitleSpacing
        );

        ctx.restore();
    }

    drawMainButton(ctx, canvas) {
        const bounds = this.getButtonBounds(canvas);

        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
        ctx.shadowBlur = 12;
        ctx.shadowOffsetY = 4;

        const gradient = ctx.createLinearGradient(
            bounds.x, bounds.y,
            bounds.x, bounds.y + bounds.height
        );
        gradient.addColorStop(0, Theme.colors.secondary.medium);
        gradient.addColorStop(1, Theme.colors.secondary.dark);

        ctx.beginPath();
        ctx.roundRect(
            bounds.x, bounds.y,
            bounds.width, bounds.height,
            this.layout.mainButton.radius
        );
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.font = `600 20px ${Theme.fonts.system.display}`;
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
            'Start Game',
            bounds.x + bounds.width / 2,
            bounds.y + bounds.height / 2
        );

        ctx.restore();
        return bounds;
    }

    draw(ctx, canvas) {
        ctx.save();
        this.drawBackground(ctx, canvas);
        ctx.restore();
    }

    drawBackground(ctx, canvas) {
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(.3, Theme.colors.surface.truewhite);
        gradient.addColorStop(1, Theme.colors.primary.pale);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // cleanup() {
    //     if (this.animationFrame) {
    //         cancelAnimationFrame(this.animationFrame);
    //         this.animationFrame = null;
    //     }
    //     this.fallingCharacters = [];
    // }

    drawHomeLink(ctx, canvas) {
        const padding = 15;
        const width = 130;
        const height = 36;
        const x = canvas.width - width - padding;
        const y = padding;

        ctx.save();
        ctx.fillStyle = Theme.colors.surface.white;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.roundRect(x, y, width, height, height / 2);
        ctx.fill();

        ctx.font = `500 ${Theme.fonts.sizes.ui.small} ${Theme.fonts.system.display}`;
        ctx.fillStyle = Theme.colors.text.secondary;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Wizling Home', x + width / 2, y + height / 2);
        ctx.restore();

        return { x, y, width, height };
    }

    drawCustomizeLink(ctx, canvas) {
        ctx.font = Theme.fonts.sizes.ui.small + ' ' + Theme.fonts.system.display;
        ctx.fillStyle = Theme.colors.primary.medium;
        ctx.textAlign = 'center';
        ctx.fillText('Customize practice groups →',
            canvas.width / 2,
            this.layout.links.customize.y
        );

        return {
            x: canvas.width / 2 - 120,
            y: this.layout.links.customize.y - 20,
            width: 240,
            height: 40
        };
    }

    getButtonBounds(canvas) {
        return {
            x: (canvas.width - this.layout.mainButton.width) / 2,
            y: this.layout.mainButton.y,
            width: this.layout.mainButton.width,
            height: this.layout.mainButton.height
        };
    }

    drawScriptSelector(ctx, canvas, currentScript) {
        const selectorWidth = 480;
        const buttonHeight = 48;
        const spacing = 12;
        const y = 160;
        const buttons = [];

        Object.entries(SCRIPT_OPTIONS).forEach(([script, data], index) => {
            const buttonWidth = (selectorWidth - spacing * 2) / 3;
            const x = (canvas.width - selectorWidth) / 2 + (buttonWidth + spacing) * index;
            const isSelected = script === currentScript;

            // Draw button
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(x, y, buttonWidth, buttonHeight, 12);

            if (isSelected) {
                // Selected state
                const gradient = ctx.createLinearGradient(x, y, x, y + buttonHeight);
                gradient.addColorStop(0, Theme.colors.primary.medium);
                gradient.addColorStop(1, Theme.colors.primary.dark);
                ctx.fillStyle = gradient;
                ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
                ctx.shadowBlur = 8;
            } else {
                ctx.fillStyle = Theme.colors.surface.white;
                ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
                ctx.shadowBlur = 4;
            }
            ctx.fill();

            // Button text
            ctx.font = `${Theme.fonts.weights.medium} 16px ${Theme.fonts.system.display}`;
            ctx.fillStyle = isSelected ? '#FFFFFF' : Theme.colors.primary.main;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(
                script.charAt(0).toUpperCase() + script.slice(1),
                x + buttonWidth / 2,
                y + buttonHeight / 2
            );
            ctx.restore();

            buttons.push({
                script,
                bounds: { x, y, width: buttonWidth, height: buttonHeight }
            });

            // return { script, bounds: { x, y, width: buttonWidth, height: buttonHeight } };
        });

        return buttons;  // Return button info for click handling
    }
}




