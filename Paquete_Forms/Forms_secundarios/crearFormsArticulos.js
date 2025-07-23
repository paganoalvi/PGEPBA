////////////////////////////////////////////////////
// FUNCIÓN PRINCIPAL: Crear el Form ARTICULOS /////
///////////////////////////////////////////////////
function articulo (){
    try {
      Logger.log("Iniciando creación del formulario de articulos");
 
      let formularioArticulos = FormApp.create("Articulo");
      let formularioArticulosID = formularioArticulos.getId();
      PropertiesService.getScriptProperties().setProperty("Formulario_ID", formularioArticulosID);
      let opcionesConceptoA = ["Materia prima", "Herramienta" , "Servicio"];// concepto de la compra




      formularioArticulos.setDescription(
        "Este formulario permite llevar registro de los artículos comprados por tu emprendimiento"
      );

      let imageItem = formularioArticulos.addImageItem();
      imageItem.setTitle("Título de la imagen");
      imageItem.setHelpText("Texto descriptivo");
      imageItem.setImage(UrlFetchApp.fetch("https://example.com/imagen.jpg").getBlob());


      formularioArticulos.addTextItem()
        .setTitle("Nombre artículo")
        .setRequired(true)
        .setHelpText("Ingrese el nombre de Materia Prima / Herramienta / Servicio");
     
      formularioArticulos.addMultipleChoiceItem()
        .setTitle("Tipo de artículo")
        .setChoiceValues(opcionesConceptoA)
        .setRequired(true)
 
      formularioArticulos.addTextItem()
        .setTitle("Codigo interno")
        .setHelpText("Ingrese un codigo identificador para el artículo (si posee)");


      const formArticulosUrl = formularioArticulos.getPublishedUrl();
      Logger.log("Enlace a formulario: " + formArticulosUrl)
      PropertiesService.getUserProperties().setProperty("formularioArticulosUrl", formArticulosUrl);
      PropertiesService.getUserProperties().setProperty("formularioArticulosEditUrl", formularioArticulos.getEditUrl());
      Logger.log(formularioArticulos.getEditUrl());
      Logger.log("Formulario de articulos creado con ID: " + formularioArticulos.getId());
 
      return formularioArticulos;
 
    } catch (error) {
      console.error("Error al crear el formulario de articulos:", error.message);
      return null;
    }
  }

