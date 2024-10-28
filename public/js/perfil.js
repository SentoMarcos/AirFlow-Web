// Intentamos obtener los datos del usuario desde el localStorage
//const idUsuario = localStorage.getItem("idUsuario"); TODO
idUsuario = 8; // FIX
const nombre = localStorage.getItem("nombreUsuario");
const apellidos = localStorage.getItem("apellidosUsuario");
const email = localStorage.getItem("emailUsuario");
const telefono = localStorage.getItem("telefonoUsuario");

// Mostrar saludo al usuario
document.getElementById("greeting").textContent = "Hola " + nombre;

// Cargamos los datos en la tabla
const userTable = document.getElementById("userTable").getElementsByTagName('tbody')[0];

// Función para agregar una fila a la tabla
function addRow(campo, valor) {
    const row = userTable.insertRow();
    const cellCampo = row.insertCell(0);
    const cellValor = row.insertCell(1);
    cellCampo.textContent = campo;
    cellValor.textContent = valor;
}

// Agregamos los datos a la tabla
addRow("Nombre", nombre);
addRow("Apellidos", apellidos);
addRow("Correo", email);
addRow("Teléfono", telefono);

// Manejar el botón de editar
document.getElementById("editBtn").addEventListener("click", function() {
    // Ocultar la tabla y mostrar el formulario de edición
    document.getElementById("userTable").style.display = "none";
    document.getElementById("editForm").style.display = "block";

    // Cargar los datos en el formulario de edición
    document.getElementById("editNombre").value = nombre;
    document.getElementById("editApellidos").value = apellidos;
    document.getElementById("editEmail").value = email;
    document.getElementById("editTelefono").value = telefono;
});

// Función para guardar los cambios
document.getElementById("saveBtn").addEventListener("click", function() {
    const updatedData = {
        id: document.getElementById("userId").value, // Obtiene el ID del usuario
        nombre: document.getElementById("editNombre").value,
        apellidos: document.getElementById("editApellidos").value,
        email: document.getElementById("editEmail").value,
        telefono: document.getElementById("editTelefono").value,
        id: idUsuario
    };

    fetch('http://127.0.0.1:3000/usuarios/editUsuario', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error); // Muestra el error si lo hay
        } else {
            alert(data.message); // Muestra el mensaje de éxito
            //location.reload(); // Recarga la página para mostrar los cambios
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
