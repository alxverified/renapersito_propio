const express = require("express");
const axios = require("axios");

const app = express();

// Claves y URLs de las APIs
const API_KEY = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTIzLCJyb2xlIjoyLCJpYXQiOjE3MzIxOTk2MDJ9.7w-AZQUjEFZoK0-Padg3deFGfdnS6y7-PyF5fP1lTpU";
const RENAPER_API_URL = "https://colmen-api.rgn.io/renaper/remote";
const CREDICUOTAS_API_URL = "https://clientes.credicuotas.com.ar/v1/onboarding/resolvecustomers";

app.get("/fenix", async (req, res) => {
  const { dni } = req.query;

  // Validar parámetro 'dni'
  if (!dni) {
    return res.status(400).json({
      error: "Falta el parámetro 'dni' en la URL.",
    });
  }

  try {
    // Obtener datos desde Credicuotas
    const credicuotasResponse = await axios.get(`${CREDICUOTAS_API_URL}/${dni}`);
    const credicuotasData = credicuotasResponse.data;

    if (!credicuotasData || !credicuotasData[0] || !credicuotasData[0].sexo) {
      return res.status(404).json({
        error: "No se encontró información de 'sexo' para el DNI proporcionado en Credicuotas.",
      });
    }

    const sexo = credicuotasData[0].sexo; // Obtener el sexo desde la API Credicuotas

    // Realizar la solicitud a la API del RENAPER
    const renaperResponse = await axios.post(
      RENAPER_API_URL,
      { dni, sex: sexo },
      {
        headers: {
          Authorization: API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const renaperData = renaperResponse.data;

    // Crear el diccionario con los datos que se devolverán en la respuesta
    const textoRespuesta = {
      creador: "@manoseable",
      id_tramite_principal: renaperData.id_tramite_principal || "N/A",
      id_tramite_tarjeta_reimpresa: renaperData.id_tramite_tarjeta_reimpresa || "N/A",
      ejemplar: renaperData.ejemplar || "N/A",
      fecha_vencimiento: renaperData.fecha_vencimiento || "N/A",
      fecha_emision: renaperData.fecha_emision || "N/A",
      bot: "@FenixDoxBot",
      apellido: renaperData.apellido || "N/A",
      nombres: renaperData.nombres || "N/A",
      fecha_nacimiento: renaperData.fecha_nacimiento || "N/A",
      id_ciudadano: renaperData.id_ciudadano || "N/A",
      cuil: renaperData.cuil || "N/A",
      calle: renaperData.calle || "N/A",
      numero: renaperData.numero || "N/A",
      piso: renaperData.piso || "N/A",
      departamento: renaperData.departamento || "N/A",
      codigo_postal: renaperData.codigo_postal || "N/A",
      barrio: renaperData.barrio || "N/A",
      monoblock: renaperData.monoblock || "N/A",
      ciudad: renaperData.ciudad || "N/A",
      municipio: renaperData.municipio || "N/A",
      provincia: renaperData.provincia || "N/A",
      pais: renaperData.pais || "N/A",
      codigo_fallecido: renaperData.codigo_fallecido || "N/A",
      mensaje_fallecido: renaperData.mensaje_fallecido || "N/A",
      origen_fallecido: renaperData.origen_fallecido || "N/A",
      fecha_fallecido: renaperData.fecha_fallecido || "N/A",
      marca: "@manoseable",
    };

    // Agregar la foto si está disponible
    if (renaperData.foto) {
      textoRespuesta.foto = renaperData.foto;
    }

    return res.json(textoRespuesta);
  } catch (error) {
    return res.status(500).json({
      error: `Error al procesar la solicitud: ${error.message}`,
    });
  }
});

// Configurar el puerto (Render asignará un puerto dinámico)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));
