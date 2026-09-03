-- ============================================================================
-- HOME WORKOUT: SMART FITNESS MANAGEMENT SYSTEM (SDG 3: Good Health & Well-being)
-- COMPLETE SUPABASE POSTGRESQL DATABASE SCHEMA & SEED DATA
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE fitness_difficulty AS ENUM ('beginner', 'intermediate', 'advanced');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE workout_intensity AS ENUM ('low', 'medium', 'high');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT DEFAULT 'Fitness Enthusiast',
    avatar_url TEXT,
    weight_kg NUMERIC(5, 2) DEFAULT 70.00,
    height_cm NUMERIC(5, 2) DEFAULT 175.00,
    fitness_level fitness_difficulty DEFAULT 'beginner',
    daily_goal_minutes INTEGER DEFAULT 30,
    current_streak INTEGER DEFAULT 0,
    last_workout_date DATE,
    total_calories_burned NUMERIC(10, 2) DEFAULT 0.00,
    total_workouts INTEGER DEFAULT 0,
    total_active_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon_name TEXT NOT NULL,
    color_code TEXT NOT NULL,
    target_area TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. EXERCISES TABLE (Equipment-Free Bodyweight Focus)
CREATE TABLE IF NOT EXISTS public.exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    difficulty fitness_difficulty DEFAULT 'beginner',
    target_muscles TEXT[] NOT NULL DEFAULT '{}',
    met_multiplier NUMERIC(4, 2) NOT NULL DEFAULT 5.00, -- Metabolic Equivalent of Task
    recommended_reps INTEGER DEFAULT 12,
    recommended_sets INTEGER DEFAULT 3,
    recommended_duration_seconds INTEGER DEFAULT 45,
    instructions TEXT[] NOT NULL DEFAULT '{}',
    form_tips TEXT[] NOT NULL DEFAULT '{}',
    calories_per_minute_est NUMERIC(5, 2) NOT NULL DEFAULT 6.50,
    sdg_alignment_note TEXT DEFAULT 'Zero-equipment accessibility for universal health promotion (SDG 3.4)',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PROGRESS LOGS TABLE
CREATE TABLE IF NOT EXISTS public.progress_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    exercise_id UUID REFERENCES public.exercises(id) ON DELETE SET NULL,
    exercise_name TEXT NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    category_name TEXT,
    duration_seconds INTEGER NOT NULL CHECK (duration_seconds > 0),
    calories_burned NUMERIC(8, 2) NOT NULL CHECK (calories_burned >= 0),
    sets_completed INTEGER DEFAULT 1,
    reps_completed INTEGER DEFAULT 0,
    intensity_level workout_intensity DEFAULT 'medium',
    notes TEXT,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_exercises_category ON public.exercises(category_id);
CREATE INDEX IF NOT EXISTS idx_exercises_difficulty ON public.exercises(difficulty);
CREATE INDEX IF NOT EXISTS idx_progress_logs_user ON public.progress_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_logs_completed_at ON public.progress_logs(completed_at DESC);

-- 8. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_logs ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" 
    ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
    ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Categories Policies (Readable by all)
CREATE POLICY "Allow public read access to categories" 
    ON public.categories FOR SELECT USING (true);

-- Exercises Policies (Readable by all)
CREATE POLICY "Allow public read access to exercises" 
    ON public.exercises FOR SELECT USING (true);

-- Progress Logs Policies (Restricted to owner)
CREATE POLICY "Users can view their own workout logs" 
    ON public.progress_logs FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workout logs" 
    ON public.progress_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workout logs" 
    ON public.progress_logs FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workout logs" 
    ON public.progress_logs FOR DELETE USING (auth.uid() = user_id);

-- 9. TRIGGERS & FUNCTIONS

-- A. Auto create profile when a new user signs up in Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        new.raw_user_meta_data->>'avatar_url'
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- B. Auto-update user profile statistics & streak on new progress log
CREATE OR REPLACE FUNCTION public.sync_profile_workout_stats()
RETURNS TRIGGER AS $$
DECLARE
    log_date DATE;
    last_date DATE;
    current_stk INTEGER;
