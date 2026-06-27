// Statistics
function initializeStats() {
    const canvases = document.querySelectorAll('canvas');
    canvases.forEach(canvas => {
        drawSimpleChart(canvas);
    });
    updateStatsCharts('week');
}

function updateStatsCharts(period) {
    // Generate sample data based on period
    let data = [];
    const days = period === 'week' ? 7 : period === 'month' ? 30 : 365;
    
    for (let i = 0; i < days; i++) {
        data.push({
            date: new Date(Date.now() - (days - i) * 86400000),
            calories: Math.floor(Math.random() * 1000) + 1500,
            weight: 70 + Math.random() * 5 - 2.5
        });
    }
    
    // Update stats
    const avgCalories = Math.round(data.reduce((sum, d) => sum + d.calories, 0) / data.length);
    const maxCalories = Math.max(...data.map(d => d.calories));
    const currentWeight = data[data.length - 1].weight;
    
    document.getElementById('avg-calories').textContent = avgCalories;
    document.getElementById('max-calories').textContent = Math.round(maxCalories);
    document.getElementById('current-weight').textContent = currentWeight.toFixed(1);
    document.getElementById('goal-weight').textContent = (currentWeight - 5).toFixed(1);
    
    // Stats
    document.getElementById('streak-days').textContent = '12';
    document.getElementById('goal-days').textContent = '18';
    document.getElementById('avg-time').textContent = '2min 34s';
}

function drawSimpleChart(canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    canvas.width = width;
    canvas.height = height;
    
    // Draw simple line chart
    const data = [60, 65, 58, 72, 68, 75, 70];
    const padding = 30;
    const plotWidth = width - 2 * padding;
    const plotHeight = height - 2 * padding;
    
    // Draw grid
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = padding + (plotHeight * i) / 5;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }
    
    // Draw line
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    
    const xStep = plotWidth / (data.length - 1);
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue || 1;
    
    ctx.beginPath();
    data.forEach((value, index) => {
        const x = padding + index * xStep;
        const y = height - padding - ((value - minValue) / range) * plotHeight;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.stroke();
}

window.initializeStats = initializeStats;
window.updateStatsCharts = updateStatsCharts;