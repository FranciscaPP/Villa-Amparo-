# SISTEMA DE RECOMPENSAS — VILLA AMPARO
## Economía del Juego, Objetos y Personalización
## Versión 1.0 | Mayo 2026

---

## ÍNDICE

1. [Filosofía del Sistema de Recompensas](#1-filosofía-del-sistema-de-recompensas)
2. [Moneda del Juego](#2-moneda-del-juego)
3. [Fuentes de Monedas](#3-fuentes-de-monedas)
4. [Catálogo de Objetos](#4-catálogo-de-objetos)
5. [Sistema de Logros](#5-sistema-de-logros)
6. [Recompensas Diarias](#6-recompensas-diarias)
7. [Sistema de Niveles y Desbloqueos](#7-sistema-de-niveles-y-desbloqueos)
8. [Economía Balanceada](#8-economía-balanceada)

---

## 1. FILOSOFÍA DEL SISTEMA DE RECOMPENSAS

### Principio Central

**No existe aprendizaje sin recompensa.**

Cada vez que el niño aprende algo nuevo — una letra, una palabra, un número — recibe retroalimentación positiva inmediata y tangible.

### Ciclo de Recompensa

```
Acción de aprendizaje
         │
         ▼ (< 2 segundos)
Retroalimentación visual + audio
         │
         ▼ (< 1 segundo)
Monedas animadas cayendo
         │
         ▼
Objeto o progreso desbloqueado
         │
         ▼
Personalización de casa/avatar
         │
         ▼
Motivación para seguir aprendiendo
```

### Tipos de Recompensas

| Tipo | Inmediatez | Impacto |
|------|-----------|---------|
| Celebración sonora/visual | Instantánea | Dopamina inmediata |
| Monedas (in-game) | Instantánea | Valor de uso |
| XP / Subida de nivel | Acumulada | Progresión visible |
| Objetos cosméticos | Inmediata o diferida | Personalización |
| Nuevas zonas | Por nivel | Curiosidad/exploración |
| NPCs nuevos | Por misión | Narrativa |
| Logros | Por hito | Orgullo / coleccionismo |
| Racha de días | Por constancia | Hábito de aprendizaje |

---

## 2. MONEDA DEL JUEGO

### Estrellas de Villa (⭐)

**Nombre en juego:** "Estrellas de Villa"
**Apariencia:** Estrella dorada brillante con destello de luz
**Sonido al ganar:** Tintineo mágico ascendente (3 notas)
**Animación:** Las estrellas vuelan desde la actividad hacia el contador del HUD

**Reglas de la moneda:**
- Solo se gana jugando (sin compras con dinero real)
- No expira
- No se puede transferir entre jugadores
- El saldo siempre es visible en el HUD

**Contador en HUD:**
```
[⭐ 1,240]
         ↑
         Animación de +10 flotando al ganar
```

---

## 3. FUENTES DE MONEDAS

### Por Actividades Educativas

| Acción | Estrellas |
|--------|-----------|
| Respuesta correcta — 1er intento | ⭐ 10 |
| Respuesta correcta — 2do intento | ⭐ 7 |
| Respuesta correcta — 3er intento | ⭐ 3 |
| Mini-juego completado | ⭐ 25 |
| Mini-juego con puntaje perfecto | ⭐ 40 |
| Nueva letra aprendida | ⭐ 30 |
| Nueva palabra agregada al diccionario | ⭐ 15 |
| Suma/resta resuelta correctamente | ⭐ 10 |
| Historia completada | ⭐ 20 |

### Por Misiones

| Tipo de Misión | Estrellas |
|---------------|-----------|
| Misión diaria (fácil) | ⭐ 20 |
| Misión secundaria (normal) | ⭐ 50 |
| Misión principal (importante) | ⭐ 100 |
| Misión de descubrimiento | ⭐ 30 |
| Misión especial de zona | ⭐ 75 |

### Por Exploración y Descubrimiento

| Acción | Estrellas |
|--------|-----------|
| Primera visita a nueva zona | ⭐ 30 |
| Cofre encontrado (exploración) | ⭐ 15-50 |
| Objeto secreto descubierto | ⭐ 20 |
| NPC encontrado por primera vez | ⭐ 10 |

### Por Constancia

| Acción | Estrellas |
|--------|-----------|
| Entrar al juego (diario) | ⭐ 10 |
| Racha de 3 días | ⭐ 40 |
| Racha de 7 días | ⭐ 100 |
| Racha de 14 días | ⭐ 200 |
| Racha de 30 días | ⭐ 500 |

### Por Logros

| Logro | Estrellas |
|-------|-----------|
| Primera letra aprendida | ⭐ 25 |
| Todas las vocales dominadas | ⭐ 75 |
| 10 palabras aprendidas | ⭐ 50 |
| Primera misión completada | ⭐ 30 |
| Nivel 5 alcanzado | ⭐ 150 |
| Casa completamente decorada | ⭐ 100 |

---

## 4. CATÁLOGO DE OBJETOS

### Muebles para el Hogar

#### Camas

| ID | Nombre | Estrellas | Nivel | Descripción |
|----|--------|-----------|-------|-------------|
| bed_starter | Cama Básica | 0 ⭐ | 1 | Disponible al inicio |
| bed_cloud | Cama Nube | 30 ⭐ | 2 | Cama con nubes reales que flotan |
| bed_castle | Cama Castillo | 60 ⭐ | 4 | Con torres y bandera |
| bed_rocket | Cama Cohete | 80 ⭐ | 6 | Con luces que parpadean |
| bed_rainbow | Cama Arcoíris | 100 ⭐ | 7 | Con arcoíris que brilla |
| bed_dragon | Cama Dragón | 120 ⭐ | 9 | El dragón "respira" vapor |

#### Sillas y Asientos

| ID | Nombre | Estrellas | Nivel |
|----|--------|-----------|-------|
| chair_balloon | Silla Globo | 20 ⭐ | 2 |
| throne_colors | Trono de Colores | 50 ⭐ | 5 |
| hammock | Hamaca Mágica | 35 ⭐ | 4 |
| bean_star | Puff Estrella | 25 ⭐ | 3 |
| swing_indoor | Columpio Interior | 40 ⭐ | 5 |

#### Mesas

| ID | Nombre | Estrellas | Nivel |
|----|--------|-----------|-------|
| table_crystal | Mesa de Cristal | 35 ⭐ | 3 |
| table_magic | Mesa Flotante | 55 ⭐ | 6 |
| table_candy | Mesa Caramelo | 30 ⭐ | 4 |
| desk_letters | Escritorio de Letras | 45 ⭐ | 5 |

#### Decoración de Pared

| ID | Nombre | Estrellas | Nivel |
|----|--------|-----------|-------|
| poster_alphabet | Póster del Abecedario | 20 ⭐ | 1 |
| stars_ceiling | Estrellas de Techo | 25 ⭐ | 2 |
| rainbow_arch | Arco Arcoíris | 40 ⭐ | 4 |
| trophy_shelf | Estante de Trofeos | 30 ⭐ | 3 |
| window_magic | Ventana Mágica | 50 ⭐ | 6 |

#### Objetos Especiales (Desbloqueables)

| ID | Nombre | Estrellas | Requisito | Efecto |
|----|--------|-----------|-----------|--------|
| tree_letters | Árbol de Letras | 80 ⭐ | Nivel 5 | Muestra letras aprendidas |
| fountain_numbers | Fuente de Números | 75 ⭐ | Nivel 5 | Muestra números dominados |
| bookshelf_magic | Librería Mágica | 90 ⭐ | Nivel 6 | Guarda historias leídas |
| globe_world | Globo del Mundo | 100 ⭐ | Nivel 7 | Muestra zonas visitadas |
| trophy_gold | Trofeo de Oro | Premio | Logro especial | Brilla permanentemente |

---

### Ropa y Accesorios del Avatar

#### Tops (Parte Superior)

| Nombre | Estrellas | Nivel | Colores |
|--------|-----------|-------|---------|
| Camiseta básica | 0 ⭐ | 1 | 5 colores |
| Capa de Explorador | 40 ⭐ | 3 | 4 colores |
| Overol de Aventura | 35 ⭐ | 3 | 3 colores |
| Suéter Estrellado | 30 ⭐ | 2 | 5 colores |
| Camiseta de Dragón | 50 ⭐ | 5 | 3 colores |
| Traje de Astronauta | 70 ⭐ | 7 | 2 colores |
| Disfraz de Pirata | 60 ⭐ | 6 | 2 colores |
| Disfraz de Hada | 65 ⭐ | 6 | 4 colores |
| Camiseta Arcoíris | 80 ⭐ | 8 | Fija (arcoíris) |

#### Sombreros

| Nombre | Estrellas | Nivel |
|--------|-----------|-------|
| Sin sombrero | 0 ⭐ | 1 |
| Gorra básica | 15 ⭐ | 1 |
| Sombrero Explorador | 25 ⭐ | 2 |
| Corona de Flores | 30 ⭐ | 3 |
| Beanie Estrellado | 20 ⭐ | 2 |
| Sombrero Pirata | 40 ⭐ | 4 |
| Corona Dorada | 80 ⭐ | 8 |
| Sombrero de Cohete | 45 ⭐ | 5 |
| Sombrero de Hechicero | 55 ⭐ | 6 |

#### Zapatillas

| Nombre | Estrellas | Nivel |
|--------|-----------|-------|
| Tenis básicos | 0 ⭐ | 1 |
| Botas de Aventura | 25 ⭐ | 2 |
| Tenis de Cohete | 40 ⭐ | 4 |
| Sandalias de Playa | 20 ⭐ | 2 |
| Botas Mágicas | 60 ⭐ | 6 |
| Tenis Arcoíris | 75 ⭐ | 7 |

#### Mochilas

| Nombre | Estrellas | Nivel | Efecto especial |
|--------|-----------|-------|----------------|
| Mochila Básica | 0 ⭐ | 1 | — |
| Mochila de Dinosaurio | 35 ⭐ | 3 | Rugido al saltar |
| Mochila Espacial | 45 ⭐ | 5 | Partículas de estrellas |
| Mochila de Flores | 30 ⭐ | 3 | Deja rastro de pétalos |
| Mochila de Libros | 40 ⭐ | 4 | Muestra letras aprendidas |
| Mochila de Corazones | 35 ⭐ | 3 | Deja rastro de corazones |
| Mochila de Dragón | 70 ⭐ | 7 | "Respira" chispas |

---

### Mascotas

| Nombre | Tipo | Estrellas | Nivel | Descripción |
|--------|------|-----------|-------|-------------|
| Naranjo | Gatito | 0 ⭐ | 1 | Maúlla con letras |
| Manchas | Perrito | 0 ⭐ | 1 | Ladra canciones |
| Nube | Conejito | 0 ⭐ | 1 | Salta con estrellas |
| Pipín | Pollito | 0 ⭐ | 1 | Pía números |
| Estrellita | Poni | 50 ⭐ | 5 | Deja estelas de luz |
| Burbujas | Pez | 40 ⭐ | 4 | Flota y hace burbujas |
| Chispa | Dragón Bebé | 80 ⭐ | 8 | Hace chispas de colores |
| Nívea | Oso Polar | 70 ⭐ | 7 | Deja rastro de copos de nieve |
| Arco | Unicornio | 100 ⭐ | 10 | Arcoíris al caminar |

**Comportamientos de Mascotas:**
- Las mascotas reaccionan cuando el niño gana/pierde
- Celebran con baile cuando hay logro
- Tienen "hambre" (si no se juega un día, tienen cartel de 🍽️)
- Se pueden "acariciar" con tap → sonido feliz + corazones

---

### Decoraciones del Jardín

| Nombre | Estrellas | Nivel |
|--------|-----------|-------|
| Flores básicas | 0 ⭐ | 1 |
| Árbol de Letras | 45 ⭐ | 4 |
| Fuente de Agua | 35 ⭐ | 3 |
| Casa del Pájaro | 25 ⭐ | 2 |
| Letrero de Bienvenida | 15 ⭐ | 1 |
| Arcoíris de Jardín | 80 ⭐ | 8 |
| Columpio Mágico | 50 ⭐ | 5 |
| Estanque de Peces | 60 ⭐ | 6 |
| Castillo de Juegos | 90 ⭐ | 9 |

---

## 5. SISTEMA DE LOGROS

### Categoría: Lectura

| Código | Nombre | Descripción | Estrellas |
|--------|--------|-------------|-----------|
| first_letter | ¡Primera Letra! | Aprende tu primera letra | ⭐ 25 |
| all_vowels | Maestro de Vocales | Domina las 5 vocales | ⭐ 75 |
| ten_letters | Coleccionista de Letras | Aprende 10 letras | ⭐ 100 |
| full_alphabet | ¡El Abecedario Completo! | Aprende todas las letras | ⭐ 500 |
| first_word | ¡Primera Palabra! | Construye tu primera palabra | ⭐ 30 |
| fifty_words | Vocabulario Increíble | Aprende 50 palabras | ⭐ 150 |
| first_story | Lector Estrella | Completa tu primera historia | ⭐ 40 |

### Categoría: Matemáticas

| Código | Nombre | Descripción | Estrellas |
|--------|--------|-------------|-----------|
| count_to_10 | ¡Cuento hasta 10! | Cuenta hasta 10 correctamente | ⭐ 40 |
| first_addition | ¡Primera Suma! | Resuelve tu primera suma | ⭐ 25 |
| first_subtraction | ¡Primera Resta! | Resuelve tu primera resta | ⭐ 25 |
| math_genius | Pequeño Genio | 50 operaciones correctas | ⭐ 100 |

### Categoría: Exploración

| Código | Nombre | Descripción | Estrellas |
|--------|--------|-------------|-----------|
| first_zone | ¡Explorador! | Visita tu primera zona nueva | ⭐ 20 |
| all_zones | Gran Explorador | Visita todas las zonas | ⭐ 200 |
| first_chest | ¡Tesoro Encontrado! | Abre tu primer cofre | ⭐ 15 |
| hundred_items | Coleccionista | Colecciona 100 objetos | ⭐ 100 |

### Categoría: Construcción

| Código | Nombre | Descripción | Estrellas |
|--------|--------|-------------|-----------|
| first_furniture | ¡Mi Primera Silla! | Coloca tu primer mueble | ⭐ 20 |
| full_room | ¡Habitación Decorada! | Completa una habitación | ⭐ 60 |
| full_house | ¡Hogar Perfecto! | Decora todas las habitaciones | ⭐ 200 |
| all_pets | Amigo de los Animales | Consigue 5 mascotas | ⭐ 100 |

### Categoría: Constancia

| Código | Nombre | Descripción | Estrellas |
|--------|--------|-------------|-----------|
| streak_3 | ¡3 días seguidos! | 3 días de racha | ⭐ 40 |
| streak_7 | ¡Una semana completa! | 7 días de racha | ⭐ 100 |
| streak_30 | ¡Héroe del mes! | 30 días de racha | ⭐ 500 |
| hundred_sessions | ¡100 aventuras! | 100 sesiones de juego | ⭐ 200 |

### Presentación de Logros

```
[Animación al desbloquear logro]

┌─────────────────────────────────┐
│  ✨ ¡LOGRO DESBLOQUEADO! ✨     │
│                                 │
│     🏆                          │
│  [imagen del badge]             │
│                                 │
│  ¡Maestro de Vocales!           │
│  Aprendiste A, E, I, O y U     │
│                                 │
│  +75 ⭐ Estrellas de Villa      │
└─────────────────────────────────┘

Lumi: "¡INCREÍBLE! ¡Eres el Maestro de las Vocales!
       ¡A, E, I, O, U! ¡Las conoces todas!"
```

---

## 6. RECOMPENSAS DIARIAS

### Sistema de Calendario de Racha

```
DÍA 1  DÍA 2  DÍA 3  DÍA 4  DÍA 5  DÍA 6  DÍA 7
 ✅     ✅     ✅     ⬜     ⬜     ⬜     🎁
⭐20   ⭐25   ⭐30   ⭐35   ⭐40   ⭐50  ⭐100+OBJETO
```

### Recompensa de Día 7

El día 7 de racha incluye:
- ⭐ 100 estrellas
- Objeto aleatorio (de rareza "uncommon" o mayor)
- Animación especial de celebración de Lumi

### Si se Rompe la Racha

```
Lumi: "¡Hola! ¡Qué bueno que volviste!"
      "Extrañamos mucho a [nombre]."
      "¡Empezamos una nueva aventura juntos!"
```

No hay penalización. No hay mensajes negativos.
La racha simplemente vuelve a empezar.

---

## 7. SISTEMA DE NIVELES Y DESBLOQUEOS

### Tabla Completa de Desbloqueos

| Nivel | XP | Desbloqueos |
|-------|-----|------------|
| 1 | 0 | Inicio del juego, Villa Amparo, Bosque de Letras, 4 mascotas iniciales |
| 2 | 200 | 10 muebles nuevos, 5 colores de ropa extra |
| 3 | 500 | Ciudad de Palabras, 8 muebles nuevos |
| 4 | 900 | 4 mascotas nuevas, 2 mochilas especiales |
| 5 | 1,400 | Montaña de Cuentos, Isla Matemática, Escritorio de Letras |
| 6 | 2,000 | Nueva habitación (Cocina), 10 muebles nuevos |
| 7 | 2,700 | Granja Educativa, Parque de Creatividad |
| 8 | 3,500 | Mundo Submarino, Arco Arcoíris jardín |
| 9 | 4,400 | Biblioteca del hogar, Tesoros especiales |
| 10 | 5,500 | Laboratorio del hogar, Modo "Guardián de Villa Amparo" |

### Animación de Subida de Nivel

```
[Rayo de luz desde el cielo]
[Personaje brilla dorado]
[Explosión de confeti y estrellas]
[Fanfarria musical completa]

Lumi: "¡¡¡SUBISTE DE NIVEL!!!"
      "¡Eres el nivel [N]!"
      "¡Mira todo lo que desbloqueaste!"

[Carousel de nuevos objetos disponibles]
```

---

## 8. ECONOMÍA BALANCEADA

### Balance de Monedas (Jugador Promedio)

**Por sesión de 30 minutos:**
- Actividades educativas: ~150 ⭐
- Misiones completadas: ~100 ⭐
- Exploración: ~30 ⭐
- Recompensa diaria: ~25 ⭐
- **Total por sesión:** ~305 ⭐

**Costo de objetos más deseados:**
- Mascota nueva (nivel 5): 50 ⭐ → 0.2 sesiones
- Cama Nube: 30 ⭐ → 0.1 sesiones
- Ropa especial: 40-80 ⭐ → 0.1-0.3 sesiones
- Objeto legendario: 100-120 ⭐ → ~0.4 sesiones

**Conclusión:** El niño puede obtener algo nuevo cada 1-2 sesiones de juego. Esto mantiene la motivación sin ser demasiado fácil.

### Anti-Frustración Económica

Reglas del sistema:
1. **Nunca quitar monedas** como penalización
2. **Si el niño no puede comprar algo**, Lumi dice: "¡Solo faltan X estrellas más!"
3. **Objetos starter gratuitos** para que la casa nunca se vea vacía
4. **Progreso diario mínimo garantizado**: solo por entrar = ⭐ 10

---

*Sistema de Recompensas de Villa Amparo — Versión 1.0 | Mayo 2026*
