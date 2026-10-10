'use client';
import { useRef, useState } from 'react';
import { useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Asterisk, MoveUpRight, Sparkles } from 'lucide-react';
import { journey } from '@/data/journey';

export default function JourneyStory() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    if (window.innerWidth > 760) setActive(Math.min(4, Math.floor(value * 5)));
  });
  const select = (index: number) => {
    setActive(index);
    if (window.innerWidth > 760 && ref.current) {
      const top = ref.current.getBoundingClientRect().top + window.scrollY;
      const travel = ref.current.offsetHeight - window.innerHeight;
      window.scrollTo({
        top: top + (travel * (index + 0.2)) / 5,
        behavior: reduced ? 'instant' : 'smooth',
      });
    }
  };
  const chapter = journey[active];
  return (
    <section className="story-section" id="story" ref={ref} aria-labelledby="story-heading">
      <div className="story-sticky">
        <div className="section-topline">
          <span className="micro">01 — A PERSONAL TIMELINE</span>
          <span className="micro">THE PATH WAS NEVER A STRAIGHT LINE.</span>
        </div>
        <div className="story-layout">
          <div className="story-intro">
            <h2 id="story-heading">
              A few turns.
              <br />A little growth.
              <br />
              <span className="serif">Still becoming.</span>
            </h2>
            <p>
              No overnight origin story. Just questions,
              <br className="desktop-break" /> small experiments, and a habit of showing up.
            </p>
            <div className="story-index">
              <span>0{active + 1}</span>
              <span className="index-rule" />
              <span>05</span>
            </div>
            <span className="scroll-note micro">
              <ArrowDown size={12} /> SCROLL THROUGH THE YEARS
            </span>
          </div>
          <div className="story-stage">
            <div className="year-nav" aria-label="Choose a chapter">
              {journey.map((j, i) => (
                <button
                  key={j.year}
                  onClick={() => select(i)}
                  aria-pressed={active === i}
                  className={active === i ? 'active' : ''}
                >
                  <span />
                  {j.year}
                </button>
              ))}
            </div>
            <div className={`story-card story-card-${active}`}>
              <div className="story-card-meta">
                <span className="micro">{chapter.label.toUpperCase()}</span>
                <span className="micro">FIELD NOTE / 0{active + 1}</span>
              </div>
              <div className="story-art" aria-hidden="true">
                <div className="art-orbit orbit-one" />
                <div className="art-orbit orbit-two" />
                <div className="art-orbit orbit-three" />
                <span className="story-symbol">
                  {active === 2 ? <ArrowUpRight /> : active === 4 ? <Asterisk /> : chapter.symbol}
                </span>
                <span className="art-label">{chapter.year}</span>
                <span className="art-star">
                  <Sparkles size={23} />
                </span>
              </div>
              <div className="story-card-copy" aria-live="polite">
                <h3>{chapter.title}</h3>
                <p>{chapter.description}</p>
                <div>
                  <span className="handwritten">{chapter.note}</span>
                  <MoveUpRight size={17} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
