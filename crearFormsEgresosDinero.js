function crearFormEgresos() {
    // Crear el formulario
    let formularioEgresos = FormApp.create("Formulario egresos de dinero");
  
    // setear descripcion por defecto
    formularioEgresos.setDescription("Este formulario permite registrar ingresos relacionados con la compra de productos o el pago de servicios. Y puede agregar a gusto cualquier tipo de egreso de dinero que desee llevar registro y/o gestionar.Al finalizar por favor selecciona el boton de publicado y pone 'guardar' asi podes empezar a enviar tus respuestas al apartado de resultados")
  
    // Agregar un video tutorial de YouTube
    const video = form.addVideoItem()
      .setTitle("Tutorial: Cómo completar el formulario")
      .setHelpText("Mira este video para aprender a completar el formulario correctamente.")
      .setVideoUrl("https://www.youtube.com/watch?v=xFsLdj-jxic&t=20s"); // Reemplaza "TU_VIDEO_ID" por el ID del video de YouTube.
  
    // Crear la pregunta inicial
    let preguntaInicial = formularioEgresos.addMultipleChoiceItem()
      .setTitle('Tipo de egreso')
      .setRequired(true);
  
    // Crear las secciones "Compra de Productos" y "Pago de Servicios"
    let seccionCP = seccionCompraP(formularioEgresos);
    let seccionPS = seccionPagoServ(formularioEgresos);
  
    // Crear las opciones de la pregunta inicial
    let opciones = [
      preguntaInicial.createChoice("Compra de Productos", seccionCP),
      preguntaInicial.createChoice("Pago de Servicios", seccionPS)
    ];
  
    // Asignar las opciones con navegación
    preguntaInicial.setChoices(opciones);
  
    // Configurar las secciones para finalizar el formulario
    seccionCP.setGoToPage(FormApp.PageNavigationType.SUBMIT);
    seccionPS.setGoToPage(FormApp.PageNavigationType.SUBMIT);
  
    return formularioEgresos;
  }
  
  
  
  // SECCIÓN "COMPRA DE PRODUCTOS"
  function seccionCompraP(formulario) {
    let nuevaSeccion = formulario.addPageBreakItem()
      .setTitle('Compra de Producto')
      .setHelpText('Por favor, ingresa los detalles de la compra.');
  
    let costU = formulario.addTextItem()
      .setTitle('Precio por unidad')
      .setRequired(true);
  
    let cantU = formulario.addTextItem()
      .setTitle('Cantidad de unidades')
      .setRequired(true);
  
    let validacionNumerica = FormApp.createTextValidation()
      .setHelpText('Por favor, ingresa solo números.')
      .requireTextMatchesPattern('^[0-9]+$,.') // Regex: solo números
      .build();
  
    costU.setValidation(validacionNumerica);
    cantU.setValidation(validacionNumerica);
  
    return nuevaSeccion;
  }
  
  // SECCIÓN "PAGO DE SERVICIOS"
  function seccionPagoServ(formulario) {
    let nuevaSeccion = formulario.addPageBreakItem()
      .setTitle('Pago de Servicio')
      .setHelpText('Por favor, elige un servicio e ingresa el monto pagado.');
  
    let listaServicios = formulario.addListItem()
      .setTitle('Elija un Servicio')
      .setRequired(true);
  
    // Agregar las opciones al ListItem
    let opcionesServicios = [
      listaServicios.createChoice('Luz'),
      listaServicios.createChoice('Agua'),
      listaServicios.createChoice('Internet'),
      listaServicios.createChoice('Mantenimiento')
    ];
    listaServicios.setChoices(opcionesServicios);
  
    let montoPregunta = formulario.addTextItem()
      .setTitle('Monto abonado')
      .setRequired(true);
  
    let validacionNumerica = FormApp.createTextValidation()
      .setHelpText('Por favor, ingresa solo números.')
      .requireTextMatchesPattern('^[0-9]+$.,') // Regex: solo números
      .build();
  
    montoPregunta.setValidation(validacionNumerica);
  
    return nuevaSeccion;
  }
  
  
  
  
  
  