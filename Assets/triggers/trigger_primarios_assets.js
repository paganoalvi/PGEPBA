
///////////funcion trigger cobro////////////////

function tCobro(dt,hoja){
    const props = PropertiesService.getUserProperties();
    const formCo = FormApp.openByUrl(props.getProperty("formularioCobroEditUrl"));
    const hojaEq = hoja.getParent().getSheetByName("Punto Eq");
    //////////////////////////////////actualizamos precio unitario en eq///////////
    const nombresServicios = hojaEq.getRange(2,6,hojaEq.getLastRow(),1).getValues().flat();
    const macheo = dt[1].match(/Serv:\s*(.*?)\s*- Cant:/);
    const servicio = macheo ? macheo[1].trim() : null;
    const indiceServicio = nombresServicios.indexOf(servicio) + 2;
    hojaEq.getRange(indiceServicio,10).setValue(Number(parseFloat(dt[2])/parseFloat(dt[3])).toFixed(2))
    const cantServiciosActual = hojaEq.getRange(indiceServicio,11).getValue() || 0;
    hojaEq.getRange(indiceServicio,11).setValue(cantServiciosActual + parseInt(dt[3]));   
    let itemsCoCo = formCo.getItems();
    let serviciosLista = itemsCoCo[0].asListItem(); 
    let opcionesActualesC = serviciosLista.getChoices().map(choice => choice.getValue());
    let indice = opcionesActualesC.indexOf(dt[1]);
    const match = dt[1].match(/Cant:\s*(\d+)/);
    if(match){
      const cantidad = parseInt(match[1], 10) - parseInt(dt[3],10);
      if (indice !== -1) {
        if (cantidad > 0) {
          let textoModificado = dt[1].replace(/(Cant:\s*)\d+/, `$1${cantidad}`);
          opcionesActualesC[indice] = textoModificado;
        } else {
          opcionesActualesC.splice(indice, 1);
        }
        serviciosLista.setChoices(opcionesActualesC.map(valor => serviciosLista.createChoice(valor)));
      }
    }
}


function tCompras(dt,hoja) {
  //const hoja = SpreadsheetApp.openById(PropertiesService.getUserProperties().getProperty("HojaResultadosID")).getActiveSheet();
  //const dt = ["","10/22/2025","Herramientas o Maquinaria","","","","","","","lorenzo","3","2000",""]
  let esInsumo = false;
  const hojaStock = hoja.getParent().getSheetByName("Stock");
  const lastRow = hojaStock.getLastRow();
  let rangoDatos;
  let nombreElemento;
  let cantidadRecibida;
  let colTipoElemento;
  let cantColumnas;
  if(dt[2] === "Insumo") esInsumo = true; // aca no seria equivalente y mas intuitivo poner => esInsumo = dt[2]=="Insumo" (?)
  if(esInsumo){
    nombreElemento = dt[3];
    cantidadRecibida =dt[4];
    colTipoElemento = 5
    cantColumnas = 4;
  }else{
    nombreElemento = dt[9]; 
    cantidadRecibida = dt[10];
    colTipoElemento = 2;
    cantColumnas = 2;


    //Herramientas afecta costos fijos, por lo que se necesita saber si cambia de mes o no
    const hojaEq = hoja.getParent().getSheetByName("Punto Eq");
    const mesCompra = (new Date(dt[1]));

    const dateHoy = new Date();
    const ymHoy = dateHoy.getFullYear() * 12 + dateHoy.getMonth();

    const mesActual = hojaEq.getRange("A2").getValue();
    const ymCompra = mesCompra.getFullYear() * 12 + mesCompra.getMonth();
    const ymActual = mesActual.getFullYear() * 12 + mesActual.getMonth();
    const sumaGastoParaCf = parseInt(dt[11] || 0) + parseInt(dt[14] || 0);
    const costoFijoActual = parseFloat(hojaEq.getRange("C2").getValue() || 0.0);
    //determinarCambioMes(ymCompra,ymActual,costoFijoActual,mesActual,sumaGastoParaCf,ymHoy);

    ///////////////actualizar costo fijo////////////////////////////
    if(!dt[13]){
      hojaEq.getRange("C2").setValue(costoFijoActual+(sumaGastoParaCf /parseInt(dt[10] ||   0) ));
    }else{
      hojaEq.getRange("C2").setValue(costoFijoActual+ sumaGastoParaCf);
    }
    
    
  }

  if(!dt[13]){
    rangoDatos = hojaStock.getRange(2, colTipoElemento, lastRow - 1, cantColumnas).getValues();
    for (let i = 0; i < rangoDatos.length; i++) {
      if (rangoDatos[i][0] === nombreElemento) { // nombre Elemento
        let cantidadActual = parseInt(rangoDatos[i][1]) || 0;
        cantidadActual += parseInt(cantidadRecibida); // cantidad comprada
        rangoDatos[i][1] = cantidadActual;
        if(esInsumo){  
          rangoDatos[i][2] = Number((dt[6] / dt[4]).toFixed(2)); 
          rangoDatos[i][3] = dt[5]; 
        }
        break;
      }
    }
    hojaStock.getRange(2, colTipoElemento, lastRow - 1, cantColumnas).setValues(rangoDatos);
  }
  
}

  

