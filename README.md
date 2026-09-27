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
