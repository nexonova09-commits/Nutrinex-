// Journal Alimentaire
let journalDate = new Date();
const mealTypes = {
    breakfast: '🌅 Petit-déjeuner',
    lunch: '🌞 Déjeuner',
    snack: '🍴 Goûter',
    dinner: '🌙 Dîner'
};

function updateJournal() {
    updateJournalDate();
    loadJournalMeals();
    updateJournalSummary();
}

function updateJournalDate() {
    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    const dateStr = journalDate.toLocaleDateString('fr-FR', options);
    const isToday = journalDate.toDateString() === new Date().toDateString();
    document.getElementById('journal-date').textContent = isToday ? 'Aujourd\'hui' : dateStr;
}

function loadJournalMeals() {
    const dateStr = getDateString(journalDate);
    const dayMeals = JSON.parse(localStorage.getItem(`nutrinex_meals_${dateStr}`) || '[]');
    
    Object.keys(mealTypes).forEach(mealType => {
        const container = document.getElementById(`${mealType}-items`);
        const mealsList = dayMeals.filter(m => m.type === mealType);
        
        if (mealsList.length === 0) {
            container.innerHTML = '';
        } else {
            container.innerHTML = mealsList.map(meal => `
                <div class="meal-item-row">
                    <div class="meal-item-details">
                        <div class="meal-item-name-row">${meal.name}</div>
                        <div class="meal-item-quantity">${meal.quantity}</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-weight: 600; color: #10b981;">${Math.round(meal.calories)} kcal</div>
                    </div>
                    <button class="meal-item-remove" onclick="removeMeal('${meal.id}', '${mealType}')">×</button>
                </div>
            `).join('');
        }
        
        const totalCals = mealsList.reduce((sum, m) => sum + (m.calories || 0), 0);
        document.getElementById(`${mealType}-cals`).textContent = Math.round(totalCals) + ' kcal';
    });
}

function updateJournalSummary() {
    const dateStr = getDateString(journalDate);
    const dayMeals = JSON.parse(localStorage.getItem(`nutrinex_meals_${dateStr}`) || '[]');
    
    let totalCals = 0, totalProtein = 0, totalCarbs = 0, totalFats = 0;
    dayMeals.forEach(meal => {
        totalCals += meal.calories || 0;
        totalProtein += meal.protein || 0;
        totalCarbs += meal.carbs || 0;
        totalFats += meal.fats || 0;
    });
    
    document.getElementById('journal-total-cals').textContent = Math.round(totalCals);
    document.getElementById('journal-total-protein').textContent = Math.round(totalProtein);
    document.getElementById('journal-total-carbs').textContent = Math.round(totalCarbs);
    document.getElementById('journal-total-fats').textContent = Math.round(totalFats);
}

function previousDay() {
    journalDate.setDate(journalDate.getDate() - 1);
    updateJournal();
}

function nextDay() {
    journalDate.setDate(journalDate.getDate() + 1);
    updateJournal();
}

function toggleSection(element) {
    const content = element.nextElementSibling;
    content.classList.toggle('hidden');
}

function addMeal(mealType) {
    const foodName = prompt('Nom de l\'aliment:');
    if (!foodName) return;
    
    const calories = prompt('Calories (kcal):', '100');
    if (!calories) return;
    
    const meal = {
        id: 'meal_' + Date.now(),
        name: foodName,
        calories: parseFloat(calories),
        protein: 0,
        carbs: 0,
        fats: 0,
        quantity: '100g',
        type: mealType,
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };
    
    const dateStr = getDateString(journalDate);
    const dayMeals = JSON.parse(localStorage.getItem(`nutrinex_meals_${dateStr}`) || '[]');
    dayMeals.push(meal);
    localStorage.setItem(`nutrinex_meals_${dateStr}`, JSON.stringify(dayMeals));
    
    loadJournalMeals();
    updateJournalSummary();
}

function removeMeal(mealId, mealType) {
    if (confirm('Supprimer ce repas ?')) {
        const dateStr = getDateString(journalDate);
        let dayMeals = JSON.parse(localStorage.getItem(`nutrinex_meals_${dateStr}`) || '[]');
        dayMeals = dayMeals.filter(m => m.id !== mealId);
        localStorage.setItem(`nutrinex_meals_${dateStr}`, JSON.stringify(dayMeals));
        
        loadJournalMeals();
        updateJournalSummary();
    }
}

window.updateJournal = updateJournal;
window.previousDay = previousDay;
window.nextDay = nextDay;
window.toggleSection = toggleSection;
window.addMeal = addMeal;
window.removeMeal = removeMeal;