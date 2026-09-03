# 🏋️‍♂️ Home Workout – Smart Fitness Management System
### 🌿 Supporting UN Sustainable Development Goal 3 (SDG 3: Good Health and Well-being)

A modern, full-stack fitness management web application architected with **Next.js 14 (App Router, TypeScript)**, **Tailwind CSS**, and **Supabase (PostgreSQL)**, optimized for deployment on **Vercel**.

---

## 🌟 Project Highlights

- **🛡️ SDG 3: Good Health and Well-being**: Focuses on **Target 3.4** (prevention of non-communicable diseases) by democratizing physical activity with 100% equipment-free bodyweight calisthenics.
- **⏱️ Live Interactive Workout Runner**: Integrated stopwatch, interval rest timer, Web Audio API countdown beeps/completion fanfare, and real-time MET calorie burn calculations.
- **📚 Filterable Exercise Library**: Dynamic directory categorized by **Upper Body**, **Core & Abs**, **Lower Body**, and **Cardio & HIIT** with difficulty ratings, target muscles, and step-by-step form cues.
- **📊 Visual Progress Dashboard**: Real-time habit streak tracking, weekly activity SVG bar charts, muscle group distribution, and SDG 3 eco-impact analytics (CO2 saved vs gym commute).
- **🔒 Supabase PostgreSQL + Row Level Security (RLS)**: Isolated user data storage with automated PostgreSQL triggers for calculating streaks and totals.
- **⚡ Dual Engine**: Connects directly to Supabase or runs in interactive **Demo/Guest Mode** with zero database setup required for instant testing.

---

## 🏗️ Architecture & File Structure

```
home-workout-sdg3/
├── .env.example                       # Supabase environment variables template
├── .env.local                         # Local environment variables
├── package.json                       # Dependencies & scripts
├── tsconfig.json                      # TypeScript compiler settings
├── tailwind.config.ts                 # Custom SDG 3 emerald palette & animations
├── postcss.config.mjs                 # PostCSS setup
├── next.config.mjs                    # Next.js configuration
├── supabase/
│   └── schema.sql                     # Complete PostgreSQL Schema, RLS, Triggers, and Seed Data
├── lib/
│   ├── types.ts                       # Data models (Exercise, ProgressLog, Profile, Stats)
│   ├── calculations.ts                # ACSM MET calorie formulas, BMI, and streak calculations
│   ├── sound.ts                       # Web Audio API synthesizer for countdown beeps
│   ├── mockData.ts                    # Realistic fallback datasets for equipment-free exercises
│   ├── storage.ts                     # Local storage sync & demo mode management
│   └── supabase/
│       ├── client.ts                  # Supabase browser client
│       └── server.ts                  # Supabase server client (App Router cookies)
├── app/
│   ├── globals.css                    # Tailwind, glassmorphism, glowing utilities
│   ├── layout.tsx                     # Root layout with Navbar, Footer, SEO metadata
│   ├── page.tsx                       # Landing page with SDG 3 hero & interactive MET calculator
│   ├── exercises/
│   │   └── page.tsx                   # Filterable Exercise Directory
│   ├── tracker/
│   │   └── page.tsx                   # Interactive Workout Session Tracker & Logger
│   ├── dashboard/
│   │   └── page.tsx                   # Visual Progress Dashboard & Charts
│   ├── sdg3/
│   │   └── page.tsx                   # Dedicated SDG 3 Educational & Impact Hub
│   ├── auth/
│   │   ├── login/page.tsx             # Sign In page
│   │   └── signup/page.tsx            # Sign Up page
│   └── api/
│       ├── exercises/route.ts         # GET exercises with filter & search
│       ├── categories/route.ts        # GET categories
│       ├── logs/route.ts              # GET / POST workout progress logs
│       ├── logs/[id]/route.ts         # DELETE workout log
│       ├── dashboard/stats/route.ts   # Aggregated analytics & weekly stats
│       └── seed/route.ts              # Auto-seed database endpoint
└── components/
    ├── Navbar.tsx                     # Responsive navigation with SDG 3 badge & quick launcher
    ├── Footer.tsx                     # Modern footer with SDG 3 mission statement
    ├── SDG3Banner.tsx                 # Prominent SDG 3 UI card
    ├── ExerciseCard.tsx               # Rich exercise card with difficulty and muscle pills
    ├── ExerciseDetailModal.tsx        # Modal showing step-by-step form instructions
    ├── ActiveWorkoutSession.tsx       # Live workout timer, interval beeps, and rep counter
    ├── QuickLogModal.tsx              # Quick workout entry form
    ├── StatsCard.tsx                  # Metric card with visual trend and glow
    ├── AuthForm.tsx                   # Animated auth form for login & signup
    └── Charts/
        ├── ActivityBarChart.tsx       # Custom responsive 7-day SVG activity bar chart
        └── CategoryDistribution.tsx   # Muscle / Category breakdown distribution chart
```

