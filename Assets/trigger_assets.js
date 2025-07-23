function tArticulo(dt){
  var datoArt = dt[1];
  let formComp = FormApp.openByUrl(PropertiesService.getUserProperties().getProperty("formularioComprasEditUrl"));
  let itemsC = formComp.getItems();
  let artC = itemsC[1].asListItem(); // Corregido: llamada a asListItem()
  let opcionesActualesC = artC.getChoices().map(choice => choice.getValue()); // Obtener opciones actuales
  opcionesActualesC.push(datoArt); // Agregar nuevo dato
  artC.setChoices(opcionesActualesC.map(valor => artC.createChoice(valor)));

  let datoSeparador = dt[2];
  let formProd = FormApp.openByUrl(PropertiesService.getUserProperties().getProperty("formularioProduccionEditUrl"));
  let itemsP = formProd.getItems();

  if(datoSeparador == "Materia prima"){
    let artP = itemsP[2].asListItem(); // Corregido: llamada a asListItem();
    let opcionesActualesP = artP.getChoices().map(choice => choice.getValue()); // Obtener opciones actuales
    opcionesActualesP.push(datoArt); // Agregar nuevo dato
    artP.setChoices(opcionesActualesP.map(valor => artP.createChoice(valor)));
  }else{
    if(datoSeparador == "Herramienta"){
      let artP = itemsP[4].asListItem(); // Corregido: llamada a asListItem();
      let opcionesActualesP = artP.getChoices().map(choice => choice.getValue()); // Obtener opciones actuales
      opcionesActualesP.push(datoArt); // Agregar nuevo dato
      artP.setChoices(opcionesActualesP.map(valor => artP.createChoice(valor)));
    }
  }
}




function tEmpleado(dt){
  
  var datoProveedor = dt[1]
  let formComp = FormApp.openByUrl(PropertiesService.getUserProperties().getProperty("formularioCostosFijosEditUrl"));
  let itemsC = formComp.getItems();
  let proveedorC = itemsC[2].asListItem(); // Corregido: llamada a asListItem()
  let opcionesActualesC = proveedorC.getChoices().map(choice => choice.getValue()); // Obtener opciones actuales
  opcionesActualesC.push(datoProveedor); // Agregar nuevo dato
  proveedorC.setChoices(opcionesActualesC.map(valor => proveedorC.createChoice(valor)));
}

function tCliente(dt){
  
  var datoCliente = dt[2];
  let formComp = FormApp.openByUrl(PropertiesService.getUserProperties().getProperty("formularioVentasEditUrl"));
  let itemsC = formComp.getItems();
  let clienteC = itemsC[2].asListItem(); // Corregido: llamada a asListItem()
  let opcionesActualesC = clienteC.getChoices().map(choice => choice.getValue()); // Obtener opciones actuales
  opcionesActualesC.push(datoCliente); // Agregar nuevo dato
  clienteC.setChoices(opcionesActualesC.map(valor => clienteC.createChoice(valor)));

  clienteC = itemsC[14].asListItem(); // Corregido: llamada a asListItem()
  opcionesActualesC = clienteC.getChoices().map(choice => choice.getValue()); // Obtener opciones actuales
  opcionesActualesC.push(datoCliente); // Agregar nuevo dato
  clienteC.setChoices(opcionesActualesC.map(valor => clienteC.createChoice(valor)));
}


function tProductoTerminado(dt){
  var datoProveedor = dt[1];
  let formComp = FormApp.openByUrl(PropertiesService.getUserProperties().getProperty("formularioProduccionEditUrl"));
  let itemsC = formComp.getItems();
  let proveedorC = itemsC[7].asListItem(); // Corregido: llamada a asListItem()
  let opcionesActualesC = proveedorC.getChoices().map(choice => choice.getValue()); // Obtener opciones actuales
  opcionesActualesC.push(datoProveedor); // Agregar nuevo dato
  proveedorC.setChoices(opcionesActualesC.map(valor => proveedorC.createChoice(valor)));

  let formV = FormApp.openByUrl(PropertiesService.getUserProperties().getProperty("formularioVentasEditUrl"));
  itemsC = formV.getItems();
  proveedorC = itemsC[3].asListItem(); // Corregido: llamada a asListItem()
  opcionesActualesC = proveedorC.getChoices().map(choice => choice.getValue()); // Obtener opciones actuales
  opcionesActualesC.push(datoProveedor); // Agregar nuevo dato
  proveedorC.setChoices(opcionesActualesC.map(valor => proveedorC.createChoice(valor)));
  //AÑADIR EL PRODUCTO TERMINADO A LA HOJA 1 DE STOCK
  let sheet = SpreadsheetApp.openById(PropertiesService.getUserProperties().getProperty("HojaResultadosID"));
  let hojaStock = sheet.getSheetByName("Hoja 1");
  const nuevaFila = hojaStock.getLastRow() + 1;
  hojaStock.getRange(nuevaFila, 2).setValue(datoProveedor);
}


