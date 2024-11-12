// gameScreens.js
import { CHARACTER_GROUPS, GameDataProvider } from './GameDataProvider.js';
import { GroupSelector } from './GroupSelector.js';

export class StartScreen {
    constructor(config) {
        Object.assign(this, {
            colors: config.colors,
            fonts: config.fonts,
            onStart: config.onStart,
            mode: config.mode,
            showGroupSelection: false,
            particles: [],
            animationFrame: null
        });

        console.log("Current mode:", this.mode);
        console.log("Available CHARACTER_GROUPS:", CHARACTER_GROUPS);

        // Get game data based on query string
        console.log("config.mode on load of Start Screen: ", this.mode);
        // Get game data based on query string
        const gameData = GameDataProvider.getData(this.mode, { script: this.mode, groups: [] });

        // Get script type from game data
        this.gameTitle = gameData.data.title;
        this.currentScript = this.mode;

        // Check if customization is available for this script
        this.hasCustomization = CHARACTER_GROUPS && CHARACTER_GROUPS[this.currentScript];

        // Initialize group selector only if customization is available
        if (this.hasCustomization) {
            this.groupSelector = new GroupSelector({
                ...config,
                script: this.currentScript,
                mode: config.mode,
                onSelect: selection => this.onStart(selection)
            });
        }

        console.log("Current script set to:", this.currentScript);

        // Initialize group selector
        this.groupSelector = new GroupSelector({
            ...config,
            script: this.currentScript,
            mode: config.mode,
            onSelect: selection => this.onStart(selection)
        });

        // UI Layout configuration
        this.layout = {
            title: { y: 40, fontSize: 48 },
            subtitle: { y: 80, fontSize: 24 },
            mainButton: { width: 320, height: 80, y: 180 },
            customizeLink: { y: 300, fontSize: 16 }
        };

        this.boundsConfig = {
            mainButton: canvas => ({
                x: (canvas.width - this.layout.mainButton.width) / 2,
                y: this.layout.mainButton.y,
                width: this.layout.mainButton.width,
                height: this.layout.mainButton.height
            }),
            customizeLink: canvas => ({
                x: canvas.width / 2 - 100,
                y: this.layout.customizeLink.y - 20,
                width: 200,
                height: 30
            })
        };

        this.animate();
    }
    // Particle System
    animate = () => {
        // Only add particles if we have valid character groups
        if (CHARACTER_GROUPS &&
            CHARACTER_GROUPS[this.currentScript] &&
            Math.random() < 0.1) {
            this.addParticle();
        }
        this.animationFrame = requestAnimationFrame(this.animate);
    }

    addParticle() {
        // Double check we have valid data
        if (!CHARACTER_GROUPS || !CHARACTER_GROUPS[this.currentScript]) {
            return;  // Silently return instead of logging error
        }
        const chars = Object.keys(CHARACTER_GROUPS[this.currentScript]);
        if (!chars.length) return;  // Make sure we have characters

        this.particles.push({
            char: chars[Math.floor(Math.random() * chars.length)],
            x: Math.random() * 800,
            y: -30,
            speed: 0.5 + Math.random() * 1,
            opacity: 0.1 + Math.random() * 0.2,
            scale: 0.5 + Math.random() * 1
        });
    }

    // Drawing Methods
    draw(ctx, canvas) {
        console.log("Drawing Start Screen");
        this.drawBackground(ctx, canvas);
        this.updateAndDrawParticles(ctx);

        if (this.showGroupSelection) {
            this.groupSelector.draw(ctx, canvas);
        } else {
            this.drawMainInterface(ctx, canvas);
        }
    }

