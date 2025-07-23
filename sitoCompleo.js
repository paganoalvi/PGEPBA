
//////////////////////////////////////////
//COPIA DE SEGURIDAD PARA MODIFICAR !!!!!!!!!! 
///////////////////////////////////
function doGet() {
  const props = PropertiesService.getUserProperties();
  props.setProperty("verificacionTemporalPrellenado","true")
  if (props.getProperty("paqueteYaCreado") === "true") {
    Logger.log("Ya se creó el paquete. Se omite.");
    
  }else{
    Logger.log("Creando paquete de forms");
    props.setProperty("paqueteYaCreado", "true");
    crearPaquete();
    for(let i = 0; i<16; i++){
      props.setProperty(`prellenadoNombre${i}`,"Vacio")
      props.setProperty(`prellenadoEnlace${i}`,"https://sites.google.com/view/guiausuariopge/forms")
    }
    props.setProperty("verificacionTemporalPrellenado","false")
    Logger.log("Formularios creados correctamente");

    // Guardamos la propiedad ANTES de crear triggers o capas
    
    if (props.getProperty("formsLayersYaInsertados") !== "true") {
      Logger.log("Insertando capas de formularios secundarios");
      formsLayers();
      props.setProperty("formsLayersYaInsertados", "true");
    } else {
      Logger.log("Capas de formularios ya insertadas");
    }
  }


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
  
    const urlClientes = props.getProperty("Hoja6"); 
    const urlProveedores = props.getProperty("Hoja8"); 
    const idParaGraficoPrueba = props.getProperty("HojaResultadosID");
    Logger.log(idParaGraficoPrueba); 

    // CREAR TEMPLATE PARA USAR PÁGINA Y ASIGNAR LOS URLS
    const htmlTemplate = HtmlService.createTemplateFromFile("Main");
    htmlTemplate.fComprasUrl = fComprasUrl;
    htmlTemplate.fProduccionUrl = fProduccionUrl;
    htmlTemplate.fVentasUrl = fVentasUrl;
    htmlTemplate.fCostoFijoUrl = fCostoFijoUrl;
    htmlTemplate.urlClientes = urlClientes;
    htmlTemplate.urlProveedores = urlProveedores;
    htmlTemplate.idParaGraficoPrueba = idParaGraficoPrueba;
    htmlTemplate.nombresPrellenado = nombresPrellenadoVector;
    htmlTemplate.enlacesPrellenado = enlacesPrellenadoVector;
    // DEVUELVE LA PÁGINA COMPLETA
    Logger.log(props.getProperty("verificacionTemporalPrellenado"))
    return htmlTemplate.evaluate().setTitle("Productor y Vendedor - Página Personal");
    
  } catch (error) {
    console.error(`Error al generar el HTML en doGet: ${error.message}`);
    return HtmlService.createHtmlOutput("Ocurrió un error al cargar la página. Contacta al administrador.");
  }
}


function enlacesPrimeraVez (){
  const props = PropertiesService.getUserProperties()
  for(let i = 0; i<16; i++){
      props.setProperty(`prellenadoNombre${i}`,"Vacio")
      props.setProperty(`prellenadoEnlace${i}`,"https://sites.google.com/view/guiausuariopge/forms")
    }
  props.setProperty("verificacionTemporalPrellenado","false")
}

//Función para enlazar archivos (css/javascript)
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}



  







