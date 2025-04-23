// EEG and Video Analysis Components for Unified Accessibility Platform

// EEG Analysis Module
const EEGAnalysis = {
    // Configuration
    config: {
        sampleRate: 250, // Hz
        channelCount: 8,
        bufferSize: 1000,
        emotionThresholds: {
            excitement: 0.6,
            focus: 0.7,
            stress: 0.4
        }
    },
    
    // State
    state: {
        connected: false,
        recording: false,
        buffer: [],
        emotions: {
            excitement: 0,
            focus: 0,
            stress: 0
        },
        lastUpdate: 0
    },
    
    // Initialize EEG module
    initialize: function(canvasElement) {
        this.canvas = canvasElement;
        this.ctx = canvasElement.getContext('2d');
        
        // Set up canvas
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Start simulation
        this.simulateConnection();
        
        return this;
    },
    
    // Resize canvas to fit container
    resizeCanvas: function() {
        if (!this.canvas) return;
        
        const container = this.canvas.parentElement;
        this.canvas.width = container.offsetWidth;
        this.canvas.height = container.offsetHeight;
    },
    
    // Simulate EEG device connection
    simulateConnection: function() {
        // Update status in UI
        const statusIcon = document.getElementById('eeg-status-icon');
        const statusText = document.getElementById('eeg-status-text');
        
        if (statusIcon && statusText) {
            statusIcon.className = 'fas fa-spinner fa-spin';
            statusText.textContent = 'Searching for EEG devices...';
        }
        
        // Simulate connection delay
        setTimeout(() => {
            this.state.connected = true;
            
            if (statusIcon && statusText) {
                statusIcon.className = 'fas fa-check-circle';
                statusText.textContent = 'EEG device connected successfully';
            }
            
            // Enable continue button
            const continueButton = document.getElementById('eeg-continue-button');
            if (continueButton) {
                continueButton.disabled = false;
            }
            
            // Start data simulation
            this.startDataSimulation();
        }, 3000);
    },
    
    // Start simulating EEG data
    startDataSimulation: function() {
        this.state.recording = true;
        this.state.lastUpdate = Date.now();
        
        // Start animation loop
        this.animateEEG();
        
        // Update emotions periodically
        this.emotionUpdateInterval = setInterval(() => {
            this.updateEmotions();
        }, 1000);
    },
    
    // Stop data simulation
    stopDataSimulation: function() {
        this.state.recording = false;
        clearInterval(this.emotionUpdateInterval);
    },
    
    // Generate simulated EEG data
    generateData: function(time) {
        const data = [];
        
        // Base frequencies for different brain waves
        const delta = Math.sin(time * 0.5) * 20; // 0.5-4 Hz
        const theta = Math.sin(time * 1.5) * 15; // 4-8 Hz
        const alpha = Math.sin(time * 2.5) * 10; // 8-13 Hz
        const beta = Math.sin(time * 5.0) * 5;   // 13-30 Hz
        
        // Combine waves with some noise
        const value = delta + theta + alpha + beta + (Math.random() - 0.5) * 5;
        
        return value;
    },
    
    // Animate EEG visualization
    animateEEG: function() {
        if (!this.state.recording || !this.canvas) return;
        
        const now = Date.now();
        const elapsed = (now - this.state.lastUpdate) / 1000;
        this.state.lastUpdate = now;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Set line style
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = '#3498db';
        
        // Start path
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.canvas.height / 2);
        
        // Generate and draw data points
        for (let x = 0; x < this.canvas.width; x++) {
            const time = x * 0.05 + now * 0.001;
            const value = this.generateData(time);
            const y = this.canvas.height / 2 + value;
            
            this.ctx.lineTo(x, y);
        }
        
        // Stroke the path
        this.ctx.stroke();
        
        // Continue animation
        requestAnimationFrame(() => this.animateEEG());
    },
    
    // Update emotion values based on EEG data
    updateEmotions: function() {
        // In a real application, this would analyze the EEG data
        // For this prototype, we'll simulate changing emotions
        
        const time = Date.now() * 0.001;
        
        // Generate emotion values with some randomness and periodicity
        this.state.emotions.excitement = 0.5 + Math.sin(time * 0.1) * 0.3 + Math.random() * 0.1;
        this.state.emotions.focus = 0.6 + Math.cos(time * 0.07) * 0.2 + Math.random() * 0.1;
        this.state.emotions.stress = 0.3 + Math.sin(time * 0.15) * 0.2 + Math.random() * 0.1;
        
        // Clamp values between 0 and 1
        Object.keys(this.state.emotions).forEach(emotion => {
            this.state.emotions[emotion] = Math.max(0, Math.min(1, this.state.emotions[emotion]));
        });
        
        // Update UI if emotion indicators exist
        this.updateEmotionUI();
        
        return this.state.emotions;
    },
    
    // Update emotion indicators in UI
    updateEmotionUI: function() {
        const emotions = ['excitement', 'focus', 'stress'];
        
        emotions.forEach(emotion => {
            const element = document.getElementById(`${emotion}-level`);
            if (element) {
                element.style.width = `${this.state.emotions[emotion] * 100}%`;
            }
        });
    },
    
    // Get current emotion state
    getEmotions: function() {
        return {...this.state.emotions};
    }
};

