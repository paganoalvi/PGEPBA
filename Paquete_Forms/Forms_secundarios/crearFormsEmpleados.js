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


    formularioEmpleados.addTextItem()
      .setTitle("Nombre completo y apellido")
      .setRequired(true)
      .setHelpText("");


    formularioEmpleados.addTextItem()
      .setTitle("DNI")
      .setRequired(true)
      .setHelpText("")
      .setValidation(val);
     
    formularioEmpleados.addTextItem()
      .setTitle("CUIT")
      .setRequired(true)
      .setHelpText("Ingrese su numero de CUIL")


    formularioEmpleados.addDateItem()
      .setTitle("Fecha de ingreso")
      .setRequired(true)
      .setHelpText("Ingrese la fecha de ingreso del empleado");
   
    formularioEmpleados.addListItem()
      .setTitle("Sexo")
      .setRequired(true)
      .setChoiceValues(["Masculino","Femenino","No binario","Otro"])
      .setHelpText("Por favor seleccione su sexo");
   
    formularioEmpleados.addTextItem()
      .setTitle("Nacionalidad")
      .setRequired(true)
      .setHelpText("Ingrese su nacionalidad");


    formularioEmpleados.addTextItem()
      .setTitle("Teléfono")
      .setRequired(true)
      .setHelpText("Ingrese teléfono")
      .setValidation(val);
   
    formularioEmpleados.addTextItem()
      .setTitle("Coorreo electrónico")
      .setRequired(true)
      .setHelpText("Ingrese un correo válido, por ejemplo: usuario@dominio.com")
      .setValidation(val_correo);


    formularioEmpleados.addTextItem()
      .setTitle("Contacto adicinal / Otro contacto")
      .setHelpText("Ingrese otro contacto de emergencia")
      .setValidation(val);


    formularioEmpleados.addTextItem()
      .setTitle("Domicilio")
      .setRequired(true)
      .setHelpText("Ingrese domicilio declarado por el empleado");


    formularioEmpleados.addTextItem()
      .setTitle("Cargo / Rol")
      .setRequired(true)
      .setHelpText("Ingrese el cargo que ocupa el empleado dentro de la organizacion");


    formularioEmpleados.addListItem()
      .setTitle("Condición de contratación")
      .setRequired(true)
      .setChoiceValues(["Relacion de dependencia","Monotributista","Otras"])
      .setHelpText("");


    formularioEmpleados.addListItem()
      .setTitle("Tiempo de jornada")
      .setRequired(true)
      .setChoiceValues(["Tiempo completo","Medio tiempo","Periodo de prueba","Eventual","Por temporada"])
      .setHelpText("");


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




