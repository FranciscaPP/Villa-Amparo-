# Villa Amparo — Plan MVP por Fases

Principio: **que la niña juegue algo real lo antes posible.** Cada fase termina en
algo jugable en su teléfono/tablet, y su reacción decide los ajustes de la fase
siguiente. La niña es la QA principal del proyecto.

## Fase 0 — Prototipo caminable (lo primero que se construye)

**Meta:** validar que el mundo 3D corre bien en el dispositivo real y que el loop
básico engancha.

- [ ] Proyecto Vite + React + TypeScript + R3F, deploy automático a Vercel.
- [ ] Plaza central con piso, 3 casas de colores (primitivas) y cielo.
- [ ] Avatar simple (cápsula con cara/estilo muñeco) que camina con joystick táctil.
- [ ] Cámara en tercera persona que sigue al avatar.
- [ ] 1 NPC (Doña Búho) con ❗, que al acercarse habla por TTS.
- [ ] 1 minijuego completo: **Caza Letras** (vocales), con voz, refuerzo y confeti.
- [ ] Contador de estrellas persistente en localStorage.
- [ ] PWA instalable (ícono + pantalla completa + landscape).

**Criterio de éxito:** la niña camina, habla con el búho, atrapa vocales y pide
jugar de nuevo. Si el 3D va lento en el dispositivo real, es el momento de
simplificar (aquí el riesgo técnico es más barato de corregir).

## Fase 1 — MVP de lectura

**Meta:** el juego enseña de verdad a leer.

- [ ] Mapa completo: 5 zonas + decoración low-poly.
- [ ] Los 5 NPCs con voces diferenciadas y diálogos.
- [ ] 4 minijuegos de lectura: Caza Letras, Fábrica de Sílabas, Parejas del
      Mercado, Palabra Incompleta.
- [ ] Motor de misiones: rondas, pistas escalonadas, estrellas 1–3, monedas.
- [ ] Banco de contenido niveles 1–3 (~80 palabras) con emoji.
- [ ] Dificultad adaptativa + cola de repaso de palabras falladas.
- [ ] Registro completo de resultados (`MissionResult`, `ItemMastery`).
- [ ] Chispa el perrito siguiendo al avatar y celebrando.

## Fase 2 — Recompensas y escritura

**Meta:** motivación a largo plazo + segunda mitad pedagógica.

- [ ] Tienda del Parque Estrella: gastar monedas.
- [ ] Álbum de stickers (con voz al tocar cada uno).
- [ ] Ropa del avatar (4–6 piezas: gorros, colores) y 2 mascotas desbloqueables.
- [ ] Casita de Amparo (interior simple para personalizar).
- [ ] 3 minijuegos de escritura: Copia la Carta, Letras Revueltas, Respóndeme
      (con teclado grande de letras).
- [ ] Leo con Luna (frases cortas, niveles 4–5).
- [ ] Contenido niveles 4–5 completo.

## Fase 3 — Modo mamá

**Meta:** visibilidad y control parental.

- [ ] Acceso protegido (mantener presionado 3 seg + PIN).
- [ ] Dashboard: progreso por habilidad, palabras aprendidas, racha.
- [ ] Vista de errores: qué falló, cuántas veces, qué eligió en su lugar.
- [ ] Agregar palabras nuevas (con división silábica automática editable y emoji).
- [ ] Fijar/bloquear dificultad por habilidad.
- [ ] Exportar/importar respaldo JSON.

## Fase 4 — Pulido y extras

- [ ] "Leer en voz alta": la niña lee la frase al micrófono y el juego verifica
      (`SpeechRecognition`); recompensa doble. Requiere internet — degradación
      elegante si no hay.
- [ ] Audio pre-grabado para los saludos/celebraciones de los NPCs.
- [ ] Trazado de letras con el dedo (canvas) en Copia la Carta.
- [ ] Música ambiente + más SFX.
- [ ] Empaquetado TWA para Play Store (si se quiere instalar "de verdad").
- [ ] Zonas nuevas del mapa (Bosque de los Cuentos; Montaña de los Números para
      sumas/restas, alineado con la visión original del README).

## Qué es rápido vs. qué dejar para después

### Rápido y de alto impacto (hacer primero)
| Qué | Por qué es rápido |
|---|---|
| TTS con Web Speech API | API de una línea, voces ya instaladas en Android |
| Minijuegos 2D con emoji como imágenes | HTML/CSS puro, cero producción de assets |
| Mundo low-poly con primitivas | Cajas y cilindros de colores quedan bien con buena paleta |
| Joystick + cámara que sigue | Patrón resuelto en el ecosistema R3F |
| Persistencia localStorage | Zustand `persist` lo da casi gratis |
| Confeti, estrellas, sonidos de premio | Librerías listas (canvas-confetti, howler) |

### Dejar para después (caro o innecesario al inicio)
| Qué | Por qué esperar |
|---|---|
| Reconocimiento de voz | Requiere internet, precisión variable con voz infantil; el juego funciona completo sin él |
| Modelos 3D con esqueleto/animaciones | Las primitivas + animación procedural (bob al caminar) bastan para el MVP |
| Ilustraciones propias | Los emoji cubren el 95% del vocabulario infantil |
| Backend / cuentas / nube | Un solo dispositivo, un solo perfil: localStorage basta; el export JSON es el respaldo |
| Play Store | La PWA instalada es indistinguible de una app para la niña |
| Multijugador / chat | Fuera de alcance por diseño (seguridad y complejidad) |
| Trazado de letras con el dedo | Reconocer trazos bien hechos es difícil; el teclado grande enseña igual el orden de las letras |

## Riesgo principal por fase

- **F0:** rendimiento WebGL en el dispositivo real → probar en el teléfono/tablet objetivo la primera semana.
- **F1:** que las misiones se sientan "tarea" → sesiones de prueba con la niña; ajustar humor, ritmo y duración de rondas.
- **F2:** economía aburrida (monedas sin nada que comprar) → lanzar tienda con ≥10 ítems.
- **F3:** —bajo riesgo, es un CRUD.
- **F4:** precisión de `SpeechRecognition` con voz de 6 años → tratarlo como bonus, nunca como bloqueo de progreso.
