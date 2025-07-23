/////////////////////////////////////////
// FUNCIÓN PRINCIPAL: Crear el Form PRODUCCION   //
////////////////////////////////////////
function produccion (){
  try {
    Logger.log("Iniciando creación del formulario de produccion");


    let formularioProduccion = FormApp.create("Produccion");
    let formularioProduccionID = formularioProduccion.getId();
    PropertiesService.getScriptProperties().setProperty("Formulario_ID", formularioProduccionID);


    formularioProduccion.setDescription(
      "Este formulario permite llevar registro de tu produccion, tanto de consumo como de productos terminados"
    );


    let preguntaInicial = formularioProduccion.addMultipleChoiceItem()
      .setTitle("Elija la categoria de produccion")
      .setRequired(true);
   
    const seccion1 = seccionConsumo(formularioProduccion).nuevaSeccion;
    const seccion2 = seccionProductosTerminados(formularioProduccion).nuevaSeccion;


    preguntaInicial.setChoices([
      preguntaInicial.createChoice("Consumo", seccion1),
      preguntaInicial.createChoice("Productos terminados", seccion2),
    ]);


    seccion1.setGoToPage(FormApp.PageNavigationType.SUBMIT);
    seccion2.setGoToPage(FormApp.PageNavigationType.SUBMIT);


    const formProduccionUrl = formularioProduccion.getPublishedUrl();
    Logger.log("Enlace a formulario: " + formProduccionUrl)
    PropertiesService.getUserProperties().setProperty("formularioProduccionUrl", formProduccionUrl);
    PropertiesService.getUserProperties().setProperty("formularioProduccionEditUrl", formularioProduccion.getEditUrl());
    Logger.log(formularioProduccion.getEditUrl());


    Logger.log("Formulario de produccion creado con ID: " + formularioProduccion.getId());


    return formularioProduccion;


  } catch (error) {
    console.error("Error al crear el formulario de produccion:", error.message);
    return null;
  }
}


/////////////////////////////////////////////////////////
// SECCIÓN CONSUMO DE MP Y MAQUINARIA/HERRAMIENTAS   ////
/////////////////////////////////////////////////////////
function seccionConsumo(formulario) {
  try {


    let nuevaSeccion = formulario.addPageBreakItem()
      .setTitle("Produccion / Consumo ")
      .setHelpText("Ingrese los detalles de consumo.");
 
    let opcionesMateriasPrimasEInsumos = [" "]; // opciones nombre de articulos materias primas
    let opcionesHerramientas = [" ",]; // opciones Herramientas / maquinas


    const TITULO_CANTIDAD = "Cantidad";
    const TITULO_HS = "Horas de uso";


    const preguntasConsumo = [
      // consumo de materias primas
      { tipo: "list", titulo: "Materia prima", opciones: opcionesMateriasPrimasEInsumos, requerido: true, textoAyuda: "Seleccione una materia prima" }, // pregunta nombre articulo
      { tipo: "text", titulo: "Cantidad", requerido: true, textoAyuda: "Ingrese cantidad de materia prima o insumo utilizado " },


      // consumo de herramientas o maquinas
      { tipo: "list", titulo: "Herramienta o Maquina", opciones: opcionesHerramientas, requerido: true, textoAyuda: "Seleccione una herramienta o maquina" }, // pregunta nombre articulo
      { tipo: "text", titulo: "Horas de uso", requerido: true, textoAyuda: "Ingrese cantidad de horas de uso" },


    ];
    preguntasConsumo.forEach(p => {
      let pregunta;
      switch (p.tipo) {
        case "list": // Menú desplegable
          pregunta = formulario.addListItem();
          if (p.opciones) {
            pregunta.setChoices(p.opciones.map(op => pregunta.createChoice(op)));
          }
          break;
        case "text":
          pregunta = formulario.addTextItem();
          // Validación para Cantidad (entero positivo)
            if (p.titulo === TITULO_CANTIDAD) {
              let val = FormApp.createTextValidation()
                .requireWholeNumber()
                .requireNumberGreaterThan(0)
                .build();
              pregunta.setValidation(val);
            }
          // Validación para Horas de uso (entero positivo)
          if (p.titulo === TITULO_HS) {
            let val = FormApp.createTextValidation()
              .requireWholeNumber()
              .requireNumberGreaterThan(0)
              .build();
            pregunta.setValidation(val);
          }
          break;
        case "date":
          pregunta = formulario.addDateItem();
          break;
        case "seleccion": // Selección única
          pregunta = formulario.addMultipleChoiceItem();
          if (p.opciones) {
            pregunta.setChoices(p.opciones.map(op => pregunta.createChoice(op)));
          }
          break;
        default:
          throw new Error(`Tipo de pregunta desconocido: ${p.tipo}`);
      }
      // Aplicar propiedades comunes
      pregunta.setTitle(p.titulo);
      if (p.textoAyuda) pregunta.setHelpText(p.textoAyuda);
      if (p.requerido) pregunta.setRequired(p.requerido);
    });


    return { nuevaSeccion };
  } catch (error) {
    console.error("Error en la sección Consumo:", error.message);
    return { nuevaSeccion: null };
  }
}


