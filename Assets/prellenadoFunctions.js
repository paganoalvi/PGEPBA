function recorrer2(){
  let link = PropertiesService.getUserProperties().getProperty("formularioComprasEditUrl");
  Logger.log(link);
  let form = FormApp.openByUrl(link);
  let items = form.getItems();
  items.forEach(function(item,indice){
    Logger.log(item.getTitle() + "  "+item.getType() +"   "+indice);
  })
}
///////////////////////////////////////////////////////////
//OBTENER LAS RESPUESTAS DE UN SHEET///////////////////////
function revisarDatos(){
  let datos = obtenerUltimaRespuesta("Hoja2","Compras");
  datos.forEach(function(dato,i){
    Logger.log(dato + " "+ i);
  })
}
function obtenerUltimaRespuesta(hojaNum,nombreHoja) {
  const sheet =SpreadsheetApp.openByUrl(PropertiesService.getUserProperties().getProperty(hojaNum));
  let hoja = sheet.getSheetByName(nombreHoja); // Ajusta el nombre de la hoja si es diferente
  let ultimaFila = hoja.getLastRow();
  let datos = hoja.getRange(ultimaFila, 1, 1, hoja.getLastColumn()).getValues(); // Obtiene toda la fila
  return datos[0]; // Devuelve la fila como un array
}

///////////////////////////////////////////////////////////
//PARA REPETIR EL ENVIO DE UN FORMULARIO PRODUCCION//////////////////
///////////////////////////////////////////////////////////

function envioRespuestasProduccion() {
  let formUrl= PropertiesService.getUserProperties().getProperty("formularioProduccionEditUrl");
  let form = FormApp.openByUrl(formUrl);
  
  let datos = obtenerUltimaRespuesta("Hoja2","Producción");
  let items = form.getItems();
  let respuesta = form.createResponse();
  // Pregunta de decisión (asumimos que está en la posición 0 y es de opción múltiple)
  //respuesta CONCEPTO
  let preguntaDecision = items[0].asMultipleChoiceItem();
  let respuestaDecision = preguntaDecision.createResponse(datos[1]); 
  respuesta.withItemResponse(respuestaDecision);

    if(respuestaDecision == "Consumo") {
      //MATERIA PRIMA
      let preguntaSeccionB = items[2].asListItem();
      let respuestaSeccionB = preguntaSeccionB.createResponse(datos[2]);
      respuesta.withItemResponse(respuestaSeccionB);
      //CCANTIDAD
      preguntaSeccionB = items[3].asTextItem();
      respuestaSeccionB = preguntaSeccionB.createResponse(datos[3]);
      respuesta.withItemResponse(respuestaSeccionB);
      //respuesta CHerramienta o maquina
      preguntaSeccionB = items[4].asListItem();
      respuestaSeccionB = preguntaSeccionB.createResponse(datos[4]);
      respuesta.withItemResponse(respuestaSeccionB);
      //respuesta Horas de uso
      preguntaSeccionB = items[5].asTextItem();
      respuestaSeccionB = preguntaSeccionB.createResponse(datos[5]);
      respuesta.withItemResponse(respuestaSeccionB);
    }
    else{
      // respuesta PRODUCTO TERMINADO
      let preguntaSeccionC = items[7].asListItem();
      let respuestaSeccionC = preguntaSeccionC.createResponse(datos[6]);
      respuesta.withItemResponse(respuestaSeccionC);
      //respuesta LOTE
      preguntaSeccionC = items[8].asTextItem();
      respuestaSeccionC = preguntaSeccionC.createResponse(datos[7]);
      respuesta.withItemResponse(respuestaSeccionC);
      //respuesta CANTIDAD
      preguntaSeccionC = items[9].asTextItem();
      respuestaSeccionC = preguntaSeccionC.createResponse(datos[8]);
      respuesta.withItemResponse(respuestaSeccionC);
      //respuesta DESCRIPCION
      preguntaSeccionC = items[10].asTextItem();
      respuestaSeccionC = preguntaSeccionC.createResponse(datos[9]);
      respuesta.withItemResponse(respuestaSeccionC);
    }
      
  
  respuesta.submit();
  
  Logger.log("Formulario enviado con éxito.");
}


