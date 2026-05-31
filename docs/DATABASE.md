# BASE DE DATOS — VILLA AMPARO
## Esquema Completo de Supabase / PostgreSQL
## Versión 1.0 | Mayo 2026

---

## ÍNDICE

1. [Diagrama ERD](#1-diagrama-erd)
2. [Tablas del Sistema](#2-tablas-del-sistema)
3. [Tablas de Jugador](#3-tablas-de-jugador)
4. [Tablas Educativas](#4-tablas-educativas)
5. [Tablas del Mundo](#5-tablas-del-mundo)
6. [Tablas de Recompensas](#6-tablas-de-recompensas)
7. [Tablas de Padres](#7-tablas-de-padres)
8. [Políticas RLS](#8-políticas-rls)
9. [Funciones y Triggers](#9-funciones-y-triggers)
10. [Índices](#10-índices)
11. [Script SQL Completo](#11-script-sql-completo)

---

## 1. DIAGRAMA ERD

```
auth.users (Supabase Auth)
    │ 1
    │ *
parent_profiles ──────────────────────┐
    │ 1                               │
    │ *                               │
players ──────┬──────────────────┐    │
    │          │                  │    │
    │ *        │ *                │ *  │
    ▼          ▼                  ▼    │
player_     player_           inventory│
progress   sessions            items  │
    │                               │ │
    │ *                             │ │
    ▼                               │ │
activity_                    catalog_│
logs                          items  │
                                    │
                            ┌───────┘
                            │
                     missions ◄──── mission_
                        │           completions
                        │ *
                     mission_
                     steps
```

---

## 2. TABLAS DEL SISTEMA

### `catalog_items` — Catálogo de Objetos del Juego

```sql
CREATE TABLE catalog_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_type     TEXT NOT NULL CHECK (item_type IN (
                  'furniture', 'clothing', 'hat', 'shoe',
                  'backpack', 'pet', 'decoration', 'vehicle'
                )),
  category      TEXT NOT NULL,     -- 'beds', 'chairs', 'shirts', etc.
  name          TEXT NOT NULL,     -- Nombre del objeto
  name_es       TEXT NOT NULL,     -- Nombre en español (para narración)
  description   TEXT,
  cost_coins    INTEGER NOT NULL DEFAULT 0,
  is_starter    BOOLEAN DEFAULT false,   -- ¿Disponible al inicio?
  unlock_level  INTEGER DEFAULT 1,       -- Nivel requerido para comprar
  zone_exclusive TEXT,                   -- Solo disponible en cierta zona
  image_url     TEXT,                    -- Imagen del objeto en el catálogo
  model_url     TEXT,                    -- Modelo 3D del objeto
  rarity        TEXT DEFAULT 'common' CHECK (rarity IN (
                  'common', 'uncommon', 'rare', 'legendary'
                )),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Ejemplo de datos:
INSERT INTO catalog_items (item_type, category, name, name_es, cost_coins, is_starter) VALUES
  ('furniture', 'beds', 'cloud_bed', 'Cama Nube', 30, false),
  ('furniture', 'beds', 'starter_bed', 'Cama Básica', 0, true),
  ('pet', 'cats', 'orange_cat', 'Gatito Naranja', 0, true),
  ('clothing', 'tops', 'explorer_cape', 'Capa de Explorador', 40, false);
```

### `zones` — Zonas del Mundo

```sql
CREATE TABLE zones (
  id            TEXT PRIMARY KEY, -- 'villa_center', 'letter_forest', etc.
  name          TEXT NOT NULL,
  name_es       TEXT NOT NULL,
  description   TEXT,
  unlock_level  INTEGER DEFAULT 1,
  bgm_url       TEXT,
  thumbnail_url TEXT,
  world_x       FLOAT,            -- Posición en el mapa
  world_z       FLOAT,
  is_available  BOOLEAN DEFAULT true
);

INSERT INTO zones (id, name, name_es, unlock_level) VALUES
  ('villa_center',    'Villa Amparo',       'Villa Amparo',         1),
  ('letter_forest',   'Letter Forest',      'Bosque de Letras',     1),
  ('word_city',       'Word City',          'Ciudad de Palabras',   3),
  ('story_mountain',  'Story Mountain',     'Montaña de Cuentos',   5),
  ('math_island',     'Math Island',        'Isla Matemática',      5),
  ('underwater_world','Underwater World',   'Mundo Submarino',      8),
  ('educational_farm','Educational Farm',   'Granja Educativa',     7),
  ('creativity_park', 'Creativity Park',    'Parque de Creatividad',7);
```

### `missions` — Definición de Misiones

```sql
CREATE TABLE missions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_type    TEXT NOT NULL CHECK (mission_type IN (
                    'main', 'secondary', 'daily', 'discovery'
                  )),
  title           TEXT NOT NULL,
  title_es        TEXT NOT NULL,
  description     TEXT,
  narrator_script TEXT NOT NULL,    -- Script completo para Lumi
  zone_id         TEXT REFERENCES zones(id),
  required_level  INTEGER DEFAULT 1,
  required_missions UUID[],         -- Misiones que deben completarse antes
  reward_coins    INTEGER DEFAULT 25,
  reward_items    UUID[],           -- IDs de catalog_items
  reward_npc_id   TEXT,             -- NPC que se desbloquea
  education_type  TEXT CHECK (education_type IN (
                    'letter', 'phonics', 'word', 'reading',
                    'math', 'logic', 'creativity', 'general'
                  )),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### `mission_steps` — Pasos de Cada Misión

```sql
CREATE TABLE mission_steps (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id      UUID REFERENCES missions(id) ON DELETE CASCADE,
  step_order      INTEGER NOT NULL,
  step_type       TEXT NOT NULL CHECK (step_type IN (
                    'explore', 'collect', 'talk', 'minigame',
                    'build', 'deliver'
                  )),
  description     TEXT,
  narrator_script TEXT NOT NULL,
  target_object   TEXT,             -- ID del objeto a encontrar/interactuar
  target_quantity INTEGER DEFAULT 1,
  minigame_id     TEXT              -- Si step_type = 'minigame'
);
```

---

## 3. TABLAS DE JUGADOR

### `players` — Perfiles de Jugadores (Niños)

```sql
CREATE TABLE players (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_user_id  UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  player_name     TEXT NOT NULL CHECK (length(player_name) <= 20),
  avatar_config   JSONB NOT NULL DEFAULT '{}',
  -- Ejemplo de avatar_config:
  -- {
  --   "skinTone": "medium",
  --   "hairStyle": "curly_long",
  --   "hairColor": "black",
  --   "eyeShape": "round",
  --   "eyeColor": "brown",
  --   "accessories": ["glasses_round"],
  --   "hat": "explorer_hat",
  --   "outfit_top": "explorer_cape",
  --   "outfit_bottom": "blue_shorts",
  --   "shoes": "adventure_boots",
  --   "backpack": "dino_backpack",
  --   "starter_pet": "orange_cat"
  -- }
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  last_active     TIMESTAMPTZ DEFAULT NOW(),
  is_active       BOOLEAN DEFAULT true
);

CREATE INDEX idx_players_parent ON players(parent_user_id);
```

### `player_progress` — Progreso General del Jugador

```sql
CREATE TABLE player_progress (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id       UUID REFERENCES players(id) ON DELETE CASCADE UNIQUE,
  level           INTEGER NOT NULL DEFAULT 1,
  experience      INTEGER NOT NULL DEFAULT 0,
  coins           INTEGER NOT NULL DEFAULT 100,  -- Monedas de Villa
  
  -- Progreso educativo
  reading_level   INTEGER NOT NULL DEFAULT 1 CHECK (reading_level BETWEEN 1 AND 10),
  writing_level   INTEGER NOT NULL DEFAULT 1 CHECK (writing_level BETWEEN 1 AND 10),
  math_level      INTEGER NOT NULL DEFAULT 1 CHECK (math_level BETWEEN 1 AND 10),
  
  -- Letras aprendidas (A-Z con nivel de dominio)
  letters_mastery JSONB NOT NULL DEFAULT '{}',
  -- Ejemplo: {"A": 0.95, "B": 0.70, "C": 0.30, "M": 1.0}
  -- 0 = no visto, 0-0.5 = en progreso, 0.5-0.8 = aprendiendo, 0.8-1.0 = dominado
  
  -- Palabras aprendidas
  words_learned   TEXT[] DEFAULT '{}',
  
  -- Números dominados
  numbers_mastery JSONB NOT NULL DEFAULT '{}',
  -- Ejemplo: {"1": 1.0, "2": 1.0, "3": 0.8, "10": 0.3}
  
  -- Zonas desbloqueadas
  unlocked_zones  TEXT[] DEFAULT ARRAY['villa_center', 'letter_forest'],
  
  -- Perfil adaptativo (generado por IA)
  adaptive_profile JSONB DEFAULT '{}',
  -- Ejemplo: {
  --   "preferredActivities": ["letter_catching", "farming"],
  --   "weakLetters": ["R", "S"],
  --   "strongLetters": ["M", "A", "P"],
  --   "mathRange": "1-5",
  --   "sessionDuration": 15,
  --   "bestTimeOfDay": "afternoon"
  -- }
  
  -- Racha de días
  streak_days     INTEGER DEFAULT 0,
  last_play_date  DATE,
  
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_player_progress_player ON player_progress(player_id);
```

### `player_sessions` — Historial de Sesiones de Juego

```sql
CREATE TABLE player_sessions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id       UUID REFERENCES players(id) ON DELETE CASCADE,
  started_at      TIMESTAMPTZ DEFAULT NOW(),
  ended_at        TIMESTAMPTZ,
  duration_seconds INTEGER,            -- Calculado al cerrar sesión
  zones_visited   TEXT[] DEFAULT '{}',
  coins_earned    INTEGER DEFAULT 0,
  xp_earned       INTEGER DEFAULT 0,
  activities_count INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  incorrect_answers INTEGER DEFAULT 0
);

CREATE INDEX idx_sessions_player ON player_sessions(player_id);
CREATE INDEX idx_sessions_date ON player_sessions(started_at);
```

---

## 4. TABLAS EDUCATIVAS

### `activity_logs` — Registro Detallado de Actividades

```sql
CREATE TABLE activity_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id       UUID REFERENCES players(id) ON DELETE CASCADE,
  session_id      UUID REFERENCES player_sessions(id),
  
  -- Tipo de actividad
  activity_type   TEXT NOT NULL CHECK (activity_type IN (
                    'letter_recognition', 'letter_phonics',
                    'syllable_building', 'word_building',
                    'word_association', 'comprehension',
                    'counting', 'addition', 'subtraction',
                    'pattern_recognition', 'logic_puzzle'
                  )),
  
  -- Contenido de la actividad
  topic           TEXT NOT NULL,       -- Ej: 'letter_M', 'word_CASA', 'sum_3+2'
  difficulty      INTEGER DEFAULT 1,   -- 1-5
  
  -- Resultado
  is_correct      BOOLEAN NOT NULL,
  attempts        INTEGER DEFAULT 1,   -- Cuántos intentos necesitó
  time_spent_ms   INTEGER,             -- Tiempo en responder (ms)
  
  -- Contexto
  zone_id         TEXT,
  minigame_id     TEXT,
  
  recorded_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activity_player ON activity_logs(player_id);
CREATE INDEX idx_activity_type ON activity_logs(activity_type);
CREATE INDEX idx_activity_date ON activity_logs(recorded_at);
CREATE INDEX idx_activity_topic ON activity_logs(topic);
```

### `letter_progress` — Progreso Detallado por Letra

```sql
CREATE TABLE letter_progress (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id       UUID REFERENCES players(id) ON DELETE CASCADE,
  letter          CHAR(1) NOT NULL,
  
  -- Métricas de reconocimiento
  times_seen      INTEGER DEFAULT 0,
  times_correct   INTEGER DEFAULT 0,
  times_incorrect INTEGER DEFAULT 0,
  avg_response_ms INTEGER,            -- Tiempo promedio de respuesta
  
  -- Métricas de fonética
  phonics_attempts  INTEGER DEFAULT 0,
  phonics_correct   INTEGER DEFAULT 0,
  
  -- Métricas de escritura
  writing_attempts  INTEGER DEFAULT 0,
  writing_correct   INTEGER DEFAULT 0,
  
  -- Nivel de dominio calculado (0.0 - 1.0)
  mastery_score   FLOAT DEFAULT 0.0,
  
  -- Confusiones frecuentes (letras confundidas con esta)
  confused_with   TEXT[] DEFAULT '{}',
  
  first_seen_at   TIMESTAMPTZ DEFAULT NOW(),
  last_practiced  TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(player_id, letter)
);

CREATE INDEX idx_letter_progress_player ON letter_progress(player_id);
```

### `word_progress` — Progreso Detallado por Palabra

```sql
CREATE TABLE word_progress (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id       UUID REFERENCES players(id) ON DELETE CASCADE,
  word            TEXT NOT NULL,
  
  times_encountered INTEGER DEFAULT 0,
  times_correct     INTEGER DEFAULT 0,
  is_mastered       BOOLEAN DEFAULT false,
  
  first_seen_at   TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at    TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(player_id, word)
);
```

---

## 5. TABLAS DEL MUNDO

### `player_home` — Casa del Jugador

```sql
CREATE TABLE player_home (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id       UUID REFERENCES players(id) ON DELETE CASCADE UNIQUE,
  
  -- Configuración de habitaciones (JSONB flexible)
  rooms           JSONB NOT NULL DEFAULT '{
    "main_room": {"floor_color": "#F5DEB3", "wall_color": "#FFFFFF", "items": []},
    "living_room": {"floor_color": "#D2B48C", "wall_color": "#F5F5DC", "items": []},
    "kitchen": {"floor_color": "#FFDEAD", "wall_color": "#FFFACD", "items": []},
    "garden": {"items": []}
  }',
  -- Estructura de cada item en rooms:
  -- { "item_id": "uuid", "x": 3, "z": 2, "rotation": 0, "color_variant": "blue" }
  
  unlocked_rooms  TEXT[] DEFAULT ARRAY['main_room', 'living_room', 'kitchen', 'garden'],
  
  -- Nivel de mejora de la casa (afecta apariencia externa)
  house_level     INTEGER DEFAULT 1,
  
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### `mission_completions` — Misiones Completadas

```sql
CREATE TABLE mission_completions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id       UUID REFERENCES players(id) ON DELETE CASCADE,
  mission_id      UUID REFERENCES missions(id),
  
  completed_at    TIMESTAMPTZ DEFAULT NOW(),
  time_spent_seconds INTEGER,
  coins_received  INTEGER,
  
  UNIQUE(player_id, mission_id)
);

CREATE INDEX idx_mission_completions_player ON mission_completions(player_id);
```

### `npc_relationships` — Relación del Jugador con NPCs

```sql
CREATE TABLE npc_relationships (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id       UUID REFERENCES players(id) ON DELETE CASCADE,
  npc_id          TEXT NOT NULL,     -- ID del NPC (string)
  
  friendship_level INTEGER DEFAULT 0 CHECK (friendship_level BETWEEN 0 AND 100),
  is_unlocked     BOOLEAN DEFAULT false,
  is_moved_in     BOOLEAN DEFAULT false,  -- Si vive en Villa Amparo
  
  interactions_count INTEGER DEFAULT 0,
  last_interaction TIMESTAMPTZ,
  
  UNIQUE(player_id, npc_id)
);
```

---

## 6. TABLAS DE RECOMPENSAS

### `player_inventory` — Inventario del Jugador

```sql
CREATE TABLE player_inventory (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id       UUID REFERENCES players(id) ON DELETE CASCADE,
  item_id         UUID REFERENCES catalog_items(id),
  
  acquired_at     TIMESTAMPTZ DEFAULT NOW(),
  acquired_via    TEXT CHECK (acquired_via IN (
                    'purchase', 'mission_reward', 'achievement',
                    'starter', 'daily_reward', 'zone_unlock'
                  )),
  
  -- Para items equipables: si está equipado actualmente
  is_equipped     BOOLEAN DEFAULT false,
  
  -- Para items de decoración: cuántos tiene (stackable)
  quantity        INTEGER DEFAULT 1,
  
  UNIQUE(player_id, item_id)
);

CREATE INDEX idx_inventory_player ON player_inventory(player_id);
```

### `achievements` — Definición de Logros

```sql
CREATE TABLE achievements (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code            TEXT UNIQUE NOT NULL,    -- 'first_letter', 'streak_7', etc.
  title           TEXT NOT NULL,
  title_es        TEXT NOT NULL,
  description     TEXT,
  narrator_script TEXT,                    -- Qué dice Lumi al lograrlo
  
  badge_url       TEXT,                    -- Imagen del badge
  reward_coins    INTEGER DEFAULT 0,
  reward_item_id  UUID REFERENCES catalog_items(id),
  
  category        TEXT CHECK (category IN (
                    'reading', 'math', 'exploration',
                    'social', 'building', 'streak'
                  )),
  
  -- Criterio de desbloqueo (evaluado en trigger)
  unlock_criteria JSONB NOT NULL
  -- Ejemplo: { "type": "letters_learned", "count": 5 }
  -- Ejemplo: { "type": "streak_days", "days": 7 }
  -- Ejemplo: { "type": "missions_completed", "count": 10 }
);

INSERT INTO achievements (code, title_es, narrator_script, reward_coins, category) VALUES
  ('first_letter', '¡Primera Letra!',
   '¡Aprendiste tu primera letra! ¡Eso es increíble!', 25, 'reading'),
  ('all_vowels', '¡Maestro de Vocales!',
   '¡Aprendiste todas las vocales! ¡A, E, I, O, U!', 75, 'reading'),
  ('streak_7', '¡Racha de 7 días!',
   '¡Jugaste 7 días seguidos! ¡Eres constante!', 100, 'streak'),
  ('first_house', '¡Hogar Dulce Hogar!',
   '¡Decoraste tu primera habitación! ¡Quedó preciosa!', 50, 'building');
```

### `player_achievements` — Logros Desbloqueados por Jugador

```sql
CREATE TABLE player_achievements (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id       UUID REFERENCES players(id) ON DELETE CASCADE,
  achievement_id  UUID REFERENCES achievements(id),
  
  unlocked_at     TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(player_id, achievement_id)
);
```

### `daily_rewards` — Recompensas Diarias

```sql
CREATE TABLE daily_rewards (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_number      INTEGER NOT NULL,     -- Día 1, 2, 3... del streak
  reward_coins    INTEGER NOT NULL,
  reward_item_id  UUID REFERENCES catalog_items(id),
  special_message TEXT                  -- Mensaje especial si aplica
);

INSERT INTO daily_rewards (day_number, reward_coins) VALUES
  (1, 20), (2, 25), (3, 30), (4, 35), (5, 40), (6, 50), (7, 100);
```

### `coin_transactions` — Historial de Monedas

```sql
CREATE TABLE coin_transactions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id       UUID REFERENCES players(id) ON DELETE CASCADE,
  amount          INTEGER NOT NULL,     -- Positivo = ganadas, negativo = gastadas
  reason          TEXT NOT NULL,
  reference_id    UUID,                 -- ID de misión, actividad, etc.
  balance_after   INTEGER NOT NULL,
  
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_coins_player ON coin_transactions(player_id);
```

---

## 7. TABLAS DE PADRES

### `parent_profiles` — Perfil de Padres/Tutores

```sql
CREATE TABLE parent_profiles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name       TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN (
                    'free', 'premium', 'family'
                  )),
  max_children    INTEGER DEFAULT 1,    -- free=1, premium=2, family=5
  
  -- Configuraciones parentales
  settings        JSONB DEFAULT '{
    "session_time_limit": 60,
    "daily_time_limit": 120,
    "email_reports": true,
    "report_frequency": "weekly"
  }',
  
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### `parent_reports` — Reportes Generados para Padres

```sql
CREATE TABLE parent_reports (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id       UUID REFERENCES parent_profiles(id),
  player_id       UUID REFERENCES players(id),
  
  period_type     TEXT CHECK (period_type IN ('weekly', 'monthly')),
  period_start    DATE,
  period_end      DATE,
  
  -- Reporte generado por IA (formato HTML o JSON)
  report_content  JSONB,
  
  generated_at    TIMESTAMPTZ DEFAULT NOW(),
  sent_via_email  BOOLEAN DEFAULT false
);
```

---

## 8. POLÍTICAS RLS

```sql
-- Habilitar RLS en todas las tablas sensibles
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE letter_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE word_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_home ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE coin_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE npc_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_reports ENABLE ROW LEVEL SECURITY;

-- Política: padres solo ven sus hijos
CREATE POLICY "parent_owns_players"
ON players FOR ALL
USING (parent_user_id = auth.uid());

-- Política: progreso solo del propio hijo
CREATE POLICY "progress_owns_player"
ON player_progress FOR ALL
USING (
  player_id IN (
    SELECT id FROM players WHERE parent_user_id = auth.uid()
  )
);

-- Misma lógica para todas las tablas relacionadas con player_id
-- (activity_logs, letter_progress, word_progress, etc.)

-- Catálogo es público (lectura)
CREATE POLICY "catalog_public_read"
ON catalog_items FOR SELECT
USING (true);

-- Zonas son públicas (lectura)
CREATE POLICY "zones_public_read"
ON zones FOR SELECT
USING (true);

-- Misiones son públicas (lectura)
CREATE POLICY "missions_public_read"
ON missions FOR SELECT
USING (true);

-- Achievements son públicos (lectura)
CREATE POLICY "achievements_public_read"
ON achievements FOR SELECT
USING (true);
```

---

## 9. FUNCIONES Y TRIGGERS

### Trigger: Actualizar progreso al registrar actividad

```sql
CREATE OR REPLACE FUNCTION update_progress_on_activity()
RETURNS TRIGGER AS $$
DECLARE
  v_mastery FLOAT;
BEGIN
  -- Si es actividad de letra, actualizar letter_progress
  IF NEW.activity_type IN ('letter_recognition', 'letter_phonics') THEN
    -- Upsert en letter_progress
    INSERT INTO letter_progress (player_id, letter, times_seen, times_correct, times_incorrect)
    VALUES (
      NEW.player_id,
      UPPER(REPLACE(NEW.topic, 'letter_', '')),
      1,
      CASE WHEN NEW.is_correct THEN 1 ELSE 0 END,
      CASE WHEN NOT NEW.is_correct THEN 1 ELSE 0 END
    )
    ON CONFLICT (player_id, letter) DO UPDATE SET
      times_seen = letter_progress.times_seen + 1,
      times_correct = letter_progress.times_correct + CASE WHEN NEW.is_correct THEN 1 ELSE 0 END,
      times_incorrect = letter_progress.times_incorrect + CASE WHEN NOT NEW.is_correct THEN 1 ELSE 0 END,
      last_practiced = NOW();

    -- Calcular nuevo mastery score
    SELECT
      CASE
        WHEN (times_correct + times_incorrect) = 0 THEN 0
        ELSE times_correct::FLOAT / (times_correct + times_incorrect)
      END
    INTO v_mastery
    FROM letter_progress
    WHERE player_id = NEW.player_id
      AND letter = UPPER(REPLACE(NEW.topic, 'letter_', ''));

    -- Actualizar mastery_score
    UPDATE letter_progress
    SET mastery_score = v_mastery
    WHERE player_id = NEW.player_id
      AND letter = UPPER(REPLACE(NEW.topic, 'letter_', ''));

    -- Actualizar letters_mastery en player_progress (JSONB)
    UPDATE player_progress
    SET letters_mastery = jsonb_set(
      letters_mastery,
      ARRAY[UPPER(REPLACE(NEW.topic, 'letter_', ''))],
      to_jsonb(v_mastery)
    )
    WHERE player_id = NEW.player_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_progress
AFTER INSERT ON activity_logs
FOR EACH ROW
EXECUTE FUNCTION update_progress_on_activity();
```

### Trigger: Actualizar racha de días

```sql
CREATE OR REPLACE FUNCTION update_streak()
RETURNS TRIGGER AS $$
DECLARE
  v_last_date DATE;
  v_today DATE := CURRENT_DATE;
BEGIN
  SELECT last_play_date INTO v_last_date
  FROM player_progress
  WHERE player_id = NEW.player_id;

  IF v_last_date IS NULL OR v_last_date < v_today - INTERVAL '1 day' THEN
    -- Racha rota o primera vez
    UPDATE player_progress
    SET streak_days = CASE
          WHEN v_last_date = v_today - INTERVAL '1 day' THEN streak_days + 1
          ELSE 1
        END,
        last_play_date = v_today
    WHERE player_id = NEW.player_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_streak
AFTER INSERT ON player_sessions
FOR EACH ROW
EXECUTE FUNCTION update_streak();
```

### Función: Agregar monedas

```sql
CREATE OR REPLACE FUNCTION add_coins(
  p_player_id UUID,
  p_amount INTEGER,
  p_reason TEXT,
  p_reference_id UUID DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
  v_new_balance INTEGER;
BEGIN
  -- Actualizar balance
  UPDATE player_progress
  SET coins = coins + p_amount
  WHERE player_id = p_player_id
  RETURNING coins INTO v_new_balance;

  -- Registrar transacción
  INSERT INTO coin_transactions (player_id, amount, reason, reference_id, balance_after)
  VALUES (p_player_id, p_amount, p_reason, p_reference_id, v_new_balance);

  RETURN v_new_balance;
END;
$$ LANGUAGE plpgsql;
```

### Función: Calcular nivel de experiencia

```sql
CREATE OR REPLACE FUNCTION calculate_level(p_experience INTEGER)
RETURNS INTEGER AS $$
BEGIN
  -- Curva de nivel: nivel N requiere N*100 XP total
  RETURN FLOOR(SQRT(p_experience::FLOAT / 50)) + 1;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar nivel automáticamente
CREATE OR REPLACE FUNCTION update_level_on_xp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.level = calculate_level(NEW.experience);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_level
BEFORE UPDATE OF experience ON player_progress
FOR EACH ROW
EXECUTE FUNCTION update_level_on_xp();
```

---

## 10. ÍNDICES

```sql
-- Índices de performance críticos
CREATE INDEX idx_activity_logs_player_date
ON activity_logs(player_id, recorded_at DESC);

CREATE INDEX idx_activity_logs_topic
ON activity_logs(player_id, topic);

CREATE INDEX idx_letter_progress_mastery
ON letter_progress(player_id, mastery_score);

CREATE INDEX idx_inventory_equipped
ON player_inventory(player_id, is_equipped) WHERE is_equipped = true;

CREATE INDEX idx_sessions_recent
ON player_sessions(player_id, started_at DESC);

CREATE INDEX idx_coin_transactions_recent
ON coin_transactions(player_id, created_at DESC);
```

---

## 11. SCRIPT SQL COMPLETO

El script completo de inicialización se encuentra en:
`supabase/migrations/001_initial_schema.sql`

### Datos de Seed Iniciales

```sql
-- supabase/seed.sql

-- Letras del abecedario con metadata
CREATE TABLE IF NOT EXISTS letter_definitions (
  letter          CHAR(1) PRIMARY KEY,
  color           TEXT NOT NULL,         -- Color característico de la letra
  npc_name        TEXT NOT NULL,         -- Nombre del personaje-letra
  example_words   TEXT[] NOT NULL,       -- 3 palabras de ejemplo
  phoneme         TEXT NOT NULL,         -- Sonido fonético
  unlock_order    INTEGER NOT NULL       -- Orden de presentación al niño
);

INSERT INTO letter_definitions VALUES
  ('A', '#FF6B6B', 'Ana',   ARRAY['árbol', 'avión', 'araña'],    'a',  1),
  ('E', '#4ECDC4', 'Ema',   ARRAY['elefante', 'estrella', 'espejo'], 'e', 2),
  ('I', '#45B7D1', 'Ivo',   ARRAY['igloo', 'insecto', 'isla'],   'i',  3),
  ('O', '#96CEB4', 'Ola',   ARRAY['oso', 'oveja', 'ojo'],        'o',  4),
  ('U', '#FFEAA7', 'Ugo',   ARRAY['uva', 'unicornio', 'urraca'], 'u',  5),
  ('M', '#DDA0DD', 'Memo',  ARRAY['mamá', 'manzana', 'mariposa'],'m',  6),
  ('P', '#F0E68C', 'Pipo',  ARRAY['papá', 'perro', 'pelota'],    'p',  7),
  ('L', '#98FB98', 'Lola',  ARRAY['luna', 'libro', 'limón'],     'l',  8),
  ('S', '#87CEEB', 'Sisi',  ARRAY['sol', 'silla', 'sandía'],     's',  9),
  ('T', '#FFA07A', 'Toto',  ARRAY['tren', 'tortuga', 'taza'],    't', 10);
  -- ... (resto del abecedario)
```

---

*Esquema de Base de Datos de Villa Amparo — Versión 1.0*
