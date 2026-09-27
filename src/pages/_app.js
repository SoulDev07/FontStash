import "../styles/globals.css";
import { ThemeProvider } from "@/lib/context/ThemeContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <DndProvider backend={HTML5Backend}>
        <Component {...pageProps} />
      </DndProvider>
    </ThemeProvider>
  );
}