///////////funcion trigger Costo Fijo////////////////
function tCostoFijo(dt,hoja){ 
  const fecha = new Date(dt[1]);
  const totalCostoFijo = parseInt(dt[4] || 0 )+parseInt(dt[8] || 0);
  const hojaEq = hoja.getParent().getSheetByName("Punto Eq");
  const fechaUltima = hojaEq.getRange("A2").getValue();
  const dateHoy = new Date();
  const ymHoy = dateHoy.getFullYear() * 12 + dateHoy.getMonth();
  const ymCostoFijo = fecha.getFullYear() * 12 + fecha.getMonth();
  const ymActual = fechaUltima.getFullYear() * 12 + fechaUltima.getMonth();
  if (ymCostoFijo === ymActual || ymCostoFijo > ymHoy) {
    let valorCfActual = parseInt(hojaEq.getRange(`C2`).getValue() || 0);
    valorCfActual+=totalCostoFijo;
    hojaEq.getRange(`C2`).setValue(valorCfActual);
  }else{
    if (ymCostoFijo > ymActual && ymCostoFijo <= ymHoy) {
      const fechaParaYear = new Date(dt[0]);
      const year = fechaParaYear.getFullYear();
      cambioMes(hojaEq,fechaUltima.getMonth()+1,year);
      hojaEq.getRange("K2:K100").setValue(0);
      hojaEq.getRange("C2").setValue(totalCostoFijo);
      hojaEq.getRange("A2").setValue(fecha);
    }
  }
}


/////////////////////////////////////////////////////////////////////
///////////TRIGGER CONTRATACION / COBRO////////////////
/////////////////////////////////////////////////////////////////


