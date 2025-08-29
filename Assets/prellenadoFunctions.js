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
  let preguntaDecision = items[0].asListItem();
  let respuestaDecision = preguntaDecision.createResponse(datos[1]); 
  respuesta.withItemResponse(respuestaDecision);
    //MATERIA PRIMA
  let preguntaSeccionB = items[1].asTextItem();
  let respuestaSeccionB = preguntaSeccionB.createResponse(datos[2]);
  respuesta.withItemResponse(respuestaSeccionB);
      //CCANTIDAD
  preguntaSeccionB = items[2].asTextItem();
  respuestaSeccionB = preguntaSeccionB.createResponse(datos[3]);
  respuesta.withItemResponse(respuestaSeccionB);
  //respuesta CHerramienta o maquina
  preguntaSeccionB = items[3].asListItem();
  respuestaSeccionB = preguntaSeccionB.createResponse(datos[4]);
  respuesta.withItemResponse(respuestaSeccionB);
      //respuesta Horas de uso
  preguntaSeccionB = items[4].asTextItem();
  respuestaSeccionB = preguntaSeccionB.createResponse(datos[5]);
  respuesta.withItemResponse(respuestaSeccionB);
      
  
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
  let preguntaDecision = items[1].asMultipleChoiceItem();
  let respuestaDecision = preguntaDecision.createResponse(datos[2]); 
  respuesta.withItemResponse(respuestaDecision);
  switch(datos[1]){
    case "Materias Primas o Insumos":
      //MP
      let preguntaSeccionB = items[3].asListItem();
      let respuestaSeccionB = preguntaSeccionB.createResponse(datos[3]);
      respuesta.withItemResponse(respuestaSeccionB);
      //PROVEEDOR
      preguntaSeccionB = items[4].asTextItem();
      respuestaSeccionB = preguntaSeccionB.createResponse(datos[4]);
      respuesta.withItemResponse(respuestaSeccionB);
      //FECHA DE COMPROBANTE
      preguntaSeccionB = items[5].asListItem();
      respuestaSeccionB = preguntaSeccionB.createResponse(datos[5]);
      respuesta.withItemResponse(respuestaSeccionB);
      //TIPO COMPROBANTE
      preguntaSeccionB = items[6].asTextItem();
      respuestaSeccionB = preguntaSeccionB.createResponse(datos[6]);
      respuesta.withItemResponse(respuestaSeccionB);
      //NUMERO COMPROBANTE
      preguntaSeccionB = items[7].asListItem();
      respuestaSeccionB = preguntaSeccionB.createResponse(datos[7]);
      respuesta.withItemResponse(respuestaSeccionB);
      //Cantidad
      preguntaSeccionB = items[8].asDateItem();
      respuestaSeccionB = preguntaSeccionB.createResponse(datos[8]);
      respuesta.withItemResponse(respuestaSeccionB);

      if(datos[9]){
        preguntaSeccionB = items[9].asListItem();
        respuestaSeccionB = preguntaSeccionB.createResponse(datos[9]);
        respuesta.withItemResponse(respuestaSeccionB);
      }
      break

    case "Herramientas o Maquinaria":

      let preguntaSeccionA = items[11].asListItem();
      let respuestaSeccionA = preguntaSeccionA.createResponse(datos[10]);
      respuesta.withItemResponse(respuestaSeccionA);
      //PROVEEDOR
      preguntaSeccionA = items[12].asTextItem();
      respuestaSeccionA = preguntaSeccionA.createResponse(datos[11]);
      respuesta.withItemResponse(respuestaSeccionA);
      //FECHA DE COMPROBANTE
      preguntaSeccionA = items[13].asTextItem();
      respuestaSeccionA = preguntaSeccionA.createResponse(datos[12]);
      respuesta.withItemResponse(respuestaSeccionA);
      //TIPO COMPROBANTE
      preguntaSeccionA = items[14].asDateItem();
      respuestaSeccionA = preguntaSeccionA.createResponse(datos[13]);
      respuesta.withItemResponse(respuestaSeccionA);
      //NUMERO COMPROBANTE
      if(datos[14]){
        preguntaSeccionA = items[15].asListItem();
        respuestaSeccionA = preguntaSeccionA.createResponse(datos[14]);
        respuesta.withItemResponse(respuestaSeccionA);
      }
      break;
    
    case "Servicios":

      let preguntaSeccionC = items[17].asTextItem();
      let respuestaSeccionC = preguntaSeccionC.createResponse(datos[15]);
      respuesta.withItemResponse(respuestaSeccionC);
      //PROVEEDOR
      preguntaSeccionC = items[18].asTextItem();
      respuestaSeccionC = preguntaSeccionC.createResponse(datos[16]);
      respuesta.withItemResponse(respuestaSeccionC);
      //FECHA DE COMPROBANTE
      preguntaSeccionC = items[19].asDateItem();
      respuestaSeccionC = preguntaSeccionC.createResponse(datos[17]);
      respuesta.withItemResponse(respuestaSeccionC);
      //TIPO COMPROBANTE
      if(datos[18]){
        preguntaSeccionC = items[20].asListItem();
        respuestaSeccionC = preguntaSeccionC.createResponse(datos[18]);
        respuesta.withItemResponse(respuestaSeccionC);
      }
      //NUMERO COMPROBANTE
      if(datos[19]){
        preguntaSeccionC = items[21].asListItem();
        respuestaSeccionC = preguntaSeccionC.createResponse(datos[19]);
        respuesta.withItemResponse(respuestaSeccionC);
      }
      //Cantidad
      break;
  }
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
  Logger.log(datos);
  let respuesta = form.createResponse();
  //respuesta CONCEPTO DE COMPRA
  let preguntaDecision = items[1].asMultipleChoiceItem();
  let respuestaDecision = preguntaDecision.createResponse(datos[2]); 
  respuesta.withItemResponse(respuestaDecision);
  switch(datos[2]){
    case "Materias Primas o Insumos":
      //MP
      let preguntaSeccionB = items[3].asListItem();
      let respuestaSeccionB = preguntaSeccionB.createResponse(datos[3]);
      respuesta.withItemResponse(respuestaSeccionB);
      //PROVEEDOR
      preguntaSeccionB = items[4].asTextItem();
      respuestaSeccionB = preguntaSeccionB.createResponse(datos[4]);
      respuesta.withItemResponse(respuestaSeccionB);
      //FECHA DE COMPROBANTE
      preguntaSeccionB = items[5].asListItem();
      respuestaSeccionB = preguntaSeccionB.createResponse(datos[5]);
      respuesta.withItemResponse(respuestaSeccionB);
      //TIPO COMPROBANTE
      preguntaSeccionB = items[6].asTextItem();
      respuestaSeccionB = preguntaSeccionB.createResponse(datos[6]);
      respuesta.withItemResponse(respuestaSeccionB);
      //NUMERO COMPROBANTE
      if(datos[7]){
        preguntaSeccionB = items[7].asListItem();
        respuestaSeccionB = preguntaSeccionB.createResponse(datos[7]);
        respuesta.withItemResponse(respuestaSeccionB);
      }
      if(datos[8]){
        preguntaSeccionB = items[8].asListItem();
        respuestaSeccionB = preguntaSeccionB.createResponse(datos[8]);
        respuesta.withItemResponse(respuestaSeccionB);
      }
      break

    case "Herramientas o Maquinaria":

      let preguntaSeccionA = items[10].asListItem();
      let respuestaSeccionA = preguntaSeccionA.createResponse(datos[9]);
      respuesta.withItemResponse(respuestaSeccionA);
      //PROVEEDOR
      preguntaSeccionA = items[11].asTextItem();
      respuestaSeccionA = preguntaSeccionA.createResponse(datos[10]);
      respuesta.withItemResponse(respuestaSeccionA);
      //FECHA DE COMPROBANTE
      preguntaSeccionA = items[12].asTextItem();
      respuestaSeccionA = preguntaSeccionA.createResponse(datos[11]);
      respuesta.withItemResponse(respuestaSeccionA);
      if(datos[12]){
        preguntaSeccionA = items[13].asListItem();
        respuestaSeccionA = preguntaSeccionA.createResponse(datos[12]);
        respuesta.withItemResponse(respuestaSeccionA);
      }
      break;
    
    case "Servicios":

      let preguntaSeccionC = items[15].asTextItem();
      let respuestaSeccionC = preguntaSeccionC.createResponse(datos[13]);
      respuesta.withItemResponse(respuestaSeccionC);
      //PROVEEDOR
      preguntaSeccionC = items[16].asTextItem();
      respuestaSeccionC = preguntaSeccionC.createResponse(datos[14]);
      respuesta.withItemResponse(respuestaSeccionC);
      if(datos[15]){
        preguntaSeccionC = items[17].asListItem();
        respuestaSeccionC = preguntaSeccionC.createResponse(datos[15]);
        respuesta.withItemResponse(respuestaSeccionC);
      }
      //NUMERO COMPROBANTE
      if(datos[16]){
        preguntaSeccionC = items[18].asListItem();
        respuestaSeccionC = preguntaSeccionC.createResponse(datos[16]);
        respuesta.withItemResponse(respuestaSeccionC);
      }
      //Cantidad
      break;
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
        preguntaSeccionB = items[4].asTextItem();
        respuestaSeccionB = preguntaSeccionB.createResponse(datos[4]);
        respuesta.withItemResponse(respuestaSeccionB);
        break;
      case "Pago de servicio":
        //Servicio
        let preguntaSeccionC = items[6].asListItem();
        let respuestaSeccionC = preguntaSeccionC.createResponse(datos[5]);
        respuesta.withItemResponse(respuestaSeccionC);
        //Monto abonado
        preguntaSeccionC = items[7].asTextItem();
        respuestaSeccionC = preguntaSeccionC.createResponse(datos[6]);
        respuesta.withItemResponse(respuestaSeccionC);
        //Método de pago
        preguntaSeccionC = items[8].asListItem();
        respuestaSeccionC = preguntaSeccionC.createResponse(datos[7]);
        respuesta.withItemResponse(respuestaSeccionC);
        //Indique la cuenta asociada al metodo de pago 
        preguntaSeccionC = items[9].asTextItem();
        respuestaSeccionC = preguntaSeccionC.createResponse(datos[8]);
        respuesta.withItemResponse(respuestaSeccionC);
        break;
      case "Pago de impuesto":
        //Impuesto
        let preguntaSeccionA = items[11].asListItem();
        let respuestaSeccionA = preguntaSeccionA.createResponse(datos[9]);
        respuesta.withItemResponse(respuestaSeccionA);
        //Monto impuesto abonado 
        preguntaSeccionA = items[12].asTextItem();
        respuestaSeccionA = preguntaSeccionA.createResponse(datos[10]);
        respuesta.withItemResponse(respuestaSeccionA);
        //Método de pago
        preguntaSeccionA = items[13].asTextItem();
        respuestaSeccionA = preguntaSeccionA.createResponse(datos[11]);
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
  let preguntaDecision = items[1].asMultipleChoiceItem();
  let respuestaDecision = preguntaDecision.createResponse(datos[2]); 
  respuesta.withItemResponse(respuestaDecision);
  switch(datos[2]){
      case "Pago de sueldo":
        //EMPLEADO
        let preguntaSeccionB = items[3].asListItem();
        let respuestaSeccionB = preguntaSeccionB.createResponse(datos[3]);
        respuesta.withItemResponse(respuestaSeccionB);
        //Monto del sueldo
        preguntaSeccionB = items[4].asTextItem();
        respuestaSeccionB = preguntaSeccionB.createResponse(datos[4]);
        respuesta.withItemResponse(respuestaSeccionB);
        //Método de pago
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
        break;
      case "Pago de impuesto":
        //Impuesto
        let preguntaSeccionA = items[12].asListItem();
        let respuestaSeccionA = preguntaSeccionA.createResponse(datos[10]);
        respuesta.withItemResponse(respuestaSeccionA);
        //Monto impuesto abonado 
        preguntaSeccionA = items[13].asTextItem();
        respuestaSeccionA = preguntaSeccionA.createResponse(datos[11]);
        respuesta.withItemResponse(respuestaSeccionA);
        //Método de pago
        preguntaSeccionA = items[14].asTextItem();
        respuestaSeccionA = preguntaSeccionA.createResponse(datos[12]);
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
  let preguntaDecision = items[0].asListItem();
  let respuestaDecision = preguntaDecision.createResponse(datos[1]); 
  respuesta.withItemResponse(respuestaDecision);
    //MATERIA PRIMA
  let preguntaSeccionB = items[1].asTextItem();
  let respuestaSeccionB = preguntaSeccionB.createResponse(datos[2]);
  respuesta.withItemResponse(respuestaSeccionB);
      //CCANTIDAD
  preguntaSeccionB = items[2].asTextItem();
  respuestaSeccionB = preguntaSeccionB.createResponse(datos[3]);
  respuesta.withItemResponse(respuestaSeccionB);
  //respuesta CHerramienta o maquina
  if(datos[4]){
    preguntaSeccionB = items[3].asListItem();
    respuestaSeccionB = preguntaSeccionB.createResponse(datos[4]);
    respuesta.withItemResponse(respuestaSeccionB);
  }
  
      //respuesta Horas de uso
  preguntaSeccionB = items[4].asTextItem();
  respuestaSeccionB = preguntaSeccionB.createResponse(datos[5]);
  respuesta.withItemResponse(respuestaSeccionB);
  Logger.log(respuesta.toPrefilledUrl());
  return respuesta.toPrefilledUrl();
}

///////////////////////////////////////////////////////////
//PARA REPETIR EL ENVIO DE UN FORMULARIO VENTAS//////////////////
///////////////////////////////////////////////////////////

function enlacePrellenadoVentas() {
  let formUrl= PropertiesService.getUserProperties().getProperty("formularioVentasEditUrl");
  let form = FormApp.openByUrl(formUrl);
  
  let datos = obtenerUltimaRespuesta("Hoja2","Ventas");
  let items = form.getItems();
  let respuesta = form.createResponse();
  // Pregunta de decisión (asumimos que está en la posición 0 y es de opción múltiple)
 
      let preguntaSeccionB = items[1].asTextItem();
      let respuestaSeccionB = preguntaSeccionB.createResponse(datos[2]);
      respuesta.withItemResponse(respuestaSeccionB);
      //Cantidad de productos vendidos
      preguntaSeccionB = items[2].asTextItem();
      respuestaSeccionB = preguntaSeccionB.createResponse(datos[3]);
      respuesta.withItemResponse(respuestaSeccionB);
      //Fecha de venta
      preguntaSeccionB = items[3].asListItem();
      respuestaSeccionB = preguntaSeccionB.createResponse(datos[4]);
      respuesta.withItemResponse(respuestaSeccionB);
      //Tipo de comprobante
      preguntaSeccionB = items[4].asDateItem();
      respuestaSeccionB = preguntaSeccionB.createResponse(datos[5]);
      respuesta.withItemResponse(respuestaSeccionB);
      //Número de comprobante 
      if(datos[6]){
        preguntaSeccionB = items[5].asListItem();
      respuestaSeccionB = preguntaSeccionB.createResponse(datos[6]);
      respuesta.withItemResponse(respuestaSeccionB);
      }

  Logger.log(respuesta.toPrefilledUrl());
  return respuesta.toPrefilledUrl();
}


function aplicarDatosPropertiesPrellenado(enlace,nombre,numero){
    const props = PropertiesService.getUserProperties();
    props.setProperty(`prellenadoNombre${numero}`,nombre);
    props.setProperty(`prellenadoEnlace${numero}`,enlace);
}