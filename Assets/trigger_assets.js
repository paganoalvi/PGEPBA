///////////funcion trigger articulo////////////////
function tArticulo(dt){
  var datoArt = dt[1];
  let formComp = FormApp.openByUrl(PropertiesService.getUserProperties().getProperty("formularioComprasEditUrl"));
  let itemsC = formComp.getItems();
  let artC = itemsC[10].asListItem(); // Corregido: llamada a asListItem()
  let opcionesActualesC = artC.getChoices().map(choice => choice.getValue()); // Obtener opciones actuales
  opcionesActualesC.push(datoArt); // Agregar nuevo dato
  artC.setChoices(opcionesActualesC.map(valor => artC.createChoice(valor)));
}

///////////funcion trigger Empleado////////////////

function tEmpleado(dt){
  var datoProveedor = dt[1]
  let formCostosFijos = FormApp.openByUrl(PropertiesService.getUserProperties().getProperty("formularioCostosFijosEditUrl"));
  let itemsC = formCostosFijos.getItems();
  let preguntaEmpleado = itemsC[indicePreguntaEmpleados].asListItem(); 
  let opcionesActualesC = preguntaEmpleado.getChoices().map(choice => choice.getValue()); // Obtener opciones actuales
  opcionesActualesC.push(datoProveedor); // Agregar nuevo dato
  preguntaEmpleado.setChoices(opcionesActualesC.map(valor => preguntaEmpleado.createChoice(valor)));
}

///////////funcion trigger Empleado////////////////

function tCliente(dt){
  var datoCliente = dt[2];
  let formCostosFijos = FormApp.openByUrl(PropertiesService.getUserProperties().getProperty("formularioVentasEditUrl"));
  let itemsC = formCostosFijos.getItems();
  let preguntaCliente = itemsC[indicePreguntaClientes].asListItem(); 
  let opcionesActualesC = preguntaCliente.getChoices().map(choice => choice.getValue()); // Obtener opciones actuales
  opcionesActualesC.push(datoCliente); // Agregar nuevo dato
  preguntaCliente.setChoices(opcionesActualesC.map(valor => preguntaCliente.createChoice(valor)));
}

///////////funcion trigger Proveedor////////////////

function tProveedor(dt){
  const datoProveedor = dt[3] // obtienemos NOMBRE  PROVEEDOR // dt viene de sheetss
  const formComp = FormApp.openByUrl(PropertiesService.getUserProperties().getProperty("formularioComprasEditUrl"));
  const itemsC = formComp.getItems();
  const preguntaProveedor = itemsC[indicePreguntaProveedor].asListItem(); // Corregido: llamada a asListItem()
  const preguntaProveedor2 = itemsC[indicePreguntaProveedorServ].asListItem();

  let opcionesActualesC = preguntaProveedor.getChoices().map(choice => choice.getValue()); // Obtener opciones actuales
  opcionesActualesC.push(datoProveedor); // Agregar nuevo dato 
  preguntaProveedor.setChoices(opcionesActualesC.map(valor => preguntaProveedor.createChoice(valor)));

  let opcionesActualesA = preguntaProveedor2.getChoices().map(choice => choice.getValue()); // Obtener opciones actuales
  opcionesActualesA.push(datoProveedor); // Agregar nuevo dato 
  preguntaProveedor2.setChoices(opcionesActualesA.map(valor => preguntaProveedor2.createChoice(valor)));
}

///////////funcion trigger Proveedor Costo Fijo////////////////

function tProveedorCF(dt){
  const datoProveedorCF = dt[2] // obtienemos NOMBRE  PROVEEDOR
  let formComp = FormApp.openByUrl(PropertiesService.getUserProperties().getProperty("formularioCostosFijosEditUrl"));
  let itemsC = formComp.getItems();
  let preguntaProveedorCF = itemsC[indicePreguntaProveedorCF].asListItem(); // Corregido: llamada a asListItem()
  let opcionesActualesC = preguntaProveedorCF.getChoices().map(choice => choice.getValue()); // Obtener opciones actuales
  opcionesActualesC.push(datoProveedorCF); // Agregar nuevo dato
  preguntaProveedorCF.setChoices(opcionesActualesC.map(valor => preguntaProveedorCF.createChoice(valor)));
}

