function envioInformeGmail() {
    let sheetId = PropertiesService.getUserProperties().getProperty("HojaResultados0");
    let sheetPruebaCompras = SpreadsheetApp.openById(sheetId);
    let hoja = sheetPruebaCompras.getSheets()[0];
  
    // Obtener los datos de las columnas D y E y filtrar filas válidas
    let datos = hoja.getRange("D1:E" + hoja.getLastRow()).getValues();
    datos = datos.filter(([producto, total]) => producto && !isNaN(total)); // Filtrar productos y totales válidos
  
    // Reducir los datos a un resumen de ventas por producto
    let resumenDeTotalUnidades = datos.reduce((acc, [producto, total]) => {
      if (!acc[producto]) {
        acc[producto] = 0;
      }
      acc[producto] += total;
      return acc;
    }, {});
  
    // Convertir el objeto a un array adecuado para el gráfico
    let datosParaGrafico = Object.entries(resumenDeTotalUnidades);
  
    // Validar si hay datos disponibles para el gráfico
    if (datosParaGrafico.length === 0) {
      throw new Error("No hay datos disponibles para generar el gráfico.");
    }
  
    // Crear una nueva hoja temporal
    let nuevaHoja = sheetPruebaCompras.insertSheet("TemporalGrafico");
  
    // Insertar los datos en la nueva hoja
    let rangoGrafico = nuevaHoja.getRange(1, 1, datosParaGrafico.length, 2); // Comenzamos desde la celda A1
    rangoGrafico.setValues(datosParaGrafico);
  
    // Crear el gráfico
    let chart = nuevaHoja.newChart()
      .setChartType(Charts.ChartType.COLUMN) // Tipo de gráfico
      .addRange(rangoGrafico)
      .setPosition(1, 3, 0, 0) //LA FALTA DE ESTO PRODUCIA ERROR, ASI QUE ASEGURATE PENSARLO LA PROXIMA VEZ
      .build(); // Construir el gráfico sin insertarlo en la hoja 
  
    SpreadsheetApp.flush();
  
    let chartBlob = chart.getAs('image/png'); // Convertir el gráfico a PNG
  
    // Crear un documento
    let wordInforme = DocumentApp.create("InformeGrafico");
    let file = DriveApp.getFileById(wordInforme.getId());
  
    // Insertar texto de título
    let body = wordInforme.getBody();
    body.appendParagraph("Informe con Gráfico").setHeading(DocumentApp.ParagraphHeading.HEADING1);
  
    // Insertar el gráfico en el documento
    body.appendImage(chartBlob); 
    wordInforme.saveAndClose();
    Utilities.sleep(1000);
    sheetPruebaCompras.deleteSheet(nuevaHoja);
  
    MailApp.sendEmail({
    to: "alvapagano819@gmail.com",
    subject: "Se creo este informe para Pagano",
    body: "Adjunto encontrarás el informe generado.",
    attachments: [file.getAs('application/pdf')] // Adjuntar como PDF
  });
  MailApp.sendEmail({
    to: "paganoalvaroangel@gmail.com",
    subject: "Se creo este informe para Pagano",
    body: "Adjunto encontrarás el informe generado.",
    attachments: [file.getAs('application/pdf')] // Adjuntar como PDF
  });
  MailApp.sendEmail({
    to: "esfinge2012@gmail.com",
    subject: "Se creo este informe para Pagano",
    body: "Adjunto encontrarás el informe generado.",
    attachments: [file.getAs('application/pdf')] // Adjuntar como PDF
  });
  MailApp.sendEmail({
    to: "arsmigpro@gmail.com",
    subject: "Se creo este informe para Pagano",
    body: "Adjunto encontrarás el informe generado.",
    attachments: [file.getAs('application/pdf')] // Adjuntar como PDF
  });
  MailApp.sendEmail({
    to: "saiszr1939@gmail.com",
    subject: "Se creo este informe para Pagano",
    body: "Adjunto encontrarás el informe generado.",
    attachments: [file.getAs('application/pdf')] // Adjuntar como PDF
  });
    file.setTrashed(true);
  }
  
  
  
  
  
  
  
  
  
  
  //EJEMPLO DE CONDICION EN UN RANGO POR MEDIO DE JS
    /*const resultado = [];
    for (let i = 1; i < datosArray.length; i++) {  // Comienza desde 1 para saltar los encabezados
      const fila = datos[i];
      if (fila[2] > 25) {  // Verificar la condición de la columna "Condición" (Col3)
        resultado.push([fila[0], fila[1]]);  // Agregar "Nombre" y "Edad"
      }
    }*/