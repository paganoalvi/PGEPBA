/////////////////////////////////////////////
// SECCIÓN "Insumos o materias primas"     //
/////////////////////////////////////////////
function seccionInsumosOMateriasPrimas(formulario) {
    try {
      let nuevaSeccion = formulario.addPageBreakItem()
        .setTitle('Compra de insumos o materias primas')
        .setHelpText('Por favor, ingrese los detalles de la compra.');
  
      let opcionesArticulos = ['Articulo 1', 'Articulo 2', 'Articulo 3'];
      const preguntas = [
        { tipo: 'list', titulo: 'Nombre del Artículo', opciones: opcionesArticulos, requerido: true },
        { tipo: 'text', titulo: 'Unidad', requerido: true },
        { tipo: 'text', titulo: 'Cantidad de unidades', requerido: true },
        { tipo: 'text', titulo: 'Precio por unidad', requerido: true },
      ];
  
      // Crear preguntas
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
  
      return { nuevaSeccion };
  
    } catch (error) {
      console.error("Error en la sección de compra de insumos y materias primas:", error.message);
      return { nuevaSeccion: null };
    }
  }
  
  /////////////////////////////////////////////
  // SECCIÓN "Servicio"                      //
  /////////////////////////////////////////////
  function seccionServicio(formulario) {
    try {
      let nuevaSeccion = formulario.addPageBreakItem()
        .setTitle('Compra de servicio')
        .setHelpText('Por favor, ingrese los detalles del servicio.');
  
      const preguntas = [
        { titulo: 'Tipo de servicio prestado', requerido: true },
        { titulo: 'Costo del servicio', requerido: true },
      ];
  
      // Crear preguntas
      preguntas.forEach(p => {
        formulario.addTextItem()
          .setTitle(p.titulo)
          .setRequired(p.requerido);
      });
  
      return { nuevaSeccion };
  
    } catch (error) {
      console.error("Error en la sección de compra de servicio:", error.message);
      return { nuevaSeccion: null };
    }
  }
  //////////////////////////////////////////////////////
  // SECCIÓN "Financiamiento o inversión"            //
  //////////////////////////////////////////////////////
  function seccionFinanciamientoOInversion(formulario) {
    try {
      let nuevaSeccion = formulario.addPageBreakItem()
        .setTitle('Financiamiento o inversión')
        .setHelpText('Por favor, ingrese los detalles del financiamiento o la inversión.');
  
      const preguntas = [
        { titulo: 'Concepto del financiamiento o inversión', requerido: true },
        { titulo: 'Monto del financiamiento o inversión', requerido: true },
      ];
  
      // Crear preguntas
      preguntas.forEach(p => {
        formulario.addTextItem()
          .setTitle(p.titulo)
          .setRequired(p.requerido);
      });
  
      return { nuevaSeccion };
  
    } catch (error) {
      console.error("Error en la sección de financiamiento o inversión:", error.message);
      return { nuevaSeccion: null };
    }
  }
  
  /////////////////////////////////////////
  // FUNCIÓN PRINCIPAL: Crear el Form    //
  /////////////////////////////////////////
  function crearFormCompras() {
    try {
      Logger.log("Iniciando la creación del formulario 'Compras'");
  
      // Crear formulario y configurar propiedades iniciales
      let formularioCompras = FormApp.create("Compras");
      let formularioComprasId = formularioCompras.getId();
      PropertiesService.getScriptProperties().setProperty("FORMULARIO_ID", formularioComprasId);
  
      formularioCompras.setDescription(
        "Este formulario permite registrar ingresos relacionados con egresos de dinero que no constituyen un gasto fijo para tu emprendimiento"
      );
  
      // Crear pregunta inicial
      let preguntaInicial = formularioCompras.addMultipleChoiceItem()
        .setTitle('CONCEPTO')
        .setHelpText('Si lo necesitas puedes agregar o eliminar conceptos haciendo clic en las opciones disponibles.')
        .setRequired(true);
  
      // Crear pregunta de proveedor
      formularioCompras.addListItem()
        .setTitle("PROVEEDOR")
        .setHelpText('Agrega todos los proveedores con los que trabaja tu emprendimiento.')
        .setChoiceValues(["Proveedor 1", "Proveedor 2", "Proveedor 3", "Proveedor 4", "Proveedor 5"]);
  
      // Crear secciones
      const seccion1 = seccionInsumosOMateriasPrimas(formularioCompras).nuevaSeccion;
      const seccion2 = seccionServicio(formularioCompras).nuevaSeccion;
      const seccion3 = seccionFinanciamientoOInversion(formularioCompras).nuevaSeccion;
  
      // Configurar navegación de la pregunta inicial
      preguntaInicial.setChoices([
        preguntaInicial.createChoice('Insumos o materias primas', seccion1),
        preguntaInicial.createChoice('Pago de servicio', seccion2),
        preguntaInicial.createChoice('Financiamiento o inversión', seccion3),
      ]);
  
      // Configurar navegación final de cada sección
      seccion1.setGoToPage(FormApp.PageNavigationType.SUBMIT);
      seccion2.setGoToPage(FormApp.PageNavigationType.SUBMIT);
      seccion3.setGoToPage(FormApp.PageNavigationType.SUBMIT);
  
      // Guardar URL del formulario
      const formComprasUrl = formularioCompras.getPublishedUrl();
      PropertiesService.getUserProperties().setProperty("formularioComprasURL", formComprasUrl);
      PropertiesService.getUserProperties().setProperty("formComprasEditUrl",formularioCompras.getEditUrl());
      Logger.log(formularioCompras.getEditUrl());
  
      Logger.log("Formulario 'Compras' creado con ID: " + formularioCompras.getId());
      return formularioCompras;
  
    } catch (error) {
      console.error("Error al crear el formulario de compras:", error.message);
      return null;
    }
  }
  
  
  
  
  
  