////////////////////////////////////////////////////
// FUNCIÓN PRINCIPAL: Crear el Form CLIENTES /////
///////////////////////////////////////////////////
function cliente (){
  try {
    Logger.log("Iniciando creación del formulario de clientes");

    let formularioClientes = FormApp.create("Clientes");
    let formularioClientesID = formularioClientes.getId();
    PropertiesService.getScriptProperties().setProperty("Formulario_ID", formularioClientesID);

    const valCE = FormApp.createTextValidation()
      .requireTextIsEmail()
      .build();
    const val = FormApp.createTextValidation()
      .requireNumber()
      .requireNumberGreaterThan(0)
      .build();

    formularioClientes.setDescription(
      "Este formulario permite llevar registro de los clientes de tu emprendimiento."
    );

    let opcionesCondFrenteIva = ["Responsable Inscripto","Monotributista","Exento","No categorizado","No alcanzado por IVA"];
    let opcionesPersoneria = ["Persona Física","Persona Jurídica"];

    const preguntasClientes =  [
      {tipo: "list",titulo: "Personería",opciones: opcionesPersoneria,requerido: true,textoAyuda:"Seleccioná si el cliente es una persona individual o una empresa, asociación, etc."},
      {tipo: "text",titulo: "Nombre completo o Razón social",requerido: true,textoAyuda:"Ingresá el nombre completo del cliente si es una persona física, o la razón social si es una persona jurídica."},
      {tipo: "list",titulo: "Condición frente al IVA",opciones: opcionesCondFrenteIva},
      {tipo: "text",titulo: "CUIT/CUIL/DNI",textoAyuda: "(CUIT si es persona jurídica, CUIL/DNI si es una persona física) Sin puntos, comas o guiones."},
      {tipo: "text",titulo: "Teléfono"},
      {tipo: "text",titulo: "Domicilio"},      
      {tipo: "text",titulo: "Correo electrónico"},
      {tipo: "text",titulo: "Datos adicionales"},
    ]
    preguntasClientes.forEach(p =>{
      let pregunta;
    switch (p.tipo) {
      case "list": // Menú desplegable
        pregunta = formularioClientes.addListItem();
        if (p.opciones) {
          pregunta.setChoices(p.opciones.map(op => pregunta.createChoice(op)));
        }
        break;
      case "text":
        pregunta = formularioClientes.addTextItem();
        //Validacion para dni
        if (p.titulo == "CUIT/CUIL/DNI") {
          pregunta.setValidation(val);
        }
        break;
      case "date":
        pregunta = formularioClientes.addDateItem();
        break;
      case "seleccion": // Selección única
        pregunta = formularioClientes.addMultipleChoiceItem();
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

    const formClientesUrl = formularioClientes.getPublishedUrl();
    Logger.log("CLIENTES: " + formClientesUrl)
    PropertiesService.getUserProperties().setProperty("formularioClientesUrl", formClientesUrl);
    PropertiesService.getUserProperties().setProperty("formularioClientesEditUrl", formularioClientes.getEditUrl());
    //Logger.log(formularioClientes.getEditUrl());


    //Logger.log("Formulario de clientes creado con ID: " + formularioClientes.getId());


    return formularioClientes;


  } catch (error) {
    console.error("Error al crear el formulario de clientes:", error.message);
    return null;
  }
}
