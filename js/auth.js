// Authentication
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        alert('Veuillez remplir tous les champs');
        return;
    }
    
    try {
        // Check if user exists in localStorage
        const users = JSON.parse(localStorage.getItem('nutrinex_users') || '[]');
        const user = users.find(u => u.email === email);
        
        if (!user) {
            alert('Utilisateur non trouvé');
            return;
        }
        
        if (user.password !== password) {
            alert('Mot de passe incorrect');
            return;
        }
        
        currentUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            premium: user.premium || false,
            createdAt: user.createdAt
        };
        
        localStorage.setItem('nutrinex_user', JSON.stringify(currentUser));
        document.getElementById('login-form').reset();
        
        // Check if admin
        if (email === CONFIG.ADMIN_EMAIL) {
            document.getElementById('admin-link-container').style.display = 'block';
        }
        
        goToScreen('dashboard-screen');
    } catch (error) {
        console.error('Login error:', error);
        alert('Erreur de connexion');
    }
}

async function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const age = document.getElementById('signup-age').value;
    const goal = document.getElementById('signup-goal').value;
    
    if (!name || !email || !password || !age || !goal) {
        alert('Veuillez remplir tous les champs');
        return;
    }
    
    try {
        // Check if user already exists
        const users = JSON.parse(localStorage.getItem('nutrinex_users') || '[]');
        if (users.find(u => u.email === email)) {
            alert('Cet email est déjà utilisé');
            return;
        }
        
        const newUser = {
            id: 'user_' + Date.now(),
            name,
            email,
            password, // In production, this should be hashed
            age: parseInt(age),
            goal,
            premium: false,
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('nutrinex_users', JSON.stringify(users));
        
        currentUser = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            premium: newUser.premium,
            createdAt: newUser.createdAt
        };
        
        localStorage.setItem('nutrinex_user', JSON.stringify(currentUser));
        document.getElementById('signup-form').reset();
        
        goToScreen('dashboard-screen');
    } catch (error) {
        console.error('Signup error:', error);
        alert('Erreur lors de l\'inscription');
    }
}

function resetPassword(e) {
    e.preventDefault();
    const email = prompt('Entrez votre email:');
    if (email) {
        alert('Un lien de réinitialisation a été envoyé à ' + email);
    }
}

function logout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        currentUser = null;
        localStorage.removeItem('nutrinex_user');
        document.getElementById('admin-link-container').style.display = 'none';
        goToScreen('auth-screen');
    }
}

window.handleLogin = handleLogin;
window.handleSignup = handleSignup;
window.resetPassword = resetPassword;
window.logout = logout;