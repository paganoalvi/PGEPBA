

//////////////////////////////////////////////////////////////////
//SEGUNDA FORMA DE GRAFICO PARA INFORME: GRAFICO PERMANENTE//////
//////////////////////////////////////////////////////////////////

function graficoPermanente(e){
  const sheetPruebaCompras = e.source;
  const hoja = sheetPruebaCompras.getSheetByName('Respuestas de formulario 1')
  var ultimaFila = hoja.getRange("M:M").getValues().filter(String).length + 1;
  
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
  let nuevaHoja = sheetPruebaCompras.getSheetByName("TemporalGrafico");

  if (!nuevaHoja) {
    nuevaHoja = sheetPruebaCompras.insertSheet("TemporalGrafico");
  }
  //Obtener los graficos
  let charts = hoja.getCharts();
  // Eliminar los gráficos existentes (si hay)
  charts.forEach(chart => hoja.removeChart(chart));

  // Insertar los datos en la nueva hoja
  let rangoGrafico = nuevaHoja.getRange(1, 1, datosParaGrafico.length, 2); // Comenzamos desde la celda A1
  rangoGrafico.setValues(datosParaGrafico);
  
  // Crear el gráfico
  let chart = nuevaHoja.newChart()
    .setChartType(Charts.ChartType.COLUMN) // Tipo de gráfico
    .addRange(rangoGrafico)
    .setPosition(2, 13, 0, 0) //LA FALTA DE ESTO PRODUCIA ERROR, ASI QUE ASEGURATE PENSARLO LA PROXIMA VEZ
    .build(); // Construir el gráfico sin insertarlo en la hoja

  hoja.insertChart(chart);
  //sheetPruebaCompras.deleteSheet(nuevaHoja);
  ultimaFila = hoja.getRange("M:M").getValues().filter(String).length + 1;
}


  




///////////////////////////////////////////////////////
//FUNCION ENVIO DE INFORME A EMAIL DE LA PERSONA////////
////////////////////////////////////////////////////////


function envioInformeGmail() {
  
  //CORREGIR PORQUE ESTO VA LIGADO A UN BOTON Y FALTA DEFINIR LAS VARIABLES
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

  let chartBlob = chart.getAs('image/png'); // Convertir el gráfico a PNG

  // Crear un documento
  let wordInforme = DocumentApp.create("InformeGrafico");
  let file = DriveApp.getFileById(wordInforme.getId());

  // Insertar texto de título
  let body = wordInforme.getBody();
  body.appendParagraph("Informe con Gráfico").setHeading(DocumentApp.ParagraphHeading.HEADING1);

  // Insertar el gráfico en el documento
  body.appendImage(chartBlob); 
  wordInforme.saveAndClose(); //ESTO TAMBIEN ESTABA GENERANDO PROBLEMAS
  sheetPruebaCompras.deleteSheet(nuevaHoja);

  MailApp.sendEmail({
  to: Session.getActiveUser().getEmail(),
  subject: "Se creo este informe para Pagano",
  body: "Adjunto encontrarás el informe generado.",
  attachments: [file.getAs('application/pdf')] // Adjuntar como PDF
});
  file.setTrashed(true);
}




