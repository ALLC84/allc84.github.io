# CV · Alejandro Llorente

CV personal desarrollado con **Astro**, diseñado como una interfaz de editor de código (estilo VS Code / Dracula theme). El contenido se gestiona desde archivos de datos centralizados y el PDF se genera automáticamente desde una plantilla limpia independiente.

## Stack

- [Astro](https://astro.build) — generación de sitio estático
- JetBrains Mono (Google Fonts) — tipografía monoespaciada
- Dracula color palette — tema de color
- Puppeteer — generación de PDF headless

## Estructura del proyecto

```
/
├── public/
│   ├── favicon.svg
│   └── CV-Alejandro-Llorente.pdf   ← PDF generado (commiteado)
│
├── scripts/
│   └── generate-pdf.mjs            ← Script de generación de PDF con Puppeteer
│
└── src/
    ├── assets/
    │   └── images/
    │
    ├── components/
    │   ├── Aside/                  ← Sidebar: avatar, contacto, skill bars
    │   │   ├── index.astro
    │   │   ├── Avatar.astro
    │   │   ├── Contact.astro
    │   │   └── SkillLevel.astro
    │   ├── Footer/                 ← Status bar (derecha)
    │   ├── Header/                 ← Bloque de código del perfil
    │   ├── Main/                   ← Experiencia, educación, cursos
    │   │   ├── WorkExperience.astro
    │   │   ├── Education.astro
    │   │   ├── Courses.astro
    │   │   └── common/SectionInformation/
    │   └── Nav/                    ← Status bar (izquierda): GitHub, Download CV
    │
    ├── data/                       ← Fuente única de datos del CV
    │   ├── contact.js
    │   ├── workExperience.json
    │   ├── education.js
    │   ├── courses.json
    │   ├── skills.json
    │   ├── skillsTech.json
    │   └── language.json
    │
    ├── layouts/
    │   └── main.astro              ← Layout IDE: title bar, sidebar, tabs, status bar
    │
    ├── pages/
    │   ├── index.astro             ← Web principal (interfaz IDE)
    │   └── print.astro             ← Plantilla limpia para generar el PDF
    │
    └── styles/
        ├── reset.css
        └── variables.css           ← Design tokens, Dracula palette, clases de sintaxis
```

## Comandos

| Comando           | Acción                                                    |
| :---------------- | :-------------------------------------------------------- |
| `npm install`     | Instala las dependencias                                  |
| `npm run dev`     | Servidor de desarrollo en `localhost:4321`                |
| `npm run build`   | Genera el sitio en `./dist/`                              |
| `npm run preview` | Previsualiza el build localmente                          |
| `npm run pdf`     | Genera el PDF del CV y lo guarda en `public/`             |

## Actualizar el CV

Todo el contenido del CV vive en `src/data/`. Edita los archivos JSON/JS correspondientes y ejecuta:

```bash
# Regenera el sitio y el PDF en un solo comando
npm run pdf

# Commitea el PDF actualizado
git add public/CV-Alejandro-Llorente.pdf
git commit -m "chore: update CV"
git push
```

### Añadir una experiencia (`src/data/workExperience.json`)

```json
{
  "role": "Job Title",
  "company": "Company Name",
  "type": "Empleado · Tiempo Completo",
  "description": "Descripción breve del trabajo realizado.",
  "year": "Enero 2024 – Actualidad",
  "url": "https://company.com"
}
```

## Cómo funciona el PDF

La ruta `/print` (`src/pages/print.astro`) renderiza los mismos datos en un layout A4 limpio y profesional — sin el chrome del IDE. El script `scripts/generate-pdf.mjs` arranca `astro preview`, abre `/print` con Puppeteer y exporta el PDF.

El PDF resultante se commitea en `public/` y se despliega junto al resto del sitio estático.
