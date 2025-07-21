const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

let io = null;

function setSocketIO(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true
    },
    path: "/socket.io/"
  });

  console.log("Socket.IO server iniciado");

  // Middleware para autenticar JWT
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return next(new Error('Token de autenticación requerido'));
      }

      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      socket.userId = decoded.id;
      socket.userName = decoded.nombre;
      socket.userEmail = decoded.correo;
      socket.userRole = decoded.rol_global;
      
      console.log(`Usuario autenticado: ${socket.userName} (${socket.userEmail})`);
      next();
    } catch (error) {
      console.error('Error de autenticación WebSocket:', error);
      next(new Error('Token inválido'));
    }
  });

  // Manejo de conexiones
  io.on('connection', (socket) => {
    console.log(`Cliente conectado: ${socket.userName} - Socket ID: ${socket.id}`);

    // Unir al usuario a la sala general de la pizarra
    socket.join('pizarra');

    // Manejar unión a pizarras específicas
    socket.on('joinBoard', (boardId) => {
      const roomName = `pizarra_${boardId}`;
      socket.join(roomName);
      console.log(`Usuario ${socket.userName} se unió a la sala ${roomName}`);
    });

    socket.on('leaveBoard', (boardId) => {
      const roomName = `pizarra_${boardId}`;
      socket.leave(roomName);
      console.log(`Usuario ${socket.userName} salió de la sala ${roomName}`);
    });

    // Enviar información del usuario conectado a otros clientes
    socket.to('pizarra').emit('userConnected', {
      userId: socket.userId,
      userName: socket.userName,
      socketId: socket.id
    });

    // Escuchar cuando se añade una nueva tarjeta
    socket.on('addCard', (cardData) => {
      const cardWithUser = {
        ...cardData,
        addedBy: {
          userId: socket.userId,
          userName: socket.userName,
          userEmail: socket.userEmail
        },
        timestamp: new Date().toISOString()
      };

      console.log(`Nueva tarjeta añadida por ${socket.userName}:`, cardWithUser);
      
      // Emitir a la sala específica de la pizarra
      const roomName = `pizarra_${cardData.pizarra_id}`;
      io.to(roomName).emit('cardAdded', cardWithUser);
      
      // También emitir a la sala general para notificaciones
      io.to('pizarra').emit('cardAddedGlobal', cardWithUser);
    });

    // Escuchar cuando se elimina una tarjeta
    socket.on('removeCard', (cardData) => {
      const removalInfo = {
        cardId: cardData.cardId,
        removedBy: {
          userId: socket.userId,
          userName: socket.userName,
          userEmail: socket.userEmail
        },
        timestamp: new Date().toISOString()
      };

      console.log(`Tarjeta eliminada por ${socket.userName}:`, removalInfo);
      
      // Emitir a todos los clientes en la sala pizarra
      io.to('pizarra').emit('cardRemoved', removalInfo);
    });

    // Escuchar actualizaciones de acceso (cuando se registra un nuevo acceso)
    socket.on('accessUpdate', () => {
      console.log(`Actualización de acceso solicitada por ${socket.userName}`);
      io.to('pizarra').emit('updateTodayAccess');
    });

    // Manejo de desconexión
    socket.on('disconnect', (reason) => {
      console.log(`Cliente desconectado: ${socket.userName} - Razón: ${reason}`);
      
      // Notificar a otros usuarios sobre la desconexión
      socket.to('pizarra').emit('userDisconnected', {
        userId: socket.userId,
        userName: socket.userName,
        socketId: socket.id
      });
    });

    // Manejo de errores
    socket.on('error', (error) => {
      console.error(`Error en socket ${socket.id}:`, error);
    });
  });

  // Manejo de errores del servidor Socket.IO
  io.on('error', (error) => {
    console.error('Error en Socket.IO server:', error);
  });

  return io;
}

function getSocketIO() {
  return io;
}

function stopSocketIO() {
  if (io) {
    console.log("Cerrando Socket.IO server");
    io.close();
    io = null;
  }
}

// Función para emitir eventos desde otros módulos
function emitToPizarra(room, event, data) {
  if (io) {
    io.to(room).emit(event, data);
    console.log(`Evento ${event} emitido a la sala ${room}:`, data);
  } else {
    console.warn('Socket.IO no está inicializado');
  }
}

module.exports = {
  setSocketIO,
  getSocketIO,
  stopSocketIO,
  emitToPizarra
};
