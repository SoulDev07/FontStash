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
      dark: { bg: '#000000', text: '#ffffff', primary: '#ffffff', accent: '#a3a3a3', card: '#0a0a0a', panel: '#141414', muted: '#737373', border: '#262626', danger: '#ef4444', success: '#22c55e', warning: '#f59e0b' },
      light: { bg: '#ffffff', text: '#000000', primary: '#000000', accent: '#525252', card: '#ffffff', panel: '#f5f5f5', muted: '#737373', border: '#e5e5e5', danger: '#dc2626', success: '#16a34a', warning: '#d97706' },
      mono: { bg: '#000000', text: '#ffffff', primary: '#ffffff', accent: '#ffffff', card: '#000000', panel: '#121212', muted: '#888888', border: '#333333', danger: '#ef4444', success: '#22c55e', warning: '#eab308' },
      warm: { bg: '#fbf9f5', text: '#1c1917', primary: '#1c1917', accent: '#78716c', card: '#ffffff', panel: '#f5eee4', muted: '#78716c', border: '#e7dfd5', danger: '#dc2626', success: '#16a34a', warning: '#ca8a04' },
      carbon: { bg: '#0d0e11', text: '#f0f2f5', primary: '#ffffff', accent: '#9ca3af', card: '#131418', panel: '#1a1c22', muted: '#6b7280', border: '#23262f', danger: '#ef4444', success: '#22c55e', warning: '#f59e0b' }
    };
    var t = themes[key] || themes.dark;
    var root = document.documentElement;
    for (var k in t) {
      root.style.setProperty('--' + k, t[k]);
    }
    root.setAttribute('data-theme', stored);
    if (key === 'dark' || key === 'mono' || key === 'carbon') {
      root.classList.add('dark');
    }
  } catch (e) {}
})();
`;

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="alternate icon" type="image/png" href="/logo.svg" />
        <link rel="apple-touch-icon" href="/logo.svg" />
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
