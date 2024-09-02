// Variables de la raqueta del jugador
let jugadorX, jugadorY, jugadorAncho, jugadorAlto;

// Variables de la raqueta de la computadora
let computadoraX, computadoraY, computadoraAncho, computadoraAlto;

// Variables de la pelota
let pelotaX, pelotaY, pelotaDiametro;
let pelotaVelocidadX, pelotaVelocidadY;
let anguloPelota = 0;  // Ángulo de rotación de la pelota
let velocidadRotacion = 0.05;  // Velocidad base de rotación

// Variables de la puntuación
let puntuacionJugador = 0;
let puntuacionComputadora = 0;

// Grosor del marco
let marcoGrosor = 10;

// Variables para las imágenes y los sonidos
let fondo, barraJugador, barraComputadora, bola;
let sonidoBounce, sonidoGameOver;

function preload() {
    // Cargar las imágenes y los sonidos
    fondo = loadImage('fondo1.png');
    barraJugador = loadImage('barra2.png');
    barraComputadora = loadImage('barra1.png');
    bola = loadImage('bola.png');
    sonidoBounce = loadSound('bounce.wav');
    sonidoGameOver = loadSound('game_over.wav');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    
    // Inicialización de la raqueta del jugador
    jugadorAncho = 10;
    jugadorAlto = windowHeight * 0.2;
    jugadorX = 15;
    jugadorY = height / 2 - jugadorAlto / 2;
    
    // Inicialización de la raqueta de la computadora
    computadoraAncho = 10;
    computadoraAlto = windowHeight * 0.2;
    computadoraX = width - 15 - computadoraAncho;
    computadoraY = height / 2 - computadoraAlto / 2;
    
    // Inicialización de la pelota
    pelotaDiametro = windowHeight * 0.05;
    pelotaX = width / 2;
    pelotaY = height / 2;
    pelotaVelocidadX = windowWidth * 0.005;
    pelotaVelocidadY = windowHeight * 0.003;
}

function draw() {
    // Dibujar la imagen de fondo
    background(fondo);
    
    // Dibujar los marcos superior e inferior
    fill(32, 178, 170); 
    rect(0, 0, width, marcoGrosor); // Marco superior
    rect(0, height - marcoGrosor, width, marcoGrosor); // Marco inferior
    
    // Dibujar las raquetas usando imágenes
    image(barraJugador, jugadorX, jugadorY, jugadorAncho, jugadorAlto);
    image(barraComputadora, computadoraX, computadoraY, computadoraAncho, computadoraAlto);
    
    // Dibujar la pelota con efecto giratorio
    push();  // Guardar el estado de la transformación
    translate(pelotaX, pelotaY);  // Mover el origen al centro de la pelota
    rotate(anguloPelota);  // Rotar el sistema de coordenadas
    imageMode(CENTER);  // Cambiar el modo de la imagen para que se dibuje desde su centro
    image(bola, 0, 0, pelotaDiametro, pelotaDiametro);
    pop();  // Restaurar el estado de la transformación

    // Incrementar el ángulo de la pelota según la velocidad
    anguloPelota += velocidadRotacion * dist(0, 0, pelotaVelocidadX, pelotaVelocidadY);
    
    // Mover la pelota
    pelotaX += pelotaVelocidadX;
    pelotaY += pelotaVelocidadY;
    
    // Rebote contra las paredes superior e inferior (excluyendo los marcos)
    if (pelotaY - pelotaDiametro / 2 <= marcoGrosor || pelotaY + pelotaDiametro / 2 >= height - marcoGrosor) {
        pelotaVelocidadY *= -1;
    }
    
    // Rebote contra la raqueta del jugador
    if (pelotaX - pelotaDiametro / 2 <= jugadorX + jugadorAncho &&
        pelotaY >= jugadorY &&
        pelotaY <= jugadorY + jugadorAlto) {
        pelotaVelocidadX *= -1.1; // Aumentar velocidad ligeramente
        velocidadRotacion += 0.01;  // Incrementar la velocidad de rotación
        sonidoBounce.play();  // Reproducir el sonido de rebote
    }
    
    // Rebote contra la raqueta de la computadora
    if (pelotaX + pelotaDiametro / 2 >= computadoraX &&
        pelotaY >= computadoraY &&
        pelotaY <= computadoraY + computadoraAlto) {
        pelotaVelocidadX *= -1.1; // Aumentar velocidad ligeramente
        velocidadRotacion += 0.01;  // Incrementar la velocidad de rotación
        sonidoBounce.play();  // Reproducir el sonido de rebote
    }
    
    // Movimiento de la raqueta del jugador con restricción
    if (keyIsDown(UP_ARROW)) {
        jugadorY -= 5;
    }
    if (keyIsDown(DOWN_ARROW)) {
        jugadorY += 5;
    }
    jugadorY = constrain(jugadorY, marcoGrosor, height - jugadorAlto - marcoGrosor);
    
    // Movimiento de la raqueta de la computadora (mejora de AI)
    let velocidadComputadora = 4; // Reducir velocidad para no ser invencible
    if (pelotaY > computadoraY + computadoraAlto / 2 + 10) {
        computadoraY += velocidadComputadora;
    } else if (pelotaY < computadoraY + computadoraAlto / 2 - 10) {
        computadoraY -= velocidadComputadora;
    }
    computadoraY = constrain(computadoraY, marcoGrosor, height - computadoraAlto - marcoGrosor);
    
    // Comprobar si la pelota sale del campo y actualizar la puntuación
    if (pelotaX - pelotaDiametro / 2 <= 0) {
        puntuacionComputadora++;
        sonidoGameOver.play();  // Reproducir el sonido de game over
        narrarMarcador();  // Narrar el marcador
        reiniciarPelota();
    }
    if (pelotaX + pelotaDiametro / 2 >= width) {
        puntuacionJugador++;
        sonidoGameOver.play();  // Reproducir el sonido de game over
        narrarMarcador();  // Narrar el marcador
        reiniciarPelota();
    }
    
    // Mostrar la puntuación
    textSize(32);
    text(puntuacionJugador, width / 4, 50);
    text(puntuacionComputadora, 3 * width / 4, 50);
}

function reiniciarPelota() {
    pelotaX = width / 2;
    pelotaY = height / 2;
    pelotaVelocidadX = pelotaVelocidadX > 0 ? windowWidth * 0.005 : -windowWidth * 0.005; // Reiniciar velocidad con el mismo sentido
    pelotaVelocidadY = random(-windowHeight * 0.003, windowHeight * 0.003); // Velocidad vertical aleatoria
    velocidadRotacion = 0.05; // Reiniciar la velocidad de rotación
    anguloPelota = 0;  // Reiniciar el ángulo de rotación
}

function narrarMarcador() {
    let mensaje = `El marcador es ${puntuacionJugador} a ${puntuacionComputadora}`;
    let utterance = new SpeechSynthesisUtterance(mensaje);
    utterance.lang = 'es-ES';  // Configurar el idioma a español
    speechSynthesis.speak(utterance);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
