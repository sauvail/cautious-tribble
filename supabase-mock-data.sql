-- Mock exercises data
INSERT INTO public.exercises (name, description, muscle_groups, equipment) VALUES
  ('Barbell Squat', 'Classic compound movement for lower body strength', ARRAY['Quadriceps', 'Glutes', 'Hamstrings'], ARRAY['Barbell', 'Squat Rack']),
  ('Bench Press', 'Upper body pressing movement targeting chest', ARRAY['Chest', 'Triceps', 'Shoulders'], ARRAY['Barbell', 'Bench']),
  ('Deadlift', 'Full body compound lift for posterior chain', ARRAY['Back', 'Glutes', 'Hamstrings', 'Core'], ARRAY['Barbell']),
  ('Pull-ups', 'Bodyweight exercise for back and biceps', ARRAY['Back', 'Biceps', 'Core'], ARRAY['Pull-up Bar']),
  ('Overhead Press', 'Shoulder pressing movement', ARRAY['Shoulders', 'Triceps', 'Core'], ARRAY['Barbell']),
  ('Barbell Row', 'Horizontal pulling exercise for back', ARRAY['Back', 'Biceps', 'Core'], ARRAY['Barbell']),
  ('Romanian Deadlift', 'Hip hinge movement for hamstrings', ARRAY['Hamstrings', 'Glutes', 'Back'], ARRAY['Barbell']),
  ('Dumbbell Shoulder Press', 'Unilateral shoulder pressing', ARRAY['Shoulders', 'Triceps'], ARRAY['Dumbbells']),
  ('Leg Press', 'Machine-based leg exercise', ARRAY['Quadriceps', 'Glutes'], ARRAY['Leg Press Machine']),
  ('Lat Pulldown', 'Machine-based back exercise', ARRAY['Back', 'Biceps'], ARRAY['Cable Machine']),
  ('Lunges', 'Single-leg lower body exercise', ARRAY['Quadriceps', 'Glutes', 'Hamstrings'], ARRAY['Dumbbells', 'Bodyweight']),
  ('Plank', 'Core stability exercise', ARRAY['Core', 'Shoulders'], ARRAY['Bodyweight']),
  ('Push-ups', 'Bodyweight pressing movement', ARRAY['Chest', 'Triceps', 'Shoulders', 'Core'], ARRAY['Bodyweight']),
  ('Cable Flyes', 'Isolation exercise for chest', ARRAY['Chest'], ARRAY['Cable Machine']),
  ('Bicep Curls', 'Arm isolation exercise', ARRAY['Biceps'], ARRAY['Dumbbells', 'Barbell']);

-- Mock program with workouts
DO $$
DECLARE
  program_id UUID;
  workout_day1_id UUID;
  workout_day2_id UUID;
  workout_day3_id UUID;
  squat_id UUID;
  bench_id UUID;
  deadlift_id UUID;
  pullup_id UUID;
  ohp_id UUID;
  row_id UUID;
BEGIN
  -- Get exercise IDs
  SELECT id INTO squat_id FROM public.exercises WHERE name = 'Barbell Squat' LIMIT 1;
  SELECT id INTO bench_id FROM public.exercises WHERE name = 'Bench Press' LIMIT 1;
  SELECT id INTO deadlift_id FROM public.exercises WHERE name = 'Deadlift' LIMIT 1;
  SELECT id INTO pullup_id FROM public.exercises WHERE name = 'Pull-ups' LIMIT 1;
  SELECT id INTO ohp_id FROM public.exercises WHERE name = 'Overhead Press' LIMIT 1;
  SELECT id INTO row_id FROM public.exercises WHERE name = 'Barbell Row' LIMIT 1;

  -- Create a sample program (note: coach_id will need to be updated)
  -- INSERT INTO public.programs (coach_id, name, description, status)
  -- VALUES (
  --   'your-coach-uuid-here',
  --   'Beginner Strength Program',
  --   'A 3-day per week program focused on building foundational strength',
  --   'draft'
  -- ) RETURNING id INTO program_id;

  -- This mock data is commented out as it requires a valid coach_id
  -- Coaches will create their own programs through the UI
END $$;
