// ==========================================
// MOCK & FALLBACK DATASETS
// Complete equipment-free exercises & demo analytics
// ==========================================

import { Exercise, ExerciseCategory, ProgressLog, UserProfile } from './types';

export const INITIAL_CATEGORIES: ExerciseCategory[] = [
  {
    id: 'c0000000-0000-0000-0000-000000000001',
    name: 'Upper Body',
    slug: 'upper-body',
    description: 'Pectoral, shoulder, tricep, and back development without weights.',
    icon_name: 'Dumbbell',
    color_code: '#3b82f6',
    target_area: 'Chest, Arms & Shoulders',
    exercise_count: 4,
  },
  {
    id: 'c0000000-0000-0000-0000-000000000002',
    name: 'Core & Abs',
    slug: 'core',
    description: 'Spinal stability, oblique control, and abdominal definition.',
    icon_name: 'Shield',
    color_code: '#10b981',
    target_area: 'Abdominals & Lower Back',
    exercise_count: 4,
  },
  {
    id: 'c0000000-0000-0000-0000-000000000003',
    name: 'Lower Body',
    slug: 'lower-body',
    description: 'Explosive quadriceps, glutes, hamstrings, and calf endurance.',
    icon_name: 'Footprints',
    color_code: '#f59e0b',
    target_area: 'Quads, Glutes & Hamstrings',
    exercise_count: 4,
  },
  {
    id: 'c0000000-0000-0000-0000-000000000004',
    name: 'Cardio & HIIT',
    slug: 'cardio',
    description: 'Aerobic threshold elevation and high-rate caloric expenditure.',
    icon_name: 'Flame',
    color_code: '#ef4444',
    target_area: 'Full Body & Heart Health',
    exercise_count: 4,
  },
];

