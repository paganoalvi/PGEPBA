function crearFormPedidos() {
    try {
      // Intentar crear el formulario
      let formularioPedidos = FormApp.create("Pedidos");
      console.log("Formulario creado exitosamente:", formularioPedidos.getEditUrl());
  
      formularioPedidos.setDescription('Este formulario permite llevar registro de pedidos');
  
      // Pregunta: Concepto
      formularioPedidos.addMultipleChoiceItem()
        .setTitle('CONCEPTO')
        .setHelpText('help text')
        .setChoiceValues(['Venta', 'Cobro', 'Sin cargo', 'ENTREGADO'])
        .setRequired(true);
  
      // Pregunta: Cliente
      formularioPedidos.addListItem()
        .setTitle('CLIENTE')
        .setHelpText('texto de ayuda')
        .setRequired(true);
  
      // Pregunta: Segmento
      formularioPedidos.addMultipleChoiceItem()
        .setTitle('SEGMENTO')
        .setHelpText('txt ayuda')
        .setChoiceValues(['MINORISTA', 'MAYORISTA', 'DISTRIBUIDOR'])
        .setRequired(true);
  
      // Pregunta: Producto
      formularioPedidos.addMultipleChoiceItem()
        .setTitle('PRODUCTO')
        .setHelpText('Texto ayuda')
        .setChoiceValues(['Producto terminado 1', 'Producto terminado 2', 'Producto terminado 3'])
        .setRequired(true);
  
      // Pregunta: Unidades
      formularioPedidos.addTextItem()
        .setTitle('UNIDADES')
        .setRequired(true);
  
      // Pregunta: Descuento
      formularioPedidos.addTextItem()
        .setTitle('DESCUENTO (%)');
  
      // Pregunta: Plazo de pago
      formularioPedidos.addTextItem()
        .setTitle('PLAZO DE PAGO')
        .setRequired(true);
      //GUARDAR URL EN LAS PROPIEDADES PARA USARLAS MAS ADELANTE
      const formPedidosUrl = formularioPedidos.getPublishedUrl();
      PropertiesService.getUserProperties().setProperty("formPedidosUrl",formPedidosUrl);
      PropertiesService.getUserProperties().setProperty("formPedidosEditUrl",formularioPedidos.getEditUrl());
      // Retornar el formulario creado
      return formularioPedidos;
  
    } catch (error) {
      // Manejo de errores
      console.error("Error al crear el formulario de pedidos:", error.message);
      return null; // Retornar null si ocurre un error
    }
  }
  
  function pruebaCrearFormPedidos() {
    let formulario = crearFormPedidos();
    if (!formulario) {
      console.error("No se pudo crear el formulario de pedidos.");
    } else {
      console.log("Formulario de pedidos creado exitosamente:", formulario.getEditUrl());
    }
  }