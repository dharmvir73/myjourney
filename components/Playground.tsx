'use client';
import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Asterisk, Check, Pause, Play, RotateCcw, Sun } from 'lucide-react';
const palettes = [
  { name: 'Cobalt', background: '#dce3fb', foreground: '#293dd4', accent: '#f7fbff' },
  { name: 'Tangerine', background: '#f5d8be', foreground: '#a84420', accent: '#fff6ee' },
  { name: 'Forest', background: '#d4e2d1', foreground: '#315a43', accent: '#f4f6ee' },
];

export default function Playground() {
  const [palette, setPalette] = useState(0);
  const [presses, setPresses] = useState(0);
  const [pressed, setPressed] = useState(false);
  const [remaining, setRemaining] = useState(60);
  const [running, setRunning] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => setRemaining((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, [running]);
  useEffect(() => {
    if (remaining === 0) setRunning(false);
  }, [remaining]);
  const color = palettes[palette];
  const minutes = Math.floor(remaining / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (remaining % 60).toString().padStart(2, '0');
  return (
    <section id="play" className="play-section" aria-labelledby="play-heading">
      <div className="section-topline">
        <span className="micro">02 — THE PLAYGROUND</span>
        <span className="micro">SMALL IDEAS. ACTUAL INTERACTIONS.</span>
      </div>
      <div className="play-heading">
        <h2 id="play-heading">
          Less explaining.
          <br />
          <span className="serif">More playing.</span>
          <span className="asterisk" aria-hidden="true">
            <Asterisk />
          </span>
        </h2>
        <div>
          <p>
            A few original experiments in feel, feedback,
            <br className="desktop-break" /> and the little details that make software human.
          </p>
          <span className="disclosure">
            <span /> PERSONAL EXPERIMENTS — CREATED FOR THIS SITE
          </span>
        </div>
      </div>
      <div className="experiment-grid">
        <article className="experiment-card touch-card">
          <div className="experiment-meta micro">
            <span>EXPERIMENT 001</span>
            <span>FEEL / FEEDBACK</span>
          </div>
          <div className={`touch-stage ${pressed ? 'is-pressed' : ''}`}>
            <div className="touch-rings" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <button
              className="touch-button"
              onPointerDown={() => setPressed(true)}
              onPointerUp={() => setPressed(false)}
              onPointerCancel={() => setPressed(false)}
              onPointerLeave={() => setPressed(false)}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') setPressed(true);
              }}
              onKeyUp={() => setPressed(false)}
              onBlur={() => setPressed(false)}
              onClick={() => setPresses((p) => p + 1)}
              aria-label="Press the tactile button"
            >
              <span>
                <ArrowUpRight size={42} />
              </span>
            </button>
            <span className="touch-hint handwritten">go on, press it.</span>
            <svg className="hint-arrow" viewBox="0 0 60 60" fill="none" aria-hidden="true">
              <path
                d="M4 4c22 3 41 13 41 39m-9-9 9 12 10-12"
                stroke="currentColor"
                strokeWidth="1.3"
              />
            </svg>
            <span className="touch-count micro" aria-live="polite">
              {presses
                ? `${presses.toString().padStart(2, '0')} LITTLE MOMENT${presses === 1 ? '' : 'S'} OF SATISFACTION`
                : 'A LITTLE RESISTANCE. A LITTLE DELIGHT.'}
            </span>
          </div>
          <div className="experiment-bottom">
            <div>
              <h3>Feels like something.</h3>
              <p>A study in tactile feedback.</p>
            </div>
            <span className="experiment-number">01</span>
          </div>
        </article>
        <article className="experiment-card color-card">
          <div className="experiment-meta micro">
            <span>EXPERIMENT 002</span>
            <span>COLOR / CHARACTER</span>
          </div>
          <div
            className="palette-stage"
            style={
              {
                '--palette-bg': color.background,
                '--palette-ink': color.foreground,
                '--palette-paper': color.accent,
              } as React.CSSProperties
            }
          >
            <div className="palette-window">
              <div className="palette-window-top">
                <span>
                  little things<span>®</span>
                </span>
                <Sun size={15} />
              </div>
              <div className="palette-poster">
                <span className="micro">A FRESH PERSPECTIVE</span>
                <strong>
                  Same idea.
                  <br />
                  Different
                  <br />
                  <em>feeling.</em>
                </strong>
                <span className="poster-orb" />
                <ArrowUpRight className="poster-arrow" size={25} />
              </div>
              <div className="palette-window-bottom">
                <span>MAKE ROOM FOR GOOD THINGS.</span>
                <span>01 / 03</span>
              </div>
            </div>
            <div className="palette-picker" aria-label="Choose a color palette">
              {palettes.map((p, i) => (
                <button
                  key={p.name}
                  aria-label={`${p.name} palette`}
                  aria-pressed={i === palette}
                  onClick={() => setPalette(i)}
                  style={{ background: p.foreground }}
                >
                  {palette === i ? <Check size={15} /> : null}
                </button>
              ))}
              <span className="micro" aria-live="polite">
                {color.name}
              </span>
            </div>
          </div>
          <div className="experiment-bottom">
            <div>
              <h3>A change of atmosphere.</h3>
              <p>One interface. Three personalities.</p>
            </div>
            <span className="experiment-number">02</span>
          </div>
        </article>
        <article className="experiment-card focus-card">
          <div className="focus-copy">
            <div className="experiment-meta micro">
              <span>EXPERIMENT 003</span>
              <span>TIME / ATTENTION</span>
            </div>
            <h3>
              A little space
              <br />
              to <span className="serif">just be.</span>
            </h3>
            <p>
              Not every interaction needs to do more.
              <br />
              Here’s one minute with a little less.
            </p>
            <div className="focus-controls">
              <button
                className="focus-start"
                onClick={() => {
                  if (!remaining) setRemaining(60);
                  setRunning((v) => !v);
                }}
              >
                {running ? <Pause size={13} /> : <Play size={13} />}{' '}
                {running
                  ? 'Pause'
                  : remaining === 0
                    ? 'Another minute'
                    : remaining < 60
                      ? 'Continue'
                      : 'Take a minute'}
              </button>
              <button
                className="focus-reset"
                aria-label="Reset focus timer"
                onClick={() => {
                  setRunning(false);
                  setRemaining(60);
                }}
              >
                <RotateCcw size={15} />
              </button>
            </div>
            <p className="focus-status" aria-live="polite">
              {remaining === 0
                ? 'A small pause. A fresh start.'
                : running
                  ? 'Nothing to finish. Nowhere else to be.'
                  : 'Yours. No notifications. No hurry.'}
            </p>
          </div>
          <div className="focus-clock">
            <svg viewBox="0 0 300 300" aria-hidden="true">
              <circle className="clock-track" cx="150" cy="150" r="127" />
              <circle
                className="clock-progress"
                cx="150"
                cy="150"
                r="127"
                strokeDasharray={Math.PI * 254}
                strokeDashoffset={Math.PI * 254 * (1 - remaining / 60)}
                style={{ transition: reduced ? 'none' : 'stroke-dashoffset .8s linear' }}
              />
              {Array.from({ length: 60 }, (_, i) => (
                <line
                  key={i}
                  x1="150"
                  y1={i % 5 === 0 ? '34' : '38'}
                  x2="150"
                  y2="43"
                  transform={`rotate(${i * 6} 150 150)`}
                />
              ))}
            </svg>
            <time className="clock-time" aria-label={`${remaining} seconds remaining`}>
              <span>{minutes}</span>
              <i>:</i>
              <span>{seconds}</span>
            </time>
            <span className="micro clock-caption">A MOMENT, JUST FOR YOU.</span>
          </div>
        </article>
      </div>
    </section>
  );
}
