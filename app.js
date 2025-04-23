// Main Application JavaScript for Unified Accessibility App

// Global state
const appState = {
    currentScreen: 'welcome-screen',
    selectedMode: null,
    selectedTeam: null,
    eegConnected: false,
    matchInProgress: false,
    volume: 3,
    teams: [
        { id: 1, name: 'Manchester United', logo: 'assets/teams/manchester_united.png' },
        { id: 2, name: 'Barcelona', logo: 'assets/teams/barcelona.png' },
        { id: 3, name: 'Real Madrid', logo: 'assets/teams/real_madrid.png' },
        { id: 4, name: 'Bayern Munich', logo: 'assets/teams/bayern_munich.png' },
        { id: 5, name: 'Liverpool', logo: 'assets/teams/liverpool.png' },
        { id: 6, name: 'Juventus', logo: 'assets/teams/juventus.png' },
        { id: 7, name: 'PSG', logo: 'assets/teams/psg.png' },
        { id: 8, name: 'Manchester City', logo: 'assets/teams/manchester_city.png' },
        { id: 9, name: 'Chelsea', logo: 'assets/teams/chelsea.png' },
        { id: 10, name: 'Arsenal', logo: 'assets/teams/arsenal.png' },
        { id: 11, name: 'AC Milan', logo: 'assets/teams/ac_milan.png' },
        { id: 12, name: 'Inter Milan', logo: 'assets/teams/inter_milan.png' }
    ]
};

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize welcome screen
    initWelcomeScreen();
    
    // Initialize mode selection
    initModeSelection();
    
    // Initialize team selection
    initTeamSelection();
    
    // Initialize EEG connection
    initEEGConnection();
    
    // Initialize deaf mode experience
    initDeafMode();
    
    // Initialize blind mode experience
    initBlindMode();
    
    // Initialize settings
    initSettings();
    
    // Initialize navigation
    initNavigation();
    
    // Create placeholder welcome image
    createWelcomeImagePlaceholder();
});

// Navigation between screens
function navigateToScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show the target screen
    document.getElementById(screenId).classList.add('active');
    
    // Update current screen in state
    appState.currentScreen = screenId;
    
    // Special handling for specific screens
    if (screenId === 'deaf-mode-screen' || screenId === 'blind-mode-screen') {
        document.getElementById('nav-bar').style.display = 'flex';
        startMatchSimulation();
    } else {
        document.getElementById('nav-bar').style.display = 'none';
    }
}

// Initialize welcome screen
function initWelcomeScreen() {
    const getStartedButton = document.getElementById('get-started-button');
    
    getStartedButton.addEventListener('click', function() {
        navigateToScreen('mode-selection-screen');
    });
}

// Initialize mode selection
function initModeSelection() {
    const deafModeCard = document.getElementById('deaf-mode-card');
    const blindModeCard = document.getElementById('blind-mode-card');
    const continueButton = document.getElementById('mode-continue-button');
    
    deafModeCard.addEventListener('click', function() {
        deafModeCard.classList.add('selected');
        blindModeCard.classList.remove('selected');
        appState.selectedMode = 'deaf';
        continueButton.disabled = false;
    });
    
    blindModeCard.addEventListener('click', function() {
        blindModeCard.classList.add('selected');
        deafModeCard.classList.remove('selected');
        appState.selectedMode = 'blind';
        continueButton.disabled = false;
    });
    
    continueButton.addEventListener('click', function() {
        navigateToScreen('team-selection-screen');
    });
}

