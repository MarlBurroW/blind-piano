import { useEffect, useContext } from "react";
import { useAppStore } from "./stores/app";

import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { ThemeSwitcher } from "./components/ThemeSwitcher";
import { Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";

import { BrowserRouter as Router } from "react-router-dom";

import { AnimatedRoutes } from "./Routes";

import { useLocalStorage } from "usehooks-ts";
import Logo from "./assets/midi-keyboard.png";
import Background from "./assets/background.png";

import { useTranslation } from "react-i18next";

import { MidiContext } from "./components/context/MidiContext";

function App() {
  const { theme, storeTheme } = useAppStore((state) => state);
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
      className="h-full bg-cover relative"
      style={{ backgroundImage: `url(${Background})` }}
    >
      <div className="opacity-90 bg-gradient-to-b from-shade-600 to-shade-900 absolute inset-0"></div>
      <div className={`h-full text-white flex flex-col  font-sans relative`}>
        <div className="flex px-5 py-5 shrink z-10  ">
          <h1 className=" font-normal flex items-center uppercase text-transparent text-xl bg-clip-text bg-gradient-to-r from-secondary-400 to-primary-400">
            <img className="h-10 mr-5" src={Logo}></img> Blind Piano
          </h1>
          <div className="grow"></div>
          <LanguageSwitcher className="mr-5" />
        </div>

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
