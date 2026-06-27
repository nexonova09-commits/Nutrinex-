// Nutrition APIs
class NutritionAPI {
    constructor(usdaKey) {
        this.usdaKey = usdaKey;
        this.usdaUrl = 'https://fdc.nal.usda.gov/api/v1/foods/search';
    }

    // USDA FoodData Central
    async searchUSDA(foodName) {
        try {
            const response = await fetch(
                `${this.usdaUrl}?query=${encodeURIComponent(foodName)}&pageSize=10&api_key=${this.usdaKey}`
            );
            if (!response.ok) throw new Error('USDA API error');
            return await response.json();
        } catch (error) {
            console.error('USDA search error:', error);
            return null;
        }
    }

    // OpenFoodFacts - Barcode search
    async searchByBarcode(barcode) {
        try {
            const response = await fetch(
                `https://world.openfoodfacts.org/api/v3/product/${barcode}.json`
            );
            if (!response.ok) throw new Error('OpenFoodFacts error');
            const data = await response.json();
            return data.product ? data.product : null;
        } catch (error) {
            console.error('Barcode search error:', error);
            return null;
        }
    }

    // Parse nutrition info
    parseNutritionInfo(product) {
        if (!product) return null;

        const getNutrient = (name) => {
            if (product.foodNutrients) {
                const nutrient = product.foodNutrients.find(n => 
                    n.nutrientName?.toLowerCase().includes(name.toLowerCase())
                );
                return nutrient ? nutrient.value : 0;
            }
            return product[name] || 0;
        };

        return {
            name: product.description || product.product_name || 'Produit inconnu',
            calories: getNutrient('energy') || getNutrient('calories') || 0,
            protein: getNutrient('protein') || 0,
            carbs: getNutrient('carbohydrate') || 0,
            fats: getNutrient('fat') || 0,
            fiber: getNutrient('fiber') || 0,
            image: product.image_url || product.image_front_url || '/placeholder.jpg'
        };
    }
}

const nutritionAPI = new NutritionAPI(CONFIG.USDA_API_KEY);
window.nutritionAPI = nutritionAPI;