// Initialize team selection
function initTeamSelection() {
    const teamsGrid = document.getElementById('teams-grid');
    const teamSearch = document.getElementById('team-search');
    const continueButton = document.getElementById('team-continue-button');
    
    // Populate teams grid
    function populateTeams(teams) {
        teamsGrid.innerHTML = '';
        
        teams.forEach(team => {
            const teamCard = document.createElement('div');
            teamCard.className = 'team-card';
            teamCard.dataset.teamId = team.id;
            
            // Create placeholder for team logo if needed
            let logoElement;
            if (team.logo.startsWith('assets/')) {
                logoElement = document.createElement('div');
                logoElement.className = 'team-logo-placeholder';
                logoElement.style.backgroundColor = getRandomColor();
                logoElement.textContent = team.name.charAt(0);
            } else {
                logoElement = document.createElement('img');
                logoElement.src = team.logo;
                logoElement.alt = team.name;
                logoElement.className = 'team-logo';
            }
            
            const teamName = document.createElement('div');
            teamName.className = 'team-name';
            teamName.textContent = team.name;
            
            teamCard.appendChild(logoElement);
            teamCard.appendChild(teamName);
            
            teamCard.addEventListener('click', function() {
                // Remove selected class from all team cards
                document.querySelectorAll('.team-card').forEach(card => {
                    card.classList.remove('selected');
                });
                
                // Add selected class to clicked card
                teamCard.classList.add('selected');
                
                // Update selected team in state
                appState.selectedTeam = team;
                
                // Enable continue button
                continueButton.disabled = false;
            });
            
            teamsGrid.appendChild(teamCard);
        });
    }
    
    // Initial population of teams
    populateTeams(appState.teams);
    
    // Team search functionality
    teamSearch.addEventListener('input', function() {
        const searchTerm = teamSearch.value.toLowerCase();
        
        const filteredTeams = appState.teams.filter(team => 
            team.name.toLowerCase().includes(searchTerm)
        );
        
        populateTeams(filteredTeams);
    });
    
    // Continue button
    continueButton.addEventListener('click', function() {
        navigateToScreen('eeg-connection-screen');
    });
}

// Initialize EEG connection
function initEEGConnection() {
    const eegStatusIcon = document.getElementById('eeg-status-icon');
    const eegStatusText = document.getElementById('eeg-status-text');
    const skipButton = document.getElementById('skip-eeg-button');
    const continueButton = document.getElementById('eeg-continue-button');
    const eegCanvas = document.getElementById('eeg-canvas');
    
    // Simulate EEG connection
    setTimeout(function() {
        eegStatusIcon.className = 'fas fa-check-circle';
        eegStatusText.textContent = 'EEG device connected successfully';
        appState.eegConnected = true;
        continueButton.disabled = false;
        
        // Start EEG visualization
        if (eegCanvas) {
            initEEGVisualization(eegCanvas);
        }
    }, 3000);
    
    // Skip button
    skipButton.addEventListener('click', function() {
        if (appState.selectedMode === 'deaf') {
            navigateToScreen('deaf-mode-screen');
        } else {
            navigateToScreen('blind-mode-screen');
        }
    });
    
    // Continue button
    continueButton.addEventListener('click', function() {
        if (appState.selectedMode === 'deaf') {
            navigateToScreen('deaf-mode-screen');
        } else {
            navigateToScreen('blind-mode-screen');
        }
    });
}

// Initialize deaf mode experience
function initDeafMode() {
    const arrowSizeSlider = document.getElementById('arrow-size');
    const arrowSpeedSlider = document.getElementById('arrow-speed');
    const highContrastCheckbox = document.getElementById('high-contrast');
    const vibrationCheckbox = document.getElementById('deaf-vibration');
    const directionArrow = document.getElementById('direction-arrow');
    const footballField = document.getElementById('deaf-football-field');
    
    // Update team information
    if (appState.selectedTeam) {
        document.getElementById('home-team-name').textContent = appState.selectedTeam.name;
        // Set team logo if available
        if (appState.selectedTeam.logo) {
            document.getElementById('home-team-logo').src = appState.selectedTeam.logo;
        }
    }
    
    // Arrow size control
    if (arrowSizeSlider) {
        arrowSizeSlider.addEventListener('input', function() {
            const size = 30 + (arrowSizeSlider.value * 5);
            directionArrow.style.width = size + 'px';
            directionArrow.style.height = size + 'px';
        });
    }
    
    // High contrast mode
    if (highContrastCheckbox) {
        highContrastCheckbox.addEventListener('change', function() {
            document.body.classList.toggle('high-contrast', highContrastCheckbox.checked);
        });
    }
    
    // Initialize football field elements
    if (footballField) {
        initFootballField(footballField);
    }
}

