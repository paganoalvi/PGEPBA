




///////////////////////////////////////////////////////////////
////AÑADIR UNA NUEVA OPCION A UN FORMULARIO /////////////////////////////////
///////////////////////////////////////////////////////////////

function agregarFinal(nuevaOpcion,botonId){
  const datosForm = seleccionDatosForm(botonId);
  agregarOpcionAFormulario(nuevaOpcion,datosForm[0],datosForm[1]);
}

function seleccionDatosForm(botonId){
  let formularioId;
  let cambiarItem;
  switch(botonId){
    case "Compras":
    formularioId = PropertiesService.getUserProperties().getProperty("formComprasEditUrl");
    cambiarItem = "Nombre del Artículo";
    break;
    case "Produccion":
    formularioId = PropertiesService.getUserProperties().getProperty("formProduccionEditUrl");
    cambiarItem = "PRODUCTO";
    break;
    case "Pedidos":
    formularioId = PropertiesService.getUserProperties().getProperty("formPedidosEditUrl");
    cambiarItem = "CLIENTE";
    break;
    case "CostoFijo":
    formularioId = PropertiesService.getUserProperties().getProperty("formCostoFijoEditUrl");
    cambiarItem = "Elija un Empleado";
    break;
  }
  return [formularioId, cambiarItem];
}

function agregarOpcionAFormulario(nuevaOpcion,fId,nombreItem) {  
  if (fId) {
    // Abrir el formulario por su URL
    let formulario = FormApp.openByUrl(fId);

    // Buscar el ListItem con el título "Nombre del producto"
    let items = formulario.getItems(FormApp.ItemType.LIST);
    let encontrado = false;

    for (let item of items) {
      let listItem = item.asListItem();
      if (listItem.getTitle() === nombreItem) {
        let opciones = listItem.getChoices().map(choice => choice.getValue());
        opciones.push(nuevaOpcion);
        opciones.sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));

        // Establecer las opciones ordenadas
        listItem.setChoiceValues(opciones);
        encontrado = true;
        break;
      }
    }
    if (!encontrado) {
      Logger.log('No se encontró el ListItem "Nombre del producto".');
      throw new Error('No se encontró el ListItem "Nombre del producto".');
    }
  } else {
    throw new Error('No se ha encontrado el ID del formulario.');
  }
}


////////////////////////////////////////////////////
//PARA ELIMINAR UNA OPCION DE UN FORM//////////////
///////////////////////////////////////////////////
function eliminarElemento(val, botonId){
  const datosForm = seleccionDatosForm(botonId);
  eliminarOpcionDeFormulario(val,datosForm[0],datosForm[1]);
}

function eliminarOpcionDeFormulario(opcionAEliminar, fId, nombreItem) {  
  if (fId) {
    // Abrir el formulario por su URL
    let formulario = FormApp.openByUrl(fId);

    // Buscar el ListItem con el título especificado
    let items = formulario.getItems(FormApp.ItemType.LIST);
    let encontrado = false;

    for (let item of items) {
      let listItem = item.asListItem();
      if (listItem.getTitle() === nombreItem) {
        let opciones = listItem.getChoices().map(choice => choice.getValue());

        // Filtrar la opción que se desea eliminar
        let nuevasOpciones = opciones.filter(opcion => opcion !== opcionAEliminar);

        if (opciones.length === nuevasOpciones.length) {
          Logger.log(`La opción "${opcionAEliminar}" no existe en el ListItem "${nombreItem}".`);
          throw new Error(`La opción "${opcionAEliminar}" no existe en el ListItem "${nombreItem}".`);
        }

        // Establecer las opciones actualizadas
        listItem.setChoiceValues(nuevasOpciones);
        encontrado = true;
        break;
      }
    }

    if (!encontrado) {
      Logger.log(`No se encontró el ListItem con el título "${nombreItem}".`);
      throw new Error(`No se encontró el ListItem con el título "${nombreItem}".`);
    }
  } else {
    throw new Error('No se ha encontrado el ID del formulario.');
  }
}
