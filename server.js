const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Configuración de conexión a MySQL de Hostinger
const db = mysql.createConnection({
    host: 'localhost',
    user: 'u685372918_tuttifrutti',
    password: 'Tuttifrutti26!', 
    database: 'u685372918_tuttifrutti'
});

db.connect((err) => {
    if (err) {
        console.error('Error conectando a MySQL:', err);
        return;
    }
    console.log('Base de datos conectada correctamente');
});

app.use(express.static(path.join(__dirname, 'public')));

// Letras permitidas para el juego
const letrasValidas = "ABCDEFGHILMNOPQRSTUV";

io.on('connection', (socket) => {
    console.log('Nueva conexión:', socket.id);

    // Unirse a una sala específica
    socket.on('join-room', (data) => {
        socket.join(data.sala);
        console.log(`${data.nombre} entró a la sala: ${data.sala}`);
    });

    // Iniciar ronda y repartir letra a la sala
    socket.on('empezar-ronda', (data) => {
        const letraRandom = letrasValidas[Math.floor(Math.random() * letrasValidas.length)];
        // Enviamos la letra solo a los miembros de esa sala
        io.to(data.sala).emit('ronda-iniciada', letraRandom);
    });

    // Evento de ¡BASTA!
    socket.on('basta', (data) => {
        // Bloqueamos a todos en la sala
        io.to(data.sala).emit('stop-game', { ganador: data.nombre });
        
        // Guardamos el registro profesional en la base de datos
        const sql = 'INSERT INTO ranking (nombre, sala, puntos) VALUES (?, ?, ?)';
        db.query(sql, [data.nombre, data.sala, 100], (err) => {
            if (err) console.error('Error al insertar en ranking:', err);
        });
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log('Servidor Tutti Frutti Pro corriendo en puerto ' + PORT);
});
