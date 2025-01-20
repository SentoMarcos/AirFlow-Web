- Crear mediciones: POST
http://localhost:3000/mediciones

{
  "valor": 23.5,
  "fecha": "2024-10-22T12:00:00Z",
  "latitud": 40.7128,
  "longitud": -74.0060
}
### Crear usuario
POST http://localhost:3000/usuarios/registro
Content-Type: application/json

{
  "nombre": "Juan",
  "apellidos": "Pérez",
  "email": "juan.perez@example.com",
  "telefono": "123456789",
  "contrasenya": "securepassword"
}

### Obtener usuarios
GET http://localhost:3000/usuarios

### Login usuario
POST http://localhost:3000/usuarios/login
Content-Type: application/json

{
  "email": "juan.perez@example.com",
  "contrasenya": "securepassword"
}

### Editar usuario
PUT http://localhost:3000/usuarios/editUsuario
Content-Type: application/json

{
  "id": 3,
  "nombre": "Juanito",
  "apellidos": "Alcachofas",
  "email": "juan.perez@example.com",
  "telefono": "987654321"
}




