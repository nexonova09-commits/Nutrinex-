// Profile
function loadProfileData() {
    if (!currentUser) return;
    
    // Load basic info
    document.getElementById('profile-name').textContent = currentUser.name;
    document.getElementById('profile-email').textContent = currentUser.email;
    
    // Load preferences
    document.getElementById('profile-weight').value = userPreferences.weight;
    document.getElementById('profile-height').value = userPreferences.height;
    document.getElementById('profile-age').value = userPreferences.age;
    document.getElementById('profile-calories').value = userPreferences.calorieGoal;
    document.getElementById('profile-diet').value = userPreferences.diet;
    
    // Load notifications
    document.getElementById('notif-meals').checked = true;
    document.getElementById('notif-nova').checked = true;
    document.getElementById('notif-community').checked = true;
    
    // Check admin status
    if (currentUser.email === CONFIG.ADMIN_EMAIL) {
        document.getElementById('admin-link-container').style.display = 'block';
    }
}

function saveProfile() {
    userPreferences.weight = parseFloat(document.getElementById('profile-weight').value) || 70;
    userPreferences.height = parseFloat(document.getElementById('profile-height').value) || 180;
    userPreferences.age = parseInt(document.getElementById('profile-age').value) || 25;
    userPreferences.calorieGoal = parseInt(document.getElementById('profile-calories').value) || 2000;
    userPreferences.diet = document.getElementById('profile-diet').value;
    
    saveLocalData();
    alert('Profil enregistré avec succès!');
}

function goToPremium() {
    goToScreen('premium-screen');
}

window.loadProfileData = loadProfileData;
window.saveProfile = saveProfile;
window.goToPremium = goToPremium;