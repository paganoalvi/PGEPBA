function crearFormProduccion() {
    try {
      // Intentar crear el formulario
      let formProduccion = FormApp.create("Producción");
      console.log("Formulario creado exitosamente:", formProduccion.getEditUrl());
  
      // Descripción del formulario
      formProduccion.setDescription("Descripción formulario producción");
  
      // Pregunta: CONCEPTO
      formProduccion.addMultipleChoiceItem()
        .setTitle("CONCEPTO")
        .setRequired(true)
        .setChoiceValues(["Concepto de producción 1", "Concepto de producción 2"]);
  
      // Pregunta: PRODUCTO
      formProduccion.addListItem()
        .setTitle("PRODUCTO")
        .setRequired(true);
  
      // Sección: Volumen del Proceso
      formProduccion.addSectionHeaderItem()
        .setTitle("VOLUMEN DEL PROCESO")
        .setHelpText("DETALLE DE CANTIDADES FINALES DE CADA PROCESO");
  
      formProduccion.addTextItem()
        .setTitle("CANTIDAD PRODUCTOS")
        .setRequired(true);
  
      formProduccion.addTextItem()
        .setTitle("LOTE");
  
      formProduccion.addTextItem()
        .setTitle("RENDIMIENTO")
        .setRequired(true);
  
      // Sección: Materias Primas Utilizadas
      formProduccion.addSectionHeaderItem()
        .setTitle("MATERIAS PRIMAS UTILIZADAS")
        .setHelpText("Por favor ingrese las materias primas utilizadas en el proceso de producción");
  
      for (let i = 1; i <= 10; i++) {
        formProduccion.addTextItem()
          .setTitle(`Materia prima ${i}`);
      }
  
      // Sección: Envasado
      formProduccion.addSectionHeaderItem()
        .setTitle("ENVASADO")
        .setHelpText("DETALLES DE ENVASES UTILIZADOS");
  
      formProduccion.addMultipleChoiceItem()
        .setTitle("Envase")
        .setChoiceValues(["500 CC", "750 CC", "20 Lts (BARRIL)", "50 Lts (BARRIL)"]);
  
      //GUARDAR URL EN LAS PROPIEDADES PARA USARLAS MAS ADELANTE
      const formProduccionUrl = formProduccion.getPublishedUrl();
      PropertiesService.getUserProperties().setProperty("formularioProduccionURL",formProduccionUrl);
      PropertiesService.getUserProperties().setProperty("formProduccionEditUrl",formProduccion.getEditUrl());
      Logger.log("mostrar url original" + formProduccionUrl);
      return formProduccion;
    } catch (error) {
      // Manejar errores y registrar el mensaje
      console.error("Error al crear el formulario de producción:", error.message);
      return null;
    }
  }
  
  function pruebaCrearFormProduccion() {
    let formulario = crearFormProduccion();
    if (!formulario) {
      console.error("No se pudo crear el formulario de producción.");
    } else {
      console.log("Formulario de producción creado exitosamente:", formulario.getEditUrl());
    }
  }