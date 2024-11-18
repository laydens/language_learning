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

        this.updateGameData();
        this.scriptButtons = [];

        // Initialize managers/UI
        this.particleManager = new StartParticleManager();
        this.startScreenUI = new StartScreenUI(this.layout, this.gameTitle);

        // Initialize group selector if needed
        if (SCRIPT_OPTIONS[this.mode]?.allowGroups) {
            this.initializeGroupSelector();
        }

        this.particleManager.start(this.mode);
        console.log('StartScreenManager after assign, this.onStart:', this.onStart);
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
        // Delegate to appropriate click handler based on current screen
        if (this.showGroupSelection) {
            return this.handleGroupSelectionScreenClick(x, y, canvas);
        } else {
            return this.handleMainScreenClick(x, y, canvas);
        }
    }

    handleMainScreenClick(x, y, canvas) {
        const point = { x, y };

        // Check script selector buttons
        const scriptButtonClick = this.handleScriptButtonClick(point, canvas);  // Pass canvas to the handler
        if (scriptButtonClick) return true;

        // Check main button
        if (this.mainButtonBounds && this.isPointInRect(point, this.mainButtonBounds)) {
            return this.handleStartGameClick();
        }

        // Check customize link
        if (this.canShowCustomize() &&
            this.customizeLinkBounds &&
            this.isPointInRect(point, this.customizeLinkBounds)) {
            return this.handleCustomizeClick(canvas);
        }

        // Check home link
        if (this.homeLinkBounds && this.isPointInRect(point, this.homeLinkBounds)) {
            window.location.href = '/';
            return true;
        }

        return false;
    }

    handleGroupSelectionScreenClick(x, y, canvas) {
        if (!this.groupSelector) return false;
        const handled = this.groupSelector.handleClick(x, y, canvas);
        // If the click was handled and we need to redraw
        if (handled) {
            this.requestRedraw(canvas);
        }
        return handled;
    }

    handleScriptButtonClick(point, canvas) {
        for (const button of this.scriptButtons) {
            if (this.isPointInRect(point, button.bounds)) {
                if (this.mode !== button.script) {
                    this.switchMode(button.script);
                    this.requestRedraw(canvas);  // Ensure we redraw after mode switch
                }
                return true;
            }
        }
        return false;
    }

    handleStartGameClick() {
        let groups = [];
        if (SCRIPT_OPTIONS[this.mode]?.allowGroups && this.groupSelector) {
            groups = this.groupSelector.getSelectedGroups();
            console.log('StartScreenManager.handleStartGameClick - got groups:', groups);
            if (groups.length === 0) {
                groups = Object.keys(CHARACTER_GROUPS[this.mode]);
                console.log('StartScreenManager.handleStartGameClick - using all groups:', groups);
            }
        }
        console.log('StartScreenManager.handleStartGameClick - final groups:', groups);
        this.onStart({
            script: this.mode,
            groups: groups
        });
        return true;
    }

    handleCustomizeClick(canvas) {
        this.showGroupSelection = true;
        this.initializeGroupSelector();
        this.requestRedraw(canvas);
        return true;
    }

    switchMode(newMode) {
        this.mode = newMode;
        this.updateGameData();
        this.showGroupSelection = false;

        if (SCRIPT_OPTIONS[this.mode]?.allowGroups) {
            this.initializeGroupSelector();
        } else {
            this.groupSelector = null;
        }

        // Update particle system
        this.particleManager.stop();
        this.particleManager.start(this.mode);
    }


    initializeGroupSelector() {
        this.groupSelector = new GroupSelector({
            script: this.mode,
            mode: this.mode,
            onSelect: (selection) => {
                console.log('GroupSelector onSelect called with selection:', selection);
                this.showGroupSelection = false;
                // Make sure we're passing both script and groups correctly
                this.onStart({
                    script: selection.script, // Use the script from selection
                    groups: selection.groups  // Use the groups from selection
                });
                if (this.canvas) {
                    this.requestRedraw(this.canvas);
                }
            }
        });
    }

    canShowCustomize() {
        return this.mode !== 'mixed' && SCRIPT_OPTIONS[this.mode]?.allowGroups;
    }

    requestRedraw(canvas) {
        this.canvas = canvas; // Store canvas reference for mode switches
        requestAnimationFrame(() => this.draw(canvas.getContext('2d'), canvas));
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