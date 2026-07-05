# Villa Amparo — Sistema de Misiones Educativas

## 1. Base pedagógica (español)

El español es una lengua transparente (se lee como se escribe), por lo que el
camino estándar es el **método fonético-silábico**: vocales → consonantes de alta
frecuencia → sílabas directas → palabras → frases. La progresión de contenido
sigue ese orden:

### Niveles de contenido

| Nivel | Contenido | Ejemplos |
|---|---|---|
| **1** | Vocales (mayúscula y minúscula) + conciencia fonológica | A E I O U — "¿cuál suena /a/?" |
| **2** | Consonantes m, p, s, l + sílabas directas | ma me mi mo mu, pa pe pi... |
| **3** | Palabras de 2 sílabas directas + consonantes t, n, d, r suave | mamá, mesa, sopa, pato, luna |
| **4** | Consonantes restantes, sílabas inversas (es, al) y palabras de 3 sílabas | pelota, camisa, ratón |
| **5** | Sílabas trabadas (pla, tre, bri) + frases cortas | "La luna es blanca." |

Cada palabra del banco de contenido está etiquetada con su nivel, sus sílabas y
su imagen (emoji), lo que permite que **todos los minijuegos compartan el mismo
banco** y la dificultad se controle filtrando por nivel.

## 2. Catálogo de minijuegos

### Lectura

| # | Minijuego | NPC | Mecánica | Habilidad |
|---|---|---|---|---|
| 1 | **Caza Letras** | Doña Búho | La voz dice "¡Atrapa la M!" y flotan 4–6 globos con letras; tocar el correcto lo revienta 🎈 | Reconocer letras |
| 2 | **Fábrica de Sílabas** | Rana Rita | Arrastrar una consonante junto a una vocal; al unirse, la sílaba se pronuncia sola ("¡MA!"). Luego: "fabrica la sílaba PA" | Formar sílabas |
| 3 | **Parejas del Mercado** | Don Tomate | 3 imágenes y 1 palabra grande (o al revés): tocar la pareja correcta arregla el cartel del puesto | Palabra ↔ imagen |
| 4 | **Palabra Incompleta** | Don Tomate | GA_O con imagen de gato; elegir la letra/sílaba que falta entre 3 opciones grandes | Completar palabras |
| 5 | **Leo con Luna** | Luna la Gata | Frase corta en pantalla, la niña la "lee" y toca la imagen que corresponde entre 3 escenas | Leer frases |

### Escritura

| # | Minijuego | NPC | Mecánica | Habilidad |
|---|---|---|---|---|
| 6 | **Copia la Carta** | Cartero Coco | Palabra modelo arriba; abajo un teclado grande solo con las letras necesarias (+2 distractores). Fase 4: trazar letras con el dedo | Copiar palabras |
| 7 | **Letras Revueltas** | Cartero Coco | Las letras de una palabra caen desordenadas; arrastrarlas a sus casillas (la imagen es la pista) | Ordenar letras |
| 8 | **Respóndeme** | Cartero Coco | Pregunta hablada + imagen ("¿Qué animal es? 🐱") y se escribe la respuesta con el teclado grande | Escribir respuesta |

### Anatomía de una misión

Toda misión sigue la misma estructura (implementada una sola vez en
`missions/engine/`):

1. **Intro del NPC** (voz + animación, ~5 seg, saltable tocando).
2. **5 rondas** del minijuego (una ronda = una pregunta/reto).
3. **Feedback inmediato** por ronda:
   - Acierto → sonido alegre + estrella pequeña + frase de refuerzo (pool variado).
   - Error → sin sonido negativo; el NPC da una **pista escalonada**:
     1º error: repite la instrucción con la voz. 2º error: resalta/agranda la
     opción correcta parpadeando. 3º: la muestra y la celebra igual ("¡Era esta!
     ¡Ahora ya la conoces!").
4. **Cierre:** estrellas ganadas (1–3 según aciertos a la primera), monedas
   (fijas por misión), y registro de resultados.

**Nunca hay "game over".** Toda misión termina en celebración; lo que varía es
cuántas estrellas.

## 3. Dificultad adaptativa

Reglas simples y transparentes (en `missions/engine/adaptive.ts`):

- **Sube de nivel** un tipo de habilidad cuando logra ≥ 80% de aciertos a la
  primera en las últimas 3 misiones de ese tipo.
- **Baja (silenciosamente)** si hay < 40% en las últimas 2 misiones — sin
  anunciarlo jamás.
- **Repaso espaciado:** las palabras falladas entran a una cola de repaso y
  reaparecen en las siguientes misiones hasta lograr 2 aciertos seguidos;
  luego reaparecen 1 vez más a los 3 días.
- El nivel es **por habilidad, no global**: puede estar en nivel 3 de lectura
  de palabras y nivel 2 de escritura.
- El modo mamá puede fijar el nivel manualmente (anula lo adaptativo).

## 4. Dosificación de misiones

- Cada NPC ofrece **1 misión nueva cada vez** que se le habla; el tablón de la
  plaza muestra ❗ sobre 2–3 NPCs a la vez (mezcla de habilidades).
- El motor prioriza: 1º palabras en cola de repaso, 2º contenido nuevo del
  nivel actual, 3º repaso general.
- Las misiones de escritura se desbloquean cuando lectura alcanza nivel 2
  (no tiene sentido escribir letras que no reconoce).

## 5. Voz en las misiones

- La instrucción se lee **siempre** en voz alta al empezar cada ronda.
- Botón 🔊 gigante permanente en la esquina: repite la instrucción.
- Tocar cualquier letra/sílaba/palabra del juego la **pronuncia** — explorar
  con el dedo es aprender.
- Refuerzos con nombre: "¡Eso, Amparo!" (el nombre se configura en modo mamá).
