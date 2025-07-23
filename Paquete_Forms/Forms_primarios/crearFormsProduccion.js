////////////////////////////////////////////////////
// FUNCIÓN PRINCIPAL: Crear el Form PRODUCCION /////
///////////////////////////////////////////////////
function produccion (){
    try {
      Logger.log("Iniciando creación del formulario de produccion");
 
      let formularioProduccion = FormApp.create("Produccion");
      let formularioProduccionID = formularioProduccion.getId();
      PropertiesService.getScriptProperties().setProperty("Formulario_ID", formularioProduccionID);

      formularioProduccion.setDescription(
        "Este formulario permite llevar registro de los productos que fabrica tu emprendimiento"
      );
      const TITULO_CANTIDAD = "Cantidad"

      const preguntasProduccion = [
        {tipo: "text",titulo: "Producto",requerido: true, textoAyuda: "Seleccione de cual producto quiere llevar cuenta"},
        {tipo: "text",titulo: "Cantidad",requerido: true, textoAyuda: "Indique la cantidad de productos fabricada"},
        {tipo: "text",titulo: "Lote", textoAyuda: "Indique numero de lote si es que posee"},
      ]

      preguntasProduccion.forEach(p =>{
        let pregunta;
      switch (p.tipo) {
        case "list": // Menú desplegable
          pregunta = formularioProduccion.addListItem();
          if (p.opciones) {
            pregunta.setChoices(p.opciones.map(op => pregunta.createChoice(op)));
          }
          break;
        case "text":
          pregunta = formularioProduccion.addTextItem();
          //Validacion para la cantidad
          if (p.titulo === TITULO_CANTIDAD) {
            let val = FormApp.createTextValidation()
              .requireWholeNumber()
              .requireNumberGreaterThan(0)
              .build();
            pregunta.setValidation(val);
          }
          break;
        case "date":
          pregunta = formularioProduccion.addDateItem();
          break;
        case "seleccion": // Selección única
          pregunta = formularioProduccion.addMultipleChoiceItem();
          if (p.opciones) {
            pregunta.setChoices(p.opciones.map(op => pregunta.createChoice(op)));
          }
          break;
        default:
          throw new Error(`Tipo de pregunta desconocido: ${p.tipo}`);
      }
      // Aplicar propiedades comunes
      pregunta.setTitle(p.titulo);
      if (p.textoAyuda) pregunta.setHelpText(p.textoAyuda);
      if (p.requerido) pregunta.setRequired(p.requerido);
    });
    
      const formProduccionUrl = formularioProduccion.getPublishedUrl();
      Logger.log("Enlace a formulario: " + formProduccionUrl)
      PropertiesService.getUserProperties().setProperty("formularioProduccionUrl", formProduccionUrl);
      PropertiesService.getUserProperties().setProperty("formularioProduccionEditUrl", formularioProduccion.getEditUrl());
      Logger.log(formularioProduccion.getEditUrl());
      Logger.log("Formulario de produccion creado con ID: " + formularioProduccion.getId());
 
      return formularioProduccion;
 
    } catch (error) {
      console.error("Error al crear el formulario de produccion:", error.message);
      return null;
    }
  }

