# FontStash ✨

<div align="center">
	<img src="/public/hero-banner.svg" alt="FontStash - Local-first font playground" style="max-width:100%;height:auto;" />
</div>

<p align="center">
	<a href="https://nextjs.org"><img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs"/></a>
	<a href="https://react.dev"><img alt="React" src="https://img.shields.io/badge/React-19-20232a?logo=react"/></a>
	<a href="https://tailwindcss.com"><img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind-4-0ea5e9?logo=tailwindcss&logoColor=white"/></a>
</p>

Personal, local‑first playground for your fonts - drop files in `public/fonts` and preview instantly.

## Highlights 🚀

- Local‑first by design: your fonts are served as static files, never uploaded
- Fast previews using dynamic `@font-face` injection
- Theming system with multiple gorgeous presets

## Tech stack 🧰

- Next.js 16 + React 19
- Tailwind CSS v4
- Phosphor Icons (`@phosphor-icons/react`)

## Quick Start

### Prerequisites:

- Node.js 20+ recommended
- pnpm v10

### 1. Install dependencies:

```bash
pnpm install
```

### 2. Start the development server:

```bash
pnpm dev
```

### 3. Open the app

Visit http://localhost:3000
then drop your font files into `public/fonts` and refresh to preview them instantly.

## Theming 🎨

Themes live in `themes/themes.js` as token maps that are applied at runtime via CSS variables.

Add a theme:

- Create a new key inside `THEMES` with a `label` and `tokens` object
- Tokens automatically map to CSS variables like `--bg`, `--text`, `--primary`, etc.

## Project structure 🗂️

```
project-root/
├─ components/       ─ UI building blocks (FontCard, FontRow, Sidebar, ThemeSwitcher)
├─ contexts/         ─ Theme context and provider
├─ pages/            ─ Next.js routes (index.js scans /public/fonts)
├─ public/
│  └─ fonts/         ─ Drop your font files here (TTF, OTF, WOFF, WOFF2)
├─ styles/           ─ Global Tailwind styles
├─ themes/           ─ Theme token definitions
└─ utils/            ─ Font and localStorage helpers
```

---

<p align="center"><em>Made with care so you can enjoy your type. 🖋️</em></p>
