# WIREFRAMES — VILLA AMPARO
## Pantallas Principales y Flujos de Usuario
## Versión 1.0 | Mayo 2026

---

## ÍNDICE

1. [Flujo General del Usuario](#1-flujo-general-del-usuario)
2. [Pantalla: Splash / Carga](#2-pantalla-splash--carga)
3. [Pantalla: Login de Padres](#3-pantalla-login-de-padres)
4. [Pantalla: Selección de Jugador](#4-pantalla-selección-de-jugador)
5. [Pantalla: Creación de Avatar](#5-pantalla-creación-de-avatar)
6. [Pantalla: Cutscene Introductoria](#6-pantalla-cutscene-introductoria)
7. [Pantalla: Mundo Principal (Juego)](#7-pantalla-mundo-principal-juego)
8. [Pantalla: Casa del Jugador](#8-pantalla-casa-del-jugador)
9. [Pantalla: Mini-Juego Educativo](#9-pantalla-mini-juego-educativo)
10. [Pantalla: Sistema de Misiones](#10-pantalla-sistema-de-misiones)
11. [Pantalla: Logro Desbloqueado](#11-pantalla-logro-desbloqueado)
12. [Pantalla: Panel de Padres](#12-pantalla-panel-de-padres)
13. [Wireframes Detallados ASCII](#13-wireframes-detallados-ascii)

---

## 1. FLUJO GENERAL DEL USUARIO

```
┌─────────────────────────────────────────────────────────────┐
│                    PRIMERA VEZ                              │
└─────────────────────────────────────────────────────────────┘

Splash Screen
     │
     ▼
Login de Padres ──→ Registro de Cuenta
     │
     ▼
Crear Perfil de Niño
     │
     ▼
Creación de Avatar (narrada)
     │
     ▼
Cutscene Introductoria (Villa Amparo)
     │
     ▼
Tutorial de Movimiento (30 segundos)
     │
     ▼
Primera Misión: "Encuentra tu Casa"
     │
     ▼
Mundo Principal (sesión de juego)


┌─────────────────────────────────────────────────────────────┐
│                    SESIÓN RECURRENTE                        │
└─────────────────────────────────────────────────────────────┘

Splash Screen (2 segundos)
     │
     ▼
Selección de Perfil (sin contraseña)
     │
     ▼
Pantalla de Bienvenida Personalizada
"¡Hola [nombre]! Villa Amparo te extrañaba."
     │
     ▼
Recompensa Diaria (si aplica)
     │
     ▼
Mundo Principal (sesión de juego)
```

---

## 2. PANTALLA: SPLASH / CARGA

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                                                             │
│              🏡  VILLA AMPARO  🏡                           │
│                                                             │
│              [Logo animado — letras que caen               │
│               y forman el título]                          │
│                                                             │
│                                                             │
│         ████████████████████░░░░░░░░░  75%                 │
│              Cargando el mundo mágico...                    │
│                                                             │
│                                                             │
│                    Versión 1.0                              │
└─────────────────────────────────────────────────────────────┘

Audio: Música suave del mundo
Duración máxima: 5 segundos
```

---

## 3. PANTALLA: LOGIN DE PADRES

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                   🔑 Área de Padres                         │
│                                                             │
│         ┌──────────────────────────────────┐               │
│         │  📧  correo@email.com            │               │
│         └──────────────────────────────────┘               │
│                                                             │
│         ┌──────────────────────────────────┐               │
│         │  🔒  ••••••••                    │               │
│         └──────────────────────────────────┘               │
│                                                             │
│         ┌──────────────────────────────────┐               │
│         │    ▶  INGRESAR                   │               │
│         └──────────────────────────────────┘               │
│                                                             │
│         ¿Primera vez? Crear cuenta gratis                   │
│         ¿Olvidaste tu contraseña?                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Nota: Esta pantalla es SOLO para padres.
El niño nunca ve esta pantalla — el padre selecciona el perfil del niño.
```

---

## 4. PANTALLA: SELECCIÓN DE JUGADOR

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│           ¿Quién va a jugar hoy?                            │
│                                                             │
│    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│    │              │  │              │  │              │    │
│    │  [Avatar 1]  │  │  [Avatar 2]  │  │    [ + ]     │    │
│    │              │  │              │  │   Agregar    │    │
│    │    Sofía     │  │    Mateo     │  │    niño      │    │
│    │  Nivel 7 ⭐  │  │  Nivel 3 ⭐  │  │              │    │
│    └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                             │
│                  ⚙️ Configuración parental                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Audio: Música alegre del menú
Lumi aparece al lado diciendo: 
"¿Quién va a jugar hoy? ¡Toca tu personaje!"
```

---

## 5. PANTALLA: CREACIÓN DE AVATAR

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   ← [ATRÁS]        Crea tu personaje       [LUMI 🌟]       │
│                                                             │
│   ┌─────────────────────┐  ┌──────────────────────────┐   │
│   │                     │  │  TIPO DE PELO            │   │
│   │                     │  │  ┌──┐ ┌──┐ ┌──┐ ┌──┐   │   │
│   │    [PERSONAJE 3D]   │  │  │  │ │  │ │  │ │  │   │   │
│   │    Vista previa     │  │  └──┘ └──┘ └──┘ └──┘   │   │
│   │    rotando 360°     │  │                          │   │
│   │                     │  │  COLOR DE PELO           │   │
│   │                     │  │  🟤🟡🔴⚫🟤🩷💙💜⚪🌈    │   │
│   │                     │  │                          │   │
│   │                     │  │  TONO DE PIEL            │   │
│   │                     │  │  ⬛🟫🟤🫶🏼🫶🏻🤍          │   │
│   └─────────────────────┘  └──────────────────────────┘   │
│                                                             │
│   [← ANTERIOR]     Paso 3 de 14    [SIGUIENTE →]          │
│                                                             │
│   [🔊 Volver a escuchar]                                   │
└─────────────────────────────────────────────────────────────┘

Lumi (esquina): Animada, hablando, con subtítulo
```

---

## 6. PANTALLA: CUTSCENE INTRODUCTORIA

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│           [ANIMACIÓN CINEMÁTICA FULL SCREEN]               │
│                                                             │
│           Villa Amparo brillante y colorida                │
│                ↓                                           │
│           Tormenta de palabras                             │
│                ↓                                           │
│           Villa queda gris y apagada                       │
│                ↓                                           │
│           Lumi aparece con el héroe (el niño)              │
│                                                             │
│   ┌────────────────────────────────────────┐              │
│   │ 🌟 Lumi: "¡Y ese héroe... eres TÚ!"  │              │
│   └────────────────────────────────────────┘              │
│                                                             │
│                    [🔊 Volumen]                             │
│                                                             │
│           [Tap en cualquier lugar para continuar]          │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. PANTALLA: MUNDO PRINCIPAL (JUEGO)

```
┌─────────────────────────────────────────────────────────────┐
│ [❤️❤️❤️]  [⭐ 1,240]          [🔊 Vol]  [⏸ Pausa]       │ HUD
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                      [MAPA 3D]                             │
│                                                             │
│    🌲           🌟                                          │
│       🌲   🌲        🌟  ← Letras flotantes                │
│                   🏠  ← Casa del jugador                   │
│              👦                                             │
│         🌸    ← Avatar del jugador                         │
│    🌲                                                       │
│              [NPC] ← Globo de diálogo disponible          │
│                                                             │
│                  [Minimapa]    [🌟 Lumi flotando]          │
│                  ┌──┐                                       │
│                  │  │                                       │
│                  └──┘                                       │
├─────────────────────────────────────────────────────────────┤
│ [🏠 Casa] [🗺️ Mapa] [🎒 Mochila] [📋 Misiones] [⚙️]    │ NAV
└─────────────────────────────────────────────────────────────┘

CONTROLES TABLET:
Joystick virtual (esquina inferior izquierda)
Botón de interacción (esquina inferior derecha, al acercarse a objeto)
```

---

## 8. PANTALLA: CASA DEL JUGADOR

```
┌─────────────────────────────────────────────────────────────┐
│ [← Salir]     Mi Casa     [🛍️ Catálogo]  [⭐ 1,240]       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ [Cuarto] [Sala] [Cocina] [Jardín] ← Tabs de habitaciones  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                                                      │  │
│  │    [VISTA ISOMÉTRICA DE LA HABITACIÓN]              │  │
│  │                                                      │  │
│  │    🛏️           🪴                                  │  │
│  │         👦                     🖼️                  │  │
│  │    🪑   ↑                                           │  │
│  │         Avatar del niño                             │  │
│  │                        [+] Espacio vacío            │  │
│  │                                                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  [🎨 Cambiar colores]  [📦 Mover objetos]  [✅ Listo]     │
│                                                             │
└─────────────────────────────────────────────────────────────┘

CATÁLOGO (panel lateral deslizable):
┌────────────────────┐
│  🛍️ Catálogo       │
│ ─────────────────  │
│ [Camas] [Sillas]  │
│ [Mesas] [Deco]    │
│ ─────────────────  │
│ ┌──┐ ┌──┐ ┌──┐   │
│ │🛏️│ │🛏️│ │🛏️│   │
│ │30⭐│ │60⭐│ │🔒│   │
│ └──┘ └──┘ └──┘   │
└────────────────────┘
```

---

## 9. PANTALLA: MINI-JUEGO EDUCATIVO

### Ejemplo: Reconocimiento de Letra

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  [🌟 Lumi] "¿Puedes tocar la letra M?"                    │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                                                      │  │
│  │                                                      │  │
│  │      ┌──────┐    ┌──────┐    ┌──────┐              │  │
│  │      │      │    │      │    │      │              │  │
│  │      │  M   │    │  A   │    │  T   │              │  │
│  │      │      │    │      │    │      │              │  │
│  │      └──────┘    └──────┘    └──────┘              │  │
│  │      [grande]   [grande]    [grande]                │  │
│  │                                                      │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  [🔊 Repetir]                                  [❓ Pista]  │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Al CORRECTO:
- Confeti explota
- Letras bailan
- Monedas caen: +10 ⭐
- Lumi celebra con voz

Al INCORRECTO:
- Letra incorrecta se sacude (no desaparece)
- Lumi: "¡Buen intento! Volvamos a intentarlo."
- Pista sutil: el sonido de la M se reproduce
```

### Ejemplo: Suma Visual

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  [🌟 Lumi] "¿Cuántas manzanas hay en total?"              │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                                                      │  │
│  │    🍎 🍎 🍎         🍎 🍎                           │  │
│  │                                                      │  │
│  │    3 manzanas   +   2 manzanas   =   ?              │  │
│  │                                                      │  │
│  │    [Barra visual de conteo]                         │  │
│  │    ●●●●● = 5                                        │  │
│  │                                                      │  │
│  │  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐              │  │
│  │  │  4  │  │  5  │  │  6  │  │  7  │              │  │
│  │  └─────┘  └─────┘  └─────┘  └─────┘              │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  [🔊 Repetir]    Toca cada manzana para contar            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 10. PANTALLA: SISTEMA DE MISIONES

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  [← Cerrar]        📋 Misiones                             │
│                                                             │
│  ┌────────────────────────────────────────────────────┐    │
│  │  MISIÓN ACTIVA                                     │    │
│  │  ─────────────────────────────────────────────     │    │
│  │  [Ícono misión] La Carta Perdida                   │    │
│  │                                                    │    │
│  │  Busca las letras C-A-S-A en el Bosque             │    │
│  │  ████████░░░░  50% completado                      │    │
│  │                                                    │    │
│  │  [C ✓] [A ✓] [S ] [A ]                           │    │
│  │                                                    │    │
│  │  Recompensa: 50⭐ + [Buzón Mágico]                 │    │
│  └────────────────────────────────────────────────────┘    │
│                                                             │
│  MISIONES DISPONIBLES (3)                                  │
│  ────────────────────────────────────────────────────────  │
│  [🧑 Berta] "Cuenta mis 7 gallinas"          20⭐ →      │
│  [🗺️ Desc.] "Explora el río del bosque"      30⭐ →      │
│  [⭐ Diaria] "Aprende 3 letras nuevas"        25⭐ →      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 11. PANTALLA: LOGRO DESBLOQUEADO

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│        ✨ ✨ ✨ ¡LOGRO DESBLOQUEADO! ✨ ✨ ✨             │
│                                                             │
│                                                             │
│              ╔═══════════════════════╗                     │
│              ║                       ║                     │
│              ║    🏆 [Badge Image]   ║                     │
│              ║                       ║                     │
│              ║  ¡Maestro de Vocales! ║                     │
│              ║                       ║                     │
│              ║  "¡Aprendiste A, E,  ║                     │
│              ║   I, O y U!"         ║                     │
│              ║                       ║                     │
│              ║    +75 ⭐             ║                     │
│              ║                       ║                     │
│              ╚═══════════════════════╝                     │
│                                                             │
│                   [ ¡Genial! ]                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Animación: Confeti cayendo, Lumi bailando
Audio: Fanfarria de logro + voz de Lumi celebrando
Duración: Se puede cerrar con tap
```

---

## 12. PANTALLA: PANEL DE PADRES

```
┌─────────────────────────────────────────────────────────────┐
│  ⚙️ Panel de Padres                              [← Salir] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Jugadores   [Sofía ▼]                                     │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  📊 ESTA SEMANA                                      │  │
│  │  ────────────────────────────────────────            │  │
│  │  ⏱️  Tiempo de juego: 3h 25min                      │  │
│  │  📅  Días jugados: 5 de 7                           │  │
│  │  ⭐  Racha actual: 5 días                           │  │
│  │                                                      │  │
│  │  📚 LECTURA                          Nivel 4/10     │  │
│  │  ████████░░  Letras aprendidas: 12/27               │  │
│  │                                                      │  │
│  │  🔤 Letras dominadas: A, E, I, O, U, M, P, L       │  │
│  │  📈 Aprendiendo: S, T                               │  │
│  │  ⚠️  Necesita práctica: R                           │  │
│  │                                                      │  │
│  │  🔢 MATEMÁTICAS                      Nivel 3/10     │  │
│  │  ████████░░  Sumas hasta 8 dominadas                │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  [📧 Enviar reporte por email]  [⚙️ Configuración]        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 13. WIREFRAMES DETALLADOS ASCII

### Mapa del Mundo (Vista Completa)

```
┌─────────────────────────────────────────────────────────────┐
│                    🗺️ MAPA DE VILLA AMPARO                 │
│                                                             │
│                    🏔️ MONTAÑA DE CUENTOS                   │
│                    (desbloqueada a nivel 5)                 │
│                           ↑                                 │
│                           │                                 │
│   🌊 MUNDO          🏡 VILLA           🌴 ISLA             │
│   SUBMARINO    ←   AMPARO (TÚ)    →   MATEMÁTICA          │
│   (nivel 8)         (centro)         (nivel 5)             │
│                           │                                 │
│                           │                                 │
│         🌲 BOSQUE     🏙️ CIUDAD    🎨 PARQUE              │
│         DE LETRAS  ↙  DE PALABRAS  CREATIVIDAD ↗          │
│         (nivel 1)     (nivel 3)     (nivel 7)              │
│                                                             │
│                    🌾 GRANJA EDUCATIVA                      │
│                    (nivel 7)                                │
│                                                             │
│  [🔵 Tu posición]  [🟢 Desbloqueada]  [🔴 Bloqueada]      │
└─────────────────────────────────────────────────────────────┘
```

### Diálogo con NPC

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│              [MUNDO 3D — SEMI-OSCURECIDO]                  │
│                                                             │
│                      [NPC TOMÁS]                           │
│                   animado, hablando                        │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                                                      │  │
│  │  👴 Tomás: "¡Explorador! ¡Qué bueno              │  │
│  │            encontrarte! Perdí mi carta..."         │  │
│  │                                                    │  │
│  │  [Subtítulos — por si el audio está bajo]         │  │
│  │                                                    │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│         [🔊 Repetir]           [▶ Continuar]               │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Nota: Los subtítulos son opcionales pero están siempre disponibles.
Todo el diálogo se narra automáticamente al aparecer.
```

---

### Resumen de Componentes UI Reutilizables

```
COMPONENTES BASE:
├── BigButton (80x80px mínimo, con audio en hover)
├── VoiceButton (reproducir narración)
├── CoinDisplay (⭐ contador animado)
├── AvatarPreview (vista 3D del avatar)
├── LetterCard (letra grande con personaje)
├── OptionCard (opción de respuesta visual)
├── ProgressBar (barra de progreso animada)
├── RewardPopup (popup de recompensa)
├── AchievementBanner (banner de logro)
├── NPCDialog (cuadro de diálogo de NPC)
├── MissionCard (tarjeta de misión)
└── LumiWidget (Lumi flotante con mensajes)

PALETA DE COLORES UI:
Primario:    #FFD700 (Dorado Villa)
Secundario:  #87CEEB (Azul Cielo)
Acento:      #FF6B6B (Rojo Coral)
Éxito:       #90EE90 (Verde Suave)
Fondo:       #FFFDF0 (Blanco Cálido)
Texto:       #3D2B1F (Marrón Oscuro)

TIPOGRAFÍA:
Títulos:     "Nunito" Bold (redondeada, amigable)
Cuerpo:      "Nunito" Regular
Nota: Las letras del abecedario usan tipografía especial 
      diseñada para claridad en lectura infantil
```

---

*Wireframes de Villa Amparo — Versión 1.0 | Mayo 2026*
