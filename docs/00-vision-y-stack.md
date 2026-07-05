# Villa Amparo — Visión y Análisis de Stack

## 1. Visión del producto

**Villa Amparo** es un juego educativo mobile-first para una niña de 6 años que está
aprendiendo a leer y escribir en español. La experiencia se inspira en juegos tipo
Roblox/Obby: un mundo 3D colorido, un avatar que camina libremente, personajes que
entregan misiones, y recompensas por completarlas — pero cada misión es en realidad
una actividad de lectoescritura disfrazada de juego.

**Principio rector:** el mundo 3D es el *envoltorio motivacional* (exploración,
personajes, premios); las actividades educativas son *minijuegos 2D superpuestos*
con letras gigantes y botones grandes. Esta separación es la decisión de diseño más
importante del proyecto: hace que lo educativo sea legible y accesible, y que lo 3D
sea simple de construir.

## 2. Criterios de evaluación

| Criterio | Peso | Por qué importa |
|---|---|---|
| Android | Alto | Es el dispositivo objetivo |
| Juego 3D simple | Alto | Estética tipo Roblox/Obby, low-poly |
| Voz (TTS + reconocimiento) | Alto | Todo debe estar guiado por voz; la niña aún no lee bien |
| Bajo costo | Alto | Presupuesto ~$0 en infra |
| Facilidad de iterar con IA | Alto | El desarrollo será asistido por IA, con ciclos rápidos |
| Usable por una niña de 6 años | Crítico | Botones grandes, sin fricción, sin logins |

## 3. Comparación de stacks

### Opción A — React Native + Expo

| Criterio | Evaluación |
|---|---|
| Android | ✅ Nativo, publicable en Play Store |
| 3D simple | ⚠️ `expo-gl` + Three.js funciona pero es frágil: rendimiento irregular, debugging difícil, ecosistema 3D inmaduro en RN |
| Voz | ✅ `expo-speech` (TTS) bien; reconocimiento requiere librerías nativas extra |
| Costo | ✅ Gratis (EAS tiene tier gratuito limitado) |
| Iterar con IA | ⚠️ Cada cambio 3D requiere probar en dispositivo/emulador; ciclo lento |
| Niña de 6 años | ✅ App instalada, pantalla completa |

**Veredicto:** buena para apps móviles convencionales, débil justo en lo que este
proyecto más necesita (3D + iteración rápida).

### Opción B — Web con Three.js / React Three Fiber (R3F) ⭐ RECOMENDADA

| Criterio | Evaluación |
|---|---|
| Android | ✅ Chrome Android soporta WebGL muy bien; instalable como PWA (ícono en pantalla de inicio, pantalla completa, offline). Más adelante se puede empaquetar como TWA/Capacitor para Play Store sin reescribir nada |
| 3D simple | ✅ R3F + drei es el ecosistema más productivo para 3D low-poly declarativo; enorme cantidad de ejemplos |
| Voz | ✅ Web Speech API: `speechSynthesis` con voces en español incluidas en Android (gratis, funciona offline con voces Google TTS); `SpeechRecognition` funciona en Chrome Android para "leer en voz alta" (requiere internet) |
| Costo | ✅ $0: hosting estático gratis (Vercel/GitHub Pages), sin backend en MVP (progreso en localStorage/IndexedDB) |
| Iterar con IA | ✅✅ El ciclo más rápido posible: código TypeScript/React estándar, hot-reload en navegador, probable/verificable sin emuladores ni builds. Ideal para desarrollo asistido por IA |
| Niña de 6 años | ✅ Se abre desde un ícono en la pantalla de inicio como cualquier app; sin logins ni tiendas |

**Veredicto:** gana en todos los criterios. El único riesgo (que "no parezca app")
se resuelve con PWA + modo pantalla completa.

### Opción C — Unity

| Criterio | Evaluación |
|---|---|
| Android | ✅ Excelente |
| 3D simple | ✅✅ El mejor motor 3D, pero es sobredimensionado para un obby low-poly |
| Voz | ⚠️ TTS requiere plugins/servicios pagos o integración nativa |
| Costo | ⚠️ Gratis bajo umbral de ingresos, pero pipeline de assets y builds pesados |
| Iterar con IA | ❌ C# + editor visual + escenas binarias: el peor caso para iterar con IA; los cambios de escena no son revisables como texto |
| Niña de 6 años | ✅ App nativa |

**Veredicto:** solo se justifica si el juego evoluciona a física compleja,
multijugador o gráficos avanzados. Para este alcance, es pagar complejidad sin
retorno.

## 4. Recomendación final

> **Web con React Three Fiber, como PWA mobile-first.**

**Stack concreto:**

| Capa | Tecnología | Razón |
|---|---|---|
| Framework | React 18 + TypeScript + Vite | Estándar, rápido, tipado ayuda a la IA a no romper cosas |
| 3D | React Three Fiber + drei | 3D declarativo; el mundo se define como componentes React |
| Estado | Zustand | Simple, sin boilerplate, fácil de persistir |
| Voz (salida) | Web Speech API (`speechSynthesis`) | Gratis, voces es-ES/es-MX/es-CL nativas de Android |
| Voz (entrada) | Web Speech API (`SpeechRecognition`) | Para "leer en voz alta" (Fase 4, requiere internet) |
| Audio/SFX | Howler.js | Sonidos de premio, música ambiente |
| Persistencia | localStorage + IndexedDB | Sin backend, sin cuentas, offline, $0 |
| Hosting | Vercel (o GitHub Pages) | Deploy automático desde el repo, $0 |
| Play Store (futuro) | TWA (Bubblewrap) o Capacitor | Empaqueta la misma web sin reescribir |

**Ruta de escape:** si algún día se necesita sincronizar progreso entre dispositivos
o cuentas familiares, se agrega Supabase (auth + Postgres) sin tocar el juego — la
capa de persistencia queda aislada detrás de una interfaz desde el día uno
(ver `04-modelo-de-datos.md`).

## 5. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Rendimiento WebGL en teléfonos de gama baja | Mundo low-poly con primitivas y materiales planos; sin sombras dinámicas; límite de ~50 objetos visibles |
| Calidad de voces TTS del sistema | Las voces Google TTS en español son buenas; para los personajes se pueden pre-grabar frases clave (audio estático) y usar TTS solo para contenido dinámico (palabras nuevas del modo mamá) |
| `SpeechRecognition` necesita internet | Es funcionalidad de Fase 4, no bloquea el MVP; el juego completo funciona offline |
| La niña cierra el navegador sin querer | PWA instalada abre en `standalone` (sin barra de navegación); orientación bloqueada en landscape |