///////////////////////////////////////////////////////////
//PARA REPETIR EL ENVIO DE UN FORMULARIO COMPRAS//////////////////
///////////////////////////////////////////////////////////

function envioRespuestasCompras() {
  let formUrl= PropertiesService.getUserProperties().getProperty("formularioComprasEditUrl");
  let form = FormApp.openByUrl(formUrl);
  
  let datos = obtenerUltimaRespuesta("Hoja2","Compras");
  let items = form.getItems();
  let respuesta = form.createResponse();
  //respuesta CONCEPTO DE COMPRA
  let preguntaDecision = items[0].asMultipleChoiceItem();
  let respuestaDecision = preguntaDecision.createResponse(datos[1]); 
  respuesta.withItemResponse(respuestaDecision);
  //ARTICULO
  let preguntaSeccionB = items[1].asListItem();
  let respuestaSeccionB = preguntaSeccionB.createResponse(datos[2]);
  respuesta.withItemResponse(respuestaSeccionB);
  //PROVEEDOR
  preguntaSeccionB = items[2].asListItem();
  respuestaSeccionB = preguntaSeccionB.createResponse(datos[3]);
  respuesta.withItemResponse(respuestaSeccionB);
  //FECHA DE COMPROBANTE
  preguntaSeccionB = items[3].asDateItem();
  respuestaSeccionB = preguntaSeccionB.createResponse(datos[4]);
  respuesta.withItemResponse(respuestaSeccionB);
  //TIPO COMPROBANTE
  preguntaSeccionB = items[4].asListItem();
  respuestaSeccionB = preguntaSeccionB.createResponse(datos[5]);
  respuesta.withItemResponse(respuestaSeccionB);
  //NUMERO COMPROBANTE
  preguntaSeccionB = items[5].asTextItem();
  respuestaSeccionB = preguntaSeccionB.createResponse(datos[6]);
  respuesta.withItemResponse(respuestaSeccionB);
  //Cantidad
  preguntaSeccionB = items[6].asTextItem();
  respuestaSeccionB = preguntaSeccionB.createResponse(datos[7]);
  respuesta.withItemResponse(respuestaSeccionB);
  //Precio de compra 
  preguntaSeccionB = items[7].asTextItem();
  respuestaSeccionB = preguntaSeccionB.createResponse(datos[8]);
  respuesta.withItemResponse(respuestaSeccionB);
  //IVA % 
  preguntaSeccionB = items[8].asTextItem();
  respuestaSeccionB = preguntaSeccionB.createResponse(datos[9]);
  respuesta.withItemResponse(respuestaSeccionB);
  //Pagado
  preguntaSeccionB = items[9].asMultipleChoiceItem();
  respuestaSeccionB = preguntaSeccionB.createResponse(datos[10]);
  respuesta.withItemResponse(respuestaSeccionB);
  //Método de pago
  preguntaSeccionB = items[10].asListItem();
  respuestaSeccionB = preguntaSeccionB.createResponse(datos[11]);
  respuesta.withItemResponse(respuestaSeccionB);
  //cuenta asociada al metodo de pago
  preguntaSeccionB = items[11].asTextItem();
  respuestaSeccionB = preguntaSeccionB.createResponse(datos[12]);
  respuesta.withItemResponse(respuestaSeccionB);
  
    
      
  
  respuesta.submit();
  
  Logger.log("Formulario enviado con éxito.");
}

///////////////////////////////////////////////////////////
//ENLACE PRELLENADO FORMULARIO COMPRAS//////////////////
///////////////////////////////////////////////////////////

