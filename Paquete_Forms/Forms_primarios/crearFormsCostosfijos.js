 /////////////////////////////////////////
// FUNCIÓN PRINCIPAL: Crear el Form COSTOS FIJOS   //
////////////////////////////////////////
function costosFijos (){
  try {
    Logger.log("Iniciando creación del formulario costos fijos");

    let formularioCostosFijos = FormApp.create("Costos fijos");
    let formularioCostosFijosID = formularioCostosFijos.getId();
    PropertiesService.getScriptProperties().setProperty("Formulario_ID", formularioCostosFijosID);

    formularioCostosFijos.setDescription(
      "Completa este formulario para registrar todos los egresos de dinero que se mantienen constantes independientemente del nivel de tus ventas"
    );
    formularioCostosFijos.addDateItem()
      .setTitle("Elegí la fecha en la que se va a registrar el gasto")
      .setRequired(true);

    let preguntaInicial = formularioCostosFijos.addMultipleChoiceItem()
      .setTitle("Elija el tipo de costo fijo")
      .setRequired(true);
   
    const seccion1 = seccionPagoSueldos(formularioCostosFijos).nuevaSeccion;
    const seccion2 = seccionPagoServicios(formularioCostosFijos).nuevaSeccion;
    const seccion3 = seccionPagoImpuestos(formularioCostosFijos).nuevaSeccion;

    preguntaInicial.setChoices([
      preguntaInicial.createChoice("Pago de sueldo", seccion1),
      preguntaInicial.createChoice("Pago de servicio", seccion2),
      preguntaInicial.createChoice("Pago de impuesto", seccion3),
    ]);

    seccion1.setGoToPage(FormApp.PageNavigationType.SUBMIT);
    seccion2.setGoToPage(FormApp.PageNavigationType.SUBMIT);
    seccion3.setGoToPage(FormApp.PageNavigationType.SUBMIT);

    const formCostosFijosUrl = formularioCostosFijos.getPublishedUrl();
    Logger.log("||||||||||||||||||")
    Logger.log("COSTOS FIJOS: ")
    Logger.log(formCostosFijosUrl)
    Logger.log("||||||||||||||||||")
    PropertiesService.getUserProperties().setProperty("formularioCostosFijosUrl", formCostosFijosUrl);
    PropertiesService.getUserProperties().setProperty("formularioCostosFijosEditUrl", formularioCostosFijos.getEditUrl());

    return formularioCostosFijos;

  } catch (error) {
    console.error("Error al crear el formulario costos fijos:", error.message);
    return null;
  }
}
const valNum = FormApp.createTextValidation()
  .requireNumber()
  .requireNumberGreaterThan(0)
  .build();

