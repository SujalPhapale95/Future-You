import Link from 'next/link';
import { ArrowRight, ShieldCheck, Clock, Bell } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f5f0e8] text-[#0f0e0c]">
      <header className="px-6 py-6 sm:px-12">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-[#0f0e0c]" />
            <span className="font-serif text-xl font-bold tracking-tight text-[#0f0e0c]">Future-You</span>
          </div>
          <div className="flex gap-4">
            <Link
              href="/auth/login"
              className="rounded-md px-4 py-2 text-sm font-medium text-[#6b6458] hover:text-[#0f0e0c]"
            >
              Log in
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-md bg-[#0f0e0c] px-4 py-2 text-sm font-medium text-[#f5f0e8] shadow-sm hover:bg-[#2a2a2a]"
            >
              Sign up
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        <section className="px-6 py-24 sm:px-12 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="font-serif text-4xl font-bold tracking-tight text-[#0f0e0c] sm:text-6xl">
              Build Trust With Your Future Self
            </h1>
            <p className="mt-6 text-lg leading-8 text-[#6b6458]">
              Stop breaking promises to yourself. Create binding contracts with specific conditions,
              track your integrity, and become the person you say you want to be.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/auth/signup"
                className="flex items-center gap-2 rounded-md bg-[#c9443a] px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-[#b03028] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9443a]"
              >
                Start Your First Contract
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-[#f0ebe0] px-6 py-24 sm:px-12 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-12 sm:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#e6e1d6] text-[#0f0e0c]">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-xl font-bold">Smart Conditions</h3>
                <p className="mt-2 text-[#6b6458]">
                  Set specific triggers for your promises based on time, day, location, or situation.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#e6e1d6] text-[#0f0e0c]">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-xl font-bold">Track Integrity</h3>
                <p className="mt-2 text-[#6b6458]">
                  Visualize your &quot;Kept vs. Broken&quot; ratio. See your character development over time.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#e6e1d6] text-[#0f0e0c]">
                  <Bell className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-xl font-bold">Intelligent Reminders</h3>
                <p className="mt-2 text-[#6b6458]">
                  Get nudged exactly when it matters via push notifications (when available).
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#d4cfc2] px-6 py-12 text-center text-sm text-[#6b6458]">
        <p>&copy; {new Date().getFullYear()} Future-You. All rights reserved.</p>
      </footer>
    </div>
  );
}