export const INITIAL_EXERCISES: Exercise[] = [
  {
    id: 'e0000000-0000-0000-0000-000000000001',
    category_id: 'c0000000-0000-0000-0000-000000000001',
    name: 'Standard Push-ups',
    slug: 'push-ups',
    description: 'Classic compound bodyweight exercise for pectoral, anterior deltoid, and tricep development.',
    difficulty: 'beginner',
    target_muscles: ['Chest (Pectorals)', 'Triceps', 'Shoulders (Anterior Deltoids)', 'Core'],
    met_multiplier: 5.5,
    recommended_reps: 15,
    recommended_sets: 3,
    recommended_duration_seconds: 45,
    instructions: [
      'Start in a high plank position with hands slightly wider than shoulder-width.',
      'Keep your body in a straight line from head to heels by bracing your core and glutes.',
      'Lower your chest toward the floor by bending your elbows at a 45-degree angle.',
      'Push through the palms of your hands to return to the starting position.'
    ],
    form_tips: [
      'Avoid flaring your elbows straight out to 90 degrees.',
      'Do not let your hips sag or hike up.',
      'Exhale as you push up, inhale as you descend.'
    ],
    calories_per_minute_est: 7.2,
    image_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop&q=80',
    sdg_alignment_note: 'Promotes upper body musculoskeletal strength without gym equipment (SDG 3.4).'
  },
  {
    id: 'e0000000-0000-0000-0000-000000000002',
    category_id: 'c0000000-0000-0000-0000-000000000001',
    name: 'Pike Push-ups',
    slug: 'pike-push-ups',
    description: 'Shoulder-focused bodyweight movement mimicking an overhead barbell press.',
    difficulty: 'intermediate',
    target_muscles: ['Shoulders (Deltoids)', 'Upper Chest', 'Triceps', 'Upper Back'],
    met_multiplier: 6.0,
    recommended_reps: 10,
    recommended_sets: 3,
    recommended_duration_seconds: 40,
    instructions: [
      'Get into a downward-dog position with hips elevated high in the air.',
      'Look at your toes and keep your back straight.',
      'Bend elbows to lower the crown of your head diagonally forward toward the floor.',
      'Press upward through your shoulders to return to the pike peak.'
    ],
    form_tips: [
      'Focus the effort on your shoulders, not your lower back.',
      'Elevate your feet on a step for added resistance as you progress.'
    ],
    calories_per_minute_est: 7.8,
    image_url: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=800&auto=format&fit=crop&q=80',
    sdg_alignment_note: 'Builds functional overhead mobility and joint resilience.'
  },
  {
    id: 'e0000000-0000-0000-0000-000000000003',
    category_id: 'c0000000-0000-0000-0000-000000000001',
    name: 'Diamond Push-ups',
    slug: 'diamond-push-ups',
    description: 'High-intensity tricep and inner-chest exercise placing hands together in a diamond shape.',
    difficulty: 'advanced',
    target_muscles: ['Triceps', 'Inner Chest', 'Core', 'Front Deltoids'],
    met_multiplier: 6.8,
    recommended_reps: 8,
    recommended_sets: 3,
    recommended_duration_seconds: 35,
    instructions: [
      'Position your index fingers and thumbs touching beneath your center chest.',
      'Maintain a rigid core and lower your chest directly above the diamond marker.',
      'Press firmly through your palms to lock out your triceps.'
    ],
    form_tips: [
      'Modify on knees if wrist mobility requires gradual adaptation.',
      'Keep elbows tucked close to your torso.'
    ],
    calories_per_minute_est: 8.4,
    image_url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80',
    sdg_alignment_note: 'Enhances forearm, tricep, and core stabilization.'
  },
  {
    id: 'e0000000-0000-0000-0000-000000000004',
    category_id: 'c0000000-0000-0000-0000-000000000002',
    name: 'Isometric Forearm Plank',
    slug: 'forearm-plank',
    description: 'Static core hold building deep transverse abdominis endurance and spinal posture.',
    difficulty: 'beginner',
    target_muscles: ['Transverse Abdominis', 'Rectus Abdominis', 'Obliques', 'Lower Back'],
    met_multiplier: 4.0,
    recommended_reps: 1,
    recommended_sets: 3,
    recommended_duration_seconds: 60,
    instructions: [
      'Rest on forearms with elbows aligned directly under your shoulders.',
      'Extend legs straight behind you, resting on the balls of your feet.',
      'Squeeze your core, glutes, and thighs to form an unbroken rigid bridge.'
    ],
    form_tips: [
      'Breathe rhythmically; do not hold your breath.',
      'Tuck your pelvis slightly to activate lower abdominals.'
    ],
    calories_per_minute_est: 5.2,
    image_url: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=800&auto=format&fit=crop&q=80',
    sdg_alignment_note: 'Prevents chronic lower back pain and improves sedentary posture.'
  },
  {
    id: 'e0000000-0000-0000-0000-000000000005',
    category_id: 'c0000000-0000-0000-0000-000000000002',
    name: 'Bicycle Crunches',
    slug: 'bicycle-crunches',
    description: 'High-activation rotational core exercise targeting the obliques and rectus abdominis.',
    difficulty: 'intermediate',
    target_muscles: ['Obliques', 'Rectus Abdominis', 'Hip Flexors'],
    met_multiplier: 5.5,
    recommended_reps: 20,
    recommended_sets: 3,
    recommended_duration_seconds: 45,
    instructions: [
      'Lie flat on your back with fingertips gently supporting behind your ears.',
      'Raise knees to 90 degrees and lift shoulder blades off the floor.',
      'Rotate right elbow toward left knee while extending your right leg straight out.',
      'Alternate sides in a smooth, pedaling cadence.'
    ],
    form_tips: [
      'Do not pull on your neck; let your torso do the rotation.',
      'Slow and controlled reps maximize muscle tension over fast jerky movements.'
    ],
    calories_per_minute_est: 7.0,
    image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80',
    sdg_alignment_note: 'Enhances rotational torque and spinal mobility.'
  },
  {
    id: 'e0000000-0000-0000-0000-000000000006',
    category_id: 'c0000000-0000-0000-0000-000000000002',
    name: 'Mountain Climbers',
    slug: 'mountain-climbers',
    description: 'Dynamic core driver delivering abdominal conditioning and cardiovascular output.',
    difficulty: 'intermediate',
    target_muscles: ['Abs', 'Hip Flexors', 'Shoulders', 'Cardiovascular System'],
    met_multiplier: 8.0,
    recommended_reps: 30,
    recommended_sets: 3,
    recommended_duration_seconds: 45,
    instructions: [
      'Begin in a push-up position with arms straight under shoulders.',
      'Drive your right knee up toward your chest without touching the floor with that foot.',
      'Quickly switch legs, extending the right back and driving the left knee forward.'
    ],
    form_tips: [
      'Keep your hips low and level with your spine.',
      'Maintain steady breathing tempo throughout the set.'
    ],
    calories_per_minute_est: 10.5,
    image_url: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=800&auto=format&fit=crop&q=80',
    sdg_alignment_note: 'Dual benefit of core strengthening and aerobic fitness.'
  },
  {
    id: 'e0000000-0000-0000-0000-000000000007',
    category_id: 'c0000000-0000-0000-0000-000000000003',
    name: 'Bodyweight Air Squats',
    slug: 'bodyweight-squats',
    description: 'Foundational lower body movement strengthening quads, hamstrings, and glutes.',
    difficulty: 'beginner',
    target_muscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Calves'],
    met_multiplier: 5.0,
    recommended_reps: 20,
    recommended_sets: 3,
    recommended_duration_seconds: 45,
    instructions: [
      'Stand tall with feet shoulder-width apart, toes pointed slightly outward.',
      'Send your hips back and down as if sitting into a deep chair.',
      'Lower until your thighs are at least parallel to the floor.',
      'Drive through the heels to stand back up to full hip extension.'
    ],
    form_tips: [
      'Keep chest proud and eyes forward.',
      'Track your knees over your toes; do not let knees cave inward.'
    ],
    calories_per_minute_est: 6.8,
    image_url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80',
    sdg_alignment_note: 'Reinforces daily functional mobility, knee, and hip longevity.'
  },
  {
    id: 'e0000000-0000-0000-0000-000000000008',
    category_id: 'c0000000-0000-0000-0000-000000000003',
    name: 'Explosive Jump Squats',
    slug: 'jump-squats',
    description: 'Plyometric power exercise maximizing fast-twitch muscle recruitment and caloric burn.',
    difficulty: 'advanced',
    target_muscles: ['Glutes', 'Quads', 'Calves', 'Cardiovascular System'],
    met_multiplier: 8.5,
    recommended_reps: 15,
    recommended_sets: 3,
    recommended_duration_seconds: 40,
    instructions: [
      'Lower into a standard quarter-to-half squat position.',
      'Explode upward off the floor using full lower body force.',
      'Land softly with bent knees to absorb impact seamlessly into the next rep.'
    ],
    form_tips: [
      'Land quietly on the balls of your feet rolling to your heels.',
      'Engage core to protect lumbar spine.'
    ],
    calories_per_minute_est: 11.5,
    image_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    sdg_alignment_note: 'Stimulates bone mineral density through weight-bearing impact.'
  },
  {
    id: 'e0000000-0000-0000-0000-000000000009',
    category_id: 'c0000000-0000-0000-0000-000000000003',
    name: 'Walking Lunges',
    slug: 'walking-lunges',
    description: 'Unilateral leg movement enhancing balance, hip mobility, and single-leg strength.',
    difficulty: 'beginner',
    target_muscles: ['Quadriceps', 'Hamstrings', 'Glutes', 'Calves'],
    met_multiplier: 5.2,
    recommended_reps: 16,
    recommended_sets: 3,
    recommended_duration_seconds: 45,
    instructions: [
      'Step forward with right leg, lowering hips until both knees bend at 90-degree angles.',
      'Ensure your front knee is directly above your ankle.',
      'Drive up through the front heel and step forward into the next lunge with the left leg.'
    ],
    form_tips: [
      'Keep torso upright throughout the step.',
      'Do not let the trailing knee slam into the floor.'
    ],
    calories_per_minute_est: 6.9,
    image_url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
    sdg_alignment_note: 'Corrects left-right muscular imbalances and protects joints.'
  },
  {
    id: 'e0000000-0000-0000-0000-000000000010',
    category_id: 'c0000000-0000-0000-0000-000000000004',
    name: 'Full Body Burpees',
    slug: 'burpees',
    description: 'The gold-standard calisthenics conditioning drill combining squat, plank, push-up, and jump.',
    difficulty: 'advanced',
    target_muscles: ['Full Body', 'Chest', 'Quads', 'Cardiovascular System'],
    met_multiplier: 9.5,
    recommended_reps: 12,
    recommended_sets: 3,
    recommended_duration_seconds: 45,
    instructions: [
      'Stand upright, drop down into a squat, and place hands on the floor.',
      'Kick feet back into a push-up position and immediately lower chest to floor.',
      'Press up, jump feet back under hips, and leap vertically with hands overhead.'
    ],
    form_tips: [
      'Pace yourself steadily to sustain high-output rounds.',
      'Step feet back instead of jumping if you need a lower-impact regression.'
    ],
    calories_per_minute_est: 13.0,
    image_url: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=800&auto=format&fit=crop&q=80',
    sdg_alignment_note: 'Rapidly triggers VO2 max improvement and metabolic efficiency.'
  },
  {
    id: 'e0000000-0000-0000-0000-000000000011',
    category_id: 'c0000000-0000-0000-0000-000000000004',
    name: 'Jumping Jacks',
    slug: 'jumping-jacks',
    description: 'Rhythmic total-body cardio warm-up stimulating lymphatic flow and heart health.',
    difficulty: 'beginner',
    target_muscles: ['Cardiovascular System', 'Calves', 'Shoulders', 'Adductors'],
    met_multiplier: 6.5,
    recommended_reps: 40,
    recommended_sets: 3,
    recommended_duration_seconds: 45,
    instructions: [
      'Stand with feet together and arms resting at your sides.',
      'Jump feet out to the sides while swinging arms overhead in an arc.',
      'Jump back to the starting stance in a continuous fluid rhythm.'
    ],
    form_tips: [
      'Stay light on the balls of your feet.',
      'Maintain soft knees upon each landing.'
    ],
    calories_per_minute_est: 8.5,
    image_url: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&auto=format&fit=crop&q=80',
    sdg_alignment_note: 'Zero-barrier aerobic exercise accessible to all age groups.'
  }
];