function enlacePrellenadoCompras() {
  let formUrl= PropertiesService.getUserProperties().getProperty("formularioComprasEditUrl");
  let form = FormApp.openByUrl(formUrl);
  
  let datos = obtenerUltimaRespuesta("Hoja2","Compras");
  let items = form.getItems();
  let respuesta = form.createResponse();
  //respuesta CONCEPTO DE COMPRA
  let preguntaDecision = items[0].asMultipleChoiceItem();
  let respuestaDecision = preguntaDecision.createResponse(datos[1]); 
  respuesta.withItemResponse(respuestaDecision);
  //ARTICULO
  let preguntaSeccionB = items[1].asListItem();
  let respuestaSeccionB = preguntaSeccionB.createResponse(datos[2]);
  respuesta.withItemResponse(respuestaSeccionB);
  //PROVEEDOR
  preguntaSeccionB = items[2].asListItem();
  respuestaSeccionB = preguntaSeccionB.createResponse(datos[3]);
  respuesta.withItemResponse(respuestaSeccionB);
  //FECHA DE COMPROBANTE
  preguntaSeccionB = items[3].asDateItem();
  respuestaSeccionB = preguntaSeccionB.createResponse(datos[4]);
  respuesta.withItemResponse(respuestaSeccionB);
  //TIPO COMPROBANTE
  preguntaSeccionB = items[4].asListItem();
  respuestaSeccionB = preguntaSeccionB.createResponse(datos[5]);
  respuesta.withItemResponse(respuestaSeccionB);
  //NUMERO COMPROBANTE
  preguntaSeccionB = items[5].asTextItem();
  respuestaSeccionB = preguntaSeccionB.createResponse(datos[6]);
  respuesta.withItemResponse(respuestaSeccionB);
  //Cantidad
  preguntaSeccionB = items[6].asTextItem();
  respuestaSeccionB = preguntaSeccionB.createResponse(datos[7]);
  respuesta.withItemResponse(respuestaSeccionB);
  //Precio de compra 
  preguntaSeccionB = items[7].asTextItem();
  respuestaSeccionB = preguntaSeccionB.createResponse(datos[8]);
  respuesta.withItemResponse(respuestaSeccionB);
  //IVA % 
  preguntaSeccionB = items[8].asTextItem();
  respuestaSeccionB = preguntaSeccionB.createResponse(datos[9]);
  respuesta.withItemResponse(respuestaSeccionB);
  //Pagado
  preguntaSeccionB = items[9].asMultipleChoiceItem();
  respuestaSeccionB = preguntaSeccionB.createResponse(datos[10]);
  respuesta.withItemResponse(respuestaSeccionB);
  //Método de pago
  preguntaSeccionB = items[10].asListItem();
  respuestaSeccionB = preguntaSeccionB.createResponse(datos[11]);
  respuesta.withItemResponse(respuestaSeccionB);
  //cuenta asociada al metodo de pago
  preguntaSeccionB = items[11].asTextItem();
  respuestaSeccionB = preguntaSeccionB.createResponse(datos[12]);
  respuesta.withItemResponse(respuestaSeccionB);
    
  Logger.log(respuesta.toPrefilledUrl());
  return respuesta.toPrefilledUrl();
}

///////////////////////////////////////////////////////////
//PARA REPETIR EL ENVIO DE UN FORMULARIO VENTAS//////////////////
///////////////////////////////////////////////////////////

