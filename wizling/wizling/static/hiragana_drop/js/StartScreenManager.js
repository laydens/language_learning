// GameStartScreen.js
import { CHARACTER_GROUPS, SCRIPT_OPTIONS, GameDataProvider } from './GameDataProvider.js';
import { GroupSelector } from './GroupSelector.js';
import { StartParticleManager } from './StartParticleManager.js';
import { StartScreenUI } from './StartScreenUI.js';
import Theme from './Theme.js';

export class StartScreenManager {
    constructor(config) {
        Object.assign(this, {
            colors: Theme.colors,
            fonts: Theme.fonts,
            onStart: config.onStart,
            mode: config.mode || 'hiragana',
            showGroupSelection: false
        });

        this.updateGameData();  // Set initial game data
        this.scriptButtons = [];

        // Initialize managers/UI
        this.particleManager = new StartParticleManager();
        this.startScreenUI = new StartScreenUI(this.layout, this.gameTitle);

        // Initialize group selector if needed
        if (SCRIPT_OPTIONS[this.mode]?.allowGroups) {
            this.groupSelector = new GroupSelector({
                script: this.mode,
                mode: this.mode,
                onSelect: selection => this.onStart(selection)
            });
        }

        // Start systems
        this.particleManager.start(this.mode);
    }



    draw(ctx, canvas) {
        // Draw background first
        this.startScreenUI.drawBackground(ctx, canvas);

        // Draw particles
        this.particleManager.draw(ctx);

        if (this.showGroupSelection && SCRIPT_OPTIONS[this.mode]?.allowGroups) {
            this.groupSelector.draw(ctx, canvas);
        } else {
            // Draw main interface
            this.drawMainInterface(ctx, canvas);
        }

        // Draw home link last (on top)
        this.homeLinkBounds = this.startScreenUI.drawHomeLink(ctx, canvas);
    }

    updateGameData() {
        console.log('Updating game data for mode:', this.mode);
        const gameData = GameDataProvider.getData(this.mode, {
            script: this.mode,
            groups: []
        });
        this.gameTitle = gameData.data.title ||
            `${this.mode.charAt(0).toUpperCase() + this.mode.slice(1)} Practice`;

        // Update UI with new title
        if (this.startScreenUI) {
            this.startScreenUI.gameTitle = this.gameTitle;
        }
    }


    drawMainInterface(ctx, canvas) {
        this.startScreenUI.drawTitle(ctx, canvas, this.gameTitle);

        // Draw script selector and store bounds for each button
        this.scriptButtons = this.startScreenUI.drawScriptSelector(ctx, canvas, this.mode);

        this.mainButtonBounds = this.startScreenUI.drawMainButton(ctx, canvas);

        // Only show customize for hiragana/katakana
        if (this.mode !== 'mixed' && SCRIPT_OPTIONS[this.mode]?.allowGroups) {
            this.customizeLinkBounds = this.startScreenUI.drawCustomizeLink(ctx, canvas);
        }
    }



    handleClick(x, y, canvas) {
        const point = { x, y };

        // Handle group selection if active
        if (this.showGroupSelection && this.groupSelector) {
            const handled = this.groupSelector.handleClick(x, y, canvas);
            if (handled) return true;
        }

        // Check script selector buttons first
        for (const button of this.scriptButtons) {
            if (this.isPointInRect(point, button.bounds)) {
                if (this.mode !== button.script) {
                    // Update mode
                    this.mode = button.script;

                    // Update game data and UI
                    this.updateGameData();

                    // Reset group selection when changing scripts
                    this.showGroupSelection = false;

                    // Reinitialize group selector if needed
                    if (SCRIPT_OPTIONS[this.mode]?.allowGroups) {
                        this.groupSelector = new GroupSelector({
                            script: this.mode,
                            mode: this.mode,
                            onSelect: selection => this.onStart(selection)
                        });
                    } else {
                        this.groupSelector = null;
                    }

                    // Update particle system
                    this.particleManager.stop();
                    this.particleManager.start(this.mode);

                    // Force a redraw
                    requestAnimationFrame(() => this.draw(canvas.getContext('2d'), canvas));
                }
                return true;
            }
        }

        // Main button
        if (this.mainButtonBounds && this.isPointInRect(point, this.mainButtonBounds)) {
            let groups = [];
            if (SCRIPT_OPTIONS[this.mode]?.allowGroups && this.groupSelector) {
                groups = this.groupSelector.getSelectedGroups();
                if (groups.length === 0) {
                    groups = Object.keys(CHARACTER_GROUPS[this.mode]);
                }
            }

            this.onStart({
                script: this.mode,
                groups: groups
            });
            return true;
        }

        // Customize link
        if (this.mode !== 'mixed' &&
            this.customizeLinkBounds &&
            this.isPointInRect(point, this.customizeLinkBounds)) {
            this.showGroupSelection = true;
            if (!this.groupSelector) {
                this.groupSelector = new GroupSelector({
                    script: this.mode,
                    mode: this.mode,
                    onSelect: selection => this.onStart(selection)
                });
            }
            // Force a redraw to show group selection
            requestAnimationFrame(() => this.draw(canvas.getContext('2d'), canvas));
            return true;
        }

        // Home link
        if (this.homeLinkBounds && this.isPointInRect(point, this.homeLinkBounds)) {
            window.location.href = 'https://wizling.com';
            return true;
        }

        return false;
    }

    handleMouseMove(x, y, canvas) {
        const point = { x, y };
        const isOverButton = this.mainButtonBounds && this.isPointInRect(point, this.mainButtonBounds);
        const isOverHomeLink = this.homeLinkBounds && this.isPointInRect(point, this.homeLinkBounds);
        const isOverCustomize = this.customizeLinkBounds && this.isPointInRect(point, this.customizeLinkBounds);

        canvas.style.cursor = (isOverButton || isOverHomeLink || isOverCustomize) ? 'pointer' : 'default';
        return isOverButton || isOverHomeLink || isOverCustomize;
    }

    isPointInRect(point, rect) {
        return point.x >= rect.x && point.x <= rect.x + rect.width &&
            point.y >= rect.y && point.y <= rect.y + rect.height;
    }

    destroy() {
        this.particleManager.stop();
        // Add any other cleanup needed
    }
}