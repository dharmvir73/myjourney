# Dharmveer — a personal journey

An editorial portfolio about curiosity, craft, and the person behind the code. Built with Next.js, TypeScript, Tailwind CSS, Framer Motion, and a small original WebGL renderer. Warm ivory, oversized typography, cobalt, and expressive interaction replace conventional project cards.

## Public content boundary

This version contains **no employer product descriptions, client case studies, internal architectures, role mappings, operational sequences, or business data**. The downloadable PDF is a public personal profile with the same boundary.

The playground contains three original, independent experiments made specifically for this site. They are not presented as company work or as previously shipped products. They make no network requests and collect no data.

This content boundary applies to the current source tree. Earlier Git commits may still contain previous material; updating a branch does not erase its history. Do not assume history has been removed without independently verifying it.

## Start

Use Node.js 20.9+ (verified with Node.js 24).

```sh
npm ci
npm run dev
```

For production:

```sh
npm run build
npm run start
```

The server listens on port 3000. Work in `/workspace/myjourney` in this cloud environment. Cloud tasks are already isolated; no additional Git worktree is needed unless explicitly requested.

## Architecture

- `components/Portfolio.tsx` — opening, navigation, personal philosophy, capabilities, future interests, and contact.
- `components/CuriositySculpture.tsx` — an original parametric trefoil rendered with native WebGL, cursor rotation, keyboard-accessible controls, reduced-motion handling, and an optimized image fallback. The initial image preserves the visual design while WebGL initializes only after interaction.
- `components/JourneyStory.tsx` — a scroll-driven personal timeline on desktop and selectable chapters on smaller devices.
- `components/Playground.tsx` — a tactile button, a three-palette interface study, and a working one-minute focus timer.
- `data/journey.ts` — public personal milestones only.
- `data/skills.ts` — broad capabilities and tools.
- `app/globals.css` — the responsive editorial visual system.
- `scripts/generate_resume.py` — regenerates the public-safe PDF with ReportLab. Python and ReportLab are not required to run the site.

The sculpture is generated mathematically. Its optimized 40 KB poster is rendered from the same original geometry. No downloaded 3D models, image services, analytics, or external runtime APIs are used. Fonts are self-hosted.

## Contact details

Add these optional, public values to `.env.local` (see `.env.example`):

```dotenv
NEXT_PUBLIC_CONTACT_EMAIL=your-public-email@example.com
NEXT_PUBLIC_LINKEDIN_URL=https://www.linkedin.com/in/your-profile/
```

Never put secrets into `NEXT_PUBLIC_*` values. Rebuild production after changing them. Until actual details are provided, email and LinkedIn are marked as coming soon. The main contact arrow points to the supplied GitHub account. The profile PDF can be reviewed and replaced before sharing.

## Checks

```sh
npm run typecheck
npm run format:check
npm run build
npx playwright install chromium
npm run test:e2e
```

In the prepared cloud environment, the installed Chromium can be used directly:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/chromium npm run test:e2e
```

The tests exercise the current personal timeline, original experiments, focus timer, keyboard navigation, PDF delivery, responsive layouts, and automated accessibility. Build first; Playwright starts a production server or reuses one already running outside CI.

## Deployment

This is a standard Next.js application, compatible with Vercel and other Node.js hosts. It needs no database or credentials. GitHub source publication, cloud environment publication, and public website deployment are distinct actions.
