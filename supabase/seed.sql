-- ============================================================
-- VILLA AMPARO — Datos Semilla
-- ============================================================

-- Zonas del mundo
INSERT INTO zones (id, name, name_es, unlock_level, world_x, world_z) VALUES
  ('villa_center',     'Villa Amparo',        'Villa Amparo',          1,   0.0,   0.0),
  ('letter_forest',    'Letter Forest',       'Bosque de Letras',      1, -30.0,  15.0),
  ('word_city',        'Word City',           'Ciudad de Palabras',    3,  30.0,  10.0),
  ('story_mountain',   'Story Mountain',      'Montaña de Cuentos',    5,   0.0, -40.0),
  ('math_island',      'Math Island',         'Isla Matemática',       5,  45.0, -10.0),
  ('underwater_world', 'Underwater World',    'Mundo Submarino',       8, -45.0, -20.0),
  ('educational_farm', 'Educational Farm',    'Granja Educativa',      7,  20.0,  35.0),
  ('creativity_park',  'Creativity Park',     'Parque de Creatividad', 7, -20.0,  35.0);

-- Letras del abecedario
INSERT INTO letter_definitions (letter, color, npc_name, phoneme, example_words, unlock_order, letter_type) VALUES
  ('A', '#FF6B6B', 'Ana',   'a', ARRAY['árbol', 'avión', 'araña'],       1, 'vowel'),
  ('E', '#4ECDC4', 'Ema',   'e', ARRAY['elefante', 'estrella', 'espejo'],2, 'vowel'),
  ('I', '#45B7D1', 'Ivo',   'i', ARRAY['igloo', 'insecto', 'isla'],      3, 'vowel'),
  ('O', '#96CEB4', 'Ola',   'o', ARRAY['oso', 'oveja', 'ojo'],           4, 'vowel'),
  ('U', '#FFEAA7', 'Ugo',   'u', ARRAY['uva', 'unicornio', 'urraca'],    5, 'vowel'),
  ('M', '#DDA0DD', 'Memo',  'm', ARRAY['mamá', 'manzana', 'mariposa'],   6, 'consonant'),
  ('P', '#F0E68C', 'Pipo',  'p', ARRAY['papá', 'perro', 'pelota'],       7, 'consonant'),
  ('L', '#98FB98', 'Lola',  'l', ARRAY['luna', 'libro', 'limón'],        8, 'consonant'),
  ('S', '#87CEEB', 'Sisi',  's', ARRAY['sol', 'silla', 'sandía'],        9, 'consonant'),
  ('T', '#FFA07A', 'Toto',  't', ARRAY['tren', 'tortuga', 'taza'],      10, 'consonant'),
  ('N', '#FFB6C1', 'Nino',  'n', ARRAY['nube', 'naranja', 'nido'],      11, 'consonant'),
  ('D', '#B0C4DE', 'Dino',  'd', ARRAY['dedo', 'dado', 'dulce'],        12, 'consonant'),
  ('R', '#DEB887', 'Roro',  'r', ARRAY['rosa', 'rana', 'ratón'],        13, 'consonant'),
  ('C', '#E6E6FA', 'Coco',  'k', ARRAY['casa', 'cama', 'carro'],        14, 'consonant'),
  ('B', '#F5DEB3', 'Beto',  'b', ARRAY['boca', 'barco', 'bebé'],        15, 'consonant'),
  ('F', '#FAEBD7', 'Fifi',  'f', ARRAY['foca', 'flor', 'fresa'],        16, 'consonant'),
  ('G', '#E0FFFF', 'Gogo',  'g', ARRAY['gato', 'globo', 'gorila'],      17, 'consonant'),
  ('V', '#FFF0F5', 'Vivi',  'b', ARRAY['vaca', 'vela', 'violin'],       18, 'consonant'),
  ('J', '#F0FFF0', 'Jujo',  'x', ARRAY['jabón', 'jirafa', 'jugo'],      19, 'consonant'),
  ('Ñ', '#FFF5EE', 'Ñoño', 'ɲ', ARRAY['niño', 'ñame', 'año'],          20, 'consonant'),
  ('H', '#F0F8FF', 'Hugo',  '',  ARRAY['hoja', 'huevo', 'hada'],        21, 'consonant'),
  ('Z', '#FFFAF0', 'Zaza',  's', ARRAY['zapato', 'zorro', 'zumo'],      22, 'consonant'),
  ('Y', '#F5FFFA', 'Yoyo',  'j', ARRAY['yoyo', 'yema', 'yerba'],       23, 'consonant'),
  ('K', '#FFF8DC', 'Kiko',  'k', ARRAY['kilo', 'koala', 'kayak'],       24, 'consonant'),
  ('W', '#FFFDE7', 'Wawa',  'w', ARRAY['wifi', 'waffle', 'wok'],        25, 'consonant'),
  ('X', '#F3E5F5', 'Xixi',  'ks',ARRAY['xilófono', 'taxi', 'examen'],  26, 'consonant'),
  ('Q', '#E8F5E9', 'Quito', 'k', ARRAY['queso', 'quince', 'quetzal'],   27, 'consonant');

