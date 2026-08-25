// core.js - Shared theme customizer for ICMS
(function () {
    function applyCustomStyles() {
        const settingsRaw = localStorage.getItem('icms_settings');
        if (!settingsRaw) return;

        try {
            const settings = JSON.parse(settingsRaw);
            let css = '';

            // 1. Background Color / Gradient (tidak diterapkan di login.html agar login-bg.jpg tetap tampil)
            const isLoginPage = window.location.pathname.endsWith('login.html');
            if (settings.bgColor && !isLoginPage) {
                let bgVal = settings.bgColor;
                if (settings.bgColor2) {
                    bgVal = `linear-gradient(135deg, ${settings.bgColor}, ${settings.bgColor2})`;
                }
                css += `
                    body {
                        background: ${bgVal} !important;
                    }
                `;
            }

            // 2. Sidebar Color / Gradient
            if (settings.sidebarColor) {
                let sideVal = settings.sidebarColor;
                if (settings.sidebarColor2) {
                    sideVal = `linear-gradient(180deg, ${settings.sidebarColor}, ${settings.sidebarColor2})`;
                }
                css += `
                    .sidebar {
                        background: ${sideVal} !important;
                    }
                `;
            }

            // 3. General Font Family
            if (settings.fontFamily) {
                if (settings.fontFamily !== 'system-ui' && !document.getElementById('custom-font-link')) {
                    const fontLink = document.createElement('link');
                    fontLink.id = 'custom-font-link';
                    fontLink.rel = 'stylesheet';
                    fontLink.href = `https://fonts.googleapis.com/css2?family=${settings.fontFamily.replace(/\s+/g, '+')}:wght@300;400;500;600;700&display=swap`;
                    document.head.appendChild(fontLink);
                }
                css += `
                    body, input, select, button, textarea, .brand-title, .brand-subtitle, th, td, a, p, span, div {
                        font-family: '${settings.fontFamily}', system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif !important;
                    }
                `;
            }

            // 4. General Font Size
            if (settings.fontSize) {
                const fs = parseInt(settings.fontSize);
                css += `
                    body, p, span, div:not(.brand-mark):not(.brand-title):not(.brand-subtitle) {
                        font-size: ${fs}px !important;
                    }
                    input, select, button, textarea {
                        font-size: ${fs}px !important;
                    }
                    th, td {
                        font-size: ${Math.max(10, fs - 1.5)}px !important;
                    }
                    .sidebar nav a {
                        font-size: ${Math.max(10, fs - 1)}px !important;
                    }
                `;
            }

            // 5. Table Column & Row Sizes
            if (settings.tableMinColWidth || settings.tableMaxColWidth) {
                css += `
                    table th, table td {
                `;
                if (settings.tableMinColWidth) {
                    css += `min-width: ${settings.tableMinColWidth}px !important;`;
                }
                if (settings.tableMaxColWidth) {
                    css += `max-width: ${settings.tableMaxColWidth}px !important;`;
                }
                css += `
                    }
                `;
            }

            if (settings.tableMinRowHeight || settings.tableMaxRowHeight) {
                css += `
                    table tr {
                `;
                if (settings.tableMinRowHeight) {
                    css += `height: ${settings.tableMinRowHeight}px !important;`;
                }
                css += `
                    }
                    table th, table td {
                `;
                if (settings.tableMinRowHeight) {
                    css += `height: ${settings.tableMinRowHeight}px !important;`;
                    // Adjust padding to center text vertically if rows are tall
                    const padValue = Math.max(2, Math.floor((parseInt(settings.tableMinRowHeight) - 20) / 2));
                    css += `padding-top: ${padValue}px !important; padding-bottom: ${padValue}px !important;`;
                }
                if (settings.tableMaxRowHeight) {
                    css += `max-height: ${settings.tableMaxRowHeight}px !important; overflow: hidden !important;`;
                }
                css += `
                    }
                `;
            }

            // 6. Accent Color
            if (settings.accentColor) {
                css += `
                    :root {
                        --accent: ${settings.accentColor} !important;
                        --border: ${settings.accentColor} !important;
                    }
                    .brand-mark, .primary, .btn.cyan, button[type="submit"] {
                        background: ${settings.accentColor} !important;
                        color: #ffffff !important;
                    }
                `;
            }

            // 7. Sidebar Active Color
            if (settings.sidebarActiveColor) {
                css += `
                    .sidebar nav a.active, .sidebar nav a:hover {
                        background: ${settings.sidebarActiveColor} !important;
                        color: #ffffff !important;
                    }
                `;
            }

            // Inject styles
            let styleEl = document.getElementById('custom-theme-styles');
            if (!styleEl) {
                styleEl = document.createElement('style');
                styleEl.id = 'custom-theme-styles';
                document.head.appendChild(styleEl);
            }
            styleEl.innerHTML = css;

        } catch (e) {
            console.error('Error applying custom styles:', e);
        }
    }

    // Run immediately to avoid flashing
    applyCustomStyles();

    // Run again on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyCustomStyles);
    }

    // Expose globally
    window.applyCustomStyles = applyCustomStyles;
})();
