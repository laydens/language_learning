// gameScreens.js
import { CHARACTER_GROUPS } from './GameDataProvider.js';
import Theme from './Theme.js';
export class GroupSelector {
    constructor(config) {
        this.colors = Theme.colors;
        this.fonts = Theme.fonts;
        this.onStart = config.onStart;
        this.mode = config.mode;
        this.selectedGroups = new Set();
        this.currentScript = config.mode === 'katakana' ? 'katakana' : 'hiragana';
        console.log("GroupSelector - set currentScript to:", this.currentScript);
        console.log("currentScript set to: ", this.currentScript);

        this.layout = {
            title: {
                y: 40,
                fontSize: 36
            },
            tabs: {
                width: 180,
                height: 45,
                spacing: 10,
                y: 70
            },
            groups: {
                startY: 140,
                spacing: 40,
                cols: 2,
                checkboxSize: 22,
                colWidth: 380,
                leftPadding: 40,
                fontSize: 15
            },
            button: {
                width: 220,
                height: 56,
                spacing: 40,  // Space between groups and button
            }
        };

        console.log("config.mode in GroupSelector: ", this.mode);

        // Group descriptions for cleaner code
        this.groupDescriptions = {
            vowels: 'Vowels',
            k: 'K-Group',
            s: 'S-Group',
            t: 'T-Group',
            n: 'N-Group',
            h: 'H-Group',
            m: 'M-Group',
            y: 'Y-Group',
            r: 'R-Group',
            w: 'W-Group',
            g: 'G-Group (voiced K)',
            z: 'Z-Group (voiced S)',
            d: 'D-Group (voiced T)',
            b: 'B-Group (voiced H)',
            p: 'P-Group (semi-voiced H)'
        };
    }

    draw(ctx, canvas) {
        // Clear canvas
        ctx.fillStyle = Theme.colors.background.primary;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw title
        this.drawTitle(ctx, canvas);
        this.drawScriptTabs(ctx, canvas);
        this.drawGroupSelection(ctx, canvas);
        this.drawStartButton(ctx, canvas);
    }

    drawTitle(ctx, canvas) {
        ctx.save();
        // Title
        ctx.font = `bold ${this.layout.title.fontSize}px ${Theme.fonts.system.display}`;
        ctx.fillStyle = '#2C3E50';
        ctx.textAlign = 'center';
        ctx.fillText('Kana Drop', canvas.width / 2, this.layout.title.y);
        ctx.restore();
    }

    drawScriptTabs(ctx, canvas) {
        const { width, height, spacing, y } = this.layout.tabs;
        const totalWidth = (width * 2) + spacing;
        const startX = (canvas.width - totalWidth) / 2;
        ['hiragana', 'katakana'].forEach((script, index) => {
            const x = startX + (width + spacing) * index;
            const isSelected = this.currentScript === script;

            // Draw tab
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(x, y, width, height, 8);
            ctx.fillStyle = isSelected ? Theme.colors.primary.medium : Theme.colors.primary.pale;
            ctx.fill();

            // Draw text
            ctx.font = `bold 18px ${Theme.fonts.system.display}`;
            ctx.fillStyle = isSelected ? Theme.colors.primary.tint : Theme.colors.primary.light;
            ctx.textAlign = 'center';
            ctx.fillText(
                script.charAt(0).toUpperCase() + script.slice(1),
                x + width / 2,
                y + height / 2 + 6
            );
            ctx.restore();
        });
    }

    drawGroupSelection(ctx, canvas) {
        const { startY, spacing, cols, checkboxSize, colWidth, leftPadding } = this.layout.groups;
        const startX = leftPadding;

        Object.entries(CHARACTER_GROUPS[this.currentScript]).forEach(([key, chars], index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            const x = startX + (col * colWidth);
            const y = startY + (row * spacing);
            const isSelected = this.selectedGroups.has(`${this.currentScript}-${key}`);

            // Draw checkbox
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(x, y, checkboxSize, checkboxSize, 6);
            ctx.fillStyle = isSelected ? Theme.colors.primary.medium : Theme.colors.surface.white;
            ctx.strokeStyle = isSelected ? this.colors.primary.dark : Theme.colors.surface.pale;
            ctx.fill();
            ctx.stroke();

            if (isSelected) {
                ctx.beginPath();
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 2;
                ctx.moveTo(x + 6, y + 11);
                ctx.lineTo(x + 10, y + 15);
                ctx.lineTo(x + 16, y + 7);
                ctx.stroke();
            }

            // Group label with kana
            ctx.font = `500 16px ${Theme.fonts.japanese.primary}`;
            ctx.fillStyle = '#334155';
            ctx.textAlign = 'left';
            ctx.fillText(`${this.groupDescriptions[key]}: ${Object.keys(chars).join(' ')}`,
                x + checkboxSize + 12,
                y + 16);

            ctx.restore();
        });
    }