///////////funcion trigger Compras////////////////
/* dt se recibe con un arreglo de java indices comienzan en 0
  indice en hoja de sheetsc comienzan en uno getRange(fila,columna,cantFilas,cantColumnas)
 */
function tCompras(dt,hoja) {
  if (dt[2] === "Materias Primas o Insumos") { // categoría
    const props = PropertiesService.getUserProperties();
    const sheet = SpreadsheetApp
      .openById(props.getProperty("HojaResultadosID"))
      .getSheetByName("Stock");

    const lastRow = sheet.getLastRow();
    const rangoDatos = sheet.getRange(2, 5, lastRow - 1, 4).getValues();

    for (let i = 0; i < rangoDatos.length; i++) {
      if (rangoDatos[i][0] === dt[3]) { // nombre materia prima
        let cantidadActual = parseInt(rangoDatos[i][1]) || 0;
        cantidadActual += parseInt(dt[4]); // cantidad comprada
        rangoDatos[i][1] = cantidadActual;
        rangoDatos[i][2] = Number((dt[6] / dt[4]).toFixed(2)); // precio unitario
        break;
      }
    }

    // Escribir cambios en una sola llamada
    sheet.getRange(2, 5, lastRow - 1, 4).setValues(rangoDatos);
  }else{
    const hojaEq = hoja.getParent().getSheetByName("Punto Eq");
    const mesCompra = (new Date(dt[1]));

    const dateHoy = new Date();
    const ymHoy = dateHoy.getFullYear() * 12 + dateHoy.getMonth();

    const mesActual = hojaEq.getRange("A2").getValue();
    const ymCompra = mesCompra.getFullYear() * 12 + mesCompra.getMonth();
    const ymActual = mesActual.getFullYear() * 12 + mesActual.getMonth();
    const sumaGastoParaCf = parseInt(dt[11] || 0) + parseInt(dt[14] || 0);
    const costoFijoActual = parseFloat(hojaEq.getRange("C2").getValue() || 0.0);
    
    if (ymCompra === ymActual || ymCompra > ymHoy) {
      hojaEq.getRange("C2").setValue(sumaGastoParaCf + costoFijoActual);
    }else {
      if (ymCompra > ymActual && ymCompra <= ymHoy) {
        const fechaParaYear = new Date(dt[0]);
        const year = fechaParaYear.getFullYear();
        cambioMes(hojaEq,mesActual.getMonth()+1,year);
        hojaEq.getRange("C2").setValue(0);
        hojaEq.getRange("K2:k100").setValue(0);
        hojaEq.getRange("C2").setValue(sumaGastoParaCf);
        hojaEq.getRange("A2").setValue(mesCompra);
      }
    }
  }
}

///////////funcion trigger Costo Fijo////////////////
function tCostoFijo(dt,hoja){ 
  const fecha = new Date(dt[1]);
  const totalCostoFijo = parseInt(dt[4] || 0 )+parseInt(dt[7] || 0)+parseInt(dt[11] || 0);
  const hojaEq = hoja.getParent().getSheetByName("Punto Eq");
  const fechaUltima = hojaEq.getRange("A2").getValue();
  const dateHoy = new Date();
  const ymHoy = dateHoy.getFullYear() * 12 + dateHoy.getMonth();
  const ymCostoFijo = fecha.getFullYear() * 12 + fecha.getMonth();
  const ymActual = fechaUltima.getFullYear() * 12 + fechaUltima.getMonth();
  if (ymCostoFijo === ymActual || ymCostoFijo > ymHoy) {
    let valorCfActual = parseInt(hojaEq.getRange(`C2`).getValue() || 0);
    valorCfActual+=totalCostoFijo;
    hojaEq.getRange(`C2`).setValue(valorCfActual);
  }else{
    if (ymCostoFijo > ymActual && ymCostoFijo <= ymHoy) {
      const fechaParaYear = new Date(dt[0]);
      const year = fechaParaYear.getFullYear();
      cambioMes(hojaEq,fechaUltima.getMonth()+1,year);
      hojaEq.getRange("K2:K100").setValue(0);
      hojaEq.getRange("C2").setValue(totalCostoFijo);
      hojaEq.getRange("A2").setValue(fecha);
    }
  }
}
///////////funcion trigger Ventas////////////////

