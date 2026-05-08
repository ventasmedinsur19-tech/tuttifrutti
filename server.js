const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

let gameState = {
    letra: "",
    jugadores: {},
    juegoActivo: false
};

const letras = "ABCDEFGHIJKLMNOPRSTUV";

io.on('connection', (socket) => {
    // Al conectarse, enviamos el estado actual al nuevo jugador
    socket.emit('init', gameState);

    socket.on('unirse', (nombre) => {
        gameState.jugadores[socket.id] = { nombre, listo: true };
        io.emit('actualizar-jugadores', Object.values(gameState.jugadores));
    });

    socket.on('empezar-ronda', () => {
        if (!gameState.juegoActivo) {
            gameState.juegoActivo = true;
            gameState.letra = letras[Math.floor(Math.random() * letras.length)];
            io.emit('ronda-iniciada', gameState.letra);
        }
    });

    socket.on('basta', () => {
        gameState.juegoActivo = false;
        io.emit('bloquear-y-recaudar', { ganador: gameState.jugadores[socket.id]?.nombre });
    });

    socket.on('disconnect', () => {
        delete gameState.jugadores[socket.id];
        io.emit('actualizar-jugadores', Object.values(gameState.jugadores));
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Puerto: ${PORT}`));
