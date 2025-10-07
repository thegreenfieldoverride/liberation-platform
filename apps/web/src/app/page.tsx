'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate immersive background and overlay based on scroll position
  const getBackgroundStyle = () => {
    if (typeof window === 'undefined') {
      return { 
        backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backgroundColor: 'rgb(102, 126, 234)'
      };
    }
    
    const scrollPercentage = scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    
    if (scrollPercentage < 0.2) {
      // Corporate stress - dark, oppressive
      return {
        backgroundImage: `
          linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)),
          url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="%23333" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="%23111"/><rect width="100" height="100" fill="url(%23grid)"/></svg>')
        `,
        backgroundColor: '#1a1a1a'
      };
    } else if (scrollPercentage < 0.4) {
      // Recognition phase - warm, understanding
      return {
        backgroundImage: `
          linear-gradient(rgba(255, 183, 77, 0.1), rgba(255, 206, 84, 0.2)),
          radial-gradient(circle at 30% 50%, rgba(255, 183, 77, 0.3) 0%, transparent 50%)
        `,
        backgroundColor: '#2d1b0e'
      };
    } else if (scrollPercentage < 0.6) {
      // Understanding phase - soft blues
      return {
        backgroundImage: `
          linear-gradient(rgba(59, 130, 246, 0.1), rgba(147, 197, 253, 0.2)),
          radial-gradient(ellipse at 70% 30%, rgba(59, 130, 246, 0.2) 0%, transparent 70%)
        `,
        backgroundColor: '#0f172a'
      };
    } else if (scrollPercentage < 0.8) {
      // Tools phase - calming greens
      return {
        backgroundImage: `
          linear-gradient(rgba(16, 185, 129, 0.1), rgba(52, 211, 153, 0.2)),
          radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.3) 0%, transparent 60%)
        `,
        backgroundColor: '#064e3b'
      };
    } else {
      // Liberation phase - serene sanctuary
      return {
        backgroundImage: `
          linear-gradient(rgba(134, 239, 172, 0.2), rgba(187, 247, 208, 0.3)),
          radial-gradient(ellipse at 50% 50%, rgba(134, 239, 172, 0.4) 0%, transparent 80%)
        `,
        backgroundColor: '#052e16'
      };
    }
  };

  return (
    <div 
      className="min-h-screen transition-all duration-2000 ease-out"
      style={getBackgroundStyle()}
    >
      {/* Hero Section - Magazine Takeover Style */}
      <section className="min-h-screen flex items-center justify-center px-8 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-left relative z-10">
          <div className="mb-8">
            <div className="text-sm font-display uppercase tracking-widest text-white/70 mb-4">
              The Greenfield Override • Special Investigation
            </div>
            <div className="w-16 h-1 bg-white/30 mb-8"></div>
          </div>
          
          <h1 className="text-7xl md:text-9xl font-sans font-bold text-white mb-16 leading-[0.9] tracking-tight">
            You're not burned out.
            <br />
            <span className="text-white/60">You're being burned down.</span>
          </h1>
          
          <h2 className="text-4xl md:text-5xl font-sans font-light text-white/90 mb-20 max-w-4xl leading-tight">
            Here's how to rise from the ashes.
          </h2>
          
          <div className="max-w-4xl">
            <p className="text-2xl md:text-3xl font-sans text-white/90 leading-relaxed mb-20 font-light">
              The fluorescent lights hum above your head. The urgent emails pile up. 
              Each project blends into the next, and the phrase "work-life balance" feels like a cruel joke. 
              But you sense something deeper is wrong—there's a spark inside you that's barely hanging on, 
              a sense of purpose that's getting buried by endless corporate fires.
            </p>
            
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 mb-16">
              <p className="text-xl font-sans text-white leading-relaxed mb-6">
                You are not alone. This isn't laziness, or lack of grit. 
                This is a system that's draining you.
              </p>
              <p className="text-2xl font-sans font-medium text-white">
                <strong>You are being burned down.</strong>
              </p>
            </div>
            
            <div className="space-y-6">
              <p className="text-white/70 font-sans text-lg mb-8">Ready to begin your investigation?</p>
              <p className="text-white/50 text-sm mb-12 font-sans uppercase tracking-wide">Move forward at your own pace.</p>
              
              <div className="flex flex-col sm:flex-row gap-6 max-w-xl">
                <Link 
                  href="#manifesto"
                  className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 text-lg font-sans hover:bg-white/30 transition-all duration-300 rounded-xl border border-white/30"
                >
                  Read the Investigation
                </Link>
                <Link 
                  href="/tools/runway-calculator"
                  className="border border-white/40 text-white px-8 py-4 text-lg font-sans hover:bg-white/10 transition-all duration-300 rounded-xl backdrop-blur-sm"
                >
                  Skip to Tools
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Part 1, Section 1: The Predator in the Tall Grass */}
      <section className="min-h-screen flex items-center justify-center px-6 py-24" id="manifesto">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-16 text-left font-sans">
            Section 1: The Predator in the Tall Grass
          </h2>
          
          <div className="text-left space-y-8 font-serif">
            <p className="text-xl text-white/90 leading-relaxed">
              It starts with the feeling that you're going crazy.
            </p>
            
            <p className="text-lg text-white/80 leading-relaxed">
              On paper, your life is a success. You have the job you worked for, the one that's supposed to be the culmination of your ambition. If you're one of the lucky ones who got into a big company—the kind whose name on a resume opens doors—the feeling might be even worse. Because this is what you wanted, yet you can feel yourself cracking from the inside.
            </p>
            
            <p className="text-lg text-white/80 leading-relaxed">
              You're stressed all the time. You go home and you can't think, can't function. You're a zombie until you decompress. Or you're one of those who never puts work down, driven by a relentless pressure to just work, and work, and work.
            </p>
            
            <p className="text-lg text-white/80 leading-relaxed">
              Your rational mind tells you everything is fine. Your body, however, is screaming that you're in constant danger. To understand this conflict, let's reframe the situation.
            </p>
            
            <p className="text-lg text-white/80 leading-relaxed">
              Imagine you're a wildebeest. Your life has a simple, natural rhythm: eat, find water, procreate, socialize. But there's always the threat of something lingering behind the thicket of grass, a predator lurking in the shadows. Your body is wired with the same ancient alarm system.
            </p>
            
            <p className="text-lg text-white/90 leading-relaxed font-medium">
              Here is the fundamental truth of our modern work life: <strong>That threat is real. It's just not going to eat you outright anymore.</strong>
            </p>
            
            <p className="text-lg text-white/80 leading-relaxed">
              The predator isn't a lion; it's the possibility of a layoff, a bad performance review, an angry email from a VP, or just the silent dread of not being productive enough. Your nervous system, however, doesn't know the difference. The same alarms that were designed to save you from a tiger are now firing all day long in response to your inbox.
            </p>
            
            <p className="text-lg text-white/80 leading-relaxed">
              So what is this modern predator? It's the constant, gnawing fear of loss.
            </p>
            
            <p className="text-lg text-white/80 leading-relaxed">
              At a practical level, it's the fear of losing your job, your money, and the comfort you've built for yourself. But it runs deeper, into the core of your identity. It's the fear of losing the security that comes when people think you've succeeded. That parent who never said they were proud of you? They are now. That kid who bullied you in middle school? Your success is the ultimate rebuttal.
            </p>
            
            <p className="text-lg text-white/80 leading-relaxed">
              The Scarcity Mindset whispers two constant lies in your ear: that you always need more to be truly secure, and that at any moment, the things you have can be taken away.
            </p>
            
            <p className="text-lg text-white/90 leading-relaxed">
              This feeling—the ancient alarm system firing in response to a modern, relentless fear of loss—is the very definition of the Scarcity Mindset. It is the invisible cage we have been trained to live in.
            </p>
          </div>
        </div>
      </section>

      {/* Part 1, Section 2: Your Brain's Panic Button */}
      <section className="min-h-screen flex items-center justify-center px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-16 text-left font-sans">
            Section 2: Your Brain's Panic Button
          </h2>
          
          <div className="text-left space-y-8 font-serif">
            <p className="text-xl text-white/90 leading-relaxed">
              To understand why a looming deadline can feel like a tiger in the bushes, you need to meet your brain's ancient security guard: the <strong>amygdala</strong>.
            </p>
            
            <p className="text-lg text-white/80 leading-relaxed">
              The amygdala is not the smart, rational part of your brain. It's the primitive, lightning-fast panic button. Its only job is to constantly scan your environment for threats, and when it senses one, it slams the alarm. This isn't a suggestion; it's a takeover. The amygdala hijacks the controls from your slower, more logical brain (the prefrontal cortex) and triggers a purely instinctual, physical response to keep you alive.
            </p>
            
            <p className="text-lg text-white/90 leading-relaxed">
              This "amygdala hijack" is the source of that overwhelming feeling when everything at work feels like an emergency, even when logically you know it's not.
            </p>
            
            <div className="bg-white/10 backdrop-blur-sm border-l-4 border-orange-400/60 p-6 my-8 rounded-r-lg">
              <p className="text-lg text-orange-200 leading-relaxed italic">
                Your ancient brain doesn't understand the difference between a saber-toothed tiger and a passive-aggressive email from your manager. Both trigger the exact same survival response.
              </p>
            </div>
            
            <p className="text-lg text-white/80 leading-relaxed">
              When this system is chronically activated—which is the reality for most knowledge workers—your body stays in a constant state of fight-or-flight. Your cortisol levels remain elevated. Your immune system becomes suppressed. Your ability to think clearly, be creative, or form deep relationships deteriorates.
            </p>
            
            <p className="text-lg text-white/80 leading-relaxed">
              This is not a character flaw. This is not weakness. This is your nervous system doing exactly what it was designed to do, in an environment it was never designed for.
            </p>
            
            <p className="text-lg text-white/80 leading-relaxed">
              But understanding this mechanism is the first step toward reclaiming control. When you can recognize the amygdala hijack for what it is—an ancient system misfiring in a modern context—you can begin to respond rather than react.
            </p>
            
            <p className="text-lg text-white/90 leading-relaxed font-medium">
              The goal isn't to eliminate stress entirely. It's to distinguish between real threats and the phantom predators that corporate life trains you to fear.
            </p>
          </div>
        </div>
      </section>

      {/* Transition to Action */}
      <section className="min-h-screen flex items-center justify-center px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-16 text-left font-sans">
            Breaking Free from the Cage
          </h2>
          
          <div className="text-left space-y-8 font-serif">
            <p className="text-xl text-white/90 leading-relaxed">
              Now that you understand what's happening to you—that you're not broken, that this is a predictable response to an unnatural environment—the question becomes: what do you do about it?
            </p>
            
            <p className="text-lg text-white/80 leading-relaxed">
              The first step is data. You cannot escape what you cannot see clearly. The tools below are designed to replace your vague anxiety with hard, undeniable numbers about your situation.
            </p>
            
            <p className="text-lg text-white/80 leading-relaxed">
              This is not about optimizing your way back into the hamster wheel. This is about gathering the intelligence you need to build your escape route.
            </p>
            
            <div className="bg-white/10 backdrop-blur-sm border-l-4 border-green-400/60 p-6 my-8 rounded-r-lg">
              <p className="text-lg text-green-200 leading-relaxed">
                <strong>Remember:</strong> Your data is yours. These tools work entirely in your browser. We don't store, track, or share anything. This is your sanctuary.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section - Clean Integration */}
      <section className="py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 text-left font-sans">
              Begin Your Liberation
            </h2>
            <p className="text-xl text-white/80 max-w-3xl leading-relaxed font-serif">
              Replace your vague anxiety with hard data. These diagnostic tools will show you exactly where you stand, 
              so you can begin planning your path to freedom.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
            {/* Runway Calculator */}
            <div className="text-center group">
              <div className="p-10 border border-white/20 hover:border-white/40 transition-all duration-300 rounded-3xl hover:shadow-xl bg-white/5 backdrop-blur-sm">
                <div className="text-4xl mb-6">🛣️</div>
                <h3 className="text-xl font-light text-white mb-4 font-sans">Runway Calculator</h3>
                <p className="text-white/80 mb-6 leading-relaxed text-base font-serif">
                  Transform anxiety into clarity: exactly how long your savings will sustain you.
                </p>
                <Link 
                  href="/tools/runway-calculator"
                  className="inline-block bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-light hover:bg-white/30 transition-all duration-300 border border-white/30 font-sans text-sm"
                >
                  Calculate →
                </Link>
              </div>
            </div>

            {/* Real Hourly Wage */}
            <div className="text-center group">
              <div className="p-10 border border-white/20 hover:border-white/40 transition-all duration-300 rounded-3xl hover:shadow-xl bg-white/5 backdrop-blur-sm">
                <div className="text-4xl mb-6">💊</div>
                <h3 className="text-xl font-light text-white mb-4 font-sans">Real Hourly Wage</h3>
                <p className="text-white/80 mb-6 leading-relaxed text-base font-serif">
                  Expose the hidden costs: what you're actually paid per hour of your life.
                </p>
                <Link 
                  href="/real-hourly-wage"
                  className="inline-block border border-white/40 text-white px-6 py-3 rounded-xl font-light hover:bg-white/10 transition-all duration-300 backdrop-blur-sm font-sans text-sm"
                >
                  Discover →
                </Link>
              </div>
            </div>

            {/* Cognitive Debt Assessment */}
            <div className="text-center group md:col-span-2 lg:col-span-1">
              <div className="p-10 border border-white/20 hover:border-white/40 transition-all duration-300 rounded-3xl hover:shadow-xl bg-white/5 backdrop-blur-sm">
                <div className="text-4xl mb-6">🧠</div>
                <h3 className="text-xl font-light text-white mb-4 font-sans">Cognitive Debt Assessment</h3>
                <p className="text-white/80 mb-6 leading-relaxed text-base font-serif">
                  Measure the hidden mental costs of corporate burnout on your mind and soul.
                </p>
                <Link 
                  href="/cognitive-debt-assessment"
                  className="inline-block bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-light hover:bg-white/30 transition-all duration-300 border border-white/30 font-sans text-sm"
                >
                  Assess →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Sanctuary */}
      <section className="py-32">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-left font-sans">
            Welcome to the Sanctuary
          </h2>
          <p className="text-xl text-white/80 mb-16 leading-relaxed font-serif">
            You've taken the first step. The path ahead is yours to walk, 
            at your own pace, with tools that respect your privacy and dignity.
          </p>
          <Link 
            href="/tools"
            className="bg-white/20 backdrop-blur-sm text-white px-12 py-5 text-lg font-light hover:bg-white/30 transition-all duration-300 rounded-2xl shadow-sm hover:shadow-md border border-white/30 font-sans"
          >
            Begin Your Journey
          </Link>
        </div>
      </section>
    </div>
  );
}