function envioRespuestasVentas() {
  let formUrl= PropertiesService.getUserProperties().getProperty("formularioVentasEditUrl");
  let form = FormApp.openByUrl(formUrl);
  
  let datos = obtenerUltimaRespuesta("Hoja2","Ventas");
  let items = form.getItems();
  let respuesta = form.createResponse();
  // Pregunta de decisión (asumimos que está en la posición 0 y es de opción múltiple)
  //respuesta TIPO DE VENTA
  let preguntaDecision = items[0].asMultipleChoiceItem();
  let respuestaDecision = preguntaDecision.createResponse(datos[1]); 
  respuesta.withItemResponse(respuestaDecision);

    if(datos[1] == "Venta de productos") {
      //Cliente
      let preguntaSeccionB = items[2].asListItem();
      let respuestaSeccionB = preguntaSeccionB.createResponse(datos[2]);
      respuesta.withItemResponse(respuestaSeccionB);
      //Producto Terminado 
      preguntaSeccionB = items[3].asListItem();
      respuestaSeccionB = preguntaSeccionB.createResponse(datos[3]);
      respuesta.withItemResponse(respuestaSeccionB);
      //Cantidad de productos vendidos
      preguntaSeccionB = items[4].asTextItem();
      respuestaSeccionB = preguntaSeccionB.createResponse(datos[4]);
      respuesta.withItemResponse(respuestaSeccionB);
      //Fecha de venta
      preguntaSeccionB = items[5].asDateItem();
      respuestaSeccionB = preguntaSeccionB.createResponse(datos[5]);
      respuesta.withItemResponse(respuestaSeccionB);
      //Tipo de comprobante
      preguntaSeccionB = items[6].asListItem();
      respuestaSeccionB = preguntaSeccionB.createResponse(datos[6]);
      respuesta.withItemResponse(respuestaSeccionB);
      //Número de comprobante 
      preguntaSeccionB = items[7].asTextItem();
      respuestaSeccionB = preguntaSeccionB.createResponse(datos[7]);
      respuesta.withItemResponse(respuestaSeccionB);
      //Precio de venta(con IVA)
      preguntaSeccionB = items[8].asTextItem();
      respuestaSeccionB = preguntaSeccionB.createResponse(datos[8]);
      respuesta.withItemResponse(respuestaSeccionB);
      //IVA %
      preguntaSeccionB = items[9].asTextItem();
      respuestaSeccionB = preguntaSeccionB.createResponse(datos[9]);
      respuesta.withItemResponse(respuestaSeccionB);
      //Pagado
      preguntaSeccionB = items[10].asMultipleChoiceItem();
      respuestaSeccionB = preguntaSeccionB.createResponse(datos[10]);
      respuesta.withItemResponse(respuestaSeccionB);
      //Método de pago 
      preguntaSeccionB = items[11].asListItem();
      respuestaSeccionB = preguntaSeccionB.createResponse(datos[11]);
      respuesta.withItemResponse(respuestaSeccionB);
      //Indique la cuenta asociada al metodo de pago
      preguntaSeccionB = items[12].asTextItem();
      respuestaSeccionB = preguntaSeccionB.createResponse(datos[12]);
      respuesta.withItemResponse(respuestaSeccionB);
    }
    else{
      //Cliente 
      let preguntaSeccionC = items[14].asListItem();
      let respuestaSeccionC = preguntaSeccionC.createResponse(datos[13]);
      respuesta.withItemResponse(respuestaSeccionC);
      //Fecha de venta
      preguntaSeccionC = items[15].asDateItem();
      respuestaSeccionC = preguntaSeccionC.createResponse(datos[14]);
      respuesta.withItemResponse(respuestaSeccionC);
      //Tipo de comprobante
      preguntaSeccionC = items[16].asListItem();
      respuestaSeccionC = preguntaSeccionC.createResponse(datos[15]);
      respuesta.withItemResponse(respuestaSeccionC);
      //Número de comprobante
      preguntaSeccionC = items[17].asTextItem();
      respuestaSeccionC = preguntaSeccionC.createResponse(datos[16]);
      respuesta.withItemResponse(respuestaSeccionC);
      //Precio de venta (con IVA) 
      preguntaSeccionC = items[18].asTextItem();
      respuestaSeccionC = preguntaSeccionC.createResponse(datos[17]);
      respuesta.withItemResponse(respuestaSeccionC);
      //IVA % 
      preguntaSeccionC = items[19].asTextItem();
      respuestaSeccionC = preguntaSeccionC.createResponse(datos[18]);
      respuesta.withItemResponse(respuestaSeccionC);
      //Pagado
      preguntaSeccionC = items[20].asMultipleChoiceItem();
      respuestaSeccionC = preguntaSeccionC.createResponse(datos[19]);
      respuesta.withItemResponse(respuestaSeccionC);
      //étodo de pago 
      preguntaSeccionC = items[21].asListItem();
      respuestaSeccionC = preguntaSeccionC.createResponse(datos[20]);
      respuesta.withItemResponse(respuestaSeccionC);
      //Indique la cuenta asociada al metodo de pago 
      preguntaSeccionC = items[22].asTextItem();
      respuestaSeccionC = preguntaSeccionC.createResponse(datos[21]);
      respuesta.withItemResponse(respuestaSeccionC);
    }
      
  
  respuesta.submit();
  
  Logger.log("Formulario enviado con éxito.");
}

///////////////////////////////////////////////////////////
//ENLACE PRELLENADO DE VENTAS//////////////////
///////////////////////////////////////////////////////////

