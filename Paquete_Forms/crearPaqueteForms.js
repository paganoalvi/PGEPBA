function crearPaquete() {
  // Crear carpetas principales
  let folderPortal = DriveApp.createFolder("Portal Gestión");
  let folderResultados = folderPortal.createFolder("Resultados");
  let folderGestion = folderPortal.createFolder("Gestion");

  // Crear los formularios
  const formularios = [
    proveedorCF(),         // índice 0
    proveedor(),           // índice 1
    compras(),             // índice 2
    cliente(),             // índice 3
    ventas(),              // índice 4
    empleado(),            // índice 5
    costosFijos(),         // índice 6
    produccion(),          // índice 7
    articulo(),            // índice 8
    productoTerminado(),   // índice 9
  ];

  // Crear hoja de resultados
  const respuestasForm = SpreadsheetApp.create("Resultados");
  const respuestasId = respuestasForm.getId();
  const respuestasUrl = respuestasForm.getUrl();
  const archivo = DriveApp.getFileById(respuestasId);
  archivo.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  // Guardar propiedades
  PropertiesService.getUserProperties().setProperty("HojaResultadosID", respuestasId);
  PropertiesService.getUserProperties().setProperty("HojaResultados", respuestasUrl);

  // Asignar cada formulario al mismo Sheet
  formularios.forEach((form) => {
    form.setDestination(FormApp.DestinationType.SPREADSHEET, respuestasId);
    // Mover el formulario a su carpeta de gestión
    const file = DriveApp.getFileById(form.getId());
    file.moveTo(folderGestion);
  });
  const sheetFile = DriveApp.getFileById(respuestasId);
  sheetFile.moveTo(folderResultados);
   ScriptApp.newTrigger("configurarHojas")
    .timeBased()
    .after(1 * 60 * 1000) // 1 minuto después de que este script termina
    .create();

  Logger.log(`Carpeta principal creada con ID: ${folderPortal.getId()}`);
  return folderPortal;
}


/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

function configurarHojas() {
  let propert = PropertiesService.getUserProperties();
  let sheet = SpreadsheetApp.openByUrl(propert.getProperty("HojaResultados"));
  let hojas = sheet.getSheets();
  hojas[0].setName("Producto terminado");
  hojas[1].setName("Articulo");
  hojas[2].setName("Producción");
  hojas[3].setName("Costos fijos");
  hojas[4].setName("Empleados");
  hojas[5].setName("Ventas");
  hojas[6].setName("Clientes");
  hojas[7].setName("Compras");
  hojas[8].setName("Proveedor");
  hojas[9].setName("Proveedor Costo fijo");
  const colP = hojas[10].getRange("B1");
  const colU = hojas[10].getRange("C1")
  colP.setValue("Nombre de los productos terminados");
  colU.setValue("Cant. Unidades");
  colP.setWrap(true);
  colU.setWrap(true);

  const docId = sheet.getId(); 

  hojas.forEach((hoja,i) => {
    const gid = hoja.getSheetId();
    const url = `https://docs.google.com/spreadsheets/d/${docId}/edit#gid=${gid}`;
    
    // Guardamos en PropertiesService con clave basada en el nombre
    propert.setProperty(`Hoja${i}`, url);
  });
  
  crearTriggers(sheet);
}


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





///////////////////////////////////////////////////////////////////////////////////////////////
////// insertar url de forms secundarios ARTICULO Y PROVEEDOR  en forms primario COMPRAS///////
///////////////////////////////////////////////////////////////////////////////////////////////
function insertarPublishedUrlCompras(editForm,urlArticulo,urlProveedor){
  const formCompras = FormApp.openByUrl(PropertiesService.getUserProperties().getProperty(editForm));
  let items = formCompras.getItems(); 
  const urlArt = PropertiesService.getUserProperties().getProperty(urlArticulo);
  const urlProvee = PropertiesService.getUserProperties().getProperty(urlProveedor );
  items[1].setHelpText("Seleccione un articulo para llevar registro o agreguelo con el siguiente enlace => " + urlArt); // seteo helpText de forms compras item articulo con link a forms articulo
  items[2].setHelpText("Seleccione un proveedor para llevar registro o agreguelo con el siguiente enlace => " + urlProvee ); // seteo helpText de forms compras item proveedor con link a forms proveedor
}

