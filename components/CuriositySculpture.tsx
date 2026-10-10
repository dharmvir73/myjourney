'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import sculpturePoster from '@/public/sculpture-poster.webp';
import { MoveUpRight, Pause, Play, Rotate3D } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';

// An original parametric trefoil, shaded in a small native WebGL renderer.
// No model files, trackers, textures, or third-party 3D runtime are needed.
function makeKnot() {
  const point = (t: number) => [
    (2 + Math.cos(3 * t)) * Math.cos(2 * t),
    (2 + Math.cos(3 * t)) * Math.sin(2 * t),
    Math.sin(3 * t),
  ];
  const normalize = (v: number[]) => {
    const length = Math.hypot(...v);
    return v.map((n) => n / length);
  };
  const cross = (a: number[], b: number[]) => [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
  const ring = (i: number, j: number) => {
    const t = (i / 192) * Math.PI * 2;
    const center = point(t);
    const forward = point(t + 0.001);
    const tangent = normalize(forward.map((n, k) => n - center[k]));
    const normal = normalize(cross(tangent, [0, 0, 1]));
    const binormal = normalize(cross(tangent, normal));
    const a = (j / 24) * Math.PI * 2;
    const n = normal.map((v, k) => v * Math.cos(a) + binormal[k] * Math.sin(a));
    return [...center.map((v, k) => v + n[k] * 0.48), ...n];
  };
  const mesh: number[] = [];
  for (let i = 0; i < 192; i++) {
    for (let j = 0; j < 24; j++) {
      const a = ring(i, j),
        b = ring(i + 1, j),
        c = ring(i + 1, j + 1),
        d = ring(i, j + 1);
      mesh.push(...a, ...b, ...c, ...a, ...c, ...d);
    }
  }
  return new Float32Array(mesh);
}

export default function CuriositySculpture() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const rotation = useRef({ x: 0.45, y: 0.4 });
  const drag = useRef<{ x: number; y: number } | null>(null);
  const [paused, setPaused] = useState(false);
  const [activated, setActivated] = useState(false);
  const [available, setAvailable] = useState(false);
  const [fallbackRotation, setFallbackRotation] = useState(0);
  const [contextVersion, setContextVersion] = useState(0);
  const reduced = useReducedMotion();
  const moving = useRef(false);
  moving.current = activated && !paused && !reduced;

  useEffect(() => {
    const el = canvas.current;
    if (!el || !activated) return;
    const gl = el.getContext('webgl', {
      alpha: true,
      antialias: true,
      powerPreference: 'low-power',
    });
    if (!gl) return;
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };
    const vertex = compile(
      gl.VERTEX_SHADER,
      `
      attribute vec3 position; attribute vec3 normal;
      uniform vec2 rotation; uniform float aspect;
      varying vec3 surfaceNormal; varying vec3 surfacePosition;
      void main() {
        float cx = cos(rotation.x), sx = sin(rotation.x);
        float cy = cos(rotation.y), sy = sin(rotation.y);
        mat3 rx = mat3(1.,0.,0., 0.,cx,sx, 0.,-sx,cx);
        mat3 ry = mat3(cy,0.,-sy, 0.,1.,0., sy,0.,cy);
        mat3 rz = mat3(.96,.28,0., -.28,.96,0., 0.,0.,1.);
        mat3 model = rz * rx * ry;
        vec3 p = model * position;
        surfaceNormal = model * normal; surfacePosition = p;
        float perspective = 9. / (9. - p.z);
        gl_Position = vec4(p.x * .24 * perspective / aspect, p.y * .24 * perspective, -p.z * .12, 1.);
      }
    `,
    );
    const fragment = compile(
      gl.FRAGMENT_SHADER,
      `
      precision mediump float;
      varying vec3 surfaceNormal; varying vec3 surfacePosition;
      void main() {
        vec3 n = normalize(surfaceNormal);
        vec3 light = normalize(vec3(-.5,.85,1.5));
        vec3 fill = normalize(vec3(.9,-.2,.7));
        float diffuse = max(dot(n, light), 0.);
        float bounce = max(dot(n, fill), 0.);
        float spec = pow(max(dot(reflect(-light,n), vec3(0.,0.,1.)),0.), 55.);
        float gloss = pow(max(dot(reflect(-fill,n),vec3(0.,0.,1.)),0.), 16.);
        float rim = pow(1. - abs(n.z), 2.);
        vec3 blue = vec3(.035,.105,.83) * (.3 + diffuse * .72 + bounce * .13);
        blue += vec3(.72,.8,1.) * spec * .78;
        blue += vec3(.2,.34,1.) * gloss * .22 + vec3(.04,.10,.30) * rim;
        gl_FragColor = vec4(pow(blue,vec3(.8)), 1.);
      }
    `,
    );
    if (!vertex || !fragment) return;
    const program = gl.createProgram()!;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    const mesh = makeKnot();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, mesh, gl.STATIC_DRAW);
    for (const [name, offset] of [
      ['position', 0],
      ['normal', 12],
    ] as const) {
      const location = gl.getAttribLocation(program, name);
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 24, offset);
    }
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0, 0, 0, 0);
    const rotationUniform = gl.getUniformLocation(program, 'rotation');
    const aspectUniform = gl.getUniformLocation(program, 'aspect');
    let visible = true,
      frame = 0,
      last = 0,
      dirty = true;
    let drawnX = NaN,
      drawnY = NaN;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      dirty = true;
    });
    observer.observe(el);
    const resize = new ResizeObserver(() => {
      dirty = true;
    });
    resize.observe(el);
    const markDirty = () => {
      dirty = true;
    };
    el.addEventListener('pointermove', markDirty);
    const render = (now: number) => {
      frame = requestAnimationFrame(render);
      if (!visible || document.hidden || (now - last < 33 && !dirty)) return;
      if (
        !moving.current &&
        !dirty &&
        drawnX === rotation.current.x &&
        drawnY === rotation.current.y
      )
        return;
      const rect = el.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.7);
      const width = Math.round(rect.width * ratio),
        height = Math.round(rect.height * ratio);
      if (el.width !== width || el.height !== height) {
        el.width = width;
        el.height = height;
      }
      if (moving.current && !drag.current) rotation.current.y += Math.min(now - last, 50) * 0.00012;
      last = now;
      dirty = false;
      drawnX = rotation.current.x;
      drawnY = rotation.current.y;
      gl.viewport(0, 0, width, height);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.uniform2f(rotationUniform, rotation.current.x, rotation.current.y);
      gl.uniform1f(aspectUniform, width / height);
      gl.drawArrays(gl.TRIANGLES, 0, mesh.length / 6);
    };
    frame = requestAnimationFrame(render);
    setAvailable(true);
    const lost = (event: Event) => {
      event.preventDefault();
      setAvailable(false);
    };
    const restored = () => setContextVersion((v) => v + 1);
    el.addEventListener('webglcontextlost', lost);
    el.addEventListener('webglcontextrestored', restored);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resize.disconnect();
      el.removeEventListener('pointermove', markDirty);
      el.removeEventListener('webglcontextlost', lost);
      el.removeEventListener('webglcontextrestored', restored);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    };
  }, [contextVersion, activated]);

  return (
    <div className="sculpture-scene">
      <div className="sculpture-stamp">
        <span className="micro">AN IDEA</span>
        <span>in motion.</span>
        <MoveUpRight size={17} />
      </div>
      <div className="sculpture-shadow" aria-hidden="true" />
      {!available && (
        <Image
          src={sculpturePoster}
          alt="An original cobalt-blue looping sculpture"
          className="sculpture-poster"
          style={{ transform: `rotate(${fallbackRotation}deg)` }}
          sizes="(max-width: 520px) 100vw, 60vw"
          preload
        />
      )}
      <canvas
        ref={canvas}
        className={`sculpture-canvas ${available ? 'ready' : ''}`}
        role="img"
        aria-hidden={!available}
        aria-label="An original cobalt-blue looping sculpture. Drag to change its perspective, or use the rotate button."
        onPointerDown={(e) => {
          if (e.pointerType === 'touch') return;
          setActivated(true);
          drag.current = { x: e.clientX, y: e.clientY };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          rotation.current.y += (e.clientX - drag.current.x) * 0.009;
          rotation.current.x += (e.clientY - drag.current.y) * 0.009;
          drag.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
      />
      <div className="sculpture-caption">
        <span className="micro">
          NO STRAIGHT LINES.
          <br />
          PLENTY OF POSSIBILITY.
        </span>
        <div>
          <button
            onClick={() => {
              setActivated(true);
              setFallbackRotation((r) => r + 30);
              rotation.current.y += 0.6;
              rotation.current.x += 0.2;
            }}
            aria-label="Rotate sculpture"
          >
            <Rotate3D size={17} />
          </button>
          <button
            onClick={() => {
              if (!activated) {
                setActivated(true);
                setPaused(false);
              } else setPaused((v) => !v);
            }}
            disabled={!!reduced}
            aria-label={
              reduced
                ? 'Automatic motion disabled by your preference'
                : !activated
                  ? 'Animate sculpture'
                  : paused
                    ? 'Resume sculpture motion'
                    : 'Pause sculpture motion'
            }
            aria-pressed={paused || !!reduced || !activated}
          >
            {!activated || paused || reduced ? <Play size={15} /> : <Pause size={15} />}
          </button>
        </div>
      </div>
    </div>
  );
}
