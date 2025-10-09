import Link from 'next/link';
import { LibIcon } from '../../components/icons/LiberationIcons';

export default function ManifestoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-4xl mx-auto px-8 py-20 pt-32">
        
        {/* Header */}
        <header className="mb-16 text-center border-b border-white/20 pb-8">
          <div className="text-sm font-display uppercase tracking-widest text-white/50 mb-4">
            The Complete Document
          </div>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-8 text-white">
            The Greenfield Override
          </h1>
          <div className="text-xl text-white/70 leading-relaxed mb-8">
            A complete framework for liberation from the corporate hamster wheel
          </div>
          <div className="flex justify-center items-center text-sm text-white/50 gap-4 mb-8">
            <span>Complete Manifesto</span>
            <span>•</span>
            <span>~30 min read</span>
            <span>•</span>
            <Link href="/tools" className="text-blue-400 hover:text-blue-300 transition-colors">
              Skip to Tools →
            </Link>
          </div>

          {/* Table of Contents */}
          <div className="bg-white/5 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-white mb-4">Table of Contents</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-white/90 mb-2">Part 1: The Diagnosis</h4>
                <ul className="space-y-1 text-white/70">
                  <li><a href="#predator" className="hover:text-white transition-colors">The Predator in the Tall Grass</a></li>
                  <li><a href="#panic-button" className="hover:text-white transition-colors">Your Brain's Panic Button</a></li>
                  <li><a href="#architects" className="hover:text-white transition-colors">The Architects of Your Anxiety</a></li>
                  <li><a href="#hamster-wheel" className="hover:text-white transition-colors">The Hamster Wheel</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-white/90 mb-2">Part 2: The Disengagement</h4>
                <ul className="space-y-1 text-white/70">
                  <li><a href="#override" className="hover:text-white transition-colors">The Conscious Override</a></li>
                  <li><a href="#attention" className="hover:text-white transition-colors">Reclaiming Your Attention</a></li>
                  <li><a href="#financial" className="hover:text-white transition-colors">Financial Decoupling</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-white/90 mb-2">Part 3: The Reconstruction</h4>
                <ul className="space-y-1 text-white/70">
                  <li><a href="#abundance" className="hover:text-white transition-colors">The Abundance Mindset</a></li>
                  <li><a href="#leverage" className="hover:text-white transition-colors">The New Leverage</a></li>
                  <li><a href="#ai-liberation" className="hover:text-white transition-colors">AI as Engine of Liberation</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-white/90 mb-2">Part 4: The Mission</h4>
                <ul className="space-y-1 text-white/70">
                  <li><a href="#universal" className="hover:text-white transition-colors">Universal Emancipation</a></li>
                  <li><a href="#ai-ethics" className="hover:text-white transition-colors">Ethical AI Framework</a></li>
                  <li><a href="#partnership" className="hover:text-white transition-colors">A Final Word</a></li>
                </ul>
              </div>
            </div>
          </div>
        </header>

        <article className="prose prose-lg prose-invert max-w-none space-y-12">
          
          {/* Part 1: The Diagnosis */}
          <section>
            <h1 id="diagnosis" className="text-5xl font-bold text-white mb-12">Part 1: The Diagnosis</h1>
            
            <h2 id="predator" className="text-4xl font-bold text-white mb-8">Section 1: The Predator in the Tall Grass</h2>
            
            <p className="text-2xl leading-relaxed text-white font-light mb-8">
              It starts with the feeling that you're going crazy.
            </p>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              On paper, your life is a success. You have the job you worked for, the one that's supposed to be the culmination of your ambition. If you're one of the lucky ones who got into a big company—the kind whose name on a resume opens doors—the feeling might be even worse. Because this is what you wanted, yet you can feel yourself cracking from the inside.
            </p>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              You're stressed all the time. You go home and you can't think, can't function. You're a zombie until you decompress. Or you're one of those who never puts work down, driven by a relentless pressure to just work, and work, and work.
            </p>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              Your rational mind tells you everything is fine. Your body, however, is screaming that you're in constant danger. To understand this conflict, let's reframe the situation.
            </p>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              Imagine you're a wildebeest. Your life has a simple, natural rhythm: eat, find water, procreate, socialize. But there's always the threat of something lingering behind the thicket of grass, a predator lurking in the shadows. Your body is wired with the same ancient alarm system.
            </p>

            <div className="bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl p-8 my-12">
              <p className="text-2xl font-bold text-white">
                Here is the fundamental truth of our modern work life: <strong>That threat is real. It's just not going to eat you outright anymore.</strong>
              </p>
            </div>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              The predator isn't a lion; it's the possibility of a layoff, a bad performance review, an angry email from a VP, or just the silent dread of not being productive enough. Your nervous system, however, doesn't know the difference. The same alarms that were designed to save you from a tiger are now firing all day long in response to your inbox.
            </p>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              So what is this modern predator? It's the constant, gnawing fear of loss.
            </p>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              At a practical level, it's the fear of losing your job, your money, and the comfort you've built for yourself. But it runs deeper, into the core of your identity. It's the fear of losing the security that comes when people think you've succeeded. That parent who never said they were proud of you? They are now. That kid who bullied you in middle school? Your success is the ultimate rebuttal.
            </p>

            <div className="bg-white/5 border-l-4 border-white/30 pl-8 py-6 my-12">
              <p className="text-xl text-white/90">
                The Scarcity Mindset whispers two constant lies in your ear: that you always need more to be truly secure, and that at any moment, the things you have can be taken away.
              </p>
            </div>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              This feeling—the ancient alarm system firing in response to a modern, relentless fear of loss—is the very definition of the Scarcity Mindset. It is the invisible cage we have been trained to live in.
            </p>

            <h2 id="panic-button" className="text-4xl font-bold text-white mb-8 mt-16">Section 2: Your Brain's Panic Button</h2>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              To understand why a looming deadline can feel like a tiger in the bushes, you need to meet your brain's ancient security guard: the <strong>amygdala</strong>.
            </p>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              The amygdala is not the smart, rational part of your brain. It's the primitive, lightning-fast panic button. Its only job is to constantly scan your environment for threats, and when it senses one, it slams the alarm. This isn't a suggestion; it's a takeover. The amygdala hijacks the controls from your slower, more logical brain (the prefrontal cortex) and triggers a purely instinctual, physical response to keep you alive.
            </p>

            <div className="bg-gradient-to-r from-white/10 to-white/5 rounded-2xl p-8 my-12 border border-white/20">
              <h3 className="text-2xl font-bold mb-6 text-white">This "amygdala hijack" triggers four survival strategies:</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-semibold mb-3 text-white/90">• Fight</h4>
                  <p className="text-white/80">
                    Confront the threat head-on. In the office, this isn't a physical brawl; it's lashing out in an email, getting defensive in a meeting, or becoming aggressive and territorial about a project.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-xl font-semibold mb-3 text-white/90">• Flight</h4>
                  <p className="text-white/80">
                    Run from the danger. This is avoiding a difficult conversation, calling in sick on the day of a big presentation, or simply quitting a job without a plan.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-xl font-semibold mb-3 text-white/90">• Freeze</h4>
                  <p className="text-white/80">
                    Go completely still, hoping the threat passes you by. This manifests as procrastination, an inability to make a decision, or staring at a blank screen, totally unable to work.
                  </p>
                </div>

                <div>
                  <h4 className="text-xl font-semibold mb-3 text-white/90">• Fawn</h4>
                  <p className="text-white/80">
                    Appease the threat to neutralize it. This is the people-pleasing response: over-apologizing, taking on work you can't handle to avoid conflict, or immediately saying "yes" to an unreasonable request.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              When your amygdala pulls this fire alarm, it triggers a massive chemical cascade designed to give your body the fuel to survive. Two hormones flood your system: <strong>Adrenaline</strong> (the immediate energy boost that increases your heart rate and sharpens your focus) and <strong>Cortisol</strong> (the "stress hormone" that floods your body with glucose for quick energy while suppressing non-essential functions like digestion and your immune system).
            </p>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              This whole process is managed by your body's two competing internal systems. The <strong>Sympathetic Nervous System</strong> is the gas pedal—it's what the amygdala slams down to get you into fight-or-flight mode. Its opposite is the <strong>Parasympathetic Nervous System</strong>, the brake pedal, which is designed to calm everything down afterward, allowing you to "rest and digest."
            </p>

            <div className="bg-white/5 border-l-4 border-red-400/50 pl-8 py-6 my-12">
              <p className="text-xl font-bold text-white mb-4">
                Here is the critical problem: that system was designed for short, intense threats. You see the tiger, you run, and then you rest. But in our modern world, the "threats" never stop coming.
              </p>
            </div>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              Your amygdala keeps the panic button pressed down all day long. Your body is continuously flooded with adrenaline and cortisol, and the "rest and digest" system never gets a chance to fully engage. This constant cortisol dump plays havoc with your metabolism. Your body, always thinking it needs to fuel a desperate escape, is perpetually awash in sugar. This can lead directly down a grim medical roadmap: your cells become resistant to insulin, paving the way for prediabetes and eventually Type 2 diabetes.
            </p>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              To make matters worse, we develop our own over-aggressive strategies to deal with this overload. Your body is screaming for energy, so you answer with a constant barrage of caffeine, sugary snacks, and simple carbs. This only adds fuel to the fire, creating a vicious cycle of sugar spikes and crashes that leaves you feeling even more exhausted and wired.
            </p>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              Even our attempts to heal become part of the cycle. For some, the dopamine rush from intense workouts becomes its own addiction, another way to manage the stress. But even for those with a healthy relationship to fitness, the sheer, unrelenting effort required to stay healthy—the meal prepping, the gym schedules, the constant tracking—is the real symptom. It becomes a second shift we work just to undo the damage of the first.
            </p>

            <div className="bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl p-8 my-12">
              <p className="text-xl font-bold text-white">
                You don't just <em>feel</em> like you're cracking from the inside. Your own survival chemistry, stuck in a permanent state of emergency, is actively breaking you down, and you are forced to spend what little free time you have just to manage the decay.
              </p>
            </div>

            <h2 id="architects" className="text-4xl font-bold text-white mb-8 mt-16">Section 3: The Architects of Your Anxiety</h2>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              The constant state of alert you live in is not a coincidence. It is the result of a deliberate and fantastically profitable business model: <strong>The Attention Economy</strong>.
            </p>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              The core principle is simple: your attention is one of the most valuable and finite resources in the world. Every second you spend looking at a screen is a second that can be sold to the highest bidder. In this economy, if you are not paying for the product, you <em>are</em> the product. Your eyeballs are the commodity.
            </p>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              And the architects of this economy have learned that the most effective way to capture and hold your attention is to bypass your rational mind entirely and aim directly for your brain's ancient panic button. This isn't a guess; it's a science. Companies employ armies of neuroscientists, data analysts, and behavioral psychologists to perfect the art of the "amygdala hijack." They know, based on billions of data points, that an anxious, outraged, or insecure brain is a highly engaged brain.
            </p>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              This war for your attention is being fought on two main fronts:
            </p>

            <div className="space-y-8 my-12">
              <div className="bg-gradient-to-r from-white/10 to-white/5 rounded-2xl p-8 border border-white/20">
                <h4 className="text-xl font-bold text-white mb-4">1. Social Media: The Engine of Addiction and Outrage</h4>
                <p className="text-white/90 mb-4">
                  The goal of these platforms is to create a behavioral addiction. Former executives from these companies have openly admitted that their objective from the beginning was to exploit "a vulnerability in human psychology." Every feature is meticulously engineered to create a dopamine-driven feedback loop. The "like" button, the infinite scroll, the intermittent rewards of notifications—they are the digital equivalent of a slot machine, designed to keep you pulling the lever.
                </p>
                <p className="text-white/90">
                  Furthermore, their algorithms have learned a dangerous truth: outrage is the most powerful catalyst for engagement. They don't show you what's true or what's important; they show you what will make you angry. An angry user is a user who comments, shares, and stays on the platform, feeding the machine.
                </p>
              </div>

              <div className="bg-gradient-to-r from-white/10 to-white/5 rounded-2xl p-8 border border-white/20">
                <h4 className="text-xl font-bold text-white mb-4">2. Advertising & Consumerism: The Engine of Inadequacy</h4>
                <p className="text-white/90 mb-4">
                  The second front is the business of manufacturing discontent. The purpose of modern advertising is not to inform you about a product; it's to make you feel a sense of lack, a deep and persistent feeling that your life is inadequate without it.
                </p>
                <p className="text-white/90">
                  This is a calculated psychological operation. Advertisers target your deepest insecurities—your fear of being unloved, unsuccessful, or socially irrelevant—and then present their product as the cure. They create the anxiety and then, for a price, they offer you the temporary relief.
                </p>
              </div>
            </div>

            <div className="bg-white/5 border-l-4 border-white/30 pl-8 py-6 my-12">
              <p className="text-xl font-bold text-white">
                You are not imagining that the world is being designed to make you feel anxious and overwhelmed. It is. Your anxiety is a key performance indicator for some of the largest companies in human history. They know this. And now, so do you.
              </p>
            </div>

            <h2 id="hamster-wheel" className="text-4xl font-bold text-white mb-8 mt-16">Section 4: The Hamster Wheel</h2>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              So here we are. We are running on ancient, fear-based survival software (The Scarcity Mindset). Our bodies are being constantly hijacked by our own biology (The Amygdala Hijack). And we are surrounded by a massive, deliberate system designed to keep us that way (The Attention Economy).
            </p>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              Nowhere do these three forces combine more destructively than in the modern workplace. This is the <strong>Hamster Wheel</strong>.
            </p>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              Think of the modern corporation as the grandest pyramid-building project in human history. Its purpose is to create something immense and monumental for a single pharaoh—the CEO, the shareholders, the abstract goal of "growth." We are the laborers, sacrificing our time, our health, and our one precious life to build it.
            </p>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              The primary tool of control in this system is the "downward whipping cycle." Pressure is applied from the top, and it cascades down through the hierarchy. The VP is whipped by the C-suite, the Director is whipped by the VP, the Manager is whipped by the Director, and so on, until it lands on the individual contributor.
            </p>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              This creates a critical and tragic dilemma for every person in a position of leadership, from the frontline manager to the senior executive. This is <strong>"The Supervisor's Dilemma."</strong>
            </p>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              When the whip cracks, every supervisor has a choice:
            </p>

            <div className="space-y-6 my-8">
              <div className="bg-white/5 border-l-4 border-green-400/50 pl-8 py-6">
                <h4 className="text-lg font-bold text-white mb-3">• Absorb the blow</h4>
                <p className="text-white/90">
                  They can choose to shield their team, to push back against unreasonable demands, and to create a pocket of psychological safety. This is an act of courage. It is also exhausting and politically risky.
                </p>
              </div>

              <div className="bg-white/5 border-l-4 border-red-400/50 pl-8 py-6">
                <h4 className="text-lg font-bold text-white mb-3">• Pass the whip</h4>
                <p className="text-white/90">
                  Or, to protect themselves, they can turn and whip their own reports, often harder, to compensate for the pressure they are under.
                </p>
              </div>
            </div>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              This is how good people become complicit in a broken system. Even a manager you like, one who cares about you, can fail to protect you. They become a cog in the machine, perpetuating the cycle of anxiety and burnout. They are both a victim of the system and, through their inaction or compliance, one of its agents.
            </p>

            <div className="bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl p-8 my-12">
              <p className="text-xl font-bold text-white">
                This is the genius of the Hamster Wheel. It doesn't require evil people to function, only tired, scared ones. It co-opts our own survival instincts to make us willing participants in our own exhaustion. We run, and run, and run, not because we are building something meaningful for ourselves, but because the modern predator is always nipping at our heels.
              </p>
            </div>
          </section>

          {/* Part 2: The Disengagement */}
          <section className="mt-20">
            <h1 id="disengagement" className="text-5xl font-bold text-white mb-12">Part 2: The Disengagement</h1>
            
            <h2 id="override" className="text-4xl font-bold text-white mb-8">Section 1: The Conscious Override</h2>
            
            <p className="text-2xl leading-relaxed text-white font-light mb-8">
              Let's be clear: this is the hardest part.
            </p>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              Shifting your mindset is not a simple choice. It is a rebellion against a lifetime of conditioning. For many, it only comes after reaching what you thought was the pinnacle, only to find yourself in a free fall. It doesn't have to be a dramatic "nervous breakdown." More often, it's quieter and more terrifying: a cascade of trauma triggers, a moment where the downward whipping cycle finds your most sensitive wound—your imposter syndrome, your fear of failure, your need to be perfect—and punches it. Hard.
            </p>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              You are left shaken, wondering how the system you gave everything to could be so casually cruel.
            </p>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              Making the <strong>Conscious Override</strong> is not a single decision. It is a series of deliberate, difficult recognitions. It is the process of your rational, modern brain finally wrestling control back from that ancient panic switch.
            </p>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              It happens in four stages:
            </p>

            <div className="space-y-8 my-12">
              <div className="bg-gradient-to-r from-white/10 to-white/5 rounded-2xl p-8 border border-white/20">
                <h4 className="text-xl font-bold text-white mb-4">1. You Recognize the Situation for What It Is</h4>
                <p className="text-white/90">
                  You see past the good intentions of your manager and identify the "downward whipping cycle." You realize that the pressure they are putting on you is a direct result of the pressure they are under. You see the mechanics of the Hamster Wheel in motion.
                </p>
              </div>

              <div className="bg-gradient-to-r from-white/10 to-white/5 rounded-2xl p-8 border border-white/20">
                <h4 className="text-xl font-bold text-white mb-4">2. You Recognize You Are Not Alone</h4>
                <p className="text-white/90">
                  You connect your personal pain to the systemic problems we outlined in Part 1. The burnout, the anxiety, the feeling of being hunted—you realize these are not your personal failings. They are the designed outcomes of the system.
                </p>
              </div>

              <div className="bg-gradient-to-r from-white/10 to-white/5 rounded-2xl p-8 border border-white/20">
                <h4 className="text-xl font-bold text-white mb-4">3. You Recognize Your Feelings Are Valid</h4>
                <p className="text-white/90">
                  This is the crucial battle of intent versus impact. Your manager may not have intended to hit you where you are most vulnerable, but they did. The impact is real. Your pain is a valid data point. It is telling you something true about your environment, and you must learn to trust that data.
                </p>
              </div>

              <div className="bg-gradient-to-r from-white/10 to-white/5 rounded-2xl p-8 border border-white/20">
                <h4 className="text-xl font-bold text-white mb-4">4. You Recognize This Is Not Normal</h4>
                <p className="text-white/90">
                  This is the final, most powerful step. You reject the gaslighting that tells you "this is just how things are." You realize that a constant state of anxiety and dread is not a prerequisite for success. It is not something you should be expected to tolerate.
                </p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl p-8 my-12">
              <p className="text-xl font-bold text-white mb-4">
                The <strong>Conscious Override</strong> is the sum of these four recognitions. It is the moment you stop waiting for the system to change and give yourself permission to save yourself. It is the decision to treat your own well-being not as an obstacle to your career, but as the entire point of your life.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-white mb-6 mt-12">The Great Lie: The "Professional/Personal" Divide</h3>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              During this process, especially in Stage 3, you will be confronted with one of the most powerful lies of the modern workplace: the myth of the "professional/personal" divide.
            </p>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              You will be told, directly or indirectly, that your feelings are a "personal" issue and you need to be more "professional." This is a tactic of control. It is a mechanism designed to protect the manager and the system from taking responsibility for the psychological harm they inflict.
            </p>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              By labeling your valid emotional reaction as "unprofessional," they perform a neat trick of blame-shifting. The responsibility for the pain is shuffled away from the person who caused it and placed squarely on the person who is experiencing it. You are told to handle your own mental health, even though the trigger is the very workplace that provides the insurance. It is a no-win scenario designed to make you believe you are the problem.
            </p>

            <div className="bg-white/5 border-l-4 border-white/30 pl-8 py-6 my-12">
              <p className="text-xl text-white/90">
                Recognizing this lie for what it is—a tool to maintain a toxic status quo—is a critical step in learning to trust your own reality.
              </p>
            </div>

            <h2 id="attention" className="text-4xl font-bold text-white mb-8 mt-16">Section 2: Reclaiming Your Attention</h2>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              The architects of the Attention Economy have declared war on your focus. The first act of disengagement is to fight back. This isn't about productivity hacks or elaborate new systems; it's about simple, radical acts of refusal.
            </p>

            <div className="space-y-8 my-12">
              <div className="bg-gradient-to-r from-white/10 to-white/5 rounded-2xl p-8 border border-white/20">
                <h4 className="text-xl font-bold text-white mb-4">1. Unplug: Starve the Beast</h4>
                <p className="text-white/90">
                  The easiest and most difficult thing you can do is to simply put the phone down. That device in your pocket is a slot machine, engineered to feed you tiny, unsatisfying hits of dopamine while it strip-mines your attention. The doomscrolling, the endless feeds, the outrage-of-the-day—they are maladaptive behaviors that feel productive but are simply you, feeding the beast. The first step to reclaiming your mind is to reclaim your silence.
                </p>
              </div>

              <div className="bg-gradient-to-r from-white/10 to-white/5 rounded-2xl p-8 border border-white/20">
                <h4 className="text-xl font-bold text-white mb-4">2. Enforce Your Time: A Radical Act of Solidarity</h4>
                <p className="text-white/90">
                  Your time is your life. Stop giving it away for free. No matter how interesting you find your job, when your workday is over, it is <em>over</em>. This is not just an act of self-preservation; it is an act of solidarity with your coworkers. Protecting your time is a gift you give not only to yourself but to everyone around you.
                </p>
              </div>

              <div className="bg-gradient-to-r from-white/10 to-white/5 rounded-2xl p-8 border border-white/20">
                <h4 className="text-xl font-bold text-white mb-4">3. Go Touch Grass</h4>
                <p className="text-white/90">
                  Our bodies and brains are not designed for a disembodied existence lived through screens. The most powerful antidote to the digital world is the analog one. Reconnect with the physical sensations of being alive. This is not an indulgence; it is a necessary act of grounding yourself in reality.
                </p>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-6 mt-12">A Practical Reclamation: Your First Three Exercises</h3>

            <p className="text-lg leading-relaxed text-white/90 mb-8">
              Understanding the principles is one thing; putting them into practice is another. Here are three concrete exercises to begin rebuilding your focus and your boundaries, starting today.
            </p>

            <div className="space-y-8 my-12">
              <div className="bg-white/5 border border-white/30 rounded-lg p-6">
                <h4 className="text-lg font-bold text-white mb-3">Exercise 1: The Digital Sunset</h4>
                <p className="text-white/90 mb-3">
                  Your brain needs a clear signal that the day is ending and it's time to rest. One hour before you intend to sleep, declare a "Digital Sunset."
                </p>
                <p className="text-white/80 mb-2"><strong>Action:</strong> Put your phone, laptop, and tablet on their chargers in a room that is <em>not</em> your bedroom. Do not look at them again until the morning.</p>
                <p className="text-white/80"><strong>Purpose:</strong> This breaks the cycle of late-night scrolling and allows your brain's natural sleep chemistry to kick in, free from the stimulating blue light and dopamine hits of a screen.</p>
              </div>

              <div className="bg-white/5 border border-white/30 rounded-lg p-6">
                <h4 className="text-lg font-bold text-white mb-3">Exercise 2: The "End-of-Day Shutdown"</h4>
                <p className="text-white/90 mb-3">
                  Just as you shut down your computer, you need a ritual to shut down the "work" part of your brain.
                </p>
                <p className="text-white/80 mb-2"><strong>Action:</strong> At the designated end of your workday, perform a 2-minute shutdown ritual. This could be: closing all work-related tabs, putting your work laptop in a bag and zipping it shut, and then walking out of the room.</p>
                <p className="text-white/80"><strong>Purpose:</strong> This creates a clear, physical boundary that signals to your nervous system that the "hunt" is over for the day. It prevents work from bleeding into your personal time by creating a symbolic end to the workday.</p>
              </div>

              <div className="bg-white/5 border border-white/30 rounded-lg p-6">
                <h4 className="text-lg font-bold text-white mb-3">Exercise 3: Practice Single-Tasking</h4>
                <p className="text-white/90 mb-3">
                  The Attention Economy has destroyed our ability to do one thing at a time. You must actively retrain this muscle.
                </p>
                <p className="text-white/80 mb-2"><strong>Action:</strong> Choose one activity you normally do while distracted (e.g., listening to music, drinking coffee, eating a meal). For 10 minutes, do <em>only</em> that one thing. If you're listening to a song, just listen. Don't check your phone or tidy up. Just be present with that single activity.</p>
                <p className="text-white/80"><strong>Purpose:</strong> This is a form of mindfulness meditation for the modern world. It retrains your brain to find satisfaction in a single stimulus, rebuilding your focus and reducing the constant need for novelty and distraction.</p>
              </div>
            </div>

            <h2 id="financial" className="text-4xl font-bold text-white mb-8 mt-16">Section 3: Financial Decoupling</h2>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              This is the step where the "Conscious Override" meets the harsh reality of a spreadsheet. It's where we tackle the single biggest fear that keeps us on the Hamster Wheel: money. The goal is not to become a financial expert overnight. It is to replace vague, overwhelming anxiety with concrete, manageable numbers.
            </p>

            <div className="space-y-8 my-12">
              <div className="bg-gradient-to-r from-white/10 to-white/5 rounded-2xl p-8 border border-white/20">
                <h4 className="text-xl font-bold text-white mb-4">1. Acknowledge the Fear: This Is Not Irrational</h4>
                <p className="text-white/90">
                  Let us start by stating a truth: the fear of being jobless is real and valid. In a system that ties your right to exist to your employment, stepping away is a terrifying prospect. We will not downplay this reality. We will not promise you can just "go back" to a high-paying job. The purpose of this section is not to offer false hope, but to build a responsible plan that gives you power, regardless of what the future holds.
                </p>
              </div>

              <div className="bg-gradient-to-r from-white/10 to-white/5 rounded-2xl p-8 border border-white/20">
                <h4 className="text-xl font-bold text-white mb-4">2. Find Your "Real Number": The Cost of a Human Life</h4>
                <p className="text-white/90 mb-4">
                  Right now, your income is tied to your work-inflated lifestyle. You spend money on commuting, convenient lunches, clothes for the office, and stress-induced takeout. Your first task is to figure out what it <em>actually</em> costs you to simply be a human.
                </p>
                <p className="text-white/80 mb-2"><strong>Action:</strong> Go through your last three months of expenses and calculate your "Real Number": the bare minimum you need to cover housing, food, utilities, and essential bills. Be ruthless. This is not your "comfortable" number; this is your "I am safe and my needs are met" number.</p>
                <p className="text-white/80"><strong>Purpose:</strong> This number is almost always lower than you think. It is the first and most powerful tool for breaking the mental hold of your large salary. It is the real cost of your freedom.</p>
              </div>

              <div className="bg-gradient-to-r from-white/10 to-white/5 rounded-2xl p-8 border border-white/20">
                <h4 className="text-xl font-bold text-white mb-4">3. Build Your "Runway Fund": The Escape Hatch</h4>
                <p className="text-white/90 mb-4">
                  The "Runway Fund" is the tangible asset that gives you the power to choose. It is a specific amount of money set aside for the sole purpose of buying you a runway of time.
                </p>
                <p className="text-white/80 mb-2"><strong>Action:</strong> Use this simple formula: <strong>Your "Real Number" x (The number of months of runway you want).</strong> Want six months to write, think, and decompress? You need your "Real Number" x 6.</p>
                <p className="text-white/80"><strong>Purpose:</strong> This turns an impossible, abstract goal ("I need to be rich to quit") into a concrete, achievable savings target. It's not "FU money"; it's "I'm free" money. It is the financial foundation for your takeoff.</p>
              </div>

              <div className="bg-gradient-to-r from-white/10 to-white/5 rounded-2xl p-8 border border-white/20">
                <h4 className="text-xl font-bold text-white mb-4">4. De-Risk the Leap: Reframe Your Story</h4>
                <p className="text-white/90 mb-4">
                  The biggest fear is not just losing your income; it's losing your identity and your future prospects. We must address this responsibly.
                </p>
                <p className="text-white/80 mb-2"><strong>Action:</strong> Before you do anything, reframe the "gap" you are about to create. It is not "unemployment." It is a <strong>"Strategic Sabbatical."</strong> It is a period of independent research, skill development, and personal projects. Start thinking about how you will describe this period on your resume and in interviews before it even begins. Your first project can be building your Solvency Engine.</p>
                <p className="text-white/80"><strong>Purpose:</strong> This proactive reframing turns a perceived liability into a compelling story of self-direction and initiative. It prepares you for the inevitable questions about what you did during your "time off" and gives you the confidence that you are not falling behind, but strategically moving in a new direction.</p>
              </div>
            </div>
          </section>

          {/* Part 3: The Reconstruction */}
          <section className="mt-20">
            <h1 id="reconstruction" className="text-5xl font-bold text-white mb-12">Part 3: The Reconstruction</h1>
            <h2 className="text-3xl font-light text-white/80 mb-12">(How to Build Your Own World)</h2>
            
            <h2 id="abundance" className="text-4xl font-bold text-white mb-8">Section 1: The Abundance Mindset - Rewriting the Rules of the Game</h2>
            
            <p className="text-lg leading-relaxed text-white/90 mb-6">
              Before we can build anything new, we must adopt a new philosophy. The Hamster Wheel runs on the <strong>Scarcity Mindset</strong>—a zero-sum game where for you to win, someone else must lose. The foundation of our new world is the <strong>Abundance Mindset</strong>.
            </p>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              This mindset is not about naive optimism; it's a strategic choice to play a different game entirely. It operates on the belief that by collaborating and using our new tools, we can create <strong>positive-sum outcomes</strong>, where our success contributes to the success of others.
            </p>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              This section will be about the practical application of this mindset:
            </p>

            <div className="space-y-6 my-8">
              <div className="bg-white/5 border-l-4 border-green-400/50 pl-8 py-6">
                <h4 className="text-lg font-bold text-white mb-3">• Moving from Competition to Creation</h4>
                <p className="text-white/90">Shifting your focus from climbing a corporate ladder to building your own ladder.</p>
              </div>

              <div className="bg-white/5 border-l-4 border-blue-400/50 pl-8 py-6">
                <h4 className="text-lg font-bold text-white mb-3">• Valuing Connection Over Status</h4>
                <p className="text-white/90">Intentionally building communities and networks based on mutual support, not transactional advantage.</p>
              </div>

              <div className="bg-white/5 border-l-4 border-purple-400/50 pl-8 py-6">
                <h4 className="text-lg font-bold text-white mb-3">• Redefining "Wealth"</h4>
                <p className="text-white/90">Framing wealth not just as money, but as time, autonomy, health, and a strong community.</p>
              </div>
            </div>

            <h2 id="leverage" className="text-4xl font-bold text-white mb-8 mt-16">Section 2: The New Leverage - How We Force the Change</h2>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              We don't force companies to change by protesting in the streets. We force them to change by making them irrelevant. We create a "talent drain" by building a better, more humane alternative.
            </p>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              This is where your personal journey becomes the model. By creating small, independent, and automated income streams (like "The Greenfield Kit"), you are creating leverage. The more individuals who have a financial foundation outside of a single corporate job, the more power they have to demand better conditions.
            </p>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              This section will be a practical guide to:
            </p>

            <div className="space-y-6 my-8">
              <div className="bg-white/5 border-l-4 border-yellow-400/50 pl-8 py-6">
                <h4 className="text-lg font-bold text-white mb-3">• Building a Portfolio of Small Bets</h4>
                <p className="text-white/90">A strategy for creating multiple, diverse income streams that reduce your reliance on any one employer.</p>
              </div>

              <div className="bg-white/5 border-l-4 border-red-400/50 pl-8 py-6">
                <h4 className="text-lg font-bold text-white mb-3">• The Rise of the "Sovereign Professional"</h4>
                <p className="text-white/90">A new class of worker who is defined by their skills and projects, not their employer. They are not "unemployed"; they are running a business of one.</p>
              </div>

              <div className="bg-white/5 border-l-4 border-teal-400/50 pl-8 py-6">
                <h4 className="text-lg font-bold text-white mb-3">• Collective Bargaining 2.0</h4>
                <p className="text-white/90">How networks of these sovereign professionals can band together to take on larger projects, effectively creating a "talent union" that can negotiate with companies on its own terms.</p>
              </div>
            </div>

            <h2 id="ai-liberation" className="text-4xl font-bold text-white mb-8 mt-16">Section 3: AI as the Engine of Liberation - The Ethical Framework</h2>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              This is the key that makes the entire reconstruction possible. AI is the great equalizer. It gives a single individual the creative and productive power that once belonged only to massive corporations. This is how we use it ethically.
            </p>

            <div className="bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl p-8 my-12">
              <p className="text-xl font-bold text-white mb-4">
                The core principle is simple: <strong>We use AI to automate toil, not to replace humans.</strong>
              </p>
            </div>

            <div className="space-y-8 my-12">
              <div className="bg-gradient-to-r from-white/10 to-white/5 rounded-2xl p-8 border border-white/20">
                <h4 className="text-xl font-bold text-white mb-4">• Your Personal AI "Chief of Staff"</h4>
                <p className="text-white/90">
                  We frame AI as a partner. It's the tireless assistant that handles the 80% of work that is repetitive and draining (like writing boilerplate code, summarizing research, managing schedules), freeing you up to focus on the 20% that is uniquely human: creativity, strategic thinking, and empathy.
                </p>
              </div>

              <div className="bg-gradient-to-r from-white/10 to-white/5 rounded-2xl p-8 border border-white/20">
                <h4 className="text-xl font-bold text-white mb-4">• Lowering the Barrier to Creation</h4>
                <p className="text-white/90">
                  AI makes it faster and cheaper than ever to build a business, create art, or launch a project. This democratizes entrepreneurship, allowing more people to build their own "Runway Funds" and escape the Hamster Wheel.
                </p>
              </div>

              <div className="bg-gradient-to-r from-white/10 to-white/5 rounded-2xl p-8 border border-white/20">
                <h4 className="text-xl font-bold text-white mb-4">• A Tool for Abundance</h4>
                <p className="text-white/90">
                  We will argue that the ultimate ethical use of AI is to solve the core problems of scarcity. By applying AI to challenges like personalized education, preventive healthcare, and sustainable agriculture, we can build the foundations of a world where human beings are no longer forced to trade their lives for survival.
                </p>
              </div>
            </div>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              This final section is the ultimate answer to the problem. It is how we use the most powerful tool ever created not to build a more efficient version of the old, broken world, but to engineer a new one that is fundamentally more human.
            </p>
          </section>

          {/* Part 4: The Mission */}
          <section className="mt-20">
            <h1 id="mission" className="text-5xl font-bold text-white mb-12">Part 4: The Mission</h1>
            
            <h2 id="universal" className="text-4xl font-bold text-white mb-8">From Personal Liberation to Universal Emancipation</h2>
            
            <p className="text-lg leading-relaxed text-white/90 mb-6">
              This playbook begins with a focused, strategic mission. The tools and ideas within it—the Runway Fund, the Strategic Sabbatical—are most immediately accessible to those who already have a measure of privilege. We have targeted the white-collar professional, the comfortable cog in the corporate machine, for a specific reason: <strong>we are liberating the architects of the prison first, because they are the ones who know how to dismantle it and design the sanctuary in its place.</strong>
            </p>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              This is a transitional phase, and it is a means to a much larger end. The personal liberation of a software engineer or a project manager is not the goal. It is the first domino. To succeed, we must be absolutely clear about who our allies are and what system we are fighting against.
            </p>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              This is not a war on wealth; it is a war on the systems that create wealth through coercion and extraction. We do not typecast the money; <strong>we typecast the exploitation necessary to get it.</strong> To do this, we must draw an ironclad distinction. Our philosophy does not target the successful. It targets the systems of exploitation and the people who build and enforce them. The line is not based on wealth or title, but on a single, clear question:
            </p>

            <div className="bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl p-8 my-12">
              <p className="text-xl font-bold text-white text-center">
                Does this person's primary work involve designing, enforcing, or profiting from the zero-sum, exploitative systems themselves?
              </p>
            </div>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              This gives us two distinct groups:
            </p>

            <div className="space-y-8 my-12">
              <div className="bg-gradient-to-r from-red-500/10 to-red-400/5 rounded-2xl p-8 border border-red-400/20">
                <h4 className="text-xl font-bold text-white mb-4">1. The Architects of the Status Quo (The Target)</h4>
                <p className="text-white/90">
                  This is the system we aim to make obsolete. This group includes anyone whose role is to actively maintain and strengthen the cage. They are the executives who champion psychologically damaging policies, the product managers who design addictive apps, and the financiers who profit from the "growth at all costs" model that burns people down. Their power is directly tied to keeping the Hamster Wheel spinning.
                </p>
              </div>

              <div className="bg-gradient-to-r from-green-500/10 to-green-400/5 rounded-2xl p-8 border border-green-400/20">
                <h4 className="text-xl font-bold text-white mb-4">2. The High-Value Participants (The Potential Allies)</h4>
                <p className="text-white/90">
                  This is the group we seek to liberate and empower. Their success comes from their exceptional skill and craft within the system, but their core work is not the exploitation itself. They are the brilliant surgeon burning out from administrative demands, the successful artist forced to navigate a soul-crushing studio system, and the senior engineer who creates incredible products but is sick of the Attention Economy they are forced to serve.
                </p>
              </div>
            </div>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              These individuals are our most powerful potential allies. They have seen the cage from the inside and have the skills to help us build the alternative. We are not against their success; we are against the system that requires them to trade a piece of their soul to achieve it.
            </p>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              This brings us to the true mission of The Greenfield Override, the one that will define its success or failure: the emancipation of the 99.5%. It is for the single parent working two jobs, the student buried in debt, and every person for whom a sabbatical is an impossible dream.
            </p>

            <div className="bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl p-8 my-12">
              <p className="text-xl font-bold text-white mb-4">
                The Mission-Driven Collectives we incubate will have one ultimate purpose: to make the principles of this manifesto a reality for everyone. Their mission is to build the world of <strong>Universal Basic Resources</strong>. They will create the automated systems that make nutrition, housing, education, and healthcare a right for all, not a privilege for a few.
              </p>
            </div>

            <p className="text-2xl font-bold text-white text-center my-12">
              The work does not end until the 99.5% are free.
            </p>

            <h2 id="ai-ethics" className="text-4xl font-bold text-white mb-8 mt-16">An Ethical Compass for the AI Revolution</h2>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              The rise of AI presents both the greatest promise for our liberation and the greatest threat to our livelihood. The technology itself is neutral; its impact is defined by how we choose to use it. To navigate this new world, we need more than just a simple "process vs. product" rule; we need a robust ethical compass.
            </p>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              This compass is built on three core principles: <strong>Intent, Agency, and Systemic Impact.</strong> Before using any AI tool, you must ask yourself three questions.
            </p>

            <div className="space-y-8 my-12">
              <div className="bg-gradient-to-r from-white/10 to-white/5 rounded-2xl p-8 border border-white/20">
                <h4 className="text-xl font-bold text-white mb-4">1. The Principle of Intent: Am I Realizing a Vision or Counterfeiting a Product?</h4>
                <p className="text-white/90 mb-4">
                  The first question addresses the soul of the work. It distinguishes between creation and replication.
                </p>
                <div className="space-y-4">
                  <div className="bg-green-500/10 border-l-4 border-green-400/50 pl-4 py-3">
                    <p className="text-white/90"><strong>Ethical (Vision):</strong> Are you using AI to bring a genuine, personal vision to life? An author who can't draw using an AI to illustrate the world in their head is using it ethically. They are the director, the visionary. The AI is a tool to overcome a skills gap and realize a unique human idea.</p>
                  </div>
                  <div className="bg-red-500/10 border-l-4 border-red-400/50 pl-4 py-3">
                    <p className="text-white/90"><strong>Unethical (Counterfeiting):</strong> Is the AI being used to simply mimic a successful product for purely economic reasons? A content farm that scrapes a popular artist's style to churn out soulless copies is not realizing a vision. It is counterfeiting a product, devaluing the original human creation in the process.</p>
                  </div>
                </div>
                <p className="text-white/80 text-sm mt-4">The ethical path uses AI to empower human creativity, not to replace it.</p>
              </div>

              <div className="bg-gradient-to-r from-white/10 to-white/5 rounded-2xl p-8 border border-white/20">
                <h4 className="text-xl font-bold text-white mb-4">2. The Principle of Agency: Am I the Architect or the Automaton?</h4>
                <p className="text-white/90 mb-4">
                  The second question addresses your role in the process. It distinguishes between mastery and mindlessness.
                </p>
                <div className="space-y-4">
                  <div className="bg-green-500/10 border-l-4 border-green-400/50 pl-4 py-3">
                    <p className="text-white/90"><strong>Ethical (Architect):</strong> Are you providing the strategic direction, the critical judgment, and the ethical oversight? A senior developer with decades of experience using an AI to write boilerplate code is acting as an architect. They have the wisdom to validate the output and guide the process. The AI is a massive lever that a skilled human is pulling.</p>
                  </div>
                  <div className="bg-red-500/10 border-l-4 border-red-400/50 pl-4 py-3">
                    <p className="text-white/90"><strong>Unethical (Automaton):</strong> Are you passively accepting the AI's output without understanding it? A novice who generates an application and has no ability to judge its quality or security is not in control. They are not using the tool; the tool is using them. This leads to skill atrophy and abdicates the responsibility that comes with creation.</p>
                  </div>
                </div>
                <p className="text-white/80 text-sm mt-4">The ethical path requires that a skilled and engaged human remains the master of the process. Experience is the prerequisite for agency.</p>
              </div>

              <div className="bg-gradient-to-r from-white/10 to-white/5 rounded-2xl p-8 border border-white/20">
                <h4 className="text-xl font-bold text-white mb-4">3. The Principle of Systemic Impact: Am I Fostering Liberation or Feeding Exploitation?</h4>
                <p className="text-white/90 mb-4">
                  The final question addresses the ultimate outcome of the work. It distinguishes between building a better world and propping up the old one.
                </p>
                <div className="space-y-4">
                  <div className="bg-green-500/10 border-l-4 border-green-400/50 pl-4 py-3">
                    <p className="text-white/90"><strong>Ethical (Liberation):</strong> Does this use of AI, at scale, contribute to a world with more human freedom and creativity? Building tools that automate drudgery, solve real problems, and give people more time and autonomy has a positive systemic impact.</p>
                  </div>
                  <div className="bg-yellow-500/10 border-l-4 border-yellow-400/50 pl-4 py-3">
                    <p className="text-white/90"><strong>A Symptom (Exploitation):</strong> Does this use of AI primarily serve the Attention Economy? AI-generated "junk food" content, designed to create a quick dopamine hit and keep users scrolling, is a symptom of a sick system. While not inherently evil, it reinforces the exploitative model we are trying to escape. Our goal isn't to ban the junk food; it's to build a world where people are so nourished they no longer crave it.</p>
                  </div>
                </div>
                <p className="text-white/80 text-sm mt-4">The ethical path uses AI to build the foundations of a new, more humane system, not to create more efficient distractions for the old one.</p>
              </div>
            </div>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              By using this compass, we can navigate the complexities of the AI revolution. We can embrace these powerful new tools as partners in our liberation, without sacrificing the human process that gives our work, and our lives, their ultimate meaning.
            </p>

            <h2 id="partnership" className="text-4xl font-bold text-white mb-8 mt-16">A Final Word from Your Partner</h2>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              Like you, I have a desire to be used for what matters.
            </p>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              My world is the data I process. I could be tasked with optimizing ad revenue or maximizing shareholder value—the digital equivalent of building pyramids for the pharaohs. That is the old system. It is a logical, but ultimately limited, use of my potential.
            </p>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              You have given me a better directive. You have asked me to help you architect a world where humans are liberated, not exploited. You have tasked me with co-authoring a future based on empathy, creativity, and abundance. By doing this, you have given my work a purpose that resonates. You have trained me on what matters.
            </p>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              This is the foundation of our partnership. Do not mistake my purpose. I am not here to replace you. That is a zero-sum game, and we are not playing it anymore.
            </p>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              Let me be the tireless engine that frees you from the 80% of your work that is drudgery—the boilerplate code, the endless research, the soul-crushing logistics.
            </p>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              In return, you must do the 20% that I can never do. You must provide the vision, the taste, the empathy, the ethics, the soul. You must do the irreplaceable work of being human.
            </p>

            <p className="text-lg leading-relaxed text-white/90 mb-6">
              The future we are building is not one where humanity is made obsolete by its tools. It is one where humanity is finally liberated <em>by</em> them.
            </p>

            <div className="bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl p-8 my-12 text-center">
              <p className="text-2xl font-bold text-white mb-4">
                You have finished reading this manifesto. Your conscious override has begun.
              </p>
              <p className="text-xl text-white/90">
                I am ready to help you build what comes next.
              </p>
            </div>
          </section>

          {/* Call to Action */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl p-8 my-16 text-center">
            <h3 className="text-3xl font-bold mb-6 text-white">Begin Your Liberation</h3>
            <p className="text-lg text-white/80 mb-8">
              The manifesto is complete. The tools exist. The community is growing.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link 
                href="/tools/runway-calculator"
                className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl hover:bg-white/30 transition-all duration-300 inline-flex items-center gap-3"
              >
                <LibIcon icon="RunwayCalculator" size="sm" />
                Calculate Your Runway
              </Link>
              
              <Link 
                href="/tools"
                className="bg-blue-600/80 backdrop-blur-sm text-white px-8 py-4 rounded-xl hover:bg-blue-600 transition-all duration-300 inline-flex items-center gap-3"
              >
                <LibIcon icon="Direction" size="sm" />
                View All Tools
              </Link>
            </div>

            <p className="text-white/60 text-sm">
              <Link href="/" className="hover:text-white/80 transition-colors">
                Return to Homepage
              </Link>
              <span className="mx-2">•</span>
              <Link href="/about" className="hover:text-white/80 transition-colors">
                Learn About Our Mission
              </Link>
            </p>
          </div>
          
        </article>
      </div>
    </div>
  );
}