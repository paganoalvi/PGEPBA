function crearPaquete() {
  // Crear carpetas principales
  
  let folderPortal = DriveApp.createFolder("Portal Gestión");
  let folderResultados = folderPortal.createFolder("Resultados");
  let folderGestion = folderPortal.createFolder("Gestion");

  // Crear los formularios
  const formularios = [
    crearFormCalendarizacion(), //indice 13
    crearFormCobro(),         //indice 12
    eliminacionEmpleado(),    // indice 11
    eliminacionServicio(),    // indice 10
    proveedorCF(),             // índice 9
    proveedor(),              // índice 8
    compras(),                 // índice 7
    cliente(),                 // índice 6  
    empleado(),               // índice 5
    costosFijos(),              // índice 4
    crearFormConstitucionDelServicio(), // índice 3
    crearFormCoCo(),             // índice 2
    crearFormEntregaServicio(),  //indice 1
    articulo()                //indice 0 
  ];

  // Crear hoja de resultados
  const respuestasForm = SpreadsheetApp.create("Resultados");
  const sheetDeHitorico = SpreadsheetApp.create("Cuentas Mensuales");
  PropertiesService.getUserProperties().setProperty("HojaResultadosHistorico",sheetDeHitorico.getId());
  
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
  const cuotasMensualesFile = DriveApp.getFileById(sheetDeHitorico.getId());
  const sheetFile = DriveApp.getFileById(respuestasId);
  sheetFile.moveTo(folderResultados);
  cuotasMensualesFile.moveTo(folderResultados);
  
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
  const propert = PropertiesService.getUserProperties();
  const sheet = SpreadsheetApp.openByUrl(propert.getProperty("HojaResultados"));
  



  let hojas = sheet.getSheets();
   
  hojas[0].setName("Articulo");
  hojas[1].setName("Prestación de servicio");
  hojas[2].setName("Contratación");
  hojas[3].setName("Mis servicios");
  hojas[4].setName("Costos fijos");
  hojas[5].setName("Empleados");
  hojas[6].setName("Clientes");
  hojas[7].setName("Compras");
  hojas[8].setName("Proveedor");
  hojas[9].setName("Proveedor Costo fijo");
  hojas[10].setName("Servicios Eliminados");
  hojas[11].setName("Empleados Eliminados");
  hojas[12].setName("Cobros");
  hojas[13].setName("Calendarizacion");
  hojas[14].setName("Stock");
  let hojaEquilibrio = sheet.insertSheet("Punto Eq");
  const hojaSueldos = sheet.insertSheet("Pago de Sueldos");
  const encabezadosHojaSueldos = ["Nombre Empleado","Servicios pagados","Pago total","Fecha de pago","Marca de analisis","Pagos Pendientes"];
  hojaSueldos.getRange(1,1,1,encabezadosHojaSueldos.length).setValues([encabezadosHojaSueldos]).setWrap(true);
  


  // SE INICIA A1 "BAJAS" EN 0 PORQUE NO HAY Y A2 "ULTIMO ESPACIO" EN 2 PARA TENER 2 COLUMNAS LIBRES
  // MISMA LOGICA PARA LAS CELDAS A1 COMO BAJAS Y A2 "ULTIMO ESPACIO" PARA MATERIAS PRIMAS pero de Stock stock
  hojas[14].getRange("A1").setValue(2);
  //ESPACIO VACIO PARA PT's TOTALES
  // ESPACIO VACIO PARA PT´s POR LOTE
  hojas[14].getRange("A2:A4").setValue(2);
  
  ////////////////inicializar mes//////////////////////
  sheet.setSpreadsheetLocale('en_US');
  hojaEquilibrio.getRange("A2").setValue(new Date());
  hojaEquilibrio.getRange("A1").setValue("Mes Actual NO MODIFICAR")
  hojaEquilibrio.getRange("C2").setValue(0);
   ////////////////instalacion formulas//////////////
  hojaEquilibrio.getRange("C5").setFormula("=SUM(K2:K50)");
  hojaEquilibrio.getRange("C8").setFormula("=SUM(I2:I50)");
  hojaEquilibrio.getRange("C12").setFormula("=SUM(L2:L50)");
  hojaEquilibrio.getRange("C15").setFormula("=SUM(N2:N50)");
  hojaEquilibrio.getRange("C18").setFormula("=SUM(J2:J50)");
  hojaEquilibrio.getRange("C21").setFormula("=SUM(M2:M50)");

  hojaEquilibrio.getRange("L2:L50").setFormula("=J2-I2");
  hojaEquilibrio.getRange("M2:M50").setFormula("=ROUND(K2/$C$5,2)");
  hojaEquilibrio.getRange("N2:N50").setFormula("=ROUND(L2*M2,2)");
  hojaEquilibrio.getRange("O2:O50").setFormula("=ROUND(M2*$E$2,2)");
  hojaEquilibrio.getRange("P2:P50").setFormula("=ROUND(O2*I2,2)");
  hojaEquilibrio.getRange("I2:I50").setFormula("=ROUND(H2+G2,2)");
  
  //////////////SEGUNDA TANDA DE CALCULOS////////////////////////////////////
  hojaEquilibrio.getRange("E2").setFormula("=ROUND(C2/C15,2)");
  hojaEquilibrio.getRange("E5").setFormula("=ROUND(SUM(P2:P50),2)");
  hojaEquilibrio.getRange("E8").setFormula("=ROUND(SUM(Q2:Q50),2)");
  hojaEquilibrio.getRange("E12").setFormula("=ROUND(SUM(R2:R50),2)");
  hojaEquilibrio.getRange("Q2:Q50").setFormula("=ROUND(M2*J2,2)");
  hojaEquilibrio.getRange("R2:R50").setFormula("=ROUND(M2*I2,2)");

  //////////////MATRIZ////////////////////////////////////////////////////////
  hojaEquilibrio.getRange("T2").setFormula("=ARRAYFORMULA((ROW(T2:T21)-ROW(T2)+1)*0.1)");
  hojaEquilibrio.getRange("U2:U21").setFormula("=ROUND(T2*$E$2,2)");
  hojaEquilibrio.getRange("V2:V21").setFormula("=ROUND(U2*$E$8,2)");
  hojaEquilibrio.getRange("W2:W21").setFormula("=$C$2");
  hojaEquilibrio.getRange("X2:X21").setFormula("=ROUND(U2*$E$12,2)");
  hojaEquilibrio.getRange("Y2:Y21").setFormula("=ROUND(X2+$C$2,2)");
  hojaEquilibrio.getRange("Z2:Z21").setFormula("=ROUND(V2-Y2,2)");
  
    
  hojaEquilibrio.getRange("C1").setValue("Costos Fijos");
  hojaEquilibrio.getRange("C4").setValue("Ventas Totales");
  hojaEquilibrio.getRange("C7").setValue("Total Costo Var. Unit.");
  hojaEquilibrio.getRange("C11").setValue("Costo F. / Und");
  hojaEquilibrio.getRange("C14").setValue("Suma Contrib. Marg. Prom. Ponderada");
  hojaEquilibrio.getRange("C17").setValue("Precio Total Unit. Productos");
  hojaEquilibrio.getRange("C20").setValue("Fracción total");
  
  hojaEquilibrio.getRange("E1").setValue("Cantidad Total en equilibrio");
  hojaEquilibrio.getRange("E4").setValue("Ingresos Total en Eq.");
  hojaEquilibrio.getRange("E7").setValue("Precio Pond. Total");
  hojaEquilibrio.getRange("E11").setValue("Costo Pond. Total");

  hojaEquilibrio.getRange(1,6,1,21).setValues([
    ["Servicios",
    "Costo Ref. Empleados", 
    "Costos Ref. Insumos",
    "Costo Var. Unit.",
    "Precio Venta Unit.",
    "Cantidad ventas * Servicio",
    "Contribucion Marginal Unitaria",
    "Faccion Participacion Ventas",
    "Contribución Marginal Prom Ponderada",
    "Cantidad x Prod. en Eq.",
    "Ingresos en Eq. de Prod.",
    "Precio Ponderado",
    "Costo Ponderado",
    "",
    "Multiplicador",
    "Cantidades",
    "Ingresos",
    "Costos Fijos",
    "Costo Var. Graf.",
    "Costo Total",
    "Utilidades"]
  ]);
  hojas[14].getRange(1,2,1,10).setValues([
    [ "Insumos No Cons.",
    "Stock no Cons.",
    "",
    "Insumos Cons.",
    "Stock Cons.",
    "Precio Ref. x Und",
    "Und.",
    "",
    "Productos terminados x lote",
    "Precio Ref."
    ]
  ]);
  ///////////////////ESTILAR SHEET///////////////////////
  hojaEquilibrio.getRange("A1:Z1").setFontColor("#FFFFFF").setFontWeight("bold");
  hojaEquilibrio.getRange("A1").setBackground("black");
  hojaEquilibrio.getRangeList(["C1", "C4", "C7","C11" ,"C14", "C17", "C20", "E1","E4","E7","E11"]).setBackground("#F54927").setFontColor("#FFFFFF");

  //////Modificacion para autoajuste de texto/////////
  hojaEquilibrio.getRange(1,1,1,24).setWrap(true);
  hojas[14].getRange(1,2,1,9).setWrap(true);
  hojas.forEach(hoja => {
    const protection = hoja.protect().setDescription("Aviso: No modifiques la hoja completa");
    protection.setWarningOnly(true);
    
  });
  
  
  const docId = sheet.getId(); 

  hojas.forEach((hoja,i) => {
    const gid = hoja.getSheetId();
    const url = `https://docs.google.com/spreadsheets/d/${docId}/edit#gid=${gid}`;
    
    // Guardamos en PropertiesService con clave basada en el nombre
    propert.setProperty(`Hoja${i}`, url);
  });
  
  crearTriggers(sheet);
  formsLayers();

  ///////////////////PROTECCIONES//////////////////////////////

  const rangos = ["A1:I100", "L1:Z100"];
  rangos.forEach(r => {
    const protection = hojaEquilibrio.getRange(r).protect().setDescription("Aviso: No modifiques estas celdas");
    protection.setWarningOnly(true);
  });


  const idOrigen = '19osiYr48yKQVIeNu8GRdLHmEDb1NcLdKjHIMEgzPTy0';
  if(tieneAcceso(idOrigen)){
    const hojaOrigen = SpreadsheetApp.openById(idOrigen).getSheets().find(sheet => sheet.getSheetId() === 1868478701);
    const hojaCopia = hojaOrigen.copyTo(sheet);
    hojaCopia.setName('Calculos Guia Punto Eq');
  }
  propert.setProperty("paqueteActivado","true");
  ScriptApp.newTrigger("pintarHoja")
    .timeBased()
    .after(1 * 60 * 1000) // 1 minuto después de que este script termina
    .create();
}
///////////////////////////////revisar acceso hoja guia//////////////////////
function tieneAcceso(id) {
  try {
    SpreadsheetApp.openById(id); // si no tiene acceso, explota acá
    return true;
  } catch (e) {
    return false;
  }
}
function pintarHoja(){
  const props = PropertiesService.getUserProperties();
  const sheet = SpreadsheetApp.openById(props.getProperty("HojaResultadosID"));
  const hojaStock = sheet.getSheetByName("Stock");
  const hojaSueldos = sheet.getSheetByName("Pago de Sueldos");
  const hojaEquilibrio = sheet.getSheetByName("Punto Eq")
  hojaSueldos.getRange("A1:F1").setFontColor("white");
  hojaSueldos.getRange("A1:F100").applyRowBanding(SpreadsheetApp.BandingTheme.CYAN);

  hojaStock.getRange(1,2,1,9).setFontColor("white");
  hojaStock.getRange("A5").setValue("NO MODIFICAR ESTOS VALORES").setWrap(true);
  hojaStock.getRange("A1:A5").setBackground("black").setFontColor("white");
  hojaStock.getRange("B1:C100").applyRowBanding(SpreadsheetApp.BandingTheme.CYAN);
  hojaStock.getRange("E1:H100").applyRowBanding(SpreadsheetApp.BandingTheme.TEAL);
  hojaStock.getRange("J1:K100").applyRowBanding(SpreadsheetApp.BandingTheme.ORANGE);

  hojaEquilibrio.getRange("T1:Z21").applyRowBanding(SpreadsheetApp.BandingTheme.ORANGE);
  hojaEquilibrio.getRange("L1:R50").applyRowBanding(SpreadsheetApp.BandingTheme.GREY);
  hojaEquilibrio.getRange("F1:J50").applyRowBanding(SpreadsheetApp.BandingTheme.GREY);
  hojaEquilibrio.getRange("K1:K50").applyRowBanding(SpreadsheetApp.BandingTheme.BLUE);
  
}