-- Objetos de inicio (gratis, is_starter = true)
INSERT INTO catalog_items (item_type, category, name, name_es, cost_coins, is_starter, unlock_level, rarity) VALUES
  ('furniture', 'beds',    'starter_bed',    'Cama Básica',     0, true,  1, 'common'),
  ('furniture', 'chairs',  'starter_chair',  'Silla Básica',    0, true,  1, 'common'),
  ('furniture', 'tables',  'starter_table',  'Mesa Básica',     0, true,  1, 'common'),
  ('decoration','plants',  'starter_plant',  'Planta Básica',   0, true,  1, 'common'),
  ('pet',       'cats',    'orange_cat',     'Gatito Naranjo',  0, true,  1, 'common'),
  ('pet',       'dogs',    'spotted_dog',    'Perrito Manchas', 0, true,  1, 'common'),
  ('pet',       'rabbits', 'blue_rabbit',    'Conejito Nube',   0, true,  1, 'common'),
  ('pet',       'chicks',  'yellow_chick',   'Pollito Pipín',   0, true,  1, 'common');

-- Muebles desbloqueables
INSERT INTO catalog_items (item_type, category, name, name_es, cost_coins, unlock_level, rarity) VALUES
  ('furniture', 'beds',    'cloud_bed',      'Cama Nube',        30, 2, 'uncommon'),
  ('furniture', 'beds',    'castle_bed',     'Cama Castillo',    60, 4, 'rare'),
  ('furniture', 'beds',    'rocket_bed',     'Cama Cohete',      80, 6, 'rare'),
  ('furniture', 'beds',    'rainbow_bed',    'Cama Arcoíris',   100, 7, 'legendary'),
  ('furniture', 'chairs',  'balloon_chair',  'Silla Globo',      20, 2, 'uncommon'),
  ('furniture', 'chairs',  'color_throne',   'Trono de Colores', 50, 5, 'rare'),
  ('furniture', 'tables',  'crystal_table',  'Mesa de Cristal',  35, 3, 'uncommon'),
  ('furniture', 'tables',  'magic_table',    'Mesa Flotante',    55, 6, 'rare'),
  ('decoration','walls',   'alphabet_poster','Póster Abecedario',20, 1, 'common'),
  ('decoration','ceiling', 'stars_ceiling',  'Estrellas de Techo',25,2, 'common'),
  ('decoration','special', 'letter_tree',    'Árbol de Letras',  80, 5, 'legendary'),
  ('decoration','special', 'number_fountain','Fuente de Números', 75, 5, 'legendary');

-- Mascotas desbloqueables
INSERT INTO catalog_items (item_type, category, name, name_es, cost_coins, unlock_level, rarity) VALUES
  ('pet', 'ponies',    'star_pony',     'Poni Estrellita',  50, 5, 'rare'),
  ('pet', 'fish',      'bubble_fish',   'Pez Burbujas',     40, 4, 'uncommon'),
  ('pet', 'dragons',   'spark_dragon',  'Dragón Chispa',    80, 8, 'legendary'),
  ('pet', 'bears',     'snow_bear',     'Oso Nívea',        70, 7, 'rare'),
  ('pet', 'unicorns',  'rainbow_uni',   'Unicornio Arco',  100,10, 'legendary');

