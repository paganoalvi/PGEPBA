
function gestionarPagoSueldo(empleado,serviciosYpagos,pagoTotal,idSheet,serviciosTotales){
  const hojaSueldos = SpreadsheetApp.openById(idSheet).getSheetByName("Pago de Sueldos");
  const pendientes = hojaSueldos.getRange(2,6,hojaSueldos.getLastRow()).getValues().flat();
  const nombresEmpSueldos =  hojaSueldos.getRange(1,7,1,hojaSueldos.getLastColumn()-6).getValues()[0];
  const nombresSinEspacios = nombresEmpSueldos.map(e => e.trim())
  const indiceColValores = nombresSinEspacios.indexOf(empleado) + 7;
  const tablaDeHorasEmp = hojaSueldos.getRange(2,indiceColValores,hojaSueldos.getLastRow()).getValues().flat();
  const salida = pendientes.map((pendiente,i) => {
    const existe = serviciosYpagos.hasOwnProperty(pendiente);
    if(existe)hojaSueldos.getRange(i+2,5).setValue("#");
    return [existe ? serviciosYpagos[pendiente] : tablaDeHorasEmp[i]];
  })
  hojaSueldos.getRange(2,indiceColValores,salida.length).setValues(salida);
  
  /////////////////////registrar pago a empleado//////////////////

  const cantPagos = hojaSueldos.getRange(1,1,hojaSueldos.getLastRow()).getValues().flat();
  const pagosSinEspacios = cantPagos.filter(v => v !== "");
  hojaSueldos.getRange(pagosSinEspacios.length + 1,1,1,3).setValues([[empleado,serviciosTotales,pagoTotal]]);

  ScriptApp.newTrigger("tAcualizacionCostoUnitario")
    .timeBased()
    .after(1 * 60 * 1000) // 1 minuto después de que este script termina
    .create();
}
