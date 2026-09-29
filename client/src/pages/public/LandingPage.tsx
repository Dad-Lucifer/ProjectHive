import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { ArrowRight, ChevronRight } from 'lucide-react';

const steps = [
  { label: 'Discover', desc: 'Find projects that match your skills and goals.' },
  { label: 'Request', desc: 'Send a join request explaining your motivation.' },
  { label: 'Contribute', desc: 'Complete owner-assigned tasks to earn XP.' },
  { label: 'Level Up', desc: 'Unlock new capabilities as your record grows.' },
  { label: 'Lead', desc: 'Reach Level 5 and start your own project.' },
];

const howItems = [
  { title: 'Discover', body: 'Browse open projects filtered by category, skill, and difficulty. Our matching algorithm scores your compatibility before you even apply.' },
  { title: 'Request to Join', body: 'Write a short message to the project owner. They see your profile, level, XP, and match score — and decide who fits their team.' },
  { title: 'Owner Decides', body: 'Owners accept or reject requests with a reason. Accepted members join the team and receive task assignments immediately.' },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-paper">
      {/* Nav */}
      <nav className="border-b border-line px-6 md:px-12 h-14 flex items-center justify-between">
        <span className="font-display text-lg font-semibold text-ink">ProjectHive</span>
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" size="sm">Log In</Button>
          </Link>
          <Link to="/register">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 md:px-12 py-20 md:py-28 max-w-4xl">
        <h1 className="font-display text-[40px] md:text-[56px] font-medium text-ink leading-[1.1] mb-6">
          A ledger of real academic work, not a feed of side projects.
        </h1>
        <p className="text-base text-slate max-w-[42rem] mb-10">
          ProjectHive connects students through verified contribution. Join projects, complete tasks that owners approve, and build a record of honest, earned progress.
        </p>

        {/* Progression strip */}
        <div className="flex items-center gap-0 mb-10 overflow-x-auto">
          {steps.map((step, i) => (
            <div key={step.label} className="flex items-center">
              <div className="flex flex-col items-start min-w-[120px] pr-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-[3px] h-4 bg-signal flex-shrink-0" />
                  <span className="text-xs font-medium text-signal uppercase tracking-wide">{step.label}</span>
                </div>
                <p className="text-xs text-slate">{step.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <ChevronRight size={16} className="text-line flex-shrink-0 mr-3" />
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link to="/register">
            <Button size="lg" icon={<ArrowRight size={16} />}>Get Started</Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="secondary">Log In</Button>
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 md:px-12 py-16 border-t border-line">
        <h2 className="font-display text-2xl font-medium text-ink mb-8">How project joining works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {howItems.map((item) => (
            <div key={item.title} className="flex flex-col gap-2">
              <div className="w-full h-[1px] bg-line mb-2" />
              <h3 className="font-display text-lg font-medium text-ink">{item.title}</h3>
              <p className="text-sm text-slate">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why contribution */}
      <section className="px-6 md:px-12 py-16 border-t border-line bg-ink">
        <div className="max-w-2xl">
          <h2 className="font-display text-2xl font-medium text-paper mb-4">Why contribution matters</h2>
          <p className="text-sm text-white/60 mb-4">
            XP is earned exclusively from verified, owner-approved work — not from self-reporting or participation alone. When an owner marks your task complete, the system records it.
          </p>
          <p className="text-sm text-white/60">
            This makes your ProjectHive record a truthful reflection of what you've actually built and who you've worked with, not a list of projects you were nominally attached to.
          </p>
        </div>
      </section>

      {/* Becoming an owner */}
      <section className="px-6 md:px-12 py-16 border-t border-line">
        <div className="max-w-2xl">
          <h2 className="font-display text-2xl font-medium text-ink mb-4">Becoming a Project Owner</h2>
          <p className="text-sm text-slate mb-4">
            The <span className="text-signal font-medium">Project Owner</span> capability unlocks at Level 5 — earned by completing verified tasks in other people's projects first. Owners then receive a project creation credit each time they reach another milestone.
          </p>
          <p className="text-sm text-slate">
            There's one catch by design: even as an owner, you must keep contributing to at least one other project. Leadership doesn't exempt you from the work that makes ProjectHive useful.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-12 py-8 border-t border-line flex items-center justify-between flex-wrap gap-3">
        <span className="font-display text-sm text-slate">ProjectHive</span>
        <p className="text-xs text-slate">Academic progression, verified.</p>
        <Link
          to="/architecture"
          className="text-xs text-slate hover:text-ink underline underline-offset-2 transition-colors"
        >
          How it's built →
        </Link>
      </footer>
    </div>
  );
}