/* CONSTANTE INDICES DE PREGUNTAS EN FORMULARIOS PRINCIPALES*/
// Indices de FORMS COMPRAS
  const indicePreguntaMateriaPrima = 3;
  const indicePreguntaArticulo = 10;
  const indicePreguntaProveedor =7;
  const indicePreguntaProveedorServ = 17;

// Indices de FORMS VENTAS
  const indicePreguntaClientes = 3;

// Indices de FORMS COSTOS FIJOS
  const indicePreguntaEmpleados = 3;
  const indicePreguntaProveedorCF = 5;



function insertarPublishedUrlCompras(editForm,urlArticulo,urlProveedor){
  const formCompras = FormApp.openByUrl(PropertiesService.getUserProperties().getProperty(editForm));
  let items = formCompras.getItems(); 
  const urlArt = PropertiesService.getUserProperties().getProperty(urlArticulo);
  const urlProvee = PropertiesService.getUserProperties().getProperty(urlProveedor );

  items[3].setHelpText("Seleccioná un insumo existente o agregá uno usando el siguiente enlace ➡" + urlArt); // seteo helpText de forms compras item insumo con link a forms articulo
  items[indicePreguntaArticulo].setHelpText("Seleccioná una herramienta/maquinaria o agregá una usando el siguiente enlace ➡" + urlArt); // seteo helpText de forms compras item herramienta con link a forms articulo

  items[indicePreguntaProveedor].setHelpText("Seleccioná un proveedor existente o agregá uno usando el siguiente enlace ➡" + urlProvee ); // seteo helpText de forms compras item proveedor con link a forms proveedor

  items[indicePreguntaProveedorServ].setHelpText("Seleccioná un proveedor existente o agregá uno usando el siguiente enlace ➡" + urlProvee ); // seteo helpText de forms compras item proveedor con link a forms proveedor

  // AGREGAR PROVEEDOR DE SERVICIOS EN COMPRAS?? SISI
}