---

## 🗄️ Database Schema & Setup (Supabase)

### 1. Tables Overview
1. **`profiles`**: Extends `auth.users` with `weight_kg`, `height_cm`, `fitness_level`, `daily_goal_minutes`, `current_streak`, `total_calories_burned`, and `total_workouts`.
2. **`categories`**: Stores workout categories (`Upper Body`, `Core & Abs`, `Lower Body`, `Cardio & HIIT`).
3. **`exercises`**: Stores equipment-free bodyweight exercises with `target_muscles`, `met_multiplier`, `instructions`, and `form_tips`.
4. **`progress_logs`**: Stores individual completed workout sessions (`duration_seconds`, `calories_burned`, `sets_completed`, `reps_completed`, `intensity_level`).

### 2. Execute SQL Schema
1. Create a free project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** in your Supabase Dashboard.
3. Open `supabase/schema.sql` from this repository, paste the entire contents into the SQL Editor, and click **Run**.
4. The script automatically sets up:
   - All tables and foreign keys.
   - Row Level Security (RLS) policies.
   - Automated triggers for streak calculations and profile sync.
   - 12+ pre-populated bodyweight exercises.

---

## 🚀 Local Development Setup

### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/your-username/home-workout-sdg3.git
cd home-workout-sdg3

# Install dependencies
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
*(Note: If left empty, the application will automatically run in zero-config Demo Mode with full interactive features).*

### 3. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deployment to Vercel

1. Push your repository to **GitHub** or **GitLab**.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your `home-workout-sdg3` repository.
4. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase Anon Key
   - `SUPABASE_SERVICE_ROLE_KEY` = your Supabase Service Role Key
5. Click **Deploy**. Vercel will build and deploy the Next.js App Router application in under a minute!

---

## 🔬 Science-Based MET Calorie Calculation

FitPulse implements the **American College of Sports Medicine (ACSM)** Metabolic Equivalent of Task (MET) formula:

$$\text{Calories Burned} = \text{Duration (minutes)} \times \frac{\text{MET} \times 3.5 \times \text{Weight (kg)}}{200} \times \text{Intensity Multiplier}$$

- **Push-ups**: MET `5.5`
- **Pike Push-ups**: MET `6.0`
- **Diamond Push-ups**: MET `6.8`
- **Forearm Plank**: MET `4.0`
- **Bicycle Crunches**: MET `5.5`
- **Mountain Climbers**: MET `8.0`
- **Air Squats**: MET `5.0`
- **Jump Squats**: MET `8.5`
- **Burpees**: MET `9.5`
- **Jumping Jacks**: MET `6.5`

---

## 🌿 SDG 3 Impact Telemetry

- **WHO Guideline Progress**: Tracks user progress toward the 150-minute weekly moderate-to-vigorous physical activity target, reducing cardiovascular mortality risks by up to 30%.
- **Zero Carbon Footprint**: Exercising at home saves ~`0.82 kg CO2` per session compared to vehicular gym commutes.
- **Mental Well-being**: Structured calisthenics protocols release endorphins, helping combat sedentary stress and cognitive fatigue.

---

## 📄 License
MIT License. Free and open source for universal health equity.
