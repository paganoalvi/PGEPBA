///////////////////////////////////////
// FUNCIÓN: crearSeccion // Se modulariza el creado de seccion ya que se repite 2 veces
///////////////////////////////////////
function crearSeccion(formulario, titulo, textoAyuda, preguntas) {
  let nuevaSeccion = formulario.addPageBreakItem()
    .setTitle(titulo)
    .setHelpText(textoAyuda);

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

  return nuevaSeccion; // Asegúrate de retornar nuevaSeccion correctamente
}
