///////////////////////////////////////////////////////////////////////////////////////////////
////// insertar url de forms secundarios CLIENTE en forms primario VENTAS///////
/////////////////////////////////////////////////////////////////////////////////////////////// 
function insertarPublishedUrlVentas(editForm,unCliente){
  const formVentas = FormApp.openByUrl(PropertiesService.getUserProperties().getProperty(editForm));
  let items = formVentas.getItems();
  const urlClie = PropertiesService.getUserProperties().getProperty(unCliente );
  items[2].setHelpText("Seleccione desde la casilla desplegable o agregue un CLIENTE con el siguiente enlace => " + urlClie); // seteo helpText de forms compras item articulo con link a forms articulo
  items[14].setHelpText("Seleccione desde la casilla desplegable o agregue un CLIENTE con el siguiente enlace => " + urlClie); // seteo helpText de forms compras item articulo con link a forms articulo
} 

///////////////////////////////////////////////////////////////////////////////////////////////
////// insertar url de forms secundario PRODUCTO TERMINADO en forms primario PRODUCCION///////
/////////////////////////////////////////////////////////////////////////////////////////////// 
function insertarPublishedUrlProduccion(editForm,unProductoTerminado){
  const formProduccion = FormApp.openByUrl(PropertiesService.getUserProperties().getProperty(editForm));
  let items = formProduccion.getItems();
  const urlProducT = PropertiesService.getUserProperties().getProperty(unProductoTerminado);
  items[7].setHelpText("Seleccione desde la casilla desplegable o agregue un PRODUCTO TERMINADO con el siguiente enlace => " + urlProducT); // seteo helpText de forms VENTAS item PRODUCTO TERMINADO con link a forms producto terminado 
}

///////////////////////////////////////////////////////////////////////////////////////////////
////// insertar url de forms secundarios ADMINISTRACION,COMERCIALIZACION,SERVICIO CF,SUELDOS,IMPUESTOS en forms primario COSTOS FIJOS///////
/////////////////////////////////////////////////////////////////////////////////////////////// 
function insertarPublishedUrlCostosFijos(editForm,unEmpleado,unProveedor){

  const formCostosfijos = FormApp.openByUrl(PropertiesService.getUserProperties().getProperty(editForm));
  let items = formCostosfijos.getItems();

  const urlSueldos = PropertiesService.getUserProperties().getProperty(unEmpleado);
  items[2].setHelpText("Seleccione desde la casilla desplegable o agregue un EMPLEADO con el siguiente enlace => " + urlSueldos); // seteo helpText de forms COSTOS FIJOS item SUELDOS con link a forms empleados
  
  const urlServCF = PropertiesService.getUserProperties().getProperty(unProveedor);
  items[11].setHelpText("Seleccione desde la casilla desplegable o agregue un PROVEEDOR con el siguiente enlace => "+unProveedor + urlServCF); // seteo helpText de forms COSTOS FIJOS item SERVICIOS con link a forms serviciosCF

}







function formsLayers (){
Logger.log("Insertando urls clientes,empleados,proveedores,articulos,productos terminados,administracion,comercializacion.serviciosCF e impuestos");

insertarPublishedUrlCompras("formularioComprasEditUrl","formularioArticulosUrl","formularioProveedorUrl"); // se agrega capa de formularios secundarios ARTICULOS,PROVEEDORES en formulario primario COMPRAS

insertarPublishedUrlVentas("formularioVentasEditUrl","formularioClientesUrl"); // se agrega capa de formularios secundarios CLIENTES en formulario primario VENTAS
Logger.log("/////////////////////////////////////////////////////////////////////////////////////");
Logger.log("Paso el de ventas");

insertarPublishedUrlProduccion("formularioProduccionEditUrl","formularioProductoTerminadoUrl"); // se agrega capa de formuarlio secundario PRODUCTOS TERMINADOS en formulario primario PRODUCCION
Logger.log("Paso el de Producción");
insertarPublishedUrlCostosFijos("formularioCostosFijosEditUrl","formularioEmpleadosUrl","formularioProveedorCFUrl"); // agrego la capa de formularios secudarios EMPLEADOS Y PROVEEDORES
Logger.log("Paso el de Costo fijo");
}







