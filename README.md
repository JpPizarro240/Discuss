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
```

---

## 📌 Justificación del problema y caracterización de usuarios objetivo

### 1. Justificación del problema

El consumo de series y películas ha dejado de ser una actividad puramente individual: los espectadores comparten calificaciones, reseñas y opiniones en plataformas digitales antes, durante y después de ver un título. Sin embargo, el análisis de las soluciones existentes (fuentes secundarias) revela brechas que motivan el desarrollo de **Discuss**.

**Análisis de soluciones existentes**

- **Agregadores de calificaciones (IMDb, Rotten Tomatoes, Metacritic).** Ofrecen puntuaciones globales y reseñas, pero reducen la opinión del público a un número o a una clasificación binaria. La literatura periodística y divulgativa documenta que estos sistemas son vulnerables al *review bombing* (oleadas coordinadas de calificaciones extremas ajenas a la calidad de la obra) y a la manipulación de puntajes; incluso Rotten Tomatoes modificó su sistema de calificación de usuarios para mitigar este fenómeno [1][2][3]. Además, el intercambio entre usuarios es limitado: las reseñas se publican de forma aislada, sin un espacio que las confronte entre sí.
- **Redes sociales cinéfilas (Letterboxd).** Se presenta como una red social para el descubrimiento de cine y ha ganado relevancia como espacio de registro, reseña y recomendación entre aficionados [4][5]. No obstante, su eje es el registro personal y la interacción social ligera (listas, "me gusta", comentarios), no un formato de discusión que obligue a sostener una postura con argumentos y a confrontarla con la contraria.
- **Foros y comunidades abiertas (por ejemplo, subforos de cine en Reddit).** Permiten conversaciones extensas, pero al ser hilos abiertos y no estructurados, los argumentos se mezclan con bromas, spoilers y ataques personales, y la calidad del debate depende casi por completo de la moderación voluntaria de cada comunidad. No existe una separación explícita entre reseña, calificación y argumentación.

**Problema identificado**

Ninguna de las alternativas analizadas integra en un mismo espacio (a) una calificación desglosada por criterios, (b) reseñas fundamentadas y (c) **debates con estructura formal** (tesis, postura declarada, refutación y cierre con resumen), respaldados por un mecanismo de moderación que preserve la calidad de la conversación. Como consecuencia, los espectadores interesados en discutir con profundidad una obra deben recurrir a múltiples plataformas, enfrentando ruido, polarización y falta de trazabilidad de los argumentos.

**Propuesta de valor**

Discuss busca cubrir esa brecha ofreciendo una plataforma donde la opinión sobre series y películas se exprese mediante reseñas, calificaciones por criterios y debates estructurados, con herramientas de votación de utilidad y moderación que privilegien la argumentación por sobre la mera reacción.

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

> ⚠️ **Nota aclaratoria:** Esta caracterización de usuarios es **preliminar** y se basa en **fuentes secundarias y supuestos razonados** por el equipo de desarrollo. Las proto-personas descritas son **hipotéticas** y **no provienen de entrevistas, encuestas ni observación de usuarios reales**. Deberán validarse y refinarse en etapas posteriores del proyecto mediante técnicas de investigación con usuarios.

---

### 📚 Referencias

1. MovieWeb. *Rotten Tomatoes Review Bombing Being Challenged by New Rating System.* https://movieweb.com/rotten-tomatoes-new-rating-system-combat-review-bombing/
2. Gulf News. *Rotten Tomatoes tweaks ratings to stop trolls.* https://gulfnews.com/amp/story/entertainment%2Fhollywood%2Frotten-tomatoes-tweaks-ratings-to-stop-trolls-1.62343770
3. IMDb News. *Rotten Tomatoes: PR company accused of manipulating scores by paying for reviews.* https://www.imdb.com/news/ni64228331/
4. Letterboxd. *Social film discovery.* https://letterboxd.com/
5. The Mancunion (2026). *Letterboxd: Exposing student habits and opinions on 'the social network for film lovers'.* https://mancunion.com/2026/05/29/letterboxd-student-habits-and-opinions/

---

## 🧭 EP 1.4: Arquitectura de Navegación y Experiencia del Usuario

La arquitectura de navegación de **Discuss** se organiza como una aplicación de una sola página (SPA) con **`IonReactRouter`**, combinando una barra de pestañas persistente (`IonTabs`) para las secciones de primer nivel con pilas de navegación independientes (`IonRouterOutlet`) por pestaña, de modo que cada rama del árbol mantiene su propio historial sin perder el estado de las demás.

### a) Rutas principales y secundarias (URLs)

| Ruta | Nivel | Vista | Rol requerido | Descripción |
|------|-------|-------|----------------|--------------|
| `/login` | Principal | Inicio de sesión | Público | Autenticación de usuarios existentes. |
| `/register` | Principal | Registro | Público | Alta de nuevas cuentas (rol Crítico por defecto). |
| `/app/home` | Principal | Catálogo / Home | Crítico, Moderador | Listado de títulos destacados y recientes (tab 1). |
| `/app/home/title/:id` | Secundaria | Detalle de título | Crítico, Moderador | Ficha del título con pestañas internas (Reseñas, Calificación, Debates). |
| `/app/home/title/:id/reviews` | Secundaria | Listado de reseñas | Crítico, Moderador | Reseñas del título (RF-01). |
| `/app/home/title/:id/reviews/new` | Terciaria | Nueva reseña | Crítico | Formulario de publicación (RF-01). |
| `/app/home/title/:id/rating` | Secundaria | Calificación por criterios | Crítico | Formulario de calificación desglosada (RF-02). |
| `/app/home/title/:id/debates` | Secundaria | Listado de debates del título | Crítico, Moderador | Debates asociados a ese título (RF-03). |
| `/app/home/title/:id/debates/new` | Terciaria | Nuevo debate | Crítico | Creación de tesis y categoría (RF-03). |
| `/app/debate/:debateId` | Secundaria | Detalle del debate | Crítico, Moderador | Argumentos por postura, votación y respuestas (RF-04, RF-05). |
| `/app/debate/:debateId/argument/new` | Terciaria | Nuevo argumento | Crítico | Publicación de argumento posicionado (RF-04). |
| `/app/debate/:debateId/summary` | Secundaria | Resumen de cierre | Crítico, Moderador | Vista de resultados al cerrar un debate (RF-10). |
| `/app/search` | Principal | Búsqueda y filtrado | Crítico, Moderador | Exploración del catálogo (RF-06) (tab 2). |
| `/app/debates` | Principal | Debates activos (global) | Crítico, Moderador | Debates abiertos en toda la plataforma (tab 3). |
| `/app/notifications` | Principal | Notificaciones | Crítico, Moderador | Avisos de respuestas, votos y resultados de reportes (tab 4). |
| `/app/profile` | Principal | Perfil propio | Crítico, Moderador | Reseñas, calificaciones y debates del usuario (tab 5). |
| `/app/profile/:username` | Secundaria | Perfil público | Crítico, Moderador | Actividad pública de otro usuario. |
| `/app/profile/edit` | Secundaria | Edición de perfil | Crítico, Moderador | Edición y eliminación de aportes propios (RF-07). |
| `/app/moderation` | Secundaria (condicional) | Panel de moderación | **Moderador** | Punto de entrada a las herramientas de supervisión (RF-09). |
| `/app/moderation/reports` | Terciaria | Cola de reportes | **Moderador** | Listado priorizado de reportes pendientes (RF-08, RF-09). |
| `/app/moderation/reports/:id` | Terciaria | Detalle de un reporte | **Moderador** | Contenido reportado + acciones de moderación (RF-09). |
| `/app/moderation/debates/:id/close` | Terciaria | Cierre forzado de un debate | **Moderador** | Cierre anticipado con registro de motivo (RF-10). |

### b) Relaciones jerárquicas entre las vistas

```
/                                       → Redirección según sesión y rol
├── /login                             → Inicio de sesión
├── /register                          → Registro de cuenta
│
└── /app  (IonTabs — requiere sesión iniciada)
    ├── /app/home                              → Catálogo / Home (tab 1)
    │   └── /app/home/title/:id                → Detalle de título
    │       ├── /app/home/title/:id/reviews         → Listado de reseñas
    │       │   └── /app/home/title/:id/reviews/new     → Nueva reseña
    │       ├── /app/home/title/:id/rating            → Calificación por criterios
    │       └── /app/home/title/:id/debates           → Listado de debates del título
    │           ├── /app/home/title/:id/debates/new      → Nuevo debate
    │           └── /app/debate/:debateId                 → Detalle del debate
    │               ├── /app/debate/:debateId/argument/new   → Nuevo argumento
    │               └── /app/debate/:debateId/summary        → Resumen de cierre
    │
    ├── /app/search                             → Búsqueda y filtrado (tab 2)
    ├── /app/debates                            → Debates activos globales (tab 3)
    ├── /app/notifications                      → Notificaciones (tab 4)
    └── /app/profile                            → Perfil propio (tab 5)
        ├── /app/profile/:username                  → Perfil público de otro usuario
        ├── /app/profile/edit                       → Edición de perfil
        └── /app/moderation                         → Panel de moderación (solo Moderador)
            ├── /app/moderation/reports                 → Cola de reportes
            ├── /app/moderation/reports/:id             → Detalle de un reporte
            └── /app/moderation/debates/:id/close       → Cierre forzado de un debate
