 /////////////////////////////////////////
// FUNCIÓN PRINCIPAL: Crear el Form VENTAS   //
////////////////////////////////////////
function ventas (){
  try {
    Logger.log("Iniciando creación del formulario de ventas");


    let formularioVentas = FormApp.create("Ventas");
    let formularioVentasID = formularioVentas.getId();
    PropertiesService.getScriptProperties().setProperty("Formulario_ID", formularioVentasID);


    formularioVentas.setDescription(
      "Este formulario permite llevar registro de tus ventas"
    );

    let opcionesTipoComprobanteVentas = ["Factura 'A'", "Factura 'B'", "Factura 'C'","Factura E","Factura M","Nota de crédito","Sin comprobante"];
    let opcionesProductosTerminados = [" "]; // opciones productos terminados o "Paquetes de productos vendidos"  
    let opcionesClientes = [" "]; // opciones clientes
    let opcionesMetodoDePago = [ "Mercado Pago","Cuenta DNI","Billetera Santa Fe","Ualá","MODO","BIP Homebanking","App Galicia","Brubank","Prex","Transferencia bancaria","Tarjeta de débito","Tarjeta de crédito","Pago en efectivo","Otro" ];
    const TITULO_CANTIDAD_PV = "Cantidad de productos vendidos"
    const PRECIO_VENTA_IVA = "Precio de venta (con IVA)"

    const preguntasVentaProductos = [
      { tipo: "list", titulo: "Producto Terminado", opciones: opcionesProductosTerminados, requerido: true, textoAyuda: "Seleccione el producto terminado involucrado en la venta" }, // pregunta nombre articulo terminado
      { tipo: "text", titulo: "Cantidad de productos vendidos", requerido: true, textoAyuda: "Ingrese cantidad" },//VALIDACION NUMERICA
      { tipo: "list", titulo: "Cliente", opciones: opcionesClientes, requerido: true}, // cambiar por formClienteUrl      
      { tipo: "date", titulo: "Fecha de venta", requerido: true, textoAyuda: "Seleccione fecha de la venta" },
      { tipo: "list", titulo: "Tipo de comprobante", opciones: opcionesTipoComprobanteVentas, requerido: true, textoAyuda: "Seleccione el tipo de comprobante" }, // ARCHIVO PDF?
      { tipo: "text", titulo: "Número de comprobante", textoAyuda: "Ingrese número de comprobante" }, // VALIDACION NUMERICA
      { tipo: "text", titulo: "Precio de venta (con IVA)", requerido: true, textoAyuda: "Ingrese precio de venta con IVA" }, // VALIDACION NUMERICA
      { tipo: "list", titulo: "Método de pago",opciones: opcionesMetodoDePago, requerido: true, textoAyuda: "Ingrese el método de pago utilizado" },
      { tipo: "text", titulo: "Indique la cuenta asociada al metodo de pago", textoAyuda: "Especifique la cuenta utilizada para este método de pago (ej: Alias, CBU, etc.)" },
    ];
    preguntasVentaProductos.forEach(p => {
      let pregunta;
      switch (p.tipo) {
        case "list": // Menú desplegable
          pregunta = formularioVentas.addListItem();
          if (p.opciones) {
            pregunta.setChoices(p.opciones.map(op => pregunta.createChoice(op)));
          }
          break;
        case "text":
          pregunta = formularioVentas.addTextItem();
          //Validacion para la cantidad
          if (p.titulo === TITULO_CANTIDAD_PV) {
            let val = FormApp.createTextValidation()
              .requireWholeNumber()
              .requireNumberGreaterThan(0)
              .build();
            pregunta.setValidation(val);
          }
          //Validacio para el precio de la venta
          if (p.titulo === PRECIO_VENTA_IVA) {
            let val = FormApp.createTextValidation()
              .requireWholeNumber()
              .requireNumberGreaterThan(0)
              .build();
            pregunta.setValidation(val);
          }
          break;
        case "date":
          pregunta = formularioVentas.addDateItem();
          break;
        case "seleccion": // Selección única
          pregunta = formularioVentas.addMultipleChoiceItem();
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