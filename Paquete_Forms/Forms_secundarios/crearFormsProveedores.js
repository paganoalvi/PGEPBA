/////////////////////////////////////////
// FUNCIÓN PRINCIPAL: Crear el Form Proveedores//
////////////////////////////////////////
function proveedor (){
    Logger.log("Iniciando creación del formulario de proveedor");


    let formularioProveedor = FormApp.create("Proveedor");
    let formularioProveedorID = formularioProveedor.getId();
    PropertiesService.getScriptProperties().setProperty("Formulario_ID", formularioProveedorID);

    formularioProveedor.setDescription(
        "Este formulario permite llevar registro de la informacion de tus proveedores "
    );

     const val = FormApp.createTextValidation()
      .requireNumber()
      .requireNumberGreaterThan(0)
      .build();
    
      const valCE = FormApp.createTextValidation()
      .requireTextIsEmail()
      .build();
      
    let opcionesTipoPersona = ["Persona fisica", "Persona juridica"];
    let opcionesTipoProveedor = ["Materia prima","Herramiena o maquinaria", "Servicio","Otro"];

    const TITULO_TELEFONO = "Teléfono";
    const TITULO_CORREO_ELECTRONICO = "Correo Electrónico";

    const preguntasProveedor = [
      { tipo: "seleccion", titulo: "Tipo de proveedor", opciones: opcionesTipoProveedor, requerido: true},
      { tipo: "list", titulo: "Tipo de personeria", opciones: opcionesTipoPersona, requerido: true},
      { tipo: "text", titulo: "Nombre completo o Razón social", requerido: true},
      { tipo: "text", titulo: "CUIT/CUIL/DNI",textoAyuda: "sin puntos, comas o guiones"},
      { tipo: "text", titulo: "Domicilio completo del proveedor"},
      { tipo: "text", titulo: "Teléfono", textoAyuda: "Ingrese número telefónico valido"},
      { tipo: "text", titulo: "Correo Electrónico", textoAyuda: "Correo válido, por ejemplo: usuario@dominio.com"},
      { tipo: "text", titulo: "Descripcion adicional"}
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
              pregunta.setValidation(val);
            }
            //Validación para correo electrónico
            if (p.titulo === TITULO_CORREO_ELECTRONICO) {
              pregunta.setValidation(valCE);
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
    Logger.log("PROVEEDORES: " + formProveedorUrl)
    PropertiesService.getUserProperties().setProperty("formularioProveedorUrl", formProveedorUrl);
    PropertiesService.getUserProperties().setProperty("formularioProveedorEditUrl", formularioProveedor.getEditUrl());
    //Logger.log(formularioProveedor.getEditUrl());
 
    //Logger.log("Formulario de compras creado con ID: " + formularioProveedor.getId());

    return formularioProveedor;

}
