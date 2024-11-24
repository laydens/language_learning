// Theme.js
const Theme = {
    colors: {
        background: {
            primary: '#F0F4F5',    // White Mist - Main background (surface-100)
            secondary: '#FDF5EF',     // Warm Tint - Tinted backgrounds (secondary-50)
            gradient: {
                start: '#F0F4F5',  // White Mist - Gradient start (surface-100)
                middle: '#D0DDE2', // Fjord Mist - Gradient middle (primary-100)
                end: '#7397A5'     // Soft Fjord - Gradient end (primary-300)
            }
        },
        primary: {
            main: '#162429',    // Deep Fjord - Main brand color (primary-900)
            dark: '#324D5C',    // Rich Fjord - Primary elements (primary-700)
            medium: '#527887',  // Medium Fjord - Secondary elements (primary-500)
            light: '#7397A5',   // Soft Fjord - Supporting elements (primary-300)
            pale: '#D0DDE2',     // Fjord Mist - Subtle backgrounds (primary-100)
            tint: '#F0F4F5'     // White Mist - Tinted backgrounds (surface-100)
        },
        secondary: {
            main: '#8B3A15',    // Deep Maple - Critical actions (secondary-900)
            dark: '#C55A21',    // Rich Maple - Primary actions (secondary-700)
            medium: '#F26419',  // Maple - Interactive elements (secondary-500)
            light: '#EDA06D',   // Soft Maple - Success states (secondary-300)
            pale: '#FBEADE',    // Maple Mist - Subtle accents (secondary-100)
            tint: '#FDF5EF'     // Warm Tint - Tinted backgrounds (secondary-50)
        },
        surface: {
            dark: '#1A1C1D',    // Ink - Darkest text (surface-900)
            medium: '#3D4144',  // Dark Gray - Secondary text (surface-700)
            light: '#666C70',   // Medium Gray - Supporting text (surface-500)
            pale: '#CFD3D6',    // Pale Gray - Borders (surface-300)
            white: '#F0F4F5',    // White Mist - Main background (surface-100)
            truewhite: '#FFFFFF' // White - Pure white
        },
        text: {
            primary: '#1A1C1D',   // Ink - Main text (surface-900)
            secondary: '#3D4144', // Dark Gray - Secondary text (surface-700)
            light: '#666C70',    // Medium Gray - Supporting text (surface-500)
            white: '#FFFFFF'    // White - Pure white
        },
        success: {
            primary: '#EDA06D',    // Soft Maple - Success primary (secondary-300)
            secondary: '#FBEADE',  // Maple Mist - Success emphasis (secondary-100)
            glow: '#FDF5EF'       //  Warm Tint - Tinted backgrounds (secondary-50)
        },
        mistake: {
            primary: '#C55A21',    // Rich Maple - Mistake primary (secondary-700)
            secondary: '#8B3A15',  // Deep Maple - Mistake secondary (secondary-900)
            glow: '#E36922'       // Maple - Mistake emphasis (secondary-500)
        },
        progress: {
            active: {
                outer: 'rgba(242, 100, 25, 0.5)',  // Deep Maple with transparency (secondary-900)
                inner: '#F26419',  // Maple - Interactive elements (secondary-500)
                glow: '#D0DDE2'                   // Rich Maple - Progress emphasis (secondary-700)
            },
            inactive: {
                outer: 'rgba(207, 211, 214, 0.2)', // Pale Gray with transparency (surface-300)
                inner: '#CFD3D6'                   // Pale Gray - Inactive state (surface-300)
            }
        },

    },
    breakpoints: {
        mobile: 480,
        tablet: 768,
        desktop: 1024
    },
    scale: {
        mobile: {
            character: 0.04,  // Smaller characters on mobile
            button: 0.8,     // Slightly smaller buttons
            spacing: 0.7     // Tighter spacing
        },
        tablet: {
            character: 0.05,
            button: 0.9,
            spacing: 0.85
        },
        desktop: {
            character: 0.06,  // Original size
            button: 1,
            spacing: 1
        }
    },
    fonts: {
        japanese: {
            primary: "'Noto Sans JP', sans-serif",
            alternate: "'M PLUS Rounded 1c', sans-serif",
            classic: "'Kosugi Maru', sans-serif"
        },
        system: {
            primary: "'Nunito', -apple-system, sans-serif",
            display: "'Poppins', sans-serif"
        },
        sizes: {
            character: {
                large: 'clamp(32px, 6vw, 48px)',
                medium: 'clamp(24px, 4.5vw, 36px)',
                small: 'clamp(18px, 3vw, 24px)'
            },
            ui: {
                title: 'clamp(20px, 4vw, 24px)',
                large: 'clamp(16px, 3vw, 20px)',
                normal: 'clamp(14px, 2.5vw, 16px)',
                small: 'clamp(12px, 2vw, 14px)'
            }
        },
        weights: {
            normal: 400,
            medium: 500,
            bold: 600
        }
    },

    game: {
        particles: {
            count: {
                mobile: 15,    // Fewer particles on mobile
                tablet: 20,
                desktop: 25
            },
            size: {
                min: 2,
                max: {
                    mobile: 5,
                    tablet: 6,
                    desktop: 7
                }
            },
            velocity: {
                initial: 9,
                gravity: 0.2
            },
            lifetime: {
                fadeSpeed: 0.02
            },
            glow: {
                blur: 10
            }
        },
        effects: {
            duration: 500,
            progressGlow: {
                radius: 10,
                blur: 10
            }
        },
        characters: {
            size: '0.06em',  // Relative to canvas width
            targetGlow: 15,
            drift: {
                amplitude: 15,
                speed: 0.001
            }
        },
        ui: {
            header: {
                height: {
                    mobile: 40,
                    tablet: 46,
                    desktop: 52
                },
                padding: {
                    mobile: 8,
                    tablet: 12,
                    desktop: 16
                }
            },
            buttons: {
                minWidth: {
                    mobile: 160,
                    tablet: 200,
                    desktop: 220
                },
                height: {
                    mobile: 44,
                    tablet: 50,
                    desktop: 56
                }
            },
            spacing: {
                small: 'clamp(8px, 1.5vw, 12px)',
                medium: 'clamp(16px, 2.5vw, 24px)',
                large: 'clamp(24px, 4vw, 40px)'
            }
        }

    },

    // Add helper function to get device type
    getDeviceType(width) {
        if (width < this.breakpoints.mobile) return 'mobile';
        if (width < this.breakpoints.tablet) return 'tablet';
        return 'desktop';
    },

    // Add helper function to get scaled value
    getScaledValue(baseValue, property) {
        const width = window.innerWidth;
        const deviceType = this.getDeviceType(width);
        return baseValue * this.scale[deviceType][property];
    },

    // Add helper for responsive font size
    getResponsiveFontSize(baseSize) {
        const width = window.innerWidth;
        if (width < this.breakpoints.mobile) return `${baseSize * 0.8}px`;
        if (width < this.breakpoints.tablet) return `${baseSize * 0.9}px`;
        return `${baseSize}px`;
    },
    // Convert Hex (#RRGGBB) to RGBA with specified opacity
    hexToRgba(hex, opacity) {
        // Remove leading '#' if present
        const cleanHex = hex.replace('#', '');

        // Parse RGB components
        const r = parseInt(cleanHex.substring(0, 2), 16);
        const g = parseInt(cleanHex.substring(2, 4), 16);
        const b = parseInt(cleanHex.substring(4, 6), 16);

        // Return rgba string
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

};

Theme.colors.success = {
    primary: Theme.colors.secondary.light,
    secondary: Theme.colors.secondary.pale,
    glow: Theme.colors.secondary.tint,
};

export default Theme;