function tVentas(dt,hoja) {

  const props = PropertiesService.getUserProperties();
  const sheet = hoja.getParent().getSheetByName("Stock")
  const hojaEq = sheet.getParent().getSheetByName("Punto Eq");
  const productoExtraido = dt[1].split('|')[0].trim();
  const cantVendida = parseInt(dt[2]);
  /////////PEQUEÑO APARTADO PARA ACTUALIZAR LA CANTIDAD DE PRODUCTOS TOTALES////////////
  const nombresPrHojaEq = hojaEq.getRange(2,7,hojaEq.getLastRow(),1).getValues().flat();
  const indiceNombreEq = nombresPrHojaEq.indexOf(productoExtraido);
  const fechaVenta = new Date(dt[5]);
  const mesHoja = hojaEq.getRange("A2").getValue();
  const dateHoy = new Date();
  const ymHoy = dateHoy.getFullYear() * 12 + dateHoy.getMonth();
  const ymVentas = fechaVenta.getFullYear() * 12 + fechaVenta.getMonth();
  const ymActual = mesHoja.getFullYear() * 12 + mesHoja.getMonth();
  if(ymVentas === ymActual || ymVentas > ymHoy){
    const cantVentaActualEq = parseInt(hojaEq.getRange(indiceNombreEq+2,11).getValue()) || 0;
    hojaEq.getRange(indiceNombreEq+2,11).setValue(cantVentaActualEq + cantVendida);
  }else{
    if(ymVentas > ymActual && ymVentas <= ymHoy){
      const fechaParaYear = new Date(dt[0]);
      const year = fechaParaYear.getFullYear();
      cambioMes(hojaEq,mesHoja.getMonth()+1,year);
      hojaEq.getRange("C2").setValue(0);
      hojaEq.getRange("K2:K100").setValue(0);
      hojaEq.getRange(indiceNombreEq+2,11).setValue(cantVendida);
      hojaEq.getRange("A2").setValue(fechaVenta);
    }
  }
  /////////////////////////////////////////////////////////////////////////////////////
  const lastRow = sheet.getLastRow();
  const rangoDatos = sheet.getRange(2, 2, lastRow - 1, 2).getValues();
  let matchStock;
  let numeroStock;
  
  ////////////ACTUALIZA STOCK PRODUCTOS//////////////////
  for (let i = 0; i < rangoDatos.length; i++) {
    if (productoExtraido === rangoDatos[i][0]) { 
      matchStock = dt[1].match(/stock:\s*(\d+)/);
      numeroStock = matchStock ? parseInt(matchStock[1]) : 0;
      let cantidadActual = parseInt(rangoDatos[i][1]) || 0;
      cantidadActual -= cantVendida;
      rangoDatos[i][1] = cantidadActual; 
      break;
    }
  }
  sheet.getRange(2, 2, lastRow - 1, 2).setValues(rangoDatos);
  numeroStock -= cantVendida;
  /////////////////////ACTUALIZA HOJA VENTAS//////////////////////
  const formVentas = FormApp.openByUrl(props.getProperty("formularioVentasEditUrl"));
  let itemsVentas = formVentas.getItems();
  let art = itemsVentas[0].asListItem(); 
  let opcionesActualesC = art.getChoices().map(choice => choice.getValue());
  let indice = opcionesActualesC.indexOf(dt[1]);
  if (indice !== -1) {
    if (numeroStock > 0) {
      let textoModificado = dt[1].replace(/(stock:\s*)\d+/, `$1${numeroStock}`);
      opcionesActualesC[indice] = textoModificado;
    } else {
      opcionesActualesC.splice(indice, 1);
      sheet.getRange("A4").setValue(opcionesActualesC.length + 1);
    }
    art.setChoices(opcionesActualesC.map(valor => art.createChoice(valor)));
  }
  /////////////////ACTUALIZACION DE PRODUCTOS POR LOTES//////////////////////
  sheet.getRange(2,10,sheet.getLastRow()-1).clearContent();
  const valoresValidos = opcionesActualesC.filter(v => v && v.trim() !== "");
  sheet.getRange(2, 10, valoresValidos.length, 1).setValues(valoresValidos.map(v => [v]));
  /////////////LLAMADA FUNCION CALCULO PRECIO UNITARIO/////////////////////////
  let precioPorUnidad = parseFloat((dt[3] / dt[2]).toFixed(2));
  auxVentasActualizarPrecioVenta(productoExtraido,hojaEq,precioPorUnidad);
}

