const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');

// Servir archivos estáticos (el HTML que haremos después)
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('<h1>¡Servidor de TuttiFrutti Funcionando!</h1>');
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log('Servidor corriendo en puerto ' + PORT);
});
