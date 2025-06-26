//ts-check

const studentService = require("../services/studentService");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const getAllStudents = async (req, res) => {
  try {
    const result = await studentService.getAllStudents();
    return res.status(200).json({
      success: true,
      message: "Cursos obtenidos correctamente",
      data: result,
    });
  } catch (error) {
    console.error("Error en getAllStudents:", error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener estudiantes",
    });
  }
};

const registerStudent = async (req, res) => {
  const { dni, nombre_completo, estado, carrera_id } = req.body;

  let foto_url = null;

  try {
    // Si hay archivo, subir a Cloudinary
    if (req.file) {
      const streamUpload = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "estudiantes",
              resource_type: "image",
            },
            (error, result) => {
              if (result) {
                resolve(result.secure_url);
              } else {
                reject(error);
              }
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };

      foto_url = await streamUpload(); // URL de la imagen
    }

    // Registro del estudiante (con o sin imagen)
    const result = await studentService.registerStudent({
      dni,
      nombre_completo,
      estado,
      carrera_id,
      foto_url,
    });

    return res.status(200).json({
      success: true,
      message: "Estudiante registrado correctamente",
      data: result,
    });
  } catch (error) {
    console.error("Error en registerStudent:", error);
    return res.status(500).json({
      success: false,
      message: "Error al registrar estudiante",
    });
  }
};
const updateStudent = async (req, res) => {
  const { persona_id, estado, carrera_id } = req.body;

  try {
    const result = await studentService.updateStudent({
      persona_id,
      estado,
      carrera_id,
    });

    return res.status(200).json({
      success: true,
      message: "Estudiante actualizado correctamente",
      data: result,
    });
  } catch (error) {
    console.error("Error en updateStudent:", error);
    return res.status(500).json({
      success: false,
      message: "Error al actualizar estudiante",
    });
  }
};

module.exports = {
  getAllStudents,
  registerStudent,
  updateStudent,
};
