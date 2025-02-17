function crearFormEvento() {
    try {
      // Intentar crear el formulario
      let formEvento = FormApp.create("Eventos");
      console.log("Formulario creado exitosamente:", formEvento.getEditUrl());
  
      formEvento.setDescription("Descripción formulario eventos");
  
      // Pregunta: Fecha del evento
      formEvento.addDateTimeItem()
        .setTitle("FECHA");
  
      // Pregunta: Nombre del evento
      formEvento.addTextItem()
        .setTitle("NOMBRE EVENTO")
        .setRequired(true);
  
      // Pregunta: Dirección del evento
      formEvento.addTextItem()
        .setTitle("DIRECCION EVENTO")
        .setRequired(true);
  
      // Pregunta: Detalles del evento
      formEvento.addTextItem()
        .setTitle("DETALLE EVENTO (Justificar importancia)");
  
      //GUARDAR URL EN LAS PROPIEDADES PARA USARLAS MAS ADELANTE
      const formEventosUrl = formEvento.getPublishedUrl();
      PropertiesService.getUserProperties().setProperty("formEventosURL",formEventosUrl);
      PropertiesService.getUserProperties().setProperty("formEventosEditUrl",formEvento.getEditUrl);
      Logger.log("mostrar original"+ formEventosUrl)
      // Retornar el formulario creado
      return formEvento;
  
    } catch (error) {
      // Manejo de errores
      console.error("Error al crear el formulario de eventos:", error.message);
      return null; // Retornar null si ocurre un error
    }
  }
  
  function pruebaCrearFormEvento() {
    let formulario = crearFormEvento();
    if (!formulario) {
      console.error("No se pudo crear el formulario de eventos.");
    } else {
      console.log("Formulario de eventos creado exitosamente:", formulario.getEditUrl());
    }
  }
  
  