///////////////////////////////////////
// FUNCIÓN: crearSeccion // Se modulariza el creado de seccion ya que se repite 2 veces
///////////////////////////////////////
function crearSeccion(formulario, titulo, textoAyuda, preguntas) {
  let nuevaSeccion = formulario.addPageBreakItem()
    .setTitle(titulo)
    .setHelpText(textoAyuda);

  preguntas.forEach(p => {
    if (p.tipo === 'list') {
      formulario.addListItem()
        .setTitle(p.titulo)
        .setChoiceValues(p.opciones)
        .setRequired(p.requerido);
    } else if (p.tipo === 'text') {
      formulario.addTextItem()
        .setTitle(p.titulo)
        .setRequired(p.requerido);
    }
  });

  return nuevaSeccion; // Asegúrate de retornar nuevaSeccion correctamente
}

///////////////////////////////////////////////////////////
//PARA REPETIR EL ENVIO DE UN FORMULARIO//////////////////
///////////////////////////////////////////////////////////

function guardarRecetaSheet(listaMateriasP, nombreR, comentarioR) {
  try {
    const props = PropertiesService.getUserProperties();
    const hoja = SpreadsheetApp.openById(props.getProperty("HojaResultadosID")).getSheetByName("Recetas");
    const formProduccion = FormApp.openByUrl(props.getProperty("formularioProduccionEditUrl"));
    let items = formProduccion.getItems();
    let itemProducto = items[0].asListItem(); // Corregido: llamada a asListItem()
    let opcionesActualesC = itemProducto.getChoices().map(choice => choice.getValue()); // Obtener opciones actuales
    opcionesActualesC.push(nombreR); // Agregar nuevo dato
    itemProducto.setChoices(opcionesActualesC.map(valor => itemProducto.createChoice(valor)));

    const valor = hoja.getRange("A1").getValue(); // CELDA DE BAJAS
    let celdaElegida = parseInt(valor);
    const filaInicial = 2;

    if (celdaElegida === 0) {
      // Alta normal (sin bajas disponibles)
      celdaElegida = parseInt(hoja.getRange("A2").getValue());
      hoja.getRange("A2").setValue(celdaElegida + 3); // reserva espacio para la siguiente
    } else {
      // Alta usando baja lógica
      const celdaBaja = hoja.getRange(filaInicial, celdaElegida).getValue(); // ej: "@12"
      const siguienteBaja = parseInt(String(celdaBaja).slice(1)); // extrae "12" de "@12"
      hoja.getRange("A1").setValue(siguienteBaja); // actualiza la cabecera con la próxima baja
    }

    // Escritura de receta
    let fila = filaInicial;
    hoja.getRange(fila, celdaElegida).setValue(nombreR);
    fila++;

    listaMateriasP.forEach(function (materiaPrima) {
      hoja.getRange(fila, celdaElegida).setValue(materiaPrima.NombreMp);
      hoja.getRange(fila, celdaElegida + 1).setValue(materiaPrima.Cantidad);
      hoja.getRange(fila, celdaElegida + 2).setValue(materiaPrima.Tipos);
      fila++;
    });

    // Escribir comentario solo si hay uno
    if (comentarioR) {
      hoja.getRange(fila, celdaElegida).setValue(comentarioR);
    }

  } catch (e) {
    Logger.log("Error en guardarRecetaSheet: " + e.message);
  }
}
///////////////////////////////////////////////////////////////////////////////////
/// FUNCIONES PARA LA CARGA DE LA LISTA DESPLEGABLE DE MATERIAS PRIMAS EN RECETA///
///////////////////////////////////////////////////////////////////////////////////
function agregarMPR(nombre) {
  try {
    const props = PropertiesService.getUserProperties();
    const hojaMP = SpreadsheetApp.openById(props.getProperty("HojaResultadosID")).getSheetByName("Hoja 1");
    
    if (!hojaMP) {
      throw new Error("No se encontró 'Hoja 1' en la hoja de cálculo");
    }
    
    // Verificar si ya existe en columna E (5)
    const lastRow = hojaMP.getLastRow();
    let existingMps = [];
    
    if (lastRow >= 2) {
      existingMps = hojaMP.getRange(2, 5, lastRow - 1, 1).getValues().flat();
    }
    
    if (existingMps.includes(nombre)) {
      throw new Error("La materia prima ya existe");
    }
    
    // Sistema de altas/bajas (modificado para columna E)
    const valor = hojaMP.getRange("A3").getValue();
    let filaElegida = parseInt(valor) || 0;
    
    if (filaElegida === 0) {
      // Alta normal (sin bajas disponibles)
      filaElegida = parseInt(hojaMP.getRange("A4").getValue()) || 2; // Comenzar en fila 2 si A4 está vacío
      hojaMP.getRange("A4").setValue(filaElegida + 1);
    } else {
      // Alta usando baja lógica
      const celdaBaja = hojaMP.getRange(filaElegida, 5).getValue(); // Ahora en columna E
      const siguienteBaja = parseInt(String(celdaBaja).slice(1));
      hojaMP.getRange("A3").setValue(siguienteBaja);
    }
    
    // Validar que filaElegida sea al menos 2
    filaElegida = Math.max(filaElegida, 2);
    
    // Escribir en columna E (5)
    hojaMP.getRange(filaElegida, 5).setValue(nombre);
    
    // Actualizar formulario de compras (opcional)
    try {
      const formCompras = FormApp.openByUrl(props.getProperty("formularioComprasEditUrl"));
      let items = formCompras.getItems();
      let itemProducto = items[2].asListItem();
      let opcionesActualesC = itemProducto.getChoices().map(choice => choice.getValue());
      opcionesActualesC.push(nombre);
      itemProducto.setChoices(opcionesActualesC.map(valor => itemProducto.createChoice(valor)));
    } catch (e) {
      console.warn("No se pudo actualizar formulario de compras:", e);
    }
    
    return true;
    
  } catch (error) {
    console.error("Error en agregarMPR:", error);
    throw error;
  }
}