/////////////////////////////////////////////////////////
// SECCIÓN PRODUCTOS TERMINADOS   ////
/////////////////////////////////////////////////////////
function seccionProductosTerminados(formulario) {
  try {


    let nuevaSeccion = formulario.addPageBreakItem()
      .setTitle("Produccion / Productos terminados ")
      .setHelpText("Ingrese el detalle de sus productos terminados.");
 
    let opcionesProductosTerminados = [" ",]; // opciones nombre de articulos materias primas


    const  TITULO_CANTIDAD_PT = "Cantidad"
    const preguntasProductosTerminados = [
      // Producto terminados
      { tipo: "list", titulo: "Producto Terminado", opciones: opcionesProductosTerminados, requerido: true, textoAyuda: "Seleccione o agregue un producto terminado => " }, // pregunta nombre producto terminado
      { tipo: "text", titulo: "Lote", textoAyuda: "Ingrese código de lote de producto terminado, si es que posee "},
      { tipo: "text", titulo: "Cantidad", requerido: true, textoAyuda: "Ingrese cantidad de producto terminados de este lote " },
      { tipo: "text", titulo: "Descripción ", textoAyuda: "Ingrese un descripcion si es que posee" },


    ];
    preguntasProductosTerminados.forEach(p => {
      let pregunta;
      switch (p.tipo) {
        case "list": // Menú desplegable
          pregunta = formulario.addListItem();
          if (p.opciones) {
            pregunta.setChoices(p.opciones.map(op => pregunta.createChoice(op)));
          }
          break;
        case "text": // texto corto
          pregunta = formulario.addTextItem();
          //Validacion
          if (p.titulo === TITULO_CANTIDAD_PT) {
            let val = FormApp.createTextValidation()
              .requireWholeNumber()
              .requireNumberGreaterThan(0)
              .build();
            pregunta.setValidation(val);
          }
          break;
        case "date": // formato calenadario
          pregunta = formulario.addDateItem();
          break;
        case "seleccion": // Selección única
          pregunta = formulario.addMultipleChoiceItem();
          if (p.opciones) {
            pregunta.setChoices(p.opciones.map(op => pregunta.createChoice(op)));
          }
          break;
        default:
          throw new Error(`Tipo de pregunta desconocido: ${p.tipo}`);
      }
      // Aplicar propiedades comunes
      pregunta.setTitle(p.titulo);
      if (p.textoAyuda) pregunta.setHelpText(p.textoAyuda);
      if (p.requerido) pregunta.setRequired(p.requerido);
    });


    return { nuevaSeccion };
  } catch (error) {
    console.error("Error en la sección Productos terminados:", error.message);
    return { nuevaSeccion: null };
  }
}





