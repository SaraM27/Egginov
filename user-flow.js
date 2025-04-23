// Unified User Experience Flow for Accessibility Platform

// Main Application Flow Controller
const AppFlow = {
    // Configuration
    config: {
        transitionDuration: 300, // ms
        autoSaveInterval: 30000, // ms
    },
    
    // State
    state: {
        currentScreen: 'welcome-screen',
        previousScreen: null,
        screenHistory: [],
        userPreferences: {
            mode: null,
            team: null,
            highContrast: false,
            largeText: false,
            vibration: true,
            voiceGuidance: true,
            autoConnect: true
        },
        onboardingComplete: false
    },
    
    // Initialize application flow
    initialize: function() {
        // Load saved preferences if available
        this.loadUserPreferences();
        
        // Set up screen transitions
        this.setupScreenTransitions();
        
        // Set up keyboard navigation
        this.setupKeyboardNavigation();
        
        // Set up touch gestures
        this.setupTouchGestures();
        
        // Set up auto-save
        setInterval(() => this.saveUserPreferences(), this.config.autoSaveInterval);
        
        // Check if first-time user
        if (!this.state.onboardingComplete) {
            // Start with welcome screen for new users
            this.navigateToScreen('welcome-screen');
        } else {
            // Skip to main experience for returning users
            this.skipToMainExperience();
        }
        
        return this;
    },
    
    // Load user preferences from localStorage
    loadUserPreferences: function() {
        try {
            const savedPreferences = localStorage.getItem('footballSensePreferences');
            if (savedPreferences) {
                const preferences = JSON.parse(savedPreferences);
                this.state.userPreferences = {...this.state.userPreferences, ...preferences};
                this.state.onboardingComplete = true;
                
                // Apply saved preferences to UI
                this.applyUserPreferences();
            }
        } catch (error) {
            console.error('Error loading preferences:', error);
        }
    },
    
    // Save user preferences to localStorage
    saveUserPreferences: function() {
        try {
            localStorage.setItem(
                'footballSensePreferences', 
                JSON.stringify(this.state.userPreferences)
            );
        } catch (error) {
            console.error('Error saving preferences:', error);
        }
    },
    
    // Apply user preferences to UI
    applyUserPreferences: function() {
        // Apply high contrast mode
        document.body.classList.toggle('high-contrast', this.state.userPreferences.highContrast);
        
        // Apply large text mode
        document.body.classList.toggle('large-text', this.state.userPreferences.largeText);
        
        // Update checkboxes in settings
        const highContrastCheckbox = document.getElementById('high-contrast');
        if (highContrastCheckbox) {
            highContrastCheckbox.checked = this.state.userPreferences.highContrast;
        }
        
        const deafVibrationCheckbox = document.getElementById('deaf-vibration');
        if (deafVibrationCheckbox) {
            deafVibrationCheckbox.checked = this.state.userPreferences.vibration;
        }
        
        const blindVibrationCheckbox = document.getElementById('blind-vibration');
        if (blindVibrationCheckbox) {
            blindVibrationCheckbox.checked = this.state.userPreferences.vibration;
        }
        
        const voiceGuidanceCheckbox = document.getElementById('voice-guidance');
        if (voiceGuidanceCheckbox) {
            voiceGuidanceCheckbox.checked = this.state.userPreferences.voiceGuidance;
        }
        
        const autoConnectCheckbox = document.getElementById('auto-connect-eeg');
        if (autoConnectCheckbox) {
            autoConnectCheckbox.checked = this.state.userPreferences.autoConnect;
        }
    },
    
    // Set up screen transitions
    setupScreenTransitions: function() {
        // Get all continue buttons
        const continueButtons = document.querySelectorAll('[id$="continue-button"]');
        
        // Add event listeners to continue buttons
        continueButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                // Get current screen
                const currentScreen = button.closest('.screen');
                if (!currentScreen) return;
                
                // Get next screen based on current screen
                const nextScreen = this.getNextScreen(currentScreen.id);
                if (nextScreen) {
                    this.navigateToScreen(nextScreen);
                }
            });
        });
        
        // Set up settings button
        const settingsButton = document.getElementById('settings-button');
        if (settingsButton) {
            settingsButton.addEventListener('click', () => {
                this.navigateToScreen('settings-screen');
            });
        }
        
        // Set up save settings button
        const saveSettingsButton = document.getElementById('save-settings');
        if (saveSettingsButton) {
            saveSettingsButton.addEventListener('click', () => {
                this.saveSettings();
                this.navigateBack();
            });
        }
        
        // Set up navigation buttons
        const navButtons = document.querySelectorAll('.nav-button');
        navButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetScreen = this.getNavTargetScreen(button.id);
                if (targetScreen) {
                    this.navigateToScreen(targetScreen);
                }
            });
        });
    },
    
    // Get next screen based on current screen
    getNextScreen: function(currentScreenId) {
        const screenFlow = {
            'welcome-screen': 'mode-selection-screen',
            'mode-selection-screen': 'team-selection-screen',
            'team-selection-screen': 'eeg-connection-screen',
            'eeg-connection-screen': () => {
                // Return different screen based on selected mode
                return this.state.userPreferences.mode === 'deaf' 
                    ? 'deaf-mode-screen' 
                    : 'blind-mode-screen';
            }
        };
        
        const nextScreen = screenFlow[currentScreenId];
        
        if (typeof nextScreen === 'function') {
            return nextScreen();
        }
        
        return nextScreen;
    },
    
    // Get target screen for navigation buttons
    getNavTargetScreen: function(buttonId) {
        const navTargets = {
            'home-nav': 'welcome-screen',
            'matches-nav': () => {
                return this.state.userPreferences.mode === 'deaf' 
                    ? 'deaf-mode-screen' 
                    : 'blind-mode-screen';
            },
            'teams-nav': 'team-selection-screen',
            'profile-nav': 'settings-screen'
        };
        
        const target = navTargets[buttonId];
        
        if (typeof target === 'function') {
            return target();
        }
        
        return target;
    },
    
    // Navigate to specified screen
    navigateToScreen: function(screenId) {
        if (!screenId) return;
        
        // Save current screen to history
        if (this.state.currentScreen) {
            this.state.previousScreen = this.state.currentScreen;
            this.state.screenHistory.push(this.state.currentScreen);
        }
        
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show target screen
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.state.currentScreen = screenId;
            
            // Special handling for specific screens
            this.handleScreenSpecificActions(screenId);
        }
        
        // Update navigation bar visibility
        this.updateNavigationBar(screenId);
        
        // Provide feedback for screen change
        this.provideFeedback();
    },
    
    // Navigate back to previous screen
    navigateBack: function() {
        if (this.state.previousScreen) {
            this.navigateToScreen(this.state.previousScreen);
            
            // Remove the current screen from history
            this.state.screenHistory.pop();
            
            // Update previous screen
            const historyLength = this.state.screenHistory.length;
            this.state.previousScreen = historyLength > 0 
                ? this.state.screenHistory[historyLength - 1] 
                : null;
        } else {
            // If no previous screen, go to welcome screen
            this.navigateToScreen('welcome-screen');
        }
    },
    
    // Handle screen-specific actions
    handleScreenSpecificActions: function(screenId) {
        switch (screenId) {
            case 'mode-selection-screen':
                this.handleModeSelectionScreen();
                break;
                
            case 'team-selection-screen':
                this.handleTeamSelectionScreen();
                break;
                
            case 'eeg-connection-screen':
                this.handleEEGConnectionScreen();
                break;
                
            case 'deaf-mode-screen':
                this.handleDeafModeScreen();
                break;
                
            case 'blind-mode-screen':
                this.handleBlindModeScreen();
                break;
                
            case 'settings-screen':
                this.handleSettingsScreen();
                break;
        }
    },
    
    // Handle mode selection screen
    handleModeSelectionScreen: function() {
        const deafModeCard = document.getElementById('deaf-mode-card');
        const blindModeCard = document.getElementById('blind-mode-card');
        const continueButton = document.getElementById('mode-continue-button');
        
        // Pre-select mode if already set in preferences
        if (this.state.userPreferences.mode) {
            if (this.state.userPreferences.mode === 'deaf') {
                deafModeCard.classList.add('selected');
                blindModeCard.classList.remove('selected');
            } else {
                blindModeCard.classList.add('selected');
                deafModeCard.classList.remove('selected');
            }
            
            continueButton.disabled = false;
        } else {
            // Clear selection
            deafModeCard.classList.remove('selected');
            blindModeCard.classList.remove('selected');
            continueButton.disabled = true;
        }
        
        // Set up mode selection
        deafModeCard.addEventListener('click', () => {
            deafModeCard.classList.add('selected');
            blindModeCard.classList.remove('selected');
            this.state.userPreferences.mode = 'deaf';
            continueButton.disabled = false;
        });
        
        blindModeCard.addEventListener('click', () => {
            blindModeCard.classList.add('selected');
            deafModeCard.classList.remove('selected');
            this.state.userPreferences.mode = 'blind';
            continueButton.disabled = false;
        });
    },
    
    // Handle team selection screen
    handleTeamSelectionScreen: function() {
        const teamsGrid = document.getElementById('teams-grid');
        const continueButton = document.getElementById('team-continue-button');
        
        // Pre-select team if already set in preferences
        if (this.state.userPreferences.team && teamsGrid) {
            const teamCard = teamsGrid.querySelector(`[data-team-id="${this.state.userPreferences.team.id}"]`);
            if (teamCard) {
                teamCard.classList.add('selected');
                continueButton.disabled = false;
            }
        }
        
        // Make sure team cards have event listeners
        if (teamsGrid) {
            const teamCards = teamsGrid.querySelectorAll('.team-card');
            teamCards.forEach(card => {
                card.addEventListener('click', () => {
                    // Remove selected class from all cards
                    teamCards.forEach(c => c.classList.remove('selected'));
                    
                    // Add selected class to clicked card
                    card.classList.add('selected');
                    
                    // Update selected team in preferences
                    const teamId = parseInt(card.dataset.teamId);
                    const selectedTeam = appState.teams.find(team => team.id === teamId);
                    this.state.userPreferences.team = selectedTeam;
                    
                    // Enable continue button
                    continueButton.disabled = false;
                });
            });
        }
    },
    
    // Handle EEG connection screen
    handleEEGConnectionScreen: function() {
        const skipButton = document.getElementById('skip-eeg-button');
        const continueButton = document.getElementById('eeg-continue-button');
        
        // Auto-connect if enabled in preferences
        if (this.state.userPreferences.autoConnect) {
            // Simulate EEG connection (in a real app, this would connect to actual device)
            setTimeout(() => {
                const statusIcon = document.getElementById('eeg-status-icon');
                const statusText = document.getElementById('eeg-status-text');
                
                if (statusIcon && statusText) {
                    statusIcon.className = 'fas fa-check-circle';
                    statusText.textContent = 'EEG device connected successfully';
                }
                
                if (continueButton) {
                    continueButton.disabled = false;
                }
                
                // Start EEG visualization
                this.startEEGVisualization();
            }, 2000);
        }
    },
    
    // Handle deaf mode screen
    handleDeafModeScreen: function() {
        // Update team information
        if (this.state.userPreferences.team) {
            const homeTeamName = document.getElementById('home-team-name');
            const homeTeamLogo = document.getElementById('home-team-logo');
            
            if (homeTeamName) {
                homeTeamName.textContent = this.state.userPreferences.team.name;
            }
            
            if (homeTeamLogo && this.state.userPreferences.team.logo) {
                homeTeamLogo.src = this.state.userPreferences.team.logo;
            }
        }
        
        // Set up control panel event listeners
        const arrowSizeSlider = document.getElementById('arrow-size');
        const arrowSpeedSlider = document.getElementById('arrow-speed');
        const highContrastCheckbox = document.getElementById('high-contrast');
        const vibrationCheckbox = document.getElementById('deaf-vibration');
        
        if (arrowSizeSlider) {
            arrowSizeSlider.addEventListener('input', () => {
                const directionArrow = document.getElementById('direction-arrow');
                if (directionArrow) {
                    const size = 30 + (arrowSizeSlider.value * 5);
                    directionArrow.style.width = size + 'px';
                    directionArrow.style.height = size + 'px';
                }
            });
        }
        
        if (arrowSpeedSlider) {
            arrowSpeedSlider.addEventListener('input', () => {
                // In a real app, this would adjust the arrow movement speed
                // For this prototype, we'll just provide feedback
                if (vibrationCheckbox && vibrationCheckbox.checked && 'vibrate' in navigator) {
                    navigator.vibrate(50);
                }
            });
        }
        
        if (highContrastCheckbox) {
            highContrastCheckbox.addEventListener('change', () => {
                this.state.userPreferences.highContrast = highContrastCheckbox.checked;
                document.body.classList.toggle('high-contrast', highContrastCheckbox.checked);
            });
        }
        
        if (vibrationCheckbox) {
            vibrationCheckbox.addEventListener('change', () => {
                this.state.userPreferences.vibration = vibrationCheckbox.checked;
            });
        }
        
        // Start match simulation
        this.startMatchSimulation('deaf');
    },
    
    // Handle blind mode screen
    handleBlindModeScreen: function() {
        // Update team information
        if (this.state.userPreferences.team) {
            const homeTeamName = document.getElementById('blind-home-team-name');
            
            if (homeTeamName) {
                homeTeamName.textContent = this.state.userPreferences.team.name;
            }
        }
        
        // Set up control panel event listeners
        const audioIntensitySlider = document.getElementById('audio-intensity');
        const spatialPrecisionSlider = document.getElementById('spatial-precision');
        const voiceGuidanceCheckbox = document.getElementById('voice-guidance');
        const vibrationCheckbox = document.getElementById('blind-vibration');
        
        if (voiceGuidanceCheckbox) {
            voiceGuidanceCheckbox.addEventListener('change', () => {
                this.state.userPreferences.voiceGuidance = voiceGuidanceCheckbox.checked;
                
                // Provide feedback
                if (voiceGuidanceCheckbox.checked) {
                    this.announceVoiceGuidance('Voice guidance enabled');
                }
            });
        }
        
        if (vibrationCheckbox) {
            vibrationCheckbox.addEventListener('change', () => {
                this.state.userPreferences.vibration = vibrationCheckbox.checked;
            });
        }
        
        // Set up audio controls
        const volumeDownButton = document.getElementById('volume-down');
        const playPauseButton = document.getElementById('play-pause');
        const volumeUpButton = document.getElementById('volume-up');
        
        if (volumeDownButton) {
            volumeDownButton.addEventListener('click', () => {
                if (audioIntensitySlider) {
                    audioIntensitySlider.value = Math.max(1, parseInt(audioIntensitySlider.value) - 1);
                    
                    // Provide feedback
                    if (this.state.userPreferences.vibration && 'vibrate' in navigator) {
                        navigator.vibrate(50);
                    }
                    
                    if (this.state.userPreferences.voiceGuidance) {
                        this.announceVoiceGuidance('Volume decreased');
                    }
                }
            });
        }
        
        if (volumeUpButton) {
            volumeUpButton.addEventListener('click', () => {
                if (audioIntensitySlider) {
                    audioIntensitySlider.value = Math.min(5, parseInt(audioIntensitySlider.value) + 1);
                    
                    // Provide feedback
                    if (this.state.userPreferences.vibration && 'vibrate' in navigator) {
                        navigator.vibrate(50);
                    }
                    
                    if (this.state.userPreferences.voiceGuidance) {
                        this.announceVoiceGuidance('Volume increased');
                    }
                }
            });
        }
        
        if (playPauseButton) {
            playPauseButton.addEventListener('click', () => {
                const icon = playPauseButton.querySelector('i');
                
                if (icon.classList.contains('fa-pause')) {
                    icon.classList.remove('fa-pause');
                    icon.classList.add('fa-play');
                    
                    if (this.state.userPreferences.voiceGuidance) {
                        this.announceVoiceGuidance('Audio paused');
                    }
                } else {
                    icon.classList.remove('fa-play');
                    icon.classList.add('fa-pause');
                    
                    if (this.state.userPreferences.voiceGuidance) {
                        this.announceVoiceGuidance('Audio resumed');
                    }
                }
                
                // Provide haptic feedback
                if (this.state.userPreferences.vibration && 'vibrate' in navigator) {
                    navigator.vibrate(100);
                }
            });
        }
        
        // Start match simulation
        this.startMatchSimulation('blind');
        
        // Initial voice guidance
        if (this.state.userPreferences.voiceGuidance) {
            setTimeout(() => {
                this.announceVoiceGuidance('Blind mode activated. 3D spatial audio is now tracking the ball.');
            }, 1000);
        }
    },
    
    // Handle settings screen
    handleSettingsScreen: function() {
        const accessibilityModeSelect = document.getElementById('accessibility-mode');
        const favoriteTeamSelect = document.getElementById('favorite-team');
        const autoConnectCheckbox = document.getElementById('auto-connect-eeg');
        const resetButton = document.getElementById('reset-settings');
        
        // Set current values
        if (accessibilityModeSelect && this.state.userPreferences.mode) {
            accessibilityModeSelect.value = this.state.userPreferences.mode;
        }
        
        if (favoriteTeamSelect && this.state.userPreferences.team) {
            favoriteTeamSelect.value = this.state.userPreferences.team.id;
        }
        
        if (autoConnectCheckbox) {
            autoConnectCheckbox.checked = this.state.userPreferences.autoConnect;
        }
        
        // Reset settings
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                // Reset to defaults
                this.state.userPreferences = {
                    mode: 'deaf',
                    team: null,
                    highContrast: false,
                    largeText: false,
                    vibration: true,
                    voiceGuidance: true,
                    autoConnect: true
                };
                
                // Update UI
                if (accessibilityModeSelect) accessibilityModeSelect.value = 'deaf';
                if (favoriteTeamSelect) favoriteTeamSelect.selectedIndex = 0;
                if (autoConnectCheckbox) autoConnectCheckbox.checked = true;
                
                // Apply preferences
                this.applyUserPreferences();
                
                // Provide feedback
                if (this.state.userPreferences.vibration && 'vibrate' in navigator) {
                    navigator.vibrate([100, 50, 100]);
                }
            });
        }
    },
    
    // Save settings from settings screen
    saveSettings: function() {
        const accessibilityModeSelect = document.getElementById('accessibility-mode');
        const favoriteTeamSelect = document.getElementById('favorite-team');
        const autoConnectCheckbox = document.getElementById('auto-connect-eeg');
        
        // Update mode
        if (accessibilityModeSelect) {
            this.state.userPreferences.mode = accessibilityModeSelect.value;
        }
        
        // Update team
        if (favoriteTeamSelect) {
            const selectedTeamId = parseInt(favoriteTeamSelect.value);
            this.state.userPreferences.team = appState.teams.find(team => team.id === selectedTeamId);
        }
        
        // Update auto-connect
        if (autoConnectCheckbox) {
            this.state.userPreferences.autoConnect = autoConnectCheckbox.checked;
        }
        
        // Save preferences
        this.saveUserPreferences();
        
        // Provide feedback
        if (this.state.userPreferences.vibration && 'vibrate' in navigator) {
            navigator.vibrate(100);
        }
    },
    
    // Update navigation bar visibility
    updateNavigationBar: function(screenId) {
        const navBar = document.getElementById('nav-bar');
        if (!navBar) return;
        
        // Show navigation bar only on main experience screens
        const showNavScreens = ['deaf-mode-screen', 'blind-mode-screen'];
        navBar.style.display = showNavScreens.includes(screenId) ? 'flex' : 'none';
        
        // Update active nav button
        const navButtons = navBar.querySelectorAll('.nav-button');
        navButtons.forEach(button => {
            button.classList.remove('active');
        });
        
        // Set active nav button based on current screen
        if (screenId === 'deaf-mode-screen' || screenId === 'blind-mode-screen') {
            const matchesNav = document.getElementById('matches-nav');
            if (matchesNav) {
                matchesNav.classList.add('active');
            }
        } else if (screenId === 'team-selection-screen') {
            const teamsNav = document.getElementById('teams-nav');
            if (teamsNav) {
                teamsNav.classList.add('active');
            }
        } else if (screenId === 'settings-screen') {
            const profileNav = document.getElementById('profile-nav');
            if (profileNav) {
                profileNav.classList.add('active');
            }
        } else if (screenId === 'welcome-screen') {
            const homeNav = document.getElementById('home-nav');
            if (homeNav) {
                homeNav.classList.add('active');
            }
        }
    },
    
    // Set up keyboard navigation
    setupKeyboardNavigation: function() {
        document.addEventListener('keydown', (event) => {
            // Handle different keys based on current screen
            switch (this.state.currentScreen) {
                case 'deaf-mode-screen':
                    this.handleDeafModeKeyboard(event);
                    break;
                    
                case 'blind-mode-screen':
                    this.handleBlindModeKeyboard(event);
                    break;
                    
                default:
                    this.handleGeneralKeyboard(event);
                    break;
            }
        });
    },
    
    // Handle keyboard navigation for deaf mode
    handleDeafModeKeyboard: function(event) {
        const directionArrow = document.getElementById('direction-arrow');
        if (!directionArrow) return;
        
        // Get current position
        const currentLeft = parseFloat(directionArrow.style.left) || 50;
        const currentTop = parseFloat(directionArrow.style.top) || 50;
        
        // Move arrow based on arrow keys
        switch (event.key) {
            case 'ArrowLeft':
                directionArrow.style.left = Math.max(5, currentLeft - 5) + '%';
                directionArrow.innerHTML = '<i class="fas fa-arrow-left"></i>';
                break;
                
            case 'ArrowRight':
                directionArrow.style.left = Math.min(95, currentLeft + 5) + '%';
                directionArrow.innerHTML = '<i class="fas fa-arrow-right"></i>';
                break;
                
            case 'ArrowUp':
                directionArrow.style.top = Math.max(5, currentTop - 5) + '%';
                directionArrow.innerHTML = '<i class="fas fa-arrow-up"></i>';
                break;
                
            case 'ArrowDown':
                directionArrow.style.top = Math.min(95, currentTop + 5) + '%';
                directionArrow.innerHTML = '<i class="fas fa-arrow-down"></i>';
                break;
                
            case 'h':
            case 'H':
                // Toggle high contrast
                const highContrastCheckbox = document.getElementById('high-contrast');
                if (highContrastCheckbox) {
                    highContrastCheckbox.checked = !highContrastCheckbox.checked;
                    highContrastCheckbox.dispatchEvent(new Event('change'));
                }
                break;
                
            case 'v':
            case 'V':
                // Toggle vibration
                const vibrationCheckbox = document.getElementById('deaf-vibration');
                if (vibrationCheckbox) {
                    vibrationCheckbox.checked = !vibrationCheckbox.checked;
                    vibrationCheckbox.dispatchEvent(new Event('change'));
                }
                break;
                
            case 'Escape':
                // Open settings
                this.navigateToScreen('settings-screen');
                break;
        }
    },
    
    // Handle keyboard navigation for blind mode
    handleBlindModeKeyboard: function(event) {
        switch (event.key) {
            case ' ':
                // Play/pause audio
                const playPauseButton = document.getElementById('play-pause');
                if (playPauseButton) {
                    playPauseButton.click();
                }
                break;
                
            case 'ArrowUp':
                // Increase volume
                const volumeUpButton = document.getElementById('volume-up');
                if (volumeUpButton) {
                    volumeUpButton.click();
                }
                break;
                
            case 'ArrowDown':
                // Decrease volume
                const volumeDownButton = document.getElementById('volume-down');
                if (volumeDownButton) {
                    volumeDownButton.click();
                }
                break;
                
            case 'g':
            case 'G':
                // Toggle voice guidance
                const voiceGuidanceCheckbox = document.getElementById('voice-guidance');
                if (voiceGuidanceCheckbox) {
                    voiceGuidanceCheckbox.checked = !voiceGuidanceCheckbox.checked;
                    voiceGuidanceCheckbox.dispatchEvent(new Event('change'));
                }
                break;
                
            case 'v':
            case 'V':
                // Toggle vibration
                const vibrationCheckbox = document.getElementById('blind-vibration');
                if (vibrationCheckbox) {
                    vibrationCheckbox.checked = !vibrationCheckbox.checked;
                    vibrationCheckbox.dispatchEvent(new Event('change'));
                }
                break;
                
            case 'Escape':
                // Open settings
                this.navigateToScreen('settings-screen');
                break;
        }
    },
    
    // Handle general keyboard navigation
    handleGeneralKeyboard: function(event) {
        switch (event.key) {
            case 'Escape':
                // Go back
                this.navigateBack();
                break;
                
            case 'Enter':
                // Click continue button if available
                const continueButton = document.querySelector(`#${this.state.currentScreen} [id$="continue-button"]:not([disabled])`);
                if (continueButton) {
                    continueButton.click();
                }
                break;
        }
    },
    
    // Set up touch gestures
    setupTouchGestures: function() {
        let touchStartX = 0;
        let touchStartY = 0;
        
        document.addEventListener('touchstart', (event) => {
            touchStartX = event.touches[0].clientX;
            touchStartY = event.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (event) => {
            const touchEndX = event.changedTouches[0].clientX;
            const touchEndY = event.changedTouches[0].clientY;
            
            const diffX = touchEndX - touchStartX;
            const diffY = touchEndY - touchStartY;
            
            // Detect swipe
            if (Math.abs(diffX) > 100) {
                // Horizontal swipe
                if (diffX > 0) {
                    // Swipe right - go back
                    this.navigateBack();
                }
            }
        });
    },
    
    // Skip to main experience for returning users
    skipToMainExperience: function() {
        // If user has completed onboarding before, skip to main experience
        if (this.state.userPreferences.mode) {
            const targetScreen = this.state.userPreferences.mode === 'deaf' 
                ? 'deaf-mode-screen' 
                : 'blind-mode-screen';
                
            this.navigateToScreen(targetScreen);
        } else {
            // If no mode selected yet, start with mode selection
            this.navigateToScreen('mode-selection-screen');
        }
    },
    
    // Start EEG visualization
    startEEGVisualization: function() {
        const eegCanvas = document.getElementById('eeg-canvas');
        if (!eegCanvas) return;
        
        const ctx = eegCanvas.getContext('2d');
        let time = 0;
        
        function drawEEGWave() {
            // Clear canvas
            ctx.clearRect(0, 0, eegCanvas.width, eegCanvas.height);
            
            // Set line style
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#3498db';
            
            // Start path
            ctx.beginPath();
            ctx.moveTo(0, eegCanvas.height / 2);
            
            // Draw EEG wave
            for (let x = 0; x < eegCanvas.width; x++) {
                let y = eegCanvas.height / 2;
                
                // Combine different frequency waves
                y += Math.sin((x * 0.03) + (time * 0.03)) * 20; // Delta
                y += Math.sin((x * 0.08) + (time * 0.08)) * 15; // Theta
                y += Math.sin((x * 0.12) + (time * 0.12)) * 10; // Alpha
                y += Math.sin((x * 0.25) + (time * 0.25)) * 5;  // Beta
                
                // Add small random noise
                y += (Math.random() - 0.5) * 3;
                
                ctx.lineTo(x, y);
            }
            
            // Stroke the path
            ctx.stroke();
            
            // Update time
            time += 0.1;
            
            // Continue animation if canvas is still in document
            if (document.contains(eegCanvas)) {
                requestAnimationFrame(drawEEGWave);
            }
        }
        
        // Start EEG animation
        drawEEGWave();
    },
    
    // Start match simulation
    startMatchSimulation: function(mode) {
        // Ball position and velocity
        let ballPosition = { x: 50, y: 50 };
        let ballVelocity = { x: 0.5, y: 0.3 };
        
        // Match time
        let matchSeconds = 0;
        
        // Get elements based on mode
        const directionArrow = mode === 'deaf' ? document.getElementById('direction-arrow') : null;
        const soundSource = mode === 'blind' ? document.getElementById('sound-source') : null;
        
        const homeScore = mode === 'deaf' ? document.getElementById('home-score') : document.getElementById('blind-home-score');
        const awayScore = mode === 'deaf' ? document.getElementById('away-score') : document.getElementById('blind-away-score');
        
        const matchTime = mode === 'deaf' ? document.getElementById('match-time') : document.getElementById('blind-match-time');
        
        // Update function
        const updateMatch = () => {
            // Update ball position
            ballPosition.x += ballVelocity.x;
            ballPosition.y += ballVelocity.y;
            
            // Ball collision with boundaries
            if (ballPosition.x < 5 || ballPosition.x > 95) {
                ballVelocity.x = -ballVelocity.x;
                
                // Occasionally score a goal
                if (Math.random() < 0.1) {
                    const isHomeGoal = ballPosition.x < 5;
                    
                    // Update scores
                    if (isHomeGoal && awayScore) {
                        const newAwayScore = parseInt(awayScore.textContent) + 1;
                        awayScore.textContent = newAwayScore;
                        
                        // Announce goal
                        if (mode === 'blind' && this.state.userPreferences.voiceGuidance) {
                            this.announceVoiceGuidance('Goal for away team!');
                        }
                    } else if (!isHomeGoal && homeScore) {
                        const newHomeScore = parseInt(homeScore.textContent) + 1;
                        homeScore.textContent = newHomeScore;
                        
                        // Announce goal
                        if (mode === 'blind' && this.state.userPreferences.voiceGuidance) {
                            this.announceVoiceGuidance('Goal for home team!');
                        }
                    }
                    
                    // Provide haptic feedback for goal
                    if (this.state.userPreferences.vibration && 'vibrate' in navigator) {
                        navigator.vibrate([100, 50, 100, 50, 200]);
                    }
                }
            }
            
            if (ballPosition.y < 5 || ballPosition.y > 95) {
                ballVelocity.y = -ballVelocity.y;
            }
            
            // Occasionally change direction
            if (Math.random() < 0.01) {
                ballVelocity.x = (Math.random() - 0.5) * 1;
                ballVelocity.y = (Math.random() - 0.5) * 1;
            }
            
            // Update direction arrow position for deaf mode
            if (directionArrow) {
                directionArrow.style.left = ballPosition.x + '%';
                directionArrow.style.top = ballPosition.y + '%';
                
                // Update arrow direction based on ball velocity
                const angle = Math.atan2(ballVelocity.y, ballVelocity.x);
                const degrees = angle * (180 / Math.PI);
                
                // Update arrow icon based on direction
                if (Math.abs(degrees) <= 45) {
                    directionArrow.innerHTML = '<i class="fas fa-arrow-right"></i>';
                } else if (Math.abs(degrees) >= 135) {
                    directionArrow.innerHTML = '<i class="fas fa-arrow-left"></i>';
                } else if (degrees > 45 && degrees < 135) {
                    directionArrow.innerHTML = '<i class="fas fa-arrow-down"></i>';
                } else {
                    directionArrow.innerHTML = '<i class="fas fa-arrow-up"></i>';
                }
            }
            
            // Update sound source position for blind mode
            if (soundSource) {
                soundSource.style.left = ballPosition.x + '%';
                soundSource.style.top = ballPosition.y + '%';
            }
            
            // Update match time
            matchSeconds++;
            const minutes = Math.floor(matchSeconds / 60);
            const seconds = matchSeconds % 60;
            const timeString = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
            
            if (matchTime) {
                matchTime.textContent = timeString;
            }
            
            // Continue animation if elements are still in document
            if ((mode === 'deaf' && document.contains(directionArrow)) || 
                (mode === 'blind' && document.contains(soundSource))) {
                requestAnimationFrame(updateMatch);
            }
        };
        
        // Start match simulation
        updateMatch();
    },
    
    // Voice guidance announcement
    announceVoiceGuidance: function(message) {
        const voiceAnnouncement = document.getElementById('voice-announcement');
        const announcementText = document.getElementById('announcement-text');
        
        if (!voiceAnnouncement || !announcementText) return;
        
        // Update announcement text
        announcementText.textContent = message;
        voiceAnnouncement.style.display = 'block';
        
        // Use speech synthesis if available
        if ('speechSynthesis' in window) {
            const speech = new SpeechSynthesisUtterance(message);
            speech.rate = 1.2; // Slightly faster than normal
            speech.pitch = 1.0;
            speech.volume = 1.0;
            window.speechSynthesis.speak(speech);
        }
        
        // Hide announcement after 2 seconds
        setTimeout(function() {
            voiceAnnouncement.style.display = 'none';
        }, 2000);
    },
    
    // Provide feedback for screen change
    provideFeedback: function() {
        // Provide haptic feedback if enabled
        if (this.state.userPreferences.vibration && 'vibrate' in navigator) {
            navigator.vibrate(50);
        }
    }
};

// Initialize app flow when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize app flow
    window.appFlow = AppFlow.initialize();
});
