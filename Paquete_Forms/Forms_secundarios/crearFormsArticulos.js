////////////////////////////////////////////////////
// FUNCIÓN PRINCIPAL: Crear el Form ARTICULOS /////
///////////////////////////////////////////////////
function articulo (){  
    try {
      Logger.log("Iniciando creación del formulario de articulos");
 
      let formularioArticulos = FormApp.create("Articulo");
      let formularioArticulosID = formularioArticulos.getId();
      PropertiesService.getScriptProperties().setProperty("Formulario_ID", formularioArticulosID);
      let opcionesConceptoA =  ["Herramienta" ,"Maquinaria","Servicio"];// concepto de la compra

      formularioArticulos.setDescription(
        "Este formulario permite llevar registro de los artículos comprados por tu emprendimiento,aquellos que no son materias primas o insumos"
      );
     
      formularioArticulos.addTextItem()
        .setTitle("Nombre artículo") // Nombre
        .setRequired(true)
        .setHelpText("Ingrese el nombre del articulo");
     
      formularioArticulos.addMultipleChoiceItem()
        .setTitle("Tipo de artículo") // Tipo articulo
        .setChoiceValues(opcionesConceptoA)
        .setRequired(true)
 
      formularioArticulos.addTextItem()
        .setTitle("Codigo interno") // Codigo interno
        .setHelpText("Si es que posee");

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

