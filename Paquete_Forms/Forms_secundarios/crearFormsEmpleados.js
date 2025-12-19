////////////////////////////////////////////////////
// FUNCIÓN PRINCIPAL: Crear el Form EMPLEADOS /////
///////////////////////////////////////////////////
function empleado (){
  try {
    Logger.log("Iniciando creación del formulario de empleado");


    let formularioEmpleados = FormApp.create("Empleados");
    let formularioEmpleadosID = formularioEmpleados.getId();
    PropertiesService.getScriptProperties().setProperty("Formulario_ID", formularioEmpleadosID);

    formularioEmpleados.setDescription("Este formulario permite llevar registro de las personas que llevan adelante el servicio (empleados, contratados, titulares, etc.) y las horas trabajadas.");

    const val = FormApp.createTextValidation()
            .requireWholeNumber()
            .requireNumberGreaterThan(0)
            .build();
           
    const val_correo = FormApp.createTextValidation()
            .requireTextIsEmail()
            .build();

  let opcionesCargo = ["Administrativo","Contabilidad","Ventas","Producción","Logística","Compras","Marketing","Atención al cliente","Sistemas","Diseño gráfico","Recursos humanos","Calidad","Legal","Finanzas","Gerente general","Asistente","Supervisor","Operario","Desarrollador","Comercial","Otro"];
  let opcionesContratacion = ["Relación de dependencia","Monotributista","Otro"];
  let opcionesTiempoJornada = ["Tiempo completo","Medio tiempo","Periodo de prueba","Eventual","Por temporada","Otro"];

  const preguntasEmpleados =  [
      {tipo: "text",titulo: "Nombre y apellido",requerido: true},
      {tipo: "text",titulo: "CUIT/CUIL/DNI",requerido: true, textoAyuda:"sin puntos, comas o guiones."}, // VALIDACION SOLO NUMEROS
      {tipo: "date",titulo: "Fecha de ingreso",requerido: true,textoAyuda:"Fecha en la que comenzó a trabajar en el emprendimiento."},
      {tipo: "text",titulo: "Teléfono",requerido: true},   
      {tipo: "text",titulo: "Domicilio",requerido: true},      
      {tipo: "text",titulo: "Contacto de emergencia"},
      {tipo: "list",titulo: "Cargo/rol",opciones : opcionesCargo,requerido: true},
      {tipo: "list",titulo: "Condición de contratación",opciones: opcionesContratacion,requerido: true},
      {tipo: "list",titulo: "Tipo de jornada",opciones: opcionesTiempoJornada}
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
    Logger.log("EMPLEADO " + formEmpleadosUrl)
    PropertiesService.getUserProperties().setProperty("formularioEmpleadosUrl", formEmpleadosUrl);
    PropertiesService.getUserProperties().setProperty("formularioEmpleadosEditUrl", formularioEmpleados.getEditUrl());
    //Logger.log(formularioEmpleados.getEditUrl());


    //Logger.log("Formulario de empleado creado con ID: " + formularioEmpleados.getId());


    return formularioEmpleados;


  } catch (error) {
    console.error("Error al crear el formulario de empleados:", error.message);
    return null;
  }
}
