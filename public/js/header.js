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
