////////////////////////////////////////////////////
// FUNCIÓN PRINCIPAL: Crear el Form EMPLEADOS /////
///////////////////////////////////////////////////
function empleado (){
  try {
    Logger.log("Iniciando creación del formulario de empleado");


    let formularioEmpleados = FormApp.create("Empleados");
    let formularioEmpleadosID = formularioEmpleados.getId();
    PropertiesService.getScriptProperties().setProperty("Formulario_ID", formularioEmpleadosID);


    const val = FormApp.createTextValidation()
            .requireWholeNumber()
            .requireNumberGreaterThan(0)
            .build();
           
    const val_correo = FormApp.createTextValidation()
            .requireTextIsEmail()
            .build();
           
    formularioEmpleados.setDescription(
      "Este formulario permite llevar registro de los empleados de tu emprendimiento"
    );

  let opcionesCargo = ["administrativo","contabilidad","ventas","producción","logística","compras","marketing","atención al cliente","sistemas","diseño gráfico","recursos humanos","calidad","legal","finanzas","gerente general","asistente","supervisor","operario","desarrollador","comercial","otro"];
  let opcionesContratacion = ["Relacion de dependencia","Monotributista","Otras"];
  let opcionesTiempoJornada = ["Tiempo completo","Medio tiempo","Periodo de prueba","Eventual","Por temporada","Otro"];

  const preguntasEmpleados =  [
      {tipo: "text",titulo: "Nombre Completo y Apellido",requerido: true},
      {tipo: "text",titulo: "CUIT/CUIL/DNI",requerido: true}, // VALIDACION SOLO NUMEROS
      {tipo: "date",titulo: "Fecha de ingreso",requerido: true},
      {tipo: "text",titulo: "telefono",requerido: true},   
      {tipo: "text",titulo: "Domicilio",requerido: true},      
      {tipo: "text",titulo: "Contacto adicional"},
      {tipo: "list",titulo: "Cargo/rol",opciones : opcionesCargo,requerido: true},
      {tipo: "list",titulo: "Condicion de contratacion",opciones: opcionesContratacion,requerido: true},
      {tipo: "list",titulo: "Tiempo de jornada",opciones: opcionesTiempoJornada}
    ]

    preguntasEmpleados.forEach(p =>{
      let pregunta;
    switch (p.tipo) {
      case "list": // Menú desplegable
        pregunta = formularioEmpleados.addListItem();
        if (p.opciones) {
          pregunta.setChoices(p.opciones.map(op => pregunta.createChoice(op)));
        }
        break;
      case "text":
        pregunta = formularioEmpleados.addTextItem();
        //Validacion para dni
        if (p.titulo == "CUIT/CUIL/DNI") {
          pregunta.setValidation(val);
        }
        if (p.titulo == "Correo electrónico") {
          pregunta.setValidation(valCE);
        }
        break;
      case "date":
        pregunta = formularioEmpleados.addDateItem();
        break;
      case "seleccion": // Selección única
        pregunta = formularioEmpleados.addMultipleChoiceItem();
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

    const formEmpleadosUrl = formularioEmpleados.getPublishedUrl();
    Logger.log("Enlace a formulario: " + formEmpleadosUrl)
    PropertiesService.getUserProperties().setProperty("formularioEmpleadosUrl", formEmpleadosUrl);
    PropertiesService.getUserProperties().setProperty("formularioProveedoresEditUrl", formularioEmpleados.getEditUrl());
    //Logger.log(formularioEmpleados.getEditUrl());


    //Logger.log("Formulario de empleado creado con ID: " + formularioEmpleados.getId());


    return formularioEmpleados;


  } catch (error) {
    console.error("Error al crear el formulario de empleados:", error.message);
    return null;
  }
}




