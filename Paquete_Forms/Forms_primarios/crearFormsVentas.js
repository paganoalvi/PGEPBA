 /////////////////////////////////////////
// FUNCIÓN PRINCIPAL: Crear el Form VENTAS   //
////////////////////////////////////////
function compras (){
  try {
    Logger.log("Iniciando creación del formulario de ventas");


    let formularioVentas = FormApp.create("Ventas");
    let formularioVentasID = formularioVentas.getId();
    PropertiesService.getScriptProperties().setProperty("Formulario_ID", formularioVentasID);


    formularioVentas.setDescription(
      "Este formulario permite llevar registro de tus ventas"
    );


    let preguntaInicial = formularioVentas.addMultipleChoiceItem()
      .setTitle("Elija el tipo de venta")
      .setRequired(true);
   
    const seccion1 = seccionVentaProductos(formularioVentas).nuevaSeccion;
    const seccion2 = seccionVentaServicios(formularioVentas).nuevaSeccion;


    preguntaInicial.setChoices([
      preguntaInicial.createChoice("Venta de productos", seccion1),
      preguntaInicial.createChoice("Venta de servicios", seccion2),
    ]);


    seccion1.setGoToPage(FormApp.PageNavigationType.SUBMIT);
    seccion2.setGoToPage(FormApp.PageNavigationType.SUBMIT);
 
    const formVentasUrl = formularioVentas.getPublishedUrl();
    Logger.log("Enlace a formulario: " + formVentasUrl)
    PropertiesService.getUserProperties().setProperty("formularioVentasUrl", formVentasUrl);
    PropertiesService.getUserProperties().setProperty("formularioVentasEditUrl", formularioVentas.getEditUrl());
    Logger.log(formularioVentas.getEditUrl());


    Logger.log("Formulario de ventas creado con ID: " + formularioVentas.getId());


    return formularioVentas;


  } catch (error) {
    console.error("Error al crear el formulario de ventas:", error.message);
    return null;
  }
}




let opcionesPagadoVentas = ["Sí", "No"];


/////////////////////////////////////////////////////////
// SECCIÓN VENTA DE PRODUCTOS   ////////////////////////
/////////////////////////////////////////////////////////


let opcionesTipoComprobanteVentas = ["Factura 'A'", "Factura 'B'", "Factura 'C'","Factura E","Factura M","Nota de crédito","Sin comprobante"];




