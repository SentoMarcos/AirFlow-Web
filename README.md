# AirFlow-Web API
## Descripción
Esta es una API desarrollada con Node.js que provee funcionalidades relacionadas con la gestión de datos de AirFlow. Utiliza Express como framework para manejar las solicitudes HTTP y Sequelize como ORM para gestionar la base de datos PostgreSQL.

## Requisitos previos
- Node.js (versión 14 o superior)

- Docker (opcional, para ejecución en contenedores)

## Instalación
1. Clonar este repositorio:

   ```bash
   git clone <URL_DEL_REPOSITORIO>
   ```
2. Ir al directorio del proyecto:

    ```bash
    cd AirFlow-Web
    ```

3. Instalar las dependencias:

   ```bash
   npm install
   ```

## Uso
#### Desarrollo local
Para iniciar el servidor en local, usa el siguiente comando:

   ```bash
   npm start
   ```
Esto ejecutará el archivo index.js, el cual es el punto de entrada de la API.

#### Usar con Docker
Si prefieres ejecutar la aplicación con Docker, puedes usar el archivo docker-compose.yml.

Para construir y ejecutar la aplicación en un contenedor, ejecuta:

   ```bash
   docker-compose up --build
   ```
## Rutas de la API
La API expone varias rutas para interactuar con los datos:

- GET /api/airflows: Obtener una lista de todos los datos de AirFlow.

- POST /api/airflows: Crear un nuevo registro de AirFlow.

- PUT /api/airflows/id: Actualizar un registro existente por su ID.

- DELETE /api/airflows/id: Eliminar un registro por su ID.

## Estructura del proyecto
- config/: Contiene archivos de configuración (como la conexión a la base de datos).

- controladores/: Define la lógica de control para manejar las solicitudes HTTP.

- modelos/: Contiene los modelos de Sequelize para interactuar con la base de datos.

- rutas/: Define las rutas de la API.

- public/: Archivos públicos si se requiere servir contenido estático.

## Dependencias
- Express: Framework para la construcción del servidor web.

- Sequelize: ORM para la interacción con la base de datos.

- pg: Cliente para PostgreSQL.

- cors: Para habilitar el Cross-Origin Resource Sharing (CORS).
