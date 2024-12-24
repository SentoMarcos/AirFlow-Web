exports.getMapaConfig = async (req, res) => {
    try {
        const mapaConfig = {
            center: [51.505, -0.09], // Coordenadas iniciales
            zoom: 13,               // Nivel de zoom inicial
            tileLayer: {
                url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', // URL del mapa base
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

exports.getMapaHtml = async (req, res) => {
    try {
        const mapaConfig = {
            center: [51.505, -0.09], // Coordenadas iniciales
            zoom: 13,               // Nivel de zoom inicial
            tileLayer: {
                url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', // URL del mapa base
                attribution: '© OpenStreetMap contributors'              // Atribución del mapa base
            },
            zoomControl: false      // Control de zoom deshabilitado
        };

        // Generar el HTML dinámico
        const html = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Mapa Leaflet</title>
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
            <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
            <style>
                body, html {
                    margin: 0;
                    padding: 0;
                    width: 100%;
                    height: 100%;
                }
                #mapa {
                    height: 100%;
                }
            </style>
        </head>
        <body>
            <div id="mapa"></div>
            <script>
                // Configuración del mapa
                const mapaConfig = ${JSON.stringify(mapaConfig)};

                // Inicializar el mapa
                const map = L.map('mapa', { zoomControl: mapaConfig.zoomControl })
                    .setView(mapaConfig.center, mapaConfig.zoom);

                // Capa base
                L.tileLayer(mapaConfig.tileLayer.url, {
                    attribution: mapaConfig.tileLayer.attribution
                }).addTo(map);
            </script>
        </body>
        </html>
        `;

        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(html);
    } catch (error) {
        console.error("Error al generar el HTML del mapa:", error);
        res.status(500).json({ error: 'Error al generar el HTML del mapa.' });
    }
};