function auxVentasActualizarPrecioVenta(nombre,hoja,precioIngresado){
  const nombresProductos = hoja.getRange(2,7,hoja.getLastRow()).getValues().flat();
  const indx = nombresProductos.indexOf(nombre);
  if(indx != -1){
    const filaCorrecta = indx +2;
    hoja.getRange(`I${filaCorrecta}`).setValue(precioIngresado);
  }
}

////////////////////////////////////////////////////////////////////////////////////////
//ACTUALIZAR STOCK DE PRODUCTOS TERMINADU////O tambien trigger Produccion/////////////////
////////////////////////////////////////////////////////////////////////////////////////

function tProduccion(dt,hoja){ 
    const producto = dt[1]
    const unidades = parseInt(dt[2]) || 0; 
    const hojaStock = hoja.getParent().getSheetByName("Stock");
    const hojaRecetas = hoja.getParent().getSheetByName("Recetas");
    const hojaEq = hoja.getParent().getSheetByName("Punto Eq");
    /////ACTUALIZAR STOCK PRODUCTOS TERMINADOS////////////////
      const datosStock = hojaStock.getRange(2, 2, hojaStock.getLastRow() - 1, 3).getValues();
      for (let i = 0; i < datosStock.length; i++) {
        if (datosStock[i][0] === producto) {
          const unidadesActuales = datosStock[i][1] || 0;
          datosStock[i][1] = unidadesActuales + unidades; 
          //si no hay tipo de dato, entonces agregar
          if(!datosStock[i][2]){
            datosStock[i][2] = dt[4]; 
          }  
          break;
        }
      }
      hojaStock.getRange(2, 2, hojaStock.getLastRow() - 1, 3).setValues(datosStock);
    
    //añadido de nombre y stock de receta al formulario ventas
    const formVentas = FormApp.openByUrl(PropertiesService.getUserProperties().getProperty("formularioVentasEditUrl"))
    const stockLoteProducto = `${producto} | lote: ${dt[3]}- stock: ${unidades}`
    //Añadir el pt con lote a una columna separada
    let espacioLotes = parseInt(hojaStock.getRange("A4").getValue());
    hojaStock.getRange(espacioLotes,10).setValue(stockLoteProducto);
    espacioLotes++;
    hojaStock.getRange("A4").setValue(espacioLotes);

    const itemsVentas = formVentas.getItems();
    const preguntaVentas = itemsVentas[0].asListItem();
    let opcionesActualesC = preguntaVentas.getChoices().map(choice => choice.getValue()); // Obtener opciones actuales
    opcionesActualesC.push(stockLoteProducto);
    preguntaVentas.setChoices(opcionesActualesC.map(valor => preguntaVentas.createChoice(valor)));

    /////////////////////actulizacion stock materias primas////////////

    const filaProductosTerminados = hojaRecetas.getRange(2, 3, 1, hojaRecetas.getLastColumn()).getValues()[0];
    const rangoStockMp = hojaStock.getRange(2,5,hojaStock.getLastRow()-1,4).getValues();
    const indiceProducto = filaProductosTerminados.indexOf(producto) +3;
    const recetaSegunIndice = hojaRecetas.getRange(3,indiceProducto,hojaRecetas.getLastRow()-2,4).getValues();
    hojaStock.getRange(2,5,hojaStock.getLastRow()-1,4).setValues(actualizarStockMprimasProduccion(recetaSegunIndice,unidades,rangoStockMp,producto,hojaEq));
  }



