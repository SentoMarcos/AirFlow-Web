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
            const idSensores = sensores.map(sensor => sensor.id_sensor); // Asegúrate de usar 'id_sensor'
            return idSensores; // Devolver solo los IDs de los sensores
        })
        .catch(error => {
            console.error("Error al obtener los sensores:", error);
            return []; // Devolver un array vacío en caso de error
        });
}

function obtenerMedicionesPorSensores(idSensores) {
    if (!Array.isArray(idSensores) || idSensores.length === 0) {
        console.log("No se han proporcionado sensores.");
        return Promise.resolve([]); // Devolver una promesa resuelta con un array vacío
    }

    return fetch("http://localhost:3000/mediciones/mediciones-por-sensor", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ sensores: idSensores }) // Pasar como un array de IDs
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

function obtenerMedicionesPorFecha(idSensores, fechaSeleccionada) {
    if (!Array.isArray(idSensores) || idSensores.length === 0) {
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
            sensores: idSensores,
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

/*
obtenerMisSensores()
    .then(idSensores => {
        if (idSensores.length === 0) {
            console.log("No se detectaron sensores. Continuando con flujo vacío.");
            return []; // Pasar un array vacío para no interrumpir el flujo
        }
        return obtenerMedicionesPorSensores(idSensores);
    })
    .then(mediciones => {
        if (mediciones.length === 0) {
            console.log("No se han encontraron mediciones.");
        } else {
            console.log("Todas las mediciones:", mediciones);
        }
    })
    .catch(error => {
        console.error("Error en el flujo de sensores y mediciones:", error);
    });*/

async function obtenerMediciones() {
    try {
        const response = await fetch('http://192.168.1.42:3000/mediciones/mediciones-all');

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }

        const mediciones = await response.json();

        // Procesar los datos para el mapa de calor por capas
        const datosPorGas = {
            general: [],
            CO2: [],
            NO2: [],
            O3: [],
        }

        mediciones.forEach(element => {
            const punto = [element.latitud, element.longitud, element.valor];

            // Validar que tipo_gas tenga un valor válido (no undefined, null, o vacío)
            const gas = element.tipo_gas && element.tipo_gas.trim(); // Asegurarse que no sea undefined, null o vacío

            // Asegurarse de que tipo_gas tiene un valor válido
            if (!gas) {
                console.warn(`Tipo de gas no reconocido: ${element.tipo_gas}`);
                return; // Si no hay un tipo de gas, se ignora esta medición
            }

            // Agregar el punto al array correspondiente según el tipo de gas
            datosPorGas.general.push(punto);

            //Calificar el tipo de gas
            switch (gas) {
                case 'CO2':
                    datosPorGas.CO2.push(punto);
                    break;
                case 'NO2':
                    datosPorGas.NO2.push(punto);
                    break;
                case 'O3':
                    datosPorGas.O3.push(punto);
                    break;
                default:
                    console.warn(`Tipo de gas no reconocido: ${element.tipo_gas}`);
                    break;
            }
        });

        return {mediciones, datosPorGas}; // Devuelve los datos procesados para el mapa de calor

    } catch (error) {
        console.error('Error al obtener las mediciones:', error);
        return { mediciones: [], datosPorGas: {} };  // Devuelve un array vacío si ocurre un error
    }
}



