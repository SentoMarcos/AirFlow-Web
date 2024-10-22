- Crear usuario: POST
http://localhost:3000/usuarios

{
  "nombre": "Juan",
  "apellidos": "Pérez",
  "email": "juan.perez@example.com",
  "telefono": "123456789",
  "contrasenya": "securepassword"
}

- Obtener todos los usuarios: GET
http://localhost:3000/usuarios

- Crear mediciones: POST
http://localhost:3000/mediciones

{
  "valor": 23.5,
  "fecha": "2024-10-22T12:00:00Z",
  "latitud": 40.7128,
  "longitud": -74.0060
}