// Initialize blind mode experience
function initBlindMode() {
    const audioIntensitySlider = document.getElementById('audio-intensity');
    const spatialPrecisionSlider = document.getElementById('spatial-precision');
    const voiceGuidanceCheckbox = document.getElementById('voice-guidance');
    const vibrationCheckbox = document.getElementById('blind-vibration');
    const volumeDownButton = document.getElementById('volume-down');
    const playPauseButton = document.getElementById('play-pause');
    const volumeUpButton = document.getElementById('volume-up');
    const audioVisualization = document.getElementById('audio-visualization');
    const soundSource = document.getElementById('sound-source');
    
    // Update team information
    if (appState.selectedTeam) {
        document.getElementById('blind-home-team-name').textContent = appState.selectedTeam.name;
    }
    
    // Volume controls
    if (volumeDownButton) {
        volumeDownButton.addEventListener('click', function() {
            if (appState.volume > 1) {
                appState.volume--;
                audioIntensitySlider.value = appState.volume;
                
                // Provide feedback
                if (vibrationCheckbox.checked && 'vibrate' in navigator) {
                    navigator.vibrate(50);
                }
                
                announceVoiceGuidance('Volume decreased');
            }
        });
    }
    
    if (volumeUpButton) {
        volumeUpButton.addEventListener('click', function() {
            if (appState.volume < 5) {
                appState.volume++;
                audioIntensitySlider.value = appState.volume;
                
                // Provide feedback
                if (vibrationCheckbox.checked && 'vibrate' in navigator) {
                    navigator.vibrate(50);
                }
                
                announceVoiceGuidance('Volume increased');
            }
        });
    }
    
    if (playPauseButton) {
        playPauseButton.addEventListener('click', function() {
            const icon = playPauseButton.querySelector('i');
            
            if (icon.classList.contains('fa-pause')) {
                icon.classList.remove('fa-pause');
                icon.classList.add('fa-play');
                announceVoiceGuidance('Audio paused');
            } else {
                icon.classList.remove('fa-play');
                icon.classList.add('fa-pause');
                announceVoiceGuidance('Audio resumed');
            }
            
            // Provide haptic feedback
            if (vibrationCheckbox.checked && 'vibrate' in navigator) {
                navigator.vibrate(100);
            }
        });
    }
    
    // Initialize audio visualization
    if (audioVisualization) {
        initAudioVisualization(audioVisualization);
    }
    
    // Initial voice guidance
    setTimeout(function() {
        if (voiceGuidanceCheckbox.checked) {
            announceVoiceGuidance('Blind mode activated. 3D spatial audio is now tracking the ball.');
        }
    }, 1000);
}

// Initialize settings
function initSettings() {
    const settingsButton = document.getElementById('settings-button');
    const accessibilityModeSelect = document.getElementById('accessibility-mode');
    const favoriteTeamSelect = document.getElementById('favorite-team');
    const resetButton = document.getElementById('reset-settings');
    const saveButton = document.getElementById('save-settings');
    
    // Open settings
    if (settingsButton) {
        settingsButton.addEventListener('click', function() {
            navigateToScreen('settings-screen');
        });
    }
    
    // Populate favorite team dropdown
    if (favoriteTeamSelect) {
        appState.teams.forEach(team => {
            const option = document.createElement('option');
            option.value = team.id;
            option.textContent = team.name;
            favoriteTeamSelect.appendChild(option);
        });
    }
    
    // Set current values
    if (accessibilityModeSelect && appState.selectedMode) {
        accessibilityModeSelect.value = appState.selectedMode;
    }
    
    if (favoriteTeamSelect && appState.selectedTeam) {
        favoriteTeamSelect.value = appState.selectedTeam.id;
    }
    
    // Save settings
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            // Update mode
            appState.selectedMode = accessibilityModeSelect.value;
            
            // Update team
            const selectedTeamId = parseInt(favoriteTeamSelect.value);
            appState.selectedTeam = appState.teams.find(team => team.id === selectedTeamId);
            
            // Return to previous screen
            navigateToScreen(appState.currentScreen);
        });
    }
    
    // Reset settings
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            accessibilityModeSelect.value = 'deaf';
            favoriteTeamSelect.selectedIndex = 0;
        });
    }
}

