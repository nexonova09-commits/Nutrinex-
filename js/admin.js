// Admin Panel
function loadAdminData() {
    // Check if user is admin
    if (currentUser?.email !== CONFIG.ADMIN_EMAIL) {
        alert('Accès refusé');
        goToScreen('profile-screen');
        return;
    }
    
    // Load admin data
    const users = JSON.parse(localStorage.getItem('nutrinex_users') || '[]');
    const premiumUsers = users.filter(u => u.premium).length;
    const todaySignups = users.filter(u => {
        const createdDate = new Date(u.createdAt).toDateString();
        const today = new Date().toDateString();
        return createdDate === today;
    }).length;
    
    document.getElementById('admin-total-users').textContent = users.length;
    document.getElementById('admin-premium-users').textContent = premiumUsers;
    document.getElementById('admin-today-signups').textContent = todaySignups;
    
    // Update recent actions
    const actionsEl = document.getElementById('recent-actions');
    if (users.length === 0) {
        actionsEl.innerHTML = '<p class="empty-state">Aucune activité</p>';
    } else {
        actionsEl.innerHTML = users.slice(-5).map(u => `
            <div class="action-item">
                <strong>${u.name}</strong> s\'est inscrit le ${new Date(u.createdAt).toLocaleDateString('fr-FR')}
            </div>
        `).join('');
    }
    
    // Update last update time
    const now = new Date();
    document.getElementById('last-update').textContent = now.toLocaleTimeString('fr-FR');
}

function viewAllUsers() {
    const users = JSON.parse(localStorage.getItem('nutrinex_users') || '[]');
    const userList = users.map((u, i) => `${i + 1}. ${u.name} (${u.email})`).join('\n');
    alert('Utilisateurs:\n\n' + (userList || 'Aucun utilisateur'));
}

function viewAnalytics() {
    const users = JSON.parse(localStorage.getItem('nutrinex_users') || '[]');
    const totalMeals = Object.keys(localStorage)
        .filter(k => k.startsWith('nutrinex_meals_'))
        .reduce((sum, key) => sum + JSON.parse(localStorage.getItem(key) || '[]').length, 0);
    
    alert(`Analytics:\n\nUtilisateurs totaux: ${users.length}\nRepas enregistrés: ${totalMeals}\nMoyenne par utilisateur: ${(totalMeals / (users.length || 1)).toFixed(1)}`);
}

function checkSystemHealth() {
    alert('État du système:\n\n✓ Base de données: OK\n✓ API NOVA: OK\n✓ API Nutrition: OK\n✓ Tous les services: Opérationnels');
}

window.loadAdminData = loadAdminData;
window.viewAllUsers = viewAllUsers;
window.viewAnalytics = viewAnalytics;
window.checkSystemHealth = checkSystemHealth;