function seccionVentaProductos(formulario) {
  try {


    let nuevaSeccion = formulario.addPageBreakItem()
      .setTitle("Venta de productos")
      .setHelpText("Ingrese los detalles de productos vendidos.");
 
    let opcionesProductosTerminados = [" "]; // opciones productos terminados o "Paquetes de productos vendidos"
   
    let opcionesClientes = [" "]; // opciones clientes


    let opcionesMetodoDePago = [ "Mercado Pago","Cuenta DNI","Billetera Santa Fe","Ualá","MODO","BIP Homebanking","App Galicia","Brubank","Prex","Transferencia bancaria","Tarjeta de débito","Tarjeta de crédito","Pago en efectivo","Otro" ];


    const TITULO_CANTIDAD_PV = "Cantidad de productos vendidos"
    const PECIO_VENTA_IVA = "Precio de venta(con IVA)"
    const TITULO_IVA = "IVA %"




    const preguntasVentaProductos = [
     
      { tipo: "list", titulo: "Cliente", opciones: opcionesClientes, requerido: true}, // cambiar por formClienteUrl
      { tipo: "list", titulo: "Producto Terminado", opciones: opcionesProductosTerminados, requerido: true, textoAyuda: "Seleccione el producto terminado involucrado en la venta" }, // pregunta nombre articulo terminado
      { tipo: "text", titulo: "Cantidad de productos vendidos", requerido: true, textoAyuda: "Ingrese cantidad" },//VALIDACION NUMERICA
      { tipo: "date", titulo: "Fecha de venta", requerido: true, textoAyuda: "Seleccione fecha de la venta" },
      { tipo: "list", titulo: "Tipo de comprobante", opciones: opcionesTipoComprobanteVentas, requerido: true, textoAyuda: "Seleccione el tipo de comprobante" }, // ARCHIVO PDF?
      { tipo: "text", titulo: "Número de comprobante", textoAyuda: "Ingrese número de comprobante" }, // VALIDACION NUMERICA
      { tipo: "text", titulo: "Precio de venta(con IVA)", requerido: true, textoAyuda: "Ingrese precio de venta con IVA" }, // VALIDACION NUMERICA


      { tipo: "text", titulo: "IVA %", requerido: true, textoAyuda: "Ingrese el porcentaje de impuesto al valor agregado (IVA)" }, // ESTA PREGUNTA HAY QUE SACARLA Y PONER EL NUMERO QUE CORRESPONDE SEGUN EL TIPO DE COMPROBANTE QUE SE ELIJA


      { tipo: "seleccion", titulo: "Pagado", opciones: opcionesPagadoVentas, requerido: true, textoAyuda: "Indique si la venta fue pagada o no (Sí/No)" },


      { tipo: "list", titulo: "Método de pago",opciones: opcionesMetodoDePago, requerido: true, textoAyuda: "Ingrese el método de pago utilizado" },


      { tipo: "text", titulo: "Indique la cuenta asociada al metodo de pago", textoAyuda: "Ingrese cuenta asociada al metodo de pago" },
    ];
    preguntasVentaProductos.forEach(p => {
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
          if (p.titulo === TITULO_CANTIDAD_PV) {
            let val = FormApp.createTextValidation()
              .requireWholeNumber()
              .requireNumberGreaterThan(0)
              .build();
            pregunta.setValidation(val);
          }
          //Validacio para el precio de la venta
          if (p.titulo === PECIO_VENTA_IVA) {
            let val = FormApp.createTextValidation()
              .requireWholeNumber()
              .requireNumberGreaterThan(0)
              .build();
            pregunta.setValidation(val);
          }
          //Validacio para IVA
          if (p.titulo === TITULO_IVA) {
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
// SECCIÓN VENTA DE SERVICIOS   ////////////////////////
/////////////////////////////////////////////////////////


function seccionVentaServicios(formulario) {
  try {


    let nuevaSeccion = formulario.addPageBreakItem()
      .setTitle("Venta de servicios")
      .setHelpText("Ingrese los detalles de los servicios prestados.");
 
    let opcionesClientes = [" "]; // opciones clientes


    let opcionesTipoComprobanteVentas = ["Factura 'A'", "Factura 'B'", "Factura 'C'","Factura E","Factura M","Nota de crédito"];


    let opcionesMetodoDePago = [ "Mercado Pago","Cuenta DNI","Billetera Santa Fe","Ualá","MODO","BIP Homebanking","App Galicia","Brubank","Prex","Transferencia bancaria","Tarjeta de débito","Tarjeta de crédito","Pago en efectivo","Otro" ];


    const PECIO_VENTA_IVA_Servicio = "Precio de venta (con IVA)"
    const TITULO_IVA = "IVA %"


    const preguntasVentaServicios = [
      { tipo: "list", titulo: "Cliente", opciones: opcionesClientes, requerido: true},
      { tipo: "date", titulo: "Fecha de venta", requerido: true, textoAyuda: "Seleccione fecha de venta" },
      { tipo: "list", titulo: "Tipo de comprobante", opciones: opcionesTipoComprobanteVentas, requerido: true, textoAyuda: "Seleccione el tipo de comprobante" }, // ARCHIVO PDF?
      { tipo: "text", titulo: "Número de comprobante", requerido: true, textoAyuda: "Ingrese número de comprobante" }, // VALIDACION NUMERICA
      { tipo: "text", titulo: "Precio de venta (con IVA)", requerido: true, textoAyuda: "Ingrese precio por la venta del servicio incluyendo IVA" }, // VALIDACION NUMERICA


      { tipo: "text", titulo: "IVA %", requerido: true, textoAyuda: "Ingrese el porcentaje de impuesto al valor agregado (IVA)" }, // VALDIACION PONER DECIMALES CORRECTOS O PORCENTAJE


      { tipo: "seleccion", titulo: "Pagado", opciones: opcionesPagadoVentas, requerido: true, textoAyuda: "Indique si la prestacion del servicio fue pagada o no (Sí/No)" },


      { tipo: "list", titulo: "Método de pago",opciones: opcionesMetodoDePago, requerido: true, textoAyuda: "Ingrese el método de pago utilizado" },


      { tipo: "text", titulo: "Indique la cuenta asociada al metodo de pago", textoAyuda: "Ingrese cuenta asociada al metodo de pago" },


      // AGREGAR OPCION VENTA DE PRODUCTOS SUB SECCION DE SI O NO QUE REDIRIGA A LA SECCION VENTA DE PRODUCTOS SI SE ELIGE QUE SI Y CONTINUA SI SE ELIJE QUE NO


    ];
    preguntasVentaServicios.forEach(p => {
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
          if (p.titulo === PECIO_VENTA_IVA_Servicio) {
            let val = FormApp.createTextValidation()
              .requireWholeNumber()
              .requireNumberGreaterThan(0)
              .build();
            pregunta.setValidation(val);
          }
          //Validacion IVA
          if (p.titulo === TITULO_IVA) {
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
    console.error("Error en la sección Venta de servicios:", error.message);
    return { nuevaSeccion: null };
  }
}







