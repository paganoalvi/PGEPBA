//////////////////////////////////////////
//COPIA DE SEGURIDAD PARA MODIFICAR !!!!!!!!!! 
///////////////////////////////////
function doGet() {

  const props = PropertiesService.getUserProperties();
  const triggers = ScriptApp.getProjectTriggers();
  
  const yaExiste = triggers.some(trigger =>
    trigger.getHandlerFunction() === "creacionCompleta"
  );
  if(props.getProperty("paqueteActivado") !== "true") {
    if(!yaExiste){
      pedirPermisos();
      ScriptApp.newTrigger("creacionCompleta")
        .timeBased()
        .after(1 * 60 * 1000)
        .create();
      
      Logger.log("Trigger creado correctamente");
    }
    if(props.getProperty("paqueteForms")){
      return HtmlService.createHtmlOutputFromFile("PaginaYaCasi");
    }else{
      return HtmlService.createHtmlOutputFromFile("PaginaEspera");
    } 
  
  }else{
     try {
    const nombresPrellenadoVector = Array.from({ length: 16 }, (_, i) =>
      props.getProperty(`prellenadoNombre${i}`)
    );
    const enlacesPrellenadoVector = Array.from({ length: 16 }, (_, i) =>
      props.getProperty(`prellenadoEnlace${i}`)
    );
    if(props.getProperty("verificacionTemporalPrellenado") === "true"){
      enlacesPrimeraVez();
    }
    const fComprasUrl = props.getProperty("formularioComprasUrl");
    const fProduccionUrl = props.getProperty("formularioProduccionUrl");
    const fVentasUrl = props.getProperty("formularioVentasUrl");
    const fCostoFijoUrl = props.getProperty("formularioCostosFijosUrl");
  
    const urlClientes = props.getProperty("Hoja5"); 
    const urlProveedores = props.getProperty("Hoja7");
    const urlProductos = props.getProperty("Hoja10");
    const urlEmpleados = props.getProperty("Hoja3"); 
    const idHojaMensuales = props.getProperty("HojaResultadosHistorico") 

    const idParaGraficoPrueba = props.getProperty("HojaResultadosID");

    // CREAR TEMPLATE PARA USAR PÁGINA Y ASIGNAR LOS URLS
    const htmlTemplate = HtmlService.createTemplateFromFile("Main");
    
    htmlTemplate.fComprasUrl = fComprasUrl;
    htmlTemplate.fProduccionUrl = fProduccionUrl;
    htmlTemplate.fVentasUrl = fVentasUrl;
    htmlTemplate.fCostoFijoUrl = fCostoFijoUrl;
    htmlTemplate.urlClientes = urlClientes;
    htmlTemplate.urlProveedores = urlProveedores;
    htmlTemplate.urlProductos = urlProductos;
    htmlTemplate.urlEmpleados = urlEmpleados;
    htmlTemplate.idParaGraficoPrueba = idParaGraficoPrueba;
    htmlTemplate.nombresPrellenado = nombresPrellenadoVector;
    htmlTemplate.enlacesPrellenado = enlacesPrellenadoVector;
    htmlTemplate.idHojaMensuales = idHojaMensuales;
    
    
    // DEVUELVE LA PÁGINA COMPLETA
    return htmlTemplate.evaluate().setTitle("Productor y Vendedor - Página Personal");
    
  } catch (error) {
    console.error(`Error al generar el HTML en doGet: ${error.message}`);
    return HtmlService.createHtmlOutput("Ocurrió un error al cargar la página. Contacta al administrador.");
  }
  }
}

function creacionCompleta() {
  let props = PropertiesService.getUserProperties();
    crearPaquete();
    for(let i = 0; i<16; i++){
      props.setProperty(`prellenadoNombre${i}`,"Vacio")
      props.setProperty(`prellenadoEnlace${i}`,"https://sites.google.com/view/guiausuariopge/forms")
    }
  }


function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}



function pedirPermisos() {
  const formP = FormApp.create("Formulario de prueba").setTitle("Eliminar después");
  const fileForm = DriveApp.getFileById(formP.getId());
  fileForm.setTrashed(true); 
  DriveApp.getRootFolder();
  const sheetP = SpreadsheetApp.create("Hoja de prueba");
  const file = DriveApp.getFileById(sheetP.getId());
  file.setTrashed(true);
  PropertiesService.getUserProperties().setProperty("permisoConcedido","true");
  return "Permisos solicitados";
}

function limpiezaParaPagina(){
  limpiezaGeneral();
  var carpetas = DriveApp.getFoldersByName("Portal Gestión");
  while (carpetas.hasNext()) {
        var carpeta = carpetas.next();
        carpeta.setTrashed(true); 
  }
}







