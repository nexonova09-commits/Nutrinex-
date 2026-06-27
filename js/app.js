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
    setupEventListeners();
    animateSplash();
    
    // Splash screen -> Auth/Dashboard après 2.5 secondes
    setTimeout(() => {
        checkAuth();
    }, 2500);
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
    // Auth tabs - Only for auth-tabs, not all tab-btn
    const authTabs = document.querySelector('#auth-tabs');
    if (authTabs) {
        authTabs.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                authTabs.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                
                const tabName = e.target.dataset.tab;
                document.querySelectorAll('.auth-form').forEach(form => {
                    form.classList.add('hidden');
                });
                document.getElementById(`${tabName}-form`).classList.remove('hidden');
            });
        });
    }

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
        goToScreen('dashboard-screen');
    } else {
        goToScreen('auth-screen');
    }
}

function goToScreen(screenId, event) {
    if (event) event.preventDefault();
    
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });
    
    document.getElementById(screenId).classList.remove('hidden');
    
    // Update nav
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    
    if (screenId === 'dashboard-screen') {
        if (navItems[0]) navItems[0].classList.add('active');
        updateDashboard();
    } else if (screenId === 'journal-screen') {
        if (navItems[1]) navItems[1].classList.add('active');
        updateJournal();
    } else if (screenId === 'scanner-screen') {
        if (navItems[2]) navItems[2].classList.add('active');
    } else if (screenId === 'chat-screen') {
        if (navItems[3]) navItems[3].classList.add('active');
    } else if (screenId === 'profile-screen') {
        if (navItems[4]) navItems[4].classList.add('active');
        loadProfileData();
    } else if (screenId === 'stats-screen') {
        initializeStats();
    } else if (screenId === 'admin-screen') {
        loadAdminData();
    }
}

function animateSplash() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.style.animation = `pulse 1.5s infinite ${index * 0.2}s`;
    });
}

window.goToScreen = goToScreen;