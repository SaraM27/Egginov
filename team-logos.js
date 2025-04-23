// Team logo placeholders using canvas
function createTeamLogoPlaceholders() {
    const teams = [
        { id: 1, name: 'Manchester United', color: '#DA291C' },
        { id: 2, name: 'Barcelona', color: '#004D98' },
        { id: 3, name: 'Real Madrid', color: '#FFFFFF' },
        { id: 4, name: 'Bayern Munich', color: '#DC052D' },
        { id: 5, name: 'Liverpool', color: '#C8102E' },
        { id: 6, name: 'Juventus', color: '#000000' },
        { id: 7, name: 'PSG', color: '#004170' },
        { id: 8, name: 'Manchester City', color: '#6CABDD' },
        { id: 9, name: 'Chelsea', color: '#034694' },
        { id: 10, name: 'Arsenal', color: '#EF0107' },
        { id: 11, name: 'AC Milan', color: '#FB090B' },
        { id: 12, name: 'Inter Milan', color: '#0057B8' }
    ];
    
    teams.forEach(team => {
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');
        
        // Draw circular background
        ctx.fillStyle = team.color;
        ctx.beginPath();
        ctx.arc(50, 50, 45, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Draw team initials
        ctx.fillStyle = '#ffffff';
        if (team.color === '#FFFFFF') {
            ctx.fillStyle = '#000000';
        }
        
        ctx.font = 'bold 30px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Get team initials
        const initials = team.name
            .split(' ')
            .map(word => word.charAt(0))
            .join('');
            
        ctx.fillText(initials, 50, 50);
        
        // Save as PNG
        const dataUrl = canvas.toDataURL('image/png');
        
        // In a real application, we would save this to a file
        // For this prototype, we'll use these as data URLs
        team.logoUrl = dataUrl;
    });
    
    return teams;
}

// Update team selection with generated logos
function enhanceTeamSelection() {
    const teams = createTeamLogoPlaceholders();
    
    // Update the teams in appState
    appState.teams = teams.map(team => ({
        id: team.id,
        name: team.name,
        logo: team.logoUrl
    }));
    
    // Repopulate the teams grid
    const teamsGrid = document.getElementById('teams-grid');
    if (teamsGrid) {
        teamsGrid.innerHTML = '';
        
        appState.teams.forEach(team => {
            const teamCard = document.createElement('div');
            teamCard.className = 'team-card';
            teamCard.dataset.teamId = team.id;
            
            const logoElement = document.createElement('img');
            logoElement.src = team.logo;
            logoElement.alt = team.name;
            logoElement.className = 'team-logo';
            
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
                document.getElementById('team-continue-button').disabled = false;
            });
            
            teamsGrid.appendChild(teamCard);
        });
    }
    
    // Update favorite team dropdown in settings
    const favoriteTeamSelect = document.getElementById('favorite-team');
    if (favoriteTeamSelect) {
        favoriteTeamSelect.innerHTML = '';
        
        appState.teams.forEach(team => {
            const option = document.createElement('option');
            option.value = team.id;
            option.textContent = team.name;
            favoriteTeamSelect.appendChild(option);
        });
    }
}

// Call this function after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the original app
    // ... (existing initialization code)
    
    // Enhance team selection with generated logos
    enhanceTeamSelection();
});