/////////////////////////////////////////////////////////
// SECCIÓN PAGO SUELDOS  ////////////////////////
/////////////////////////////////////////////////////////
function seccionPagoSueldos(formulario) {
  try {

    let nuevaSeccion = formulario.addPageBreakItem()
      .setTitle("Pago de sueldo")
      .setHelpText("En esta seccion llevara registro de los sueldos pagados a sus empleados.");
   
    let opcionesEmpleado = [" ",]; // opciones empledo, link form secundario

    const  TITULO_MONTO_SUELDO = "Monto del sueldo"
    const preguntasPagoSueldos = [
     
      { tipo: "list", titulo: "Empleado", opciones: opcionesEmpleado, requerido: true},
      { tipo: "text", titulo: "Monto del sueldo", requerido: true },
      { tipo: "text", titulo: "Descripcion adicional",}
    ];
    preguntasPagoSueldos.forEach(p => {
      let pregunta;
      switch (p.tipo) {
        case "list": // Menú desplegable
          pregunta = formulario.addListItem();
          if (p.opciones) {
            pregunta.setChoices(p.opciones.map(op => pregunta.createChoice(op)));
          }
          break;
        case "text":
          pregunta = formulario.addTextItem();
          // Validación para MONTO DEL SUELDO (número decimal positivo)
          if (p.titulo === TITULO_MONTO_SUELDO) {
            pregunta.setValidation(valNum);
          }
          break;
        case "date":
          pregunta = formulario.addDateItem();
          break;
        case "seleccion": // Selección única
          pregunta = formulario.addMultipleChoiceItem();
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


    return { nuevaSeccion };
  } catch (error) {
    console.error("Error en la sección pago de sueldos:", error.message);
    return { nuevaSeccion: null };
  }
}
/////////////////////////////////////////////////////////
// SECCIÓN PAGO DE SERVICIOS   ////////////////////////
/////////////////////////////////////////////////////////
function seccionPagoServicios(formulario) {
  try {

    let nuevaSeccion = formulario.addPageBreakItem()
      .setTitle("Pago de servicios")
      .setHelpText("En esta seccion llevaras registro de los servicios fijos que paga tu emprendimiento");
 
    let opcionesTipoServicio = ["Luz","Internet","Gas","Agua","Administración","Comercialización","Distribución","Alquiler","Mantenimiento","Manejo de redes sociales","Publicidad fija","Préstamos bancarios","Hipotecas","Tarjetas de crédito","Créditos","Financiaciones","Otros"];
    let opcionesProveedores = [" "]; // opciones proveedores, link forms proveedores

    const TITULO_MONTO_SERVICIO = "Monto abonado"
    const preguntasPagoServicios = [
      { tipo: "list", titulo: "Servicio", opciones: opcionesTipoServicio, requerido: true},      
      { tipo: "text", titulo: "Monto abonado", requerido: true},
      { tipo: "list", titulo: "Proveedor", opciones: opcionesProveedores},
      { tipo: "text", titulo: "Descripcion adicional"}
    ];
    preguntasPagoServicios.forEach(p => {
      let pregunta;
      switch (p.tipo) {
        case "list": // Menú desplegable
          pregunta = formulario.addListItem();
          if (p.opciones) {
            pregunta.setChoices(p.opciones.map(op => pregunta.createChoice(op)));
          }
          break;
        case "text":
          pregunta = formulario.addTextItem();
          // Validación numerica para MONTO DEL SUELDO (número decimal positivo)
          if (p.titulo === TITULO_MONTO_SERVICIO) {
            pregunta.setValidation(valNum);
          }
          break;
        case "date":
          pregunta = formulario.addDateItem();
          break;
        case "seleccion": // Selección única
          pregunta = formulario.addMultipleChoiceItem();
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

    return { nuevaSeccion };
  } catch (error) {
    console.error("Error en la sección Pago de servicios:", error.message);
    return { nuevaSeccion: null };
  }
}
/////////////////////////////////////////////////////////
// SECCIÓN PAGO DE IMPUESTOS   ////////////////////////
/////////////////////////////////////////////////////////

function seccionPagoImpuestos(formulario) {
  try {

    let nuevaSeccion = formulario.addPageBreakItem()
      .setTitle("Pago de impuestos")
   
    let opcionesTipoImpuesto = ["Monotributo","Ingresos Brutos","Seguridad Social / Aportes Jubilatorios","Obra Social"," Rentas provinciales","Tasas municipales","Otros"];

    const TITULO_MONTO_IMPUESTO = "Monto impuesto abonado"
    const preguntasPagoImpuestos = [
      { tipo: "list", titulo: "Impuesto", opciones: opcionesTipoImpuesto, requerido: true, textoAyuda: "Pagos obligatorios que se hacen  para contribuir al funcionamiento de los servicios públicos y al desarrollo de la comunidad" },      
      { tipo: "text", titulo: "Monto impuesto abonado", requerido: true, textoAyuda: "Ingrese el monto abonado por el impuesto" },
      { tipo: "text", titulo: "Descripcion adicional"}
    ];
    preguntasPagoImpuestos.forEach(p => {
      let pregunta;
      switch (p.tipo) {
        case "list": // Menú desplegable
          pregunta = formulario.addListItem();
          if (p.opciones) {
            pregunta.setChoices(p.opciones.map(op => pregunta.createChoice(op)));
          }
          break;
        case "text":
          pregunta = formulario.addTextItem();
          // Validación para MONTO DEL SUELDO (número decimal positivo)
          if (p.titulo === TITULO_MONTO_IMPUESTO) {
            pregunta.setValidation(valNum);
          }
          break;
        case "date":
          pregunta = formulario.addDateItem();
          break;
        case "seleccion": // Selección única
          pregunta = formulario.addMultipleChoiceItem();
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

    return { nuevaSeccion };
  } catch (error) {
    console.error("Error en la sección Pago de impuestos:", error.message);
    return { nuevaSeccion: null };
  }
}
