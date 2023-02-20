import LobbyPage from "./pages/LobbyPage";
import GamePage from "./pages/GamePage";
import { Route, Routes, useLocation } from "react-router-dom";
import { GameProvider } from "../src/components/context/GameContext";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "./PageTransition";

export function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LobbyPage />} />

        <Route
          path="/games/:roomId"
          element={
            <GameProvider>
              <GamePage />
            </GameProvider>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}
