-- ============================================================
-- VILLA AMPARO — Migración Inicial
-- Versión 1.0 | Mayo 2026
-- ============================================================

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================
-- TABLAS DEL SISTEMA
-- ============================================================

-- Catálogo de objetos del juego
CREATE TABLE catalog_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_type     TEXT NOT NULL CHECK (item_type IN (
                  'furniture', 'clothing', 'hat', 'shoe',
                  'backpack', 'pet', 'decoration', 'vehicle'
                )),
  category      TEXT NOT NULL,
  name          TEXT NOT NULL,
  name_es       TEXT NOT NULL,
  description   TEXT,
  cost_coins    INTEGER NOT NULL DEFAULT 0,
  is_starter    BOOLEAN DEFAULT false,
  unlock_level  INTEGER DEFAULT 1,
  zone_exclusive TEXT,
  image_url     TEXT,
  model_url     TEXT,
  rarity        TEXT DEFAULT 'common' CHECK (rarity IN (
                  'common', 'uncommon', 'rare', 'legendary'
                )),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Zonas del mundo
CREATE TABLE zones (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  name_es       TEXT NOT NULL,
  description   TEXT,
  unlock_level  INTEGER DEFAULT 1,
  bgm_url       TEXT,
  thumbnail_url TEXT,
  world_x       FLOAT,
  world_z       FLOAT,
  is_available  BOOLEAN DEFAULT true
);

-- Letras del abecedario con metadata educativa
CREATE TABLE letter_definitions (
  letter          CHAR(1) PRIMARY KEY,
  color           TEXT NOT NULL,
  npc_name        TEXT NOT NULL,
  npc_description TEXT,
  example_words   TEXT[] NOT NULL,
  phoneme         TEXT NOT NULL,
  phoneme_description TEXT,
  unlock_order    INTEGER NOT NULL,
  letter_type     TEXT NOT NULL CHECK (letter_type IN ('vowel', 'consonant'))
);

-- Misiones
CREATE TABLE missions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_type    TEXT NOT NULL CHECK (mission_type IN (
                    'main', 'secondary', 'daily', 'discovery'
                  )),
  title           TEXT NOT NULL,
  title_es        TEXT NOT NULL,
  description     TEXT,
  narrator_script TEXT NOT NULL,
  zone_id         TEXT REFERENCES zones(id),
  required_level  INTEGER DEFAULT 1,
  required_missions UUID[],
  reward_coins    INTEGER DEFAULT 25,
  reward_items    UUID[],
  reward_npc_id   TEXT,
  education_type  TEXT CHECK (education_type IN (
                    'letter', 'phonics', 'word', 'reading',
                    'math', 'logic', 'creativity', 'general'
                  )),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Pasos de misiones
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
  target_object   TEXT,
  target_quantity INTEGER DEFAULT 1,
  minigame_id     TEXT
);

-- Logros
CREATE TABLE achievements (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code            TEXT UNIQUE NOT NULL,
  title           TEXT NOT NULL,
  title_es        TEXT NOT NULL,
  description     TEXT,
  narrator_script TEXT,
  badge_url       TEXT,
  reward_coins    INTEGER DEFAULT 0,
  reward_item_id  UUID REFERENCES catalog_items(id),
  category        TEXT CHECK (category IN (
                    'reading', 'math', 'exploration',
                    'social', 'building', 'streak'
                  )),
  unlock_criteria JSONB NOT NULL DEFAULT '{}'
);

-- Recompensas diarias
CREATE TABLE daily_rewards (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_number      INTEGER NOT NULL UNIQUE,
  reward_coins    INTEGER NOT NULL,
  reward_item_id  UUID REFERENCES catalog_items(id),
  special_message TEXT
);

-- ============================================================
-- TABLAS DE JUGADOR
-- ============================================================

-- Perfil del padre/tutor
CREATE TABLE parent_profiles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name       TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN (
                    'free', 'premium', 'family', 'school'
                  )),
  max_children    INTEGER DEFAULT 1,
  settings        JSONB DEFAULT '{
    "session_time_limit": 60,
    "daily_time_limit": 120,
    "email_reports": true,
    "report_frequency": "weekly"
  }',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Perfiles de niños
