////////////////////////////////////////////////////
// FUNCIÓN PRINCIPAL: Crear el Form ARTICULOS /////
///////////////////////////////////////////////////
function articulo (){  
    try {
      Logger.log("Iniciando creación del formulario de articulos");
 
      let formularioArticulos = FormApp.create("Artículo");
      let formularioArticulosID = formularioArticulos.getId();
      PropertiesService.getScriptProperties().setProperty("Formulario_ID", formularioArticulosID);
      let opcionesConceptoA =  ["Insumo","Herramienta","Maquinaria"];// concepto de la compra

      formularioArticulos.setDescription(
        "Este formulario permite llevar registro de los insumos, herramientas o maquinarias necesarias para la prestación de tus servicios."
      );
     
      formularioArticulos.addTextItem()
        .setTitle("Nombre del artículo") // Nombre
        .setRequired(true)
     
      formularioArticulos.addMultipleChoiceItem()
        .setTitle("Tipo") // Tipo articulo
        .setChoiceValues(opcionesConceptoA)
        .setRequired(true)
 
      formularioArticulos.addTextItem()
        .setTitle("Código interno") // Codigo interno
        .setHelpText("Ingresá el código interno de inventario del artículo, si contás con uno.");
      
      formularioArticulos.addListItem()
        .setTitle("Unidad asociada")
        .setHelpText("Seleccioná la unidad de referencia de este artículo.")
        .setRequired(true)
        .setChoiceValues(["Unidad","Kg","Litros","Metros"]);

      const formArticulosUrl = formularioArticulos.getPublishedUrl();
      Logger.log("ARTICULO: " + formArticulosUrl)
      PropertiesService.getUserProperties().setProperty("formularioArticulosUrl", formArticulosUrl);
      PropertiesService.getUserProperties().setProperty("formularioArticulosEditUrl", formularioArticulos.getEditUrl());
      //Logger.log(formularioArticulos.getEditUrl());
      //Logger.log("Formulario de articulos creado con ID: " + formularioArticulos.getId());
 
      return formularioArticulos;
 
    } catch (error) {
      console.error("Error al crear el formulario de articulos:", error.message);
      return null;
    }
}