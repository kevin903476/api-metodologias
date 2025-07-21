const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const process = require('process');
const http = require('http'); 

dotenv.config();


const userRouter = require('./routes/userRouter');
const forumsRouter = require('./routes/forumsRouter');
const boardRouter = require('./routes/boardRoutes');
const accessRouter = require('./routes/accessRouter'); 
const groupRouter = require('./routes/groupRouter'); // Importing the new group router

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


const PORT = process.env.PORT || 3000;

app.use('/api', userRouter);
app.use('/api', forumsRouter);
app.use('/api', boardRouter);
app.use('/api', accessRouter);
app.use('/api', groupRouter); 
const server = http.createServer(app);
const { setSocketIO } = require('./websocket');
setSocketIO(server);

server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app;