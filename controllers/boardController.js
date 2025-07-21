//@ts-check
const { emitToPizarra } = require('../websocket');
const BoardService = require('../services/boardService');

const getAllPizarras = async (req, res) => {
  try {
    const result = await BoardService.getAllPizarras();
    return res.status(200).json({
      success: true,
      message: "Pizarras obtenidas correctamente",
      data: result,
    });
  } catch (error) {
    console.error("Error al obtener pizarras:", error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener pizarras",
    });
  }
};

const getPizarraById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await BoardService.getPizarraById(id);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Pizarra no encontrada",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Pizarra obtenida correctamente",
      data: result,
    });
  } catch (error) {
    console.error("Error al obtener pizarra:", error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener pizarra",
    });
  }
};

const getTarjetasByPizarra = async (req, res) => {
  try {
    const { pizarraId } = req.params;
    const result = await BoardService.getTarjetasByPizarra(pizarraId);
    
    return res.status(200).json({
      success: true,
      message: "Tarjetas obtenidas correctamente",
      data: result,
    });
  } catch (error) {
    console.error("Error al obtener tarjetas:", error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener tarjetas",
    });
  }
};

const addCardToPizarra = async (req, res) => {
  try {
    const { pizarra_id, titulo, contenido } = req.body;
    const userId = req.user.id; 
    
    // Guardar en la base de datos
    const tarjetaData = await BoardService.createTarjeta({
      pizarra_id,
      titulo,
      contenido,
      creado_por: userId
    });

    // NO emitir aquí - el evento se emite desde websocket.js cuando el frontend hace socket.emit('addCard')
    // La emisión duplicada se evita para que el manejo sea consistente desde websocket.js

    console.log(`Tarjeta guardada en BD - ID: ${tarjetaData.id}, Pizarra: ${pizarra_id}`);

    return res.status(200).json({
      success: true,
      message: "Tarjeta añadida correctamente",
      data: tarjetaData,
    });
  } catch (error) {
    console.error("Error al añadir tarjeta:", error);
    return res.status(500).json({
      success: false,
      message: "Error al añadir tarjeta",
      error: error.message
    });
  }
};

const removeCardFromPizarra = async (req, res) => {
  try {
    const { cardId } = req.params;
    const userId = req.user.id;
    const userName = req.user.nombre;
    const userEmail = req.user.correo;
    
    // Eliminar de la base de datos
    const deletedCard = await BoardService.deleteTarjeta(cardId);
    
    if (!deletedCard.deleted) {
      return res.status(404).json({
        success: false,
        message: "Tarjeta no encontrada",
      });
    }

    const removalInfo = {
      cardId: deletedCard.id,
      pizarra_id: deletedCard.pizarra_id,
      removedBy: {
        userId,
        userName,
        userEmail
      },
      timestamp: new Date().toISOString()
    };

    // Emitir el evento a todos los clientes conectados a esta pizarra
    emitToPizarra(`pizarra_${deletedCard.pizarra_id}`, 'cardRemoved', removalInfo);

    console.log(`Tarjeta eliminada por ${userName}:`, removalInfo);

    return res.status(200).json({
      success: true,
      message: "Tarjeta eliminada correctamente",
      data: removalInfo
    });
  } catch (error) {
    console.error("Error al eliminar tarjeta:", error);
    return res.status(500).json({
      success: false,
      message: "Error al eliminar tarjeta",
      error: error.message
    });
  }
};

const createPizarra = async (req, res) => {
  try {
    const { grupo_id, titulo, descripcion } = req.body;
    const userId = req.user.id;
    const userName = req.user.nombre;
    
    const result = await BoardService.createPizarra({
      grupo_id,
      titulo,
      descripcion,
      creado_por: userId
    });

    // Obtener los datos completos de la pizarra recién creada
    const newPizarra = await BoardService.getPizarraById(result.insertId);

    if (newPizarra) {
      // Emitir evento global para notificar nueva pizarra
      emitToPizarra('pizarra', 'pizarraCreated', {
        id: newPizarra.id,
        titulo: newPizarra.titulo,
        descripcion: newPizarra.descripcion,
        grupo_id: newPizarra.grupo_id,
        nombre_grupo: newPizarra.nombre_grupo,
        creador: userName,
        creado_en: newPizarra.creado_en
      });

      console.log(`Nueva pizarra creada por ${userName}: ${titulo}`);
    }

    return res.status(201).json({
      success: true,
      message: "Pizarra creada correctamente",
      data: result,
    });
  } catch (error) {
    console.error("Error al crear pizarra:", error);
    return res.status(500).json({
      success: false,
      message: "Error al crear pizarra",
      error: error.message
    });
  }
};

module.exports = {
  getAllPizarras,
  getPizarraById,
  getTarjetasByPizarra,
  addCardToPizarra,
  removeCardFromPizarra,
  createPizarra
};