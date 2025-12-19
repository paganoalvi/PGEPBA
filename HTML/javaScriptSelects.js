<script>


/////////////////////////////////////////////////////////////////
/////CARGAR TODOS LOS SELECTS AL CARGAR PAGINA///////////////
/////////////////////////////////////////////////////////////////

function cargarDatosEnSelects(){
  cargarUnSelect("empleado","Empleados","B",0,"Empleado al que queres pagar");
}

/////FUNCION PARTICULAR CARGAR UN SOLO SELECT///////////////////////


async function cargarUnSelect(idSelect, hojaDatos, columnaDatos, inicio, terminoAsociado){
  const select = await fetchSheetData(hojaDatos, `SELECT ${columnaDatos} WHERE ${columnaDatos} IS NOT NULL`);
  const data = select.getDataTable();
  const posicionSelect = document.getElementById(idSelect);
  const fragment = document.createDocumentFragment();

  posicionSelect.innerHTML = ""
  const optPrimerSelect = document.createElement("option");
  optPrimerSelect.textContent = `--${terminoAsociado}--`;
  optPrimerSelect.value = "";
  fragment.appendChild(optPrimerSelect);

  for(let i = inicio; i < data.getNumberOfRows(); i++){
    const opt = document.createElement("option");  
    opt.value = data.getValue(i, 0);
    opt.textContent = data.getValue(i, 0);
    fragment.appendChild(opt);
  }
  posicionSelect.appendChild(fragment);
}



/////////////////////////////////////////////////////////////////
/////FUNCION PARA GENERAR LOS CHECKBOXES DE SERVICIOS
/////////////////////////////////////////////////////////////////

function generarCheckboxes(divId, nombres) {
    const contenedor = document.getElementById(divId);
    
    if (!contenedor) {
        console.error(`No se encontró elemento con ID: ${divId}`);
        return;
    }
    
    contenedor.innerHTML = '';
    
    nombres.forEach((nombre, indice) => {
        const checkboxItem = document.createElement('div');
        checkboxItem.className = 'checkbox-item';
        
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.id = `${divId}_${indice}`;
        input.name = 'Nservicios[]';
        input.value = nombre;
        
        const label = document.createElement('label');
        label.htmlFor = input.id;
        label.textContent = nombre;
        
        checkboxItem.appendChild(input);
        checkboxItem.appendChild(label);
        contenedor.appendChild(checkboxItem);
    });
}


/////FUNCION PARTICULAR CARGAR UN SOLO SELECT///////////////////////

async function cargarUnSelect(idSelect,hojaDatos,columnaDatos,inicio,terminoAsociado){
  const select = await fetchSheetData(hojaDatos, `SELECT ${columnaDatos} WHERE ${columnaDatos} IS NOT NULL`);
  const data = select.getDataTable();
  const posicionSelect = document.getElementById(idSelect);
  const fragment = document.createDocumentFragment();

  posicionSelect.innerHTML = ""
  const optPrimerSelect = document.createElement("option");
  optPrimerSelect.textContent = `--Seleccioná tu ${terminoAsociado}--`;
  optPrimerSelect.value = "";
  fragment.appendChild(optPrimerSelect);

  for(let i = inicio;i<data.getNumberOfRows();i++){
    const opt = document.createElement("option");  
    opt.value = data.getValue(i,0);
    opt.textContent = data.getValue(i,0);
    fragment.appendChild(opt); // <-- solo en memoria
  }
  posicionSelect.appendChild(fragment);
}
</script>