// Video Analysis Module
const VideoAnalysis = {
    // Configuration
    config: {
        detectionThreshold: 0.7,
        trackingInterval: 50, // ms
        objectClasses: ['ball', 'player', 'referee', 'goal']
    },
    
    // State
    state: {
        active: false,
        detectedObjects: [],
        ballPosition: { x: 0.5, y: 0.5 },
        ballVelocity: { x: 0.005, y: 0.003 },
        players: [],
        fps: 0,
        frameCount: 0,
        lastFpsUpdate: 0
    },
    
    // Initialize video analysis
    initialize: function(canvasElement) {
        this.canvas = canvasElement;
        this.ctx = canvasElement.getContext('2d');
        
        // Set up canvas
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Initialize players
        this.initializePlayers();
        
        return this;
    },
    
    // Resize canvas to fit container
    resizeCanvas: function() {
        if (!this.canvas) return;
        
        const container = this.canvas.parentElement;
        this.canvas.width = container.offsetWidth;
        this.canvas.height = container.offsetHeight;
    },
    
    // Initialize player positions
    initializePlayers: function() {
        this.state.players = [];
        
        // Create 22 players (11 per team)
        for (let i = 0; i < 22; i++) {
            const team = i < 11 ? 'A' : 'B';
            const x = team === 'A' ? 0.3 + Math.random() * 0.2 : 0.5 + Math.random() * 0.2;
            const y = 0.1 + Math.random() * 0.8;
            
            this.state.players.push({
                id: i,
                team: team,
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 0.002,
                vy: (Math.random() - 0.5) * 0.002,
                detected: false
            });
        }
    },
    
    // Start video analysis
    start: function() {
        this.state.active = true;
        this.state.lastFpsUpdate = Date.now();
        this.state.frameCount = 0;
        
        // Start animation loop
        this.animate();
        
        return this;
    },
    
    // Stop video analysis
    stop: function() {
        this.state.active = false;
        return this;
    },
    
    // Animation loop
    animate: function() {
        if (!this.state.active || !this.canvas) return;
        
        // Update positions
        this.updatePositions();
        
        // Draw frame
        this.drawFrame();
        
        // Simulate object detection
        this.detectObjects();
        
        // Update FPS counter
        this.updateFps();
        
        // Continue animation
        requestAnimationFrame(() => this.animate());
    },
    
    // Update positions of ball and players
    updatePositions: function() {
        // Update ball position
        this.state.ballPosition.x += this.state.ballVelocity.x;
        this.state.ballPosition.y += this.state.ballVelocity.y;
        
        // Ball collision with boundaries
        if (this.state.ballPosition.x < 0.05 || this.state.ballPosition.x > 0.95) {
            this.state.ballVelocity.x = -this.state.ballVelocity.x;
        }
        if (this.state.ballPosition.y < 0.05 || this.state.ballPosition.y > 0.95) {
            this.state.ballVelocity.y = -this.state.ballVelocity.y;
        }
        
        // Update player positions
        for (const player of this.state.players) {
            // Move players
            player.x += player.vx;
            player.y += player.vy;
            
            // Player collision with boundaries
            if (player.x < 0.05 || player.x > 0.95) {
                player.vx = -player.vx;
            }
            if (player.y < 0.05 || player.y > 0.95) {
                player.vy = -player.vy;
            }
            
            // Occasionally change direction
            if (Math.random() < 0.02) {
                player.vx = (Math.random() - 0.5) * 0.002;
                player.vy = (Math.random() - 0.5) * 0.002;
            }
            
            // Players are attracted to the ball
            const dx = this.state.ballPosition.x - player.x;
            const dy = this.state.ballPosition.y - player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 0.3) {
                player.vx += dx * 0.0001;
                player.vy += dy * 0.0001;
            }
        }
    },
    
    // Draw current frame
    drawFrame: function() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw field
        this.drawField();
        
        // Draw players
        this.drawPlayers();
        
        // Draw ball
        this.drawBall();
        
        // Draw detection boxes
        this.drawDetectionBoxes();
    },
    
    // Draw football field
    drawField: function() {
        // Draw field background
        this.ctx.fillStyle = '#4CAF50';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw field lines
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        this.ctx.lineWidth = 2;
        
        // Center line
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, 0);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
        this.ctx.stroke();
        
        // Center circle
        this.ctx.beginPath();
        this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, this.canvas.height / 5, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // Penalty areas
        this.ctx.strokeRect(0, this.canvas.height / 4, this.canvas.width / 5, this.canvas.height / 2);
        this.ctx.strokeRect(this.canvas.width - this.canvas.width / 5, this.canvas.height / 4, this.canvas.width / 5, this.canvas.height / 2);
    },
    
    // Draw players
    drawPlayers: function() {
        for (const player of this.state.players) {
            // Draw player dot
            this.ctx.beginPath();
            this.ctx.arc(
                player.x * this.canvas.width, 
                player.y * this.canvas.height, 
                4, 
                0, 
                Math.PI * 2
            );
            this.ctx.fillStyle = player.team === 'A' ? '#3498db' : '#e74c3c';
            this.ctx.fill();
        }
    },
    
    // Draw ball
    drawBall: function() {
        this.ctx.beginPath();
        this.ctx.arc(
            this.state.ballPosition.x * this.canvas.width,
            this.state.ballPosition.y * this.canvas.height,
            6,
            0,
            Math.PI * 2
        );
        this.ctx.fillStyle = '#f1c40f';
        this.ctx.fill();
    },
    
    // Simulate object detection
    detectObjects: function() {
        // Simulate detection probability
        const detectionProbability = 0.8 + Math.sin(this.state.frameCount * 0.01) * 0.1;
        
        // Detect players
        let detectedPlayerCount = 0;
        for (const player of this.state.players) {
            // Simulate detection with some randomness
            player.detected = Math.random() < detectionProbability;
            if (player.detected) {
                detectedPlayerCount++;
            }
        }
        
        // Detect ball
        const ballDetected = Math.random() < detectionProbability;
        
        // Update detection stats in UI
        this.updateDetectionStats(ballDetected, detectedPlayerCount);
        
        // Update frame counter
        this.state.frameCount++;
    },
    
    // Draw detection boxes
    drawDetectionBoxes: function() {
        // Draw detected player boxes
        for (const player of this.state.players) {
            if (player.detected) {
                const x = player.x * this.canvas.width;
                const y = player.y * this.canvas.height;
                
                // Draw bounding box
                this.ctx.strokeStyle = player.team === 'A' ? 'rgba(52, 152, 219, 0.8)' : 'rgba(231, 76, 60, 0.8)';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(x - 15, y - 30, 30, 60);
                
                // Draw label background
                this.ctx.fillStyle = player.team === 'A' ? 'rgba(52, 152, 219, 0.8)' : 'rgba(231, 76, 60, 0.8)';
                this.ctx.fillRect(x - 15, y - 45, 30, 15);
                
                // Draw label text
                this.ctx.fillStyle = 'white';
                this.ctx.font = '10px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText('P' + player.id, x, y - 35);
            }
        }
        
        // Draw ball detection box if detected
        if (document.getElementById('ball-status')?.textContent === 'Detected') {
            const x = this.state.ballPosition.x * this.canvas.width;
            const y = this.state.ballPosition.y * this.canvas.height;
            
            // Draw bounding box
            this.ctx.strokeStyle = 'rgba(241, 196, 15, 0.8)';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(x - 10, y - 10, 20, 20);
            
            // Draw label background
            this.ctx.fillStyle = 'rgba(241, 196, 15, 0.8)';
            this.ctx.fillRect(x - 10, y - 25, 20, 15);
            
            // Draw label text
            this.ctx.fillStyle = 'black';
            this.ctx.font = '10px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Ball', x, y - 15);
        }
    },
    
    // Update detection stats in UI
    updateDetectionStats: function(ballDetected, playerCount) {
        const ballStatus = document.getElementById('ball-status');
        const playersCount = document.getElementById('players-count');
        const fieldStatus = document.getElementById('field-status');
        const fpsCounter = document.getElementById('fps-counter');
        
        if (ballStatus) {
            ballStatus.textContent = ballDetected ? 'Detected' : 'Searching...';
        }
        
        if (playersCount) {
            playersCount.textContent = playerCount + ' Detected';
        }
        
        if (fieldStatus) {
            fieldStatus.textContent = Math.random() < 0.9 ? 'Mapped' : 'Mapping...';
        }
        
        if (fpsCounter) {
            fpsCounter.textContent = this.state.fps.toString();
        }
    },
    
    // Update FPS counter
    updateFps: function() {
        const now = Date.now();
        const elapsed = now - this.state.lastFpsUpdate;
        
        if (elapsed >= 1000) {
            this.state.fps = Math.round(this.state.frameCount * 1000 / elapsed);
            this.state.frameCount = 0;
            this.state.lastFpsUpdate = now;
        }
    },
    
    // Get current ball position and velocity
    getBallData: function() {
        return {
            position: {...this.state.ballPosition},
            velocity: {...this.state.ballVelocity}
        };
    }
};

