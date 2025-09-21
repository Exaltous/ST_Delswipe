// delswipe-button/index.js

import { executeSlashCommand } from '../../../../slash-commands.js';
import { eventSource, event_types } from '../../../../script.js';

const extensionName = 'delswipe-button';
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;

// Extension settings
const defaultSettings = {
    buttonPosition: 'bottom-right',
    buttonText: 'Del Swipe',
    showTooltip: true
};

let extensionSettings = defaultSettings;

// Create the button element
function createDelSwipeButton() {
    const button = document.createElement('button');
    button.id = 'delswipe-button';
    button.textContent = extensionSettings.buttonText;
    button.className = 'menu_button delswipe-btn';
    
    // Add tooltip if enabled
    if (extensionSettings.showTooltip) {
        button.title = 'Delete the current swipe';
    }
    
    // Add click handler
    button.addEventListener('click', async () => {
        try {
            await executeSlashCommand('/delswipe', [], null, false, false);
            console.log('DelSwipe command executed successfully');
        } catch (error) {
            console.error('Error executing delswipe command:', error);
        }
    });
    
    return button;
}

// Position the button based on settings
function positionButton(button) {
    button.style.position = 'fixed';
    button.style.zIndex = '1000';
    button.style.padding = '8px 12px';
    button.style.margin = '10px';
    button.style.backgroundColor = 'var(--SmartThemeBodyColor)';
    button.style.color = 'var(--SmartThemeEmColor)';
    button.style.border = '1px solid var(--SmartThemeBorderColor)';
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';
    button.style.fontSize = '12px';
    button.style.fontWeight = 'bold';
    button.style.transition = 'all 0.2s ease';
    
    // Position based on settings
    switch (extensionSettings.buttonPosition) {
        case 'top-left':
            button.style.top = '10px';
            button.style.left = '10px';
            break;
        case 'top-right':
            button.style.top = '10px';
            button.style.right = '10px';
            break;
        case 'bottom-left':
            button.style.bottom = '10px';
            button.style.left = '10px';
            break;
        case 'bottom-right':
        default:
            button.style.bottom = '10px';
            button.style.right = '10px';
            break;
    }
    
    // Add hover effects
    button.addEventListener('mouseenter', () => {
        button.style.backgroundColor = 'var(--SmartThemeQuoteColor)';
        button.style.transform = 'scale(1.05)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.backgroundColor = 'var(--SmartThemeBodyColor)';
        button.style.transform = 'scale(1)';
    });
}

// Create settings HTML
function createSettingsHtml() {
    return `
        <div class="delswipe-settings">
            <h3>DelSwipe Button Settings</h3>
            
            <div class="form-group">
                <label for="delswipe-button-text">Button Text:</label>
                <input type="text" id="delswipe-button-text" value="${extensionSettings.buttonText}" />
            </div>
            
            <div class="form-group">
                <label for="delswipe-button-position">Button Position:</label>
                <select id="delswipe-button-position">
                    <option value="top-left" ${extensionSettings.buttonPosition === 'top-left' ? 'selected' : ''}>Top Left</option>
                    <option value="top-right" ${extensionSettings.buttonPosition === 'top-right' ? 'selected' : ''}>Top Right</option>
                    <option value="bottom-left" ${extensionSettings.buttonPosition === 'bottom-left' ? 'selected' : ''}>Bottom Left</option>
                    <option value="bottom-right" ${extensionSettings.buttonPosition === 'bottom-right' ? 'selected' : ''}>Bottom Right</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>
                    <input type="checkbox" id="delswipe-show-tooltip" ${extensionSettings.showTooltip ? 'checked' : ''} />
                    Show tooltip on hover
                </label>
            </div>
            
            <div class="form-group">
                <button id="delswipe-save-settings" class="menu_button">Save Settings</button>
            </div>
        </div>
    `;
}

// Load settings from localStorage
function loadSettings() {
    const saved = localStorage.getItem(`${extensionName}_settings`);
    if (saved) {
        extensionSettings = { ...defaultSettings, ...JSON.parse(saved) };
    }
}

// Save settings to localStorage
function saveSettings() {
    localStorage.setItem(`${extensionName}_settings`, JSON.stringify(extensionSettings));
}

// Update button based on new settings
function updateButton() {
    const existingButton = document.getElementById('delswipe-button');
    if (existingButton) {
        existingButton.remove();
    }
    
    const newButton = createDelSwipeButton();
    positionButton(newButton);
    document.body.appendChild(newButton);
}

// Initialize the extension
function init() {
    loadSettings();
    
    // Create and add the button
    const button = createDelSwipeButton();
    positionButton(button);
    document.body.appendChild(button);
    
    console.log('DelSwipe Button extension loaded');
}

// Settings panel integration
function addSettingsPanel() {
    const settingsHtml = createSettingsHtml();
    
    // Add to extensions settings if available
    if (typeof window.registerExtensionSettings === 'function') {
        window.registerExtensionSettings(extensionName, settingsHtml, () => {
            // Settings save handler
            const buttonText = document.getElementById('delswipe-button-text').value;
            const buttonPosition = document.getElementById('delswipe-button-position').value;
            const showTooltip = document.getElementById('delswipe-show-tooltip').checked;
            
            extensionSettings.buttonText = buttonText;
            extensionSettings.buttonPosition = buttonPosition;
            extensionSettings.showTooltip = showTooltip;
            
            saveSettings();
            updateButton();
        });
    }
}

// Event listeners for settings changes
function setupSettingsHandlers() {
    document.addEventListener('click', (e) => {
        if (e.target.id === 'delswipe-save-settings') {
            const buttonText = document.getElementById('delswipe-button-text').value;
            const buttonPosition = document.getElementById('delswipe-button-position').value;
            const showTooltip = document.getElementById('delswipe-show-tooltip').checked;
            
            extensionSettings.buttonText = buttonText;
            extensionSettings.buttonPosition = buttonPosition;
            extensionSettings.showTooltip = showTooltip;
            
            saveSettings();
            updateButton();
            
            console.log('DelSwipe Button settings saved');
        }
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Setup settings handlers
setupSettingsHandlers();

// Export for SillyTavern extension system
export { init, extensionName };