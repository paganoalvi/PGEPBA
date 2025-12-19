////////////////////////////////////////////////////
// FUNCIÓN PRINCIPAL: Crear el Form ELIMINACION SERVICIO /////
///////////////////////////////////////////////////
function eliminacionEmpleado(){
  try {
    Logger.log("Iniciando creación del formulario de eliminacion de servicio");

    let formularioEliminacionServicio = FormApp.create("Eliminación de Empleado");
    let formularioEliminacionEmpleadoID = formularioEliminacionServicio.getId();
    PropertiesService.getScriptProperties().setProperty("Formulario_ID", formularioEliminacionEmpleadoID);
    formularioEliminacionServicio.setDescription(
      "El envío de este formulario permite remover uno de tus empleados del sistema."
    );

    let opcionesCondFrenteIva = [""];

    const preguntasClientes =  [
      {tipo: "list",titulo: "Empleado a eliminar",opciones: opcionesCondFrenteIva,requerido: true,textoAyuda: "Seleccioná el empleado que querés eliminar y luego envía el formulario."},
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

    const formEliminacionEmpleadoUrl = formularioEliminacionServicio.getPublishedUrl();
    Logger.log("ELIMINACION EMPLEADO: " + formEliminacionEmpleadoUrl)
    PropertiesService.getUserProperties().setProperty("formularioEliminacionEmpleadoUrl", formEliminacionEmpleadoUrl);
    PropertiesService.getUserProperties().setProperty("formularioEliminacionEmpleadoEditUrl", formularioEliminacionServicio.getEditUrl());
    //Logger.log(formularioClientes.getEditUrl());


    //Logger.log("Formulario de clientes creado con ID: " + formularioClientes.getId());


    return formularioEliminacionServicio;


  } catch (error) {
    console.error("Error al crear el formulario de clientes:", error.message);
    return null;
  }
}