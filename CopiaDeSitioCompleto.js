 //////////////////////////////////////////
//COPIA DE SEGURIDAD PARA MODIFICAR !!!!!!!!!! 
///////////////////////////////////
function doGet() {
    //verificamos si existe el folder
    let foPoMiID = PropertiesService.getUserProperties().getProperty("FolderPortalMicroID");
    if(!foPoMiID){
      //creamos el folder
      let folderP = crearPaqueteGestion2();
      PropertiesService.getUserProperties().setProperty("FolderPortalMicroID",folderP);
    }
    
    try {
      const fComprasUrl = PropertiesService.getUserProperties().getProperty("formularioComprasURL");
      const fStockInsumosUrl = PropertiesService.getUserProperties().getProperty("formularioInsumosURL");
      const fProduccionUrl = PropertiesService.getUserProperties().getProperty("formularioProduccionURL");
      const fEventosUrl = PropertiesService.getUserProperties().getProperty("formEventosURL");
      const fPedidosUrl = PropertiesService.getUserProperties().getProperty("formPedidosUrl");
      const fCostoFijoUrl = PropertiesService.getUserProperties().getProperty("formCostoFijoUrl");
  
      //CREAR TEMPLEATE PARA USAR PAGINA Y ASIGNAR LOS URLS
      const htmlTemplate = HtmlService.createTemplateFromFile("Main");
      htmlTemplate.fComprasUrl = fComprasUrl;
      htmlTemplate.fStockInsumosUrl = fStockInsumosUrl;
      htmlTemplate.fProduccionUrl = fProduccionUrl;
      htmlTemplate.fEventosUrl = fEventosUrl;
      htmlTemplate.fPedidosUrl = fPedidosUrl; 
      htmlTemplate.fCostoFijoUrl = fCostoFijoUrl; 
      //DEVUELVE LA PAGINA COMPLETA
      return htmlTemplate.evaluate().setTitle("Productor y Vendedor - Página Personal");
  
    } catch (error) {
      console.error(`Error al generar el HTML en doGet: ${error.message}`);
      return HtmlService.createHtmlOutput("Ocurrió un error al cargar la página. Contacta al administrador.");
    }
  }
  
  
  
  // crear paquete de gestion con validaciones
  function crearPaqueteGestion2() {
    // Crear las carpetas principales
    let folderPortal = DriveApp.createFolder("Portal Gestión Microemprendimiento");
    let folderResultados = folderPortal.createFolder("Resultados");
    let  folderGestion = folderPortal.createFolder("Gestion");
    //array para usar eficientemente los forms
    const formularios = [
      crearFormCompras(),     //INDICE 0
      crearFormProduccion(),  //INDICE 1
      crearFormEvento(),      //INDICE 2
      crearFormPedidos(),     //INDICE 3
      crearFormCostosFijos(), //INDICE 4
      crearFormStockMPeInsu() //INDICE 5
    ];
    //for each de toda la vida para hacer algo con cada form como asignarle su sheet y guardarlo en la carpeta Gestion
    formularios.forEach(function(form, indice){
        let file = DriveApp.getFileById(form.getId());
        let name = file.getName();
        asignarFormYSheet(form,name,folderResultados,indice);
        Logger.log(`se logro con ${name}`);
        file.moveTo(folderGestion);
  
    });
      
      return folderPortal;
  }
  
  ///////////////////////////////////////////////////////////////////////////
  //FUNCION ASIGNAR FORM A SHEET a sus respectivas carpetas con validaciones
  //////////////////////////////////////////////////////////////////////////
  
  function asignarFormYSheet(form, nombreArchivos, folderResultados,numero) {
    try {
      // Crear la hoja de cálculo para las respuestaS
      const respuestasForm = SpreadsheetApp.create(nombreArchivos);
      const respuestasID = respuestasForm.getId();
      form.setDestination(FormApp.DestinationType.SPREADSHEET, respuestasForm.getId());
      PropertiesService.getUserProperties().setProperty(`HojaResultados${numero}`,respuestasID )
      try {
        let moverSheet = DriveApp.getFileById(respuestasForm.getId());
        moverSheet.moveTo(folderResultados);
      } catch (error) {
        console.error(`Error al mover la hoja de respuestas '${nombreArchivos}' a la carpeta Resultados: ${error.message}`);
        throw new Error(`No se pudo mover la hoja de respuestas '${nombreArchivos}' a la carpeta Resultados.`);
      }
    } catch (error) {
      console.error(`Error en la función asignarFormYSheet para '${nombreArchivos}': ${error.message}`);
      throw new Error(`Fallo al asignar formulario y hoja para '${nombreArchivos}'.`);
    }
  }
  
  
  
  
  
  
  
  
  
  function limpiar(){
    PropertiesService.getUserProperties().deleteAllProperties();
  }
  