function tContratacionCobro(dt) {
  const props = PropertiesService.getUserProperties();
  // [10/27/2025 0:37:23, Matenimiento caldera, , 10/3/2025, , , 4324, , ]
  const formCoCo = FormApp.openByUrl(props.getProperty("formularioCoCoEditUrl"));
  const formCalendar = FormApp.openByUrl(props.getProperty("formularioCalendarioEditUrl"));
  const formEntrega = FormApp.openByUrl(props.getProperty("formularioEntregaEditUrl"));
  const formCobros = FormApp.openByUrl(props.getProperty("formularioCobroEditUrl"));
  //el dt2 revela si el form se envio desde contratacion, si es asi obtenemos el numero actual registrado de ese servicio y lo ponemos primero en cobro  
  const cantServicios = parseInt(dt[4]) || 1;
  const fecha = new Date(dt[3]);
  let codigoServicioActual = props.getProperty(dt[1].trim()); 
  //Logger.log(dt);
  const partes = codigoServicioActual.split('|');
  const codigoExtraido = parseInt(partes[1].trim());
  codigoServicioActual =`Serv: ${dt[1]} - Cant: ${dt[4]} - Cl: ${dt[2]} - ID | ${codigoExtraido}`;
  props.setProperty(dt[1],`${dt[1]} | ${codigoExtraido + 1}`);
  
  /** ESTE DATO AHORA HAY QUE ENVIARLO A OTRO FORMULARIO (COBROS) **/
  
  let serviciosContratados = formCobros.getItems()[0].asListItem();
  let opciones = serviciosContratados.getChoices().map(c => c.getValue());
  opciones.push(codigoServicioActual);
  serviciosContratados.setChoices(opciones.map(v => serviciosContratados.createChoice(v)));


  //luego se coloca la orden en entrega

  const itemsEntrega = formEntrega.getItems();
  serviciosContratados = itemsEntrega[0].asListItem();
  let opcionesActualesC = serviciosContratados.getChoices().map(choice => choice.getValue());
  opcionesActualesC.push(codigoServicioActual); // Agregar nuevo dato
  serviciosContratados.setChoices(opcionesActualesC.map(valor => serviciosContratados.createChoice(valor)));

  ////Ahora se verifica si se pago el total del precio para realizar el cobro inmediatamente


  if((parseInt(dt[6]) - parseInt(dt[7])) <= 0){
    enviarFormCobro(formCoCo,itemsCoCo,codigoServicioActual,dt[6],cantServicios,fecha);
  }

  ////////////por ultimo, se crea una copia del ticket en el form calendario///////////
  const calendarItems = formCalendar.getItems();
  const calendarNombreServicio = calendarItems[0].asListItem();
  const opcionesCalendar = calendarNombreServicio.getChoices();
  const nuevoTicket = calendarNombreServicio.createChoice(`Serv: ${dt[1]} - Cl: ${dt[2]} - ID | ${codigoExtraido}`);
  opcionesCalendar.push(nuevoTicket);
  calendarNombreServicio.setChoices(opcionesCalendar);
}

  


 
////////////////////////////////////////////////////////////////////////////////////////
//TRIGGER CONSTITUCION DEL SERVICIO/////////////////
////////////////////////////////////////////////////////////////////////////////////////

function tConstServicio(dt,hoja){ 
    const props = PropertiesService.getUserProperties();
    const servicio = dt[1].trim();
    if(!props.getProperty(servicio)){
      props.setProperty(servicio,`${servicio} | 1`);  
    }else{
      hoja.deleteRow(hoja.getLastRow());
      return;
      // si no hay un servicio con ese nombre, continua el flujo. Si ya existe, se da por entendido que fue un error y se elimina del registro para evitar confusiones
    }
    const formContratacionCobro = FormApp.openByUrl(props.getProperty("formularioCoCoEditUrl"))
    const formEliminarServicio = FormApp.openByUrl(props.getProperty("formularioEliminacionServicioEditUrl"))
   

    
    agregarOpcionAFormulario(servicio,"Servicio a eliminar","list",formEliminarServicio);
    agregarOpcionAFormulario(servicio,"Contrato de servicio","list",formContratacionCobro);
    
    /**ACOMODAR ESTOS INDICES(QUIZAS LO NECESITEN DESDE QUE SE SACO SECCION COBROS) */
    //////////////Inicializar servicio en PuntoEq/////////////////////////////////////
    const hojaEq = hoja.getParent().getSheetByName("Punto Eq");
    const valores = hojaEq.getRange(2, 6, hojaEq.getLastRow()).getValues().flat();
    let ultimaFilaVacia = valores.findIndex(v => v === "");
    if (ultimaFilaVacia === -1) {
      ultimaFilaVacia = valores.length;
    }
    ultimaFilaVacia = ultimaFilaVacia + 2;
    hojaEq.getRange(ultimaFilaVacia, 6,1,2).setValues([[servicio,0]]);
  }


