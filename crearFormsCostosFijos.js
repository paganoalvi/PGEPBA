///////////////////////////////////////
// FUNCIÓN PRINCIPAL: Crear el Form //
///////////////////////////////////////
function crearFormCostosFijos() {
    try {
      Logger.log("Iniciando la creación del formulario 'Costos Fijos'");
      let formularioCostos = FormApp.create("Costos fijos");
      let formularioCostosId = formularioCostos.getId();
      PropertiesService.getScriptProperties().setProperty("FORMULARIO_ID", formularioCostosId);
  
      formularioCostos.setDescription("Este formulario permite registrar ingresos relacionados con la compra de productos o el pago de servicios. Al finalizar, selecciona 'Guardar' para enviar tus respuestas al apartado de resultados.");
  
      // Pregunta inicial
      let preguntaInicial = formularioCostos.addMultipleChoiceItem()
        .setTitle('CONCEPTO')
        .setHelpText('Si lo necesitas puedes agregar algún concepto que sea un costo fijo para tu emprendimiento haciendo click debajo de pago de sueldo, como así también puedes eliminar algún concepto haciendo click en la cruz a la derecha')
        .setRequired(true);
      
      // Crear secciones
      let seccionCompraProductos = seccionCompraP(formularioCostos).nuevaSeccion;
      let seccionPagoServicios = seccionPagoServ(formularioCostos).nuevaSeccion;
      let seccionPagoSueldos = seccionPagoSueld(formularioCostos).nuevaSeccion;
  
      // Opciones de navegación
      preguntaInicial.setChoices([
        preguntaInicial.createChoice('Compra de Producto', seccionCompraProductos),
        preguntaInicial.createChoice('Pago de Servicio', seccionPagoServicios),
        preguntaInicial.createChoice('Pago de Sueldo', seccionPagoSueldos)
      ]);
  
      // Configurar navegación final
      seccionCompraProductos.setGoToPage(FormApp.PageNavigationType.SUBMIT);
      seccionPagoServicios.setGoToPage(FormApp.PageNavigationType.SUBMIT);
      seccionPagoSueldos.setGoToPage(FormApp.PageNavigationType.SUBMIT);
  
      //GUARDAR URL PARA USARLO MAS ADELANTE
      const formCostoFijoUrl = formularioCostos.getPublishedUrl();
      PropertiesService.getUserProperties().setProperty("formCostoFijoUrl", formCostoFijoUrl);
      PropertiesService.getUserProperties().setProperty("formCostoFijoEditUrl",formularioCostos.getEditUrl());
      Logger.log("Formulario 'Costos Fijos' creado con ID: " + formularioCostos.getId());
      return formularioCostos;
  
    } catch (error) {
      console.error("Error al crear el formulario de costos fijos:", error.message);
      return null;
    }
  }
  /////////////////////////////////
  // SECCIÓN "COMPRA DE PRODUCTOS"//
  /////////////////////////////////
  function seccionCompraP(formulario) {
    try {
      let nuevaSeccion = formulario.addPageBreakItem()
        .setTitle('Compra de Producto')
        .setHelpText('Por favor, ingrese los detalles de la compra.');
  
      let opcionesProductos = ['Producto 1','Producto 2','Producto 3'];
      const preguntas = [
        { tipo: 'list', titulo: 'Nombre del producto', opciones: opcionesProductos, requerido: true },
        { tipo: 'text', titulo: 'Cantidad de unidades', requerido: true },
        { tipo: 'text', titulo: 'Precio por unidad', requerido: true }
      ];
  
      //creacion de preguntas agrupadas por si son 'list' o 'text'
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
      console.error("Error en la sección de compra de productos:", error.message);
      return { nuevaSeccion: null };
    }
  }
  
  ////////////////////////////////////////////////////////
  // SECCIÓN "PAGO DE SERVICIOS"//////////////////////////
  ////////////////////////////////////////////////////////
  function seccionPagoServ(formulario) {
    try {
      let nuevaSeccion = formulario.addPageBreakItem()
        .setTitle('Pago de Servicio')
        .setHelpText('Por favor, elige un servicio e ingresa el monto pagado.');
  
      formulario.addListItem()
        .setTitle('Elija un Servicio')
        .setHelpText('Agrega los servicios que constituyen un costo fijo para tu emprendimiento')
        .setRequired(true)
        .setChoiceValues(['Luz', 'Agua', 'Internet', 'Mantenimiento', 'Gas']);
  
      formulario.addTextItem()
        .setTitle('Monto abonado')
        .setRequired(true);
  
      return { nuevaSeccion };
  
    } catch (error) {
      console.error("Error en la sección de pago de servicios:", error.message);
      return { nuevaSeccion: null }; // Retornar null si ocurre un error
    }
  }
  
  /////////////////////////////////
  // SECCIÓN "PAGO DE SUELDOS"/////
  /////////////////////////////////
  // creo formulario usando el nuevo metodo crearSeccion(buscado reducir los tiempo de ejecucion de crearPaquete())
  function seccionPagoSueld(formulario) {
    try {
      let opcionesEmpleados = ["Armando"];
      const preguntas = [
        { tipo: 'list', titulo: 'Elija un Empleado',opciones: opcionesEmpleados, requerido: true },
        { tipo: 'text', titulo: 'Monto sueldo', requerido: true }
      ];
  
      let nuevaSeccion = crearSeccion(formulario, 'Pago de sueldo', 'Por favor, elige un sueldo e ingresa el monto.', preguntas);
  
      return { nuevaSeccion };
    } catch (error) {
      console.error("Error en la sección de pago de sueldos:", error.message);
      return { nuevaSeccion: null };
    }
  }
  
  
  