function enlacePrellenadoVentas() {
  let formUrl= PropertiesService.getUserProperties().getProperty("formularioVentasEditUrl");
  let form = FormApp.openByUrl(formUrl);
  
  let datos = obtenerUltimaRespuesta("Hoja2","Ventas");
  let items = form.getItems();
  let respuesta = form.createResponse();
  // Pregunta de decisión (asumimos que está en la posición 0 y es de opción múltiple)
  //respuesta TIPO DE VENTA
  let preguntaDecision = items[0].asMultipleChoiceItem();
  let respuestaDecision = preguntaDecision.createResponse(datos[1]); 
  respuesta.withItemResponse(respuestaDecision);

    if(datos[1] == "Venta de productos") {
      //Cliente
      let preguntaSeccionB = items[2].asListItem();
      let respuestaSeccionB = preguntaSeccionB.createResponse(datos[2]);
      respuesta.withItemResponse(respuestaSeccionB);
      //Producto Terminado 
      preguntaSeccionB = items[3].asListItem();
      respuestaSeccionB = preguntaSeccionB.createResponse(datos[3]);
      respuesta.withItemResponse(respuestaSeccionB);
      //Cantidad de productos vendidos
      preguntaSeccionB = items[4].asTextItem();
      respuestaSeccionB = preguntaSeccionB.createResponse(datos[4]);
      respuesta.withItemResponse(respuestaSeccionB);
      //Fecha de venta
      preguntaSeccionB = items[5].asDateItem();
      respuestaSeccionB = preguntaSeccionB.createResponse(datos[5]);
      respuesta.withItemResponse(respuestaSeccionB);
      //Tipo de comprobante
      preguntaSeccionB = items[6].asListItem();
      respuestaSeccionB = preguntaSeccionB.createResponse(datos[6]);
      respuesta.withItemResponse(respuestaSeccionB);
      //Número de comprobante 
      preguntaSeccionB = items[7].asTextItem();
      respuestaSeccionB = preguntaSeccionB.createResponse(datos[7]);
      respuesta.withItemResponse(respuestaSeccionB);
      //Precio de venta(con IVA)
      preguntaSeccionB = items[8].asTextItem();
      respuestaSeccionB = preguntaSeccionB.createResponse(datos[8]);
      respuesta.withItemResponse(respuestaSeccionB);
      //IVA %
      preguntaSeccionB = items[9].asTextItem();
      respuestaSeccionB = preguntaSeccionB.createResponse(datos[9]);
      respuesta.withItemResponse(respuestaSeccionB);
      //Pagado
      preguntaSeccionB = items[10].asMultipleChoiceItem();
      respuestaSeccionB = preguntaSeccionB.createResponse(datos[10]);
      respuesta.withItemResponse(respuestaSeccionB);
      //Método de pago 
      preguntaSeccionB = items[11].asListItem();
      respuestaSeccionB = preguntaSeccionB.createResponse(datos[11]);
      respuesta.withItemResponse(respuestaSeccionB);
      //Indique la cuenta asociada al metodo de pago
      preguntaSeccionB = items[12].asTextItem();
      respuestaSeccionB = preguntaSeccionB.createResponse(datos[12]);
      respuesta.withItemResponse(respuestaSeccionB);
    }
    else{
      //Cliente 
      let preguntaSeccionC = items[14].asListItem();
      let respuestaSeccionC = preguntaSeccionC.createResponse(datos[13]);
      respuesta.withItemResponse(respuestaSeccionC);
      //Fecha de venta
      preguntaSeccionC = items[15].asDateItem();
      respuestaSeccionC = preguntaSeccionC.createResponse(datos[14]);
      respuesta.withItemResponse(respuestaSeccionC);
      //Tipo de comprobante
      preguntaSeccionC = items[16].asListItem();
      respuestaSeccionC = preguntaSeccionC.createResponse(datos[15]);
      respuesta.withItemResponse(respuestaSeccionC);
      //Número de comprobante
      preguntaSeccionC = items[17].asTextItem();
      respuestaSeccionC = preguntaSeccionC.createResponse(datos[16]);
      respuesta.withItemResponse(respuestaSeccionC);
      //Precio de venta (con IVA) 
      preguntaSeccionC = items[18].asTextItem();
      respuestaSeccionC = preguntaSeccionC.createResponse(datos[17]);
      respuesta.withItemResponse(respuestaSeccionC);
      //IVA % 
      preguntaSeccionC = items[19].asTextItem();
      respuestaSeccionC = preguntaSeccionC.createResponse(datos[18]);
      respuesta.withItemResponse(respuestaSeccionC);
      //Pagado
      preguntaSeccionC = items[20].asMultipleChoiceItem();
      respuestaSeccionC = preguntaSeccionC.createResponse(datos[19]);
      respuesta.withItemResponse(respuestaSeccionC);
      //étodo de pago 
      preguntaSeccionC = items[21].asListItem();
      respuestaSeccionC = preguntaSeccionC.createResponse(datos[20]);
      respuesta.withItemResponse(respuestaSeccionC);
      //Indique la cuenta asociada al metodo de pago 
      preguntaSeccionC = items[22].asTextItem();
      respuestaSeccionC = preguntaSeccionC.createResponse(datos[21]);
      respuesta.withItemResponse(respuestaSeccionC);
    }
      
  Logger.log(respuesta.toPrefilledUrl());
  return respuesta.toPrefilledUrl();
}


