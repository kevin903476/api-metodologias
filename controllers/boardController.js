//@ts-check
const { emitToPizarra } = require('../websocket');

const addCardToPizarra = async (req, res) => {
  try {
    const { title, content, category, priority } = req.body;
    const userId = req.user.id; 
    const userName = req.user.nombre;
    const userEmail = req.user.correo;
    
    const cardData = {
      id: Date.now(),
      title,
      content,
      category: category || 'pendiente',
      priority: priority || 'normal',
      addedBy: {
        userId,
        userName,
        userEmail
      },
      timestamp: new Date().toISOString()
    };

    // Emitir el evento a todos los clientes conectados
    emitToPizarra('cardAdded', cardData);

    console.log(`Nueva tarjeta añadida por ${userName}:`, cardData);

    return res.status(200).json({
      success: true,
      message: "Tarjeta añadida correctamente",
      data: cardData,
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
    
    const removalInfo = {
      cardId,
      removedBy: {
        userId,
        userName,
        userEmail
      },
      timestamp: new Date().toISOString()
    };

    // Emitir el evento a todos los clientes conectados
    emitToPizarra('cardRemoved', removalInfo);

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

module.exports = {
  addCardToPizarra,
  removeCardFromPizarra
};