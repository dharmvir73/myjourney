'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import {
  ArrowDown,
  ArrowDownRight,
  ArrowUp,
  ArrowUpRight,
  Asterisk,
  Compass,
  Download,
  Menu,
  X,
} from 'lucide-react';
import JourneyStory from './JourneyStory';
import Playground from './Playground';
import { capabilities } from '@/data/skills';
const CuriositySculpture = dynamic(() => import('./CuriositySculpture'), {
  loading: () => (
    <div className="sculpture-placeholder" aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  ),
});

function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: reduced ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
const navigation = [
  { id: 'story', label: 'The story', n: '01' },
  { id: 'play', label: 'The playground', n: '02' },
  { id: 'approach', label: 'The craft', n: '03' },
  { id: 'next', label: 'What’s next', n: '04' },
];
export default function Portfolio() {
  const [active, setActive] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 150, damping: 30 });
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  const linkedin = process.env.NEXT_PUBLIC_LINKEDIN_URL;
  useEffect(() => {
    const nodes = navigation.map((n) => document.getElementById(n.id));
    let frame = 0;
    const update = () => {
      let current = '';
      for (const node of nodes)
        if (node && node.getBoundingClientRect().top < window.innerHeight * 0.5) current = node.id;
      setActive(current);
      frame = 0;
    };
    const scroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', scroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', scroll);
      cancelAnimationFrame(frame);
    };
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const old = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    menu.current?.querySelector<HTMLElement>('a')?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
      if (e.key === 'Tab') {
        const items = Array.from(menu.current?.querySelectorAll<HTMLElement>('a,button') ?? []);
        if (e.shiftKey && document.activeElement === items[0]) {
          e.preventDefault();
          items.at(-1)?.focus();
        } else if (!e.shiftKey && document.activeElement === items.at(-1)) {
          e.preventDefault();
          items[0]?.focus();
        }
      }
    };
    document.addEventListener('keydown', key);
    return () => {
      document.body.style.overflow = old;
      document.removeEventListener('keydown', key);
    };
  }, [menuOpen]);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <motion.div
        className="reading-progress"
        style={{ scaleX: reduced ? scrollYProgress : progress }}
      />
      <header className="site-header">
        <a className="wordmark" href="#top">
          dharmveer
          <span className="logo-star">
            <Asterisk size={23} />
          </span>
        </a>
        <nav aria-label="Main navigation" className="header-nav">
          <a href="#story">The story</a>
          <a href="#play">
            The playground <ArrowUpRight size={12} />
          </a>
        </nav>
        <a href="#contact" className="header-hello">
          Say hello <ArrowUpRight size={16} />
        </a>
        <button
          ref={menuButton}
          className="menu-toggle"
          aria-label="Open navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={23} />
        </button>
      </header>
      {menuOpen && (
        <div
          className="mobile-menu"
          ref={menu}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
        >
          <div className="mobile-menu-top">
            <span className="micro">A FEW PLACES TO GO</span>
            <button
              aria-label="Close navigation"
              onClick={() => {
                setMenuOpen(false);
                menuButton.current?.focus();
              }}
            >
              <X size={25} />
            </button>
          </div>
          {navigation.map((n) => (
            <a href={`#${n.id}`} key={n.id} onClick={() => setMenuOpen(false)}>
              <span className="micro">{n.n}</span>
              {n.label}
              <ArrowUpRight size={25} />
            </a>
          ))}
          <a href="#contact" onClick={() => setMenuOpen(false)}>
            Say hello <ArrowUpRight size={25} />
          </a>
          <span className="menu-signoff serif">Good to have you here.</span>
        </div>
      )}
      <aside className={`chapter-nav ${active ? 'visible' : ''}`} aria-label="Page chapters">
        {navigation.map((n) => (
          <a
            href={`#${n.id}`}
            key={n.id}
            className={active === n.id ? 'active' : ''}
            aria-current={active === n.id ? 'location' : undefined}
          >
            <span>{n.n}</span>
            <span>{n.label}</span>
          </a>
        ))}
      </aside>
      <main id="main">
        <section className="hero" id="top" aria-labelledby="hero-heading">
          <div className="hero-kicker micro">
            <span className="status-dot" /> SOFTWARE ENGINEER. FRONTEND & MOBILE.
          </div>
          <div className="hero-title">
            <h1 id="hero-heading">
              Curious mind.
              <br />
              Builder’s
              <br />
              <span className="serif">instinct.</span>
            </h1>
            <span className="hero-title-star" aria-hidden="true">
              <Asterisk />
            </span>
          </div>
          <div className="hero-sculpture">
            <CuriositySculpture />
          </div>
          <div className="hero-note">
            <span className="handwritten">Hello, I’m Dharmveer.</span>
            <p>
              I turn complicated ideas into experiences
              <br className="desktop-break" /> that feel simple. And I’m only getting started.
            </p>
            <a href="#story" className="button-primary">
              Step into my story <ArrowDownRight size={18} />
            </a>
          </div>
          <div className="hero-sticker">
            <span className="micro">CURRENT STATUS</span>
            <span>
              A work
              <br />
              in progress.
            </span>
            <Asterisk size={20} />
            <span className="micro">HAPPILY SO.</span>
          </div>
          <div className="hero-bottom">
            <a href="#story">
              <span className="scroll-icon">
                <ArrowDown size={16} />
              </span>
              <span className="micro">
                A PERSONAL JOURNEY,
                <br />
                NOT JUST A PORTFOLIO.
              </span>
            </a>
            <span className="hero-bottom-note">
              Made with care. <span className="serif">And a little curiosity.</span>
            </span>
            <span className="micro">SCROLL TO WANDER</span>
          </div>
        </section>
        <div className="statement-strip">
          <span>Thoughtful interfaces.</span>
          <Asterisk size={22} />
          <span>Useful ideas.</span>
          <Asterisk size={22} />
          <span>A human point of view.</span>
          <Asterisk size={22} />
        </div>
        <JourneyStory />
        <Playground />
        <section className="approach-section" id="approach" aria-labelledby="approach-heading">
          <div className="section-topline">
            <span className="micro">03 — THE WAY I THINK</span>
            <span className="micro">TOOLS CHANGE. INTENT MATTERS.</span>
          </div>
          <div className="approach-intro">
            <Reveal>
              <span className="approach-star" aria-hidden="true">
                <Asterisk />
              </span>
              <h2 id="approach-heading">
                Care is a<br />
                <span className="serif">technical skill.</span>
              </h2>
            </Reveal>
            <Reveal className="approach-description">
              <p>
                In the naming. In the loading state.
                <br />
                In the thing that happens when nothing goes to plan.
              </p>
              <p>
                I like making the important things feel effortless.
                <br />
                That takes more than knowing a framework.
                <br />
                It takes paying attention.
              </p>
              <div className="approach-signature">
                <span className="signature-line" />
                <span className="handwritten">That’s the kind of engineer I’m becoming.</span>
              </div>
            </Reveal>
          </div>
          <div className="capability-list">
            {capabilities.map((c) => (
              <Reveal key={c.name}>
                <div className="capability-row">
                  <span className="micro">{c.number}</span>
                  <h3>{c.name}</h3>
                  <p>{c.description}</p>
                  <span className="capability-tools">{c.tools}</span>
                  <ArrowUpRight size={21} />
                </div>
              </Reveal>
            ))}
          </div>
          <div className="approach-footnote">
            <span className="micro">A NOTE ON THE WORK</span>
            <p>
              Professional experience informs my craft. Employer products and internal work stay
              private.
              <br />
              Everything in the playground is an original, independent experiment.
            </p>
          </div>
        </section>
        <section className="next-section" id="next" aria-labelledby="next-heading">
          <div className="section-topline">
            <span className="micro">04 — THE UNWRITTEN PART</span>
            <span className="micro">STILL LEARNING. STILL MAKING.</span>
          </div>
          <div className="next-layout">
            <Reveal className="next-copy">
              <h2 id="next-heading">
                There’s a lot
                <br />
                of <span className="serif">“what if”</span>
                <br />
                left in me.
              </h2>
              <p>
                I’m interested in the space between technology
                <br className="desktop-break" /> and everyday life. More intuitive interfaces.
                <br className="desktop-break" /> More useful AI. More reasons to make something.
              </p>
              <span className="handwritten">The next chapter is still taking shape.</span>
              <a href="#contact" className="next-link">
                Maybe we’ll build a part of it together. <ArrowUpRight size={17} />
              </a>
            </Reveal>
            <div className="future-art" aria-hidden="true">
              <div className="future-orbit future-orbit-one" />
              <div className="future-orbit future-orbit-two" />
              <div className="future-orbit future-orbit-three" />
              <div className="future-core">
                <Asterisk />
              </div>
              <span className="future-label label-one micro">KEEP ASKING</span>
              <span className="future-label label-two micro">KEEP MAKING</span>
              <span className="future-label label-three micro">KEEP BECOMING</span>
              <span className="future-annotation handwritten">no finish line.</span>
            </div>
          </div>
        </section>
        <section className="personal-section" aria-label="Beyond the keyboard">
          <span className="micro">AWAY FROM THE KEYBOARD</span>
          <p>
            Sometimes building.
            <br />
            Sometimes exploring.
            <br />
            <span className="serif">Always noticing things.</span>
          </p>
          <div className="personal-note">
            <Compass size={22} />
            <span>
              I like understanding how things work,
              <br />
              taking a different road, and learning
              <br />
              something I didn’t know yesterday.
            </span>
          </div>
        </section>
        <footer className="contact-section" id="contact">
          <div className="section-topline">
            <span className="micro">GOOD THINGS START WITH A CONVERSATION.</span>
            <a href="#top" className="back-top" aria-label="Back to top">
              <ArrowUp size={18} />
            </a>
          </div>
          <div className="contact-headline">
            <h2>
              Have a good
              <br />
              <span className="serif">feeling about this?</span>
            </h2>
            <a
              href={email ? `mailto:${email}` : 'https://github.com/dharmvir73'}
              target={email ? undefined : '_blank'}
              rel={email ? undefined : 'noopener noreferrer'}
              className="contact-arrow"
              aria-label={email ? 'Email Dharmveer' : 'Visit Dharmveer on GitHub'}
            >
              <ArrowUpRight />
            </a>
          </div>
          <div className="contact-details">
            <div>
              <span className="handwritten">Let’s see what we can make.</span>
              <p>Ideas, interesting problems, or just a hello.</p>
            </div>
            <div className="contact-links">
              {email ? (
                <a href={`mailto:${email}`}>
                  Email me <ArrowUpRight size={16} />
                </a>
              ) : (
                <span className="contact-unavailable">
                  Email <span className="micro">COMING SOON</span>
                </span>
              )}
              {linkedin ? (
                <a href={linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn <ArrowUpRight size={16} />
                </a>
              ) : (
                <span className="contact-unavailable">
                  LinkedIn <span className="micro">COMING SOON</span>
                </span>
              )}
              <a href="https://github.com/dharmvir73" target="_blank" rel="noopener noreferrer">
                GitHub <ArrowUpRight size={16} />
              </a>
              <a href="/dharmveer-kumar-resume.pdf" download>
                Personal profile <Download size={14} />
              </a>
            </div>
          </div>
          <div className="footer-bottom">
            <a href="#top" className="wordmark">
              dharmveer
              <Asterisk size={18} />
            </a>
            <span className="micro">THOUGHTFULLY MADE. NEVER QUITE FINISHED.</span>
            <span className="micro">© {new Date().getFullYear()} DHARMVEER KUMAR</span>
          </div>
        </footer>
      </main>
    </>
  );
}
