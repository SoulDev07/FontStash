import '../styles/globals.css';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { ThemeProvider } from '@/lib/context/ThemeContext';

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <DndProvider backend={HTML5Backend}>
        <Component {...pageProps} />
      </DndProvider>
    </ThemeProvider>
  );
}
