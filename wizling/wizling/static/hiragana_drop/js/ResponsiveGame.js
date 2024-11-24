// ResponsiveGame.js
export default class ResponsiveGame {
    constructor(canvas, game) {
        this.canvas = canvas;
        this.game = game;
        this.ctx = canvas.getContext('2d');

        // Initial setup
        this.setupViewport();
        this.setupEventListeners();
        this.handleResize();
    }

    setupViewport() {
        // Add viewport meta tag if it doesn't exist
        if (!document.querySelector('meta[name="viewport"]')) {
            const viewport = document.createElement('meta');
            viewport.name = 'viewport';
            viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
            document.head.appendChild(viewport);
        }

        // Prevent scrolling/bouncing on iOS
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.height = '100%';

        // Prevent default touch behaviors
        document.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
        document.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
    }

    setupEventListeners() {
        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.handleResize(), 100);
        });

        // Convert touch events to mouse events for the game
        this.canvas.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.canvas.dispatchEvent(mouseEvent);
        });

        this.canvas.addEventListener('touchend', (e) => {
            const mouseEvent = new MouseEvent('mouseup', {});
            this.canvas.dispatchEvent(mouseEvent);
        });
    }

    handleResize() {
        // Get actual viewport dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Set the canvas dimensions to match viewport
        this.canvas.width = viewportWidth;
        this.canvas.height = viewportHeight;

        // Match the CSS dimensions
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';

        // Position canvas
        this.canvas.style.position = 'fixed';
        this.canvas.style.left = '0';
        this.canvas.style.top = '0';

        // No transform needed since we're using 0,0 positioning
        this.canvas.style.transform = 'none';

        // Update any game properties that depend on canvas size
        if (this.game?.handleResize) {
            this.game.handleResize(viewportWidth, viewportHeight);
        }
    }

    // Update scale factors to handle touch/mouse inputs correctly
    getScaleFactors() {
        return {
            x: 1, // Since we're using actual viewport size, scale is 1:1
            y: 1
        };
    }


    // Convert page coordinates to canvas coordinates
    convertToCanvasCoords(pageX, pageY) {
        const bounds = this.canvas.getBoundingClientRect();
        return {
            x: (pageX - bounds.left) * (this.canvas.width / bounds.width),
            y: (pageY - bounds.top) * (this.canvas.height / bounds.height)
        };
    }
}