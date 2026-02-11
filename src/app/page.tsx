import GoogleAuthButton from '@/components/auth/GoogleAuthButton'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <main className="flex w-full max-w-md flex-col items-center gap-8 rounded-2xl bg-white p-8 shadow-xl">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            StrongCoach
          </h1>
          <p className="text-lg text-gray-600">
            Empower your training journey
          </p>
        </div>

        <div className="flex w-full flex-col gap-6">
          <div className="flex flex-col gap-4">
            <p className="text-sm text-gray-500 text-center">
              Connect with your coach or athletes to create, track, and share workout programs
            </p>
            <GoogleAuthButton />
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="mb-4 text-sm font-semibold text-gray-900">Features</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <svg className="h-5 w-5 flex-shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Create and manage workout programs</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="h-5 w-5 flex-shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Track sets, reps, and weight for each exercise</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="h-5 w-5 flex-shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Monitor athlete progress and stats</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="h-5 w-5 flex-shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Message system for coach-athlete communication</span>
              </li>
            </ul>
          </div>
        </div>
      </main>

      <footer className="mt-8 text-center text-sm text-gray-500">
        <p>Sign in to get started with StrongCoach</p>
      </footer>
    </div>
  );
}

