/////////////////////////////////////////////////////////
// FUNCIÓN PRINCIPAL: Crear el form //
////////////////////////////////////////////////////////
function crearFormConstitucionDelServicio() {
  try {
    Logger.log("Iniciando creación del formulario CONSTITUCION DE UN SERVICIO");

    // CONFIGURACIÓN DEL FORMULARIO
    let formulario = FormApp.create("Mi Servicio");
    formulario.setDescription("Definí qué servicio ofrecés y cómo lo brindás. Asignale un nombre y cargá todo lo que te resulte necesario para identificarlo.");

    // Guardar el ID 
    let formularioID = formulario.getId();
    PropertiesService.getScriptProperties().setProperty("Formulario_UsoInsumos_ID", formularioID);

    const opcionesArticulos = [""];
    const opcionesHerramientas = [""];

    ////////////////////////////////////////////////////////////
    // PREGUNTAS PRINCIPALES
    ////////////////////////////////////////////////////////////
    const preguntasFormulario = [
      { tipo: "text", titulo: "Nombre del servicio", requerido: true},
      { tipo: "text", titulo: "Cantidad de horas",requerido:true,validacion: true,textoAyuda:"Ingresá la cantidad de horas estimadas para realizar este servicio."},
      { tipo: "text", titulo: "Cantidad de empleados estimados", requerido: true, validacion: true,textoAyuda:"Indicá la cantidad de empleados que intervendrán en la prestación de este servicio."},
      { tipo: "checkbox", titulo: "Insumos a utilizar en este servicio", opciones: opcionesArticulos},
      { tipo: "checkbox", titulo: "Herramientas a utilizar en este servicio", opciones: opcionesHerramientas},
      { tipo: "text", titulo: "Descripción adicional",}
    ];

    ////////////////////////////////////////////////////////////
    // CREACIÓN DE LAS PREGUNTAS
    ////////////////////////////////////////////////////////////
    preguntasFormulario.forEach(p => {
      let pregunta;

      switch (p.tipo) {
        case "list":
          pregunta = formulario.addListItem();
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

      // APLICAR PROPIEDADES COMUNES
      if (pregunta) {
        pregunta.setTitle(p.titulo);
        if (p.textoAyuda) pregunta.setHelpText(p.textoAyuda);
        if (p.requerido) pregunta.setRequired(p.requerido);
      }
    });

    Logger.log(formulario.getPublishedUrl());
    PropertiesService.getUserProperties().setProperty("formularioConstitucionUrl", formulario.getPublishedUrl());
    PropertiesService.getUserProperties().setProperty("formularioConstitucionEditUrl", formulario.getEditUrl());

    return formulario;

  } catch (error) {
    console.error("Error al crear el formulario Uso de Constitucion del servicio", error);
    return null;
  }
  
}