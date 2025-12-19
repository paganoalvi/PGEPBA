# Portal de Gestión de Emprendimientos - Provincia de Buenos Aires  

### 📌 Descripción  
Este repositorio contiene el **código y la documentación** del proyecto *Portal de Gestión de Emprendimientos*.  

El objetivo principal es **brindar a los emprendedores una herramienta práctica** basada en formularios pre-diseñados para:  
- Facilitar la **recopilación de datos** de su emprendimiento.  
- Permitir la **visualización eficiente** de la información recolectada.  

---

### 🛠️ Infraestructura  
El portal está desarrollado sobre **Google Apps Script (GAS)**.  
Como GitHub no tiene soporte nativo para archivos `.gs`, en este repositorio:  
- Los archivos `.gs` se representan como `.js`.  
- Los archivos `.html` mantienen su formato original, conteniendo **HTML, CSS y JavaScript** organizados dentro de ellos.  

---

### 💻 Cómo utilizar el código  
1. Crear un proyecto nuevo en la consola de **Google Apps Script**.  
2. Copiar el contenido de cada archivo `.js` de este repositorio y pegarlo en un archivo `.gs` dentro de GAS.  
3. Copiar los archivos `.html` respetando su estructura y pegarlos en la sección correspondiente de la consola de GAS.  

---
### 💼 Modelos de emprendimiento
La herramienta contempla dos modelos de emprendimiento:
- Productor de bienes: Aquellos emprendedores que realizan la producción de sus propios bienes para venderlos.
- Prestador de servicios: Emprendedores que venden sus servicios.

Podrás encontrar el código fuente de cada modelo de emprendimiento en sus respectivas ramas de este repositorio.

---

### 🔐 Ingreso para usuarios
Página de bienvenida desde la cual los usuarios podrán tanto acceder e instalar la herramienta actual como visualizar las guías de usuario:
https://sites.google.com/view/portalgestion/inicio
---
### 📂 Estructura del proyecto  

```bash
.
├── 📁 Assets/                  # Funciones de soporte: triggers, prellenado, informes y utilidades generales
│   ├── 📄 forms_assets.js       # Funciones específicas de formularios
│   ├── 📄 general-assets.js     # Funciones generales de soporte
│   ├── 📄 informes_assets.js    # Funciones para generar informes
│   ├── 📄 modForms_assets.js    # Funciones para modificar formularios
│   ├── 📄 prellenadoFunctions.js # Funciones de prellenado automático
│   └── 📄 trigger_assets.js     # Funciones de triggers automáticos
├── 📁 HTML/                    # Plantillas visuales
│   ├── 📄 estilos.html          # Estilos CSS compartidos
│   ├── 📄 javaScriptGraficos.html # JS de gráficos
│   ├── 📄 javaScript.html       # JS general del portal
│   ├── 📄 javaScriptReceta.html # JS para recetas
│   ├── 📄 Main.html             # Página principal
│   └── 📄 PaginaEspera.html     # Página de espera
├── 📁 Paquete_Forms/           # Scripts para creación de formularios
│   ├── 📄 crearPaqueteForms.js # Script central para crear paquetes de formularios
│   ├── 📁 Forms_primarios/     # Formularios principales
│   │   ├── 📄 crearFormsCompras.js
│   │   ├── 📄 crearFormsCostosfijos.js
│   │   ├── 📄 crearFormsProduccion.js
│   │   └── 📄 crearFormsVentas.js
│   └── 📁 Forms_secundarios/   # Formularios secundarios
│       ├── 📄 crearFormsArticulos.js
│       ├── 📄 crearFormsClientes.js
│       ├── 📄 crearFormsEmpleados.js
│       ├── 📄 crearFormsProveedoresCF.js
│       └── 📄 crearFormsProveedores.js
├── 📄 README.md                # Este archivo
└── 📄 sitoCompleo.js           # Script central del sitio

### 👥 Contacto  
- 📧 **portalgestionpba@gmail.com** —  
