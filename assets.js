///////////////////////////////////////
// FUNCIÓN: crearSeccion // Se modulariza el creado de seccion ya que se repite 2 veces
///////////////////////////////////////
function crearSeccion(formulario, titulo, textoAyuda, preguntas) {
    let nuevaSeccion = formulario.addPageBreakItem()
      .setTitle(titulo)
      .setHelpText(textoAyuda);
  
    preguntas.forEach(p => {
      if (p.tipo === 'list') {
        formulario.addListItem()
          .setTitle(p.titulo)
          .setChoiceValues(p.opciones)
          .setRequired(p.requerido);
      } else if (p.tipo === 'text') {
        formulario.addTextItem()
          .setTitle(p.titulo)
          .setRequired(p.requerido);
      }
    });
  
    return nuevaSeccion; // Asegúrate de retornar nuevaSeccion correctamente
  }
  
  ///////////////////////////////////////////////////////////////
  ////AGREGAR PRODUCTO AL FORM//////////////////////////////////
  ///////////////////////////////////////////////////////////////
  
  function agregarOpcionProducto(nuevaOpcion) {  
    try {
      let formularioId = PropertiesService.getScriptProperties().getProperty("FORMULARIO_ID");
  
      if (formularioId) {
        // Abrir el formulario por su ID
        let formulario = FormApp.openById(formularioId);
  
        // Buscar el ListItem con el título "Nombre del producto"
        let items = formulario.getItems(FormApp.ItemType.LIST);
        let encontrado = false;
  
        for (let item of items) {
          let listItem = item.asListItem();
          if (listItem.getTitle() === 'Nombre del producto') {
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
          console.error('No se encontró el ListItem "Nombre del producto".');
          throw new Error('No se encontró el ListItem "Nombre del producto".');
        }
      } else {
        throw new Error('No se ha encontrado el ID del formulario.');
      }
  
    } catch (error) {
      console.error("Error al agregar opción al producto:", error.message);
    }
  
    return nuevaSeccion;
  }
  
  ///////////////////////////////////////////////////////////////
  ////LIMPIAR PROPIEDADES /////////////////////////////////
  ///////////////////////////////////////////////////////////////
  function limpiar(){
    PropertiesService.getUserProperties().deleteAllProperties();
  }
  
  ///////////////////////////////////////////////////////////////
  ////AÑADIR UNA NUEVA OPCION A UN FORMULARIO /////////////////////////////////
  ///////////////////////////////////////////////////////////////
  function agregarFinal(nuevaOpcion,botonId){
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
    agregarOpcionAFormulario(nuevaOpcion,formularioId,cambiarItem);
  }
  
  function agregarOpcionAFormulario(nuevaOpcion,fId,nombreItem) {  
    if (fId) {
      // Abrir el formulario por su ID
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
  
  
  
  
  
  
  