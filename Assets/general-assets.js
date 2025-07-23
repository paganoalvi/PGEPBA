





///////////////////////////////////////////////////
//PARA LA LISTA DESPLEGABLE DE LOS FORMS////////
/////////////////////////////////////////////////

function obtenerItemsFormulario(bAddId) {
    const datosForm = seleccionDatosForm(bAddId); 
    var form = FormApp.openByUrl(datosForm[0]);
    var items = form.getItems(FormApp.ItemType.LIST); // Obtener todas las listas desplegables del formulario

    for (var i = 0; i < items.length; i++) {
        var lista = items[i].asListItem();
        if (lista.getTitle() === datosForm[1]) { 
            return lista.getChoices().map(choice => choice.getValue()); 
        }
    }
    return []; 
}





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


/////////////////////////////////////////////////////////////
//RECORRER ITEMS FORMULARIO////////////////////////
///////////////////////////////////////////////////////

function recorrer1(){
  let link = PropertiesService.getUserProperties().getProperty("formularioCostosFijosEditUrl");
  Logger.log(link);
  let form = FormApp.openByUrl(link);
  let items = form.getItems();
  items.forEach(function(item,indice){
    Logger.log(item.getTitle() + "  "+item.getType() +"   "+indice);
  })
}