////////////////////////////////////////////////
////TRIGGER ENTREGA DEL SERVICIO////////////////////////
/////////////////////////////////////////////////////
  function tEntregaServicio(dt,hoja){
    //dt = ["10/16/2025 17:06:16","Serv: Elserva - Cant: 9 - Cl: gutierrez - ID | 1","10/23/2025","5","KIM, CASCORRIN","No","","0.2","1"];
    //hoja = SpreadsheetApp.openById(PropertiesService.getUserProperties().getProperty("HojaResultadosID")).getSheetByName("Prestación de servicio");
    const hojaEq = hoja.getParent().getSheetByName("Punto Eq");
    const hojaSueldos = hoja.getParent().getSheetByName("Pago de Sueldos");
    const hojaStock = hoja.getParent().getSheetByName("Stock");
        
    const servicios = hojaEq.getRange(2,6,hojaEq.getLastRow()).getValues().flat();
    const nombreServicio = dt[1].match(/Serv:\s*([^-\n]+)/)[1].trim();
    const indiceServicio = servicios.indexOf(nombreServicio)+2;

   /////////////////////INSERTAR VALOR INSUMOS EN EQ //////////////////////////   

    if (dt[5] ==="Sí"){ // aca parece que deberia ser dt[6] == "Si" y como manejas el resto de insumos?
      const filaNombresElementos = hoja.getRange(1,8,1,hoja.getLastColumn()-7).getValues()[0];
      const filaValores = dt.slice(7, 7 + filaNombresElementos.length);
      const costoInsumosServicioActualizar = restarInsumosYObtenerCosto(filaNombresElementos,filaValores,hojaStock,dt[6]);
      hojaEq.getRange(indiceServicio,8).setValue(costoInsumosServicioActualizar);        
    }
     
    ////////////////////RESTA DE LA CANTIDAD DE SERVICIOS EN EL FORM ENTREGA///////////    
    const formEntrega = FormApp.openByUrl(PropertiesService.getUserProperties().getProperty("formularioEntregaEditUrl"));
    let itemsEntrega = formEntrega.getItems();
    let serviciosLista = itemsEntrega[0].asListItem(); 
    let opcionesActualesC = serviciosLista.getChoices().map(choice => choice.getValue());
    let indice = opcionesActualesC.indexOf(dt[1]);
    const match = dt[1].match(/Cant:\s*(\d+)/);
    Logger.log(match[1]);
    let cantidad = 0;
    if(match){
       cantidad = (parseInt(match[1], 10) - 1) || 1;
       Logger.log(cantidad);
      if (indice !== -1) {
        if (cantidad > 0) {
          let textoModificado = dt[1].replace(/(Cant:\s*)\d+/, `$1${cantidad}`);
          opcionesActualesC[indice] = textoModificado;
        } else {
          opcionesActualesC.splice(indice, 1);
        }
        serviciosLista.setChoices(opcionesActualesC.map(valor => serviciosLista.createChoice(valor)));
      }
    }     
    /////////////////////////AÑADIMOS NUEVO PENDIENTE A LA LISTA DE PAGO DE SUELDOS/////////
    const columnaPendientes = 6;
    const pendientesPago = hojaSueldos.getRange(2,columnaPendientes,hojaSueldos.getLastRow()).getValues().flat().filter(v => v !== "");
    const idServicio = dt[1].split("ID | ")[1];
    pendientesPago.push(`${dt[2]} | ${nombreServicio} id${idServicio}#${cantidad}`);
    const matrizPendientes = pendientesPago.map(v => [v]);
    
    hojaSueldos.getRange(2,columnaPendientes,matrizPendientes.length).setValues(matrizPendientes);
    asignarHoras(hojaSueldos,dt[3],dt[4],matrizPendientes.length+1)
  }

  function asignarHoras(hojaSueldos,horas,empleadosString,indice){
    if(empleadosString !== ""){
      const nombresEmpSueldos = hojaSueldos.getRange(1,1,1,hojaSueldos.getLastColumn()).getValues()[0];
      const nombresSinEspacios = nombresEmpSueldos.map(v => v.trim());
      const empleados = empleadosString.split(",").map(e => e.trim());
      empleados.forEach(empleado => {
        const colEmpleado = nombresSinEspacios.indexOf(empleado)+1;
        hojaSueldos.getRange(indice,colEmpleado).setValue(horas);
      })
    }
  }

  function restarInsumosYObtenerCosto(filaNombresConEspacios, filaValores,hojaStock,herramientas){
    if(herramientas !== ""){
      const stockHerr = hojaStock.getRange(2,2,hojaStock.getLastRow(),2).getValues();
      const nombresH = stockHerr.map((nombreh) => nombreh[0]);
      const herramientasArray = herramientas.split(",").map(h => h.trim());
      herramientasArray.forEach((herramienta)  =>{
        const indiceH = nombresH.indexOf(herramienta);
        if (indiceH !== -1 && stockHerr[indiceH][1] > 0) {
          stockHerr[indiceH][1]--;
        }
      });
      hojaStock.getRange(2,2,stockHerr.length,2).setValues(stockHerr);
    }
    const filaNombresElementos = filaNombresConEspacios.filter(v => v !== "");
    const stockInsumos = hojaStock.getRange(2,5,hojaStock.getLastRow(),3).getValues();
    
    const nombresInsumos = hojaStock.getRange(2,5,hojaStock.getLastRow()).getValues().flat();
    let sumaCostos = 0.0;
    for(let i= 0;i<filaValores.length;i++){
      const partes = filaNombresElementos[i].split(':');      
      const elemento = partes[1].trim();
      if(filaValores[i] !== "" && filaValores[i] !== null){
        if(filaNombresElementos[i].includes("Insumo")){
          const indiceInsumo = nombresInsumos.indexOf(elemento);
          if(indiceInsumo !== -1){
            const valorASumar = parseFloat(stockInsumos[indiceInsumo][2]) * (parseFloat(filaValores[i]) || 0);
            stockInsumos[indiceInsumo][1] -= filaValores[i];
            sumaCostos += valorASumar
          }
        }
      }
    }

    hojaStock.getRange(2,5,hojaStock.getLastRow(),3).setValues(stockInsumos);
    return sumaCostos;
  }



