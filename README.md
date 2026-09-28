# 🎬 Discuss

> Plataforma web enfocada en la **crítica, calificación y debate estructurado** sobre series y películas. Frontend desarrollado con **Ionic + React**.

---

## 👥 Roles de usuario

| Rol | Descripción | Permisos principales |
|-----|-------------|----------------------|
| **Crítico (Usuario registrado)** | Miembro de la comunidad que consume y produce contenido. | Publicar y editar reseñas, calificar títulos, crear debates, argumentar en debates, votar la utilidad de aportes y reportar contenido inapropiado. |
| **Moderador** | Usuario con privilegios de supervisión que garantiza la calidad y el respeto en la plataforma. | Todo lo del Crítico, más: revisar reportes, ocultar o restaurar reseñas y argumentos, cerrar debates y sancionar usuarios que incumplan las normas. |

---

## ✅ Requerimientos funcionales

| ID | Nombre | Descripción |
|----|--------|-------------|
| **RF-01** | Publicación de reseñas | El Crítico puede redactar una reseña sobre una serie o película, con título, cuerpo de texto (mínimo y máximo de caracteres) y una etiqueta opcional de "contiene spoilers". Cada usuario puede publicar una única reseña por título. |
| **RF-02** | Calificación por criterios | El Crítico puede asignar una puntuación de 1 a 5 estrellas a un título, desglosada en criterios (guion, actuación, dirección, producción). El sistema calcula y muestra el promedio general y por criterio. |
| **RF-03** | Creación de debates estructurados | El Crítico puede abrir un debate sobre un título definiendo una **tesis central** (ej. "El final de la serie arruinó la trama") y una categoría temática (interpretación, guion, comparación, etc.). |
| **RF-04** | Argumentación posicionada | Dentro de un debate, el usuario debe declarar su postura (**A favor**, **En contra** o **Neutral**) antes de publicar un argumento. Los aportes se muestran en columnas o pestañas separadas por postura y admiten respuestas anidadas (un nivel) para refutar. |
| **RF-05** | Votación de utilidad | Los usuarios pueden votar si una reseña o argumento es "Útil" o "No útil" (un voto por usuario, y no sobre su propio contenido). El sistema ordena los aportes por relevancia según estos votos. |
| **RF-06** | Exploración y filtrado del catálogo | El sistema permite buscar títulos y filtrarlos por género, año, tipo (serie o película), calificación promedio y nivel de actividad (número de reseñas y debates). |
| **RF-07** | Edición y eliminación de aportes propios | El Crítico puede editar o eliminar sus reseñas, calificaciones y argumentos. Las ediciones muestran la marca "editado" con fecha; los argumentos con respuestas se conservan pero se marcan como "eliminado por el autor". |
| **RF-08** | Reporte de contenido | El Crítico puede reportar reseñas, argumentos o debates indicando un motivo (spam, ofensivo, spoiler sin etiquetar, off-topic). El reporte queda registrado en una cola para revisión. |
| **RF-09** | Gestión de reportes y moderación | El Moderador puede visualizar la cola de reportes, ocultar, restaurar o eliminar contenido, y registrar el motivo de su decisión. El autor recibe una notificación con el resultado. |
| **RF-10** | Cierre de debates y resumen | El Moderador (o el creador del debate, tras un período de inactividad definido) puede cerrar un debate. Al cerrarse, el sistema muestra un resumen con el conteo de argumentos por postura y los aportes mejor valorados de cada lado. |

---

## ⚙️ Requerimientos no funcionales

