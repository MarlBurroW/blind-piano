import { useEffect } from "react";
import { useAppStore } from "./stores/app";

import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { ThemeSwitcher } from "./components/ThemeSwitcher";
import { Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";

import { BrowserRouter as Router } from "react-router-dom";

import { AnimatedRoutes } from "./Routes";

import { useLocalStorage } from "usehooks-ts";

function App() {
  const { theme, storeTheme } = useAppStore((state) => state);
  const [storedTheme, setStoredTheme] = useLocalStorage<string>(
    "theme",
    "light"
  );

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
      className={`h-screen text-white flex flex-col   font-sans bg-gradient-to-b from-shade-500 to-shade-800`}
    >
      <div className="flex px-5 py-5 shrink z-10  ">
        <h1 className="text-xl font-bolduppercase ">Blind Piano</h1>
        <div className="grow"></div>
        <LanguageSwitcher className="mr-5" />
      </div>

      <div className="flex-1 h-[10vh]">
        <Router>
          <AnimatedRoutes></AnimatedRoutes>
        </Router>
      </div>

      <Toaster />
    </div>
  );
}

export default App;