-- Logros iniciales
INSERT INTO achievements (code, title, title_es, description, narrator_script, reward_coins, category, unlock_criteria) VALUES
  ('first_letter',     'First Letter!',          '¡Primera Letra!',
   'Learn your first letter',
   '¡Aprendiste tu primera letra! ¡Eso es increíble!', 25, 'reading',
   '{"type": "letters_learned", "count": 1}'),

  ('all_vowels',       'Vowel Master!',          '¡Maestro de Vocales!',
   'Master all 5 vowels',
   '¡Aprendiste todas las vocales! ¡A, E, I, O, U! ¡Eres fantástico!', 75, 'reading',
   '{"type": "vowels_mastered", "count": 5}'),

  ('ten_letters',      '10 Letters!',            '¡10 Letras Aprendidas!',
   'Learn 10 letters',
   '¡Ya sabes 10 letras! ¡Eres todo un experto en el abecedario!', 100, 'reading',
   '{"type": "letters_learned", "count": 10}'),

  ('full_alphabet',    'Full Alphabet!',         '¡El Abecedario Completo!',
   'Learn all letters',
   '¡INCREÍBLE! ¡Aprendiste todo el abecedario! ¡Eres un héroe de las letras!', 500, 'reading',
   '{"type": "letters_learned", "count": 27}'),

  ('first_word',       'First Word!',            '¡Primera Palabra!',
   'Build your first complete word',
   '¡Construiste tu primera palabra! ¡El lenguaje es tuyo!', 30, 'reading',
   '{"type": "words_built", "count": 1}'),

  ('first_addition',   'First Sum!',             '¡Primera Suma!',
   'Complete your first addition',
   '¡Hiciste tu primera suma! ¡Los números no tienen secretos para ti!', 25, 'math',
   '{"type": "additions_completed", "count": 1}'),

  ('count_to_10',      'Count to 10!',           '¡Cuento hasta 10!',
   'Count correctly to 10',
   '¡Uno, dos, tres... diez! ¡Cuentas hasta 10 perfectamente!', 40, 'math',
   '{"type": "counting_mastery", "max": 10}'),

  ('first_zone',       'Explorer!',              '¡Explorador!',
   'Visit your first new zone',
   '¡Exploraste una zona nueva! ¡El mundo es tuyo para descubrir!', 20, 'exploration',
   '{"type": "zones_visited", "count": 2}'),

  ('all_zones',        'Grand Explorer!',        '¡Gran Explorador!',
   'Visit all zones',
   '¡Visitaste todas las zonas de Villa Amparo! ¡Eres el mayor explorador del mundo!', 200, 'exploration',
   '{"type": "zones_visited", "count": 8}'),

  ('first_furniture',  'First Furniture!',       '¡Mi Primer Mueble!',
   'Place your first furniture',
   '¡Colocaste tu primer mueble! ¡Tu casa está tomando forma!', 20, 'building',
   '{"type": "furniture_placed", "count": 1}'),

  ('full_room',        'Decorated Room!',        '¡Habitación Decorada!',
   'Fully decorate a room',
   '¡Tu habitación está bellísima! ¡Tienes un talento para decorar!', 60, 'building',
   '{"type": "room_completed", "count": 1}'),

  ('streak_3',         '3-Day Streak!',          '¡3 Días Seguidos!',
   'Play 3 days in a row',
   '¡Tres días seguidos! ¡Villa Amparo está feliz de verte cada día!', 40, 'streak',
   '{"type": "streak_days", "days": 3}'),

  ('streak_7',         '7-Day Streak!',          '¡Una Semana Completa!',
   'Play 7 days in a row',
   '¡SIETE días seguidos! ¡Eres el héroe más constante de Villa Amparo!', 100, 'streak',
   '{"type": "streak_days", "days": 7}'),

  ('streak_30',        '30-Day Hero!',           '¡Héroe del Mes!',
   'Play 30 days in a row',
   '¡TREINTA días seguidos! ¡Eres una leyenda de Villa Amparo! ¡Increíble!', 500, 'streak',
   '{"type": "streak_days", "days": 30}');

-- Recompensas diarias (racha de 7 días)
INSERT INTO daily_rewards (day_number, reward_coins) VALUES
  (1, 20), (2, 25), (3, 30), (4, 35), (5, 40), (6, 50), (7, 100);
