///////////funcion trigger articulo////////////////
function tArticulo(dt,hoja){
  //const dt = [" ","Elinsumo+Por","Insumo"]
  //const hoja = SpreadsheetApp.openById(PropertiesService.getUserProperties().getProperty("HojaResultadosID")).getActiveSheet()
  const props = PropertiesService.getUserProperties();
  var datoArt = dt[1];
  const formComp = FormApp.openByUrl(props.getProperty("formularioComprasEditUrl"));
  const formConstitucionServ = FormApp.openByUrl(props.getProperty("formularioConstitucionEditUrl"));
  const formEntrega= FormApp.openByUrl(props.getProperty("formularioEntregaEditUrl"))
  const itemsC = formComp.getItems();
  const itemsConst = formConstitucionServ.getItems();
  const itemsEntrega = formEntrega.getItems();
  const hojaStock = hoja.getParent().getSheetByName("Stock");
  let llaveArticuloConst;
  let numItemConst;
  let artCL;
  let artCC;
  let colElegida = 0;
  let posLibre;
  if(dt[2] === "Insumo"){ // si el tipo es igual a insumo, quiero agregar un checkbox en insumos
    /**agregar articulo como checkbox item */
    numItemConst = 3;
    artCC = itemsConst[numItemConst].asCheckboxItem();
    llaveArticuloConst = "insumoBlancoConst2";
    /**agregar articulo como list item */
    artCL = itemsC[3].asListItem(); // pregunta LIST insumo seccion insumos en form compras
    posLibre = parseInt(hojaStock.getRange("A2").getValue());
    colElegida = 5;
    hojaStock.getRange("A2").setValue(posLibre + 1);
  }else{ // si el tipo es herramienta o maquinaria (osea que no es insumo) quiero agregar checkbox en herramientas 
    numItemConst = 4;
    llaveArticuloConst = "herramientaBlancoConst"; 
    artCC = itemsConst[numItemConst].asCheckboxItem();
    artCL = itemsC[10].asListItem(); // pregunta LIST herramienta en seccion herramientas form compras
    posLibre = parseInt(hojaStock.getRange("A1").getValue());
    colElegida = 2;
    hojaStock.getRange("A1").setValue(posLibre + 1);

///////parte para agregar la opcion al form entrega en el chekbox de herramientas/////
    const itemHerramientasEntrega = itemsEntrega[6].asCheckboxItem();
    const opcionesActualesEntrega = itemHerramientasEntrega.getChoices();
    const nuevaOpcion = itemHerramientasEntrega.createChoice(datoArt);
    opcionesActualesEntrega.push(nuevaOpcion);
    itemHerramientasEntrega.setChoices(opcionesActualesEntrega);
  }
  hojaStock.getRange(posLibre,colElegida,1,2).setValues([[datoArt,0]]);
    
   // Corregido: llamada a asListItem()
  let opcionesActualesC = artCL.getChoices().map(choice => choice.getValue()); 
  opcionesActualesC.push(datoArt); // Agregar nuevo dato
  artCL.setChoices(opcionesActualesC.map(valor => artCL.createChoice(valor)));

  opcionesActualesC = artCC.getChoices().map(choice => choice.getValue()); // Obtener opciones actuales
  opcionesActualesC.push(datoArt); // Agregar nuevo dato
  artCC.setChoices(opcionesActualesC.map(valor => artCC.createChoice(valor)));

  if(!props.getProperty(llaveArticuloConst)){
    eliminarBlanco(formConstitucionServ,numItemConst);
    props.setProperty(llaveArticuloConst,true);
  }


  if(dt[2] === "Insumo"){
    const nuevoElemento = formEntrega.addTextItem();
    nuevoElemento.setTitle(`Insumo: ${dt[1]} `);
    nuevoElemento.setHelpText(`Unidad: ${dt[4]} `)
    const itemsCoCo = formEntrega.getItems();
    let val = FormApp.createTextValidation()
                .requireWholeNumber()
                .requireNumberGreaterThanOrEqualTo(0)
                .build();
              nuevoElemento.setValidation(val);
    if((itemsCoCo.length-1) >= 5){
      for(let i= 7;i <(itemsCoCo.length-1);i++){
        const item = itemsCoCo[i].asTextItem();
        if(item.getTitle().localeCompare(dt[1]) > 0){
          formEntrega.moveItem(itemsCoCo[itemsCoCo.length-1],i);
          break;
        }
      }
    }
  }
  
}



