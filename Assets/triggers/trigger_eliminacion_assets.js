function tEliminacionEmpleado(dt) {
  const props = PropertiesService.getUserProperties();
  const formCoCo= FormApp.openByUrl(props.getProperty("formularioCoCoEditUrl"));
  const formEntrega= FormApp.openByUrl(props.getProperty("formularioEntregaEditUrl"));
  const formEliEmpleado= FormApp.openByUrl(props.getProperty("formularioEliminacionEmpleadoEditUrl"));
  const sheet = SpreadsheetApp.openById(props.getProperty("HojaResultadosID"))
  const hojaEmp = sheet.getSheetByName("Empleados");
  const hojaSueldos = sheet.getSheetByName("Pago de Sueldos");

  eliminarUnaColumna(hojaSueldos,1,dt[1]);
  eliminarOpcionDeFormulario(dt[1],formEliEmpleado,0,"list");
  eliminarOpcionDeFormulario(dt[1],formCoCo,7,"checkBox");
  eliminarOpcionDeFormulario(dt[1],formEntrega,3,"checkBox");
  eliminarUnaFila(hojaEmp,2,2,1,10,dt[1]);

}

function tEliminacionServicio(dt) {
  // const dt = ["","p2"]
  const props = PropertiesService.getUserProperties();
  const formCoCo= FormApp.openByUrl(props.getProperty("formularioCoCoEditUrl"));
  const formElimServicio= FormApp.openByUrl(props.getProperty("formularioEliminacionServicioEditUrl"));
  const sheet = SpreadsheetApp.openById(props.getProperty("HojaResultadosID"))
  const hojaEq = sheet.getSheetByName("Punto Eq");
  eliminarUnaFila(hojaEq,6,2,6,6,dt[1]);
  eliminarOpcionDeFormulario(dt[1],formCoCo,0,"list");
  eliminarOpcionDeFormulario(dt[1],formElimServicio,0,"list");
}



function eliminarUnaFila(hoja,colReferencia,filaInicial,colInicial,cantColumnas,nombreEliminar){
  const colCompletaReferencia = hoja.getRange(filaInicial,colReferencia,hoja.getLastRow()).getValues().flat();
  const indice = colCompletaReferencia.indexOf(nombreEliminar);
  if(indice !== -1){
    const bloque = hoja.getRange(filaInicial,colInicial,hoja.getLastRow(),cantColumnas).getValues();
    bloque.splice(indice,1);
    hoja.getRange(filaInicial,colInicial,hoja.getLastRow(),cantColumnas).clearContent()
    hoja.getRange(filaInicial,colInicial,bloque.length,cantColumnas).setValues(bloque);
  }
}

function eliminarUnaColumna(hoja,filaInicial,nombreEliminar){
  const filaReferencia = hoja.getRange(filaInicial,1,1,hoja.getLastColumn()).getValues()[0];
  const indice = filaReferencia.indexOf(nombreEliminar);
  if(indice !== -1){
    hoja.deleteColumn(indice + 1);
  }
}
