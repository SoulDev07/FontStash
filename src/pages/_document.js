import { Html, Head, Main, NextScript } from 'next/document'

const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('font-stash:theme') || 'system';
    var key = stored;
    if (stored === 'system') {
      key = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    var themes = {
      dark: { bg: '#090a0f', text: '#f8fafc', primary: '#ffffff', accent: '#38bdf8', card: '#12131a', panel: '#1a1b26', muted: '#94a3b8', border: '#262838', danger: '#f87171', success: '#34d399', warning: '#fbbf24' },
      light: { bg: '#f8f9fa', text: '#0f172a', primary: '#0f172a', accent: '#2563eb', card: '#ffffff', panel: '#f1f3f5', muted: '#64748b', border: '#e2e8f0', danger: '#dc2626', success: '#16a34a', warning: '#d97706' },
      dracula: { bg: '#1e1f29', text: '#f8f8f2', primary: '#bd93f9', accent: '#ff79c6', card: '#282a36', panel: '#343746', muted: '#a4b0d0', border: '#44475a', danger: '#ff5555', success: '#50fa7b', warning: '#f1fa8c' },
      nord: { bg: '#242933', text: '#eceff4', primary: '#88c0d0', accent: '#81a1c1', card: '#2e3440', panel: '#3b4252', muted: '#a3b1cc', border: '#434c5e', danger: '#bf616a', success: '#a3be8c', warning: '#ebcb8b' },
      gruvbox: { bg: '#1d2021', text: '#ebdbb2', primary: '#fabd2f', accent: '#fe8019', card: '#282828', panel: '#32302f', muted: '#bdae93', border: '#504945', danger: '#fb4934', success: '#b8bb26', warning: '#fabd2f' }
    };
    var t = themes[key] || themes.dark;
    var root = document.documentElement;
    for (var k in t) {
      root.style.setProperty('--' + k, t[k]);
    }
    root.setAttribute('data-theme', stored);
    if (key !== 'light' && key !== 'warm') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  } catch (e) {}
})();
`;

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="alternate icon" type="image/png" href="/logo.svg" />
        <link rel="apple-touch-icon" href="/logo.svg" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600&family=Geist:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
