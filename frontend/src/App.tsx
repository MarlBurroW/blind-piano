import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { BrowserRouter as Router } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useLocalStorage } from "usehooks-ts";

import { AnimatedRoutes } from "./Routes";
import Background from "./assets/background.png";
import Logo from "./assets/midi-keyboard.png";
import { SVGSymbols } from "./components/Icon";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { MidiContext } from "./components/context/MidiContext";
import { useAppStore } from "./stores/app";

function App() {
  const { theme, storeTheme } = useAppStore(state => state);
  const [storedTheme, setStoredTheme] = useLocalStorage<string>(
    "theme",
    "light"
  );
  const { t } = useTranslation();
  useEffect(() => {
    storeTheme(storedTheme);
  }, []);

  useEffect(() => {
    if (document) {
      if (theme == "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [theme]);

  return (
    <div
      className="h-full bg-cover relative overflow-hidden"
      style={{ backgroundImage: `url(${Background})` }}
    >
      <SVGSymbols></SVGSymbols>
      <div className="opacity-90 bg-gradient-to-b from-shade-600 to-shade-900 absolute inset-0"></div>
      <div className={`h-full text-white flex flex-col  font-sans relative`}>
        <div className="flex-1">
          <Router>
            <AnimatedRoutes></AnimatedRoutes>
          </Router>
        </div>

        <Toaster />
      </div>
    </div>
  );
}

export default App;
