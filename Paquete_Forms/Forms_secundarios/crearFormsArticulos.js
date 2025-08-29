////////////////////////////////////////////////////
// FUNCIÓN PRINCIPAL: Crear el Form ARTICULOS /////
///////////////////////////////////////////////////
function articulo (){  
    try {
      Logger.log("Iniciando creación del formulario de articulos");
 
      let formularioArticulos = FormApp.create("Herramientas o Maquinaria");
      let formularioArticulosID = formularioArticulos.getId();
      PropertiesService.getScriptProperties().setProperty("Formulario_ID", formularioArticulosID);
      let opcionesConceptoA =  ["Herramienta" ,"Maquinaria","Otro"];// concepto de la compra

      formularioArticulos.setDescription(
        "Este formulario permite llevar registro de las herramientas o maquinaria comprados por tu emprendimiento"
      );
     
      formularioArticulos.addTextItem()
        .setTitle("Nombre Herramienta o Maquinaria") // Nombre
        .setRequired(true)
        .setHelpText("Ingrese el nombre del articulo");
     
      formularioArticulos.addMultipleChoiceItem()
        .setTitle("Tipo") // Tipo articulo
        .setChoiceValues(opcionesConceptoA)
        .setRequired(true)
 
      formularioArticulos.addTextItem()
        .setTitle("Codigo interno") // Codigo interno
        .setHelpText("Si es que posee");

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
