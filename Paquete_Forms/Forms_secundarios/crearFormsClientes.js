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
      "Este formulario permite llevar registro de los clientes de tu emprendimiento"
    );


    formularioClientes.addMultipleChoiceItem()
      .setTitle("Personeria")
      .setChoiceValues(["Persona Fisica","Persona Juridica"])
      .setRequired(true)
      .setHelpText("Indique si su cliente es una persona fisica o una persona juridica");


    formularioClientes.addTextItem()
      .setTitle("Nombre completo o Razón social")
      .setRequired(true)
      .setHelpText("");


    formularioClientes.addTextItem()
      .setTitle("CUIT/CUIL/DNI")
      .setRequired(true)
      .setHelpText("")


    formularioClientes.addTextItem()
      .setTitle("Teléfono")
      .setRequired(true)
      .setHelpText("")
      .setValidation(val);


    formularioClientes.addTextItem()
      .setTitle("Domicilio")
      .setRequired(true)
      .setHelpText("")


    formularioClientes.addTextItem()
      .setTitle("Correo electrónico")
      .setRequired(true)
      .setHelpText("")
      .setValidation(valCE);


    formularioClientes.addTextItem()
      .setTitle("Nombre y apellido de contacto")
      .setRequired(true)
      .setHelpText("");


    formularioClientes.addListItem()
      .setTitle("Condicion frente al IVA")
      .setRequired(true)
      .setChoiceValues(["Responsable Inscripto","Monotributista","Exento","No categorizado","No alcanzado por IVA"])
      .setHelpText("");
      
    formularioClientes.addTextItem()
      .setTitle("Descripción")
      .setHelpText("Ingrese un descripcion para este cliente si lo desea");





    const formClientesUrl = formularioClientes.getPublishedUrl();
    Logger.log("Enlace a formulario: " + formClientesUrl)
    PropertiesService.getUserProperties().setProperty("formularioClientesUrl", formClientesUrl);
    PropertiesService.getUserProperties().setProperty("formularioClientesEditUrl", formularioClientes.getEditUrl());
    Logger.log(formularioClientes.getEditUrl());


    Logger.log("Formulario de clientes creado con ID: " + formularioClientes.getId());


    return formularioClientes;


  } catch (error) {
    console.error("Error al crear el formulario de clientes:", error.message);
    return null;
  }
}