///////////////////////////////////////////////////////////
//PARA REPETIR EL ENVIO DE UN FORMULARIO COSTO FIJO//////////////////
///////////////////////////////////////////////////////////

function envioRespuestasCostoFijo() {
  let formUrl= PropertiesService.getUserProperties().getProperty("formularioCostosFijosEditUrl");
  let form = FormApp.openByUrl(formUrl);
  
  let datos = obtenerUltimaRespuesta("Hoja2","Costos fijos");
  let items = form.getItems();
  let respuesta = form.createResponse();
  // Pregunta de decisión (asumimos que está en la posición 0 y es de opción múltiple)
  //respuesta CONCEPTO
  let preguntaDecision = items[0].asMultipleChoiceItem();
  let respuestaDecision = preguntaDecision.createResponse(datos[1]); 
  respuesta.withItemResponse(respuestaDecision);
  switch(datos[1]){
      case "Pago de sueldo":
        //EMPLEADO
        let preguntaSeccionB = items[2].asListItem();
        let respuestaSeccionB = preguntaSeccionB.createResponse(datos[2]);
        respuesta.withItemResponse(respuestaSeccionB);
        //Monto del sueldo
        preguntaSeccionB = items[3].asTextItem();
        respuestaSeccionB = preguntaSeccionB.createResponse(datos[3]);
        respuesta.withItemResponse(respuestaSeccionB);
        //Método de pago
        preguntaSeccionB = items[4].asListItem();
        respuestaSeccionB = preguntaSeccionB.createResponse(datos[4]);
        respuesta.withItemResponse(respuestaSeccionB);
        //Indique la cuenta asociada al metodo de pago
        preguntaSeccionB = items[5].asTextItem();
        respuestaSeccionB = preguntaSeccionB.createResponse(datos[5]);
        respuesta.withItemResponse(respuestaSeccionB);
        break;
      case "Pago de servicio":
        //Servicio
        let preguntaSeccionC = items[7].asListItem();
        let respuestaSeccionC = preguntaSeccionC.createResponse(datos[6]);
        respuesta.withItemResponse(respuestaSeccionC);
        //Monto abonado
        preguntaSeccionC = items[8].asTextItem();
        respuestaSeccionC = preguntaSeccionC.createResponse(datos[7]);
        respuesta.withItemResponse(respuestaSeccionC);
        //Método de pago
        preguntaSeccionC = items[9].asListItem();
        respuestaSeccionC = preguntaSeccionC.createResponse(datos[8]);
        respuesta.withItemResponse(respuestaSeccionC);
        //Indique la cuenta asociada al metodo de pago 
        preguntaSeccionC = items[10].asTextItem();
        respuestaSeccionC = preguntaSeccionC.createResponse(datos[9]);
        respuesta.withItemResponse(respuestaSeccionC);
        //Proveedor
        preguntaSeccionC = items[11].asListItem();
        respuestaSeccionC = preguntaSeccionC.createResponse(datos[10]);
        respuesta.withItemResponse(respuestaSeccionC);
        break;
      case "Pago de impuesto":
        //Impuesto
        let preguntaSeccionA = items[13].asListItem();
        let respuestaSeccionA = preguntaSeccionA.createResponse(datos[11]);
        respuesta.withItemResponse(respuestaSeccionA);
        //Monto impuesto abonado 
        preguntaSeccionA = items[14].asTextItem();
        respuestaSeccionA = preguntaSeccionA.createResponse(datos[12]);
        respuesta.withItemResponse(respuestaSeccionA);
        //Método de pago
        preguntaSeccionA = items[15].asListItem();
        respuestaSeccionA = preguntaSeccionA.createResponse(datos[13]);
        respuesta.withItemResponse(respuestaSeccionA);
        //Indique la cuenta asociada al metodo de pago
        preguntaSeccionA = items[16].asTextItem();
        respuestaSeccionA = preguntaSeccionA.createResponse(datos[14]);
        respuesta.withItemResponse(respuestaSeccionA);
      break;

  }
  respuesta.submit();
  
  Logger.log("Formulario enviado con éxito.");
}

