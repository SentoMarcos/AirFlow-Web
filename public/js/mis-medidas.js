function obtenerMisSensores() {
    const idUsuario = localStorage.getItem("idUsuario");

    if (!idUsuario) {
        console.error("No se encontró 'idUsuario' en localStorage.");
        return Promise.reject("No se encontró 'idUsuario' en localStorage.");
    }

    // Realizar la solicitud GET al endpoint
    return fetch(`http://localhost:3000/usuarios/mis-sensores?id_usuario=${idUsuario}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status}`);
            }
            return response.json();
        })
        .then(sensores => {
            // Extraer solo los ids de los sensores
            const idsSensores = sensores.map(sensor => sensor.id_sensor); // Asegúrate de usar 'id_sensor'
            console.log("IDs de sensores:", idsSensores);
            return idsSensores; // Devolver solo los IDs de los sensores
        })
        .catch(error => {
            console.error("Error al obtener los sensores:", error);
        });
}

function obtenerMedicionesPorSensores(idsSensores) {
    if (!Array.isArray(idsSensores) || idsSensores.length === 0) {
        console.error("No hay sensores para obtener mediciones.");
        return Promise.reject("No se proporcionaron sensores.");
    }

    return fetch("http://localhost:3000/mediciones/mediciones-por-sensor", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ sensores: idsSensores }) // Pasar como un array de IDs
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status}`);
            }
            return response.json();
        })
        .then(mediciones => {
            console.log("Mediciones obtenidas:", mediciones);
            return mediciones;
        })
        .catch(error => {
            console.error("Error al obtener las mediciones:", error);
            throw error;
        });
}

function obtenerMedicionesPorFecha(idsSensores, fechaSeleccionada) {
    if (!Array.isArray(idsSensores) || idsSensores.length === 0) {
        console.error("No hay sensores para obtener mediciones.");
        return Promise.reject("No se proporcionaron sensores.");
    }

    // Convertir la fecha seleccionada a un formato adecuado para la consulta (por ejemplo, 'YYYY-MM-DD')
    const fechaInicio = `${fechaSeleccionada} 00:00:00`; // Inicio del día
    const fechaFin = `${fechaSeleccionada} 23:59:59`; // Fin del día

    // Hacer la solicitud a la API
    return fetch("http://localhost:3000/mediciones/mediciones-por-fecha", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            sensores: idsSensores,
            fechaInicio: fechaInicio,
            fechaFin: fechaFin
        }) // Pasar los IDs de los sensores y la fecha seleccionada
    })
        .then(response => {
            // Verificar si la respuesta es exitosa
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status}`);
            }
            return response.json();
        })
        .then(mediciones => {
            if (mediciones && mediciones.length > 0) {
                console.log("Mediciones obtenidas para la fecha:", mediciones);

                // Calcular la media de las mediciones
                const totalValor = mediciones.reduce((sum, medicion) => sum + medicion.valor, 0);
                const media = totalValor / mediciones.length;

                // Devolver tanto las mediciones como la media calculada
                return {
                    mediciones: mediciones,
                    media: media
                };
            } else {
                console.warn("No se encontraron mediciones para la fecha seleccionada.");
                return {
                    mediciones: [],
                    media: 0
                }; // Devolver mediciones vacías y media como 0
            }
        })
        .catch(error => {
            console.error("Error al obtener las mediciones:", error);
            // En caso de error, devolver mediciones vacías y media como 0
            return {
                mediciones: [],
                media: 0
            };
        });
}


obtenerMisSensores()
    .then(idsSensores => {
        return obtenerMedicionesPorSensores(idsSensores); // Pasar los IDs de sensores
    })
    .then(mediciones => {
        console.log("Todas las mediciones:", mediciones);
    })
    .catch(error => {
        console.error("Error en el flujo de sensores y mediciones:", error);
    });

async function obtenerMediciones() {
    try {
        const response = await fetch('http://localhost:3000/mediciones/mediciones-all'); // Asegúrate de usar la URL correcta

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }

        const mediciones = await response.json();

        // Crear el array para el mapa de calor con las coordenadas y la intensidad (valor de la medición)
        const datosHeatmap = mediciones.map(medicion => {
            return [
                medicion.latitud,         // Latitud
                medicion.longitud,        // Longitud
                medicion.valor            // Intensidad (valor de la medición)
            ];
        });

        return {mediciones, datosHeatmap}; // Devuelve los datos procesados para el mapa de calor

    } catch (error) {
        console.error('Error al obtener las mediciones:', error);
        return [];  // Devuelve un array vacío si ocurre un error
    }
}



