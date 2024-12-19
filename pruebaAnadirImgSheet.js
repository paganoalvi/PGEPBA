function funcionPruebaImagen() {
    let formIngreso = crearFormIngresos();
    let respuestasFormIngresos = SpreadsheetApp.create("Hoja de Ingresos");
    formIngreso.setDestination(FormApp.DestinationType.SPREADSHEET, respuestasFormIngresos.getId());
  
    let hoja = respuestasFormIngresos.getSheets()[0];
  
    // Crear encabezado de Total
    hoja.getRange(1, 7).setValue('Total'); // Columna G
  
    // URL transformada correctamente para acceder a la imagen
    const url = "https://drive.google.com/uc?id=1N6CcU7t_Q-XyQY_bhr3Bea6q_ubXJpjZ";
    
    // Insertar imagen en la posición (x=3, y=2) en la hoja
    hoja.insertImage(url, 6, 7);  // Usamos la hoja que ya tenemos cargada
  }
  
  
  
  