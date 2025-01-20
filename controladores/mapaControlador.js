exports.getMapaConfig = async (req, res) => {
    try {
        const mapaConfig = {
            center: [39.4699, -0.3763], // Coordenadas iniciales
            zoom: 10,               // Nivel de zoom inicial
            maxZoom: 19,            // Nivel de zoom máximo
            tileLayer: {
                url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', // URL del mapa base
                attribution: '© OpenStreetMap contributors'              // Atribución del mapa base
            },
            zoomControl: false      // Control de zoom deshabilitado
        };

        res.status(200).json(mapaConfig);
    } catch (error) {
        console.error("Error al obtener la configuración del mapa:", error);
        res.status(500).json({ error: 'Error al obtener la configuración del mapa.' });
    }
};

// Preguntar Rubén
const express = require('express');

// Preguntar Rubén
const path = require('path');
const app = express();

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, '../public')));
exports.getMapaHtml = async (req, res) => {
    try {
        // Definir la ruta completa del archivo HTML en tu proyecto
        const htmlFilePath = path.join(__dirname, '../public', 'airflow-movil.html');  // Ajusta la ruta si es necesario

        // Enviar el archivo HTML como respuesta
        res.sendFile(htmlFilePath, (err) => {
            if (err) {
                console.error("Error al cargar el archivo HTML:", err);
                return res.status(500).json({ error: 'Error al cargar el archivo HTML.' });
            }
        });
    } catch (error) {
        console.error("Error al cargar el HTML:", error);
        res.status(500).json({ error: 'Error al cargar el HTML del mapa.' });
    }
};

