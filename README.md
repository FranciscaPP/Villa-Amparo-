# 🏡 Villa Amparo — Videojuego Educativo Inmersivo

> **Un mundo mágico donde aprender es la aventura.**

Villa Amparo es un videojuego educativo de mundo abierto para niños de 5 a 8 años. Inspirado en Roblox, Animal Crossing, Disney Dreamlight Valley y Minecraft, enseña lectura, escritura, fonética, matemáticas y pensamiento lógico a través de exploración, misiones, construcción y recompensas — sin que el niño sienta que está estudiando.

---

## Documentación del Proyecto

| Documento | Descripción |
|-----------|-------------|
| [Game Design Document](docs/GDD.md) | Diseño completo del juego, mecánicas, mundos y sistemas |
| [Arquitectura Técnica](docs/ARCHITECTURE.md) | Stack tecnológico, estructura de carpetas y flujos de datos |
| [Base de Datos](docs/DATABASE.md) | Esquema completo de Supabase con todas las tablas y relaciones |
| [Sistema Educativo](docs/EDUCATIONAL_SYSTEM.md) | Motor de aprendizaje adaptativo, contenido curricular y progresión |
| [Diseño de Mundos](docs/WORLD_DESIGN.md) | Cada zona del mapa con sus mecánicas educativas |
| [Sistema de Recompensas](docs/REWARDS.md) | Economía del juego, monedas, objetos y personalización |
| [Wireframes](docs/WIREFRAMES.md) | Pantallas principales y flujos de usuario |
| [Roadmap MVP 30 días](docs/ROADMAP.md) | Plan de desarrollo semana a semana hasta lanzamiento |
| [Plan de Escalamiento](docs/SCALING.md) | Visión a largo plazo, monetización y crecimiento |

---

## Stack Tecnológico

```
Frontend:   React 18 + Three.js + Tailwind CSS
Backend:    Supabase (PostgreSQL + Auth + Realtime + Storage)
IA:         OpenAI GPT-4o (adaptación curricular)
Voz:        Web Speech API + ElevenLabs TTS
Estado:     Zustand
Build:      Vite
Deploy:     Vercel
```

---

## Inicio Rápido

```bash
# Clonar repositorio
git clone https://github.com/franciscapp/villa-amparo-

# Instalar dependencias
cd villa-amparo
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Completar SUPABASE_URL, SUPABASE_ANON_KEY, OPENAI_API_KEY, ELEVENLABS_API_KEY

# Iniciar desarrollo
npm run dev
```

---

## Principios del Proyecto

- **El niño nunca debe sentir que está estudiando**
- **Todo está narrado por voz — cero lectura requerida para jugar**
- **Cada aprendizaje se recompensa inmediatamente**
- **Nunca se dice "incorrecto" — siempre mensajes positivos**
- **La IA adapta la dificultad en tiempo real**

---

*Desarrollado con amor para que cada niño descubra que aprender es la mayor aventura.*