// Initialize navigation
function initNavigation() {
    const homeNav = document.getElementById('home-nav');
    const matchesNav = document.getElementById('matches-nav');
    const teamsNav = document.getElementById('teams-nav');
    const profileNav = document.getElementById('profile-nav');
    
    // Hide navigation bar initially
    document.getElementById('nav-bar').style.display = 'none';
    
    // Home navigation
    if (homeNav) {
        homeNav.addEventListener('click', function() {
            navigateToScreen('welcome-screen');
        });
    }
    
    // Teams navigation
    if (teamsNav) {
        teamsNav.addEventListener('click', function() {
            navigateToScreen('team-selection-screen');
        });
    }
}

// EEG Visualization
function initEEGVisualization(canvas) {
    const ctx = canvas.getContext('2d');
    let time = 0;
    
    function drawEEGWave() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Set line style
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#3498db';
        
        // Start path
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        
        // Draw EEG wave
        for (let x = 0; x < canvas.width; x++) {
            let y = canvas.height / 2;
            
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
        
        // Continue animation
        requestAnimationFrame(drawEEGWave);
    }
    
    // Start EEG animation
    drawEEGWave();
}

// Audio Visualization
function initAudioVisualization(canvas) {
    const ctx = canvas.getContext('2d');
    let audioTime = 0;
    
    function drawAudioVisualization() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw audio visualization
        const barCount = 64;
        const barWidth = canvas.width / barCount;
        
        for (let i = 0; i < barCount; i++) {
            // Calculate bar height based on position
            const barPosition = i / barCount; // 0 to 1
            
            // Base height plus position-based variation
            let barHeight = canvas.height * 0.2; // Base height
            
            // Add wave effect
            barHeight += Math.sin((i * 0.2) + audioTime * 0.1) * 10;
            
            // Add volume effect
            barHeight *= appState.volume / 3;
            
            // Create gradient
            const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
            gradient.addColorStop(0, '#f1c40f');
            gradient.addColorStop(1, '#f39c12');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 1, barHeight);
        }
        
        audioTime += 0.1;
        
        // Continue animation
        requestAnimationFrame(drawAudioVisualization);
    }
    
    // Start audio visualization
    drawAudioVisualization();
}

// Football Field Initialization
function initFootballField(fieldElement) {
    // Add field markings
    const centerCircle = document.createElement('div');
    centerCircle.className = 'field-marking center-circle';
    fieldElement.appendChild(centerCircle);
    
    const leftPenaltyArea = document.createElement('div');
    leftPenaltyArea.className = 'field-marking left-penalty-area';
    fieldElement.appendChild(leftPenaltyArea);
    
    const rightPenaltyArea = document.createElement('div');
    rightPenaltyArea.className = 'field-marking right-penalty-area';
    fieldElement.appendChild(rightPenaltyArea);
    
    const leftGoal = document.createElement('div');
    leftGoal.className = 'field-marking left-goal';
    fieldElement.appendChild(leftGoal);
    
    const rightGoal = document.createElement('div');
    rightGoal.className = 'field-marking right-goal';
    fieldElement.appendChild(rightGoal);
    
    // Add players
    for (let i = 0; i < 22; i++) {
        const player = document.createElement('div');
        player.className = i < 11 ? 'player team-a' : 'player team-b';
        player.style.left = (i < 11 ? 20 + Math.random() * 30 : 50 + Math.random() * 30) + '%';
        player.style.top = (10 + Math.random() * 80) + '%';
        fieldElement.appendChild(player);
    }
    
    // Add ball
    const ball = document.createElement('div');
    ball.className = 'ball';
    ball.style.left = '50%';
    ball.style.top = '50%';
    fieldElement.appendChild(ball);
}