///////////////////////////////////////////////////////////
//PARA ENLACE DE UN FORMULARIO COSTO FIJO//////////////////
///////////////////////////////////////////////////////////

function enlacePrellenadoCostoFijo() {
  let formUrl= PropertiesService.getUserProperties().getProperty("formularioCostosFijosEditUrl");
  let form = FormApp.openByUrl(formUrl);
  
  let datos = obtenerUltimaRespuesta("Hoja2","Costos fijos");
  let items = form.getItems();
  let respuesta = form.createResponse();
  // Pregunta de decisión (asumimos que está en la posición 0 y es de opción múltiple)
  //respuesta CONCEPTO
  let preguntaDecision = items[0].asMultipleChoiceItem();
  let respuestaDecision = preguntaDecision.createResponse(datos[1]); 
  respuesta.withItemResponse(respuestaDecision);
  switch(datos[1]){
      case "Pago de sueldo":
        //EMPLEADO
        let preguntaSeccionB = items[2].asListItem();
        let respuestaSeccionB = preguntaSeccionB.createResponse(datos[2]);
        respuesta.withItemResponse(respuestaSeccionB);
        //Monto del sueldo
        preguntaSeccionB = items[3].asTextItem();
        respuestaSeccionB = preguntaSeccionB.createResponse(datos[3]);
        respuesta.withItemResponse(respuestaSeccionB);
        //Método de pago
        preguntaSeccionB = items[4].asListItem();
        respuestaSeccionB = preguntaSeccionB.createResponse(datos[4]);
        respuesta.withItemResponse(respuestaSeccionB);
        //Indique la cuenta asociada al metodo de pago
        preguntaSeccionB = items[5].asTextItem();
        respuestaSeccionB = preguntaSeccionB.createResponse(datos[5]);
        respuesta.withItemResponse(respuestaSeccionB);
        break;
      case "Pago de servicio":
        //Servicio
        let preguntaSeccionC = items[7].asListItem();
        let respuestaSeccionC = preguntaSeccionC.createResponse(datos[6]);
        respuesta.withItemResponse(respuestaSeccionC);
        //Monto abonado
        preguntaSeccionC = items[8].asTextItem();
        respuestaSeccionC = preguntaSeccionC.createResponse(datos[7]);
        respuesta.withItemResponse(respuestaSeccionC);
        //Método de pago
        preguntaSeccionC = items[9].asListItem();
        respuestaSeccionC = preguntaSeccionC.createResponse(datos[8]);
        respuesta.withItemResponse(respuestaSeccionC);
        //Indique la cuenta asociada al metodo de pago 
        preguntaSeccionC = items[10].asTextItem();
        respuestaSeccionC = preguntaSeccionC.createResponse(datos[9]);
        respuesta.withItemResponse(respuestaSeccionC);
        //Proveedor
        preguntaSeccionC = items[11].asListItem();
        respuestaSeccionC = preguntaSeccionC.createResponse(datos[10]);
        respuesta.withItemResponse(respuestaSeccionC);
        break;
      case "Pago de impuesto":
        //Impuesto
        let preguntaSeccionA = items[13].asListItem();
        let respuestaSeccionA = preguntaSeccionA.createResponse(datos[11]);
        respuesta.withItemResponse(respuestaSeccionA);
        //Monto impuesto abonado 
        preguntaSeccionA = items[14].asTextItem();
        respuestaSeccionA = preguntaSeccionA.createResponse(datos[12]);
        respuesta.withItemResponse(respuestaSeccionA);
        //Método de pago
        preguntaSeccionA = items[15].asListItem();
        respuestaSeccionA = preguntaSeccionA.createResponse(datos[13]);
        respuesta.withItemResponse(respuestaSeccionA);
        //Indique la cuenta asociada al metodo de pago
        preguntaSeccionA = items[16].asTextItem();
        respuestaSeccionA = preguntaSeccionA.createResponse(datos[14]);
        respuesta.withItemResponse(respuestaSeccionA);
      break;

  }
  Logger.log(respuesta.toPrefilledUrl());
  return respuesta.toPrefilledUrl();
}