export const DEMO_USER_PROFILE: UserProfile = {
  id: 'demo-user-sdg3-001',
  email: 'demo.athlete@smartfitness.org',
  full_name: 'Alex Rivera',
  avatar_url: null,
  weight_kg: 68.5,
  height_cm: 176,
  fitness_level: 'intermediate',
  daily_goal_minutes: 30,
  current_streak: 5,
  last_workout_date: new Date().toISOString().split('T')[0],
  total_calories_burned: 4250,
  total_workouts: 18,
  total_active_seconds: 24300, // 405 mins
  created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
};

export const DEMO_PROGRESS_LOGS: ProgressLog[] = [
  {
    id: 'log-01',
    user_id: 'demo-user-sdg3-001',
    exercise_id: 'e0000000-0000-0000-0000-000000000010',
    exercise_name: 'Full Body Burpees',
    category_id: 'c0000000-0000-0000-0000-000000000004',
    category_name: 'Cardio & HIIT',
    duration_seconds: 900, // 15 mins
    calories_burned: 185.5,
    sets_completed: 4,
    reps_completed: 48,
    intensity_level: 'high',
    notes: 'Intense morning HIIT session. Felt great energy!',
    completed_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'log-02',
    user_id: 'demo-user-sdg3-001',
    exercise_id: 'e0000000-0000-0000-0000-000000000001',
    exercise_name: 'Standard Push-ups',
    category_id: 'c0000000-0000-0000-0000-000000000001',
    category_name: 'Upper Body',
    duration_seconds: 720, // 12 mins
    calories_burned: 95.0,
    sets_completed: 3,
    reps_completed: 45,
    intensity_level: 'medium',
    notes: 'Focused on deep chest stretch and lockout.',
    completed_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'log-03',
    user_id: 'demo-user-sdg3-001',
    exercise_id: 'e0000000-0000-0000-0000-000000000004',
    exercise_name: 'Isometric Forearm Plank',
    category_id: 'c0000000-0000-0000-0000-000000000002',
    category_name: 'Core & Abs',
    duration_seconds: 600, // 10 mins
    calories_burned: 55.0,
    sets_completed: 3,
    reps_completed: 3,
    intensity_level: 'medium',
    notes: 'Maintained rigid core throughout 60s holds.',
    completed_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'log-04',
    user_id: 'demo-user-sdg3-001',
    exercise_id: 'e0000000-0000-0000-0000-000000000007',
    exercise_name: 'Bodyweight Air Squats',
    category_id: 'c0000000-0000-0000-0000-000000000003',
    category_name: 'Lower Body',
    duration_seconds: 840, // 14 mins
    calories_burned: 110.0,
    sets_completed: 4,
    reps_completed: 80,
    intensity_level: 'medium',
    notes: 'Deep parallel squat focus.',
    completed_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'log-05',
    user_id: 'demo-user-sdg3-001',
    exercise_id: 'e0000000-0000-0000-0000-000000000011',
    exercise_name: 'Jumping Jacks',
    category_id: 'c0000000-0000-0000-0000-000000000004',
    category_name: 'Cardio & HIIT',
    duration_seconds: 600, // 10 mins
    calories_burned: 82.0,
    sets_completed: 3,
    reps_completed: 120,
    intensity_level: 'low',
    notes: 'Warm-up cardio cadence.',
    completed_at: new Date(Date.now() - 86400000 * 4).toISOString(),
  }
];
