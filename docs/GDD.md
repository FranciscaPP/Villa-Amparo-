# GAME DESIGN DOCUMENT — VILLA AMPARO
## Versión 1.0 | Mayo 2026

---

## ÍNDICE

1. [Visión General](#1-visión-general)
2. [Público Objetivo](#2-público-objetivo)
3. [Principios de Diseño](#3-principios-de-diseño)
4. [Historia y Narrativa](#4-historia-y-narrativa)
5. [Creación de Avatar](#5-creación-de-avatar)
6. [Mecánicas Core](#6-mecánicas-core)
7. [Sistema de Voz](#7-sistema-de-voz)
8. [Sistema Educativo Integrado](#8-sistema-educativo-integrado)
9. [Sistema de Misiones](#9-sistema-de-misiones)
10. [Mapa del Mundo](#10-mapa-del-mundo)
11. [Construcción del Hogar](#11-construcción-del-hogar)
12. [Personajes NPC](#12-personajes-npc)
13. [Sistema Emocional](#13-sistema-emocional)
14. [Sistema de Recompensas](#14-sistema-de-recompensas)
15. [IA Adaptativa](#15-ia-adaptativa)
16. [Controles e Interfaz](#16-controles-e-interfaz)
17. [Audio y Música](#17-audio-y-música)
18. [Arte y Estética Visual](#18-arte-y-estética-visual)

---

## 1. VISIÓN GENERAL

### Concepto Central

**Villa Amparo** es un videojuego de mundo abierto educativo donde los niños de 5 a 8 años exploran un universo mágico y colorido, completan misiones de aventura, construyen su hogar ideal y hacen amigos — todo mientras aprenden lectura, escritura, fonética, matemáticas y pensamiento lógico de forma completamente natural.

### Premisa Narrativa

Villa Amparo era un pueblo mágico lleno de alegría, pero una tormenta de "palabras perdidas" dispersó todas las letras, los números y las historias por el mundo. El niño llega al pueblo como un héroe explorador y, al reunir letras, palabras, números e historias, reconstruye Villa Amparo y la convierte en el lugar más bello y próspero del mundo.

**Tagline:** *"Cada letra que aprendes, hace que Villa Amparo brille más."*

### Género

- RPG de mundo abierto educativo
- Sandbox de construcción
- Aventura de exploración

### Plataformas MVP

- Web (navegador moderno — Chrome, Safari, Firefox)
- Tablet (iPad, Android Tablet)
- Desktop (Mac, Windows)

### Clasificación de Edad

- ESRB: E (Everyone)
- PEGI: 3+
- Dirigido a: 5-8 años (uso también supervisado para 4 años)

---

## 2. PÚBLICO OBJETIVO

### Jugador Primario
- **Edad:** 5 a 8 años
- **Perfil:** Niños en etapa preescolar y primaria temprana
- **Característica clave:** Puede no saber leer — el juego funciona 100% por audio
- **Motivaciones:** Explorar, personalizar, coleccionar, ser el héroe

### Jugador Secundario (Padres/Educadores)
- Padres que buscan alternativas educativas al entretenimiento digital
- Educadores de kinder y primaria
- Necesidades: Panel de progreso, reportes, seguridad total de contenido

### Insights Clave del Público

| Necesidad del Niño | Solución en el Juego |
|--------------------|----------------------|
| Sentirse poderoso | Es el héroe que salva Villa Amparo |
| Recompensas inmediatas | Cada acción correcta genera monedas/objetos al instante |
| Personalización | Avatar, casa, jardín completamente personalizables |
| No frustración | Jamás aparece "incorrecto" — solo animación y reintento amigable |
| Autonomía | Todo narrado por voz — no necesita ayuda adulta |

---

## 3. PRINCIPIOS DE DISEÑO

### P1: El Aprendizaje Es Invisible
El niño nunca debe percibir que está "estudiando". Las actividades educativas están disfrazadas de misiones, juegos, exploración y construcción. El aprendizaje ocurre como consecuencia natural del juego.

### P2: Audio Primero
Dado que el jugador objetivo puede no saber leer, **todo** está narrado:
- Botones de menú
- Instrucciones de misiones
- Retroalimentación de respuestas
- Tutoriales
- Diálogos de NPCs
- Nombres de objetos al pasar el cursor

### P3: Recompensa Constante
No existe acción de aprendizaje sin recompensa. El ciclo de retroalimentación positiva es inmediato (menos de 2 segundos entre acción y recompensa).

### P4: Positividad Radical
El vocabulario de error no existe. Ante respuestas incorrectas:
- Animación simpática (NPC se rasca la cabeza)
- Frases de aliento: "¡Casi!", "¡Vamos juntos!", "¡Buen intento!"
- Pista visual/auditiva gradual
- Si falla 3 veces → respuesta revelada con celebración ("¡Ahí está, la encontramos!")

### P5: Progresión Visible
El niño debe ver cómo Villa Amparo crece con cada cosa que aprende. El progreso es visual, inmediato y espectacular.

### P6: Autonomía Total
Un niño de 5 años sin saber leer puede jugar solo desde el primer segundo. Sin tutoriales de texto. Sin menús complejos.

### P7: Diversión ante Todo
Si una mecánica educativa no es divertida, se rediseña hasta serlo. La educación sigue a la diversión, nunca al revés.

---

## 4. HISTORIA Y NARRATIVA

### Prólogo (Cutscene Animada — 90 segundos)

```
ESCENA: Cielo estrellado. Una villa colorida y brillante.

VOZ NARRADORA (cálida, mágica):
"Hace mucho tiempo, existía un pueblo llamado Villa Amparo.
Era el lugar más alegre del mundo..."

[Imágenes de Villa Amparo próspera: casas coloridas, 
 jardines, niños jugando, letras flotando en el aire]

"Pero un día... llegó la Tormenta de las Palabras Perdidas."

[Tormenta oscura. Las letras vuelan. Las casas se apagan.]

"Las letras volaron. Los números desaparecieron.
Las historias se olvidaron..."

[Villa Amparo queda gris, vacía, triste]

"Villa Amparo necesita un héroe."

[Zoom hacia la pantalla de creación de personaje]

"Y ese héroe... ¡eres tú!"
```

### Estructura Narrativa por Actos

#### Acto 1: La Llegada (Semanas 1-2 de juego)
- El niño llega a Villa Amparo con una mochila vacía y una pequeña cabaña
- Conoce a Lumi (su guía de luz) y los primeros habitantes
- Misión: Encontrar las primeras 5 letras perdidas del Bosque de Letras
- Recompensa: Su cabaña se ilumina y el jardín florece

#### Acto 2: La Reconstrucción (Semanas 3-6)
- Exploración de las zonas del mundo
- Reunir palabras, historias y números
- Construcción y personalización del hogar
- Nuevos amigos NPC se mudan al pueblo

#### Acto 3: El Gran Festival (Semana 7+)
- Villa Amparo completamente restaurada
- Gran celebración con todos los personajes
- Nuevas zonas desbloqueadas (Isla Matemática, Mundo Submarino)
- Modo: "Guardián de Villa Amparo" — desafíos avanzados

### Personaje Guía Principal: LUMI

Lumi es una pequeña estrella que sigue al niño en toda su aventura.

- **Voz:** Suave, entusiasta, nunca condescendiente
- **Función:** Narrar instrucciones, celebrar logros, dar pistas
- **Personalidad:** Curiosa, alegre, nunca impaciente
- **Diseño:** Estrella de 5 puntas con cara expresiva, deja rastro de luz al moverse

---

## 5. CREACIÓN DE AVATAR

### Flujo Completo de Creación (Narrado por Lumi)

```
PANTALLA 1: Bienvenida
Lumi: "¡Hola! Soy Lumi. Voy a ser tu amiga en Villa Amparo."
Lumi: "Primero vamos a crear tu personaje."
Lumi: "¡Va a ser muy divertido!"
[Botón: ¡Vamos! — narrado al pasar el cursor]

PANTALLA 2: Selección de Base
Lumi: "¿Cómo quieres que se vea tu personaje?"
[Opciones visuales grandes, sin texto]
- Personaje A (forma redondeada, estilo Roblox)
- Personaje B (forma similar)
[Al hover: Lumi dice "¡Ése es muy simpático!" o "¡Mira qué bonito!"]

PANTALLA 3: Tono de Piel
Lumi: "Elige el color de piel de tu personaje."
[6 tonos de piel en círculos grandes, con celebración al seleccionar]

PANTALLA 4: Tipo de Pelo
Lumi: "¿Qué pelo le ponemos?"
Opciones:
- Liso corto
- Liso largo
- Rizado corto
- Rizado largo
- Colitas
- Trenzas
- Afro

PANTALLA 5: Color de Pelo
[10 colores: negro, marrón, rubio, pelirrojo, rosa, azul, verde, morado, blanco, arcoíris]
Lumi: "¡Elige el color que más te guste!"

PANTALLA 6: Ojos
[6 formas de ojos + selector de color de iris]

PANTALLA 7: Accesorios de Cara
- Sin accesorios
- Lentes redondos
- Lentes cuadrados
- Pecas
- Lentes de sol
- Parche pirata

PANTALLA 8: Sombrero
- Sin sombrero
- Gorra
- Sombrero de explorador
- Corona de flores
- Beanie
- Sombrero de fiesta

PANTALLA 9: Ropa (Top)
[8 opciones con colores seleccionables]
- Camiseta básica
- Overol
- Vestido
- Suéter
- Capa de explorador
- Traje de astronauta
- Disfraz de dragón

PANTALLA 10: Ropa (Pantalón/Falda)
[6 opciones]

PANTALLA 11: Zapatillas
[8 diseños]
- Tenis clásicos
- Botas de aventura
- Zapatos de colores
- Zapatillas de cohete
- Sandalias de playa
- Botas mágicas

PANTALLA 12: Mochila
[6 diseños — la mochila tiene importancia en el juego]
- Mochila básica
- Mochila de corazones
- Mochila de dinosaurio
- Mochila espacial
- Mochila de flores
- Mochila de libros

PANTALLA 13: Mascota Inicial
Lumi: "¡Toda aventura necesita un compañero!"
Lumi: "Elige tu primera mascota."
[4 mascotas iniciales]
- Gatito naranja (Naranjo)
- Perrito manchado (Manchas)
- Conejito azul (Nube)
- Pollito amarillo (Pipín)

PANTALLA 14: Nombre
Lumi: "¿Cómo se llama tu personaje?"
[Teclado grande en pantalla con letras grandes]
[Al escribir cada letra: la voz dice el nombre de la letra]
[Preview del nombre pronunciado en audio]

PANTALLA 15: Confirmación
[Vista 360° del personaje rotando]
Lumi: "¡Mira qué genial quedó [nombre]!"
Lumi: "¿Estás listo para la aventura?"
[Botón: ¡SÍ! con animación de explosión de confeti]
```

### Personalización Post-Creación

Todos los elementos son desbloqueables durante el juego:
- 50+ tipos de ropa adicionales
- 30+ sombreros
- 20+ mascotas
- 15+ mochilas
- Colores especiales (arcoíris, brillante, metálico)
- Efectos de personaje (aura de estrellas, rastro de flores)

---

## 6. MECÁNICAS CORE

### 6.1 Exploración

**Movimiento:**
- WASD / flechas / joystick virtual (tablet)
- El personaje corre automáticamente (sin sprint manual)
- Mapa abierto con zonas claramente diferenciadas por color y forma

**Descubrimiento:**
- Al acercarse a un objeto → aparece brillo/partículas mágicas
- Al interactuar → Lumi narra qué es el objeto
- Cada objeto nuevo → animación "¡Descubrimiento!" + entrada en el diario

**Exploración Recompensada:**
- Áreas ocultas con cofres de monedas
- Letras flotantes en el bosque para atrapar
- Huellas de animales que llevan a secretos
- Arcoíris que señalan zonas especiales

### 6.2 Interacción con Objetos

**Flujo de Interacción:**
```
1. Niño se acerca a objeto
2. Brillo mágico aparece alrededor del objeto
3. Botón grande "¡Toca!" aparece
4. Al tocar → Lumi presenta el objeto:
   "¡Mira! ¡Esto es un ÁRBOL!"
   La palabra ÁRBOL aparece flotando en letras grandes
5. Lumi deletrea: "Á-R-B-O-L"
   Cada letra se ilumina al pronunciarse
6. Mini-desafío opcional: "¿Puedes tocar la letra A de ÁRBOL?"
7. Éxito → Confeti + monedas
```

### 6.3 Recogida de Letras

**Mecánica:**
- Las letras vuelan por el mundo como mariposas brillantes
- Cada letra tiene su color y sonido característico
- Para atrapar una letra → tap/click en ella
- Al atraparla → animación de letra "cayendo en la mochila"

**Lumi narra:**
- "¡Atrapaste la letra M!"
- "Mmmmm. M de MAMÁ."
- "M de MONTAÑA."
- "M de MARIPOSA."
- [3 palabras con M con imágenes apareeen]

### 6.4 Construcción

**Sistema:**
- Inventario visual (imágenes grandes, sin texto)
- Drag & drop de muebles a la habitación
- Grid invisible para colocación
- Vista previa antes de colocar
- Rotación de objetos (botón de giro)

**Lumi narra todo:**
- Al abrir inventario: "Aquí están tus cosas."
- Al seleccionar mueble: "Una cama suave para descansar."
- Al colocar: "¡Perfecto! ¡Quedó genial!"

### 6.5 Mini-Juegos Educativos

Integrados en el mundo como actividades naturales, nunca como "ejercicios":

| Mini-Juego | Apariencia | Aprendizaje |
|------------|------------|-------------|
| Atrapar letras | Mariposas de letras | Reconocimiento de letras |
| La huerta de palabras | Plantar semillas con letras | Escritura y deletreo |
| El río de números | Contar peces que pasan | Conteo y números |
| La fábrica de tortas | Sumar ingredientes | Suma visual |
| El tesoro del mapa | Seguir pistas escritas | Comprensión lectora |
| El mercado | Calcular monedas | Resta y suma |
| La orquesta | Secuencias de notas | Patrones lógicos |
| La cocina mágica | Seguir recetas | Comprensión de instrucciones |

---

## 7. SISTEMA DE VOZ

### Arquitectura de Narración

El sistema de voz es el componente más crítico del juego. Sin él, el juego no es accesible para niños de 5 años.

**Tecnología:** ElevenLabs TTS (voz principal de Lumi) + Web Speech API (fallback)

**Reglas de Narración:**

1. **Auto-narración de UI:** Al hacer hover sobre cualquier elemento interactivo → se anuncia en voz
2. **Sin silencio de más de 5 segundos:** Si el niño no interactúa → Lumi da una pista suave
3. **Velocidad adaptativa:** 0.85x velocidad normal (más lenta = más comprensible)
4. **Pausa entre frases:** 400ms mínimo entre oraciones
5. **Repetición disponible:** Botón de "repetir" (ícono de altavoz) en toda la pantalla
6. **Interrupción inteligente:** Si el niño toca algo, la narración se adapta sin corte abrupto

**Persona de Lumi (guía de voz):**
- Tono: Cálido, entusiasta, paciente
- Ritmo: Moderado, claro, sin ser condescendiente
- Personalidad: Sorprendida de forma positiva, celebradora
- Nunca usa: palabras difíciles, tono de regaño, prisa

**Scripts de Lumi por Contexto:**

```
BIENVENIDA AL JUEGO:
"¡Hola! ¡Qué bueno que volviste! Villa Amparo te extrañaba."

DESCUBRIMIENTO DE OBJETO:
"¡Oh! ¡Mira lo que encontraste! ¡Increíble!"

RESPUESTA CORRECTA:
"¡SÍ! ¡Lo lograste! ¡Eres fantástico!"
"¡Eso es! ¡Muy bien! ¡Aprendiste algo nuevo hoy!"
"¡Perfecto! ¡Sabía que podías hacerlo!"

PRIMER INTENTO INCORRECTO:
"¡Buen intento! Volvamos a intentarlo juntos."
"¡Casi! Mira bien... ¿ves alguna pista?"

SEGUNDO INTENTO INCORRECTO:
"¡No te preocupes! Vamos a buscarla juntos."
[Pista visual más directa]

TERCER INTENTO INCORRECTO:
"¡Ah, aquí está! ¡La encontramos juntos!"
[Respuesta revelada, misma celebración]

LOGRO COMPLETADO:
"¡INCREÍBLE! ¡Eres el mejor explorador que Villa Amparo ha tenido!"

INACTIVIDAD (30 segundos):
"¿Ves esas luces brillantes? Creo que hay algo escondido..."

INACTIVIDAD (60 segundos):
"¡Psst! Lumi tiene un secreto que contarte... ¡Ven aquí!"
```

---

## 8. SISTEMA EDUCATIVO INTEGRADO

### 8.1 Currículo de Lectura y Escritura

#### Nivel 0 — Pre-Alfabético (Edad 4-5)
- Reconocer que las letras existen
- Distinguir letras de números y dibujos
- Reconocer el propio nombre escrito
- Escuchar fonemas individuales

#### Nivel 1 — Fonética Básica (Edad 5-6)
- Las 5 vocales: A, E, I, O, U
- Sonido de cada vocal
- Objetos que comienzan con cada vocal
- Construir sílabas simples: MA, ME, MI, MO, MU

#### Nivel 2 — Consonantes (Edad 6-7)
- Consonantes en orden de frecuencia: M, P, L, S, T, N, D, R, C, B
- Sílabas directas: MA, PA, LA, SA...
- Palabras de 2 sílabas: MAMÁ, PAPÁ, MESA...
- Escritura por arrastre de letras

#### Nivel 3 — Palabras y Frases (Edad 7-8)
- Palabras de 3+ sílabas
- Frases simples de 3-4 palabras
- Comprensión lectora básica
- Escritura con teclado

### 8.2 Mecánica de Fonética Detallada

**Presentación de Nueva Letra:**

```
ESCENA: El niño encuentra la letra M brillando en el Bosque

[Animación: La M se transforma en un Monstruo Amigable llamado "Memo"]

Lumi: "¡Oh! ¡Encontraste a Memo, el guardián de la letra M!"
Memo: "¡Hola! Yo soy Memo. Mmmmmmm."
      [La M vibra con la pronunciación]
Lumi: "Escucha: MMMMM. ¿Puedes decirlo tú?"
      [Pausa de 3 segundos — el niño puede intentar]
Lumi: "¡M de MAMÁ!"
      [Imagen grande de mamá + palabra MAMÁ]
Lumi: "¡M de MANZANA!"
      [Imagen grande de manzana + palabra MANZANA]
Lumi: "¡M de MARIPOSA!"
      [Imagen grande de mariposa + palabra MARIPOSA]

DESAFÍO 1 — Reconocimiento:
Lumi: "¿Puedes tocar la M en estas letras?"
[Aparecen: M, A, T, S, M — el niño debe tocar las M]
[Por cada M correcta: chispazo + sonido]

DESAFÍO 2 — Asociación:
Lumi: "¿Cuál de estos objetos empieza con M?"
[3 imágenes: Mesa, Perro, Sol]
[Respuesta correcta: Mesa → celebración]

DESAFÍO 3 — Fonética:
Lumi: "¿Cómo se llama este objeto?"
[Imagen de manzana]
[Opciones de audio: el niño escucha 3 opciones de voces]
[Toca la correcta]

RECOMPENSA:
"¡Memo quiere vivir en tu pueblo! ¡Puedes ponerlo en tu jardín!"
[Unlock: Figura decorativa de Memo para el hogar]
```

### 8.3 Currículo de Matemáticas

#### Nivel 1 — Conteo (Edad 5-6)
- Contar objetos del 1 al 10
- Reconocer numerales 1-10
- Comparar cantidades (más/menos)
- Ordenar del menor al mayor

#### Nivel 2 — Suma Visual (Edad 6-7)
- Suma con objetos concretos (manzanas, monedas, estrellas)
- Sumas hasta 10
- Problemas de contexto: "Tenías 3 flores, encontraste 2 más..."
- Representación con dedos (animación)

#### Nivel 3 — Resta Visual (Edad 7-8)
- Resta con objetos concretos
- Restas hasta 10
- Problemas de contexto: "Tenías 5 monedas, gastaste 2..."
- Relación suma-resta

### 8.4 Mecánica de Matemáticas Detallada

**Escena en la Huerta (Suma):**

```
[Contexto: El niño está en la Granja Educativa]

Agricultora Berta: "¡Hola! Necesito tu ayuda."
Lumi: "Berta necesita contar sus manzanas."

[3 manzanas aparecen en el árbol]
Lumi: "Mira... hay... [pausa] ¡1, 2, 3! ¡Tres manzanas!"
[Cada manzana se ilumina al contarse]

[2 manzanas más caen del árbol]
Berta: "¡Oh! ¡Cayeron más manzanas!"
Lumi: "¿Cuántas manzanas cayeron?"
[Las 2 manzanas se iluminan: 1, 2]
Lumi: "¡Dos manzanas cayeron! ¿Cuántas hay ahora?"

[Panel visual: 3 manzanas + 2 manzanas = ?]
[El niño puede tocar cada manzana para contarlas]

Opciones: [4] [5] [6]
[Al tocar 5] → Explosión de confeti
Berta: "¡CINCO! ¡Eres un genio matemático!"
```

---

## 9. SISTEMA DE MISIONES

### Tipos de Misiones

#### Misiones Principales (Historia)
- Progresan la narrativa de Villa Amparo
- Siempre narradas completamente
- Recompensas especiales (personajes nuevos, zonas desbloqueadas)
- 3-5 misiones por semana de juego

#### Misiones Secundarias (Exploración)
- Dadas por NPCs del pueblo
- Enseñan mecánicas específicas
- Recompensas de personalización
- 5-10 disponibles simultáneamente

#### Misiones Diarias
- 3 misiones simples cada día
- Refuerzan contenido aprendido
- Recompensas de monedas y objetos pequeños
- Se renuevan cada 24 horas

#### Misiones de Descubrimiento
- Se activan al explorar una nueva zona
- Sin objetivos previos — el descubrimiento es la misión
- Recompensas de mapa desbloqueado

### Flujo de Misión Ejemplo: "La Carta Perdida"

```
INICIO:
[Anciano Tomás aparece en la plaza]
Tomás: "¡Explorador! ¡Qué bueno encontrarte!"
Lumi: "Parece que Tomás necesita tu ayuda."
Tomás: "Perdí una carta muy importante. Estaba en el Bosque de Letras."
      "¡Pero hay muchas letras volando por ahí!"
      "Mi carta tenía estas tres letras: [C, A, S, A]"
      [Las letras C-A-S-A aparecen brillando]
Lumi: "Ayudemos a Tomás. Busca las letras C, A, S y A en el bosque."

DURANTE:
[Minimapa muestra el bosque parpadeando]
Lumi: "Recuerda: necesitas la C, la A, la S y otra A."
[Al encontrar cada letra → sonido de moneda + "¡Encontraste la C!"]
[Barra de progreso: C ✓ A ✓ S _ A _]

COMPLETAR:
[Todas las letras recogidas]
[Animación: Las letras forman la palabra CASA]
Lumi: "¡CASA! ¡Eso es lo que dice la carta!"
Lumi: "¡C-A-S-A! ¡Casa!"
[Imagen de una casa acogedora]

ENTREGA:
Tomás: "¡Mi carta! ¡Qué feliz estoy!"
Tomás: "La carta dice que mi amigo viene a vivir a Villa Amparo."
Lumi: "¡Un nuevo vecino! ¡Increíble!"

RECOMPENSA:
- 50 monedas de Villa
- Objeto: "Buzón mágico" para la casa
- Nuevo NPC desbloqueado: El amigo de Tomás
- Entrada en el diario: Palabra CASA aprendida
```

---

## 10. MAPA DEL MUNDO

### Mapa General de Villa Amparo

```
                    🏔️ MONTAÑA DE CUENTOS
                          |
    🌊 MUNDO         🏡 VILLA          🌴 ISLA
   SUBMARINO    ←   AMPARO (CENTRO)  → MATEMÁTICA
                          |
              🌲 BOSQUE    |    🏙️ CIUDAD
              DE LETRAS   |    DE PALABRAS
                          |
                    🌾 GRANJA         🎨 PARQUE DE
                    EDUCATIVA    ←   CREATIVIDAD
```

### Zonas del Mundo

#### 🏡 Villa Amparo (Centro — Disponible desde inicio)
- **Función:** Hub central del juego
- **Habitantes:** NPCs principales, tiendas
- **Aprendizaje:** Vocabulario cotidiano, lectura de señales
- **Tamaño:** Mediano — 5 minutos para recorrer a pie
- **Elementos:** Plaza central, tienda, casa del jugador, taller

#### 🌲 Bosque de Letras (Desbloqueado: Semana 1)
- **Función:** Aprendizaje de letras y fonética
- **Habitantes:** Letras-personaje (Memo la M, Ana la A, etc.)
- **Aprendizaje:** Reconocimiento de letras, fonética, sílabas
- **Ambiente:** Bosque mágico con árboles de colores, letras flotantes
- **Mini-juegos:** Atrapar letras, ordenar el alfabeto, buscar la letra perdida

#### 🏙️ Ciudad de Palabras (Desbloqueado: Semana 2)
- **Función:** Construcción de palabras y vocabulario
- **Habitantes:** Constructoras de palabras, periodistas
- **Aprendizaje:** Formación de palabras, vocabulario, comprensión
- **Ambiente:** Ciudad animada con carteles, periódicos, letreros
- **Mini-juegos:** La fábrica de palabras, el periódico diario, el mercado

#### 🏔️ Montaña de Cuentos (Desbloqueado: Semana 3)
- **Función:** Comprensión lectora y narrativa
- **Habitantes:** Narradores, personajes de cuentos
- **Aprendizaje:** Comprensión de textos, secuencia de eventos, personajes
- **Ambiente:** Castillo en la cima, cuevas de historias, biblioteca mágica
- **Mini-juegos:** ¿Qué pasó primero?, Los personajes del cuento, El final perdido

#### 🌴 Isla Matemática (Desbloqueado: Semana 3)
- **Función:** Matemáticas visuales
- **Habitantes:** Piratas matemáticos, científicos
- **Aprendizaje:** Conteo, suma, resta, formas, patrones
- **Ambiente:** Isla tropical con tesoros, laboratorio de números
- **Mini-juegos:** El tesoro del pirata, La balanza mágica, Los patrones de colores

#### 🌊 Mundo Submarino (Desbloqueado: Semana 5)
- **Función:** Pensamiento lógico y secuencias
- **Habitantes:** Pulpos, peces, sirenas
- **Aprendizaje:** Secuencias, patrones, resolución de problemas
- **Ambiente:** Océano colorido, corales, ciudades submarinas
- **Mini-juegos:** El laberinto de coral, Las burbujas ordenadas, El código secreto

#### 🌾 Granja Educativa (Desbloqueado: Semana 4)
- **Función:** Matemáticas aplicadas y vocabulario
- **Habitantes:** Agricultores, animales parlantes
- **Aprendizaje:** Sumas/restas con frutas, vocabulario de naturaleza
- **Ambiente:** Granja colorida con animales adorables
- **Mini-juegos:** Contar cosecha, Dividir la comida, La receta mágica

#### 🎨 Parque de Creatividad (Desbloqueado: Semana 4)
- **Función:** Creatividad y expresión libre
- **Habitantes:** Artistas, músicos, inventores
- **Aprendizaje:** Expresión escrita, creatividad, vocabulario artístico
- **Ambiente:** Parque colorido lleno de arte, esculturas de letras
- **Mini-juegos:** Pintar con palabras, La orquesta de letras, Inventa tu cuento

---

## 11. CONSTRUCCIÓN DEL HOGAR

### Sistema de Casa

**Estructura:**
- La casa del niño tiene 3 habitaciones iniciales + jardín
- Cada habitación se puede decorar independientemente
- Nuevas habitaciones se desbloquean al progresar

**Habitaciones:**
1. **Cuarto principal** — Cama, decoraciones personales, mascota
2. **Sala** — Muebles, TV (muestra el progreso del niño), trofeos
3. **Cocina** — Donde se hacen mini-juegos de matemáticas con recetas
4. **Jardín** — Mascotas, plantas, decoraciones exteriores, letras decorativas
5. **[Desbloqueable] Biblioteca** — Libros con historias completadas
6. **[Desbloqueable] Laboratorio** — Experimentos lógicos y matemáticos
7. **[Desbloqueable] Taller de Arte** — Creaciones personalizadas

**Catálogo de Muebles por Categoría:**

| Categoría | Ejemplos | Monedas |
|-----------|----------|---------|
| Camas | Cama nube, cama castillo, cama nave espacial | 30-80 |
| Sillas | Silla globo, trono de colores, hamaca | 15-40 |
| Mesas | Mesa de cristal, mesa de madera, mesa flotante | 20-50 |
| Decoración | Plantas mágicas, estrellas colgantes, arcoíris | 10-30 |
| Mascotas en casa | Pecera, perchero de loro, cama de gato | 25-60 |
| Especiales | Árbol de letras, fuente de números, globo aerostático | 80-150 |

**Sistema de Colores:**
- Cada mueble tiene 5 variantes de color
- Colores especiales desbloqueables (brillante, arcoíris, dorado)

---

## 12. PERSONAJES NPC

### NPCs Principales

| Personaje | Descripción | Zona | Enseña |
|-----------|-------------|------|--------|
| **Lumi** | Estrella guía del jugador | Todas | Todo |
| **Anciano Tomás** | Sabio del pueblo | Plaza | Vocabulario |
| **Berta** | Agricultora alegre | Granja | Números, naturaleza |
| **Pip** | Inventor excéntrico | Taller | Lógica, secuencias |
| **Rosa** | Maestra del bosque | Bosque | Letras, fonética |
| **Max** | Pirata amigable | Isla Matemática | Sumas, restas |
| **Luna** | Artista colorida | Parque Creatividad | Escritura creativa |
| **Memo la M** | Guardián de la M | Bosque | Letra M |
| **Ana la A** | Guardián de la A | Bosque | Letra A |
| *(Un guardián por cada letra)* | | Bosque | Fonética |

### Sistema de Amistad NPC

- Cada NPC tiene un medidor de amistad (0-100)
- Completar misiones de un NPC aumenta su amistad
- A mayor amistad → nuevas misiones, nuevos objetos, nuevos diálogos
- Al llegar a 100: El NPC se muda a Villa Amparo y vive en el pueblo

---

## 13. SISTEMA EMOCIONAL

### Vocabulario Prohibido

❌ Nunca usar:
- "Incorrecto"
- "Error"
- "Mal"
- "No"
- "Fallaste"
- "Equivocado"

✅ Siempre usar:

**Primer intento incorrecto:**
- "¡Buen intento! Volvamos a intentarlo juntos."
- "¡Casi! Estás muy cerca."
- "¡Eso estuvo muy cerca! Inténtalo una vez más."
- "¡Mmmm, sigamos buscando!"

**Segundo intento incorrecto:**
- "¡No te preocupes! Las cosas difíciles necesitan práctica."
- "Vamos juntos. ¿Ves esta pista?"
- [Pista visual directa aparece]

**Tercer intento incorrecto:**
- "¡Ah, la encontramos juntos! ¡Aquí estaba!"
- [Respuesta revelada con misma celebración que respuesta correcta]
- "¡Ahora ya la sabemos! ¡La próxima vez la vas a recordar!"

### Detección de Frustración

El sistema detecta frustración mediante:
- 3+ intentos incorrectos consecutivos
- Tiempo sin interacción > 2 minutos
- Click repetido en el mismo lugar sin respuesta

**Respuesta del Sistema:**
1. Lumi aparece con animación especial
2. Ofrece juego diferente: "¿Quieres hacer otra cosa?"
3. Simplifica la tarea automáticamente
4. Celebra el mínimo progreso

### Sistema de Logros Emocionales

Medallas especiales por comportamientos:
- "¡Perseverante!" — Intentó 3 veces antes de lograrlo
- "¡Explorador curioso!" — Visitó 3 zonas en una sesión
- "¡Gran corazón!" — Completó 5 misiones de ayuda a NPCs

---

## 14. SISTEMA DE RECOMPENSAS

*(Ver documento completo: [REWARDS.md](REWARDS.md))*

### Resumen

**Moneda del Juego:** Monedas de Villa (⭐ Estrellas de Villa)

**Fuentes de Monedas:**
| Acción | Monedas |
|--------|---------|
| Respuesta correcta primera vez | 10 |
| Completar mini-juego | 25 |
| Completar misión secundaria | 50 |
| Completar misión principal | 100 |
| Descubrir zona nueva | 30 |
| Logro especial | 75 |
| Misión diaria | 20 |
| Racha de 7 días seguidos | 200 |

**Uso de Monedas:**
- Muebles para el hogar
- Ropa para el avatar
- Mascotas adicionales
- Decoraciones del jardín
- Colores especiales

---

## 15. IA ADAPTATIVA

### Motor de Adaptación

El sistema de IA observa continuamente:

**Métricas Rastreadas:**
```
Por cada letra:
- Tiempo de reconocimiento promedio
- Tasa de acierto en primer intento
- Número de repeticiones necesarias
- Letras confundidas entre sí

Por cada operación matemática:
- Rango de números dominados
- Velocidad de respuesta
- Errores sistemáticos (ej: siempre suma 1 de más)

Por sesión:
- Duración de atención
- Zonas preferidas
- Actividades preferidas
- Hora del día de mayor rendimiento
```

**Adaptación Automática:**

```
SI tasa_de_acierto(letra_X) < 0.5:
  → Presentar letra_X 3 veces más esta sesión
  → Simplificar desafíos con letra_X
  → Agregar más ejemplos visuales

SI tasa_de_acierto(letra_X) > 0.9:
  → Avanzar a combinaciones con letra_X
  → Presentar siguiente letra en secuencia

SI frustración_detectada:
  → Cambiar a actividad favorita del niño
  → Reducir dificultad 30%
  → Aumentar frecuencia de recompensas

SI niño_muy_avanzado:
  → Desbloquear contenido del siguiente nivel
  → Presentar desafíos de pensamiento crítico
```

### OpenAI Integration

**GPT-4o mini** procesa:
- Análisis de patrones de error para personalizar contenido
- Generación de nuevos problemas matemáticos contextualizados
- Adaptación de historia según progreso del niño
- Sugerencias para el panel de padres

**Prompt base para IA:**
```
Eres Lumi, la guía educativa de Villa Amparo.
El niño tiene [edad] años y está en nivel [N] de lectura.
Ha dominado: [letras_dominadas].
Tiene dificultad con: [letras_difíciles].
Su actividad favorita es: [actividad_favorita].

Genera una actividad educativa que:
1. Enseñe [objetivo_educativo]
2. Use su actividad favorita como contexto
3. Refuerce [letra/número_con_dificultad]
4. Sea completamente narrada y no requiera leer
5. Dure máximo 3 minutos
```

---

## 16. CONTROLES E INTERFAZ

### Principios de UI

- **Sin texto en botones de acción** — solo íconos + audio
- **Botones mínimo 80x80px** — para dedos de niños
- **Colores de alto contraste**
- **Animaciones de feedback en todo elemento interactivo**
- **Sin menús anidados** — máximo 2 niveles de profundidad

### Layout Principal

```
┌─────────────────────────────────────────────┐
│ [❤️ Energía] [⭐ 1,240]         [🔊] [⚙️] │ ← HUD mínimo
├─────────────────────────────────────────────┤
│                                             │
│                                             │
│           MUNDO 3D / 2.5D                  │
│                                             │
│                    🌟 Lumi                  │
│                                             │
│              👦 [Avatar]                    │
│                                             │
├─────────────────────────────────────────────┤
│ [🏠] [🗺️] [🎒] [❓ Misiones] [👥 Amigos] │ ← Nav inferior
└─────────────────────────────────────────────┘
```

### Controles por Dispositivo

**Desktop:**
- WASD / Flechas → Movimiento
- Click → Interactuar
- Scroll → Zoom
- ESC → Menú pausa

**Tablet:**
- Joystick virtual (izquierda) → Movimiento
- Tap → Interactuar
- Pinch → Zoom
- Botón de casa → Menú pausa

**Mobile:**
- Joystick virtual → Movimiento
- Tap → Interactuar
- Layout adaptado a pantalla pequeña

---

## 17. AUDIO Y MÚSICA

### Música por Zona

| Zona | Estilo | Tempo | Descripción |
|------|--------|-------|-------------|
| Villa Amparo (día) | Orquestal alegre | Moderado | Melodía principal del juego |
| Villa Amparo (noche) | Nana suave | Lento | Versión tranquila |
| Bosque de Letras | Mágico/Fantástico | Moderado | Con sonidos de bosque |
| Ciudad de Palabras | Jazz alegre | Rápido | Bullicioso y activo |
| Montaña de Cuentos | Épico/Aventura | Moderado | Con coro |
| Isla Matemática | Pirata/Tropical | Alegre | Ritmo caribeño |
| Mundo Submarino | Ambient/Etéreo | Lento | Con burbujas y olas |
| Granja Educativa | Folk/Country | Moderado | Con instrumentos de madera |
| Parque Creatividad | Pop colorido | Animado | Energético y creativo |

### Efectos de Sonido (SFX)

- **Correcto:** Fanfarria suave (3 notas ascendentes)
- **Monedas:** Tintineo mágico
- **Descubrimiento:** Acorde mágico expansivo
- **Letra atrapada:** Pop brillante
- **Hover de botón:** Click suave
- **Nueva zona:** Fanfarria de entrada (5 notas)
- **Logro completado:** Fanfarria completa (8 notas)

### Silencio Controlado

- La música baja de volumen durante narración de Lumi (ducking)
- SFX nunca se superponen con voz principal
- Control de volumen independiente: Música / SFX / Voz

---

## 18. ARTE Y ESTÉTICA VISUAL

### Dirección de Arte

**Estilo:** 3D Low-poly stylized / 2.5D isométrico

**Referencias de Estilo:**
- Personajes: Animal Crossing (adorables, grandes cabezas, expresivos)
- Mundo: Disney Dreamlight Valley (colorido, detallado, mágico)
- Construcción: Minecraft (bloques, personalización, creatividad)
- UI: Roblox (simple, colorido, accesible)

### Paleta de Colores por Zona

```
Villa Amparo (central):  #FFD700, #87CEEB, #90EE90, #FFA07A
Bosque de Letras:        #228B22, #7CFC00, #ADFF2F, #FFD700
Ciudad de Palabras:      #4169E1, #FF6347, #FFD700, #FFFFFF
Montaña de Cuentos:      #9370DB, #4B0082, #C0C0C0, #FFD700
Isla Matemática:         #00CED1, #FF8C00, #FFFFFF, #FFD700
Mundo Submarino:         #006994, #00BFFF, #7FFFD4, #FF69B4
Granja Educativa:        #8B4513, #32CD32, #FFD700, #FF6347
Parque Creatividad:      #FF1493, #FF4500, #9400D3, #00FF7F
```

### Diseño de Personajes

**Avatar del Jugador:**
- Cabeza grande (40% del cuerpo) — estilo chibi
- Ojos expresivos y grandes
- Movimientos suaves y redondeados
- Sin aristas duras
- Animaciones: correr, saltar, celebrar, pensar, bailar, dormir

**Lumi:**
- Estrella de 5 puntas con cara centrada
- Cuerpo brillante con partículas de luz
- Tamaño: 60% del avatar
- Siempre visible en esquina superior derecha durante conversaciones

**Letras-Personaje:**
- Cada letra tiene una forma de personaje único
- Mismo color que su letra en el abecedario del juego
- Expresión facial coincide con el sonido de la letra
  - M → Boca cerrada haciendo "mmm"
  - A → Boca abierta sorprendida
  - O → Boca en forma de O

### Animaciones Clave

- **Celebración de respuesta correcta:** Personaje salta + estrellas explotan + Lumi gira
- **Nueva zona:** Transición con destello de luz + panorámica del área
- **Subida de nivel:** Personaje brilla + rayo de luz desde el cielo + fanfarria
- **Construcción de mueble:** Objeto materializa con partículas mágicas
- **Mascota feliz:** Mascota salta y hace corazones al acariciarla

---

*Documento preparado para el equipo de desarrollo de Villa Amparo.*
*Versión 1.0 — Mayo 2026*
