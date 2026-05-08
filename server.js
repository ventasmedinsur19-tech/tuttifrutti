const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Configuración de la base de datos profesional (MySQL)
// Datos obtenidos de tu configuración en Hostinger
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
    console.log('Conectado a la base de datos u685372918_tuttifrutti');
});

app.use(express.static(path.join(__dirname, 'public')));

// Lógica de Salas y Juego en Tiempo Real
io.on('connection', (socket) => {
    console.log('Usuario conectado:', socket.id);

    socket.on('join-room', (data) => {
        const { nombre, sala } = data;
        socket.join(sala);
        console.log(`${nombre} se unió a la sala: ${sala}`);
        
        // Notificar a los demás en la sala
        socket.to(sala).emit('user-joined', nombre);
    });

    socket.on('basta', (data) => {
        // Cuando alguien dice "¡Basta!", se le avisa a toda la sala al instante
        io.to(data.sala).emit('stop-game', { ganador: data.nombre });
        
        // Guardar el ganador en la base de datos (Ranking)
        const query = 'INSERT INTO ranking (nombre, sala, puntos) VALUES (?, ?, ?)';
        db.query(query, [data.nombre, data.sala, 10], (err) => {
            if (err) console.error('Error al guardar puntaje:', err);
        });
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
