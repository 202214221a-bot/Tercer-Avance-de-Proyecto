// ============================================================
//  Pearl Smile - javascrip.js
//  Manipulación del DOM: navbar, formulario, modal, animaciones
// ============================================================


// ── 1. NAVBAR: resaltar enlace activo según la página actual ──────────────────
(function resaltarNavActivo() {
    const pagina = window.location.pathname.split('/').pop() || 'index.html';
    const enlaces = document.querySelectorAll('.menu a');

    enlaces.forEach(function(enlace) {
        const href = enlace.getAttribute('href');
        if (href === pagina) {
            enlace.classList.add('activo');
        }
    });
})();


// ── 2. NAVBAR: efecto de fondo al hacer scroll ────────────────────────────────
(function navbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 210, 255, 0.15)';
            navbar.style.background = 'rgba(2, 12, 15, 0.97)';
        } else {
            navbar.style.boxShadow = 'none';
            navbar.style.background = 'rgb(2, 12, 15)';
        }
    });
})();


// ── 3. ANIMACIÓN: aparición suave de elementos al entrar en pantalla ─────────
(function animarAlScroll() {
    const elementos = document.querySelectorAll(
        '.servicio-card, .contacto-card, .nosotros-contenedor, .equipo-card, .stat-card'
    );

    if (elementos.length === 0) return;

    // Estilo inicial: oculto y desplazado hacia abajo
    elementos.forEach(function(el) {
        el.style.opacity    = '0';
        el.style.transform  = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    const observador = new IntersectionObserver(function(entradas) {
        entradas.forEach(function(entrada) {
            if (entrada.isIntersecting) {
                entrada.target.style.opacity   = '1';
                entrada.target.style.transform = 'translateY(0)';
                observador.unobserve(entrada.target);   // solo se activa una vez
            }
        });
    }, { threshold: 0.15 });

    elementos.forEach(function(el) {
        observador.observe(el);
    });
})();


// ── 4. MODAL: ventana de información en servicios.html ────────────────────────
(function iniciarModal() {
    const modal         = document.getElementById('modal-servicio');
    const overlay       = document.getElementById('overlay-modal');
    const modalTitulo   = document.getElementById('modal-titulo');
    const modalDescripcion = document.getElementById('modal-descripcion');
    const cerrarBtn     = document.getElementById('cerrar-modal');
    const botones       = document.querySelectorAll('.btn-info');

    if (!modal) return;  // solo ejecuta en servicios.html

    // Abrir modal al hacer clic en "Más Información"
    botones.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const titulo      = btn.getAttribute('data-titulo');
            const descripcion = btn.getAttribute('data-descripcion');

            modalTitulo.textContent      = titulo;
            modalDescripcion.textContent = descripcion;

            modal.classList.remove('oculto');
            overlay.classList.remove('oculto');
            document.body.style.overflow = 'hidden';   // bloquea el scroll
        });
    });

    // Cerrar modal con el botón ✕
    cerrarBtn.addEventListener('click', cerrarModal);

    // Cerrar modal al hacer clic en el overlay
    overlay.addEventListener('click', cerrarModal);

    // Cerrar modal con la tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') cerrarModal();
    });

    function cerrarModal() {
        modal.classList.add('oculto');
        overlay.classList.add('oculto');
        document.body.style.overflow = '';
    }
})();


