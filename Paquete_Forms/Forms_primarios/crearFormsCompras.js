/////////////////////////////////////////
// FUNCIÓN PRINCIPAL: Crear el Form COMPRAS   //
////////////////////////////////////////
function compras (){
  try {
    Logger.log("Creando formulario compras...");

    let formularioCompras = FormApp.create("Compras");
    let formularioComprasID = formularioCompras.getId();
    PropertiesService.getScriptProperties().setProperty("Formulario_ID", formularioComprasID);

    formularioCompras.setDescription("Registrá todas las compras realizadas para la prestación del servicio, pueden ser insumos, herramientas u otro servicio.");

    formularioCompras.addDateItem()
      .setTitle("Fecha de la compra")
      .setRequired(true)
      .setHelpText("Indicá el día en que se realizó la compra.");


    let preguntaInicial = formularioCompras.addMultipleChoiceItem()
      .setTitle("Indicá el tipo de compra que vas a registrar")
      .setRequired(true);
   
    const seccionMP = seccionCompraMP(formularioCompras).nuevaSeccion;
    const seccionArticulos = seccionCompraArticulos(formularioCompras).nuevaSeccion;
    const seccionServicios = seccionCompraServicios(formularioCompras).nuevaSeccion;

    preguntaInicial.setChoices([
      preguntaInicial.createChoice("Insumo", seccionMP),
      preguntaInicial.createChoice("Herramientas/maquinaria", seccionArticulos),
      preguntaInicial.createChoice("Servicio", seccionServicios),
    ]);

    seccionMP.setGoToPage(FormApp.PageNavigationType.SUBMIT);
    seccionArticulos.setGoToPage(FormApp.PageNavigationType.SUBMIT);
    seccionServicios.setGoToPage(FormApp.PageNavigationType.SUBMIT);
 
    const formComprasUrl = formularioCompras.getPublishedUrl();
    Logger.log("||||||||||||||||||")
    Logger.log("COMPRAS")
    Logger.log(formComprasUrl)
    Logger.log("||||||||||||||||||")
    PropertiesService.getUserProperties().setProperty("formularioComprasUrl", formComprasUrl);
    PropertiesService.getUserProperties().setProperty("formularioComprasEditUrl", formularioCompras.getEditUrl());
    //Logger.log(formularioCompras.getEditUrl());

    //Logger.log("Formulario de compras creado con ID: " + formularioCompras.getId());

    return formularioCompras;

  } catch (error) {
    console.error("Error al crear el formulario de compras:", error.message);
    return null;
  }
}

