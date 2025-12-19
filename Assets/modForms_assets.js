
function agregarOpcionAFormulario(nuevaOpcion, tituloItem, tipoItem, formulario) {
  /*const nuevaOpcion = "Limpiezaaaa" ;
  const tituloItem = "Servicio a eliminar";
  const tipoItem = "list";
  const formulario = FormApp.openByUrl(PropertiesService.getUserProperties().getProperty("formularioEliminacionServicioEditUrl"));*/
  const items = formulario.getItems();
  const itemElegido = items.find(i => i.getTitle() === tituloItem);
  if (!itemElegido) {
    Logger.log(`No se encontró el ítem con título: ${tituloItem}`);
    return;
  }

  let itemObj;
  switch (tipoItem) {
    case "list":
      itemObj = itemElegido.asListItem();
      break;
    case "checkBox":
      itemObj = itemElegido.asCheckboxItem();
      break;
    default:
      Logger.log("Tipo de ítem inválido");
      return;
  }

  const opcionesActuales = itemObj.getChoices().map(c => c.getValue());
  if (!opcionesActuales.includes(nuevaOpcion)) {
    opcionesActuales.push(nuevaOpcion);
    itemObj.setChoices(opcionesActuales.map(v => itemObj.createChoice(v)));
  }
}

////////////////////////////////////////////////////
//PARA ELIMINAR UNA OPCION DE UN FORM//////////////
///////////////////////////////////////////////////


function eliminarOpcionDeFormulario(opcionAEliminar, formulario, numItem,tipoItem) {        
    let items = formulario.getItems();
    let itemElegido;
    switch(tipoItem){
      case "list":
        itemElegido= items[numItem].asListItem();
        break;
      case "checkBox":
        itemElegido= items[numItem].asCheckboxItem();
        break;
      default:
        Logger.log("que carajo pasaste, eso no existe");
        return;
    }
    let opciones = itemElegido.getChoices().map(choice => choice.getValue());
    let nuevasOpciones = opciones.filter(opcion => opcion !== opcionAEliminar);  
    itemElegido.setChoiceValues(nuevasOpciones);
}

function eliminarBlanco(form, numItem){
  const items = form.getItems();
  const itemBlanco = items[numItem].asCheckboxItem();
  let opciones = itemBlanco.getChoices().map(choice => choice.getValue());
  let nuevasOpciones = opciones.filter(opcion => opcion !== "");
  itemBlanco.setChoiceValues(nuevasOpciones);
}
