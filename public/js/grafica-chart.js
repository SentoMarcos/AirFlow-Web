const ctx = document.getElementById('ozoneChart').getContext('2d');
// Generar datos aleatorios asegurando al menos un valor en cada rango
const data = [];
const ranges = [
    { min: 25, max: 49, color: 'rgba(255, 132, 224, 1)' }, // Rosa
    { min: 50, max: 74, color: 'rgba(82, 215, 131, 1)' }, // Verde
    { min: 75, max: 99, color: 'rgba(255, 253, 132, 1)' }, // Amarillo
    { min: 100, max: 150, color: 'rgba(255, 146, 132, 1)' } // Rojo para valores mayores a 100
];

// Asegurar al menos un valor en cada rango
ranges.forEach(range => {
    data.push(Math.floor(Math.random() * (range.max - range.min + 1)) + range.min);
});

// Completar el resto de los datos aleatorios
while (data.length < 24) {
    data.push(Math.floor(Math.random() * 150));
}

// Mezclar los datos para distribuir los valores asegurados
data.sort(() => Math.random() - 0.5);

const backgroundColors = data.map(value => {
    if (value <= 50) return 'rgba(255, 132, 224, 1)'; // Rosa
    if (value <= 100) return 'rgba(82, 215, 131, 1)';  // Verde
    if (value <= 150) return 'rgba(255, 253, 132, 1)';  // Amarillo
    if (value <= 200) return 'rgba(255, 146, 132, 1)'; // Rojo
    return 'rgb(255,32,0)'; // Rojo para valores mayores a 100
});
const borderColors = backgroundColors;
function asignarEstadoPorMedia(media) {
    // Define los intervalos para los estados
    if (!media) return 'vacio';
    if (media <= 50) return 'excelente';
    if (media <= 100) return 'bueno';
    if (media <= 150) return 'moderado';
    if (media <= 200) return 'malo';
    return 'peligroso'; // Si es mayor a 100
}
const ozoneChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: Array.from({ length: 24 }, (_, i) => `${i}h`),
        datasets: [{
            label: 'µg/m³',
            data: Array(24).fill(0), // Datos iniciales vacíos
            backgroundColor: Array(24).fill('rgba(255, 132, 224, 1)'), // Colores iniciales
            borderColor: Array(24).fill('rgba(255, 132, 224, 1)'),
            borderWidth: 1
        }]
    },
    options: {
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                }
            },
            y: {
                beginAtZero: true,
                max: 300,
                ticks: {
                    stepSize: 50
                },
                grid: {
                    display: false
                }
            }
        }
    }
});