////////////////////////////////////////////////////////
//ENLACE DEL FORM PRELLENADO PRODUCCION////////////////
////////////////////////////////////////////////////////
function enlacePrellenadoProduccion() {
  let formUrl= PropertiesService.getUserProperties().getProperty("formularioProduccionEditUrl");
  let form = FormApp.openByUrl(formUrl);
  
  let datos = obtenerUltimaRespuesta("Hoja2","Producción");
  let items = form.getItems();
  let respuesta = form.createResponse();
  // Pregunta de decisión (asumimos que está en la posición 0 y es de opción múltiple)
  //respuesta CONCEPTO
  let preguntaDecision = items[0].asMultipleChoiceItem();
  let respuestaDecision = preguntaDecision.createResponse(datos[1]); 
  respuesta.withItemResponse(respuestaDecision);

  if(respuestaDecision == "Consumo") {
      //MATERIA PRIMA
      let preguntaSeccionB = items[2].asListItem();
      let respuestaSeccionB = preguntaSeccionB.createResponse(datos[2]);
      respuesta.withItemResponse(respuestaSeccionB);
      //CCANTIDAD
      preguntaSeccionB = items[3].asTextItem();
      respuestaSeccionB = preguntaSeccionB.createResponse(datos[3]);
      respuesta.withItemResponse(respuestaSeccionB);
      //respuesta CHerramienta o maquina
      preguntaSeccionB = items[4].asListItem();
      respuestaSeccionB = preguntaSeccionB.createResponse(datos[4]);
      respuesta.withItemResponse(respuestaSeccionB);
      //respuesta Horas de uso
      preguntaSeccionB = items[5].asTextItem();
      respuestaSeccionB = preguntaSeccionB.createResponse(datos[5]);
      respuesta.withItemResponse(respuestaSeccionB);
    }
    else{
      // respuesta PRODUCTO TERMINADO
      let preguntaSeccionC = items[7].asListItem();
      let respuestaSeccionC = preguntaSeccionC.createResponse(datos[6]);
      respuesta.withItemResponse(respuestaSeccionC);
      //respuesta LOTE
      preguntaSeccionC = items[8].asTextItem();
      respuestaSeccionC = preguntaSeccionC.createResponse(datos[7]);
      respuesta.withItemResponse(respuestaSeccionC);
      //respuesta CANTIDAD
      preguntaSeccionC = items[9].asTextItem();
      respuestaSeccionC = preguntaSeccionC.createResponse(datos[8]);
      respuesta.withItemResponse(respuestaSeccionC);
      //respuesta DESCRIPCION
      preguntaSeccionC = items[10].asTextItem();
      respuestaSeccionC = preguntaSeccionC.createResponse(datos[9]);
      respuesta.withItemResponse(respuestaSeccionC);
    }
  Logger.log(respuesta.toPrefilledUrl());
  return respuesta.toPrefilledUrl();
}



function aplicarDatosPropertiesPrellenado(enlace,nombre,numero){
    const props = PropertiesService.getUserProperties();
    props.setProperty(`prellenadoNombre${numero}`,nombre);
    props.setProperty(`prellenadoEnlace${numero}`,enlace);
}