    drawBackground(ctx, canvas) {
        console.log("Drawing Background");
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#F8FAFC');
        gradient.addColorStop(1, '#EFF6FF');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    updateAndDrawParticles(ctx) {
        ctx.save();
        this.particles = this.particles.filter(p => {
            p.y += p.speed;
            p.opacity = Math.max(0, p.opacity - 0.001);

            if (p.y > 600 || p.opacity <= 0) return false;

            ctx.globalAlpha = p.opacity;
            ctx.fillStyle = this.colors.primary;
            ctx.font = `${24 * p.scale}px "Noto Sans JP"`;
            ctx.fillText(p.char, p.x, p.y);

            return true;
        });
        ctx.restore();
    }

    drawMainInterface(ctx, canvas) {
        this.drawTitle(ctx, canvas);
        this.drawMainButton(ctx, canvas);
        // Only draw customize link if customization is available
        if (this.hasCustomization) {
            this.drawCustomizeLink(ctx, canvas);
        }
    }

    drawTitle(ctx, canvas) {
        ctx.save();
        ctx.shadowColor = 'rgba(74, 144, 226, 0.3)';
        ctx.shadowBlur = 20;

        // Main title
        ctx.font = `bold ${this.layout.title.fontSize}px ${this.fonts.display}`;
        ctx.fillStyle = '#2C3E50';
        ctx.textAlign = 'center';
        ctx.fillText('Kana Drop', canvas.width / 2, this.layout.title.y + 35);

        // Game type subtitle
        ctx.font = `${this.layout.subtitle.fontSize}px ${this.fonts.primary}`;
        ctx.fillStyle = '#64748B';  // Lighter color for subtitle
        ctx.fillText(this.gameTitle, canvas.width / 2, this.layout.subtitle.y + 35);

        ctx.restore();
    }

    drawMainButton(ctx, canvas) {
        const bounds = this.getBounds('mainButton', canvas);

        ctx.save();
        // Button effects
        ctx.shadowColor = 'rgba(74, 144, 226, 0.4)';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetY = 4;

        // Gradient background
        const gradient = ctx.createLinearGradient(bounds.x, bounds.y, bounds.x, bounds.y + bounds.height);
        gradient.addColorStop(0, '#4A90E2');
        gradient.addColorStop(1, '#357ABD');

        ctx.beginPath();
        ctx.roundRect(bounds.x, bounds.y, bounds.width, bounds.height, 16);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Highlight
        ctx.beginPath();
        ctx.roundRect(bounds.x, bounds.y, bounds.width, bounds.height / 2, 16);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fill();

        // Text
        const centerX = bounds.x + bounds.width / 2;
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFFFFF';

        // Main button text
        ctx.font = `bold 38px ${this.fonts.primary}`;
        ctx.fillText('Start Game', centerX, bounds.y + bounds.height / 2 + 12);

        // Character set indicator
        ctx.font = `16px ${this.fonts.primary}`;
        if (CHARACTER_GROUPS && CHARACTER_GROUPS[this.currentScript]) {
            const characterCount = Object.keys(CHARACTER_GROUPS[this.currentScript]).length;
            ctx.font = `16px ${this.fonts.primary}`;
            ctx.restore();
        }
    }

    handleClick(x, y, canvas) {
        console.log("Handling click at:", x, y);

        if (this.showGroupSelection && this.hasCustomization) {
            return this.groupSelector.handleClick(x, y, canvas);
        }

        const point = { x, y };
        const mainButtonBounds = this.getBounds('mainButton', canvas);

        if (this.isPointInRect(point, mainButtonBounds)) {
            this.onStart({
                script: this.currentScript,
                groups: this.hasCustomization ?
                    Object.keys(CHARACTER_GROUPS[this.currentScript]) :
                    []
            });
            return true;
        }

        // Only check customize link if customization is available
        if (this.hasCustomization) {
            const customizeLinkBounds = this.getBounds('customizeLink', canvas);
            if (this.isPointInRect(point, customizeLinkBounds)) {
                this.showGroupSelection = true;
                this.groupSelector.currentScript = this.mode;
                this.draw(canvas.getContext('2d'), canvas);
                return true;
            }
        }

        return false;
    }

    drawCustomizeLink(ctx, canvas) {
        ctx.font = `${this.layout.customizeLink.fontSize}px ${this.fonts.primary}`;
        ctx.fillStyle = this.colors.primary;
        ctx.textAlign = 'center';
        ctx.fillText('Customize practice groups →', canvas.width / 2, this.layout.customizeLink.y);
    }

    // Event Handling
    getBounds(type, canvas) {
        const boundsFn = this.boundsConfig[type];
        if (!boundsFn) {
            console.error(`No bounds configuration for type: ${type}`);
            return { x: 0, y: 0, width: 0, height: 0 };
        }
        return boundsFn(canvas);
    }

    // Helper for checking bounds
    isWithinBounds(type, x, y, canvas) {
        const bounds = this.getBounds(type, canvas);
        return this.isPointInRect({ x, y }, bounds);
    }

    isPointInRect(point, rect) {
        return point.x >= rect.x && point.x <= rect.x + rect.width &&
            point.y >= rect.y && point.y <= rect.y + rect.height;
    }


    handleMouseMove(x, y, canvas) {
        const point = { x, y };
        const isOverButton = this.isPointInRect(point, this.getBounds('mainButton', canvas));
        const isOverLink = this.hasCustomization &&
            this.isPointInRect(point, this.getBounds('customizeLink', canvas));

        canvas.style.cursor = (isOverButton || isOverLink) ? 'pointer' : 'default';
        return isOverButton || isOverLink;
    }
}