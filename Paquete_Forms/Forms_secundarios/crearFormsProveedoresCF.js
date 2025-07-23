/////////////////////////////////////////
// FUNCIÓN PRINCIPAL: Crear el Form Proveedores costos fijos// 
////////////////////////////////////////
function proveedorCF (){
    Logger.log("Iniciando creación del formulario de proveedor de costos fijos");

    let formularioProveedorCF = FormApp.create("Proveedor");
    let formularioProveedorCFID = formularioProveedorCF.getId();
    PropertiesService.getScriptProperties().setProperty("Formulario_ID", formularioProveedorCFID);

    // Titulos específicos a validar
    const TITULO_DNI= "CUIT/CUIL/DNI";
    const TITULO_CORREO_ELECTRONICO = "Correo electronico"
    const TITULO_TELEFONO = "Telefono"

    formularioProveedorCF.setDescription(
        "Este formulario permite llevar registro de los proveedores de costos fijos de tu emprendimiento"
    );

    let opcionesTipoPersona = ["Persona fisica", "Persona juridica"];;
    

    const preguntasProveedorCF = [
      { tipo: "list", titulo: "Tipo de personeria", opciones: opcionesTipoPersona, requerido: true,textoAyuda: "Seleccione si el proveedor es una persona fisica o una persona juridica como una S.A o S.R.L"},
      { tipo: "text", titulo: "Nombre y apellido o Razon social", requerido: true},
      { tipo: "text", titulo: "CUIT/CUIL/DNI", requerido: true, textoAyuda: "Ingrese número de CUIT/CUIL o DNI del proveedor"},
      { tipo: "text", titulo: "Telefono", requerido: true, textoAyuda: "Ingrese numero telefonico de la persona contacto con el proveedor"},
      { tipo: "text", titulo: "Correo electronico", requerido: true, textoAyuda: "Ingrese el email de la persona de contacto con el proveedor"},
      { tipo: "text", titulo: "Nombre completo de contacto", requerido: true, textoAyuda: "Ingrese ingrese nombre y apellido de la persona contacto con el proveedor"},
    ];

    preguntasProveedorCF.forEach(p => {
      let pregunta;
      switch (p.tipo) {
        case "list": // Menú desplegable
          pregunta = formularioProveedorCF.addListItem();
          if (p.opciones) {
            pregunta.setChoices(p.opciones.map(op => pregunta.createChoice(op)));
          }
          break;
        case "text":
          pregunta = formularioProveedorCF.addTextItem();

            // Validación para 
          if (p.titulo === TITULO_DNI) {
            let val = FormApp.createTextValidation()
              .requireNumber()
              .requireNumberGreaterThan(0)
              .build();
            pregunta.setValidation(val);
          }
          // Validación para numero de telefono (entero positivo)
            if (p.titulo === TITULO_TELEFONO) {
              let val = FormApp.createTextValidation()
                .requireWholeNumber()
                .requireNumberGreaterThan(0)
                .build();
              pregunta.setValidation(val);
            }
            //Validación para correo electrónico
            if (p.titulo === TITULO_CORREO_ELECTRONICO) {
              let val = FormApp.createTextValidation()
                .requireTextIsEmail()
                .build();
              pregunta.setValidation(val);
            }
          break;
        case "date":
          pregunta = formularioProveedorCF.addDateItem();
          break;
        case "seleccion": // Selección única
          pregunta = formularioProveedorCF.addMultipleChoiceItem();
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

    const formProveedorCFUrl = formularioProveedorCF.getPublishedUrl();
    Logger.log("Enlace a formulario: " + formProveedorCFUrl)
    PropertiesService.getUserProperties().setProperty("formularioProveedorCFUrl", formProveedorCFUrl);
    PropertiesService.getUserProperties().setProperty("formularioProveedorCFEditUrl", formularioProveedorCF.getEditUrl());
    //Logger.log(formularioProveedor.getEditUrl());
  
    //Logger.log("Formulario de compras creado con ID: " + formularioProveedor.getId());

    return formularioProveedorCF;

} 
