import LobbyPage from "./pages/LobbyPage";
import GamePage from "./pages/GamePage";
import { Route, Routes, useLocation } from "react-router-dom";
import { GameProvider } from "../src/components/context/GameContext";
import { AnimatePresence } from "framer-motion";
import { AudioProvider } from "./components/context/AudioContext";
import { useMemo } from "react";

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
              <AudioProvider>
                <GamePage />
              </AudioProvider>
            </GameProvider>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}
