//@ts-check
const AccessService = require("../services/accessService");
const { getWSS } = require('../websocket');


const getAllAccess = async (req, res) => {
  try {
    const result = await AccessService.getAllAccess();
    return res.status(200).json({
      success: true,
      message: "Accesos obtenidos correctamente",
      data: result,
    });
  } catch (error) {
    console.error("Error en getAllAccess:", error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener accesos",
    });
  }
};

const getTodayAccess = async (req, res) => {
  try {
    const result = await AccessService.getTodayAccess();
    return res.status(200).json({
      success: true,
      message: "Accesos de hoy obtenidos correctamente",
      data: result,
    });
  } catch (error) {
    console.error("Error en getTodayAccess:", error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener accesos de hoy",
    });
  }
};
const getWeekAccess = async (req, res) => {
  try {
    const result = await AccessService.getWeekAccess();
    return res.status(200).json({
      success: true,
      message: "Accesos de la semana obtenidos correctamente",
      data: result,
    });
  } catch (error) {
    console.error("Error en getTodayAccess:", error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener accesos de la semana",
    });
  }
};

async function getAccessByDni(req, res) {
  const { dni } = req.body;
  try {
    const result = await AccessService.getAccessByDni(dni);
    return res.status(200).json({
      success: true,
      message: "Accesos obtenidos correctamente",
      data: result,
    });
  } catch (error) {
    console.error("Error en getAccessByDni:", error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener accesos por DNI",
    });
  }
}

async function registerAccess(req, res) {
  const { dni } = req.body;
  try {
    const result = await AccessService.registerAccess(dni);

    const wss = getWSS();
    if (wss) {
      console.log("Clientes WebSocket conectados:", wss.clients.size);
      wss.clients.forEach(client => {
        if (client.readyState === 1) {
          console.log("Enviando mensaje a cliente WebSocket");
          client.send(JSON.stringify({ type: "updateTodayAccess" }));
        }
      });
    } else {
      console.warn("WebSocket server no inicializado");
    }

    return res.status(200).json({
      success: true,
      message: "Acceso registrado correctamente",
      data: result,
    });
  } catch (error) {
    console.error("Error en registerAccess:", error);
    return res.status(500).json({
      success: false,
      message: "Error al registrar acceso",
    });
  }
}


async function getAccessByDate(req, res) {
  const { fecha } = req.query;
  
  if (!fecha) {
    return res.status(400).json({
      success: false,
      message: "El parámetro 'fecha' es requerido"
    });
  }

  try {
    const result = await AccessService.getAccessByDate(fecha);
    return res.status(200).json({
      success: true,
      message: "Accesos por fecha obtenidos correctamente",
      data: result
    });
  } catch (error) {
    console.error("Error en getAccessByDate:", error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener accesos por fecha"
    });
  }
};


module.exports = {
  getAllAccess, getTodayAccess, getAccessByDni, registerAccess,getWeekAccess,getAccessByDate
};