function tProveedor(dt){
  
  var datoProveedor = dt[3] // obtienemos NOMBRE  PROVEEDOR
  let formComp = FormApp.openByUrl(PropertiesService.getUserProperties().getProperty("formularioComprasEditUrl"));
  let itemsC = formComp.getItems();
  let proveedorC = itemsC[2].asListItem(); // Corregido: llamada a asListItem()
  let opcionesActualesC = proveedorC.getChoices().map(choice => choice.getValue()); // Obtener opciones actuales
  opcionesActualesC.push(datoProveedor); // Agregar nuevo dato
  proveedorC.setChoices(opcionesActualesC.map(valor => proveedorC.createChoice(valor)));
}

function tProveedorCF(dt){
  var datoProveedor = dt[2] // obtienemos NOMBRE  PROVEEDOR
  let formComp = FormApp.openByUrl(PropertiesService.getUserProperties().getProperty("formularioCostosFijosEditUrl"));
  let itemsC = formComp.getItems();
  let proveedorC = itemsC[11].asListItem(); // Corregido: llamada a asListItem()
  let opcionesActualesC = proveedorC.getChoices().map(choice => choice.getValue()); // Obtener opciones actuales
  opcionesActualesC.push(datoProveedor); // Agregar nuevo dato
  proveedorC.setChoices(opcionesActualesC.map(valor => proveedorC.createChoice(valor)));
}
/////////////////////////////////////////////////////////////
//ACTUALIZAR STOCK DE PRODUCTOS TERMINADU////////////////////////
///////////////////////////////////////////////////////

function actualizarStockDeProductosTerminados(dt,hoja) {
  Logger.log(dt[6]+" "+dt[8])
  if(dt[1] == "Productos terminados"){
    
    // Leer producto y unidades desde la última fila de egresos
    const producto = dt[6]
    const unidades = dt[8] 
    const hojaStock = hoja.getParent().getSheetByName("Hoja 1");
    if (producto && !isNaN(unidades)) {
      const ultimaFilaStock = hojaStock.getLastRow();
      let datosStock = [];
      if (ultimaFilaStock >= 2) {
        // Hay al menos una fila de datos debajo de los encabezados
        datosStock = hojaStock.getRange(2, 2, ultimaFilaStock - 1, 2).getValues();  // Columnas B y C
      }
        // Columnas B y C

      for (let i = 0; i < datosStock.length; i++) {
        const nombre = datosStock[i][0];
        const unidadesActuales = datosStock[i][1] || 0;

        if (nombre === producto) {
          const suma = (+unidadesActuales) + (+unidades);
          // Si el producto ya existe, actualiza solo la celda de unidades
          hojaStock.getRange(i + 2, 3).setValue(suma);  // Columna C
          Logger.log(`Producto "${producto}" actualizado con ${unidades} unidades.`);
          return;
        }
      }

      // Si el producto no existe, agregarlo al final
      const nuevaFila = hojaStock.getLastRow() + 1;
      hojaStock.getRange(nuevaFila, 2).setValue(producto);   // Columna B
      hojaStock.getRange(nuevaFila, 3).setValue(unidades);   // Columna C
      Logger.log(`Producto "${producto}" agregado con ${unidades} unidades.`);
    } else {
      Logger.log("Datos inválidos. No se actualizó el stock.");
    }
  }
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
  const hoja = e.range.getSheet(); // Requiere trigger instalable
  const nombreHoja = hoja.getName();
  const datos = e.values; // También podés usar e.values

  switch (nombreHoja) {
    case "Producción":
      actualizarStockDeProductosTerminados(datos,hoja);
      break;
    case "Producto terminado":
      tProductoTerminado(datos);
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
    default:
      Logger.log("Formulario desconocido: " + nombreHoja);
  }

}





