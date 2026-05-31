# ROADMAP DE DESARROLLO — VILLA AMPARO
## Plan MVP 30 Días + Hoja de Ruta Completa
## Versión 1.0 | Mayo 2026

---

## ÍNDICE

1. [Resumen Ejecutivo MVP](#1-resumen-ejecutivo-mvp)
2. [Equipo Mínimo Recomendado](#2-equipo-mínimo-recomendado)
3. [Semana 1: Fundamentos](#3-semana-1-fundamentos)
4. [Semana 2: Mundo y Personaje](#4-semana-2-mundo-y-personaje)
5. [Semana 3: Sistema Educativo](#5-semana-3-sistema-educativo)
6. [Semana 4: Integración y Lanzamiento](#6-semana-4-integración-y-lanzamiento)
7. [Definición del MVP Lanzable](#7-definición-del-mvp-lanzable)
8. [Criterios de Éxito MVP](#8-criterios-de-éxito-mvp)
9. [Riesgos y Mitigaciones](#9-riesgos-y-mitigaciones)

---

## 1. RESUMEN EJECUTIVO MVP

### ¿Qué es el MVP?

El MVP (Minimum Viable Product) de Villa Amparo es una versión completamente jugable que demuestra el concepto central:

**Un niño de 5 años puede jugar solo, sin saber leer, durante 30 minutos y aprender letras sin darse cuenta de que está estudiando.**

### Alcance del MVP (30 días)

| Incluido en MVP | Excluido del MVP |
|----------------|-----------------|
| ✅ Creación de avatar (básica) | ❌ Avatar con 50+ opciones |
| ✅ Villa Amparo + Bosque de Letras | ❌ Todas las 8 zonas |
| ✅ Vocales (A, E, I, O, U) | ❌ Abecedario completo |
| ✅ 5 mini-juegos educativos | ❌ 20+ mini-juegos |
| ✅ Sistema de voz (Lumi) | ❌ Voz premium full |
| ✅ Casa básica decorable | ❌ 7 habitaciones |
| ✅ 3 misiones principales | ❌ 50+ misiones |
| ✅ Sistema de monedas | ❌ Catálogo completo |
| ✅ Guardado en Supabase | ❌ Panel de padres completo |
| ✅ AIProviderService básico | ❌ IA generativa avanzada |

### Tech Stack MVP

```
Frontend:  React 18 + Three.js + Tailwind CSS
Backend:   Supabase (gratis hasta 500MB)
IA:        Claude Haiku (proveedor por defecto) vía AIProviderService
Voz:       Web Speech API (gratuito) + ElevenLabs (starter)
Deploy:    Vercel (gratuito)
```

### Costo Estimado MVP

| Recurso | Costo Mensual |
|---------|--------------|
| Supabase (Free Tier) | $0 |
| Vercel (Hobby) | $0 |
| ElevenLabs (Starter) | $5 |
| Claude API (estimado 100 usuarios) | ~$15 |
| Dominio | $12/año ≈ $1/mes |
| **Total** | **~$21/mes** |

---

## 2. EQUIPO MÍNIMO RECOMENDADO

### Para completar el MVP en 30 días:

| Rol | Horas/Semana | Descripción |
|-----|-------------|-------------|
| Full-Stack Dev | 40h | React, Three.js, Supabase |
| Diseñador UI/UX | 20h | Assets 2D, UI, animaciones básicas |
| Creador de Contenido | 10h | Scripts de voz, currículum |

### Para un solo desarrollador:

Si hay un solo desarrollador full-stack, el MVP es viable en **45 días** usando assets pre-hechos (Kenney, itch.io).

---

## 3. SEMANA 1: FUNDAMENTOS

### Objetivo
Tener el proyecto configurado, Supabase funcionando, la pantalla de login, selección de perfil y creación básica de avatar.

### Día 1-2: Setup del Proyecto

```bash
Tareas:
□ Crear repositorio Git
□ Configurar Vite + React + TypeScript
□ Instalar Three.js + React Three Fiber + Drei
□ Configurar Tailwind CSS
□ Configurar ESLint + Prettier
□ Setup Supabase (proyecto nuevo)
□ Aplicar migraciones iniciales de BD
□ Setup variables de entorno
□ Deploy inicial en Vercel (vacío)

Entregable: Proyecto corriendo en localhost y en Vercel
```

### Día 3-4: Autenticación y Perfiles

```bash
Tareas:
□ Login de padres con Supabase Auth
□ Registro de cuenta
□ Recuperación de contraseña
□ Crear perfil de niño (formulario básico)
□ Selección de perfil de niño (sin contraseña)
□ RLS policies en Supabase
□ Tests básicos de autenticación

Entregable: Padres pueden crear cuenta y perfiles de hijos
```

### Día 5-6: Sistema de Voz (Base)

```bash
Tareas:
□ Hook useVoice() con Web Speech API
□ Fallback graceful si TTS no disponible
□ Integración ElevenLabs vía Edge Function
□ Cache de audios comunes
□ Componente LumiWidget básico
□ Auto-narración de botones (hover/tap)
□ Probar en español (es-ES)

Entregable: Sistema de voz funcionando con Lumi
```

### Día 7: Creación de Avatar (MVP)

```bash
Tareas:
□ Pantalla de creación en pasos
□ Opciones básicas: tono de piel (6), pelo (4 estilos, 6 colores)
□ Ropa básica (2 opciones top, 2 pantalón)
□ Sombrero (3 opciones)
□ Mascota inicial (4 opciones)
□ Nombre del personaje (teclado visual)
□ Vista previa 3D básica (modelo placeholder)
□ Guardar avatar en Supabase

Entregable: Niño puede crear su personaje completo
```

**Checkpoint Semana 1:** Un padre puede crear cuenta, agregar un hijo, y el niño puede crear su avatar. Sistema de voz operativo.

---

## 4. SEMANA 2: MUNDO Y PERSONAJE

### Objetivo
El niño puede explorar Villa Amparo y el Bosque de Letras con su avatar. El mundo se ve hermoso y las letras vuelan.

### Día 8-9: Motor 3D Básico

```bash
Tareas:
□ Canvas Three.js con React Three Fiber
□ Terreno básico de Villa Amparo (plano con textura)
□ Sistema de cámara isométrica/tercera persona
□ Iluminación básica (ambient + directional)
□ Skybox con cielo colorido
□ Pasto y árboles decorativos (instancing)
□ FPS target: 60 desktop, 30 tablet

Entregable: Mundo 3D básico que se ve bonito
```

### Día 10-11: Personaje del Jugador

```bash
Tareas:
□ Modelo 3D básico del avatar (placeholder estilizado)
□ Movimiento WASD / flechas
□ Joystick virtual para tablet
□ Animación de caminar
□ Colisiones simples (AABB con obstáculos)
□ Mascota siguiendo al jugador
□ HUD básico (monedas, nivel)

Entregable: El niño puede mover su personaje por el mundo
```

### Día 12-13: Bosque de Letras

```bash
Tareas:
□ Zona separada "Bosque de Letras"
□ Transición al entrar a la zona
□ Letras flotantes (A, E, I, O, U) como entidades coleccionables
□ Animación de vuelo de letras
□ Brillo/partículas mágicas en letras
□ Sonido al recoger letra
□ Lumi presenta cada letra recogida

Entregable: El niño puede explorar el bosque y atrapar letras
```

### Día 14: NPCs y Diálogos

```bash
Tareas:
□ Sistema de NPC básico (modelo + colisión)
□ Anciano Tomás (NPC principal del MVP)
□ Sistema de diálogo (caja de texto narrada)
□ Misión trigger al hablar con Tomás
□ Lumi aparece al lado del jugador durante diálogos

Entregable: El niño puede hablar con Tomás y recibir su primera misión
```

**Checkpoint Semana 2:** El niño puede explorar Villa Amparo y el Bosque, recoger letras, y hablar con Tomás.

---

## 5. SEMANA 3: SISTEMA EDUCATIVO

### Objetivo
Los mini-juegos educativos están funcionando. El niño aprende las vocales de forma natural.

### Día 15-16: Mini-Juegos de Letras (3 tipos)

```bash
Tareas:
□ MinigameContainer (overlay sobre el mundo)
□ Juego 1: Reconocimiento de letra
  - El niño ve 3 letras, debe tocar la correcta
  - Narración completa por Lumi
  - Animación de éxito/intento

□ Juego 2: Asociación palabra-imagen
  - Imagen de objeto → niño elige la letra inicial
  - 3 opciones visuales (imágenes grandes)
  - Audio de la palabra al elegir

□ Juego 3: ¿Qué objeto empieza con X?
  - Se muestra la letra
  - 3 imágenes de objetos
  - El niño elige el correcto

□ Sistema de recompensa (confeti + monedas)
□ Sistema de pistas y respuesta positiva

Entregable: 3 mini-juegos educativos completos y narrados
```

### Día 17-18: Sistema de Fonética (Vocales)

```bash
Tareas:
□ Datos de las 5 vocales (letra, sonido, palabras, personaje)
□ Personaje-letra animado para A, E, I, O, U
□ Pantalla de presentación de nueva letra
□ Sonido fonético al presentar letra
□ 3 palabras de ejemplo con imagen por vocal
□ Progreso de letras en Supabase

Entregable: Las 5 vocales se pueden aprender completamente
```

### Día 19-20: Casa del Jugador (Básica)

```bash
Tareas:
□ Vista isométrica de la habitación principal
□ Muebles de inicio (cama básica, silla básica)
□ Sistema de colocación de muebles (grid)
□ Catálogo básico (6 muebles para comprar)
□ Sistema de compra con monedas
□ Guardar estado de la casa en Supabase

Entregable: El niño puede decorar su habitación básica
```

### Día 21: Sistema de Misiones (3 misiones MVP)

```bash
Tareas:
□ MissionSystem básico
□ Misión 1: "Tu Primera Letra" — aprende la A
□ Misión 2: "La Carta de Tomás" — busca C-A-S-A
□ Misión 3: "Ilumina tu Casa" — decora 3 objetos
□ Rastreo de progreso de misión
□ Recompensa al completar

Entregable: 3 misiones completas y jugables
```

**Checkpoint Semana 3:** Las 5 vocales enseñables, 3 mini-juegos, casa decorable, 3 misiones.

---

## 6. SEMANA 4: INTEGRACIÓN Y LANZAMIENTO

### Objetivo
Pulir, integrar todo, agregar AIProviderService básico, y lanzar.

### Día 22-23: AIProviderService (MVP)

```bash
Tareas:
□ Interface AIProvider
□ ClaudeProvider (proveedor por defecto)
□ OpenAIProvider (alternativa)
□ Fallback a respuestas estáticas
□ Integrar en el flujo de adaptación básica
□ Rate limiting por sesión
□ SafetyFilter básico

Entregable: AIProviderService funcionando con Claude como default
```

### Día 24-25: Polish y UX

```bash
Tareas:
□ Cutscene introductoria (animada en CSS/Canvas)
□ Transiciones suaves entre pantallas
□ Animaciones de celebración (confeti)
□ Música de fondo por zona (2 tracks)
□ SFX: correcto, incorrecto, monedas, hover
□ Pantalla de bienvenida personalizada al regresar
□ Loading screen con tips de Lumi
□ Responsive: tablet y desktop funcionales

Entregable: Juego se ve y se siente profesional
```

### Día 26-27: Panel de Padres (Básico)

```bash
Tareas:
□ Vista de progreso de letras aprendidas
□ Tiempo de juego total y por semana
□ Logros desbloqueados
□ Gráfico simple de actividad por días
□ Configuración: límite de tiempo de sesión

Entregable: Padres pueden ver el progreso de sus hijos
```

### Día 28: Testing y QA

```bash
Tareas:
□ Testing con niños reales (5-8 años, 3 sesiones)
□ Verificar que TODA la UI es comprensible sin leer
□ Probar en tablet (iPad principal)
□ Probar en Chrome, Safari, Firefox
□ Verificar que TTS funciona en todos los browsers
□ Testing de performance (60fps desktop, 30fps tablet)
□ Verificar que RLS de Supabase está correcto
□ Revisar seguridad (sin datos expuestos al cliente)

Entregable: Lista de bugs críticos corregida
```

### Día 29: Fix de Bugs Críticos

```bash
Tareas:
□ Corregir todos los bugs críticos del día 28
□ Verificar flujo completo de nuevo usuario
□ Verificar guardado de progreso
□ Verificar sistema de voz en iOS Safari
□ Optimizar carga inicial (< 5 segundos)

Entregable: Versión estable sin bugs críticos
```

### Día 30: Lanzamiento

```bash
Tareas:
□ Deploy en Vercel Production
□ Configurar dominio
□ Configurar Supabase Production
□ Documentar instrucciones de uso para padres
□ Crear correo de soporte
□ Anuncio en canales propios (si aplica)
□ Monitoreo de errores (Sentry o similar)

Entregable: villaamparo.com está online y funcionando
```

---

## 7. DEFINICIÓN DEL MVP LANZABLE

### El MVP está listo cuando:

**Funcional:**
- [ ] Un niño de 5 años puede crear su avatar sin ayuda adulta (narrado)
- [ ] El niño puede explorar Villa Amparo + Bosque de Letras
- [ ] El niño puede aprender las 5 vocales (A, E, I, O, U)
- [ ] El niño puede completar 3 mini-juegos educativos
- [ ] El niño puede decorar su casa básica
- [ ] El progreso se guarda y se recupera al volver
- [ ] La recompensa de monedas funciona
- [ ] Lumi narra TODAS las instrucciones

**Técnico:**
- [ ] Carga en < 5 segundos en red normal
- [ ] 60 FPS en desktop, 30 FPS en tablet
- [ ] Sin crashes en sesión de 30 minutos
- [ ] Funciona en Chrome, Safari, Firefox
- [ ] Funciona en tablet (landscape mode)
- [ ] Datos de niños protegidos con RLS

**Educativo:**
- [ ] Probado con al menos 3 niños de 5-8 años
- [ ] Tasa de comprensión de instrucciones > 80% sin ayuda adulta
- [ ] Ningún niño se frustró y abandonó en los primeros 10 minutos

---

## 8. CRITERIOS DE ÉXITO MVP

### Métricas de Lanzamiento (Primeros 30 días post-launch)

| Métrica | Objetivo |
|---------|---------|
| Usuarios registrados | 100+ familias |
| Sesiones de juego | 500+ sesiones |
| Duración promedio de sesión | > 20 minutos |
| Retención día 7 | > 40% |
| Retención día 30 | > 20% |
| Vocales completadas por niño | > 3 de 5 |
| NPS (Net Promoter Score) | > 50 |
| Bugs críticos post-launch | 0 |

---

## 9. RIESGOS Y MITIGACIONES

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|-----------|
| TTS no funciona en Safari iOS | Alta | Crítico | Web Speech API como fallback |
| Performance < 30fps en tablet | Media | Alto | Reducir polígonos, usar sprites 2D |
| Niños no entienden instrucciones | Media | Crítico | Pruebas con niños reales semana 3 |
| API de IA muy lenta | Baja | Medio | Cache + respuestas estáticas de fallback |
| Supabase supera free tier | Baja | Bajo | Migrar a paid tier ($25/mes) |
| Costo IA mayor al esperado | Media | Medio | Rate limiting por sesión |

---

*Roadmap MVP 30 Días — Villa Amparo | Versión 1.0 | Mayo 2026*
