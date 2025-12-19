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

function guardarRecetaSheet(listaMateriasP, nombreR, divisorCantReales) {
  try {
    
    const props = PropertiesService.getUserProperties();
    const hoja = SpreadsheetApp.openById(props.getProperty("HojaResultadosID")).getSheetByName("Recetas");
    const hojaStock = hoja.getParent().getSheetByName("Stock");
    const hojaEq = hoja.getParent().getSheetByName("Punto Eq");
    

    // --- Insertar el nombre en el Form Producción ---
    const formProduccion = FormApp.openByUrl(props.getProperty("formularioProduccionEditUrl"));
    let items = formProduccion.getItems();
    let itemProducto = items[0].asListItem();
    let opcionesActualesC = itemProducto.getChoices().map(choice => choice.getValue());

    if (opcionesActualesC.includes(nombreR)) {
      throw new Error(`El producto "${nombreR}" ya existe en el formulario.`);
    }
    const valores = hojaEq.getRange(2,7,hojaEq.getLastRow()-1).getValues(); 
    const cantidad = valores.flat().filter(v => v !== "" && v !== null).length +2;
    hojaEq.getRange(cantidad,7).setValue(nombreR);
    


    opcionesActualesC.push(nombreR);
    opcionesActualesC.sort();
    itemProducto.setChoices(opcionesActualesC.map(valor => itemProducto.createChoice(valor)));

    // --- Insertar receta en hoja "Recetas" ---
    const valor = hoja.getRange("A1").getValue(); // Celda de bajas
    let celdaElegida = parseInt(valor);
    const filaInicial = 2;

    if (celdaElegida === 0) {
      // Alta normal
      celdaElegida = parseInt(hoja.getRange("A2").getValue());
      hoja.getRange("A2").setValue(celdaElegida + 4);
    } else {
      // Alta usando baja lógica
      const celdaBaja = hoja.getRange(filaInicial, celdaElegida).getValue(); // ej: "@12"
      const siguienteBaja = parseInt(String(celdaBaja).slice(1));
      hoja.getRange("A1").setValue(siguienteBaja);
    }

    hoja.getRange(2, celdaElegida).setValue(nombreR);

    hoja.getRange(3, celdaElegida, listaMateriasP.length, 4).setValues(listaMateriasP);

    hoja.getRange(3 + listaMateriasP.length, celdaElegida).setValue(divisorCantReales);

    // --- Inicializar en stock ---
    let ultimoEspacio = parseInt(hojaStock.getRange("A3").getValue());
    hojaStock.getRange(ultimoEspacio, 2, 1, 2).setValues([[nombreR, 0]]);
    ultimoEspacio++;
    hojaStock.getRange("A3").setValue(ultimoEspacio);

    // --- Inicializar materias primas ---
    hojaStock.getRange(2, 5, hojaStock.getLastRow() - 1, 4).setValues(recetaAuxInicializarMP(listaMateriasP, hojaStock));

    return true; // Indicar éxito al cliente
  } catch (error) {
    Logger.log("Error en guardarRecetaSheet: " + error.message);
    throw new Error(error.message); // Mandar el mensaje de error al cliente
  }
}

function recetaAuxInicializarMP(receta,stock){
  const stockMP = stock.getRange(2,5,stock.getLastRow()-1,4).getValues();
  const nombresMpStock= stockMP.map(fila => fila[0]);
  receta.forEach(function(materiaPrimaReceta){
    /////HAY NORMALIZACION EN LOS NOMBRE DE MATERIAS PRIMAS?????//////////
    const indiceMpStock = nombresMpStock.indexOf(materiaPrimaReceta[0])
    if(!stockMP[indiceMpStock][3]){
      if(materiaPrimaReceta[2] === "gramos"){
        stockMP[indiceMpStock][3] = "kilogramos"
      }else{
        if(materiaPrimaReceta[2] === "mililitro"){
          stockMP[indiceMpStock][3] = "litros"
        }else{
          stockMP[indiceMpStock][3] = materiaPrimaReceta[2];
        }
      }
    }   
  })
  return stockMP;

}
///////////////////////////////////////////////////////////////////////////////////
/// FUNCIONES PARA LA CARGA DE LA LISTA DESPLEGABLE DE MATERIAS PRIMAS EN RECETA///
///////////////////////////////////////////////////////////////////////////////////

function agregarMPR(nombre) {
  try {
    const props = PropertiesService.getUserProperties();
    const hojaMP = SpreadsheetApp.openById(props.getProperty("HojaResultadosID")).getSheetByName("Stock");

    const lastRow = hojaMP.getLastRow();
    let existingMps = [];
    if (lastRow >= 2) {
      existingMps = hojaMP.getRange(2, 5, lastRow - 1, 1).getValues().flat().map(mp => mp.toString().trim());
    }

    if (existingMps.includes(nombre)) {
      return false; // Ya existe
    }

    let espacioVacio = parseInt(hojaMP.getRange("A2").getValue());
    hojaMP.getRange(espacioVacio, 5, 1, 2).setValues([[nombre, 0]]);
    espacioVacio++;
    hojaMP.getRange("A2").setValue(espacioVacio);

    // AGREGAR NOMBRE DE MATERIA PRIMA EN PREGUNTA MP DE FORMULARIO COMPRAS 
    try {
      const formCompras = FormApp.openByUrl(props.getProperty("formularioComprasEditUrl"));
      let items = formCompras.getItems();
      let preguntaMateriaPrima = items[indicePreguntaMateriaPrima].asListItem();
      let opcionesActualesC = preguntaMateriaPrima.getChoices().map(choice => choice.getValue());
      opcionesActualesC.push(nombre);
      preguntaMateriaPrima.setChoices(opcionesActualesC.map(valor => preguntaMateriaPrima.createChoice(valor)));
    } catch (e) {
      console.warn("No se pudo actualizar formulario de compras:", e);
    }

    return true;

  } catch (error) {
    console.error(error);
    throw error;
  }
}

