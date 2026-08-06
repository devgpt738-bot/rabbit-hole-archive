import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Key, BrainCircuit } from 'lucide-react';
import './TheoryPage.css';

const THEORY_DATA = {
  title: "The Simulation Hypothesis",
  category: "Mind & Consciousness",
  level: 6,
  timeline: "First proposed logically in 2003 by Nick Bostrom, though philosophical roots date back to antiquity (Zhuangzi's butterfly, Plato's Cave).",
  overview: "The simulation hypothesis proposes that all of our existence is a simulated reality, such as a computer simulation. Those running the simulation could be advanced descendants of our own species.",
  origins: "While Descartes pondered if an evil demon was tricking his senses, the modern computational argument was formalized by Oxford philosopher Nick Bostrom. He argued that at least one of three propositions must be true: human extinction before reaching a 'posthuman' stage, posthuman lack of interest in simulating ancestors, or we are almost certainly living in a simulation.",
  arguments: [
    "Technological Trajectory: Look at the progression from Pong to photorealistic VR in just 40 years. In 10,000 years, simulations will be indistinguishable from base reality.",
    "The Limit of Physics: Quantum mechanics (observer effect) and the speed of light could be interpreted as processing limits or rendering optimizations of a simulation engine.",
    "Mathematical Universe: The deeper we look into physics, the more it resembles error-correcting computer code (e.g., James Gates' discovery of Shannon coding in string theory equations)."
  ],
  counterarguments: [
    "Computational Limits: Simulating the entire universe down to the quantum level would require a computer larger than the universe itself.",
    "The Anthropic Principle: We observe the universe this way because if it were any different, we wouldn't be here to observe it.",
    "Unfalsifiability: Like a religion, if any glitch can be explained away as 'part of the simulation,' the theory cannot be scientifically tested."
  ],
  relatedPaths: [
    { id: 'mandela', title: 'The Mandela Effect', desc: 'Glitches in the simulation or merging timelines?' },
    { id: 'holographic', title: 'Holographic Universe', desc: 'Is the 3D universe a projection from a 2D surface?' }
  ]
};

export default function TheoryPage({ onOpenSearch }) {
  const { id } = useParams();
  const navigate = useNavigate();

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <div className="theory-container">
      <nav className="theory-nav">
        <button className="back-btn" onClick={() => navigate('/archive')}>
          <ChevronLeft size={24} /> Return to Archive
        </button>
      </nav>

      <article className="theory-article">
        <header className="theory-header">
          <div className="theory-meta">
            <span className="category-tag">{THEORY_DATA.category}</span>
            <span className="level-tag"><Key size={14}/> Depth: {THEORY_DATA.level}/10</span>
          </div>
          <h1 className="theory-title">{THEORY_DATA.title}</h1>
          <p className="theory-timeline"><strong>Timeline:</strong> {THEORY_DATA.timeline}</p>
        </header>

        <div className="theory-content">
          <section className="text-section">
            <h2>Overview</h2>
            <p>{THEORY_DATA.overview}</p>
          </section>

          <section className="text-section">
            <h2>Origins</h2>
            <p>{THEORY_DATA.origins}</p>
          </section>

          <div className="arguments-grid">
            <section className="text-section args-box pro">
              <h2>Arguments Supporting It</h2>
              <ul>
                {THEORY_DATA.arguments.map((arg, idx) => <li key={idx}>{arg}</li>)}
              </ul>
            </section>

            <section className="text-section args-box con">
              <h2>Counterarguments</h2>
              <ul>
                {THEORY_DATA.counterarguments.map((arg, idx) => <li key={idx}>{arg}</li>)}
              </ul>
            </section>
          </div>
        </div>

        <div className="theory-actions">
          <button className="gothic-btn" onClick={() => navigate('/archive')}>
            Continue Exploring
          </button>
        </div>

        <div className="next-doors-section">
          <div className="door-divider">
            <BrainCircuit size={30} className="door-icon" />
          </div>
          <h3 className="door-title">You have reached another door...</h3>
          <div className="doors-grid">
            {THEORY_DATA.relatedPaths.map(path => (
              <div key={path.id} className="door-card" onClick={() => navigate(`/theory/${path.id}`)}>
                <h4>{path.title}</h4>
                <p>{path.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
