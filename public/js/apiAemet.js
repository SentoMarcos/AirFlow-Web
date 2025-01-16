    //const apiKey = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwYWJsb3JlYm9sbG8wMkBnbWFpbC5jb20iLCJqdGkiOiJhMDNkNGY3MS1hMWI4LTQ4OWEtODM3YS1kNzFkMmNmMTU5OTIiLCJpc3MiOiJBRU1FVCIsImlhdCI6MTczNjI3NjU2OCwidXNlcklkIjoiYTAzZDRmNzEtYTFiOC00ODlhLTgzN2EtZDcxZDJjZjE1OTkyIiwicm9sZSI6IiJ9.CWvCCuTHlttrTzPeXflUIIr3QdaKhlBE6SC1C2nYwJA'; // Reemplaza con tu clave de API de Aemet
    //const url = `https://opendata.aemet.es/opendata/api/red/especial/contaminacionfondo/estacion/12?api_key=${apiKey}`;

async function fetchAemetData(url) {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'api_key': this.apiKey
            }
        });

        // Verificamos si la respuesta fue exitosa
        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }

        const data = await response.json();

        if (data.datos) {
            // Si data.datos es un enlace válido, obtener el contenido de los datos
            const datosResponse = await fetch(data.datos);
            const rawData = await datosResponse.text(); // Obtener el contenido como texto

            console.log('Datos en bruto:', rawData);

            // Comprobar si rawData es una cadena antes de procesarlo
            if (typeof rawData === 'string') {
                const jsonOutput = actualizarAEMET(rawData); // Actualizar y generar el JSON
                console.log('JSON generado:', jsonOutput); // Mostrar el JSON generado
            } else {
                throw new Error('El contenido de los datos no es una cadena válida');
            }

        } else {
            throw new Error('No se encontró el enlace a los datos reales.');
        }
    } catch (err) {
        console.error('Error en la solicitud:', err);
    }
}

function actualizarAEMET(rawData) {
    // Comprobar que rawData es una cadena
    if (typeof rawData !== 'string') {
        throw new Error('rawData no es una cadena');
    }

    const lines = rawData.split('\n'); // Dividir los datos en líneas

    // Definir los parámetros de interés
    const parametrosInteres = ['O3(014)', 'SO2(001)', 'NO(007)', 'NO2(008)', 'PM10(010)'];

    // Arreglo para almacenar los datos filtrados
    const filteredData = [];

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
        }

        // Al filtrar los parámetros, no se están obteniendo los valores correctamente
        let paramMatch;
        while ((paramMatch = paramRegex.exec(line)) !== null) {

            const key = paramMatch[1]; // Nombre del parámetro
            let value = paramMatch[2].trim(); // Valor numérico del parámetro

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

        // Solo agregar a filteredData si alguno de los parámetros relevantes tiene un valor
        if (Object.values(rowData).some(value => value !== '-')) {
            filteredData.push(rowData);
        }
    });

    // Elimina el último elemento si está vacío (siempre vacío en tu caso)
    if (filteredData.length > 0) {
        filteredData.pop();
    }

    // Crear el JSON
    const jsonOutput = JSON.stringify(filteredData, null, 2); // Convertir el arreglo de objetos a JSON

    return jsonOutput; // Retorna el JSON generado
}