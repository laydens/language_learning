// gameScreens.js
import { CHARACTER_GROUPS } from './GameDataProvider.js';
import Theme from './Theme.js';
import { GroupLayout } from './GroupLayout.js';
export class GroupSelector {
    constructor(config) {
        this.colors = Theme.colors;
        this.fonts = Theme.fonts;
        this.onStart = config.onSelect;
        this.mode = config.mode;
        this.selectedGroups = new Set();
        this.currentScript = config.mode === 'katakana' ? 'katakana' : 'hiragana';
        this.layout = new GroupLayout(Theme);

        console.log("GroupSelector - set currentScript to:", this.currentScript);
        console.log("currentScript set to: ", this.currentScript);

        console.log("config.mode in GroupSelector: ", this.mode);

        // Group descriptions for cleaner code
        this.groupRelations = {
            k: ['g'],    // K group has G variant
            s: ['z'],    // S group has Z variant
            t: ['d'],    // T group has D variant
            h: ['b', 'p']  // H group has B and P variants
        };

        this.groupDescriptions = {
            vowels: 'v',
            k: 'K',
            s: 'S',
            t: 'T',
            n: 'N',
            h: 'H',
            m: 'M',
            y: 'Y',
            r: 'R',
            w: 'W',
            g: 'G',
            z: 'Z',
            d: 'D',
            b: 'B',
            p: 'P'
        };
    }

    // In GroupSelector
    draw(ctx, canvas) {
        // Clear canvas
        ctx.fillStyle = Theme.colors.background.primary;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        this.drawTitle(ctx, canvas);
        this.drawScriptTabs(ctx, canvas);
        this.drawGroupSelection(ctx, canvas);
        this.drawStartButton(ctx, canvas);
        this.drawHomeButton(ctx, canvas);

    }

    drawHomeButton(ctx, canvas) {
        const padding = 15;
        const width = 130;
        const height = 36;
        const x = canvas.width - width - padding;
        const y = padding;

        ctx.save();
        ctx.fillStyle = this.colors.surface.white;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.roundRect(x, y, width, height, height / 2);
        ctx.fill();

        ctx.font = `500 14px ${this.fonts.system.display}`;
        ctx.fillStyle = this.colors.text.secondary;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Wizling Home', x + width / 2, y + height / 2);
        ctx.restore();
    }

