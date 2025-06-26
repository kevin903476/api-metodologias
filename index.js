const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const process = require('process');
const http = require('http'); 

const studentRoutes = require('./routes/studentRoutes');
const accessRoutes = require('./routes/accessRouter');

dotenv.config();

const app = express();


app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.status(200).json({ message: 'API funcionando correctamente' });
});


app.use('/student', studentRoutes);
app.use('/access', accessRoutes);




const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const { setWSS } = require('./websocket');
setWSS(server); // inicializa el WebSocket

server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app;