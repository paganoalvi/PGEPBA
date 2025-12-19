function crearFormCobro() {
  try {
    Logger.log("Iniciando creación formulario cobro");

    // Crear formulario
    let formularioCobro = FormApp.create("Cobro de servicio");
    let formularioCobroID = formularioCobro.getId();
    
    PropertiesService.getUserProperties().setProperty("Formulario_ID", formularioCobroID);

    formularioCobro.setDescription("  Este formulario te permite registrar los ingresos de dinero por cobro de servicio realizado.");
    
    const preguntasSeccionCobro = [
      { tipo: "list", titulo: "Servicio a facturar", requerido: true,textoAyuda:"Seleccioná el nombre del servicio que vas a cobrar." },
      { tipo: "text", titulo: "Importe del servicio", requerido: true, validacion: true,textoAyuda:"Ingresá el valor recibido por el servicio"},
      { tipo: "text", titulo: "Número de servicios cobrados",requerido: true,validacion: true,textoAyuda: "Indicá la cantidad de veces que este servicio se cobrará en esta operación."},
      { tipo: "date", titulo: "Fecha de cobro", requerido: true },
    ];

    preguntasSeccionCobro.forEach(p => {
      let pregunta;

      switch (p.tipo) {
        case "list":
          pregunta = formularioCobro.addListItem();
          if (p.opciones) pregunta.setChoices(p.opciones.map(op => pregunta.createChoice(op)));
          break;

        case "text":
          pregunta = formularioCobro.addTextItem();
          if (p.validacion) validacionNumeroEnteroMayorACero(pregunta);
          break;

        case "date":
          pregunta = formularioCobro.addDateItem();
          break;

        case "checkbox":
          pregunta = formularioCobro.addCheckboxItem();
          if (p.opciones) pregunta.setChoices(p.opciones.map(op => pregunta.createChoice(op)));
          break;

        default:
          Logger.log("Tipo de pregunta no reconocido: " + p.tipo);
      }

      // Propiedades comunes
      if (pregunta) {
        pregunta.setTitle(p.titulo);
        if (p.textoAyuda) pregunta.setHelpText(p.textoAyuda);
        if (p.requerido) pregunta.setRequired(true);
      }
    });

    Logger.log(formularioCobro.getPublishedUrl());
    PropertiesService.getUserProperties().setProperty("formularioCobroUrl", formularioCobro.getPublishedUrl());
    PropertiesService.getUserProperties().setProperty("formularioCobroEditUrl", formularioCobro.getEditUrl());
    return formularioCobro;

  } catch (error) {
    console.error("Error al crear el formulario de cobro: ", error.message);
    return null;
  }
}
