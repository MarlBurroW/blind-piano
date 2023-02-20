import { useEffect } from "react";
import { useAppStore } from "./stores/app";

import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { ThemeSwitcher } from "./components/ThemeSwitcher";
import { ToastContainer } from "react-toastify";
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
      className={`h-screen flex flex-col dark:text-slate-300 text-slate-700 font-sans gradient-background`}
    >
      <div className="flex px-5 py-5 shrink z-10">
        <h1 className="text-xl font-bold text-white uppercase ">Blind Piano</h1>
        <div className="grow"></div>
        <LanguageSwitcher className="mr-5" />
        <ThemeSwitcher />
      </div>

      <div className="flex-1 h-[10vh]">
        <Router>
          <AnimatedRoutes></AnimatedRoutes>
        </Router>
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        pauseOnFocusLoss={false}
        closeOnClick
        rtl={false}
        draggable
        pauseOnHover
        theme={theme && theme == "dark" ? "dark" : "light"}
      />
    </div>
  );
}

export default App;
