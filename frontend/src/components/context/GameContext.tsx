import React, { useEffect, useCallback, useMemo, useRef } from "react";

import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import { Game } from "../../../../backend/schemas/Game";
import { Player } from "../../../../backend/schemas/Player";
import { Message } from "../../../../backend/schemas/Message";
import { useImmer, DraftFunction } from "use-immer";
import { Room } from "colyseus.js";
import toast from "react-hot-toast";

import client from "../../services/colyseus";
import { useTranslation } from "react-i18next";
import { useAppStore } from "../../stores/app";

import {
  onPlayerJoined,
  onPlayerKicked,
  onPlayerLeft,
  onNewLeader,
} from "../../handlers/GameHandlers";
import sfx from "../../services/sfx";

type State = {
  gameState: Game | null;
  isIdentityModalOpen: boolean;
};

interface IGameContext {
  setState: (state: State | DraftFunction<State>) => void;
  leaveGame: () => void;
  gameRoom: Room | null;
  players: Array<Player>;
  me: Player | null;
  leader: Player | null;
  isLeader: boolean;
  isIdentityModalOpen: boolean;
  messages: Array<Message>;
}

const initialContextValues = {
  setState: () => {},
  leaveGame: () => {},
  gameRoom: null,
  players: [],
  isIdentityModalOpen: false,
  me: null,
  leader: null,
  isLeader: false,
  messages: [],
};

const initialState = {
  gameState: null,
  isIdentityModalOpen: false,
};

export const GameContext =
  React.createContext<IGameContext>(initialContextValues);

export function GameProvider({ children }: { children: React.ReactNode }) {
  // Navigation

  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();

  // Get game room from store

  const { gameRoom, storeGameRoom } = useAppStore((state) => state);

  // Translation

  const { t } = useTranslation();

  // Create state

  const [state, setState] = useImmer<State>(initialState);

  // Reset state function

  function resetState() {
    setState(initialState);
  }

  // Extract state

  const { gameState, isIdentityModalOpen } = state;

  // Callbacks handlers

  const handleStateChange = (gameState: Game) => {
    console.log("STATE CHANGE", gameState);
    setState((draft) => {
      draft.gameState = gameState.clone();
    });
  };

  const players = useMemo(() => {
    return gameState && gameRoom
      ? Array.from(gameState.players.entries()).map((p) => p[1])
      : [];
  }, [gameState]);

  const me = useMemo(() => {
    if (gameState && gameRoom) {
      const me = gameState.players.get(gameRoom?.sessionId);
      return me ? me : null;
    }
    return null;
  }, [players]);

  const meRef = useRef(me);

  useEffect(() => {
    meRef.current = me;
  }, [me]);

  const leader = useMemo(() => {
    if (gameState && gameState.leaderId && gameRoom) {
      const leader = gameState.players.get(gameState.leaderId);
      return leader ? leader : null;
    }
    return null;
  }, [players]);

  const isLeader = useMemo(() => {
    if (leader && me) {
      return leader.id === me.id;
    }
    return false;
  }, [leader, me]);

  const leaveGame = useCallback(() => {
    if (gameRoom) {
      gameRoom?.leave();
      gameRoom?.removeAllListeners();
      storeGameRoom(null);
      navigate("/");
    }
  }, [gameRoom]);

  useEffect(() => {
    console.log("PROVIDER MOUNTED");
    async function initGameRoom() {
      if (!gameRoom) {
        if (roomId) {
          try {
            const room = await client.joinById(roomId);
            storeGameRoom(room);
          } catch (err) {
            toast.error(t("client_error_messages.join_failed"));
            navigate("/");
          }
        } else {
          navigate("/");
        }
      }
    }

    initGameRoom();

    return () => {
      console.log("PROVIDER UNMOUNTED");
    };
  }, []);

  // Detect when new room is created, and bind the state change handler

  useEffect(() => {
    if (gameRoom) {
      gameRoom.onStateChange.once(handleStateChange);
      gameRoom.onStateChange(handleStateChange);
      gameRoom.onMessage("player-joined", (player) =>
        onPlayerJoined(player, gameRoom)
      );
      gameRoom.onMessage("player-kicked", (player) =>
        onPlayerKicked(player, gameRoom)
      );
      gameRoom.onMessage("player-left", (player) => onPlayerLeft(player));

      gameRoom.onLeave(() => {
        leaveGame();
      });
      gameRoom.onMessage("new-leader", (player) => {
        console.log("new-leader");
        onNewLeader(player, meRef.current);
      });

      gameRoom.onMessage("chat-message", (message) => {
        sfx.playSound("chat-message");
      });
    }

    return () => {
      gameRoom?.removeAllListeners();
    };
  }, [gameRoom]);

  return (
    <GameContext.Provider
      value={{
        leaveGame,
        setState,
        gameRoom,
        isIdentityModalOpen,
        players,
        me,
        leader,
        isLeader,
        messages: gameState ? gameState.messages : [],
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