function insertarPublishedUrlConstitucionServ(editForm,unArticulo){
  const formConstitucionServ = FormApp.openByUrl(PropertiesService.getUserProperties().getProperty(editForm));
  let items = formConstitucionServ.getItems();
  const urlArt = PropertiesService.getUserProperties().getProperty(unArticulo );
  items[indicePreguntaClientes].setHelpText("Seleccioná un INSUMO o agregá uno con el siguiente enlace ➡" + urlArt); // seteo helpText de forms compras item articulo con link a forms articulo
  
  items[4].setHelpText("Seleccioná HERRAMIENTA / MÁQUINA o agregá una con el siguiente enlace ➡" + urlArt);
} 




///////////////////////////////////////////////////////////////////////////////////////////////
////// insertar url de forms secundarios ADMINISTRACION,COMERCIALIZACION,SERVICIO CF,SUELDOS,IMPUESTOS en forms primario COSTOS FIJOS///////
/////////////////////////////////////////////////////////////////////////////////////////////// 
function insertarPublishedUrlCostosFijos(editForm,unProveedor){

  const formCostosfijos = FormApp.openByUrl(PropertiesService.getUserProperties().getProperty(editForm));
  let items = formCostosfijos.getItems();

  const urlServCF = PropertiesService.getUserProperties().getProperty(unProveedor);
  items[indicePreguntaProveedorCF].setHelpText("Seleccioná un PROVEEDOR o agregá uno nuevo a tu cartera con el siguiente enlace ➡" + urlServCF); // seteo helpText de forms COSTOS FIJOS item SERVICIOS con link a forms serviciosCF
}

