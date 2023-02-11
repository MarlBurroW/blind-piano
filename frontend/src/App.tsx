import { RouterProvider } from "react-router-dom";
import router from "./router";
import { useEffect } from "react";
import { useAppStore } from "./stores/app";

import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { ThemeSwitcher } from "./components/ThemeSwitcher";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const { theme } = useAppStore((state) => state);

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
      className={`h-full dark:text-slate-300 text-slate-700 font-sans gradient-background  flex flex-col`}
    >
      <ul className="circles z-0">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      <div className="flex px-5 py-5 shrink z-10">
        <h1 className="text-xl font-bold text-white uppercase ">Blind Piano</h1>
        <div className="grow"></div>
        <LanguageSwitcher className="mr-5" />
        <ThemeSwitcher />
      </div>
      <div className="flex grow ">
        <RouterProvider router={router} />
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme && theme == "dark" ? "dark" : "light"}
      />
    </div>
  );
}

export default App;
