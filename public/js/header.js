// Cargar el header externo
// -----------------------------------------
//archivo:texto,elemento:texto----->cargarHeader()
function cargarHeader(string, elemento) {
    fetch(string)
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-container').innerHTML = data;

            // Selecciona el header
            const header = document.querySelector('.container-fluid');
            const anterior = document.getElementsByClassName('active');
            for (let i = 0; i < anterior.length; i++) {
                anterior[i].classList.remove('active');
            }
            document.getElementById(elemento).classList.add('active');
            // Agrega un evento para detectar el scroll
            window.addEventListener('scroll', () => {
                if (window.scrollY > 0) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });
        })
        .catch(error => console.error('Error al cargar el header:', error));
}

document.addEventListener("DOMContentLoaded", () => {
    // Seleccionamos los íconos del menú
    const menuIcon = document.getElementById("menu-icon");
    const hoverIcon = document.getElementById("menu-icon-hover");
    const clickIcon = document.getElementById("menu-icon-click");

    // Seleccionamos el submenú
    const submenu = document.getElementById("submenu");

    // Estado para controlar si el menú está abierto o cerrado
    let menuOpen = false;

    // Al hacer clic en el ícono de menú
    menuIcon.addEventListener("click", () => {
        toggleMenu();
    });

    // Al hacer clic en el ícono de "Menú Click"
    clickIcon.addEventListener("click", () => {
        toggleMenu();
    });

    // Función para alternar el menú
    function toggleMenu() {
        if (menuOpen) {
            // Si el menú está abierto, lo cerramos
            menuIcon.style.opacity = "1";
            hoverIcon.style.opacity = "0";
            clickIcon.style.opacity = "0";
            submenu.style.display = "none"; // Ocultamos el submenú
        } else {
            // Si el menú está cerrado, lo mostramos
            menuIcon.style.opacity = "0";
            hoverIcon.style.opacity = "0";
            clickIcon.style.opacity = "1";
            submenu.style.display = "block"; // Mostramos el submenú
        }

        // Alternamos el estado
        menuOpen = !menuOpen;
    }

    // Hover sobre el menú
    menuIcon.addEventListener("mouseenter", () => {
        if (!menuOpen) {
            menuIcon.style.opacity = "0";
            hoverIcon.style.opacity = "1";
        }
    });

    menuIcon.addEventListener("mouseleave", () => {
        if (!menuOpen) {
            menuIcon.style.opacity = "1";
            hoverIcon.style.opacity = "0";
        }
    });
});









