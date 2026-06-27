// Application Core
let currentUser = null;
let userPreferences = {
    calorieGoal: 2000,
    diet: 'omnivore',
    weight: 70,
    height: 180,
    age: 25
};

let meals = [];
let waterIntake = 0;
let currentDate = new Date();

// Initialize app
window.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    loadLocalData();
    checkAuth();
    setupEventListeners();
    animateSplash();
}

function loadLocalData() {
    const stored = localStorage.getItem('nutrinex_user');
    if (stored) {
        currentUser = JSON.parse(stored);
    }
    
    const storedPrefs = localStorage.getItem('nutrinex_prefs');
    if (storedPrefs) {
        userPreferences = JSON.parse(storedPrefs);
    }
    
    const storedMeals = localStorage.getItem(`nutrinex_meals_${getDateString(currentDate)}`);
    if (storedMeals) {
        meals = JSON.parse(storedMeals);
    }
    
    const storedWater = localStorage.getItem(`nutrinex_water_${getDateString(currentDate)}`);
    if (storedWater) {
        waterIntake = parseInt(storedWater);
    }
}

function saveLocalData() {
    if (currentUser) {
        localStorage.setItem('nutrinex_user', JSON.stringify(currentUser));
    }
    localStorage.setItem('nutrinex_prefs', JSON.stringify(userPreferences));
    localStorage.setItem(`nutrinex_meals_${getDateString(currentDate)}`, JSON.stringify(meals));
    localStorage.setItem(`nutrinex_water_${getDateString(currentDate)}`, waterIntake);
}

function getDateString(date) {
    return date.toISOString().split('T')[0];
}

function setupEventListeners() {
    // Auth tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabs = e.target.parentElement.querySelectorAll('.tab-btn');
            tabs.forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            
            const tabName = e.target.dataset.tab;
            document.querySelectorAll('.auth-form').forEach(form => {
                form.classList.add('hidden');
            });
            document.getElementById(`${tabName}-form`).classList.remove('hidden');
        });
    });

    // Login form
    document.getElementById('login-form')?.addEventListener('submit', handleLogin);
    
    // Signup form
    document.getElementById('signup-form')?.addEventListener('submit', handleSignup);

    // Stats period buttons
    document.querySelectorAll('.period-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            updateStatsCharts(e.target.dataset.period);
        });
    });

    // Community tabs
    document.querySelectorAll('.community-tabs .tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabName = e.target.dataset.tab;
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.add('hidden');
            });
            document.getElementById(`${tabName}-tab`).classList.remove('hidden');
            
            document.querySelectorAll('.community-tabs .tab-btn').forEach(b => {
                b.classList.remove('active');
            });
            e.target.classList.add('active');
        });
    });
}

function checkAuth() {
    if (currentUser) {
        setTimeout(() => {
            goToScreen('dashboard-screen');
        }, 3000);
    } else {
        setTimeout(() => {
            goToScreen('auth-screen');
        }, 3000);
    }
}

function goToScreen(screenId, event) {
    if (event) event.preventDefault();
    
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });
    
    document.getElementById(screenId).classList.remove('hidden');
    
    // Update nav
    if (screenId === 'dashboard-screen') {
        updateNav('nav-0');
    } else if (screenId === 'journal-screen') {
        updateNav('nav-1');
    } else if (screenId === 'scanner-screen') {
        updateNav('nav-2');
    } else if (screenId === 'chat-screen') {
        updateNav('nav-3');
    } else if (screenId === 'profile-screen') {
        updateNav('nav-4');
    }

    // Handle specific screens
    if (screenId === 'dashboard-screen') {
        updateDashboard();
    } else if (screenId === 'journal-screen') {
        updateJournal();
    } else if (screenId === 'profile-screen') {
        loadProfileData();
    } else if (screenId === 'stats-screen') {
        initializeStats();
    } else if (screenId === 'admin-screen') {
        loadAdminData();
    }
}

function updateNav(activeIndex) {
    document.querySelectorAll('.nav-item').forEach((item, index) => {
        if (index === parseInt(activeIndex.split('-')[1])) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

function animateSplash() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.style.animation = `pulse 1.5s infinite ${index * 0.2}s`;
    });
}

window.goToScreen = goToScreen;