function obtenerMateriasPrimasDeSheet() {
  try {
    const spreadsheet = SpreadsheetApp.openById(PropertiesService.getUserProperties().getProperty("HojaResultadosID"));
    const sheet = spreadsheet.getSheetByName("Hoja 1");
    
    if (!sheet) {
      throw new Error("No se encontró la hoja 'Hoja 1'");
    }
    
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) return []; // No hay datos
    
    // Obtener todas las materias primas de la columna E
    const data = sheet.getRange(2, 5, lastRow - 1, 1).getValues();
    
    // Procesar y limpiar datos
    return data
      .flat()
      .map(mp => mp.toString().trim())
      .filter(mp => mp !== "");
      
  } catch (error) {
    console.error("Error en obtenerMateriasPrimasDeSheet:", error);
    throw error;
  }
}

function agregarMP(nombre){
    const formCompras = FormApp.openByUrl(props.getProperty("formularioComprasEditUrl"));
    let items = formCompras.getItems();
    let itemProducto = items[2].asListItem(); // Corregido: llamada a asListItem()
    let opcionesActualesC = itemProducto.getChoices().map(choice => choice.getValue()); // Obtener opciones actuales
    opcionesActualesC.push(nombre); // Agregar nuevo dato
    itemProducto.setChoices(opcionesActualesC.map(valor => itemProducto.createChoice(valor)));

  const hoja = SpreadsheetApp.openById(PropertiesService.getUserProperties().getProperty("HojaResultadosID")).getSheetByName("Hoja 1");
  const valor = hoja.getRange("A3").getValue(); // CELDA DE BAJAS
  let filaElegida = parseInt(valor);
  if (filaElegida === 0) {
      // Alta normal (sin bajas disponibles)
      filaElegida = parseInt(hoja.getRange("A4").getValue());
      hoja.getRange("A4").setValue(filaElegida + 1); // reserva espacio para la siguiente
    } else {
      // Alta usando baja lógica
      const celdaBaja = hoja.getRange(filaElegida, 2).getValue(); // ej: "@12"
      const siguienteBaja = parseInt(String(celdaBaja).slice(1)); // extrae "12" de "@12"
      hoja.getRange("A3").setValue(siguienteBaja); // actualiza la cabecera con la próxima baja
    }
  hoja.getRange(filaElegida,2).setValue(nombre);
}

function eliminarMP(nombre){
  
}

function eliminarReceta(nombre) {
  try {
    const hoja = SpreadsheetApp
      .openById(PropertiesService.getUserProperties().getProperty("HojaResultadosID"))
      .getSheetByName("Recetas");

    const lastColumn = hoja.getLastColumn();
    const valores = hoja.getRange(1, 1, 2, lastColumn).getValues(); // A1 + fila 2
    const valorCabecera = valores[0][0]; // A1
    const filaNombres = valores[1].slice(2); // fila 2 desde columna C

    const index = filaNombres.indexOf(nombre);
    if (index !== -1) {
      const columna = index + 2; // columna real
      hoja.getRange(2, columna).setValue(`@${valorCabecera}`);
      hoja.getRange("A1").setValue(columna);
    } else {
      throw new Error(`No se encontró la receta: ${nombre}`);
    }

  } catch (e) {
    Logger.log("Error en eliminarReceta: " + e.message);
  }
}

