// Start match simulation
function startMatchSimulation() {
    if (appState.matchInProgress) return;
    
    appState.matchInProgress = true;
    
    // Get elements
    const directionArrow = document.getElementById('direction-arrow');
    const soundSource = document.getElementById('sound-source');
    const homeScore = document.getElementById('home-score');
    const awayScore = document.getElementById('away-score');
    const blindHomeScore = document.getElementById('blind-home-score');
    const blindAwayScore = document.getElementById('blind-away-score');
    const matchTime = document.getElementById('match-time');
    const blindMatchTime = document.getElementById('blind-match-time');
    
    // Ball position and velocity
    let ballPosition = { x: 50, y: 50 };
    let ballVelocity = { x: 0.5, y: 0.3 };
    
    // Match time
    let matchSeconds = 0;
    
    // Update function
    function updateMatch() {
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
                if (isHomeGoal) {
                    const newAwayScore = parseInt(awayScore.textContent) + 1;
                    awayScore.textContent = newAwayScore;
                    if (blindAwayScore) blindAwayScore.textContent = newAwayScore;
                    
                    // Announce goal
                    announceVoiceGuidance('Goal for away team!');
                } else {
                    const newHomeScore = parseInt(homeScore.textContent) + 1;
                    homeScore.textContent = newHomeScore;
                    if (blindHomeScore) blindHomeScore.textContent = newHomeScore;
                    
                    // Announce goal
                    announceVoiceGuidance('Goal for home team!');
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
        
        // Update direction arrow position
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
        
        // Update sound source position
        if (soundSource) {
            soundSource.style.left = ballPosition.x + '%';
            soundSource.style.top = ballPosition.y + '%';
        }
        
        // Update match time
        matchSeconds++;
        const minutes = Math.floor(matchSeconds / 60);
        const seconds = matchSeconds % 60;
        const timeString = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
        
        if (matchTime) matchTime.textContent = timeString;
        if (blindMatchTime) blindMatchTime.textContent = timeString;
        
        // Continue animation
        requestAnimationFrame(updateMatch);
    }
    
    // Start match simulation
    updateMatch();
}

// Voice guidance announcement
function announceVoiceGuidance(message) {
    const voiceAnnouncement = document.getElementById('voice-announcement');
    const announcementText = document.getElementById('announcement-text');
    
    if (!voiceAnnouncement || !announcementText) return;
    
    // Check if voice guidance is enabled
    const voiceGuidanceCheckbox = document.getElementById('voice-guidance');
    if (voiceGuidanceCheckbox && !voiceGuidanceCheckbox.checked) return;
    
    // Update announcement text
    announcementText.textContent = message;
    voiceAnnouncement.style.display = 'block';
    
    // Use speech synthesis if available
    if ('speechSynthesis' in window) {
        const speech = new SpeechSynthesisUtterance(message);
        speech.rate = 1.2; // Slightly faster than normal
        speech.pitch = 1.0;
        speech.volume = appState.volume / 5;
        window.speechSynthesis.speak(speech);
    }
    
    // Hide announcement after 2 seconds
    setTimeout(function() {
        voiceAnnouncement.style.display = 'none';
    }, 2000);
}

// Create welcome image placeholder
function createWelcomeImagePlaceholder() {
    const welcomeImagePlaceholder = document.getElementById('welcome-image-placeholder');
    
    if (welcomeImagePlaceholder) {
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');
        
        // Draw background
        ctx.fillStyle = '#f5f7fa';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw football field
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(50, 50, 200, 100);
        
        // Draw center circle
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(150, 100, 20, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw center line
        ctx.beginPath();
        ctx.moveTo(150, 50);
        ctx.lineTo(150, 150);
        ctx.stroke();
        
        // Draw football
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath();
        ctx.arc(150, 100, 10, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw accessibility symbols
        // Ear symbol
        ctx.fillStyle = '#9b59b6';
        ctx.beginPath();
        ctx.arc(100, 100, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = '15px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('👁️', 100, 100);
        
        // Eye symbol
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath();
        ctx.arc(200, 100, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = '15px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('👂', 200, 100);
        
        // Replace image with canvas
        welcomeImagePlaceholder.src = canvas.toDataURL();
    }
}

// Utility function to get random color
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
