import { createBrowserRouter } from "react-router-dom";
import LobbyPage from "./pages/LobbyPage";
import GamePage from "./pages/GamePage";
import MissingPage from "./pages/MissingPage";
export default createBrowserRouter([
  {
    path: "*",
    element: <MissingPage />,
  },
  {
    path: "/",
    element: <LobbyPage />,
  },
  {
    path: "/games/:roomId",
    element: <GamePage />,
  },
]);