    drawGroupLabel(ctx, position, key, chars) {
        ctx.save();

        // Group label (smaller, grey)
        ctx.font = `400 ${this.layout.groups.fontSize.group}px ${this.fonts.system.display}`;
        ctx.fillStyle = this.colors.text.secondary;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(
            `${this.groupDescriptions[key].split(':')[0]}`,  // Remove colon
            position.label.x,
            position.label.y
        );

        // Kana characters (larger, darker)
        ctx.font = `500 ${this.layout.groups.fontSize.kana}px ${this.fonts.japanese.primary}`;
        ctx.fillStyle = this.colors.text.primary;
        ctx.fillText(
            Object.keys(chars).join(' '),
            position.kana.x,
            position.kana.y
        );

        ctx.restore();
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
        // Using new layout
        const { width, height, spacing, y } = this.layout.tabs;
        const totalWidth = (width * 2) + spacing;
        const startX = (canvas.width - totalWidth) / 2;

        ['hiragana', 'katakana'].forEach((script, index) => {
            const x = startX + (width + spacing) * index;
            const isSelected = this.currentScript === script;

            ctx.save();
            ctx.beginPath();
            ctx.roundRect(x, y, width, height, 8);
            ctx.fillStyle = isSelected ? Theme.colors.primary.medium : Theme.colors.primary.pale;
            ctx.fill();

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
        const {
            startY,
            rowHeight,
            cols,
            colWidth,
            leftPadding,
            colSpacing
        } = this.layout.groups;

        let currentY = startY;
        let colHeights = new Array(cols).fill(startY);

        // Get base groups
        const baseGroups = Object.keys(CHARACTER_GROUPS[this.currentScript])
            .filter(key => !Object.values(this.groupRelations).flat().includes(key));

        baseGroups.forEach((baseKey, index) => {
            const col = index % cols;
            const x = leftPadding + (col * (colWidth + colSpacing));
            const baseChars = CHARACTER_GROUPS[this.currentScript][baseKey];

            // Get variants correctly
            const variants = this.groupRelations[baseKey] || [];

            // Pass all needed arguments
            this.drawGroupWithVariants(ctx, x, colHeights[col], baseKey, baseChars, variants);

            // Update column height
            const totalHeight = rowHeight * (1 + variants.length);
            colHeights[col] += totalHeight;
        });
    }

    drawGroupWithVariants(ctx, x, y, baseKey, baseChars, variants) {
        const { rowHeight, colWidth, radius } = this.layout.groups;
        const totalHeight = rowHeight * (1 + variants.length);

        // Draw the container
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(x, y, colWidth, totalHeight, radius);

        const isSelected = this.selectedGroups.has(`${this.currentScript}-${baseKey}`);

        if (isSelected) {
            ctx.fillStyle = this.colors.primary.medium;
        } else {
            ctx.fillStyle = this.colors.surface.white;
            ctx.strokeStyle = this.colors.surface.pale;
            ctx.lineWidth = 1;
        }

        ctx.fill();
        if (!isSelected) ctx.stroke();

        // Draw base group
        this.drawGroupRow(ctx, x, y, baseKey, baseChars, isSelected);

        // Draw variants
        variants.forEach((variantKey, index) => {
            const variantChars = CHARACTER_GROUPS[this.currentScript][variantKey];
            this.drawGroupRow(ctx, x, y + rowHeight * (index + 1), variantKey, variantChars, isSelected);
        });

        ctx.restore();
    }

    drawGroupRow(ctx, x, y, key, chars, isSelected) {
        const { rowHeight, colWidth } = this.layout.groups;

        ctx.save();

        // Label format: "K:"
        ctx.font = `500 15px ${this.fonts.system.display}`;
        ctx.fillStyle = isSelected ? this.colors.text.white : this.colors.text.primary;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        const label = `${this.groupDescriptions[key]}:`;
        ctx.fillText(label, x + 20, y + rowHeight / 2);

        // Kana characters
        const kanaText = Object.keys(chars).join(' ');
        ctx.font = `500 18px ${this.fonts.japanese.primary}`;
        ctx.textAlign = 'left';  // Changed to left align
        const labelWidth = ctx.measureText(label).width;
        ctx.fillText(kanaText, x + labelWidth + 30, y + rowHeight / 2);

        ctx.restore();
    }


    drawGroupButton(ctx, x, y, key, chars) {
        const { rowHeight, colWidth, radius } = this.layout.groups;
        const isSelected = this.selectedGroups.has(`${this.currentScript}-${key}`);

        // Draw button background
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(x, y, colWidth, rowHeight, radius);

        if (isSelected) {
            ctx.fillStyle = this.colors.primary.medium;
        } else {
            ctx.fillStyle = this.colors.surface.white;
            ctx.strokeStyle = this.colors.surface.pale;
            ctx.lineWidth = 1;
        }

        ctx.fill();
        if (!isSelected) ctx.stroke();

        // Draw label
        ctx.font = `500 15px ${this.fonts.system.display}`;
        ctx.fillStyle = isSelected ? this.colors.text.white : this.colors.text.primary;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(
            key.toUpperCase(),
            x + 20,
            y + rowHeight / 2
        );

        // Draw kana
        const kanaText = Object.keys(chars).join(' ');
        ctx.font = `500 18px ${this.fonts.japanese.primary}`;
        ctx.textAlign = 'center';
        ctx.fillText(
            kanaText,
            x + (colWidth / 2) + 20,  // Offset center for label
            y + rowHeight / 2
        );

        ctx.restore();
    }

    getVariantKey(key) {
        const variantMap = {
            k: 'g',
            s: 'z',
            t: 'd',
            h: 'b'  // Note: H is special as it has both B and P variants
        };
        return variantMap[key];
    }

    // In GroupSelector.js, update getButtonLayout and drawStartButton

    getButtonLayout(canvas) {
        const numGroups = Object.keys(CHARACTER_GROUPS[this.currentScript]).length;
        const numRows = Math.ceil(numGroups / this.layout.groups.cols);
        const groupsBottom = this.layout.groups.startY +
            (numRows * this.layout.groups.spacing);

        return {
            x: (canvas.width - this.layout.button.width) / 2,
            y: groupsBottom + this.layout.button.spacing,
            width: this.layout.button.width,
            height: this.layout.button.height,
            isEnabled: this.selectedGroups.size > 0
        };
    }

    drawStartButton(ctx, canvas) {
        const { width, height, spacing, bottomMargin } = this.layout.button;
        const x = (canvas.width - width) / 2;
        const y = canvas.height - height - bottomMargin;  // Position from bottom

        ctx.save();

        ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 2;

        ctx.beginPath();
        ctx.roundRect(x, y, width, height, height / 2);
        ctx.fillStyle = this.selectedGroups.size > 0 ?
            this.colors.secondary.medium :
            this.colors.secondary.tint;
        ctx.fill();

        ctx.font = `600 20px ${this.fonts.system.display}`;
        ctx.fillStyle = this.selectedGroups.size > 0 ?
            this.colors.text.white :
            this.colors.secondary.light;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
            this.selectedGroups.size > 0 ? 'Start Game' : 'Select Groups',
            x + width / 2,
            y + height / 2
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
        return (
            this.handleTabClick(x, y, canvas) ||
            this.handleGroupClick(x, y, canvas) ||
            this.handleStartClick(x, y, canvas) ||
            this.handleHomeClick(x, y, canvas)
        );
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

    handleHomeClick(x, y, canvas) {
        // Only handle if we're on a larger screen
        if (window.innerWidth <= Theme.breakpoints.mobile) {
            return false;
        }

        const padding = 15;
        const width = 130;
        const height = 36;
        const buttonX = canvas.width - width - padding;
        const buttonY = padding;

        if (x >= buttonX && x <= buttonX + width &&
            y >= buttonY && y <= buttonY + height) {
            window.location.href = '/';
            return true;
        }
        return false;
    }

    handleGroupClick(x, y, canvas) {
        const {
            startY,
            rowHeight,
            cols,
            colWidth,
            leftPadding,
            colSpacing
        } = this.layout.groups;

        // Get base groups
        const baseGroups = Object.keys(CHARACTER_GROUPS[this.currentScript])
            .filter(key => !Object.values(this.groupRelations).flat().includes(key));

        let colHeights = new Array(cols).fill(startY);

        for (let i = 0; i < baseGroups.length; i++) {
            const col = i % cols;
            const baseKey = baseGroups[i];
            const buttonX = leftPadding + (col * (colWidth + colSpacing));
            const buttonY = colHeights[col];
            const variants = this.groupRelations[baseKey] || [];
            const totalHeight = rowHeight * (1 + variants.length);

            // Check if click is within this button group
            if (x >= buttonX && x <= buttonX + colWidth &&
                y >= buttonY && y <= buttonY + totalHeight) {

                // Toggle the base group
                const groupKey = `${this.currentScript}-${baseKey}`;
                if (this.selectedGroups.has(groupKey)) {
                    this.selectedGroups.delete(groupKey);
                } else {
                    this.selectedGroups.add(groupKey);
                }

                this.draw(canvas.getContext('2d'), canvas);
                return true;
            }

            // Update column height for next group in this column
            colHeights[col] += totalHeight;
        }
        return false;
    }

    hitTest(x, y, rectX, rectY, width, height) {
        return x >= rectX && x <= rectX + width &&
            y >= rectY && y <= rectY + height;
    }

    toggleGroup(key) {
        const groupKey = `${this.currentScript}-${key}`;
        if (this.selectedGroups.has(groupKey)) {
            this.selectedGroups.delete(groupKey);
        } else {
            this.selectedGroups.add(groupKey);
        }
    }

    getSelectedGroups() {
        const groups = Array.from(this.selectedGroups)
            .map(groupKey => groupKey.split('-')[1]);
        console.log('GroupSelector.getSelectedGroups - selectedGroups Set:', this.selectedGroups);
        console.log('GroupSelector.getSelectedGroups - returning:', groups);
        return groups;
    }

    handleStartClick(x, y, canvas) {
        // Get start button position
        const { width, height, bottomMargin } = this.layout.button;
        const buttonX = (canvas.width - width) / 2;
        const buttonY = canvas.height - height - bottomMargin;

        // Check if click is within button bounds
        if (this.selectedGroups.size > 0 &&
            x >= buttonX && x <= buttonX + width &&
            y >= buttonY && y <= buttonY + height) {

            // Get selected groups and send to callback
            const groups = Array.from(this.selectedGroups)
                .map(groupKey => groupKey.split('-')[1]);

            const selection = {
                script: this.currentScript,
                groups: groups
            };

            this.onStart(selection);
            return true;
        }
        return false;
    }
}