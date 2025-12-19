function crearFormCoCo() {
  try {
    Logger.log("Iniciando creación formulario contratación");

    // Crear formulario
    let formularioContratacion = FormApp.create("Contratación de servicio");
    let formularioContratacionID = formularioContratacion.getId();
    
    PropertiesService.getUserProperties().setProperty("Formulario_ID", formularioContratacionID);

    formularioContratacion.setDescription("Registrá el tipo, la fecha, la cantidad de veces solicitado y el cliente del servicio. También te permite sumarlo a un calendario.");

    const opcionesEmpleados = [""]; // Cambiar por datos reales
    const opcionesServicios = [""];
    const opcionesCliente = [""];
    
    
    const preguntasSeccionContratos = [
      { tipo: "list", titulo: "Contrato de servicio", requerido: true,opciones: opcionesServicios },
      { tipo: "list", titulo: "Cliente",opciones: opcionesCliente},
      { tipo: "date", titulo: "Fecha de inicio del servicio", requerido: true },
      { tipo: "text", titulo: "Cantidad de veces que se ejecutará este servicio",validacion: true,textoAyuda:"Si no ingresás un número, quedará con cantidad indefinida."},
      { tipo: "text", titulo: "Descripción adicional"},
      { tipo: "text", titulo: "Valor de contratación", requerido: true, validacion: true },
      { tipo: "text", titulo: "Valor de seña", validacion: true },
      { tipo: "checkbox", titulo: "Empleados pre-asignados al servicio", opciones: opcionesEmpleados },
    ];

    preguntasSeccionContratos.forEach(p => {
      let pregunta;

      switch (p.tipo) {
        case "list":
          pregunta = formularioContratacion.addListItem();
          if (p.opciones) pregunta.setChoices(p.opciones.map(op => pregunta.createChoice(op)));
          break;

        case "seleccion":
          pregunta = formularioContratacion.addMultipleChoiceItem();
          if (p.opciones) pregunta.setChoices(p.opciones.map(op => pregunta.createChoice(op)));
          break;

        case "text":
          pregunta = formularioContratacion.addTextItem();
          if (p.validacion) validacionNumeroEnteroMayorACero(pregunta);
          break;

        case "date":
          pregunta = formularioContratacion.addDateItem();
          break;

        case "checkbox":
          pregunta = formularioContratacion.addCheckboxItem();
          if (p.opciones) pregunta.setChoices(p.opciones.map(op => pregunta.createChoice(op)));
          break;
        case "header":
          pregunta = formularioContratacion.addSectionHeaderItem();
        break;  
        default:
          Logger.log("Tipo de pregunta no reconocido: " + p.tipo);
      }

      // Aplicar propiedades comunes
      if (pregunta) {
        pregunta.setTitle(p.titulo);
        if (p.textoAyuda) pregunta.setHelpText(p.textoAyuda);
        if (p.requerido) pregunta.setRequired(true);
      }
    });



    Logger.log(formularioContratacion.getPublishedUrl());
    PropertiesService.getUserProperties().setProperty("formularioCoCoUrl", formularioContratacion.getPublishedUrl());
    PropertiesService.getUserProperties().setProperty("formularioCoCoEditUrl", formularioContratacion.getEditUrl());
    return formularioContratacion;

  } catch (error) {
    console.error("Error al crear el formulario de contratación: ", error.message);
    return null;
  }
}
