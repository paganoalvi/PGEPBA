
//////////////////////////////////////////
// FUNCION PRINCIPAL QUE CREA EL PAQUETE DE GESTION(NO MOVER A OTRO ARCHIVO) /////////////////////
///////////////////////////////////
// crear paquete de gestion, version mejorada que hace manejo continuo de errores por formulario sin interrumpir el proceso de los
// demas, se hace registros de datos de formularios y se registran en consola para facilitar depuracion y seguimiento

function crearPaqueteGestion() {
    let folderPortal, folderResultados, folderGestion;
    try {
      // el siguiente bloque de codigo evita la creación de carpetas si ya existen, reduciendo las llamadas innecesarias a la API de google drive
      let folderPortal = DriveApp.getFoldersByName("Portal Gestión Microemprendimiento").hasNext()
        ? DriveApp.getFoldersByName("Portal Gestión Microemprendimiento").next()
        : DriveApp.createFolder("Portal Gestión Microemprendimiento"); // creacion de la carpeta
  
      let folderResultados = folderPortal.getFoldersByName("Resultados").hasNext()
        ? folderPortal.getFoldersByName("Resultados").next()
        : folderPortal.createFolder("Resultados");
  
      let folderGestion = folderPortal.getFoldersByName("Gestion").hasNext()
        ? folderPortal.getFoldersByName("Gestion").next()
        : folderPortal.createFolder("Gestion");
      
    } catch (error) {
      console.error(`Error al crear carpetas: ${error.message}`);
      throw new Error("Fallo al crear las carpetas principales.");
    } 
    
    // Lista de formularios a crear
    let formsData = [];
    const forms = [
      { name: "Compras", form: crearFormCompras },
      { name: "Producción", form: crearFormProduccion },
      { name: "Materias primas e insumos", form: crearFormStockMPeInsu },
      { name: "Costos fijos", form: crearFormCostosFijos },
      { name: "Eventos", form: crearFormEvento },
      { name: "Pedidos", form: crearFormPedidos },
    ];
    let shitId = 0;
    for (let formObj of forms) {
      try {
        // Crear formulario y asignar carpetas
        const form = formObj.form();
        const name = formObj.name;
  
        asignarFormYSheet(form, name, folderResultados);
  
        // Agregar datos del formulario creado
        formsData.push({
          name: name,
          url: form.getPublishedUrl(),
          createdAt: new Date().toLocaleString(),
          owner: Session.getActiveUser().getEmail(),
        });
  
      } catch (error) {
        // Reportar error, pero continuar con el siguiente formulario
        console.error(`Error al procesar el formulario '${formObj.name}': ${error.message}`);
      }
    }
  
    // Log de los formularios creados
    console.log("Datos de formularios creados:", formsData);
  
    // Devolver la carpeta principal
    return folderPortal;
  }
  
  ////////////////////////////////////////////////////////////////////////////////
  // SITIO COMPLETO ///////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////
  
  
  function doAGUANTARGet() {
    //verificamos si existe un espacio de almacenamiento como un folder 
    let foPoMiID = PropertiesService.getUserProperties().getProperty("FolderPortalMicroID"); 
    // si no existe,creamos uno
    if(!foPoMiID){ 
      //creamos el folder
      let folderP = crearPaqueteGestion();
      PropertiesService.getUserProperties().setProperty("FolderPortalMicroID",folderP);
    }
    // oportunidad de mejora para doGet() :
        //Agregar validaciones adicionales para garantizar que crearPaqueteGestion() devuelva un valor válido.
    
    try {
      // Recuperar URLs con valores predeterminados
      const getPropertyOrDefault = (key, defaultValue = "No configurado") =>
        PropertiesService.getUserProperties().getProperty(key) || defaultValue;
  
      const fComprasUrl = getPropertyOrDefault("formularioComprasURL");
      const fStockInsumosUrl = getPropertyOrDefault("formularioInsumosURL");
      const fProduccionUrl = getPropertyOrDefault("formularioProduccionURL");
      const fEventosUrl = getPropertyOrDefault("formEventosURL");
      const fPedidosUrl = getPropertyOrDefault("formPedidosUrl");
      const fCostoFijoUrl = getPropertyOrDefault("formCostoFijoUrl");
  
      Logger.log(`URL de compras: ${fComprasUrl}`);
      Logger.log(`URL de insumos: ${fStockInsumosUrl}`);
      Logger.log(`URL de producción: ${fProduccionUrl}`);
      Logger.log(`URL de eventos: ${fEventosUrl}`);
      Logger.log(`URL de pedidos: ${fPedidosUrl}`);
      Logger.log(`URL de costos fijos: ${fCostoFijoUrl}`);
  
      // Crear y evaluar la plantilla HTML
      const htmlTemplate = HtmlService.createTemplateFromFile("Main");
      Object.assign(htmlTemplate, {
        fComprasUrl,
        fStockInsumosUrl,
        fProduccionUrl,
        fEventosUrl,
        fPedidosUrl,
        fCostoFijoUrl,
      });
  
      return htmlTemplate.evaluate().setTitle("Productor y Vendedor - Página Personal");
  
    } catch (error) {
      console.error(`Error en doGet: ${error.message}, Stack: ${error.stack}`);
      return HtmlService.createHtmlOutput("<p>Ocurrió un error al cargar la página. Contacta al administrador.</p>");
    }
  }
  
  
  
  
  
  // asginar form y sheets a sus respectivas carpetas con validaciones
  
  /*function asignarFormYSheet(form, nombreArchivos, folderResultados) {
    try {
      // Crear la hoja de cálculo para las respuestas
      let respuestasForm = SpreadsheetApp.create(nombreArchivos);
      form.setDestination(FormApp.DestinationType.SPREADSHEET, respuestasForm.getId());
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
  }*/
  
  
  
  
  
  // Crear las carpetas principales (version vieja)
      /*folderPortal = DriveApp.createFolder("Portal Gestión Microemprendimiento");
      folderResultados = folderPortal.createFolder("Resultados");
      folderGestion = folderPortal.createFolder("Gestion");*/
  