// Fusion Engine Module
const FusionEngine = {
    // Configuration
    config: {
        updateInterval: 50, // ms
        emotionWeights: {
            excitement: 0.4,
            focus: 0.3,
            stress: 0.3
        }
    },
    
    // State
    state: {
        active: false,
        mode: null, // 'deaf' or 'blind'
        outputData: null,
        processingProgress: 0
    },
    
    // Initialize fusion engine
    initialize: function(eegModule, videoModule, mode) {
        this.eegModule = eegModule;
        this.videoModule = videoModule;
        this.state.mode = mode;
        
        return this;
    },
    
    // Start fusion engine
    start: function() {
        this.state.active = true;
        this.state.processingProgress = 0;
        
        // Simulate processing progress
        this.progressInterval = setInterval(() => {
            this.state.processingProgress += 2;
            this.updateProgressUI();
            
            if (this.state.processingProgress >= 100) {
                clearInterval(this.progressInterval);
                this.onProcessingComplete();
            }
        }, 100);
        
        return this;
    },
    
    // Stop fusion engine
    stop: function() {
        this.state.active = false;
        clearInterval(this.progressInterval);
        return this;
    },
    
    // Update progress UI
    updateProgressUI: function() {
        const progressBar = document.getElementById('loading-progress');
        if (progressBar) {
            progressBar.style.width = this.state.processingProgress + '%';
        }
    },
    
    // Processing complete callback
    onProcessingComplete: function() {
        // Enable continue button
        const continueButton = document.getElementById('eeg-continue-button');
        if (continueButton) {
            continueButton.disabled = false;
        }
        
        // Start real-time fusion
        this.startRealTimeFusion();
    },
    
    // Start real-time fusion of EEG and video data
    startRealTimeFusion: function() {
        this.fusionInterval = setInterval(() => {
            if (!this.state.active) return;
            
            // Get data from modules
            const emotions = this.eegModule.getEmotions();
            const ballData = this.videoModule.getBallData();
            
            // Process data based on mode
            if (this.state.mode === 'deaf') {
                this.processDeafModeOutput(emotions, ballData);
            } else if (this.state.mode === 'blind') {
                this.processBlindModeOutput(emotions, ballData);
            }
        }, this.config.updateInterval);
    },
    
    // Process output for deaf mode
    processDeafModeOutput: function(emotions, ballData) {
        // In a real application, we would use emotions to modify the visual feedback
        // For this prototype, we'll just pass through the ball data
        
        // Calculate emotional impact
        const excitementFactor = emotions.excitement * this.config.emotionWeights.excitement;
        const focusFactor = emotions.focus * this.config.emotionWeights.focus;
        const stressFactor = emotions.stress * this.config.emotionWeights.stress;
        
        // Modify ball velocity based on emotions
        const modifiedVelocity = {
            x: ballData.velocity.x * (1 + excitementFactor - stressFactor),
            y: ballData.velocity.y * (1 + excitementFactor - stressFactor)
        };
        
        // Output data
        this.state.outputData = {
            position: ballData.position,
            velocity: modifiedVelocity,
            emotionalIntensity: excitementFactor + focusFactor
        };
        
        // Update UI elements if they exist
        this.updateDeafModeUI();
    },
    
    // Process output for blind mode
    processBlindModeOutput: function(emotions, ballData) {
        // In a real application, we would use emotions to modify the audio feedback
        // For this prototype, we'll just pass through the ball data
        
        // Calculate emotional impact
        const excitementFactor = emotions.excitement * this.config.emotionWeights.excitement;
        const focusFactor = emotions.focus * this.config.emotionWeights.focus;
        const stressFactor = emotions.stress * this.config.emotionWeights.stress;
        
        // Calculate audio parameters
        const distance = Math.sqrt(
            Math.pow((ballData.position.x - 0.5), 2) + 
            Math.pow((ballData.position.y - 0.5), 2)
        );
        
        const angle = Math.atan2(
            ballData.position.y - 0.5,
            ballData.position.x - 0.5
        );
        
        // Output data
        this.state.outputData = {
            position: ballData.position,
            velocity: ballData.velocity,
            distance: distance,
            angle: angle,
            volume: 1 - (distance * 0.5),
            pitch: 1 + (excitementFactor * 0.5),
            emotionalIntensity: excitementFactor + focusFactor
        };
        
        // Update UI elements if they exist
        this.updateBlindModeUI();
    },
    
    // Update deaf mode UI
    updateDeafModeUI: function() {
        if (!this.state.outputData) return;
        
        const directionArrow = document.getElementById('direction-arrow');
        if (!directionArrow) return;
        
        // Update arrow position
        directionArrow.style.left = (this.state.outputData.position.x * 100) + '%';
        directionArrow.style.top = (this.state.outputData.position.y * 100) + '%';
        
        // Update arrow direction based on velocity
        const angle = Math.atan2(
            this.state.outputData.velocity.y,
            this.state.outputData.velocity.x
        );
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
        
        // Update arrow size based on emotional intensity
        const baseSize = 50;
        const sizeModifier = this.state.outputData.emotionalIntensity * 20;
        directionArrow.style.width = (baseSize + sizeModifier) + 'px';
        directionArrow.style.height = (baseSize + sizeModifier) + 'px';
    },
    
    // Update blind mode UI
    updateBlindModeUI: function() {
        if (!this.state.outputData) return;
        
        const soundSource = document.getElementById('sound-source');
        if (!soundSource) return;
        
        // Update sound source position
        soundSource.style.left = (this.state.outputData.position.x * 100) + '%';
        soundSource.style.top = (this.state.outputData.position.y * 100) + '%';
        
        // In a real application, we would update 3D audio parameters here
        // For this prototype, we'll just update the visual representation
        
        // Update sound waves based on emotional intensity
        const soundWaves = soundSource.querySelector('.sound-waves');
        if (soundWaves) {
            const intensity = this.state.outputData.emotionalIntensity;
            soundWaves.style.animationDuration = (3 - intensity) + 's';
            soundWaves.style.opacity = 0.5 + (intensity * 0.5);
        }
    },
    
    // Get current output data
    getOutputData: function() {
        return {...this.state.outputData};
    }
};

// Initialize and connect modules when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize EEG module when on EEG connection screen
    const eegCanvas = document.getElementById('eeg-canvas');
    if (eegCanvas) {
        const eegModule = EEGAnalysis.initialize(eegCanvas);
        
        // Store in window for access from other scripts
        window.eegModule = eegModule;
    }
    
    // Initialize video module when on video analysis screen
    const videoCanvas = document.getElementById('videoCanvas');
    if (videoCanvas) {
        const videoModule = VideoAnalysis.initialize(videoCanvas);
        videoModule.start();
        
        // Store in window for access from other scripts
        window.videoModule = videoModule;
    }
    
    // Initialize fusion engine when appropriate
    const fusionButton = document.getElementById('eeg-continue-button');
    if (fusionButton) {
        fusionButton.addEventListener('click', function() {
            // Get selected mode from app state
            const selectedMode = appState?.selectedMode || 'deaf';
            
            // Initialize fusion engine if modules exist
            if (window.eegModule && window.videoModule) {
                const fusionEngine = FusionEngine.initialize(
                    window.eegModule,
                    window.videoModule,
                    selectedMode
                );
                
                fusionEngine.start();
                
                // Store in window for access from other scripts
                window.fusionEngine = fusionEngine;
            }
        });
    }
});
