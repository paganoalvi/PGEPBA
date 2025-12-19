/////////////////////////////////////////
// FUNCIÓN PRINCIPAL: Crear el Form Proveedores costos fijos// 
////////////////////////////////////////
function proveedorCF (){
    Logger.log("Iniciando creación del formulario de proveedor de costos fijos");

    let formularioProveedorCF = FormApp.create("Proveedor Costos Fijos");
    let formularioProveedorCFID = formularioProveedorCF.getId();
    PropertiesService.getScriptProperties().setProperty("Formulario_ID", formularioProveedorCFID);
    
    const valCE = FormApp.createTextValidation()
      .requireTextIsEmail()
      .build();
    const val = FormApp.createTextValidation()
      .requireNumber()
      .requireNumberGreaterThan(0)
      .build();


    // Titulos específicos a validar
    const TITULO_DNI= "CUIT/CUIL/DNI";
    const TITULO_CORREO_ELECTRONICO = "Correo electrónico"
    const TITULO_TELEFONO = "Teléfono"

    formularioProveedorCF.setDescription(
        "Este formulario permite llevar registro de los proveedores de costos fijos de tu emprendimiento."
    );

    let opcionesTipoPersona = ["Persona física", "Persona jurídica"];
    

    const preguntasProveedorCF = [
      { tipo: "list", titulo: "Personería", opciones: opcionesTipoPersona, requerido: true},
      { tipo: "text", titulo: "Nombre o razón social", requerido: true},
      { tipo: "text", titulo: TITULO_DNI,textoAyuda: "Ingresá el número correspondiente, sin puntos, comas ni guiones."},
      { tipo: "text", titulo: TITULO_TELEFONO, requerido: true,textoAyuda: "Ingresá un número válido de contacto."},
      { tipo: "text", titulo: TITULO_CORREO_ELECTRONICO, textoAyuda: "Correo válido, por ejemplo: usuario@dominio.com"},
      { tipo: "text", titulo: "Descripción adicional",textoAyuda:"Cualquier información extra que quieras registrar sobre el proveedor."},
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
            pregunta.setValidation(val);
          }
          // Validación para numero de telefono (entero positivo)
            if (p.titulo === TITULO_TELEFONO) {
              pregunta.setValidation(val);
            }
            //Validación para correo electrónico
            if (p.titulo === TITULO_CORREO_ELECTRONICO) {
              pregunta.setValidation(valCE);
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
    Logger.log("PROVEEDORES CF: " + formProveedorCFUrl)
    PropertiesService.getUserProperties().setProperty("formularioProveedorCFUrl", formProveedorCFUrl);
    PropertiesService.getUserProperties().setProperty("formularioProveedorCFEditUrl", formularioProveedorCF.getEditUrl());
    //Logger.log(formularioProveedor.getEditUrl());
  
    //Logger.log("Formulario de compras creado con ID: " + formularioProveedor.getId());

    return formularioProveedorCF;

} 