function eliminarSeccionFinalizar() {
  const form = FormApp.openByUrl(
    PropertiesService.getUserProperties().getProperty("formularioEntregaEditUrl")
  );

  const items = form.getItems();

  //  Buscar la pregunta que tiene la ramificación
  const preguntaInsumos = items.find(i => i.getTitle() === "¿Uso de insumos o herramientas?");
  if (!preguntaInsumos) {
    Logger.log("No se encontró la pregunta '¿Uso de insumos o herramientas?'");
    return;
  }

  // 2Romper la ramificación (quitar los destinos de página)
  const mc = preguntaInsumos.asMultipleChoiceItem();
  mc.setChoices([
    mc.createChoice("Sí", FormApp.PageNavigationType.CONTINUE), // sigue normal a Insumos
    mc.createChoice("No", FormApp.PageNavigationType.SUBMIT)    // ahora 'No' envía directamente
  ]);

  // Buscar y eliminar la sección "Finalizar formulario"
  const seccionFinal = items.find(i => i.getTitle() === "Finalizar formulario");
  if (seccionFinal) {
    form.deleteItem(seccionFinal);
    Logger.log("Se eliminó la sección 'Finalizar formulario'");
  } else {
    Logger.log("No se encontró la sección 'Finalizar formulario'");
  }
}

