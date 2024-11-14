// gameScreens.js
import { CHARACTER_GROUPS, SCRIPT_OPTIONS, GameDataProvider } from './GameDataProvider.js';
import { GroupSelector } from './GroupSelector.js';
import Theme from './Theme.js';

export class StartScreen {
    constructor(config) {
        Object.assign(this, {
            colors: Theme.colors,
            fonts: Theme.fonts,
            onStart: config.onStart,
            mode: config.mode || 'hiragana', // Default to hiragana
            showGroupSelection: false,
            particles: [],
            animationFrame: null
        });

        // Get game data
        const gameData = GameDataProvider.getData(this.mode, {
            script: this.mode,
            groups: []
        });
        this.gameTitle = gameData.data.title;

        // Single GroupSelector initialization
        if (SCRIPT_OPTIONS[this.mode]?.allowGroups) {
            this.groupSelector = new GroupSelector({
                ...config,
                script: this.mode,
                mode: this.mode,
                onSelect: selection => this.onStart(selection)
            });
        }

        // Simplified layout configuration
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

        // Simplified bounds configuration
        this.boundsConfig = {
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
        this.drawBackground(ctx, canvas);
        this.updateAndDrawParticles(ctx);
        this.drawHomeLink(ctx, canvas);  // Always show home link

        if (this.showGroupSelection && SCRIPT_OPTIONS[this.mode]?.allowGroups) {
            this.groupSelector.draw(ctx, canvas);
        } else {
            this.drawMainInterface(ctx, canvas);
        }
    }

    drawBackground(ctx, canvas) {
        console.log("Drawing Background");
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(.3, Theme.colors.surface.truewhite);
        gradient.addColorStop(1, Theme.colors.primary.pale);
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

        if (SCRIPT_OPTIONS[this.mode]?.allowGroups) {
            this.drawCustomizeLink(ctx, canvas);
        }
    }

    drawTitle(ctx, canvas) {
        ctx.save();

        // Main title with shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
        ctx.shadowBlur = 15;
        ctx.font = `600 ${this.layout.title.fontSize}px ${Theme.fonts.system.display}`;
        ctx.fillStyle = Theme.colors.primary.main;
        ctx.textAlign = 'center';
        ctx.fillText('Kana Drop', canvas.width / 2, this.layout.title.y);

        // Subtitle with different styling
        ctx.shadowBlur = 0;
        ctx.font = Theme.fonts.sizes.ui.normal + Theme.fonts.system.display;
        ctx.fillStyle = Theme.colors.text.secondary;
        ctx.fillText(
            this.gameTitle,
            canvas.width / 2,
            this.layout.title.y + this.layout.title.subtitleSpacing
        );

        ctx.restore();
    }

    drawScriptSelector(ctx, canvas) {
        const bounds = this.boundsConfig.scriptSelector(canvas);
        const buttonWidth = bounds.width / 3;

        Object.entries(SCRIPT_OPTIONS).forEach(([script, data], index) => {
            const x = bounds.x + (buttonWidth + this.layout.scriptSelector.spacing) * index;
            const isSelected = script === this.currentScript;

            ctx.save();

            // Button background with improved styling
            ctx.beginPath();
            ctx.roundRect(
                x, bounds.y,
                buttonWidth, bounds.height,
                this.layout.scriptSelector.buttonRadius
            );

            if (isSelected) {
                // Selected state with gradient
                const gradient = ctx.createLinearGradient(x, bounds.y, x, bounds.y + bounds.height);
                gradient.addColorStop(0, Theme.colors.primary.medium);
                gradient.addColorStop(1, Theme.colors.primary.dark);
                ctx.fillStyle = gradient;

                ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
                ctx.shadowBlur = 8;
                ctx.shadowOffsetY = 2;
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
                bounds.y + bounds.height / 2
            );

            ctx.restore();
        });
    }

    drawMainButton(ctx, canvas) {
        const bounds = this.boundsConfig.mainButton(canvas);

        ctx.save();

        // Enhanced button styling
        ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
        ctx.shadowBlur = 12;
        ctx.shadowOffsetY = 4;

        // Gradient background
        const gradient = ctx.createLinearGradient(
            bounds.x, bounds.y,
            bounds.x, bounds.y + bounds.height
        );
        gradient.addColorStop(0, Theme.colors.primary.medium);
        gradient.addColorStop(1, Theme.colors.primary.dark);

        // Pill-shaped button
        ctx.beginPath();
        ctx.roundRect(
            bounds.x, bounds.y,
            bounds.width, bounds.height,
            this.layout.mainButton.radius
        );
        ctx.fillStyle = gradient;
        ctx.fill();

        // Button text
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
    }

    drawHomeLink(ctx, canvas) {
        ctx.save();

        // Position in top-right corner with padding
        const padding = 15;
        const width = 130;
        const height = 36;
        const x = canvas.width - width - padding;
        const y = padding;

        // Button background
        ctx.fillStyle = Theme.colors.surface.white;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.roundRect(x, y, width, height, height / 2);
        ctx.fill();

        // Link text
        ctx.font = `500 ${Theme.fonts.sizes.ui.small} ${Theme.fonts.system.display}`;
        ctx.fillStyle = Theme.colors.text.secondary;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Wizling Home', x + width / 2, y + height / 2);

        // Store bounds for click detection
        this.homeLinkBounds = { x, y, width, height };

        ctx.restore();
    }

    handleClick(x, y, canvas) {
        const point = { x, y };

        // Check home link first
        if (this.homeLinkBounds && this.isPointInRect(point, this.homeLinkBounds)) {
            window.location.href = 'https://wizling.com';
            return true;
        }

        // Handle group selection if active
        if (this.showGroupSelection && this.groupSelector) {
            return this.groupSelector.handleClick(x, y, canvas);
        }

        // Main button
        if (this.isPointInRect(point, this.boundsConfig.mainButton(canvas))) {
            // If groups are allowed, use the GroupSelector's selected groups
            const groups = SCRIPT_OPTIONS[this.mode]?.allowGroups && this.groupSelector ?
                Object.keys(CHARACTER_GROUPS[this.mode]) : [];  // Default to all groups if no selector

            this.onStart({
                script: this.mode,
                groups: groups
            });
            return true;
        }

        // Customize link
        if (SCRIPT_OPTIONS[this.mode]?.allowGroups &&
            this.isPointInRect(point, this.boundsConfig.customizeLink(canvas))) {
            this.showGroupSelection = true;
            return true;
        }

        return false;
    }

    drawCustomizeLink(ctx, canvas) {
        ctx.font = Theme.fonts.sizes.ui.small + ' ' + Theme.fonts.system.display;
        ctx.fillStyle = Theme.colors.primary.medium;
        ctx.textAlign = 'center';
        ctx.fillText('Customize practice groups →', canvas.width / 2, this.layout.links.customize.y);
    }

    // Event Handling
    getBounds(type, canvas) {
        const boundsFn = this.boundsConfig[type];
        if (!boundsFn) {
            console.error(`No bounds configuration for type: ${type} `);
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