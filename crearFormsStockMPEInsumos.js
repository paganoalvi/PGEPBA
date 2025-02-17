function crearFormStockMPeInsu() {
    let formMPeInsu;
  
    try {
      // Crear el formulario
      formMPeInsu = FormApp.create("Stock materias primas e insumos");
      formMPeInsu.setDescription("Complete los detalles de cada insumo y materia prima.");
    } catch (error) {
      console.error("Error al crear el formulario Stock materias primas e insumos: ", error.message);
      return null; // Devolver null si falla la creación del formulario
    }
  
    try {
      // Sección 1: Materias Primas
      formMPeInsu.addPageBreakItem()
        .setTitle("Materias Primas")
        .setHelpText("Por favor, complete los detalles de las materias primas.");
  
      for (let i = 1; i <= 5; i++) {
        try {
          formMPeInsu.addTextItem()
            .setTitle(`Materia prima ${i}`);
        } catch (error) {
          console.error(`Error al agregar la pregunta Materia prima ${i}: `, error.message);
        }
      }
    } catch (error) {
      console.error("Error al crear la sección Materias Primas: ", error.message);
    }
  
    try {
      // Sección 2: Insumos
      formMPeInsu.addPageBreakItem()
        .setTitle("Insumos")
        .setHelpText("Por favor, complete los detalles de los insumos.");
  
      for (let i = 1; i <= 5; i++) {
        try {
          formMPeInsu.addTextItem()
            .setTitle(`Insumo ${i}`);
        } catch (error) {
          console.error(`Error al agregar la pregunta Insumo ${i}: `, error.message);
        }
      }
    } catch (error) {
      console.error("Error al crear la sección Insumos: ", error.message);
    }
  
    //GUARDAR URL EN LAS PROPIEDADES PARA USARLAS MAS ADELANTE
    const formInsumosUrl = formMPeInsu.getPublishedUrl();
    PropertiesService.getUserProperties().setProperty("formularioInsumosURL",formInsumosUrl);
    PropertiesService.getUserProperties().setProperty("formInsumosEditUrl",formMPeInsu.getEditUrl());
    
    Logger.log("mostrar url published original"+formInsumosUrl)
    return formMPeInsu;
  }
  
  function pruebaErrorFormStockMPeInsu() {
    let formulario = crearFormStockMPeInsu();
    PropertiesService.getUserProperties().setProperty("formularioInsumosURL",formulario.getEditUrl());
    if (!formulario) {
      console.error("No se pudo crear el formulario Stock materias primas e insumos.");
    } else {
      console.log("Formulario creado exitosamente:", formulario.getEditUrl());
    }
  }
  
  
  
  