
///////////////////////////////////////////////////////////////
////LIMPIAR PROPIEDADES Y TRIGGERS/////////////////////////////
///////////////////////////////////////////////////////////////
function limpiezaGeneral(){
  limpiarProperties();
  limpiarTriggers();
}

function limpiarProperties(){
  PropertiesService.getUserProperties().deleteAllProperties();
}
function limpiarTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  for (let i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);  
  }
}


/////////////////////////////////////////////////////////////
//MOSTRAR PROPERTIES////////////////////////
///////////////////////////////////////////////////////
function mostrarTodasLasPropiedades() {
  // Puedes cambiar esto a .getScriptProperties() o .getUserProperties() si lo necesitas
  var properties = PropertiesService.getUserProperties(); 
  var allProps = properties.getProperties();
  
  Logger.log("Propiedades encontradas:");
  for (var clave in allProps) {
    Logger.log(clave + ": " + allProps[clave]);
  }
}

function cambioMes(hojaEq,mes,year){
  const sDestino = SpreadsheetApp.openById(PropertiesService.getUserProperties().getProperty("HojaResultadosHistorico"));
  const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  hojaEq.copyTo(sDestino).setName(meses[mes-1]+year);
  MailApp.sendEmail({
    to: Session.getActiveUser().getEmail(),
    subject: "Actualizacion en hoja de punto de equilibrio",
    body: `Ya puede ver los resultados del ultimo mes en la hoja de Cuentas Mensuales:
    ${sDestino.getUrl()}`
  });
}

function pruebaProtectedHojas(){
  const props = PropertiesService.getUserProperties();
  const sheet = SpreadsheetApp.openByUrl(props.getProperty("HojaResultados"))
  const hoja = sheet.getSheetByName("Punto Eq");
  const protections = hoja.getProtections(SpreadsheetApp.ProtectionType.SHEET);
  const rango = hoja.getRange("Q2:Q100");

  // Quitamos protecciones previas en ese rango para evitar duplicados
  hoja.getProtections(SpreadsheetApp.ProtectionType.RANGE)
       .forEach(p => {
         if (p.getRange().getA1Notation() === rango.getA1Notation()) p.remove();
       });

  // Creamos la protección pero solo con aviso
  const protection = rango.protect().setDescription("Aviso: No modifiques esta celda");
  protection.setWarningOnly(true);
}

function validacionNumeroEnteroMayorACero(preguntaTexto){
  const validacion = FormApp.createTextValidation()
    .requireNumber()
    .requireNumberGreaterThan(0)
    .build();
  
  return preguntaTexto.setValidation(validacion);
}