CREATE TABLE players (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_user_id  UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  player_name     TEXT NOT NULL CHECK (length(player_name) BETWEEN 1 AND 20),
  avatar_config   JSONB NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  last_active     TIMESTAMPTZ DEFAULT NOW(),
  is_active       BOOLEAN DEFAULT true
);

-- Progreso general del jugador
CREATE TABLE player_progress (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id       UUID REFERENCES players(id) ON DELETE CASCADE UNIQUE,
  level           INTEGER NOT NULL DEFAULT 1,
  experience      INTEGER NOT NULL DEFAULT 0,
  coins           INTEGER NOT NULL DEFAULT 100,
  reading_level   INTEGER NOT NULL DEFAULT 1 CHECK (reading_level BETWEEN 1 AND 10),
  writing_level   INTEGER NOT NULL DEFAULT 1 CHECK (writing_level BETWEEN 1 AND 10),
  math_level      INTEGER NOT NULL DEFAULT 1 CHECK (math_level BETWEEN 1 AND 10),
  letters_mastery JSONB NOT NULL DEFAULT '{}',
  words_learned   TEXT[] DEFAULT '{}',
  numbers_mastery JSONB NOT NULL DEFAULT '{}',
  unlocked_zones  TEXT[] DEFAULT ARRAY['villa_center', 'letter_forest'],
  adaptive_profile JSONB DEFAULT '{}',
  streak_days     INTEGER DEFAULT 0,
  last_play_date  DATE,
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Sesiones de juego
CREATE TABLE player_sessions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id         UUID REFERENCES players(id) ON DELETE CASCADE,
  started_at        TIMESTAMPTZ DEFAULT NOW(),
  ended_at          TIMESTAMPTZ,
  duration_seconds  INTEGER,
  zones_visited     TEXT[] DEFAULT '{}',
  coins_earned      INTEGER DEFAULT 0,
  xp_earned         INTEGER DEFAULT 0,
  activities_count  INTEGER DEFAULT 0,
  correct_answers   INTEGER DEFAULT 0,
  incorrect_answers INTEGER DEFAULT 0
);

-- ============================================================
-- TABLAS EDUCATIVAS
-- ============================================================

-- Registro de actividades
CREATE TABLE activity_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id       UUID REFERENCES players(id) ON DELETE CASCADE,
  session_id      UUID REFERENCES player_sessions(id),
  activity_type   TEXT NOT NULL CHECK (activity_type IN (
                    'letter_recognition', 'letter_phonics',
                    'syllable_building', 'word_building',
                    'word_association', 'comprehension',
                    'counting', 'addition', 'subtraction',
                    'pattern_recognition', 'logic_puzzle'
                  )),
  topic           TEXT NOT NULL,
  difficulty      INTEGER DEFAULT 1 CHECK (difficulty BETWEEN 1 AND 5),
  is_correct      BOOLEAN NOT NULL,
  attempts        INTEGER DEFAULT 1,
  time_spent_ms   INTEGER,
  zone_id         TEXT,
  minigame_id     TEXT,
  recorded_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Progreso detallado por letra
CREATE TABLE letter_progress (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id         UUID REFERENCES players(id) ON DELETE CASCADE,
  letter            CHAR(1) NOT NULL,
  times_seen        INTEGER DEFAULT 0,
  times_correct     INTEGER DEFAULT 0,
  times_incorrect   INTEGER DEFAULT 0,
  avg_response_ms   INTEGER,
  phonics_attempts  INTEGER DEFAULT 0,
  phonics_correct   INTEGER DEFAULT 0,
  writing_attempts  INTEGER DEFAULT 0,
  writing_correct   INTEGER DEFAULT 0,
  mastery_score     FLOAT DEFAULT 0.0,
  confused_with     TEXT[] DEFAULT '{}',
  first_seen_at     TIMESTAMPTZ DEFAULT NOW(),
  last_practiced    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, letter)
);

-- Progreso por palabra
CREATE TABLE word_progress (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id         UUID REFERENCES players(id) ON DELETE CASCADE,
  word              TEXT NOT NULL,
  times_encountered INTEGER DEFAULT 0,
  times_correct     INTEGER DEFAULT 0,
  is_mastered       BOOLEAN DEFAULT false,
  first_seen_at     TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, word)
);