BEGIN
    -- Extract workout date
    log_date := (NEW.completed_at AT TIME ZONE 'UTC')::DATE;

    SELECT last_workout_date, current_streak
    INTO last_date, current_stk
    FROM public.profiles
    WHERE id = NEW.user_id;

    -- Calculate new streak
    IF last_date IS NULL THEN
        current_stk := 1;
    ELSIF last_date = log_date THEN
        -- Same day workout, keep streak
        current_stk := COALESCE(current_stk, 1);
    ELSIF last_date = log_date - INTERVAL '1 day' THEN
        -- Consecutive day workout, increment streak
        current_stk := COALESCE(current_stk, 0) + 1;
    ELSIF log_date > last_date + INTERVAL '1 day' THEN
        -- Missed days, reset streak to 1
        current_stk := 1;
    END IF;

    -- Update profile aggregates
    UPDATE public.profiles
    SET 
        total_workouts = total_workouts + 1,
        total_calories_burned = total_calories_burned + NEW.calories_burned,
        total_active_seconds = total_active_seconds + NEW.duration_seconds,
        last_workout_date = log_date,
        current_streak = current_stk,
        updated_at = NOW()
    WHERE id = NEW.user_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_sync_profile_workout_stats ON public.progress_logs;
CREATE TRIGGER tr_sync_profile_workout_stats
    AFTER INSERT ON public.progress_logs
    FOR EACH ROW EXECUTE PROCEDURE public.sync_profile_workout_stats();

-- ============================================================================
-- 10. COMPREHENSIVE SEED DATA (SDG 3 Equipment-Free Calisthenics)
-- ============================================================================

-- Insert Categories
INSERT INTO public.categories (id, name, slug, description, icon_name, color_code, target_area)
VALUES
    ('c0000000-0000-0000-0000-000000000001', 'Upper Body', 'upper-body', 'Chest, shoulders, triceps, and upper back strength without weights', 'Dumbbell', '#3b82f6', 'Chest, Arms & Shoulders'),
    ('c0000000-0000-0000-0000-000000000002', 'Core & Abs', 'core', 'Stabilize spine, tone abdominal muscles, and improve posture', 'Shield', '#10b981', 'Abdominals & Lower Back'),
    ('c0000000-0000-0000-0000-000000000003', 'Lower Body', 'lower-body', 'Build explosive leg drive, strong glutes, quads, and calves', 'Footprints', '#f59e0b', 'Quads, Glutes & Hamstrings'),
    ('c0000000-0000-0000-0000-000000000004', 'Cardio & HIIT', 'cardio', 'Elevate cardiovascular endurance and accelerate calorie burn', 'Flame', '#ef4444', 'Full Body & Heart Health'),
    ('c0000000-0000-0000-0000-000000000005', 'Full Body & Mobility', 'full-body', 'Complete athletic conditioning, flexibility, and joint health', 'Zap', '#8b5cf6', 'Total Kinetic Chain')
ON CONFLICT (slug) DO NOTHING;

