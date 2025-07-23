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
      "Este formulario permite llevar registro de tus costos fijos"
    );


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


    const formVentasUrl = formularioCostosFijos.getPublishedUrl();
    Logger.log("Enlace a formulario: " + formVentasUrl)
    PropertiesService.getUserProperties().setProperty("formularioCostosFijosUrl", formVentasUrl);
    PropertiesService.getUserProperties().setProperty("formularioCostosFijosEditUrl", formularioCostosFijos.getEditUrl());
    Logger.log(formularioCostosFijos.getEditUrl());


    Logger.log("Formulario de costos fijos creado con ID: " + formularioCostosFijos.getId());


    return formularioCostosFijos;


  } catch (error) {
    console.error("Error al crear el formulario costos fijos:", error.message);
    return null;
  }
}


let opcionesMetodoDePago = [ "Mercado Pago","Cuenta DNI","Billetera Santa Fe","Ualá","MODO","BIP Homebanking","App Galicia","Brubank","Prex","Transferencia bancaria","Tarjeta de débito","Tarjeta de crédito","Pago en efectivo","Otro" ];


/////////////////////////////////////////////////////////
// SECCIÓN PAGO SUELDOS  ////////////////////////
/////////////////////////////////////////////////////////


function seccionPagoSueldos(formulario) {
  try {


    let nuevaSeccion = formulario.addPageBreakItem()
      .setTitle("Pago de sueldo")
      .setHelpText("Ingrese los detalles de sus empleados y sueldos.");
 
   
    let opcionesEmpleado = [" ",]; // opciones empledo, link form secundario


    const  TITULO_MONTO_SUELDO = "Monto del sueldo"
    const preguntasPagoSueldos = [
     
      { tipo: "list", titulo: "Empleado", opciones: opcionesEmpleado, requerido: true}, // cambiar por formClienteUrl
      { tipo: "text", titulo: "Monto del sueldo", requerido: true, textoAyuda: "Ingrese el sueldo abonado" },
      { tipo: "list", titulo: "Método de pago",opciones: opcionesMetodoDePago, requerido: true, textoAyuda: "Ingrese el método de pago utilizado"},
      { tipo: "text", titulo: "Indique la cuenta asociada al metodo de pago", textoAyuda: "Ingrese cuenta asociada al metodo de pago" },
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
            let val = FormApp.createTextValidation()
              .requireNumber()
              .requireNumberGreaterThan(0)
              .build();
            pregunta.setValidation(val);
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
      .setHelpText("Ingrese los detalles de los servicios pagados.");
 
    let opcionesTipoServicio = ["Luz","Internet","Gas","Agua","Administración","Comercialización","Distribución","Alquiler","Mantenimiento","Seguros","Contador","Asesoría legal","Manejo de redes sociales","Publicidad fija"]; // opciones productos terminados o "Paquetes de productos vendidos"
    let opcionesProveedores = [" "]; // opciones proveedores, link forms proveedores


    const TITULO_MONTO_SERVICIO = "Monto abonado"
    const preguntasPagoServicios = [
      { tipo: "list", titulo: "Servicio", opciones: opcionesTipoServicio, requerido: true, textoAyuda: "Seleccione el tipo de servicio" },      
      { tipo: "text", titulo: "Monto abonado", requerido: true, textoAyuda: "Ingrese el monto abonado por el servicio" },
      { tipo: "list", titulo: "Método de pago",opciones: opcionesMetodoDePago, requerido: true, textoAyuda: "Ingrese el método de pago utilizado"},
      { tipo: "text", titulo: "Indique la cuenta asociada al metodo de pago", textoAyuda: "Ingrese cuenta asociada al metodo de pago" },
      { tipo: "list", titulo: "Proveedor", opciones: opcionesProveedores, requerido: true, textoAyuda: "Seleccione un proveedor del servicio  o agreguelo con el siguiente link => " },


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
          // Validación para MONTO DEL SUELDO (número decimal positivo)
          if (p.titulo === TITULO_MONTO_SERVICIO) {
            let val = FormApp.createTextValidation()
              .requireNumber()
              .requireNumberGreaterThan(0)
              .build();
            pregunta.setValidation(val);
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
   


    let opcionesTipoImpuesto = ["Monotributo","Ingresos Brutos","IVA","Ganancias","Seguridad Social / Aportes Jubilatorios","Obra Social","ARBA / Rentas provinciales","Tasas municipales","Préstamos bancarios","Hipotecas","Tarjetas de crédito","Créditos","Financiaciones","Otros"];


    const TITULO_MONTO_IMPUESTO = "Monto impuesto abonado"
    const preguntasPagoImpuestos = [
      { tipo: "list", titulo: "Impuesto", opciones: opcionesTipoImpuesto, requerido: true, textoAyuda: "Seleccione un impuesto a pagar" },      
      { tipo: "text", titulo: "Monto impuesto abonado", requerido: true, textoAyuda: "Ingrese el monto abonado por el impuesto" },
      { tipo: "list", titulo: "Método de pago",opciones: opcionesMetodoDePago, requerido: true, textoAyuda: "Ingrese el método de pago utilizado"},
      { tipo: "text", titulo: "Indique la cuenta asociada al metodo de pago", textoAyuda: "Ingrese cuenta asociada al metodo de pago" },


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
            let val = FormApp.createTextValidation()
              .requireNumber()
              .requireNumberGreaterThan(0)
              .build();
            pregunta.setValidation(val);
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







