# StrongCoach

![CI/CD Pipeline](https://github.com/sauvail/cautious-tribble/actions/workflows/ci.yml/badge.svg)

A modern web application for coaches and athletes to create, manage, and track workout programs.

## Features

### For Users
- **Google Authentication**: Secure sign-in with Google OAuth
- **Dual Roles**: Set yourself as a coach, athlete, or both
- **Coach Invitations**: Athletes can join via coach invitation links

### For Coaches
- **Athlete Management**: View and manage coached athlete profiles
- **Program Creation**: Create and edit workout programs with exercises
- **Progress Tracking**: Monitor athlete stats, programs, and calendars
- **Messaging**: Communicate with athletes about programs and events
- **Invitation System**: Generate invitation links for athletes

### For Athletes
- **Program Access**: View assigned workout programs
- **Workout Tracking**: Fill in sets, reps, and weight for each exercise
- **Stats Dashboard**: Monitor max lifts and training volume
- **Calendar**: Track program deadlines and events
- **Messaging**: Communicate with your coach

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with Google OAuth
- **Testing**: Cypress (E2E)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/sauvail/cautious-tribble.git
cd cautious-tribble
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Set up the database:

- Create a new Supabase project at [supabase.com](https://supabase.com)
- Run the SQL schema from `supabase-schema.sql` in the Supabase SQL editor
- Enable Google OAuth in Supabase Auth settings

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Testing

### E2E Tests with Cypress

```bash
# Open Cypress Test Runner
npm run cypress:open

# Run Cypress tests headlessly
npm run cypress:run
```

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── (auth)/            # Auth-related routes
│   ├── (dashboard)/       # Protected dashboard routes
│   │   ├── coach/        # Coach-specific pages
│   │   └── athlete/      # Athlete-specific pages
│   ├── api/              # API routes
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── coach/            # Coach-specific components
│   ├── athlete/          # Athlete-specific components
│   ├── common/           # Shared components
│   ├── exercises/        # Exercise-related components
│   └── messages/         # Messaging components
├── lib/                   # Utility libraries
│   ├── supabase.ts       # Supabase client (client-side)
│   └── supabase-server.ts # Supabase client (server-side)
└── types/                 # TypeScript type definitions
    └── index.ts          # Shared types
```

## Database Schema

The application uses the following main tables:

- `users` - User profiles with roles (coach/athlete/both)
- `coach_athletes` - Coach-athlete relationships
- `exercises` - Exercise library
- `programs` - Workout programs
- `workouts` - Individual workouts within programs
- `workout_exercises` - Exercises within workouts (with sets/reps/weight)
- `workout_logs` - Athlete workout session tracking
- `exercise_logs` - Individual set tracking
- `messages` - Coach-athlete messaging
- `calendar_events` - Events and deadlines
- `athlete_stats` - Performance statistics (mock data)

See `supabase-schema.sql` for the complete schema with Row-Level Security policies.

## Development Roadmap

- [x] Project setup and infrastructure
- [x] Database schema design
- [x] Authentication with Google OAuth
- [ ] User role selection and profile management
- [ ] Coach dashboard and athlete management
- [ ] Program creation and editing interface
- [ ] Athlete workout viewer and tracker
- [ ] Messaging system
- [ ] Stats and analytics dashboard
- [ ] Calendar functionality
- [ ] Mobile optimization
- [ ] Comprehensive Cypress test suite
- [ ] CI/CD with GitHub Actions

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Support

For issues and questions, please create an issue in the GitHub repository.