function insertarPublishedUrlCoCo(editForm,unCliente,unEmpleado){
  /*para pruebas locales
  const editForm = FormApp.openByUrl(PropertiesService.getUserProperties().getProperty("formularioCoCoEditUrl"));
  const unCliente = "formularioClientesUrl";
  const unEmpleado = "formularioEmpleadosUrl";*/
  const formCoCo = FormApp.openByUrl(PropertiesService.getUserProperties().getProperty(editForm));
  let items = formCoCo.getItems();
  const urlCliente = PropertiesService.getUserProperties().getProperty(unCliente);
  items[1].setHelpText("Seleccioná un CLIENTE o agregá uno nuevo a tu cartera con el siguiente enlace ➡ "+ urlCliente);

  const urlEmpe = PropertiesService.getUserProperties().getProperty(unEmpleado);
  items[7].setHelpText("Seleccioná los empleados pre-asignados o agregá un empleado con el siguiente enlace ➡"+ urlEmpe);

}

function formsLayers (){
Logger.log("Insertando urls clientes,empleados,proveedores,articulos,productos terminados");

insertarPublishedUrlCompras("formularioComprasEditUrl","formularioArticulosUrl","formularioProveedorUrl"); // se agrega capa de formularios secundarios ARTICULOS,PROVEEDORES en formulario primario COMPRAS
Logger.log("/////////////////////////////////////////////////////////////////////////////////////");
Logger.log("Se insertaron links a forms secundarios en compras");

insertarPublishedUrlConstitucionServ("formularioConstitucionEditUrl","formularioArticulosUrl"); // se agrega capa de formularios secundarios ARTICULO en formulario primario CONSTITUCUION SERVICIO
Logger.log("/////////////////////////////////////////////////////////////////////////////////////");
Logger.log("Se insertaron links a forms secundarios en constitucion");

insertarPublishedUrlCostosFijos("formularioCostosFijosEditUrl","formularioProveedorCFUrl"); // agrego la capa de formularios secudarios PROVEEDORESCF
Logger.log("/////////////////////////////////////////////////////////////////////////////////////");
Logger.log("Se insertaron links a forms secundarios en Costo fijo");

insertarPublishedUrlCoCo("formularioCoCoEditUrl","formularioClientesUrl","formularioEmpleadosUrl"); // agrego la capa de formularios secudarios CLIENTE
Logger.log("/////////////////////////////////////////////////////////////////////////////////////");
Logger.log("Se insertaron links a forms secundarios en CoCo");

Logger.log("/////////////////////////////////////////////////////////////////////////////////////");
/**ELimino la seccion finalizar en formulario entrega */
eliminarSeccionFinalizar();
Logger.log("Se elimino la pregunta PAGE_BRAKE del formulario entrega");
}