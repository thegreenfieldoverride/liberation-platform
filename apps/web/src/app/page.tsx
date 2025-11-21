'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { LibIcon } from '../components/icons/LiberationIcons';

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    let ticking = false;
    let lastUpdate = 0;
    
    const handleScroll = () => {
      const now = performance.now();
      
      if (!ticking && now - lastUpdate > 32) { // Limit to ~30fps for smoother gradient transitions
        requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          lastUpdate = now;
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getBackgroundStyle = () => {
    if (!mounted) {
      return { 
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%)'
      };
    }
    
    const scrollPercentage = Math.min(scrollY / (document.documentElement.scrollHeight - window.innerHeight), 1);
    
    // Single, continuously evolving gradient from deep blue-purple to soft teal
    // Creates a soothing journey from darkness to light
    const progress = scrollPercentage;
    
    // Start: Deep blue-purple (darkness/corporate stress)
    // End: Soft teal-blue (clarity/liberation)
    
    // Primary color (top-left)
    const hue1 = 220 + (progress * 40); // 220 (deep blue) → 260 (blue-purple) → 180 (teal)
    const sat1 = 40 + (progress * 20); // Gradually increase saturation
    const light1 = 8 + (progress * 12); // Gradually lighten
    
    // Secondary color (bottom-right)  
    const hue2 = 240 + (progress * 30); // 240 (purple) → 270 (violet) → 200 (blue-green)
    const sat2 = 30 + (progress * 25); // Increase saturation
    const light2 = 12 + (progress * 18); // Increase lightness
    
    // Tertiary color for more complex gradient
    const hue3 = 200 + (progress * 50); // 200 (blue) → 250 (purple) → 160 (teal)
    const sat3 = 35 + (progress * 20);
    const light3 = 10 + (progress * 15);
    
    return {
      background: `linear-gradient(135deg, 
        hsl(${hue1}, ${sat1}%, ${light1}%) 0%, 
        hsl(${hue3}, ${sat3}%, ${light3}%) 50%,
        hsl(${hue2}, ${sat2}%, ${light2}%) 100%
      )`
    };
  };

  return (
    <div 
      className="min-h-screen smooth-bg-transition"
      style={getBackgroundStyle()}
    >
      {/* 1. The Hero Section: The Declaration */}
      <section className="min-h-screen flex items-center justify-center px-8 relative overflow-hidden pt-20">
        <div 
          className="max-w-5xl mx-auto text-left relative z-10"
          style={{
            transform: `translateY(${scrollY * 0.15}px)`
          }}
        >
          <div className="mb-8">
            <div className="text-sm font-display uppercase tracking-widest text-white/70 mb-4">
              The Greenfield Override
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
            
            <div className="text-center">
              <p className="text-white/70 font-sans text-lg mb-8">
                Ready to begin your liberation?
              </p>
              
              <Link 
                href="#sarah"
                className="bg-white/20 backdrop-blur-sm text-white px-12 py-4 text-xl font-semibold hover:bg-white/30 transition-all duration-300 rounded-xl border border-white/30 hover-lift glow-hover inline-flex items-center gap-4"
              >
                <LibIcon icon="Direction" size="md" />
                Begin Your Investigation
                <LibIcon icon="Arrow" size="sm" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. The Hook: The Story of "Sarah" */}
      <section id="sarah" className="min-h-screen px-8 py-20 relative">
        <div className="max-w-4xl mx-auto">
          <div className="mb-16">
            <h2 className="text-5xl md:text-6xl font-bold leading-tight mb-8 text-white">
              The Story of Sarah
            </h2>
            <div className="w-24 h-1 bg-white/30 mb-8"></div>
          </div>

          <div className="space-y-8 text-white/90">
            <p className="text-2xl md:text-3xl leading-relaxed text-white font-light">
              Sarah sits in her car in the company parking lot, hands gripping the steering wheel. 
              She's been doing this for ten minutes every morning, trying to summon the energy to face another day. 
              Her LinkedIn says she's "passionate about innovation." Inside, she feels like she's disappearing.
            </p>

            <p className="text-lg leading-relaxed">
              Sarah is not alone. This isn't a personal failing. It's a systemic problem. You are not lazy, ungrateful, 
              or lacking in grit. You are being ground down by design.
            </p>

            <div className="bg-white/5 border-l-4 border-white/30 pl-8 py-8 my-12">
              <h3 className="text-2xl font-bold mb-6 text-white">The Symptoms:</h3>
              <ul className="space-y-4 text-lg text-white/80">
                <li>• A creeping sense that your real self is vanishing</li>
                <li>• Projects that feel increasingly meaningless</li>
                <li>• Financial golden handcuffs that feel tighter each year</li>
                <li>• A constant, low-grade anxiety that starts long before Monday morning</li>
              </ul>
            </div>

            <div className="text-center mt-16">
              <p className="text-white/70 text-lg mb-8">
                Sound familiar? Let's dig deeper into what's really happening.
              </p>
              <Link 
                href="#diagnosis"
                className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 text-lg hover:bg-white/30 transition-all duration-300 rounded-xl border border-white/30 hover-lift inline-flex items-center gap-3"
              >
                <LibIcon icon="Direction" size="sm" />
                Understand the Three Stages
                <LibIcon icon="Arrow" size="sm" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Diagnosis: The Three Stages of Burndown */}
      <section id="diagnosis" className="min-h-screen px-8 py-20 relative">
        <div className="max-w-4xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-5xl md:text-6xl font-bold leading-tight mb-8 text-white">
              The Three Stages of Burndown
            </h2>
            <div className="w-24 h-1 bg-white/30 mb-8 mx-auto"></div>
            <p className="text-xl text-white/70 leading-relaxed max-w-3xl mx-auto">
              Here we use a simple framework to understand how the system breaks you down, 
              with each stage linking to deeper insights from our complete manifesto.
            </p>
          </div>

          <div className="space-y-16">
            {/* Stage 1 */}
            <div className="bg-gradient-to-r from-white/10 to-white/5 rounded-2xl p-8 border border-white/20">
              <h3 className="text-3xl font-bold mb-6 text-white">Stage 1: The Boiling Frog</h3>
              <p className="text-lg text-white/90 mb-6 leading-relaxed">
                It starts gradually. Longer hours, more urgent projects, higher expectations. You adapt because you're capable, 
                but each adaptation moves you further from your authentic self. You feel like you're being hunted by a predator you can't see.
              </p>
              <div className="bg-white/10 rounded-lg p-4 mb-6">
                <p className="text-white/80">
                  <strong>This is the Scarcity Mindset at work.</strong> It's your ancient survival chemistry being hijacked by the modern world.
                </p>
              </div>
              <Link 
                href="/manifesto#predator"
                className="text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-2"
              >
                Read More: "The Predator in the Tall Grass" <LibIcon icon="Arrow" size="sm" />
              </Link>
            </div>

            {/* Stage 2 */}
            <div className="bg-gradient-to-r from-white/10 to-white/5 rounded-2xl p-8 border border-white/20">
              <h3 className="text-3xl font-bold mb-6 text-white">Stage 2: The Golden Handcuffs</h3>
              <p className="text-lg text-white/90 mb-6 leading-relaxed">
                Your lifestyle inflates to match your income. The house, the car, the commitments. The system rewards you 
                for your compliance, but the price is your freedom. Now you're not just tired—you're trapped by the very success you worked for.
              </p>
              <div className="bg-white/10 rounded-lg p-4 mb-6">
                <p className="text-white/80">
                  <strong>This is the Attention Economy and the Hamster Wheel in action.</strong> Your anxiety has become a key performance 
                  indicator for some of the largest companies in the world.
                </p>
              </div>
              <Link 
                href="/manifesto#architects"
                className="text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-2"
              >
                Read More: "The Architects of Your Anxiety" <LibIcon icon="Arrow" size="sm" />
              </Link>
            </div>

            {/* Stage 3 */}
            <div className="bg-gradient-to-r from-white/10 to-white/5 rounded-2xl p-8 border border-white/20">
              <h3 className="text-3xl font-bold mb-6 text-white">Stage 3: The Existential Crisis</h3>
              <p className="text-lg text-white/90 mb-6 leading-relaxed">
                You realize you've been trading your life energy for money, but the math doesn't add up. 
                The spark that made you who you are is almost gone. You're left wondering, "Is this all there is?"
              </p>
              <div className="bg-white/10 rounded-lg p-4 mb-6">
                <p className="text-white/80">
                  <strong>This is the moment for the Conscious Override.</strong> It's the point where you recognize the system is broken, 
                  and give yourself permission to save yourself.
                </p>
              </div>
              <Link 
                href="/manifesto#override"
                className="text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-2"
              >
                Read More: "The Conscious Override" <LibIcon icon="Arrow" size="sm" />
              </Link>
            </div>
          </div>

          <div className="text-center mt-16">
            <p className="text-white/70 text-lg mb-8">
              Ready to take action? Let's start with concrete steps.
            </p>
            <Link 
              href="#toolkit"
              className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 text-lg hover:bg-white/30 transition-all duration-300 rounded-xl border border-white/30 hover-lift inline-flex items-center gap-3"
            >
              <LibIcon icon="RunwayCalculator" size="sm" />
              See Your Liberation Toolkit
              <LibIcon icon="Arrow" size="sm" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. The Toolkit: Your First Steps to Liberation */}
      <section id="toolkit" className="min-h-screen px-8 py-20 relative">
        <div className="max-w-4xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-5xl md:text-6xl font-bold leading-tight mb-8 text-white">
              Your First Steps to Liberation
            </h2>
            <div className="w-24 h-1 bg-white/30 mb-8 mx-auto"></div>
            <p className="text-xl text-white/70 leading-relaxed max-w-3xl mx-auto">
              You can't escape what you can't measure. The first step is to replace vague anxiety with concrete data. 
              We've built simple, private, client-side tools to help you do just that.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl p-8 text-center group hover:bg-white/15 transition-all duration-300">
              <LibIcon icon="RunwayCalculator" size="xl" className="mb-6 mx-auto group-hover:scale-110 transition-transform text-white" />
              <h3 className="text-2xl font-bold mb-4 text-white">The Runway Calculator</h3>
              <p className="text-white/80 mb-6 leading-relaxed">
                Find out how many months of freedom you can actually afford. Transform overwhelming financial anxiety 
                into a clear, actionable number.
              </p>
              <Link 
                href="/tools/runway-calculator"
                className="bg-blue-600/80 backdrop-blur-sm text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all duration-300 inline-flex items-center gap-3"
              >
                <LibIcon icon="RunwayCalculator" size="sm" />
                Calculate Your Runway
              </Link>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl p-8 text-center group hover:bg-white/15 transition-all duration-300">
              <LibIcon icon="WageAnalysis" size="xl" className="mb-6 mx-auto group-hover:scale-110 transition-transform text-white" />
              <h3 className="text-2xl font-bold mb-4 text-white">Real Hourly Wage Calculator</h3>
              <p className="text-white/80 mb-6 leading-relaxed">
                Discover the true cost of your job and what you're really being paid per hour of your life, 
                after accounting for hidden costs and real working time.
              </p>
              <Link 
                href="/real-hourly-wage"
                className="bg-red-600/80 backdrop-blur-sm text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-all duration-300 inline-flex items-center gap-3"
              >
                <LibIcon icon="WageAnalysis" size="sm" />
                Calculate Real Wage
              </Link>
            </div>
          </div>

          <div className="text-center">
            <Link 
              href="/tools"
              className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 text-lg hover:bg-white/30 transition-all duration-300 rounded-xl border border-white/30 hover-lift inline-flex items-center gap-3"
            >
              <LibIcon icon="Direction" size="sm" />
              Go to the Tools
              <LibIcon icon="Arrow" size="sm" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. The Mission: A Call to Action */}
      <section id="mission" className="min-h-screen px-8 py-20 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-16">
            <h2 className="text-5xl md:text-6xl font-bold leading-tight mb-8 text-white">
              Join the Override
            </h2>
            <div className="w-24 h-1 bg-white/30 mb-8 mx-auto"></div>
          </div>

          <div className="space-y-8 text-white/90 mb-16">
            <p className="text-2xl md:text-3xl leading-relaxed text-white font-light">
              Rising from the ashes is not something you have to do alone.
            </p>

            <p className="text-lg leading-relaxed max-w-3xl mx-auto">
              The Greenfield Override is a movement to build a new world—one where the builders own the pyramids. 
              We are a community of sovereign professionals, artists, and creators who are done with the old way of doing things.
            </p>

            <div className="bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl p-8 my-12 max-w-3xl mx-auto">
              <p className="text-xl font-bold text-white mb-4">
                The tools exist. The community is growing.
              </p>
              <p className="text-xl text-white">
                The only question is: are you ready to begin?
              </p>
            </div>
            
            {/* Support Section */}
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/30 rounded-2xl p-8 my-12 max-w-2xl mx-auto">
              <div className="text-center">
                <p className="text-lg text-white mb-4">
                  💜 This platform is built with love and funded by community support
                </p>
                <a
                  href="https://ko-fi.com/greenfieldoverride"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span>☕</span>
                  <span className="font-medium">Support on Ko-fi</span>
                </a>
                <p className="text-sm text-white/70 mt-3">
                  Every coffee helps keep the platform independent & ad-free
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Link 
              href="/tools"
              className="bg-white/20 backdrop-blur-sm text-white px-12 py-4 text-xl font-semibold hover:bg-white/30 transition-all duration-300 rounded-xl border border-white/30 hover-lift glow-hover inline-flex items-center gap-4"
            >
              <LibIcon icon="Direction" size="md" />
              Join the Override
              <LibIcon icon="Arrow" size="sm" />
            </Link>

            <div className="text-white/50 text-sm">
              <Link href="/manifesto" className="hover:text-white/70 transition-colors">
                Read the Complete Manifesto
              </Link>
              <span className="mx-2">•</span>
              <Link href="/about" className="hover:text-white/70 transition-colors">
                Learn About Our Mission
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}