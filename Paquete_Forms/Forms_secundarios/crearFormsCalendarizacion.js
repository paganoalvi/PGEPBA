////////////////////////////////////////////////////
// FUNCIÓN PRINCIPAL: Crear el Form ARTICULOS /////
///////////////////////////////////////////////////
function crearFormCalendarizacion(){  
    try {
      Logger.log("Iniciando creación del formulario de calendario");
 
      let formularioCalendario = FormApp.create("Calendarización");
      let formularioCalendarioID = formularioCalendario.getId();
      PropertiesService.getScriptProperties().setProperty("Formulario_ID", formularioCalendarioID);


      formularioCalendario.setDescription(
        "Completá este formulario para crear recordatorios automáticos en Google Calendar según los días en que debés prestar servicios a un cliente.Seleccioná el contrato, elegí las fechas y los eventos se crearán de forma automática en tu google drive."
      );
     
      formularioCalendario.addListItem()
        .setTitle("Seleccioná el servicio") // Nombre
        .setHelpText("Elegí el servicio asociado al cliente. Este será el nombre que aparecerá en los eventos del calendario, salvo que lo reemplaces por un nombre alternativo.")
        .setRequired(true);

      const itemeliminar = formularioCalendario.addMultipleChoiceItem()
        itemeliminar.setTitle("¿Querés reemplazar el nombre del servicio seleccionado?")
        itemeliminar.setHelpText("Si seleccionás esta opción, el nombre elegido en el listado será reemplazado por el nombre alternativo que ingreses abajo.")
        itemeliminar.setChoices([
          itemeliminar.createChoice("Sí, quiero usar un nombre alternativo")
        ]);
     
      formularioCalendario.addTextItem()
        .setTitle("Nombre alternativo (opcional)")
        .setHelpText("Si completás este campo, este será el nombre que aparecerá en los eventos del calendario en lugar del nombre del servicio.");

      
      formularioCalendario.addDateItem()
        .setTitle("Fecha 1")
        .setHelpText("Cada fecha que ingreses generará un evento independiente en Google Calendar como recordatorio del servicio. Tenés que seleccionar al menos una fecha para poder crear los eventos.")
        .setRequired(true);

      formularioCalendario.addDateItem()
        .setTitle("Fecha 2");
      formularioCalendario.addDateItem()
        .setTitle("Fecha 3");
      formularioCalendario.addDateItem()
        .setTitle("Fecha 4");
      formularioCalendario.addDateItem()
        .setTitle("Fecha 5");
      
      

      const formCalendarioUrl = formularioCalendario.getPublishedUrl();
      Logger.log("Calendario: " + formCalendarioUrl)
      PropertiesService.getUserProperties().setProperty("formularioCalendarioUrl", formCalendarioUrl);
      PropertiesService.getUserProperties().setProperty("formularioCalendarioEditUrl", formularioCalendario.getEditUrl());
      //Logger.log(formularioCalendario.getEditUrl());
      //Logger.log("Formulario de articulos creado con ID: " + formularioCalendario.getId());
 
      return formularioCalendario;
 
    } catch (error) {
      console.error("Error al crear el formulario de articulos:", error.message);
      return null;
    }
}
