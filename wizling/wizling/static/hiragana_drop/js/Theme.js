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
            },
            effects: {
                success: 'rgba(82, 120, 135, 0.2)',  // Medium Fjord with transparency (primary-500)
                mistake: 'rgba(139, 58, 21, 0.15)'   // Deep Maple with transparency (secondary-900)
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
            light: '#666C70'     // Medium Gray - Supporting text (surface-500)
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
                large: '48px',
                medium: '36px',
                small: '24px'
            },
            ui: {
                title: '24px',
                large: '20px',
                normal: '16px',
                small: '14px'
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
            count: 25,
            size: {
                min: 2,
                max: 7
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
            transitions: {
                fast: '150ms',
                normal: '300ms',
                slow: '500ms'
            }
        }
    }
};

export default Theme;