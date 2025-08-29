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
  hojas[1].setName("Producción");
  hojas[2].setName("Costos fijos");
  hojas[3].setName("Empleados");
  hojas[4].setName("Ventas");
  hojas[5].setName("Clientes");
  hojas[6].setName("Compras");
  hojas[7].setName("Proveedor");
  hojas[8].setName("Proveedor Costo fijo");
  hojas[9].setName("Stock");
  let hojaReceta = sheet.insertSheet("Recetas");
  let hojaEquilibrio = sheet.insertSheet("Punto Eq");
  // SE INICIA A1 "BAJAS" EN 0 PORQUE NO HAY Y A2 "ULTIMO ESPACIO" EN 2 PARA TENER 2 COLUMNAS LIBRES
  hojaReceta.getRange("A1").setValue(0);
  hojaReceta.getRange("A2").setValue(3);
  hojaReceta.getRange("B1").setValue("GUIA").setBackground("#F5BE27").setFontWeight("bold")
  // MISMA LOGICA PARA LAS CELDAS A1 COMO BAJAS Y A2 "ULTIMO ESPACIO" PARA MATERIAS PRIMAS pero de Stock stock
  hojas[9].getRange("A1").setValue(0);
  //ESPACIO VACIO PARA PT's TOTALES
  // ESPACIO VACIO PARA PT´s POR LOTE
  hojas[9].getRange("A2:A4").setValue(2);
  
  ////////////////inicializar mes//////////////////////
  sheet.setSpreadsheetLocale('en_US');
  hojaEquilibrio.getRange("A2").setValue(new Date());
  hojaEquilibrio.getRange("A1").setValue("Mes Actual NO MODIFICAR")
  hojaEquilibrio.getRange("C2").setValue(0);
   ////////////////instalacion formulas//////////////
  hojaEquilibrio.getRange("C5").setFormula("=SUM(K2:K50)");
  hojaEquilibrio.getRange("C8").setFormula("=SUM(H2:H50)");
  hojaEquilibrio.getRange("C12").setFormula("=SUM(L2:L50)");
  hojaEquilibrio.getRange("C15").setFormula("=SUM(N2:N50)");
  hojaEquilibrio.getRange("C18").setFormula("=SUM(I2:I50)");
  hojaEquilibrio.getRange("C21").setFormula("=SUM(M2:M50)");

  hojaEquilibrio.getRange("L2:L50").setFormula("=I2-H2");
  hojaEquilibrio.getRange("M2:M50").setFormula("=ROUND(K2/$C$5,2)");
  hojaEquilibrio.getRange("N2:N50").setFormula("=ROUND(L2*M2,2)");
  hojaEquilibrio.getRange("O2:O50").setFormula("=ROUND(M2*$E$2,2)");
  hojaEquilibrio.getRange("P2:P50").setFormula("=ROUND(O2*I2,2)");
  
  //////////////SEGUNDA TANDA DE CALCULOS////////////////////////////////////
  hojaEquilibrio.getRange("E2").setFormula("=ROUND(C2/C15,2)");
  hojaEquilibrio.getRange("E5").setFormula("=ROUND(SUM(P2:P50),2)");
  hojaEquilibrio.getRange("E8").setFormula("=ROUND(SUM(Q2:Q50),2)");
  hojaEquilibrio.getRange("E12").setFormula("=ROUND(SUM(R2:R50),2)");
  hojaEquilibrio.getRange("Q2:Q50").setFormula("=ROUND(M2*I2,2)");
  hojaEquilibrio.getRange("R2:R50").setFormula("=ROUND(M2*H2,2)");

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

  hojaEquilibrio.getRange(1,7,1,20).setValues([
    ["Productos", 
    "Costo Var. Unit.",
    "Precio Venta Unit.",
    "",
    "Cantidad ventas * Producto",
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
  hojas[9].getRange(1,2,1,9).setValues([
    [ "Nombre de los productos terminados",
    "Stock pt",
    "Unidad Producto",
    "Nombre materia prima",
    "Stock mp",
    "Precio Ref. x Und",
    "Unidad compra.",
    "",
    "Productos terminados x lote",
    ]
  ]);
  ///////////////////ESTILAR SHEET///////////////////////
  hojaEquilibrio.getRange("A1:Z1").setFontColor("#FFFFFF").setFontWeight("bold");
  hojaEquilibrio.getRange("A1").setBackground("black");
  hojaEquilibrio.getRange("T1:Z21").applyRowBanding(SpreadsheetApp.BandingTheme.ORANGE);
  hojaEquilibrio.getRange("L1:R50").applyRowBanding(SpreadsheetApp.BandingTheme.GREY);
  hojaEquilibrio.getRange("G1:I50").applyRowBanding(SpreadsheetApp.BandingTheme.GREY);
  hojaEquilibrio.getRange("K1:K50").applyRowBanding(SpreadsheetApp.BandingTheme.BLUE);
  hojaEquilibrio.getRangeList(["C1", "C4", "C7","C11" ,"C14", "C17", "C20", "E1","E4","E7","E11"]).setBackground("#F54927").setFontColor("#FFFFFF");

  //////Modificacion para autoajuste de texto/////////
  hojaEquilibrio.getRange(1,1,1,24).setWrap(true);
  hojas[9].getRange(1,2,1,9).setWrap(true);
  hojas.forEach(hoja => {
    const protection = hoja.protect().setDescription("Aviso: No modifiques la hoja completa");
    protection.setWarningOnly(true);
  });
  hojaReceta.protect()
  const protectionUltima = hojaReceta.protect().setDescription("Aviso: No modifiques la hoja completa");
  protectionUltima.setWarningOnly(true);
  
  const docId = sheet.getId(); 

  hojas.forEach((hoja,i) => {
    const gid = hoja.getSheetId();
    const url = `https://docs.google.com/spreadsheets/d/${docId}/edit#gid=${gid}`;
    
    // Guardamos en PropertiesService con clave basada en el nombre
    propert.setProperty(`Hoja${i}`, url);
  });
  const url2 = `https://docs.google.com/spreadsheets/d/${docId}/edit#gid=${hojaReceta.getSheetId()}`;
  propert.setProperty(`Hoja10`, url2);
  
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
  const hojaRecetas = sheet.getSheetByName("Recetas");
  // const titulos = ["Nombre prod. + Nombre mat. pr.", "Cant mp consumida", "Tipo Unidad", "Cant mp * rendimiento"];
  // const guia = [...titulos, ...titulos];
  // hojaRecetas.getRange(1, 3, 1, guia.length)
  //   .setValues([guia])
  //   .setWrap(true)
  //   .setFontColor("white")
  //   .setBackground("#873100");
  // hojaRecetas.getRange(1,7,1,4).setBackground("#007013");
  // hojaRecetas.getRange("A1:A3").setBackground("black").setFontColor("white");
  // hojaRecetas.getRange("A3").setValue("NO MODIFICAR ESTOS VALORES").setWrap(true);
  // hojaStock.getRange(1,2,1,9).setFontColor("white");
  // hojaStock.getRange("A5").setValue("NO MODIFICAR ESTOS VALORES").setWrap(true);
  // hojaStock.getRange("A1:A5").setBackground("black").setFontColor("white");
  // hojaStock.getRange("B1:D100").applyRowBanding(SpreadsheetApp.BandingTheme.CYAN);
  // hojaStock.getRange("E1:H100").applyRowBanding(SpreadsheetApp.BandingTheme.TEAL);
  // hojaStock.getRange("J1:J100").applyRowBanding(SpreadsheetApp.BandingTheme.ORANGE);
  let cambio = true;
  for (let i = 3; i < 61; i += 4) {
    if(cambio){
      hojaRecetas.getRange(2,i,100,4).setFontWeight("bold").applyRowBanding(SpreadsheetApp.BandingTheme.BROWN);
      cambio = false;
    }else{
      hojaRecetas.getRange(2,i,100,4).setFontColor("white").setFontWeight("bold").applyRowBanding(SpreadsheetApp.BandingTheme.TEAL);
      cambio = true;
    }
  }
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
  const indicePreguntaProveedorCF = 9;



function insertarPublishedUrlCompras(editForm,urlArticulo,urlProveedor){
  const formCompras = FormApp.openByUrl(PropertiesService.getUserProperties().getProperty(editForm));
  let items = formCompras.getItems(); 
  const urlArt = PropertiesService.getUserProperties().getProperty(urlArticulo);
  const urlProvee = PropertiesService.getUserProperties().getProperty(urlProveedor );
  items[indicePreguntaArticulo].setHelpText("Seleccione un articulo para llevar registro o agreguelo con el siguiente enlace => " + urlArt); // seteo helpText de forms compras item articulo con link a forms articulo
  items[indicePreguntaProveedor].setHelpText("Seleccione un proveedor para llevar registro o agreguelo con el siguiente enlace => " + urlProvee ); // seteo helpText de forms compras item proveedor con link a forms proveedor

  items[indicePreguntaProveedorServ].setHelpText("Seleccione un proveedor para llevar registro o agreguelo con el siguiente enlace => " + urlProvee ); // seteo helpText de forms compras item proveedor con link a forms proveedor

  // AGREGAR PROVEEDOR DE SERVICIOS EN COMPRAS?? SISI
}

function insertarPublishedUrlVentas(editForm,unCliente){
  const formVentas = FormApp.openByUrl(PropertiesService.getUserProperties().getProperty(editForm));
  let items = formVentas.getItems();
  const urlClie = PropertiesService.getUserProperties().getProperty(unCliente );
  items[indicePreguntaClientes].setHelpText("Seleccione desde la casilla desplegable o agregue un CLIENTE con el siguiente enlace => " + urlClie); // seteo helpText de forms compras item articulo con link a forms articulo
  //items[14].setHelpText("Seleccione desde la casilla desplegable o agregue un CLIENTE con el siguiente enlace => " + urlClie); // seteo helpText de forms compras item articulo con link a forms articulo
} 

///////////////////////////////////////////////////////////////////////////////////////////////
////// insertar url de forms secundarios ADMINISTRACION,COMERCIALIZACION,SERVICIO CF,SUELDOS,IMPUESTOS en forms primario COSTOS FIJOS///////
/////////////////////////////////////////////////////////////////////////////////////////////// 
function insertarPublishedUrlCostosFijos(editForm,unEmpleado,unProveedor){

  const formCostosfijos = FormApp.openByUrl(PropertiesService.getUserProperties().getProperty(editForm));
  let items = formCostosfijos.getItems();

  const urlSueldos = PropertiesService.getUserProperties().getProperty(unEmpleado);
  items[indicePreguntaEmpleados].setHelpText("Seleccione desde la casilla desplegable o agregue un EMPLEADO con el siguiente enlace => " + urlSueldos); // seteo helpText de forms COSTOS FIJOS item SUELDOS con link a forms empleados
  
  const urlServCF = PropertiesService.getUserProperties().getProperty(unProveedor);
  items[indicePreguntaProveedorCF].setHelpText("Seleccione desde la casilla desplegable o agregue un PROVEEDOR con el siguiente enlace => "+ unProveedor + urlServCF); // seteo helpText de forms COSTOS FIJOS item SERVICIOS con link a forms serviciosCF

}

function formsLayers (){
Logger.log("Insertando urls clientes,empleados,proveedores,articulos,productos terminados");

insertarPublishedUrlCompras("formularioComprasEditUrl","formularioArticulosUrl","formularioProveedorUrl"); // se agrega capa de formularios secundarios ARTICULOS,PROVEEDORES en formulario primario COMPRAS
Logger.log("/////////////////////////////////////////////////////////////////////////////////////");
Logger.log("Se insertaron links a forms secundarios en compras");

insertarPublishedUrlVentas("formularioVentasEditUrl","formularioClientesUrl"); // se agrega capa de formularios secundarios CLIENTES en formulario primario VENTAS
Logger.log("/////////////////////////////////////////////////////////////////////////////////////");
Logger.log("Se insertaron links a forms secundarios en ventas");

insertarPublishedUrlCostosFijos("formularioCostosFijosEditUrl","formularioEmpleadosUrl","formularioProveedorCFUrl"); // agrego la capa de formularios secudarios EMPLEADOS Y PROVEEDORES
Logger.log("/////////////////////////////////////////////////////////////////////////////////////");
Logger.log("Se insertaron links a forms secundarios en Costo fijo");
}

