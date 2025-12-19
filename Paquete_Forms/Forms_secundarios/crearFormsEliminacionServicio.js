////////////////////////////////////////////////////
// FUNCIÓN PRINCIPAL: Crear el Form ELIMINACION SERVICIO /////
///////////////////////////////////////////////////
function eliminacionServicio(){
  try {
    Logger.log("Iniciando creación del formulario de eliminación de servicio");

    let formularioEliminacionServicio = FormApp.create("Eliminación de Servicio");
    let formularioEliminacionServID = formularioEliminacionServicio.getId();
    PropertiesService.getScriptProperties().setProperty("Formulario_ID", formularioEliminacionServID);
    formularioEliminacionServicio.setDescription("El envío de este formulario permite llevar a cabo la eliminación de un servicio.");

    let opcionesServicios = [""];

    const preguntasClientes =  [
      {tipo: "list",titulo: "Servicio a eliminar",opciones: opcionesServicios,requerido: true,textoAyuda: "Seleccioná el servicio que querés eliminar y luego enviá el formulario."},
    ]
    preguntasClientes.forEach(p =>{
      let pregunta;
    switch (p.tipo) {
      case "list": // Menú desplegable
        pregunta = formularioEliminacionServicio.addListItem();
        if (p.opciones) {
          pregunta.setChoices(p.opciones.map(op => pregunta.createChoice(op)));
        }
        break;
      case "text":
        pregunta = formularioEliminacionServicio.addTextItem();
        //Validacion para dni
        if (p.titulo == "CUIT/CUIL/DNI") {
          pregunta.setValidation(val);
        }
        break;
      case "date":
        pregunta = formularioEliminacionServicio.addDateItem();
        break;
      case "seleccion": // Selección única
        pregunta = formularioEliminacionServicio.addMultipleChoiceItem();
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

    const formEliminacionServicioUrl = formularioEliminacionServicio.getPublishedUrl();
    Logger.log("ELIMINACION SERVICIO: " + formEliminacionServicioUrl)
    PropertiesService.getUserProperties().setProperty("formularioEliminacionServicioUrl", formEliminacionServicioUrl);
    PropertiesService.getUserProperties().setProperty("formularioEliminacionServicioEditUrl", formularioEliminacionServicio.getEditUrl());
    //Logger.log(formularioClientes.getEditUrl());



    return formularioEliminacionServicio;


  } catch (error) {
    console.error("Error al crear el formulario de clientes:", error.message);
    return null;
  }
}