/////////////////////////////////////////////////////////////
//RECORRER ITEMS FORMULARIO////////////////////////
///////////////////////////////////////////////////////

function recorrer3(){
  let link = PropertiesService.getUserProperties().getProperty("formularioCoCoEditUrl");
  Logger.log(link);
  let form = FormApp.openByUrl(link);
  let items = form.getItems();
  items.forEach(function(item,indice){
    Logger.log(item.getTitle() + "  "+item.getType() +"   "+indice);
  })
}

/////////////////////////////////////////////////////////////
//IMPLEMENTAR TODOS LOS TRIGGERS////////////////////////
///////////////////////////////////////////////////////

function crearTriggers(sheet){
  ScriptApp.newTrigger("nexoTrigger")
      .forSpreadsheet(sheet)
      .onFormSubmit()
      .create();

}

////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

function nexoTrigger(e) {
  const hoja = e.range.getSheet(); 
  const nombreHoja = hoja.getName();
  const datos = e.values;
  const filaActual = e.range.getRow();

  switch (nombreHoja) {
    case "Mis servicios": //Mis servicios deberia ser(?)
      tConstServicio(datos,hoja);
      break;
    case "Clientes":
      tCliente(datos);
      break;
    case "Proveedor":
      tProveedor(datos);
      break;
    case "Empleados":
      tEmpleado(datos,hoja);
      break;
    case "Articulo":
      tArticulo(datos,hoja);
      break;
    case "Proveedor Costo fijo":
      tProveedorCF(datos);
      break;
    case "Compras":
      tCompras(datos,hoja);
      break;
    case "Contratación":
      tContratacionCobro(datos,hoja);
      break;
    case "Costos fijos":
      tCostoFijo(datos,hoja,filaActual);
      break;
    case "Prestación de servicio":
      tEntregaServicio(datos,hoja);
      break;
    case "Empleados Eliminados":
      tEliminacionEmpleado(datos);
      break;
    case "Servicios Eliminados":
      tEliminacionServicio(datos);
      break;
    case "Cobros":
      tCobro(datos,hoja);
      break;
    case "Calendarizacion":
      tCalendarizacion(datos);
      break;
    default:
      Logger.log("Formulario desconocido: " + nombreHoja);
  }

}
