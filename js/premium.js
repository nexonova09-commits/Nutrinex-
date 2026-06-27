// Premium
function subscribeToPlan(plan) {
    const price = plan === 'monthly' ? '9,99€' : '79,99€';
    alert(`Paiement de ${price} - Fonctionnalité Stripe bientôt disponible`);
    
    // In production, integrate with Stripe
    // For now, simulate premium upgrade
    setTimeout(() => {
        currentUser.premium = true;
        localStorage.setItem('nutrinex_user', JSON.stringify(currentUser));
        alert('Vous êtes maintenant premium!');
        goToScreen('profile-screen');
    }, 1000);
}

window.subscribeToPlan = subscribeToPlan;