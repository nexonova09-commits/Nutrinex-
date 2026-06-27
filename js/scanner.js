// Scanner
let videoStream = null;
let currentScanResult = null;

async function initializeScanner() {
    try {
        const video = document.getElementById('scanner-video');
        videoStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' }
        });
        video.srcObject = videoStream;
        
        // Simulate barcode detection (in production, use a library like Quagga)
        simulateBarcodeDetection();
    } catch (error) {
        console.error('Camera access denied:', error);
        alert('Veuillez autoriser l\'accès à la caméra');
    }
}

function simulateBarcodeDetection() {
    // This is a simplified simulation
    // In production, use Quagga.js or similar
    setTimeout(() => {
        // Simulated detected barcode
        const barcode = '5010477149474';
        handleBarcode(barcode);
    }, 2000);
}

async function handleBarcode(barcode) {
    try {
        // Try to get product from OpenFoodFacts
        const product = await nutritionAPI.searchByBarcode(barcode);
        const nutrition = nutritionAPI.parseNutritionInfo(product);
        
        if (nutrition) {
            currentScanResult = {
                barcode,
                ...nutrition
            };
            
            showScanResult();
        } else {
            alert('Produit non trouvé dans la base de données');
        }
    } catch (error) {
        console.error('Barcode scan error:', error);
    }
}

function showScanResult() {
    const result = currentScanResult;
    document.getElementById('scanner-result').classList.remove('hidden');
    document.getElementById('result-name').textContent = result.name;
    document.getElementById('result-barcode').textContent = result.barcode;
    document.getElementById('result-calories').textContent = Math.round(result.calories);
    document.getElementById('result-image').src = result.image;
    document.getElementById('result-brand').textContent = 'Marque';
}

function closeScanResult() {
    document.getElementById('scanner-result').classList.add('hidden');
    currentScanResult = null;
}

function addMealFromScan() {
    if (currentScanResult) {
        const quantity = prompt('Quantité (en grammes):', '100');
        if (quantity) {
            const multiplier = parseInt(quantity) / 100;
            const meal = {
                id: 'meal_' + Date.now(),
                name: currentScanResult.name,
                calories: currentScanResult.calories * multiplier,
                protein: currentScanResult.protein * multiplier,
                carbs: currentScanResult.carbs * multiplier,
                fats: currentScanResult.fats * multiplier,
                quantity: quantity + 'g',
                type: 'lunch',
                time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
            };
            
            meals.push(meal);
            saveLocalData();
            closeScanResult();
            alert('Repas ajouté avec succès!');
            updateDashboard();
        }
    }
}

function toggleFlash() {
    alert('Flash activé');
}

function uploadImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            alert('Image téléchargée: ' + file.name);
            // In production, send to image recognition API
        }
    };
    input.click();
}

window.initializeScanner = initializeScanner;
window.handleBarcode = handleBarcode;
window.showScanResult = showScanResult;
window.closeScanResult = closeScanResult;
window.addMealFromScan = addMealFromScan;
window.toggleFlash = toggleFlash;
window.uploadImage = uploadImage;