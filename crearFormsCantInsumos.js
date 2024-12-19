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

  ///////////////////////////////////////
  ///////////////////////////////////////

  // Bucle para crear dinámicamente los campos de insumo
  for (let i = 1; i <= 15; i++) {
    form.addTextItem()
      .setTitle(`Insumo ${i} (completar)`)
      .setRequired(true);

    form.addTextItem()
      .setTitle(`Cantidad de unidades para Insumo ${i}`)
      .setRequired(true)
      .setValidation(validacionNumerica);

    form.addTextItem()
      .setTitle(`Precio por unidad para Insumo ${i}`)
      .setRequired(true)
      .setValidation(validacionNumerica);
  }
  return form;
}