// ── 5. FORMULARIO: validación y mensaje de éxito en contacto.html ─────────────
(function validarFormulario() {
    const formulario   = document.getElementById('formulario-contacto');
    if (!formulario) return;  // solo ejecuta en contacto.html

    const inputNombre  = document.getElementById('input-nombre');
    const inputCorreo  = document.getElementById('input-correo');
    const inputMensaje = document.getElementById('input-mensaje');
    const errorNombre  = document.getElementById('error-nombre');
    const errorCorreo  = document.getElementById('error-correo');
    const errorMensaje = document.getElementById('error-mensaje');
    const mensajeExito = document.getElementById('mensaje-exito');
    const btnEnviar    = document.getElementById('btn-enviar');

    formulario.addEventListener('submit', function(e) {
        e.preventDefault();   // evita que recargue la página
        let valido = true;

        // --- Validar nombre ---
        if (inputNombre.value.trim().length < 3) {
            mostrarError(errorNombre, 'El nombre debe tener al menos 3 caracteres.');
            valido = false;
        } else {
            limpiarError(errorNombre);
        }

        // --- Validar correo ---
        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexCorreo.test(inputCorreo.value.trim())) {
            mostrarError(errorCorreo, 'Ingresa un correo electrónico válido.');
            valido = false;
        } else {
            limpiarError(errorCorreo);
        }

        // --- Validar mensaje ---
        if (inputMensaje.value.trim().length < 10) {
            mostrarError(errorMensaje, 'El mensaje debe tener al menos 10 caracteres.');
            valido = false;
        } else {
            limpiarError(errorMensaje);
        }

        // --- Si todo es válido, mostrar éxito ---
        if (valido) {
            btnEnviar.textContent  = 'Enviando...';
            btnEnviar.disabled     = true;

            // Simula un envío con un pequeño retraso
            setTimeout(function() {
                formulario.reset();
                btnEnviar.textContent = 'Enviar Mensaje';
                btnEnviar.disabled    = false;
                mensajeExito.classList.remove('oculto');

                // Oculta el mensaje de éxito después de 5 segundos
                setTimeout(function() {
                    mensajeExito.classList.add('oculto');
                }, 5000);
            }, 1000);
        }
    });

    function mostrarError(elemento, mensaje) {
        elemento.textContent = mensaje;
        elemento.style.display = 'block';
    }

    function limpiarError(elemento) {
        elemento.textContent   = '';
        elemento.style.display = 'none';
    }
})();


// ── 6. CONTADORES ANIMADOS: estadísticas en nosotros.html ─────────────────────
(function animarContadores() {
    const contadores = document.querySelectorAll('.stat-numero');
    if (contadores.length === 0) return;

    const observador = new IntersectionObserver(function(entradas) {
        entradas.forEach(function(entrada) {
            if (entrada.isIntersecting) {
                const elemento = entrada.target;
                const objetivo = parseInt(elemento.getAttribute('data-target'));
                let actual     = 0;
                const duracion = 1500;  // milisegundos
                const paso     = Math.ceil(objetivo / (duracion / 16));

                const intervalo = setInterval(function() {
                    actual += paso;
                    if (actual >= objetivo) {
                        actual = objetivo;
                        clearInterval(intervalo);
                    }
                    elemento.textContent = actual.toLocaleString('es-PE') + '+';
                }, 16);

                observador.unobserve(elemento);
            }
        });
    }, { threshold: 0.5 });

    contadores.forEach(function(contador) {
        observador.observe(contador);
    });
})();


// ── 7. GALERÍA: mensaje en consola para confirmar carga ───────────────────────
(function verificarGaleria() {
    const tarjetas = document.querySelectorAll('.tarjeta');
    if (tarjetas.length > 0) {
        console.log('Galería cargada: ' + tarjetas.length + ' tarjetas encontradas.');
    }
})();

const botonWhatsApp = document.querySelector(".whatsapp");

botonWhatsApp.addEventListener("click", () => {
  console.log("El usuario hizo clic en el botón de WhatsApp.");
});

// Imagen inicial
const imagenInicial =
  "https://clinicadentalpalomero.com/wp-content/uploads/2022/04/Como-escoger-tu-clinica-dental-y-no-equivocarte-e1649311377363.jpg";

// Imagen al pasar el mouse
const imagenMouse =
  "https://dentalplanetperu.com/wp-content/uploads/2017/02/mejor-clinica-dental-miraflores-lima-peru.jpg";

// Cambiar imagen
function cambiarImagen() {
  const imagen = document.getElementById("imagen");

  imagen.src = imagenMouse;
  imagen.alt = "Atención dental profesional";
}

// Volver imagen original
function volverImagen() {
  const imagen = document.getElementById("imagen");

  imagen.src = imagenInicial;
  imagen.alt = "Clínica dental moderna";
}