import { AnimatePresence } from "framer-motion";
import { useMemo } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import { GameProvider } from "../src/components/context/GameContext";
import { AudioProvider } from "./components/context/AudioContext";
import { SequencerProvider } from "./components/context/SequencerContext";
import GamePage from "./pages/GamePage";
import LobbyPage from "./pages/LobbyPage";

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
              <SequencerProvider>
                <AudioProvider>
                  <GamePage />
                </AudioProvider>
              </SequencerProvider>
            </GameProvider>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}