/////////////////////////////////////////////////////////
// SECCIÓN COMPRA INSUMO ////////////////////////////////
/////////////////////////////////////////////////////////
let opcionesTipoComprobanteCompras = ["Factura 'A'", "Factura 'B'", "Factura 'C'","Factura 'E'","Factura 'M'","Nota de crédito","Sin comprobante"];
function seccionCompraMP(formulario) {
  try {

    let nuevaSeccion = formulario.addPageBreakItem()
      .setTitle("Registro de compra de insumos")

    let opcionesProveedor = [" "]
    let opcionesMP = [" "]
    let opcionesUnidadCompra  = ["Unidad","Kg","Litros","Metros"]
    const TITULO_CANTIDAD = "Cantidad adquirida"
    const PECIO_COMPRA_IVA = "Precio de compra (con IVA)"

    const preguntasCompraMP = [
     
      { tipo: "list", titulo: "Insumo adquirido", opciones: opcionesMP, requerido: true}, //  
      { tipo: "text", titulo: TITULO_CANTIDAD, requerido: true,textoAyuda:"Indicá cuántas unidades o medidas del insumo se compraron."},//VALIDACION NUMERICA
      { tipo: "list", titulo: "Unidad de compra", opciones: opcionesUnidadCompra, requerido: true, textoAyuda : "Seleccioná la unidad de compra."}, //
      { tipo: "text", titulo: PECIO_COMPRA_IVA, requerido: true}, // VALIDACION NUMERIC
      { tipo: "list", titulo: "Proveedor", opciones: opcionesProveedor}, // 
      { tipo: "list", titulo: "Tipo de comprobante", opciones: opcionesTipoComprobanteCompras},
      //{ tipo: "text", titulo: "Número de comprobante", textoAyuda: "Ingrese número de comprobante" }, // VALIDACION NUMERICA
    ];
    preguntasCompraMP.forEach(p => {
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
          //Validacion para la cantidad
          if (p.titulo === TITULO_CANTIDAD) {
            let val = FormApp.createTextValidation()
              .requireWholeNumber()
              .requireNumberGreaterThan(0)
              .build();
            pregunta.setValidation(val);
          }
          //Validacio para el precio de la venta
          if (p.titulo === PECIO_COMPRA_IVA) {
            let val = FormApp.createTextValidation()
              .requireWholeNumber()
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
    console.error("Error en la sección Venta productos:", error.message);
    return { nuevaSeccion: null };
  }
}


/////////////////////////////////////////////////////////
// SECCIÓN COMPRA HERRAMIENTA/MAQUINARIA/////////////////
/////////////////////////////////////////////////////////

function seccionCompraArticulos(formulario) {
  try {


    let nuevaSeccion = formulario.addPageBreakItem()
      .setTitle("Registro de compra de herramienta/maquinaria")

    let opcionesTipoComprobanteVentas = ["Factura 'A'", "Factura 'B'", "Factura 'C'","Factura 'E'","Factura 'M'","Nota de crédito","Sin comprobante"];
    let opcionesArticulo = [" "]
    const PRECIO_Compra_Articulo = "Precio de compra (con IVA)"

    const preguntasCompraArticulo = [
      { tipo: "list", titulo: "Herramienta/maquinaria adquirida", opciones: opcionesArticulo, requerido: true},
      { tipo: "text", titulo: "Cantidad adquirida", requerido: true},//VALIDACION NUMERICA //CHECK
      { tipo: "text", titulo: PRECIO_Compra_Articulo, requerido:true}, // VALIDACION NUMERICA // CHECK
      { tipo: "list", titulo: "Tipo de comprobante", opciones: opcionesTipoComprobanteVentas}, // ARCHIVO PDF?
      //{ tipo: "text", titulo: "Número de comprobante", requerido: true, textoAyuda: "Ingrese número de comprobante" }, // VALIDACION NUMERICA

    ];
    preguntasCompraArticulo.forEach(p => {
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
          //Validacion precio venta
          if (p.titulo === PRECIO_Compra_Articulo) {
            let val = FormApp.createTextValidation()
              .requireWholeNumber()
              .build();
            pregunta.setValidation(val);
          }
          if (p.titulo === "Cantidad") {
            let val = FormApp.createTextValidation()
              .requireWholeNumber()
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
    console.error("Error en la sección compra de articulos:", error.message);
    return { nuevaSeccion: null };
  }
}


/////////////////////////////////////////////////////////
// SECCIÓN COMPRA SERVICIO///////////////////////////////
/////////////////////////////////////////////////////////

function seccionCompraServicios(formulario) {
  try {


    let nuevaSeccion = formulario.addPageBreakItem()
      .setTitle("Registro de adquisición de un servicio")

    let opcionesTiposComprobante = ["Factura 'A'", "Factura 'B'", "Factura 'C'","Factura 'E'","Factura 'M'","Nota de crédito","Sin comprobante"];
    let opcionesProveed = [" "]

    const PRECIO_Compra_Servicio = "Valor del servicio";

    const preguntasCompraServicios = [
      { tipo: "text", titulo: "Servicio adquirido", requerido: true},//VALIDACION NUMERICA
      { tipo: "text", titulo: PRECIO_Compra_Servicio, requerido: true,}, // VALIDACION NUMERICA
      { tipo: "list", titulo: "Proveedor", opciones: opcionesProveed},
      { tipo: "list", titulo: "Tipo de comprobante", opciones: opcionesTiposComprobante,},
      //{ tipo: "text", titulo: "Número de comprobante", requerido: true, textoAyuda: "Ingrese número de comprobante" }, // VALIDACION NUMERICA

    ];
    preguntasCompraServicios.forEach(p => {
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
          //Validacion precio venta
          if (p.titulo === PRECIO_Compra_Servicio) {
            let val = FormApp.createTextValidation()
              .requireWholeNumber()
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
    console.error("Error en la sección compra de articulos:", error.message);
    return { nuevaSeccion: null };
  }
}