function tEmpleado(dt,hoja) {
  const props = PropertiesService.getUserProperties();
  // //const dt = ["","lalo"];
  // const hoja = SpreadsheetApp.openById(props.getProperty("HojaResultadosID")).getActiveSheet();
  const datoEmpleado = dt[1];
  
  const formEntrega = FormApp.openByUrl(PropertiesService.getUserProperties().getProperty("formularioEntregaEditUrl"));
  const formCoCo = FormApp.openByUrl(PropertiesService.getUserProperties().getProperty("formularioCoCoEditUrl"));
  const formEliminarEmp = FormApp.openByUrl(PropertiesService.getUserProperties().getProperty("formularioEliminacionEmpleadoEditUrl"));
  const hojaSueldos = hoja.getParent().getSheetByName("Pago de Sueldos"); 
  agregarOpcionAFormulario(datoEmpleado, "Empleados pre-asignados al servicio", "checkBox", formCoCo);
  agregarOpcionAFormulario(datoEmpleado, "Empleados que realizaron el servicio", "checkBox", formEntrega);
  agregarOpcionAFormulario(datoEmpleado, "Empleado a eliminar", "list", formEliminarEmp);
  if(!props.getProperty("empleadoBlanco2")){
    eliminarBlanco(formCoCo,7);
    eliminarBlanco(formEntrega,3);
    props.setProperty("empleadoBlanco2",true);
  }
  
  hojaSueldos.getRange(1, hojaSueldos.getLastColumn() + 1).setValue(datoEmpleado);
}

///////////funcion trigger CLIENTE////////////////
function tCliente(dt){
  var datoCliente = dt[2];
  let formCoCoFijos = FormApp.openByUrl(PropertiesService.getUserProperties().getProperty("formularioCoCoEditUrl"));
  let itemsC = formCoCoFijos.getItems();
  let preguntaCliente = itemsC[1].asListItem(); 
  let opcionesActualesC = preguntaCliente.getChoices().map(choice => choice.getValue()); // Obtener opciones actuales
  opcionesActualesC.push(datoCliente); // Agregar nuevo dato
  preguntaCliente.setChoices(opcionesActualesC.map(valor => preguntaCliente.createChoice(valor)));
}


///////////funcion trigger Proveedor////////////////

function tProveedor(dt){
  const datoProveedor = dt[3] // obtienemos NOMBRE  PROVEEDOR // dt viene de sheetss
  const formComp = FormApp.openByUrl(PropertiesService.getUserProperties().getProperty("formularioComprasEditUrl"));
  const itemsC = formComp.getItems();
  const preguntaProveedor = itemsC[indicePreguntaProveedor].asListItem(); // Corregido: llamada a asListItem()
  const preguntaProveedor2 = itemsC[indicePreguntaProveedorServ].asListItem();

  let opcionesActualesC = preguntaProveedor.getChoices().map(choice => choice.getValue()); // Obtener opciones actuales
  opcionesActualesC.push(datoProveedor); // Agregar nuevo dato 
  preguntaProveedor.setChoices(opcionesActualesC.map(valor => preguntaProveedor.createChoice(valor)));

  let opcionesActualesA = preguntaProveedor2.getChoices().map(choice => choice.getValue()); // Obtener opciones actuales
  opcionesActualesA.push(datoProveedor); // Agregar nuevo dato 
  preguntaProveedor2.setChoices(opcionesActualesA.map(valor => preguntaProveedor2.createChoice(valor)));
}

///////////funcion trigger Proveedor Costo Fijo////////////////

function tProveedorCF(dt){
  const datoProveedorCF = dt[2] // obtienemos NOMBRE  PROVEEDOR
  let formComp = FormApp.openByUrl(PropertiesService.getUserProperties().getProperty("formularioCostosFijosEditUrl"));
  let itemsC = formComp.getItems();
  let preguntaProveedorCF = itemsC[indicePreguntaProveedorCF].asListItem(); // Corregido: llamada a asListItem()
  let opcionesActualesC = preguntaProveedorCF.getChoices().map(choice => choice.getValue()); // Obtener opciones actuales
  opcionesActualesC.push(datoProveedorCF); // Agregar nuevo dato
  preguntaProveedorCF.setChoices(opcionesActualesC.map(valor => preguntaProveedorCF.createChoice(valor)));
}

  /////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////CALENDARIZACIÓN///////////////////////////
  /////////////////////////////////////////////////////////////////////////////////

function tCalendarizacion(dt){
  let nombreEvento;
  if(dt[3]) nombreEvento = dt[3];
  else nombreEvento = dt[1];
  const calendarioApp = CalendarApp.getDefaultCalendar();
  
  const fechas = dt.slice(4);
    fechas.forEach((fecha) =>{
      Logger.log(fecha);
      if(fecha){
        const nuevaFecha = new Date(fecha);
        calendarioApp.createAllDayEvent(nombreEvento,nuevaFecha);
      }

    })

  if(dt[2] === "Si"){
    const formCalendar = FormApp.openByUrl(PropertiesService.getUserProperties().getProperty("formularioCalendarioEditUrl"));
    const formCalendarItems = formCalendar.getItems();
    const item = formCalendarItems[0].asListItem();
    const opciones = item.getChoices();
    opciones = opciones.filter(choice => choice.getValue() !== dt[1]);
    item.setChoices(opciones);
  }
}
