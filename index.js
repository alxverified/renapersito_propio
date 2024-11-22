const express = require("express");
const axios = require("axios");

const app = express();

// La clave de autorización que se usaba en el bot
const API_KEY = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTIzLCJyb2xlIjoyLCJpYXQiOjE3MzIxOTk2MDJ9.7w-AZQUjEFZoK0-Padg3deFGfdnS6y7-PyF5fP1lTpU";

// URL de la API del RENAPER
const RENAPER_API_URL = "https://colmen-api.rgn.io/renaper/remote";

app.get("/renaper", async (req, res) => {
  const { dni, sex } = req.query;

  // Validar parámetros
  if (!dni || !sex) {
    return res.status(400).json({
      error: "Faltan parámetros. Se debe proporcionar 'dni' y 'sexo' en la URL.",
    });
  }

  // Realizar la solicitud a la API del RENAPER
  try {
    const response = await axios.post(
      RENAPER_API_URL,
      { dni, sex },
      {
        headers: {
          Authorization: API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;

    // Crear el diccionario con los datos que se devolverán en la respuesta
    const textoRespuesta = {
      creador: "@manoseable",
      id_tramite_principal: data.id_tramite_principal || "N/A",
      id_tramite_tarjeta_reimpresa: data.id_tramite_tarjeta_reimpresa || "N/A",
      ejemplar: data.ejemplar || "N/A",
      fecha_vencimiento: data.fecha_vencimiento || "N/A",
      fecha_emision: data.fecha_emision || "N/A",
      apellido: data.apellido || "N/A",
      nombres: data.nombres || "N/A",
      canal: "@dolarizada",
      fecha_nacimiento: data.fecha_nacimiento || "N/A",
      id_ciudadano: data.id_ciudadano || "N/A",
      cuil: data.cuil || "N/A",
      calle: data.calle || "N/A",
      numero: data.numero || "N/A",
      piso: data.piso || "N/A",
      departamento: data.departamento || "N/A",
      codigo_postal: data.codigo_postal || "N/A",
      barrio: data.barrio || "N/A",
      bot: "@FenixDoxBot",
      monoblock: data.monoblock || "N/A",
      ciudad: data.ciudad || "N/A",
      municipio: data.municipio || "N/A",
      provincia: data.provincia || "N/A",
      pais: data.pais || "N/A",
      codigo_fallecido: data.codigo_fallecido || "N/A",
      mensaje_fallecido: data.mensaje_fallecido || "N/A",
      origen_fallecido: data.origen_fallecido || "N/A",
      fecha_fallecido: data.fecha_fallecido || "N/A",

      // Agregar tu marca de agua al final de la respuesta
      marca: "@manoseable",
    };

    // Agregar la foto si está disponible
    if (data.foto) {
      textoRespuesta.foto = data.foto;
    }

    return res.json(textoRespuesta);
  } catch (error) {
    return res.status(500).json({
      error: `Error al conectar con la API del RENAPER: ${error.message}`,
    });
  }
});

// Configurar el puerto (Render asignará un puerto dinámico)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));
