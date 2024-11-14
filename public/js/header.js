// Cargar el header externo
fetch('header.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('header-container').innerHTML = data;

        // Selecciona el header
        const header = document.querySelector('.container-fluid');

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
