function determinarCambioMes(ymCompra,ymActual,costoFijoActual,mesActual,sumaGastoParaCf,ymHoy){
    if (ymCompra === ymActual || ymCompra > ymHoy) {
      hojaEq.getRange("C2").setValue(sumaGastoParaCf + costoFijoActual);
    }else {
      if (ymCompra > ymActual && ymCompra <= ymHoy) {
        const fechaParaYear = new Date(dt[0]);
        const year = fechaParaYear.getFullYear();
        cambioMes(hojaEq,mesActual.getMonth()+1,year);
        hojaEq.getRange("C2").setValue(0);
        hojaEq.getRange("K2:k100").setValue(0);
        hojaEq.getRange("C2").setValue(sumaGastoParaCf);
        hojaEq.getRange("A2").setValue(mesCompra);
      }
    }
  }

/////////////////////////////////////////////////////////////////////////////////  
///////////////////////////ENVIAR COBRO///////////////////////////
/////////////////////////////////////////////////////////////////////////////////


function enviarFormCobro(form,items,servicio,monto,cantServicios,fecha){ 

    let respuesta = form.createResponse();
    let preguntaSeccionB = items[0].asMultipleChoiceItem();
    let respuestaSeccionB = preguntaSeccionB.createResponse("Cobro");
    respuesta.withItemResponse(respuestaSeccionB);
    //Cantidad de productos vendidos
    preguntaSeccionB = items[12].asListItem();
    respuestaSeccionB = preguntaSeccionB.createResponse(servicio);
    respuesta.withItemResponse(respuestaSeccionB);


    //Cantidad de productos vendidos
    preguntaSeccionB = items[13].asTextItem();
    respuestaSeccionB = preguntaSeccionB.createResponse(monto);
    respuesta.withItemResponse(respuestaSeccionB);

    preguntaSeccionB = items[14].asTextItem();
    respuestaSeccionB = preguntaSeccionB.createResponse(cantServicios);
    respuesta.withItemResponse(respuestaSeccionB);
    
    preguntaSeccionB = items[15].asDateItem();
    respuestaSeccionB = preguntaSeccionB.createResponse(fecha);
    respuesta.withItemResponse(respuestaSeccionB);
    respuesta.submit();
  }

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////ACTUALIZAR COSTO UNITARIO///////////////////
/////////////////////////////////////////////////////////////////////////////////

  function tAcualizacionCostoUnitario(){
    const sheet = SpreadsheetApp.openById(PropertiesService.getUserProperties().getProperty("HojaResultadosID"));
    const hojaSueldos = sheet.getSheetByName("Pago de Sueldos");
    const hojaEq = sheet.getSheetByName("Punto Eq");
    const bloquePendientes = hojaSueldos.getRange(2,5,hojaSueldos.getLastRow(),hojaSueldos.getLastColumn()-4).getValues();
    for(let i = 0 ; i<bloquePendientes.length;i++){
      const marca = bloquePendientes[i][0];
      if(marca === "#"){
        bloquePendientes[i][0] = "";
        
        const indice = i;
        let costoServicioEmp = 0;
        let sePuedeActualizar = true;
        for(let x = 1;x<bloquePendientes[i].length;x++){
          const valor = bloquePendientes[i][x];
          if(valor){
            if(!isNaN(valor)){
              sePuedeActualizar = false;
              break;
            }
            if(valor[0] ==="#"){
              costoServicioEmp += parseInt(valor.slice(1,valor.length))
            }
          }  
        }
        if(sePuedeActualizar){
          const pendiente = bloquePendientes[i][1];
          const nombresEq = hojaEq.getRange(2,6,hojaEq.getLastRow()).getValues().flat();
          const nombreServ = pendiente.split("|")[1].split("id")[0].trim();
          const indicePq = nombresEq.indexOf(nombreServ) + 2;
          if(indice !== 1){
            hojaEq.getRange(indicePq,7).setValue(costoServicioEmp);
          }
          bloquePendientes.splice(i,1);
          i--;
          ///////////////eliminamos las correspondiente de los pendientes/////////////
         }
      
      }    
    }
    hojaSueldos.getRange(2,5,hojaSueldos.getLastRow(),hojaSueldos.getLastColumn()-4).clearContent();
    hojaSueldos.getRange(2,5,bloquePendientes.length,hojaSueldos.getLastColumn()-4).setValues(bloquePendientes);
    
    //////////////eliminacion del trigger/////////////////////////
    
    const triggers = ScriptApp.getProjectTriggers();
    triggers.forEach(trigger => {
      if (trigger.getHandlerFunction() === "tAcualizacionCostoUnitario") {
        ScriptApp.deleteTrigger(trigger);
      }
    });
  }
