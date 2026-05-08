const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('Alguien se conectó');

  socket.on('nuevo-jugador', (nombre) => {
    console.log(nombre + ' se unió al juego');
  });

  socket.on('presionó-basta', () => {
    // Esto le avisa a TODOS los que estén conectados
    io.emit('bloquear-todo');
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log('Servidor de TuttiFrutti listo');
});
