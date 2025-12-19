/////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
// FUNCIÓN PRINCIPAL: Crear el form Entrega de Servicio //
////////////////////////////////////////////////////////
function crearFormEntregaServicio() {
    Logger.log("Iniciando creación formulario Entrega de Servicio");

    // CONFIGURACION INICIAL DEL FORMULARIO
    let formulario = FormApp.create("Prestación de servicio");
    formulario.setDescription("Registrá cada trabajo realizado, con fecha, duración y recursos utilizados.");

    // Guardar el ID 
    let formularioID = formulario.getId();
    PropertiesService.getScriptProperties().setProperty("Formulario_ID", formularioID);

    const opcionesEmpleados = [""];
    // PREGUNTAS PRINCIPALES
    const preguntasEntregaDeServicios = [
      { tipo: "list", titulo: "Servicio realizado", requerido: true, opciones: [""],textoAyuda: "Seleccioná cuál servicio prestaste."},
      { tipo: "date", titulo: "Fecha de ejecución del servicio",requerido:true,textoAyuda:"Seleccioná la fecha en la que se realizó la prestación del servicio."},
      { tipo: "text", titulo: "Duración efectiva del servicio", requerido: true, validacion: true,textoAyuda:"Indicá la duración de tiempo real del servicio (en hs)."},
      { tipo: "checkbox", titulo: "Empleados que realizaron el servicio",opciones: opcionesEmpleados,textoAyuda: "Seleccioná los empleados que participaron en la ejecución de este servicio." , requerido:true},
    ];

    preguntasEntregaDeServicios.forEach(p => {
      let pregunta;
      switch (p.tipo) {
        case "list":
          pregunta = formulario.addListItem();
          if (p.opciones) pregunta.setChoices(p.opciones.map(op => pregunta.createChoice(op)));
          break;

        case "seleccion":
          pregunta = formulario.addMultipleChoiceItem();
          if (p.opciones) pregunta.setChoices(p.opciones.map(op => pregunta.createChoice(op)));
          break;

        case "text":
          pregunta = formulario.addTextItem();
          if (p.validacion) validacionNumeroEnteroMayorACero(pregunta);
          break;

        case "date":
          pregunta = formulario.addDateItem();
          break;

        case "checkbox":
          pregunta = formulario.addCheckboxItem();
          if (p.opciones) pregunta.setChoices(p.opciones.map(op => pregunta.createChoice(op)));
          break;

        default:
          Logger.log("Tipo de pregunta no reconocido: " + p.tipo);
      }

      // Aplicar propiedades comunes
      pregunta.setTitle(p.titulo);
      if (p.textoAyuda) pregunta.setHelpText(p.textoAyuda);
      if (p.requerido) pregunta.setRequired(p.requerido);
    });

    ////////////////////////////////////////////
    // SECCIÓN: ¿Uso de insumos o herramientas?
    ////////////////////////////////////////////
    let preguntaHerramientaOInsumo = formulario.addMultipleChoiceItem()
      .setTitle("¿Uso de insumos o herramientas?")
      .setRequired(true);

    // Crear sección siguiente
    const { nuevaSeccion: seccionInsumos } = crearSeccionInsumos(formulario);

    // Crear sección final (solo mensaje)
    const { nuevaSeccion: seccionFinal } = crearSeccionFinal(formulario);

    // Definir opciones con ramificacion
    preguntaHerramientaOInsumo.setChoices([
      preguntaHerramientaOInsumo.createChoice("Sí", seccionInsumos),
      preguntaHerramientaOInsumo.createChoice("No", seccionFinal)
    ]);

    Logger.log(formulario.getPublishedUrl());
    PropertiesService.getUserProperties().setProperty("formularioEntregaUrl", formulario.getPublishedUrl());
    PropertiesService.getUserProperties().setProperty("formularioEntregaEditUrl", formulario.getEditUrl());
    return formulario;
}


/////////////////////////////////////////////////////////
// SECCIÓN INSUMOS Y HERRAMIENTAS
////////////////////////////////////////////////////////
function crearSeccionInsumos(formulario) {
  let nuevaSeccion = formulario.addPageBreakItem()
    .setTitle("Insumos o Herramientas")
    .setHelpText("Registrá únicamente los insumos consumibles utilizados y sus cantidades.");

  const preguntasInsumos = [
    { tipo: "checkbox", titulo: "¿Se dañó, perdió o dejó de funcionar alguna herramienta o máquina?",textoAyuda:"Si marcás una opción, se descontará automáticamente una unidad del stock. Si no corresponde, dejá todas las casillas sin seleccionar."}];

  preguntasInsumos.forEach(p => {
    let pregunta;
    switch (p.tipo) {
      case "checkbox":
        pregunta = formulario.addCheckboxItem();
      break;
      default:
        return;
    }
    pregunta.setTitle(p.titulo);
    if (p.textoAyuda) pregunta.setHelpText(p.textoAyuda);
    if (p.requerido) pregunta.setRequired(true);
  });

  // Retornar la siguiente sección creada
  return { nuevaSeccion };
}

/////////////////////////////////////////////////////////
// SECCIÓN FINAL
////////////////////////////////////////////////////////
function crearSeccionFinal(formulario) {
  let nuevaSeccion = formulario.addPageBreakItem()
    .setTitle("Finalizar formulario")
    .setHelpText("Hacé clic en 'Enviar' para finalizar.");

  return { nuevaSeccion };
}