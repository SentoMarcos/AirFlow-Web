# AirFlow-Web API

## Descripción
Esta es una API desarrollada con Node.js que proporciona funcionalidades relacionadas con la gestión de datos de AirFlow. Utiliza Express como framework para manejar las solicitudes HTTP y Sequelize como ORM para gestionar la base de datos PostgreSQL.

## Requisitos previos
- [Node.js](https://nodejs.org/) (versión 14 o superior)
- [Docker](https://www.docker.com/) (opcional, para ejecución en contenedores)

## Instalación
1. Clonar este repositorio:

   ```bash
   git clone https://github.com/SentoMarcos/AirFlow-Web.git
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
### Desarrollo local
Para iniciar el servidor en local, usa el siguiente comando:

```bash
npm start
```

Esto ejecutará el archivo `index.js`, el cual es el punto de entrada de la API.

### Usar con Docker
Si prefieres ejecutar la aplicación con Docker, puedes usar el archivo `docker-compose.yml`.

Para construir y ejecutar la aplicación en un contenedor, ejecuta:

```bash
docker-compose up --build
```

## Rutas de la API
La API expone varias rutas para interactuar con los datos:

### Rutas de Usuario
- **GET /api/usuarios**: Obtener una lista de todos los usuarios.
- **POST /api/usuarios/registro**: Crear un nuevo usuario.
- **POST /api/usuarios/login**: Autenticar un usuario.
- **PUT /api/usuarios/editUsuario**: Editar un usuario existente.
- **PUT /api/usuarios/editContrasenya**: Cambiar la contraseña de un usuario.

### Rutas de Mediciones
- **POST /api/mediciones**: Crear una nueva medición.

## Estructura del proyecto
- **config/**: Contiene archivos de configuración (como la conexión a la base de datos).
- **controladores/**: Define la lógica de control para manejar las solicitudes HTTP.
- **modelos/**: Contiene los modelos de Sequelize para interactuar con la base de datos.
- **rutas/**: Define las rutas de la API.
- **public/**: Archivos públicos si se requiere servir contenido estático.
- **doc/**:  Documentacion del proyecto


## Dependencias
- **Express**: Framework para la construcción del servidor web.
- **Sequelize**: ORM para la interacción con la base de datos.
- **pg**: Cliente para PostgreSQL.
- **cors**: Para habilitar el Cross-Origin Resource Sharing (CORS).
## Autores
- [SentoMarcos](https://github.com/SentoMarcos "SentoMarcos")
- [ferrangv](https://github.com/ferrangv "ferrangv")
- [pRebollo02](https://github.com/pRebollo02 "pRebollo02")
- [RogersRogersRogers](https://github.com/RogersRogersRogers "RogersRogersRogers")
- [RubyGa22](https://github.com/RubyGa22 "RubyGa22")
## Proyectos Relacionados
- [**AirFlow Android**](https://github.com/SentoMarcos/AirFlow-Android "**AirFlow Android**")
- [**AirFlow Arduino**](https://github.com/SentoMarcos/AirFlow-Arduino "**AirFlow Arduino**")

## Contribuciones
Las contribuciones son bienvenidas. Por favor, abre un issue o envía un pull request para mejorar la API.
``