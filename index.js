// DelSwipe Button Extension for SillyTavern
// Uses proper SillyTavern extension API

import { getContext } from '../../../extensions.js';

const MODULE_NAME = 'delswipe-button';

console.log(`[${MODULE_NAME}] Loading DelSwipe Button Extension...`);

let isInitialized = false;
let extensionSettings = {};

// Function to create and show the button
function createDelSwipeButton() {
    // Remove existing button if present
    const existingButton = document.getElementById('delswipe-btn');
    if (existingButton) {
        existingButton.remove();
    }
    
    // Create the button element
    const button = document.createElement('button');
    button.id = 'delswipe-btn';
    button.innerHTML = '🗑️ Del Swipe';
    button.title = 'Delete current swipe (/delswipe)';
    button.type = 'button';
    
    // Apply styles
    Object.assign(button.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: '10000',
        padding: '10px 15px',
        backgroundColor: 'var(--SmartThemeBodyColor, #2b2a33)',
        color: 'var(--SmartThemeEmColor, #fff)',
        border: '2px solid var(--SmartThemeBorderColor, #555)',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
        fontFamily: 'inherit',
        boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
        transition: 'all 0.2s ease',
        userSelect: 'none',
        whiteSpace: 'nowrap'
    });
    
    // Add hover effects
    button.addEventListener('mouseenter', () => {
        button.style.backgroundColor = 'var(--SmartThemeQuoteColor, #4a4458)';
        button.style.transform = 'scale(1.05)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.backgroundColor = 'var(--SmartThemeBodyColor, #2b2a33)';
        button.style.transform = 'scale(1)';
    });
    
    // Add click handler
    button.addEventListener('click', executeDelSwipe);
    
    // Add to page
    document.body.appendChild(button);
    
    console.log(`[${MODULE_NAME}] Button created and added to page`);
    return button;
}

// Function to execute the delswipe command
async function executeDelSwipe() {
    console.log(`[${MODULE_NAME}] Button clicked, executing delswipe...`);
    
    try {
        const context = getContext();
        
        // Method 1: Try using SillyTavern's slash command system
        if (context && typeof context.executeSlashCommands === 'function') {
            await context.executeSlashCommands('/delswipe');
            console.log(`[${MODULE_NAME}] Executed via context.executeSlashCommands`);
            return;
        }
        
        // Method 2: Try the global executeSlashCommandsNow function
        if (typeof window.executeSlashCommandsNow === 'function') {
            await window.executeSlashCommandsNow('/delswipe');
            console.log(`[${MODULE_NAME}] Executed via executeSlashCommandsNow`);
            return;
        }
        
        // Method 3: Try executeSlashCommand
        if (typeof window.executeSlashCommand === 'function') {
            await window.executeSlashCommand('/delswipe', [], null, false, false);
            console.log(`[${MODULE_NAME}] Executed via executeSlashCommand`);
            return;
        }
        
        // Method 4: Try SlashCommandParser if available
        if (typeof window.SlashCommandParser !== 'undefined' && window.SlashCommandParser.executeSlashCommand) {
            await window.SlashCommandParser.executeSlashCommand('/delswipe');
            console.log(`[${MODULE_NAME}] Executed via SlashCommandParser`);
            return;
        }
        
        // Method 5: Simulate typing in chat input
        const chatInput = document.getElementById('send_textarea');
        if (chatInput) {
            const originalValue = chatInput.value;
            
            // Set the command
            chatInput.value = '/delswipe';
            chatInput.focus();
            
            // Trigger input event
            chatInput.dispatchEvent(new Event('input', { bubbles: true }));
            
            // Simulate pressing Enter
            const enterEvent = new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true,
                cancelable: true
            });
            
            chatInput.dispatchEvent(enterEvent);
            
            // Restore original value after a delay
            setTimeout(() => {
                if (chatInput.value === '/delswipe') {
                    chatInput.value = originalValue;
                }
            }, 200);
            
            console.log(`[${MODULE_NAME}] Executed via chat input simulation`);
            return;
        }
        
        console.error(`[${MODULE_NAME}] No available method to execute delswipe command`);
        
    } catch (error) {
        console.error(`[${MODULE_NAME}] Error executing delswipe:`, error);
    }
}

// Function to check if SillyTavern is ready
function isSillyTavernReady() {
    return document.getElementById('send_textarea') !== null && 
           document.body && 
           document.readyState === 'complete';
}

// Extension initialization function (required by SillyTavern)
function init() {
    if (isInitialized) {
        console.log(`[${MODULE_NAME}] Already initialized, skipping...`);
        return;
    }
    
    console.log(`[${MODULE_NAME}] Initializing extension...`);
    
    if (!isSillyTavernReady()) {
        console.log(`[${MODULE_NAME}] SillyTavern not ready yet, retrying in 1 second...`);
        setTimeout(init, 1000);
        return;
    }
    
    // Get extension context and settings
    const context = getContext();
    if (context && context.extensionSettings) {
        extensionSettings = context.extensionSettings[MODULE_NAME] || {};
    }
    
    // Create the button
    createDelSwipeButton();
    
    // Set up periodic check to recreate button if it disappears
    setInterval(() => {
        if (!document.getElementById('delswipe-btn')) {
            console.log(`[${MODULE_NAME}] Button missing, recreating...`);
            createDelSwipeButton();
        }
    }, 5000);
    
    isInitialized = true;
    console.log(`[${MODULE_NAME}] Extension initialized successfully`);
}

// Required export for SillyTavern extension system
export { init };