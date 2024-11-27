// GroupLayout.js
export class GroupLayout {
    constructor(theme) {
        this.theme = theme;
        this.deviceType = this.getDeviceType(window.innerWidth);

        // Make these accessible as properties
        this.tabs = {
            width: this.getResponsiveWidth(180),
            height: 48,
            spacing: 12,
            y: 100,
            margin: 20  // Add margin around tabs
        };

        this.groups = {
            startY: 160,
            spacing: 0,         // No vertical gaps
            rowHeight: 48,
            cols: this.getColumnCount(),
            colWidth: this.getResponsiveColWidth(),
            leftPadding: 20,
            colSpacing: 16,
            radius: 16,
            buttonPadding: 20
        };

        this.button = {
            width: 220,
            height: 56,
            spacing: 32,       // Space between groups and button
            bottomMargin: 150   // Space between button and bottom of screen
        };

        this.title = {
            y: 70,
            fontSize: this.getResponsiveFontSize(32)
        };
        window.addEventListener('resize', () => this.handleResize());

    }

    getDeviceType(width) {
        if (width < this.theme.breakpoints.mobile) return 'mobile';
        if (width < this.theme.breakpoints.tablet) return 'tablet';
        return 'desktop';
    }

    getResponsiveWidth(baseWidth) {
        const width = window.innerWidth;
        if (width < this.theme.breakpoints.mobile) {
            return Math.min(baseWidth, width * 0.9);
        }
        return baseWidth;
    }

    getResponsiveSpacing(baseSpacing) {
        return Math.floor(baseSpacing * this.theme.scale[this.deviceType].spacing);
    }

    getResponsiveFontSize(baseSize) {
        return Math.floor(baseSize * this.theme.scale[this.deviceType].button);
    }

    getColumnCount() {
        const width = window.innerWidth;
        if (width < 340) return 1;
        return 2;
    }

    getResponsiveColWidth() {
        const width = window.innerWidth;
        const padding = this.getResponsiveSpacing(40);
        const cols = this.getColumnCount();
        const gutter = this.getResponsiveSpacing(16);

        return Math.floor((width - (padding * 2) - ((cols - 1) * gutter)) / cols);
    }

    handleResize() {
        const newDeviceType = this.getDeviceType(window.innerWidth);
        if (newDeviceType !== this.deviceType) {
            this.deviceType = newDeviceType;
            this.updateLayout();
        } else {
            // Just update width-dependent values
            this.updateWidths();
        }
    }

    updateLayout() {
        // Update all responsive values
        this.tabs.width = this.getResponsiveWidth(180);
        this.groups.spacing = this.getResponsiveSpacing(40);
        this.groups.cols = this.getColumnCount();
        this.groups.colWidth = this.getResponsiveColWidth();
        this.groups.leftPadding = this.getResponsiveSpacing(40);
        this.button.width = this.getResponsiveWidth(220);
        this.title.fontSize = this.getResponsiveFontSize(36);
    }

    updateWidths() {
        // Update only width-dependent values
        this.tabs.width = this.getResponsiveWidth(180);
        this.groups.cols = this.getColumnCount();
        this.groups.colWidth = this.getResponsiveColWidth();
        this.button.width = this.getResponsiveWidth(220);
    }

    getGroupTextLayout(baseX, baseY) {
        return {
            label: {
                x: baseX + this.groups.checkboxSize + 16,
                y: baseY + (this.groups.checkboxSize / 2)
            },
            kana: {
                x: baseX + this.groups.checkboxSize + 16 + 100, // After label
                y: baseY + (this.groups.checkboxSize / 2)
            }
        };
    }
}