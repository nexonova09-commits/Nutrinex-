// Dashboard
function updateDashboard() {
    // Update date
    const dateEl = document.getElementById('date-display');
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateEl.textContent = today.toLocaleDateString('fr-FR', options);
    
    // Calculate calories and macros
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;
    
    meals.forEach(meal => {
        totalCalories += meal.calories || 0;
        totalProtein += meal.protein || 0;
        totalCarbs += meal.carbs || 0;
        totalFats += meal.fats || 0;
    });
    
    // Update calories display
    document.getElementById('calories-consumed').textContent = Math.round(totalCalories);
    document.getElementById('calories-goal').textContent = userPreferences.calorieGoal;
    
    // Update circle progress
    const percentage = Math.min((totalCalories / userPreferences.calorieGoal) * 100, 100);
    const circle = document.querySelector('.circle-progress-bar');
    const circumference = 2 * Math.PI * 54;
    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = circumference - (percentage / 100) * circumference;
    
    // Add gradient to SVG
    const svg = document.querySelector('.circle-progress svg');
    if (!svg.querySelector('#progressGradient')) {
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.id = 'progressGradient';
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '100%');
        gradient.setAttribute('y2', '100%');
        
        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('style', 'stop-color:#10b981;stop-opacity:1');
        
        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('style', 'stop-color:#059669;stop-opacity:1');
        
        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        defs.appendChild(gradient);
        svg.appendChild(defs);
    }
    
    // Update macros
    document.getElementById('protein-val').textContent = Math.round(totalProtein);
    document.getElementById('carbs-val').textContent = Math.round(totalCarbs);
    document.getElementById('fats-val').textContent = Math.round(totalFats);
    
    const totalMacros = totalProtein + totalCarbs + totalFats;
    if (totalMacros > 0) {
        document.getElementById('protein-percent').textContent = Math.round((totalProtein / totalMacros) * 100);
        document.getElementById('carbs-percent').textContent = Math.round((totalCarbs / totalMacros) * 100);
        document.getElementById('fats-percent').textContent = Math.round((totalFats / totalMacros) * 100);
    }
    
    // Update recent meals
    const recentMealsEl = document.getElementById('recent-meals');
    if (meals.length === 0) {
        recentMealsEl.innerHTML = '<p class="empty-state">Aucun repas aujourd\'hui</p>';
    } else {
        recentMealsEl.innerHTML = meals.slice(-3).map(meal => `
            <div class="meal-item">
                <span class="meal-item-name">${meal.name}</span>
                <span class="meal-item-cals">${meal.calories} kcal</span>
            </div>
        `).join('');
    }
    
    // Update water
    document.getElementById('water-value').textContent = waterIntake;
    
    saveLocalData();
}

function addWater() {
    waterIntake++;
    if (waterIntake > 8) waterIntake = 0;
    document.getElementById('water-value').textContent = waterIntake;
    saveLocalData();
}

function openNotifications() {
    alert('Aucune notification pour le moment');
}

window.updateDashboard = updateDashboard;
window.addWater = addWater;
window.openNotifications = openNotifications;