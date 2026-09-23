/****************************************************
 * CONFIGURACIÓN
 ****************************************************/

const FORM_ID =
  "1FAIpQLSeEdZgp2U4FmDk0EaVwmU-Gj7Ey57k-Cs11llsASF0IyA220w";

// IDs entry de tu Google Form
const ENTRY_FRECUENCIA = "entry.1406846408";
const ENTRY_EDAD_ESTIMADA = "entry.618603006";
const ENTRY_EDAD_REAL = "entry.1938632190";
const ENTRY_DIFERENCIA = "entry.367777051";


/****************************************************
 * MOSTRAR LA PÁGINA WEB
 ****************************************************/

function doGet() {
  return HtmlService
    .createHtmlOutputFromFile("Index")
    .setTitle("Test Auditivo - Escáner en Tiempo Real")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}


/****************************************************
 * RECIBIR LOS DATOS DESDE EL HTML
 ****************************************************/

function registrarEnGoogleForms(datos) {

  try {

    // -----------------------------------------------
    // Validación básica
    // -----------------------------------------------

    if (!datos) {
      throw new Error("No se recibieron datos.");
    }

    const frecuencia = Number(datos.frecuencia);
    const edadEstimada = Number(datos.edadEstimada);
    const edadReal = Number(datos.edadReal);
    const diferencia = Number(datos.diferencia);

    if (!Number.isFinite(frecuencia)) {
      throw new Error("La frecuencia no es válida.");
    }

    if (!Number.isFinite(edadEstimada)) {
      throw new Error("La edad auditiva estimada no es válida.");
    }

    if (!Number.isFinite(edadReal)) {
      throw new Error("La edad real no es válida.");
    }

    if (!Number.isFinite(diferencia)) {
      throw new Error("La diferencia no es válida.");
    }


    // -----------------------------------------------
    // Preparar datos para Google Forms
    // -----------------------------------------------

    const formUrl =
      "https://docs.google.com/forms/d/e/" +
      FORM_ID +
      "/formResponse";

    const payload = {};

    payload[ENTRY_FRECUENCIA] = frecuencia;
    payload[ENTRY_EDAD_ESTIMADA] = edadEstimada;
    payload[ENTRY_EDAD_REAL] = edadReal;
    payload[ENTRY_DIFERENCIA] = diferencia;


    // -----------------------------------------------
    // Enviar a Google Forms
    // -----------------------------------------------

    const respuesta = UrlFetchApp.fetch(formUrl, {
      method: "post",
      payload: payload,
      followRedirects: true,
      muteHttpExceptions: true
    });


    const codigo = respuesta.getResponseCode();
    const contenido = respuesta.getContentText();


    console.log("Código de respuesta de Google Forms: " + codigo);


    // -----------------------------------------------
    // Comprobar respuesta
    // -----------------------------------------------

    if (codigo >= 200 && codigo < 400) {

      return {
        success: true,
        message: "Registro enviado correctamente.",
        status: codigo
      };

    }


    // Si Google devuelve 401, 403, etc.
    throw new Error(
      "Google Forms respondió con código HTTP " +
      codigo +
      "."
    );


  } catch (error) {

    console.error(
      "Error en registrarEnGoogleForms: " +
      error.message
    );

    return {
      success: false,
      message: error.message
    };
  }
}