-- ============================================================
-- TABLAS DEL MUNDO Y RECOMPENSAS
-- ============================================================

-- Casa del jugador
CREATE TABLE player_home (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id       UUID REFERENCES players(id) ON DELETE CASCADE UNIQUE,
  rooms           JSONB NOT NULL DEFAULT '{
    "main_room":   {"floor_color": "#F5DEB3", "wall_color": "#FFFFFF", "items": []},
    "living_room": {"floor_color": "#D2B48C", "wall_color": "#F5F5DC", "items": []},
    "kitchen":     {"floor_color": "#FFDEAD", "wall_color": "#FFFACD", "items": []},
    "garden":      {"items": []}
  }',
  unlocked_rooms  TEXT[] DEFAULT ARRAY['main_room', 'living_room', 'kitchen', 'garden'],
  house_level     INTEGER DEFAULT 1,
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Misiones completadas
CREATE TABLE mission_completions (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id           UUID REFERENCES players(id) ON DELETE CASCADE,
  mission_id          UUID REFERENCES missions(id),
  completed_at        TIMESTAMPTZ DEFAULT NOW(),
  time_spent_seconds  INTEGER,
  coins_received      INTEGER,
  UNIQUE(player_id, mission_id)
);

-- Relaciones con NPCs
CREATE TABLE npc_relationships (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id         UUID REFERENCES players(id) ON DELETE CASCADE,
  npc_id            TEXT NOT NULL,
  friendship_level  INTEGER DEFAULT 0 CHECK (friendship_level BETWEEN 0 AND 100),
  is_unlocked       BOOLEAN DEFAULT false,
  is_moved_in       BOOLEAN DEFAULT false,
  interactions_count INTEGER DEFAULT 0,
  last_interaction  TIMESTAMPTZ,
  UNIQUE(player_id, npc_id)
);

-- Inventario del jugador
CREATE TABLE player_inventory (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id       UUID REFERENCES players(id) ON DELETE CASCADE,
  item_id         UUID REFERENCES catalog_items(id),
  acquired_at     TIMESTAMPTZ DEFAULT NOW(),
  acquired_via    TEXT CHECK (acquired_via IN (
                    'purchase', 'mission_reward', 'achievement',
                    'starter', 'daily_reward', 'zone_unlock'
                  )),
  is_equipped     BOOLEAN DEFAULT false,
  quantity        INTEGER DEFAULT 1,
  UNIQUE(player_id, item_id)
);

-- Logros del jugador
CREATE TABLE player_achievements (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id       UUID REFERENCES players(id) ON DELETE CASCADE,
  achievement_id  UUID REFERENCES achievements(id),
  unlocked_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, achievement_id)
);

-- Historial de monedas
CREATE TABLE coin_transactions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id       UUID REFERENCES players(id) ON DELETE CASCADE,
  amount          INTEGER NOT NULL,
  reason          TEXT NOT NULL,
  reference_id    UUID,
  balance_after   INTEGER NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Reportes para padres
CREATE TABLE parent_reports (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id       UUID REFERENCES parent_profiles(id),
  player_id       UUID REFERENCES players(id),
  period_type     TEXT CHECK (period_type IN ('weekly', 'monthly')),
  period_start    DATE,
  period_end      DATE,
  report_content  JSONB,
  generated_at    TIMESTAMPTZ DEFAULT NOW(),
  sent_via_email  BOOLEAN DEFAULT false
);

-- ============================================================
-- ÍNDICES
-- ============================================================

