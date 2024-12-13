const apiKey = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwYWJsb3JlYm9sbG8wMkBnbWFpbC5jb20iLCJqdGkiOiJhYzc1ODlkNC1iNWVkLTQ5M2YtYTQ4ZS1mOGMxZjJmYWVjYzYiLCJpc3MiOiJBRU1FVCIsImlhdCI6MTczNDA0NTI1NywidXNlcklkIjoiYWM3NTg5ZDQtYjVlZC00OTNmLWE0OGUtZjhjMWYyZmFlY2M2Iiwicm9sZSI6IiJ9.ftBm8v1OGZII0zK23XNTgdjUlNA1s8exVusZcG5dfaw'; // Reemplaza con tu clave de API de Aemet
const url = `https://opendata.aemet.es/opendata/api/red/especial/contaminacionfondo/estacion/12?api_key=${apiKey}`;

// Función fetch para obtener datos de la API
fetch(url, {
    method: 'GET',
    headers: {
        'accept': 'application/json',
        'api_key': this.apiKey
    }
})
    .then(response => response.json())
    .then(data => {
        if (data.datos) {
            return fetch(data.datos)
                .then(response => response.text()) // Obtén el contenido como texto
                .then(rawData => {
                    console.log('Datos en bruto:', rawData);
                    actualizarTablaFINN(rawData); // Actualizar la tabla directamente
                });
        } else {
            throw new Error('No se encontró el enlace a los datos reales.');
        }
    })
    .catch(err => console.error('Error en la solicitud:', err));

function actualizarTablaFINN(rawData) {
    const tableBody = document.querySelector('table.table tbody');
    tableBody.innerHTML = ''; // Vaciar la tabla antes de agregar nuevos datos

    const lines = rawData.split('\n'); // Dividir los datos en líneas
    console.log("Líneas recibidas:", lines); // Ver qué líneas estamos procesando

    // Definir los parámetros de interés
    const parametrosInteres = ['O3(014)', 'SO2(001)', 'NO(007)', 'NO2(008)', 'PM10(010)'];

    lines.forEach(line => {
        const dateRegex = /^(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2})/; // Regex para fecha y hora
        const paramRegex = /([A-Z0-9]+\(\d{1,3}\)):\s([+\-]?\d+(\.\d+)?)(\s?[a-zA-Z%\/]+)/g;

        const dateMatch = line.match(dateRegex);
        const rowData = {
            fecha: '',
            hora: '',
            O3: '-',
            SO2: '-',
            NO: '-',
            NO2: '-',
            PM10: '-'
        };

        // Si encontramos una fecha y hora, la extraemos
        if (dateMatch) {
            rowData.fecha = `${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}`;
            rowData.hora = `${dateMatch[4]}:${dateMatch[5]}`;
            console.log("Fecha y hora extraída:", rowData.fecha, rowData.hora);
        }

        // Al fintrar los parámetros, no se están obteniendo los valores correctamente
        let paramMatch;
        while ((paramMatch = paramRegex.exec(line)) !== null) {

            console.log("paramMatch:", paramMatch); // Ver qué coincidencias estamos procesando 
            const key = paramMatch[1]; // Nombre del parámetro
            let value = paramMatch[2].trim(); // Valor numérico del parámetro

            console.log(`Encontrado parámetro: ${key} con valor: ${value}`);

            // Limpiar el valor para quitar signos '+' y ceros innecesarios
            value = value.replace(/^[\+0]+/, '');
            const numericValue = parseFloat(value);

            // Solo almacenar valores de parámetros relevantes
            if (!isNaN(numericValue) && parametrosInteres.includes(key)) {
                if (key === 'O3(014)') {
                    rowData.O3 = numericValue.toFixed(2);
                } else if (key === 'SO2(001)') {
                    rowData.SO2 = numericValue.toFixed(2);
                } else if (key === 'NO(007)') {
                    rowData.NO = numericValue.toFixed(2);
                } else if (key === 'NO2(008)') {
                    rowData.NO2 = numericValue.toFixed(2);
                } else if (key === 'PM10(010)') {
                    rowData.PM10 = numericValue.toFixed(2);
                }
            }
        }

        // Solo agregar la fila si alguno de los parámetros relevantes tiene un valor
        if (Object.values(rowData).some(value => value !== '-')) {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${rowData.fecha}</td>
                <td>${rowData.hora}</td>
                <td>${rowData.O3}</td>
                <td>${rowData.SO2}</td>
                <td>${rowData.NO}</td>
                <td>${rowData.NO2}</td>
                <td>${rowData.PM10}</td>
            `;
            tableBody.appendChild(newRow);
        }
    });
}