# Villa Amparo — Gameplay y Primer Mapa

## 1. Fantasía del juego

Amparo (la jugadora, o su avatar) llega a un pueblito mágico donde **las palabras
se escaparon de los libros** y andan sueltas por todas partes. Los habitantes del
pueblo necesitan su ayuda para atraparlas, ordenarlas y devolverlas a su lugar.
Cada vecino tiene un problema distinto — y cada problema es una misión de lectura
o escritura.

No hay enemigos, no se puede perder, no hay tiempo límite. Equivocarse solo
produce una pista y otra oportunidad.

## 2. Loop de juego principal

```
Explorar el pueblo → encontrar NPC con ❗ → escuchar la misión →
jugar el minijuego (2-4 minutos) → recibir estrellas y monedas →
gastar monedas en la tienda (stickers, ropa, mascotas) → explorar de nuevo
```

**Sesión objetivo:** 10–15 minutos = 2 o 3 misiones. El juego celebra y sugiere
descansar después de ~20 minutos ("¡Uf, cuánto trabajamos! Las palabras van a
dormir una siesta 😴").

## 3. Los personajes (NPCs)

| Personaje | Lugar | Personalidad | Tipo de misión que entrega |
|---|---|---|---|
| **Doña Búho Beatriz** | Casa de las Letras | Maestra sabia, habla lento | Reconocer letras |
| **Rana Rita** | Río de las Sílabas | Rápida, chistosa, canta | Formar sílabas |
| **Don Tomate** | Mercado de Palabras | Gruñón adorable, se le confunden los carteles | Unir palabra con imagen / completar palabras |
| **Cartero Coco** (tucán) | Torre del Correo | Distraído, pierde las cartas | Copiar palabras / ordenar letras / escribir respuestas |
| **Luna la Gata** | Parque Estrella | Dormilona, misteriosa | Leer frases cortas |
| **Chispa** (perrito) | Sigue al avatar | Mascota inicial, celebra los aciertos | Ninguna — es puro refuerzo emocional |

Cada NPC tiene: color propio, voz propia (pitch/rate distintos), un saludo con el
nombre de la niña ("¡Hola, Amparo!"), y 3–4 frases de celebración propias.

## 4. Primer mapa de Villa Amparo

Mapa pequeño y legible: una plaza central con 5 zonas alrededor, todo visible a
menos de 15 segundos caminando. Sin posibilidad de perderse.

```
                    🌈
        ┌─────────────────────────────┐
        │      TORRE DEL CORREO       │
        │       (Cartero Coco)        │
        │      misiones escritura     │
        └──────────────┬──────────────┘
                       │
 ┌──────────────┐   ┌──┴───────┐   ┌──────────────────┐
 │   CASA DE    │   │          │   │    MERCADO DE    │
 │  LAS LETRAS  ├───┤  PLAZA   ├───┤     PALABRAS     │
 │ (Doña Búho)  │   │ CENTRAL  │   │   (Don Tomate)   │
 │    letras    │   │ (spawn ⭐)│   │ palabra ↔ imagen │
 └──────────────┘   └──┬────┬──┘   └──────────────────┘
                       │    │
        ┌──────────────┴┐  ┌┴──────────────────┐
        │ RÍO DE LAS    │  │  PARQUE ESTRELLA  │
        │ SÍLABAS       │  │   (Luna la Gata)  │
        │ (Rana Rita)   │  │  frases + tienda  │
        │ puente-juego  │  │  + casa de Amparo │
        └───────────────┘  └───────────────────┘
```

### Detalle de zonas

1. **Plaza Central** — punto de aparición. Fuente de colores, banca, y un
   **tablón de misiones** con íconos grandes que muestra qué NPCs tienen misión
   disponible (❗). Chispa el perrito espera aquí la primera vez.
2. **Casa de las Letras** — biblioteca chiquita con letras gigantes flotando
   alrededor del techo. Dentro/afuera está Doña Búho.
3. **Mercado de Palabras** — puestos de frutas y objetos con carteles. Los
   carteles a veces están mal y hay que arreglarlos (esa es la misión).
4. **Río de las Sílabas** — un riachuelo con un puente de tablones; cada tablón
   es una sílaba. La Rana Rita salta entre piedras.
5. **Torre del Correo** — torre con buzón gigante. Cartas voladoras dando
   vueltas (las que perdió Coco).
6. **Parque Estrella** — árboles, columpio, la **tienda de premios** (kiosco),
   y la **casita de Amparo** (donde se cambia la ropa del avatar y viven las
   mascotas desbloqueadas).

### Progresión del mapa (futuro)

El mapa crece por fases: en Fase 2+ se desbloquean el **Bosque de los Cuentos**
(comprensión lectora) y la **Montaña de los Números** (matemáticas, alineado con
la visión del README). El diseño de zonas satélite alrededor de la plaza permite
agregar zonas sin rediseñar nada.

## 5. Experiencia y tono

- **Paleta:** colores saturados y alegres (estilo Toca Boca / Kenney): cielo
  celeste, pasto verde lima, casas de colores pastel intensos.
- **Humor:** los NPCs se equivocan, estornudan letras, se les caen las palabras.
  El error es normal y gracioso en Villa Amparo — eso baja la ansiedad de
  equivocarse en las misiones.
- **Cero texto largo:** ningún mensaje de más de 4–5 palabras en pantalla, y
  siempre con voz. Los menús usan íconos (🎒 mochila, ⭐ estrellas, 🏪 tienda).
- **Celebración física:** al completar misión, llueve confeti en el mundo 3D,
  Chispa da vueltas, suena fanfarria, y las estrellas vuelan al contador.