CREATE INDEX idx_players_parent ON players(parent_user_id);
CREATE INDEX idx_player_progress_player ON player_progress(player_id);
CREATE INDEX idx_sessions_player ON player_sessions(player_id);
CREATE INDEX idx_sessions_date ON player_sessions(started_at);
CREATE INDEX idx_activity_player ON activity_logs(player_id);
CREATE INDEX idx_activity_type ON activity_logs(activity_type);
CREATE INDEX idx_activity_date ON activity_logs(recorded_at);
CREATE INDEX idx_activity_topic ON activity_logs(topic);
CREATE INDEX idx_activity_logs_player_date ON activity_logs(player_id, recorded_at DESC);
CREATE INDEX idx_letter_progress_player ON letter_progress(player_id);
CREATE INDEX idx_letter_progress_mastery ON letter_progress(player_id, mastery_score);
CREATE INDEX idx_word_progress_player ON word_progress(player_id);
CREATE INDEX idx_inventory_player ON player_inventory(player_id);
CREATE INDEX idx_inventory_equipped ON player_inventory(player_id, is_equipped) WHERE is_equipped = true;
CREATE INDEX idx_coins_player ON coin_transactions(player_id);
CREATE INDEX idx_coin_transactions_recent ON coin_transactions(player_id, created_at DESC);
CREATE INDEX idx_mission_completions_player ON mission_completions(player_id);
CREATE INDEX idx_sessions_recent ON player_sessions(player_id, started_at DESC);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

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

-- Catálogos son de lectura pública
ALTER TABLE catalog_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE letter_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "catalog_public_read" ON catalog_items FOR SELECT USING (true);
CREATE POLICY "zones_public_read" ON zones FOR SELECT USING (true);
CREATE POLICY "missions_public_read" ON missions FOR SELECT USING (true);
CREATE POLICY "achievements_public_read" ON achievements FOR SELECT USING (true);
CREATE POLICY "letters_public_read" ON letter_definitions FOR SELECT USING (true);
CREATE POLICY "daily_rewards_public_read" ON daily_rewards FOR SELECT USING (true);

-- Padres solo ven y modifican sus propios datos
CREATE POLICY "parent_own_profile" ON parent_profiles FOR ALL
  USING (user_id = auth.uid());

-- Padres solo ven sus hijos
CREATE POLICY "parent_owns_players" ON players FOR ALL
  USING (parent_user_id = auth.uid());