| ID | Categoría | Nombre | Descripción |
|----|-----------|--------|-------------|
| **RNF-01** | Rendimiento | Tiempo de carga inicial | La pantalla principal debe cargar en menos de **3 segundos** en una conexión 4G, aplicando *lazy loading* de rutas (`React.lazy` + `IonReactRouter`) y de imágenes (pósters). |
| **RNF-02** | Rendimiento | Listados escalables | Los listados largos (reseñas, argumentos, catálogo) deben usar **paginación o scroll infinito** (`IonInfiniteScroll`) con lotes de máximo 20 elementos, evitando renderizar cientos de nodos simultáneos. |
| **RNF-03** | Seguridad | Sanitización de contenido | Todo texto ingresado por el usuario (reseñas, argumentos, títulos de debate) debe sanitizarse antes de renderizarse, para prevenir ataques **XSS** e inyección de HTML/scripts. |
| **RNF-04** | Seguridad | Control de acceso por rol | La interfaz y las rutas deben restringir acciones según el rol (por ejemplo, el panel de moderación solo es accesible para Moderadores), mediante *route guards*. Los tokens de sesión no deben almacenarse en `localStorage` sin protección; se recomienda usar cookies `HttpOnly` o almacenamiento seguro. |
| **RNF-05** | Seguridad | Comunicación segura y límites de uso | Toda comunicación con el backend debe realizarse por **HTTPS**. El frontend debe limitar acciones repetitivas (por ejemplo, deshabilitar el botón de publicar mientras la petición está en curso y aplicar *debounce* en búsquedas) para mitigar spam. |
| **RNF-06** | Usabilidad | Diseño responsivo y multiplataforma | La interfaz debe adaptarse a móviles, tablets y escritorio, usando el sistema de grillas y componentes de Ionic, con un comportamiento consistente en Chrome, Firefox, Safari y Edge. |
| **RNF-07** | Usabilidad | Accesibilidad | La aplicación debe cumplir con el nivel **WCAG 2.1 AA**: contraste mínimo de 4.5:1, navegación por teclado, etiquetas `aria` en controles interactivos y textos alternativos en imágenes. |
| **RNF-08** | Usabilidad | Retroalimentación y consistencia | Toda acción del usuario debe dar respuesta visible (indicadores de carga con `IonSpinner`/*skeletons*, mensajes de éxito o error con `IonToast`, validaciones en formularios en tiempo real). Además, debe ofrecerse **modo claro y oscuro**. |

---

## 🛠️ Tecnologías

- [Ionic Framework](https://ionicframework.com/) + [React](https://react.dev/)
- TypeScript
- React Router (`IonReactRouter`)

---

## 🚀 Instalación y ejecución

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
ionic serve

# Generar build de producción
ionic build

---



## 📌 Justificación del problema y caracterización de usuarios objetivo

### 1. Justificación del problema

El consumo de series y películas ha dejado de ser una actividad puramente individual: los espectadores comparten calificaciones, reseñas y opiniones en plataformas digitales antes, durante y después de ver un título. Sin embargo, el análisis de las soluciones existentes (fuentes secundarias) revela brechas que motivan el desarrollo de **CineDebate**.

**Análisis de soluciones existentes**

- **Agregadores de calificaciones (IMDb, Rotten Tomatoes, Metacritic).** Ofrecen puntuaciones globales y reseñas, pero reducen la opinión del público a un número o a una clasificación binaria. La literatura periodística y divulgativa documenta que estos sistemas son vulnerables al *review bombing* (oleadas coordinadas de calificaciones extremas ajenas a la calidad de la obra) y a la manipulación de puntajes; incluso Rotten Tomatoes modificó su sistema de calificación de usuarios para mitigar este fenómeno [1][2][3]. Además, el intercambio entre usuarios es limitado: las reseñas se publican de forma aislada, sin un espacio que las confronte entre sí.
- **Redes sociales cinéfilas (Letterboxd).** Se presenta como una red social para el descubrimiento de cine y ha ganado relevancia como espacio de registro, reseña y recomendación entre aficionados [4][5]. No obstante, su eje es el registro personal y la interacción social ligera (listas, "me gusta", comentarios), no un formato de discusión que obligue a sostener una postura con argumentos y a confrontarla con la contraria.
- **Foros y comunidades abiertas (por ejemplo, subforos de cine en Reddit).** Permiten conversaciones extensas, pero al ser hilos abiertos y no estructurados, los argumentos se mezclan con bromas, spoilers y ataques personales, y la calidad del debate depende casi por completo de la moderación voluntaria de cada comunidad. No existe una separación explícita entre reseña, calificación y argumentación.

**Problema identificado**

Ninguna de las alternativas analizadas integra en un mismo espacio (a) una calificación desglosada por criterios, (b) reseñas fundamentadas y (c) **debates con estructura formal** (tesis, postura declarada, refutación y cierre con resumen), respaldados por un mecanismo de moderación que preserve la calidad de la conversación. Como consecuencia, los espectadores interesados en discutir con profundidad una obra deben recurrir a múltiples plataformas, enfrentando ruido, polarización y falta de trazabilidad de los argumentos.

**Propuesta de valor**

CineDebate busca cubrir esa brecha ofreciendo una plataforma donde la opinión sobre series y películas se exprese mediante reseñas, calificaciones por criterios y debates estructurados, con herramientas de votación de utilidad y moderación que privilegien la argumentación por sobre la mera reacción.

---

### 2. Caracterización de usuarios objetivo (proto-personas)

#### 👤 Proto-persona 1: Valentina, la Crítica

| Aspecto | Descripción |
|---------|-------------|
| **Tipo de usuario** | Crítico (usuario registrado, rol principal de la plataforma). |
| **Características generales** | Mujer de 24 años, estudiante universitaria de Comunicación Audiovisual. Ve entre 3 y 5 títulos por semana entre películas y series, y disfruta analizar guion, dirección y actuaciones. Tiene experiencia previa con redes sociales y con plataformas de registro cinéfilo. |
| **Necesidades principales** | Un espacio donde su opinión sea leída y contrastada con argumentos, no ahogada por comentarios triviales. Calificar más allá de una nota única. Encontrar a otras personas con criterios similares o divergentes para conversar. |
| **Objetivos de uso** | Publicar reseñas fundamentadas, participar en debates sobre interpretaciones o finales polémicos, construir reputación como opinante confiable y descubrir títulos a partir de valoraciones de calidad. |
| **Puntos de frustración** | Calificaciones inflacionadas o manipuladas; hilos donde los argumentos se pierden entre insultos y spoilers; imposibilidad de saber quién argumenta a favor o en contra sin leer decenas de comentarios; reseñas eliminadas o ignoradas sin explicación. |
| **Funcionalidades que usaría** | Publicación de reseñas (RF-01), calificación por criterios (RF-02), creación de debates (RF-03), argumentación posicionada (RF-04), votación de utilidad (RF-05), búsqueda y filtrado del catálogo (RF-06), edición de aportes propios (RF-07) y reporte de contenido (RF-08). |
| **Dispositivo de acceso probable** | Principalmente **smartphone** (uso cotidiano, después de ver un título) y **notebook** para redactar reseñas o argumentos extensos. |

#### 🛡️ Proto-persona 2: Rodrigo, el Moderador

| Aspecto | Descripción |
|---------|-------------|
| **Tipo de usuario** | Moderador (usuario con privilegios de supervisión). |
| **Características generales** | Hombre de 32 años, profesional en el área de TI, aficionado veterano al cine y con experiencia previa como moderador voluntario en comunidades en línea. Dispone de tiempo limitado, generalmente por las tardes y fines de semana, y valora la imparcialidad y la claridad de las normas. |
| **Necesidades principales** | Contar con una cola de reportes ordenada y priorizada, con contexto suficiente para decidir rápido. Herramientas para actuar (ocultar, restaurar, eliminar) y dejar registro del motivo. Reglas claras y aplicables de forma consistente. |
| **Objetivos de uso** | Mantener debates respetuosos y centrados en argumentos, reducir spam, spoilers sin etiquetar y contenido ofensivo, cerrar debates agotados y garantizar que los usuarios perciban decisiones justas y transparentes. |
| **Puntos de frustración** | Volumen de reportes sin filtros ni priorización; falta de contexto del contenido reportado; usuarios que reinciden sin consecuencias visibles; conflictos por decisiones percibidas como arbitrarias; sobrecarga de trabajo manual repetitivo. |
| **Funcionalidades que usaría** | Gestión de reportes y moderación (RF-09), cierre de debates y resumen (RF-10), además de las funcionalidades del Crítico cuando participa como usuario (RF-01 a RF-08), en particular la lectura de reseñas y debates para evaluar el contexto de los reportes. |
| **Dispositivo de acceso probable** | Principalmente **notebook o computador de escritorio**, por la necesidad de revisar varios reportes en paralelo, y **smartphone** para atender casos urgentes de forma puntual. |

---