```

Cada pestaña (`Home`, `Buscar`, `Debates`, `Notificaciones`, `Perfil`) es la raíz de su propia pila de navegación; las vistas de detalle (título, debate, reporte) son hijas de esa raíz y nunca vistas de primer nivel, lo que mantiene la barra de pestañas visible y el contexto de "desde dónde llegué" siempre disponible.

### c) Flujo de navegación entre funcionalidades (task flow principal)

Flujo principal: **descubrir un título → formarse una opinión → discutirla.**

1. El usuario abre la app en `/app/home` y explora el catálogo o usa `/app/search` con filtros (RF-06).
2. Selecciona un título → navega a `/app/home/title/:id`, donde ve el promedio de calificación y pestañas internas (Reseñas, Calificación, Debates).
3. Desde la pestaña **Calificación**, asigna su puntuación por criterios (RF-02) sin salir de la ficha del título.
4. Desde la pestaña **Reseñas**, puede leer aportes existentes o pulsar "Nueva reseña" → `.../reviews/new` (RF-01); al guardar, vuelve automáticamente al listado.
5. Desde la pestaña **Debates**, entra a un debate abierto (`/app/debate/:debateId`) o crea uno nuevo (`.../debates/new`) definiendo la tesis (RF-03).
6. Dentro del debate, antes de poder escribir, el sistema exige declarar una postura (**A favor / En contra / Neutral**); solo entonces se habilita el botón "Argumentar" → `.../argument/new` (RF-04).
7. El usuario vota la utilidad de los argumentos de otros participantes directamente en el hilo (RF-05), sin cambiar de ruta.
8. Si el debate se cierra (por el creador o por un Moderador), la app redirige a `.../summary`, mostrando el resumen final (RF-10).
9. En cualquier paso, el usuario puede reportar un aporte (RF-08) mediante una acción contextual (botón o menú de opciones) que abre un modal, sin abandonar la vista actual.

Flujo paralelo del Moderador: `/app/moderation/reports` → selecciona un reporte → `.../reports/:id` (ve el contenido en contexto) → decide (ocultar / restaurar / eliminar) → el sistema notifica al autor y regresa a la cola actualizada (RF-09).

### d) Diferenciación de acceso según los roles

| Aspecto | Crítico | Moderador |
|---------|---------|-----------|
| Pestañas visibles | Home, Buscar, Debates, Notificaciones, Perfil | Las mismas, más acceso a **Moderación** desde Perfil |
| Rutas de creación (`/reviews/new`, `/debates/new`, `/argument/new`) | Habilitadas | Habilitadas (puede participar como Crítico) |
| `/app/moderation/*` | **Oculta y bloqueada** (route guard redirige a `/app/home` o a una vista 403) | Habilitada |
| Acciones de moderación (ocultar, restaurar, eliminar, cerrar debate) | No visibles en la interfaz | Visibles como acciones contextuales adicionales en reseñas, argumentos y debates |
| Verificación de permisos | Guard declarativo (`<RoleRoute allowedRoles={['critico','moderador']}>`) evalúa el rol antes de renderizar la ruta | Igual mecanismo, con `allowedRoles={['moderador']}` en rutas exclusivas |

La diferenciación se implementa en dos capas: (1) a nivel de **interfaz**, ocultando o deshabilitando controles según el rol para no exponer acciones no disponibles; y (2) a nivel de **enrutamiento**, mediante guards que interceptan la navegación directa por URL. Se asume, además, que el backend replica esta validación de forma independiente, ya que el control de acceso en el frontend es una medida de usabilidad y no un mecanismo de seguridad suficiente por sí solo (ver RNF-04).

### e) Puntos críticos de interacción

- **Declaración de postura obligatoria** antes de argumentar en un debate: es el punto donde más fácilmente se pierde al usuario si el flujo no es claro, por lo que se resuelve con un paso explícito (modal o selector) y no con un campo opcional dentro del formulario.
- **Publicación de reseñas y argumentos**: incluye validación en tiempo real (longitud, etiqueta de spoiler) y confirmación visual (`IonToast`) para reducir el riesgo de publicaciones duplicadas o incompletas.
- **Reporte de contenido**: acción de bajo compromiso pero alto impacto; se diseña como un acceso rápido (ícono contextual) para no desincentivar su uso, con un modal de un solo paso.
- **Acciones de moderación destructivas** (ocultar, eliminar, cerrar debate): requieren confirmación explícita, ya que son reversibles solo parcialmente y afectan a terceros.
- **Cambio de pestaña con formulario en curso**: al tener pilas de navegación independientes por tab, un borrador de reseña o argumento no se pierde si el usuario cambia de pestaña por error; se conserva en el estado del componente hasta que se publica o se descarta explícitamente.
- **Carga de listados extensos** (reseñas, argumentos, catálogo): el punto crítico de rendimiento percibido; se resuelve con scroll infinito y paginación (RNF-02) para que la navegación no se perciba como lenta al entrar a un título con mucha actividad.

### f) Coherencia de experiencia entre dispositivos (móvil y web)

Al usar Ionic sobre un único código base en React, la coherencia entre plataformas se logra mediante:

- **Modo adaptativo de Ionic**: los componentes (`IonTabs`, `IonHeader`, transiciones) adoptan automáticamente convenciones iOS o Material Design según la plataforma detectada, sin duplicar vistas.
- **Layout responsivo con `IonGrid`/`IonSplitPane`**: en móvil, la navegación principal se muestra como barra de pestañas inferior; en pantallas de escritorio o tablet en horizontal, el mismo árbol de rutas se expone como un menú lateral persistente (`IonSplitPane`), sin cambiar las URLs ni la jerarquía definida en (b).
- **Gestos nativos donde corresponde**: swipe-back y pull-to-refresh en móvil; en web se ofrecen los equivalentes por botón y teclado, manteniendo la misma acción disponible en ambos entornos.
- **Mismo árbol de rutas y mismos guards de rol** en ambas plataformas: no existen vistas exclusivas de una plataforma para funcionalidades RF-01 a RF-10, lo que evita que un Crítico o Moderador tenga capacidades distintas según el dispositivo.
- **Sistema visual único** (colores, tipografía, modo claro/oscuro de RNF-08) aplicado a través de variables de Ionic (`ionic.config`/CSS variables), de forma que el "salto" entre dispositivos no implique reaprender la interfaz.

### g) Justificación técnica de las decisiones adoptadas

- **Usabilidad**: la estructura de pestañas de primer nivel (Home, Buscar, Debates, Notificaciones, Perfil) refleja las cinco tareas centrales del producto y mantiene la profundidad de navegación baja (máximo 3-4 niveles hasta cualquier acción), lo que reduce la carga cognitiva y el número de toques necesarios para completar el flujo principal descrito en (c).
- **Eficiencia de interacción**: al anidar las vistas de Reseñas, Calificación y Debates como pestañas internas de un mismo título (en vez de rutas hermanas independientes), se evita recargar el contexto del título (imagen, sinopsis, promedio) cada vez que el usuario cambia de aspecto a evaluar, disminuyendo peticiones repetidas y transiciones de pantalla completa.
- **Claridad estructural**: la separación entre rutas de **lectura** (`/reviews`, `/debates`), **creación** (`/reviews/new`, `/debates/new`, `/argument/new`) y **moderación** (`/moderation/*`) hace explícito en la propia URL qué tipo de acción se está realizando, lo que facilita tanto la comprensión del usuario como el mantenimiento del código (un componente por tipo de ruta, sin vistas mixtas).
- **Escalabilidad de la arquitectura frontend**: el uso de guards declarativos por rol (`<RoleRoute>`) en lugar de condicionales dispersos en cada componente permite agregar futuros roles (por ejemplo, un rol "Editorial" o "Administrador") sin modificar las vistas existentes, solo registrando nuevas reglas de acceso. Combinado con `React.lazy` y rutas anidadas por `IonRouterOutlet` (ya definido en RNF-01), cada rama del árbol de navegación se carga de forma independiente, de modo que agregar nuevas vistas (por ejemplo, un futuro `/app/rankings`) no incrementa el tiempo de carga inicial de las vistas ya existentes.