function actualizarStockMprimasProduccion(recetaEnArray, cantidad, stockMp,nombrePr,hojaEQ) {
  let sumaDePreciosRefrenciaMp = 0; 
  let nombresMp = stockMp.map(fila => fila[0]);
  let nombresArr = [];
// en el loop
  

  for (let i = 0; i < recetaEnArray.length - 1; i++) {
    const arrayMp = recetaEnArray[i];
    if (arrayMp[1] === "" || arrayMp[1] == null) {
      break;
    }
    const indiceMp = nombresMp.indexOf(arrayMp[0]);
    const totalRestaStock = cantidad * arrayMp[1];
    const precioMp = parseFloat(stockMp[indiceMp][2] || 0)
    if (arrayMp[2] === "gramos" || arrayMp[2] === "mililitro") {
      sumaDePreciosRefrenciaMp += parseFloat(((precioMp * arrayMp[3]) / 1000).toFixed(2));

      stockMp[indiceMp][1] -= parseFloat((totalRestaStock / 1000).toFixed(2));
    } else {
      sumaDePreciosRefrenciaMp += parseFloat((precioMp * arrayMp[3]).toFixed(2));
      stockMp[indiceMp][1] -= parseFloat((totalRestaStock).toFixed(2));
    }

    if (stockMp[indiceMp][1] <= 0) {
      stockMp[indiceMp][1] = 0;
      nombresArr.push(stockMp[indiceMp][0]);
    }
  }
  let nombres = nombresArr.join(", ");
  Logger.log(nombres);
  const nombresPrEq = hojaEQ.getRange(2,7,hojaEQ.getLastRow()-1).getValues().flat();
  const indicePrecioRef = nombresPrEq.indexOf(nombrePr)+2;
  hojaEQ.getRange(`H${indicePrecioRef}`).setValue(sumaDePreciosRefrenciaMp.toFixed(2));
  if(!nombres){
    MailApp.sendEmail({
    to: Session.getActiveUser().getEmail(),
    subject: "SE DETECTO REDUCCIÓN COMPLETA DE MATERIAS PRIMAS",
    body: `Las siguientes materias primas: ${nombres}. Quedaron reducidas a 0 unidades en el stock tras la ultima producción`
    });
  }
  return stockMp;  
}
/////////////////////////////////////////////////////////////
//RECORRER ITEMS FORMULARIO////////////////////////
///////////////////////////////////////////////////////

function recorrer3(){
  let link = PropertiesService.getUserProperties().getProperty("formularioProduccionEditUrl");
  Logger.log(link);
  let form = FormApp.openByUrl(link);
  let items = form.getItems();
  items.forEach(function(item,indice){
    Logger.log(item.getTitle() + "  "+item.getType() +"   "+indice);
  })
}

/////////////////////////////////////////////////////////////
//IMPLEMENTAR TODOS LOS TRIGGERS////////////////////////
///////////////////////////////////////////////////////

function crearTriggers(sheet){

  ScriptApp.newTrigger("nexoTrigger")
      .forSpreadsheet(sheet)
      .onFormSubmit()
      .create();

}

////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

function nexoTrigger(e) {
  const hoja = e.range.getSheet(); 
  const nombreHoja = hoja.getName();
  const datos = e.values;
  const filaActual = e.range.getRow();

  switch (nombreHoja) {
    case "Producción":
      tProduccion(datos,hoja);
      break;
    case "Clientes":
      tCliente(datos);
      break;
    case "Proveedor":
      tProveedor(datos);
      break;
    case "Empleados":
      tEmpleado(datos);
      break;
    case "Articulo":
      tArticulo(datos);
      break;
    case "Proveedor Costo fijo":
      tProveedorCF(datos);
      break;
    case "Compras":
      tCompras(datos,hoja);
      break;
    case "Ventas":
      tVentas(datos,hoja,filaActual);
      break;
    case "Costos fijos":
      tCostoFijo(datos,hoja,filaActual);
      break;
    default:
      Logger.log("Formulario desconocido: " + nombreHoja);
  }

}

function pruebaQueEsDate(){
  const sheet = SpreadsheetApp.openById(PropertiesService.getUserProperties().getProperty("HojaResultadosID"));
  const hoja = sheet.getSheetByName("Punto Eq");
  const dato = new Date();
  hoja.getRange("A2").setValue(dato)
  const nuevo = hoja.getRange("A2").getValue()
  Logger.log(typeof(nuevo));
}