-- Insert Exercises
INSERT INTO public.exercises (id, category_id, name, slug, description, difficulty, target_muscles, met_multiplier, recommended_reps, recommended_sets, recommended_duration_seconds, instructions, form_tips, calories_per_minute_est)
VALUES
    (
        'e0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000001',
        'Standard Push-ups',
        'push-ups',
        'Classic compound bodyweight exercise for pectoral, anterior deltoid, and tricep development.',
        'beginner',
        ARRAY['Chest (Pectorals)', 'Triceps', 'Shoulders (Anterior Deltoids)', 'Core'],
        5.50,
        15,
        3,
        45,
        ARRAY[
            'Start in a high plank position with hands slightly wider than shoulder-width.',
            'Keep your body in a straight line from head to heels by bracing your core and glutes.',
            'Lower your chest toward the floor by bending your elbows at a 45-degree angle.',
            'Push through the palms of your hands to return to the starting position.'
        ],
        ARRAY[
            'Avoid flaring your elbows straight out to 90 degrees.',
            'Do not let your hips sag or hike up.',
            'Exhale as you push up, inhale as you descend.'
        ],
        7.20
    ),
    (
        'e0000000-0000-0000-0000-000000000001'::uuid + 1,
        'c0000000-0000-0000-0000-000000000001',
        'Pike Push-ups',
        'pike-push-ups',
        'Shoulder-focused bodyweight movement mimicking an overhead press.',
        'intermediate',
        ARRAY['Shoulders (Deltoids)', 'Upper Chest', 'Triceps', 'Upper Back'],
        6.00,
        10,
        3,
        40,
        ARRAY[
            'Get into a downward-dog position with hips elevated high in the air.',
            'Look at your toes and keep your back straight.',
            'Bend elbows to lower the crown of your head diagonally forward toward the floor.',
            'Press upward through your shoulders to return to the pike peak.'
        ],
        ARRAY[
            'Focus the effort on your shoulders, not your lower back.',
            'Elevate your feet on a step for added resistance as you progress.'
        ],
        7.80
    ),
    (
        'e0000000-0000-0000-0000-000000000001'::uuid + 2,
        'c0000000-0000-0000-0000-000000000001',
        'Diamond Push-ups',
        'diamond-push-ups',
        'Advanced tricep and inner-chest exercise placing hands together in a diamond shape.',
        'advanced',
        ARRAY['Triceps', 'Inner Chest', 'Core', 'Front Deltoids'],
        6.80,
        8,
        3,
        35,
        ARRAY[
            'Position your index fingers and thumbs touching beneath your center chest.',
            'Maintain a rigid core and lower your chest directly above the diamond marker.',
            'Press firmly through your palms to lock out your triceps.'
        ],
        ARRAY[
            'Modify on knees if wrist mobility requires gradual adaptation.',
            'Keep elbows tucked close to your torso.'
        ],
        8.40
    ),
    (
        'e0000000-0000-0000-0000-000000000001'::uuid + 3,
        'c0000000-0000-0000-0000-000000000002',
        'Isometric Forearm Plank',
        'forearm-plank',
        'Static core hold building deep transverse abdominis endurance and spinal stability.',
        'beginner',
        ARRAY['Transverse Abdominis', 'Rectus Abdominis', 'Obliques', 'Lower Back'],
        4.00,
        1,
        3,
        60,
        ARRAY[
            'Rest on forearms with elbows aligned directly under your shoulders.',
            'Extend legs straight behind you, resting on the balls of your feet.',
            'Squeeze your core, glutes, and thighs to form an unbroken rigid bridge.'
        ],
        ARRAY[
            'Breathe rhythmically; do not hold your breath.',
            'Tuck your pelvis slightly to activate lower abdominals.'
        ],
        5.20
    ),
    (
        'e0000000-0000-0000-0000-000000000001'::uuid + 4,
        'c0000000-0000-0000-0000-000000000002',
        'Bicycle Crunches',
        'bicycle-crunches',
        'High-activation rotational core exercise targeting the obliques and six-pack muscles.',
        'intermediate',
        ARRAY['Obliques', 'Rectus Abdominis', 'Hip Flexors'],
        5.50,
        20,
        3,
        45,
        ARRAY[
            'Lie flat on your back with fingertips gently supporting behind your ears.',
            'Raise knees to 90 degrees and lift shoulder blades off the floor.',
            'Rotate right elbow toward left knee while extending your right leg straight out.',
            'Alternate sides in a smooth, pedaling cadence.'
        ],
        ARRAY[
            'Do not pull on your neck; let your torso do the rotation.',
            'Slow and controlled reps maximize muscle tension over fast jerky movements.'
        ],
        7.00
    ),
    (
        'e0000000-0000-0000-0000-000000000001'::uuid + 5,
        'c0000000-0000-0000-0000-000000000002',
        'Mountain Climbers',
        'mountain-climbers',
        'Dynamic core driver that delivers both abdominal strength and cardiovascular conditioning.',
        'intermediate',
        ARRAY['Abs', 'Hip Flexors', 'Shoulders', 'Cardiovascular System'],
        8.00,
        30,
        3,
        45,
        ARRAY[
            'Begin in a push-up position with arms straight under shoulders.',
            'Drive your right knee up toward your chest without touching the floor with that foot.',
            'Quickly switch legs, extending the right back and driving the left knee forward.'
        ],
        ARRAY[
            'Keep your hips low and level with your spine.',
            'Maintain steady breathing tempo.'
        ],
        10.50
    ),
    (
        'e0000000-0000-0000-0000-000000000001'::uuid + 6,
        'c0000000-0000-0000-0000-000000000003',
        'Bodyweight Air Squats',
        'bodyweight-squats',
        'Foundational lower body movement strengthening quads, hamstrings, and glutes.',
        'beginner',
        ARRAY['Quadriceps', 'Glutes', 'Hamstrings', 'Calves'],
        5.00,
        20,
        3,
        45,
        ARRAY[
            'Stand tall with feet shoulder-width apart, toes pointed slightly outward.',
            'Send your hips back and down as if sitting into a deep chair.',
            'Lower until your thighs are at least parallel to the floor.',
            'Drive through the heels to stand back up to full hip extension.'
        ],
        ARRAY[
            'Keep chest proud and eyes forward.',
            'Track your knees over your toes; do not let knees cave inward.'
        ],
        6.80
    ),
    (
        'e0000000-0000-0000-0000-000000000001'::uuid + 7,
        'c0000000-0000-0000-0000-000000000003',
        'Explosive Jump Squats',
        'jump-squats',
        'Plyometric lower-body power exercise maximizing fast-twitch muscle recruitment and caloric burn.',
        'advanced',
        ARRAY['Glutes', 'Quads', 'Calves', 'Cardiovascular System'],
        8.50,
        15,
        3,
        40,
        ARRAY[
            'Lower into a standard quarter-to-half squat position.',
            'Explode upward off the floor using full lower body force.',
            'Land softly with bent knees to absorb impact seamlessly into the next rep.'
        ],
        ARRAY[
            'Land quietly on the balls of your feet rolling to your heels.',
            'Engage core to protect lumbar spine.'
        ],
        11.50
    ),
    (
        'e0000000-0000-0000-0000-000000000001'::uuid + 8,
        'c0000000-0000-0000-0000-000000000003',
        'Walking Lunges',
        'walking-lunges',
        'Unilateral leg movement enhancing balance, hip mobility, and single-leg strength.',
        'beginner',
        ARRAY['Quadriceps', 'Hamstrings', 'Glutes', 'Calves'],
        5.20,
        16,
        3,
        45,
        ARRAY[
            'Step forward with right leg, lowering hips until both knees bend at 90-degree angles.',
            'Ensure your front knee is directly above your ankle.',
            'Drive up through the front heel and step forward into the next lunge with the left leg.'
        ],
        ARRAY[
            'Keep torso upright throughout the step.',
            'Do not let the trailing knee slam into the floor.'
        ],
        6.90
    ),
    (
        'e0000000-0000-0000-0000-000000000001'::uuid + 9,
        'c0000000-0000-0000-0000-000000000003',
        'Glute Bridge Holds',
        'glute-bridges',
        'Posterior chain activator strengthening the gluteus maximus and relieving lower back tightness.',
        'beginner',
        ARRAY['Gluteus Maximus', 'Hamstrings', 'Lower Back Core'],
        4.20,
        18,
        3,
        45,
        ARRAY[
            'Lie on back with knees bent and feet flat on floor hip-width apart.',
            'Press through your heels to lift your hips toward the ceiling until thighs and torso align.',
            'Squeeze your glutes hard at the top for 2 seconds before lowering slowly.'
        ],
        ARRAY[
            'Do not hyperextend your lower back at the apex.',
            'Keep ribs down and core engaged.'
        ],
        5.50
    ),
    (
        'e0000000-0000-0000-0000-000000000001'::uuid + 10,
        'c0000000-0000-0000-0000-000000000004',
        'Full Body Burpees',
        'burpees',
        'The gold-standard calisthenics conditioning drill combining a squat, plank, push-up, and jump.',
        'advanced',
        ARRAY['Full Body', 'Chest', 'Quads', 'Cardiovascular System'],
        9.50,
        12,
        3,
        45,
        ARRAY[
            'Stand upright, drop down into a squat, and place hands on the floor.',
            'Kick feet back into a push-up position and immediately lower chest to floor.',
            'Press up, jump feet back under hips, and leap vertically with hands overhead.'
        ],
        ARRAY[
            'Pace yourself steadily to sustain high-output rounds.',
            'Step feet back instead of jumping if you need a lower-impact regression.'
        ],
        13.00
    ),
    (
        'e0000000-0000-0000-0000-000000000001'::uuid + 11,
        'c0000000-0000-0000-0000-000000000004',
        'Jumping Jacks',
        'jumping-jacks',
        'Rhythmic total-body cardio warm-up and calorie burner stimulating lymphatic flow and heart health.',
        'beginner',
        ARRAY['Cardiovascular System', 'Calves', 'Shoulders', 'Adductors'],
        6.50,
        40,
        3,
        45,
        ARRAY[
            'Stand with feet together and arms resting at your sides.',
            'Jump feet out to the sides while swinging arms overhead in an arc.',
            'Jump back to the starting stance in a continuous fluid rhythm.'
        ],
        ARRAY[
            'Stay light on the balls of your feet.',
            'Maintain soft knees upon each landing.'
        ],
        8.50
    ),
    (
        'e0000000-0000-0000-0000-000000000001'::uuid + 12,
        'c0000000-0000-0000-0000-000000000004',
        'High Knees Sprint',
        'high-knees',
        'Intense aerobic sprint on the spot targeting hip flexors, quads, and maximum heart rate elevation.',
        'intermediate',
        ARRAY['Hip Flexors', 'Quadriceps', 'Calves', 'Cardiovascular System'],
        8.00,
        30,
        3,
        40,
        ARRAY[
            'Stand tall and run in place, driving each knee up to hip level.',
            'Pump your opposite arms in rhythm with your leg drive.',
            'Maintain a brisk cadence on the balls of your feet.'
        ],
        ARRAY[
            'Stay tall through the torso; do not lean backward.',
            'Engage your lower abs to pull your knees upward.'
        ],
        10.80
    )
ON CONFLICT (slug) DO NOTHING;
