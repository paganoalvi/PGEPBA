/////////////////////////////////////////
// FUNCIÓN PRINCIPAL: Crear el Form Proveedores//
////////////////////////////////////////
function proveedor (){
    Logger.log("Iniciando creación del formulario de proveedor");


    let formularioProveedor = FormApp.create("Proveedor");
    let formularioProveedorID = formularioProveedor.getId();
    PropertiesService.getScriptProperties().setProperty("Formulario_ID", formularioProveedorID);




    formularioProveedor.setDescription(
        "Este formulario permite llevar registro de los proveedores de tu emprendimiento"
    );


    let opcionesTipoPersona = ["Persona fisica", "Persona juridica"];
    let opcionesCondiconIVA = ["Responsable Inscripto","Monotributista","Exento","No categorizado","No alcanzado por IVA"];
    let opcionesTipoProveedor = ["Proveedor de materia prima o insumo", "Proveedor de herramiena o maquinaria", "Proveedor de servicio"];


    const TITULO_TELEFONO = "Teléfono";
    const TITULO_CORREO_ELECTRONICO = "Correo Electrónico";


    const preguntasProveedor = [
      { tipo: "seleccion", titulo: "Tipo de proveedor", opciones: opcionesTipoProveedor, requerido: true},
      { tipo: "seleccion", titulo: "Tipo de personeria", opciones: opcionesTipoPersona, requerido: true,textoAyuda: "Seleccione si el proveedor es una persona fisica o una persona juridica como una S.A o S.R.L"},
      { tipo: "text", titulo: "Nombre completo o Razón social", requerido: true},
      { tipo: "text", titulo: "Domicilio completo del proveedor", textoAyuda: "Ingrese el domicilio fisico del proveedor"},
      { tipo: "text", titulo: "Teléfono", textoAyuda: "Ingrese número telefónico"},
      { tipo: "text", titulo: "Correo Electrónico", textoAyuda: "Ingrese un correo válido, por ejemplo: usuario@dominio.com"},
      { tipo: "text", titulo: "Contacto Adicional / Otros contactos", textoAyuda: "Ingrese número telefónico adicional"}
    ];


    preguntasProveedor.forEach(p => {
      let pregunta;
      switch (p.tipo) {
        case "list": // Menú desplegable
          pregunta = formularioProveedor.addListItem();
          if (p.opciones) {
            pregunta.setChoices(p.opciones.map(op => pregunta.createChoice(op)));
          }
          break;
        case "text":
          pregunta = formularioProveedor.addTextItem();
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
          pregunta = formularioProveedor.addDateItem();
          break;
        case "seleccion": // Selección única
          pregunta = formularioProveedor.addMultipleChoiceItem();
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


    const formProveedorUrl = formularioProveedor.getPublishedUrl();
    Logger.log("Enlace a formulario: " + formProveedorUrl)
    PropertiesService.getUserProperties().setProperty("formularioProveedorUrl", formProveedorUrl);
    PropertiesService.getUserProperties().setProperty("formularioProveedorEditUrl", formularioProveedor.getEditUrl());
    Logger.log(formularioProveedor.getEditUrl());
 
    Logger.log("Formulario de compras creado con ID: " + formularioProveedor.getId());


    return formularioProveedor;


}







