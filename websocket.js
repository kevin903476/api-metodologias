let wss = null;
let interval = null;

function setWSS(server) {
  const WebSocket = require('ws');
  wss = new WebSocket.Server({ server, path: "/ws" });

  console.log("WebSocket server iniciado");

  // Al conectar un nuevo cliente
  wss.on('connection', (ws) => {
    console.log("Nuevo cliente WebSocket conectado");
    ws.isAlive = true;

    // Si recibe un pong, se marca como vivo
    ws.on('pong', () => {
      ws.isAlive = true;
    });

    ws.on('close', () => {
      console.log("Cliente WebSocket desconectado");
    });
  });

  // Ping a todos los clientes cada 30s
  interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) {
        console.log("Cliente no responde, cerrando conexión");
        return ws.terminate();
      }

      ws.isAlive = false;
      ws.ping(); // envía ping al cliente
    });
  }, 30000); // cada 30 segundos
}

function getWSS() {
  return wss;
}

function stopWSS() {
  if (interval) clearInterval(interval);
  if (wss) wss.close();
}

module.exports = {
  setWSS,
  getWSS,
  stopWSS,
};
