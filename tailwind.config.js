/** @type {import('tailwindcss').Config} */
export default {
   content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00563e',
        secondary: '#8d1536',
        neutral: {
          50: '#f9f9f9',
          100: '#e0e0e0',
          600: '#525252',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        text: {
          primary: '#111827',
          secondary: '#374151',
          muted: '#6b7280',
        }
      },
      fontFamily: {
        'header': ['Montserrat', 'sans-serif'],
        'body': ['Open Sans', 'sans-serif'],
        'mono': ['Roboto Mono', 'monospace'],
      }
    },
  },
  plugins: [
    require('daisyui')
  ],
  daisyui: {
    themes: [
      {
        agrisense: {
          "primary": "#8d1536",        // Changed to secondary color (maroon)
          "primary-focus": "#7a122e",  // Darker shade for hover
          "primary-content": "#ffffff", // White text on primary
          
          "secondary": "#00563e",      // Deep green as secondary
          "secondary-focus": "#004a35", // Darker green for hover
          "secondary-content": "#ffffff", // White text on secondary
          
          "accent": "#37cdbe",         // Teal accent
          "accent-focus": "#2bb3a0",   // Darker teal for hover
          "accent-content": "#ffffff",  // White text on accent
          
          "neutral": "#3d4451",        // Dark gray
          "neutral-focus": "#2a2e37",  // Darker gray
          "neutral-content": "#ffffff", // White text on neutral
          
          "base-100": "#f9f9f9",       // Background
          "base-200": "#e5e7eb",       // Card backgrounds
          "base-300": "#d1d5db",       // Borders
          "base-content": "#111827",   // Text color
          
          "info": "#3abff8",           // Info blue
          "info-content": "#ffffff",
          
          "success": "#36d399",        // Success green
          "success-content": "#ffffff",
          
          "warning": "#fbbd23",        // Warning yellow
          "warning-content": "#000000",
          
          "error": "#f87272",          // Error red
          "error-content": "#ffffff",
          
          // Custom CSS variables for enhanced styling
          "--rounded-box": "0.5rem",          // Border radius for cards
          "--rounded-btn": "0.375rem",        // Border radius for buttons
          "--rounded-badge": "1.9rem",        // Border radius for badges
          "--animation-btn": "0.25s",         // Button click animation duration
          "--animation-input": "0.2s",        // Input focus animation duration
          "--btn-text-case": "uppercase",     // Button text transformation
          "--btn-focus-scale": "0.95",        // Button focus scale transform
          "--border-btn": "2px",              // Button border width
          "--tab-border": "1px",              // Tab border width
          "--tab-radius": "0.5rem",           // Tab border radius
        },
      },
    ],
    styled: true,
    base: true,
    utils: true,
    logs: false,
    rtl: false,
  },
}

