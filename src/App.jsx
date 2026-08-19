import { ThemeProvider } from "./context/ThemeContext";
import Home from "./pages/Home/Home";
import Background from "./components/Background/Background";
import Cursor from "./components/Cursor/Cursor";

function App() {
  return (
    <ThemeProvider>
      <Background />
      <Cursor />
      <main id="main-content">
        <Home />
      </main>
    </ThemeProvider>
  );
}

export default App;