-- Helper function para verificar propiedad de jugador
CREATE OR REPLACE FUNCTION owns_player(p_player_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM players
    WHERE id = p_player_id AND parent_user_id = auth.uid()
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- Aplicar política de propiedad a todas las tablas de jugador
CREATE POLICY "progress_owns_player" ON player_progress FOR ALL USING (owns_player(player_id));
CREATE POLICY "sessions_owns_player" ON player_sessions FOR ALL USING (owns_player(player_id));
CREATE POLICY "activities_owns_player" ON activity_logs FOR ALL USING (owns_player(player_id));
CREATE POLICY "letter_prog_owns_player" ON letter_progress FOR ALL USING (owns_player(player_id));
CREATE POLICY "word_prog_owns_player" ON word_progress FOR ALL USING (owns_player(player_id));
CREATE POLICY "home_owns_player" ON player_home FOR ALL USING (owns_player(player_id));
CREATE POLICY "inventory_owns_player" ON player_inventory FOR ALL USING (owns_player(player_id));
CREATE POLICY "achievements_owns_player" ON player_achievements FOR ALL USING (owns_player(player_id));
CREATE POLICY "coins_owns_player" ON coin_transactions FOR ALL USING (owns_player(player_id));
CREATE POLICY "missions_comp_owns_player" ON mission_completions FOR ALL USING (owns_player(player_id));
CREATE POLICY "npc_rel_owns_player" ON npc_relationships FOR ALL USING (owns_player(player_id));
CREATE POLICY "reports_owns_parent" ON parent_reports FOR ALL USING (
  parent_id IN (SELECT id FROM parent_profiles WHERE user_id = auth.uid())
);

-- ============================================================
-- FUNCIONES Y TRIGGERS
-- ============================================================

-- Calcular nivel de experiencia
CREATE OR REPLACE FUNCTION calculate_level(p_experience INTEGER)
RETURNS INTEGER AS $$
BEGIN
  RETURN GREATEST(1, FLOOR(SQRT(p_experience::FLOAT / 50)) + 1);
END;
$$ LANGUAGE plpgsql;

-- Actualizar nivel automáticamente al cambiar XP
CREATE OR REPLACE FUNCTION update_level_on_xp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.level = calculate_level(NEW.experience);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_level
BEFORE UPDATE OF experience ON player_progress
FOR EACH ROW EXECUTE FUNCTION update_level_on_xp();

-- Agregar monedas con registro de transacción
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
  UPDATE player_progress
  SET coins = GREATEST(0, coins + p_amount)
  WHERE player_id = p_player_id
  RETURNING coins INTO v_new_balance;

  INSERT INTO coin_transactions (player_id, amount, reason, reference_id, balance_after)
  VALUES (p_player_id, p_amount, p_reason, p_reference_id, v_new_balance);

  RETURN v_new_balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Actualizar progreso de letra al registrar actividad
CREATE OR REPLACE FUNCTION update_letter_progress_on_activity()
RETURNS TRIGGER AS $$
DECLARE
  v_letter CHAR(1);
  v_mastery FLOAT;
BEGIN
  IF NEW.activity_type NOT IN ('letter_recognition', 'letter_phonics') THEN
    RETURN NEW;
  END IF;

  v_letter := UPPER(REPLACE(REPLACE(NEW.topic, 'letter_', ''), 'phonics_', ''));

  IF length(v_letter) != 1 THEN
    RETURN NEW;
  END IF;

  INSERT INTO letter_progress (player_id, letter, times_seen, times_correct, times_incorrect)
  VALUES (
    NEW.player_id,
    v_letter,
    1,
    CASE WHEN NEW.is_correct THEN 1 ELSE 0 END,
    CASE WHEN NOT NEW.is_correct THEN 1 ELSE 0 END
  )
  ON CONFLICT (player_id, letter) DO UPDATE SET
    times_seen = letter_progress.times_seen + 1,
    times_correct = letter_progress.times_correct + CASE WHEN NEW.is_correct THEN 1 ELSE 0 END,
    times_incorrect = letter_progress.times_incorrect + CASE WHEN NOT NEW.is_correct THEN 1 ELSE 0 END,
    last_practiced = NOW();

  -- Calcular nuevo mastery score (ponderado por intentos)
  SELECT
    CASE
      WHEN (times_correct + times_incorrect) = 0 THEN 0.0
      ELSE LEAST(1.0, times_correct::FLOAT / GREATEST(1, times_correct + times_incorrect))
    END
  INTO v_mastery
  FROM letter_progress
  WHERE player_id = NEW.player_id AND letter = v_letter;

  UPDATE letter_progress
  SET mastery_score = v_mastery
  WHERE player_id = NEW.player_id AND letter = v_letter;

  -- Actualizar JSONB en player_progress
  UPDATE player_progress
  SET
    letters_mastery = jsonb_set(
      letters_mastery,
      ARRAY[v_letter::text],
      to_jsonb(v_mastery)
    ),
    updated_at = NOW()
  WHERE player_id = NEW.player_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_letter_progress
AFTER INSERT ON activity_logs
FOR EACH ROW EXECUTE FUNCTION update_letter_progress_on_activity();

-- Actualizar racha de días al iniciar sesión
CREATE OR REPLACE FUNCTION update_streak_on_session()
RETURNS TRIGGER AS $$
DECLARE
  v_last_date DATE;
  v_today DATE := CURRENT_DATE;
BEGIN
  SELECT last_play_date INTO v_last_date
  FROM player_progress
  WHERE player_id = NEW.player_id;

  UPDATE player_progress
  SET
    streak_days = CASE
      WHEN v_last_date = v_today THEN streak_days         -- mismo día: no cambiar
      WHEN v_last_date = v_today - INTERVAL '1 day' THEN streak_days + 1  -- día siguiente: +1
      ELSE 1                                               -- racha rota: reset
    END,
    last_play_date = v_today,
    updated_at = NOW()
  WHERE player_id = NEW.player_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_streak
AFTER INSERT ON player_sessions
FOR EACH ROW EXECUTE FUNCTION update_streak_on_session();

-- Crear progreso inicial al crear un jugador
CREATE OR REPLACE FUNCTION create_initial_progress()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO player_progress (player_id)
  VALUES (NEW.id);

  INSERT INTO player_home (player_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_initial_progress
AFTER INSERT ON players
FOR EACH ROW EXECUTE FUNCTION create_initial_progress();