    getButtonLayout(canvas) {
        const numGroups = Object.keys(CHARACTER_GROUPS[this.currentScript]).length;
        const numRows = Math.ceil(numGroups / this.layout.groups.cols);
        const groupsBottom = this.layout.groups.startY + (numRows * this.layout.groups.spacing);

        return {
            x: (canvas.width - this.layout.button.width) / 2,
            y: groupsBottom + this.layout.button.spacing,
            width: this.layout.button.width,
            height: this.layout.button.height,
            isEnabled: this.selectedGroups.size > 0
        };
    }

    drawStartButton(ctx, canvas) {
        const buttonLayout = this.getButtonLayout(canvas);

        ctx.save();
        if (buttonLayout.isEnabled) {
            ctx.shadowColor = 'rgba(74, 144, 226, 0.3)';
            ctx.shadowBlur = 10;
            ctx.shadowOffsetY = 4;
        }

        // Button background
        ctx.beginPath();
        ctx.roundRect(
            buttonLayout.x,
            buttonLayout.y,
            buttonLayout.width,
            buttonLayout.height,
            12
        );
        ctx.fillStyle = buttonLayout.isEnabled ? this.colors.secondary.medium : Theme.colors.secondary.pale;
        ctx.fill();

        // Button text
        ctx.font = `bold 20px ${Theme.fonts.japanese.primary}`;
        ctx.fillStyle = buttonLayout.isEnabled ? Theme.colors.text.white : Theme.colors.secondary.light;
        ctx.textAlign = 'center';
        ctx.fillText(
            buttonLayout.isEnabled ? 'Start Game' : 'Select Groups',
            canvas.width / 2,
            buttonLayout.y + buttonLayout.height / 2 + 6
        );
        ctx.restore();
    }

    getButtonPosition(canvas) {
        const numGroups = Object.keys(CHARACTER_GROUPS[this.currentScript]).length;
        const numRows = Math.ceil(numGroups / this.layout.groups.cols);
        const groupsBottom = this.layout.groups.startY +
            (numRows * this.layout.groups.spacing);

        // Position button 60px below the last group
        const y = groupsBottom + 60;
        const x = (canvas.width - this.layout.button.width) / 2;

        return { x, y };
    }

    handleClick(x, y, canvas) {
        // Check script tabs
        this.handleTabClick(x, y, canvas) ||
            this.handleGroupClick(x, y, canvas) ||
            this.handleStartClick(x, y, canvas);
    }

    handleTabClick(x, y, canvas) {
        const { width, height, spacing, y: tabY } = this.layout.tabs;
        const totalWidth = (width * 2) + spacing;
        const startX = (canvas.width - totalWidth) / 2;

        if (y >= tabY && y <= tabY + height) {
            if (x >= startX && x <= startX + width) {
                this.currentScript = 'hiragana';
                this.draw(canvas.getContext('2d'), canvas);
                return true;
            } else if (x >= startX + width + spacing && x <= startX + totalWidth) {
                this.currentScript = 'katakana';
                this.draw(canvas.getContext('2d'), canvas);
                return true;
            }
        }
        return false;
    }

    handleGroupClick(x, y, canvas) {
        const { startY, spacing, cols, checkboxSize, colWidth, leftPadding } = this.layout.groups;
        const startX = leftPadding;

        Object.keys(CHARACTER_GROUPS[this.currentScript]).forEach((key, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            const checkX = startX + (col * colWidth);
            const checkY = startY + (row * spacing);

            if (x >= checkX && x <= checkX + checkboxSize &&
                y >= checkY && y <= checkY + checkboxSize) {
                const groupKey = `${this.currentScript}-${key}`;
                if (this.selectedGroups.has(groupKey)) {
                    this.selectedGroups.delete(groupKey);
                } else {
                    this.selectedGroups.add(groupKey);
                }
                this.draw(canvas.getContext('2d'), canvas);
                return true;
            }
        });
        return false;
    }

    getSelectedGroups() {
        // Return array of just the group names without the script prefix
        return Array.from(this.selectedGroups)
            .map(groupKey => groupKey.split('-')[1]);
    }

    handleStartClick(x, y, canvas) {
        const buttonLayout = this.getButtonLayout(canvas);

        if (buttonLayout.isEnabled &&
            x >= buttonLayout.x &&
            x <= buttonLayout.x + buttonLayout.width &&
            y >= buttonLayout.y &&
            y <= buttonLayout.y + buttonLayout.height) {
            this.onStart({
                script: this.currentScript,
                groups: Array.from(this.selectedGroups).map(g => g.split('-')[1])
            });
            return true;
        }
        return false;
    }
}