//////////////////////////////////////////////////////
  //////////////////////////////////////////////////////
  function eliminarMateriaPrimaSeleccionada(nombre) {
    try {
      const sheet = SpreadsheetApp.openById(PropertiesService.getUserProperties().getProperty("HojaResultadosID"))
        .getSheetByName("Stock");

      const datosMP = sheet.getRange(2, 5, sheet.getLastRow() - 1, 4).getValues();
      const nombresMP = datosMP.map(fila => fila[0].toString().trim());
      const indiceNombreMP = nombresMP.indexOf(nombre);

      if (indiceNombreMP === -1) {
        return false; // No encontrado
      }

      datosMP.splice(indiceNombreMP, 1);
      sheet.getRange(2, 5, sheet.getLastRow() - 1, 4).clearContent();
      sheet.getRange(2, 5, datosMP.length, 4).setValues(datosMP);

      let espacioVacio = sheet.getRange("A2").getValue();
      espacioVacio--;
      sheet.getRange("A2").setValue(espacioVacio);

      try {
        const formCompras = FormApp.openByUrl(PropertiesService.getUserProperties().getProperty("formularioComprasEditUrl"));
        const itemMP = formCompras.getItems()[2].asListItem();
        const opcionesActuales = itemMP.getChoices().map(choice => choice.getValue());
        const nuevasOpciones = opcionesActuales.filter(opcion => opcion !== nombre);
        itemMP.setChoices(nuevasOpciones.map(opcion => itemMP.createChoice(opcion)));
      } catch (e) {
        console.warn("No se pudo actualizar formulario de compras:", e);
      }

      return true;

    } catch (error) {
      console.error("Error en eliminarMateriaPrimaSeleccionada:", error);
      throw error;
    }
  }

function eliminarReceta(nombre) {
    try {
      // 1. Eliminar del formulario de producción
      const formProduccion = FormApp.openByUrl(PropertiesService.getUserProperties().getProperty("formularioProduccionEditUrl"));
      const itemProducto = formProduccion.getItems()[0].asListItem();
      const opcionesActuales = itemProducto.getChoices().map(choice => choice.getValue());
      const nuevasOpciones = opcionesActuales.filter(opcion => opcion !== nombre);
      itemProducto.setChoices(nuevasOpciones.map(opcion => itemProducto.createChoice(opcion)));
      
      // 2. Marcar como eliminado en hoja Recetas
      const hojaRecetas = SpreadsheetApp.openById(PropertiesService.getUserProperties().getProperty("HojaResultadosID"))
        .getSheetByName("Recetas");
      const hojaEq = hojaRecetas.getParent().getSheetByName("Punto Eq");
      
      const lastColumn = hojaRecetas.getLastColumn();
      let nombresProductos = hojaRecetas.getRange(2, 3, 1, lastColumn-2).getValues()[0];
      const index = nombresProductos.indexOf(nombre);
      
      if (index !== -1) {
        const columna = index + 3; // +3 porque empieza en columna C
        const valorCabecera = hojaRecetas.getRange("A1").getValue();
        
        // Limpiar contenido y marcar como eliminado
        hojaRecetas.getRange(3, columna, hojaRecetas.getLastRow()-2, 4).clearContent();
        hojaRecetas.getRange(2, columna).setValue(`@${valorCabecera}`);
        hojaRecetas.getRange("A1").setValue(columna);
      }
      
      // 3. Eliminar de Hoja 1 (columna B)
      const hoja1 = SpreadsheetApp.openById(PropertiesService.getUserProperties().getProperty("HojaResultadosID"))
        .getSheetByName("Stock");
      
      const datosProductos = hoja1.getRange(2,2,hoja1.getLastRow()-1,3).getValues();
      nombresProductos = datosProductos.map(fila => fila[0]);
      const indiceNombreProducto = nombresProductos.indexOf(nombre);
      if(indiceNombreProducto != -1){
        datosProductos.splice(indiceNombreProducto,1);
        hoja1.getRange(2,2,hoja1.getLastRow()-1,3).clearContent();
        hoja1.getRange(2,2,datosProductos.length , 3).setValues(datosProductos);
        let espacioVacio = hoja1.getRange("A3").getValue();
        espacioVacio--;
        hoja1.getRange("A3").setValue(espacioVacio);
      }
      ////////////////////////////////APARTADO PARA ELIMINARLO DE EQ//////////////
      const bloqueProdEq = hojaEq.getRange(2,7,hojaEq.getLastRow(),5).getValues();
      const nombresProdEq = bloqueProdEq.map(nombreEq => nombreEq[0].toString());
      const indiceFilaEq = nombresProdEq.indexOf(nombre);
      if (indiceFilaEq !== -1) {
        bloqueProdEq.splice(indiceFilaEq, 1);
        hojaEq.getRange(2,7,bloqueProdEq.length,5).setValues(bloqueProdEq);
      }
      return true;
      
    } catch (error) {
      console.error("Error en eliminarReceta:", error);
      throw error;
    }
}
