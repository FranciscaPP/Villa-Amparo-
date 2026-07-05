# Villa Amparo 🏡⭐

Juego educativo mobile-first para aprender a leer y escribir en español, con la
forma de un juego de exploración 3D tipo obby: un pueblito mágico, un avatar que
camina libre, personajes tiernos que entregan misiones, y recompensas —donde cada
misión es una actividad de lectoescritura disfrazada de juego.

**Stack elegido:** Web con React Three Fiber (PWA para Android). Ver el análisis
completo en la documentación de diseño.

## Documentación de diseño

| Documento | Contenido |
|---|---|
| [00 — Visión y stack](docs/00-vision-y-stack.md) | Análisis de React Native vs. Web/R3F vs. Unity, recomendación y riesgos |
| [01 — Arquitectura](docs/01-arquitectura.md) | Capas 3D/2D, estructura de carpetas, flujo de juego, sistema de voz, controles |
| [02 — Gameplay y mapa](docs/02-gameplay-y-mapa.md) | Fantasía, loop de juego, personajes y primer mapa de Villa Amparo |
| [03 — Misiones educativas](docs/03-misiones-educativas.md) | Base pedagógica, catálogo de 8 minijuegos, dificultad adaptativa |
| [04 — Modelo de datos](docs/04-modelo-de-datos.md) | Esquema de progreso, recompensas, modo mamá y persistencia |
| [05 — Plan MVP](docs/05-plan-mvp.md) | Fases 0–4, qué hacer rápido y qué dejar para después |

## Principios del producto

- Muy visual, letras y botones grandes, sin textos largos.
- Todo guiado por voz: instrucciones habladas, personajes que hablan, refuerzo positivo.
- Parece juego, no tarea: humor, colores, premios y personajes tiernos.
- Nunca hay "game over": equivocarse da una pista y otra oportunidad.
- $0 en infraestructura: sin backend, sin cuentas, funciona offline.
