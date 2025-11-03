// Accessibility Widget - Full WCAG 2.0 AA Compliance
(function() {
    'use strict';

    const widget = document.querySelector('.accessibility-widget');
    const toggle = document.querySelector('.accessibility-toggle');
    const menu = document.querySelector('.accessibility-menu');
    
    if (!widget || !toggle || !menu) return;

    // State management
    const state = {
        highContrast: false,
        grayscale: false,
        underlineLinks: false,
        textSize: 1,
        readableFont: false,
        textAlignLeft: false,
        highlightFocus: false,
        stopAnimations: false,
        readAloud: false
    };

    // Load saved preferences
    function loadPreferences() {
        const saved = localStorage.getItem('accessibility-preferences');
        if (saved) {
            try {
                const prefs = JSON.parse(saved);
                Object.assign(state, prefs);
                applyAllSettings();
            } catch (e) {
                console.error('Error loading preferences:', e);
            }
        }
    }

    // Save preferences
    function savePreferences() {
        localStorage.setItem('accessibility-preferences', JSON.stringify(state));
    }

    // Toggle menu
    toggle.addEventListener('click', function() {
        const isOpen = menu.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(isOpen));
        if (isOpen) {
            menu.querySelector('button, a').focus();
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!widget.contains(e.target) && menu.classList.contains('is-open')) {
            menu.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Close menu on Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && menu.classList.contains('is-open')) {
            menu.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.focus();
        }
    });

    // Apply high contrast
    function applyHighContrast(enabled) {
        if (enabled) {
            document.documentElement.classList.add('high-contrast');
        } else {
            document.documentElement.classList.remove('high-contrast');
        }
    }

    // Apply grayscale
    function applyGrayscale(enabled) {
        if (enabled) {
            document.documentElement.classList.add('grayscale');
        } else {
            document.documentElement.classList.remove('grayscale');
        }
    }

    // Apply underline links
    function applyUnderlineLinks(enabled) {
        if (enabled) {
            document.documentElement.classList.add('underline-links');
        } else {
            document.documentElement.classList.remove('underline-links');
        }
    }

    // Apply text size
    function applyTextSize(multiplier) {
        document.documentElement.style.setProperty('--text-size-multiplier', multiplier);
        document.body.style.fontSize = `${16 * multiplier}px`;
    }

    // Apply readable font
    function applyReadableFont(enabled) {
        if (enabled) {
            document.documentElement.classList.add('readable-font');
        } else {
            document.documentElement.classList.remove('readable-font');
        }
    }

    // Apply text align left
    function applyTextAlignLeft(enabled) {
        if (enabled) {
            document.documentElement.setAttribute('dir', 'ltr');
            document.documentElement.classList.add('text-align-left');
        } else {
            document.documentElement.setAttribute('dir', 'rtl');
            document.documentElement.classList.remove('text-align-left');
        }
    }

    // Apply highlight focus
    function applyHighlightFocus(enabled) {
        if (enabled) {
            document.documentElement.classList.add('highlight-focus');
        } else {
            document.documentElement.classList.remove('highlight-focus');
        }
    }

    // Apply stop animations
    function applyStopAnimations(enabled) {
        if (enabled) {
            document.documentElement.classList.add('stop-animations');
        } else {
            document.documentElement.classList.remove('stop-animations');
        }
    }

    // Read aloud functionality
    let readAloudInstance = null;
    function startReadAloud() {
        if (state.readAloud && readAloudInstance) {
            stopReadAloud();
            return;
        }

        if (!('speechSynthesis' in window)) {
            alert('הדפדפן שלך לא תומך בקריאה קולית');
            return;
        }

        state.readAloud = true;
        const text = document.body.innerText;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'he-IL';
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;

        utterance.onend = function() {
            state.readAloud = false;
            readAloudInstance = null;
            savePreferences();
        };

        utterance.onerror = function() {
            state.readAloud = false;
            readAloudInstance = null;
            savePreferences();
        };

        speechSynthesis.speak(utterance);
        readAloudInstance = utterance;
        savePreferences();
    }

    function stopReadAloud() {
        if (readAloudInstance) {
            speechSynthesis.cancel();
            readAloudInstance = null;
            state.readAloud = false;
            savePreferences();
        }
    }

    // Apply all settings
    function applyAllSettings() {
        applyHighContrast(state.highContrast);
        applyGrayscale(state.grayscale);
        applyUnderlineLinks(state.underlineLinks);
        applyTextSize(state.textSize);
        applyReadableFont(state.readableFont);
        applyTextAlignLeft(state.textAlignLeft);
        applyHighlightFocus(state.highlightFocus);
        applyStopAnimations(state.stopAnimations);
    }

    // Reset all
    function resetAll() {
        state.highContrast = false;
        state.grayscale = false;
        state.underlineLinks = false;
        state.textSize = 1;
        state.readableFont = false;
        state.textAlignLeft = false;
        state.highlightFocus = false;
        state.stopAnimations = false;
        stopReadAloud();
        
        applyAllSettings();
        savePreferences();
    }

    // Handle menu button clicks
    menu.addEventListener('click', function(e) {
        const button = e.target.closest('button[data-action], a[data-action]');
        if (!button) return;

        const action = button.getAttribute('data-action');
        
        switch(action) {
            case 'high-contrast':
                state.highContrast = !state.highContrast;
                applyHighContrast(state.highContrast);
                break;
            case 'grayscale':
                state.grayscale = !state.grayscale;
                applyGrayscale(state.grayscale);
                break;
            case 'underline-links':
                state.underlineLinks = !state.underlineLinks;
                applyUnderlineLinks(state.underlineLinks);
                break;
            case 'text-size-increase':
                state.textSize = Math.min(state.textSize + 0.25, 2);
                applyTextSize(state.textSize);
                break;
            case 'text-size-decrease':
                state.textSize = Math.max(state.textSize - 0.25, 0.75);
                applyTextSize(state.textSize);
                break;
            case 'text-size-reset':
                state.textSize = 1;
                applyTextSize(state.textSize);
                break;
            case 'readable-font':
                state.readableFont = !state.readableFont;
                applyReadableFont(state.readableFont);
                break;
            case 'text-align-left':
                state.textAlignLeft = !state.textAlignLeft;
                applyTextAlignLeft(state.textAlignLeft);
                break;
            case 'highlight-focus':
                state.highlightFocus = !state.highlightFocus;
                applyHighlightFocus(state.highlightFocus);
                break;
            case 'stop-animations':
                state.stopAnimations = !state.stopAnimations;
                applyStopAnimations(state.stopAnimations);
                break;
            case 'read-aloud':
                startReadAloud();
                break;
            case 'reset-all':
                resetAll();
                break;
        }

        savePreferences();
        updateButtonStates();
    });

    // Update button states (visual feedback)
    function updateButtonStates() {
        menu.querySelectorAll('[data-action]').forEach(btn => {
            const action = btn.getAttribute('data-action');
            const isActive = 
                (action === 'high-contrast' && state.highContrast) ||
                (action === 'grayscale' && state.grayscale) ||
                (action === 'underline-links' && state.underlineLinks) ||
                (action === 'readable-font' && state.readableFont) ||
                (action === 'text-align-left' && state.textAlignLeft) ||
                (action === 'highlight-focus' && state.highlightFocus) ||
                (action === 'stop-animations' && state.stopAnimations) ||
                (action === 'read-aloud' && state.readAloud);
            
            btn.classList.toggle('is-active', isActive);
        });
    }

    // Initialize
    loadPreferences();
    updateButtonStates();
})();

