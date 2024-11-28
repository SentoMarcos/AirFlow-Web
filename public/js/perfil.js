/**
 * @file perfil.js
 * @description Este archivo contiene el código JavaScript necesario para mostrar el perfil del usuario y permitirle editarlo.
 * @requires fetch
 */

/**
 * @var {string} idUsuario
 * @var {string} nombre
 * @var {string} apellidos
 * @var {string} email
 * @var {string} telefono
 * @description Intentamos obtener los datos del usuario desde el localStorage.
 * @type {string}
 **/

// Intentamos obtener los datos del usuario desde el localStorage
const idUsuario = localStorage.getItem("idUsuario");
const nombre = localStorage.getItem("nombreUsuario");
const apellidos = localStorage.getItem("apellidosUsuario");
const email = localStorage.getItem("emailUsuario");
const telefono = localStorage.getItem("telefonoUsuario");

// Mostrar saludo al usuario
/*document.getElementById("greeting").textContent = "Hola " + nombre;*/

// Cargamos los datos en la tabla
const userTable = document.getElementById("userTable").getElementsByTagName('tbody')[0];

/*******************************************************
 * @function addRow
 * @description Función para agregar una fila a la tabla.
 * @param {string} campo
 * @param {string} valor
 * @returns {void}
 *******************************************************/

/*
    texto: campo, texto: valor => addRow() <= void 
*/

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

/**
 * @function editUser
 * @description Función para manejar el botón de editar.
 * @returns {void}
 * @event editBtn
 */

/*
    editUser() => void
*/
// Manejar el botón de editar
document.getElementById("editBtn").addEventListener("click", function() {
    // Ocultar la tabla y mostrar el formulario de edición
    document.getElementById("userTable").style.display = "none";
    document.getElementById("editPassword").style.display = "none";
    document.getElementById("editForm").style.display = "block";

    document.getElementById("editBtn").style.display = "none";
    document.getElementById("editPasswordBtn").style.display = "none";

    // Cargar los datos en el formulario de edición
    document.getElementById("editNombre").value = nombre;
    document.getElementById("editApellidos").value = apellidos;
    document.getElementById("editEmail").value = email;
    document.getElementById("editTelefono").value = telefono;
});

// Función para guardar los cambios
document.getElementById("saveBtn").addEventListener("click", function() {

    // Validar campos correctos
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.getElementById("errorEdit").textContent = "El email no es válido.";
        return;
    }
    if (!/^\d{10}$/.test(telefono)) {
        document.getElementById("errorEdit").textContent = "El teléfono debe tener 10 dígitos.";
        return;
    }

    const updatedData = {
        id: idUsuario, // Utiliza la ID del localStorage
        nombre: document.getElementById("editNombre").value,
        apellidos: document.getElementById("editApellidos").value,
        email: document.getElementById("editEmail").value,
        telefono: document.getElementById("editTelefono").value,
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
                document.getElementById("errorEdit").textContent = data.error;
            } else {
                console.log("Usuario registrado con éxito");
                location.reload(); // Recarga la página para mostrar los cambios
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById("errorEdit").textContent = "Ocurrió un error al registrar el usuario.";
        });
});

/**
 * @function cancelEdit
 * @description Función para manejar el botón de cancelar.
 * @returns {void}
 * @event cancelBtn
 */

/*
    cancelEdit() => void
*/

//Función para cancelar la edición de datos.
document.getElementById("cancelEditBtn").addEventListener("click", function () {
    // Mostrar la tabla y ocultar el formulario de edición
    document.getElementById("userTable").style.display = "block";
    document.getElementById("editPassword").style.display = "none";
    document.getElementById("editForm").style.display = "none";

    document.getElementById("editBtn").style.display = "block";
    document.getElementById("editPasswordBtn").style.display = "block";
});

/**
 * @function editPassword
 * @description Función para manejar el botón de editar contraseña.
 * @returns {void}
 * @event editPasswordBtn
 */

/*
    editPassword() => void
*/
// Manejar el botón de editar contraseña
document.getElementById("editPasswordBtn").addEventListener("click", function () {
    // Ocultar la tabla y mostrar el formulario de edición
    document.getElementById("userTable").style.display = "none";
    document.getElementById("editPassword").style.display = "block";
    document.getElementById("editForm").style.display = "none";

    document.getElementById("editBtn").style.display = "none";
    document.getElementById("editPasswordBtn").style.display = "none";
});

// Función para guardar los cambios de contraseña
document.getElementById("savePasswordBtn").addEventListener("click", function () {
    const password= document.getElementById("inputPassword").value;
    const newPassword1= document.getElementById("newPassword1").value;
    const newPassword2= document.getElementById("newPassword2").value;

    // Validar campos correctos
    if (!/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_.\-:])[a-zA-Z0-9!@#$%^&*_.\-:]{6,16}$/.test(newPassword1)) {
        document.getElementById("errorPasswordEdit").textContent = "La contraseña debe tener entre 6 y 16 caracteres e incluir al menos: una letra mayúscula, un número, y un carácter especial (!@#$%^&*_.-:).";
        return;
    }
    if (newPassword1 != newPassword2) {
        document.getElementById("errorPasswordEdit").textContent = "Las contraseñas no coinciden.";
        return;
    }
    if (!idUsuario) {
        console.error("ID del usuario no encontrada en localStorage");
        return;
    }

    const updatedData = {
        id: idUsuario, // Utiliza la ID del localStorage
        password: password,
        newPassword: newPassword1
    };

    fetch('http://127.0.0.1:3000/usuarios/editContrasenya', {
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
                document.getElementById("errorPasswordEdit").textContent = data.error;
            } else {
                console.log("Contraseña cambiada con éxito");
                document.getElementById("confirmMessage").textContent = "Contraseña cambiada con éxito";
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById("errorPasswordEdit").textContent = "Ocurrió un error al cambiar la contraseña.";
        });
});

/**
 * @function cancelPasswordEdit
 * @description Función para manejar el botón de cancelar.
 * @returns {void}
 * @event cancelBtn
 */

/*
    cancelEdit() => void
*/

//Función para cancelar la edición de contraseña.
document.getElementById("cancelPasswordBtn").addEventListener("click", function () {
    // Mostrar la tabla y ocultar el formulario de edición
    document.getElementById("userTable").style.display = "block";
    document.getElementById("editPassword").style.display = "none";
    document.getElementById("editForm").style.display = "none";

    document.getElementById("editBtn").style.display = "block";
    document.getElementById("editPasswordBtn").style.display = "block";

    // Opcional: Restablecer los valores de los campos
    document.getElementById("inputPassword").value = "";
    document.getElementById("newPassword1").value = "";
    document.getElementById("newPassword2").value = "";
});