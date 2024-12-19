function crearFormCantInsu() {
    let form = FormApp.create("Formulario cantidad de insumos");
  
    // Setear descripción por defecto
    form.setDescription("Este formulario permite llevar un registro de los insumos de materias primas. Y puede agregar a gusto cualquier tipo de insumo/materia prima que desee llevar registro y/o gestionar. Al finalizar por favor selecciona el botón de publicado y pon 'guardar' para empezar a enviar tus respuestas al apartado de resultados.");
  
    // Agregar un video tutorial de YouTube
    const video = form.addVideoItem()
      .setTitle("Tutorial: Cómo completar el formulario")
      .setHelpText("Mira este video para aprender a completar el formulario correctamente.")
      .setVideoUrl("https://www.youtube.com/watch?v=xFsLdj-jxic&t=20s"); // url a video tutorial
  
    // Validación para entrada numérica
    let validacionNumerica = FormApp.createTextValidation()
      .setHelpText('Por favor, ingresa solo números.')
      .requireTextMatchesPattern('^[0-9]+$') // Regex: solo números
      .build();
  
    let materia1 = form.addListItem()
      .setTitle('Elija un insumo materia prima 1 ')
      .setRequired(true);
  
    // Agregar las opciones al ListItem
    let opcionesServicios = [
      materia1.createChoice('insumo 1 (completar)'),
      materia1.createChoice('insumo 2 (completar)'),
      materia1.createChoice('insumo 3 (completar)'),
      materia1.createChoice('insumo 4 (completar)')
    ];
    materia1.setChoices(opcionesServicios);
  
    let textNum = form.addTextItem()
      .setTitle('insumo 1 (completar)')
      .setRequired(true)
  
    textNum = form.addTextItem()
      .setTitle('Cantidad de unidades')
      .setRequired(true)
      .setValidation(validacionNumerica);
  
    ///////////////////////////////////////
    ///////////////////////////////////////
    let materia2 = form.addListItem()
      .setTitle('Elija un insumo materia prima 2')
      .setRequired(true);
  
    // Agregar las opciones al ListItem
    opcionesServicios = [
      materia2.createChoice('insumo 1 (completar)'),
      materia2.createChoice('insumo 2 (completar)'),
      materia2.createChoice('insumo 3 (completar)')
    ];
    materia2.setChoices(opcionesServicios);
  
    textNum = form.addTextItem()
      .setTitle('insumo 1 (completar)')
      .setRequired(true)
  
    textNum = form.addTextItem()
      .setTitle('Cantidad de unidades')
      .setRequired(true)
      .setValidation(validacionNumerica);
  
    textNum = form.addTextItem()
      .setTitle('Precio por unidad')
      .setRequired(true)
      .setValidation(validacionNumerica);  
  
    return form;
  }
  