import { Room } from "colyseus.js";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { DraftFunction, useImmer } from "use-immer";

import { Game } from "../../../../backend/schemas/Game";
import { Message } from "../../../../backend/schemas/Message";
import { IPlayer, IPlayerNote, ITrack } from "../../../../common/types";
import {
  onNewLeader,
  onPlayerJoined,
  onPlayerKicked,
  onPlayerLeft,
} from "../../handlers/GameHandlers";
import client from "../../services/colyseus";
import sfx from "../../services/sfx";
import { useAppStore } from "../../stores/app";
import { MidiContext } from "./MidiContext";
import { ServiceWorkerContext } from "./ServiceWorkerContext";

type State = {
  gameState: Game | null;
  isIdentityModalOpen: boolean;
  isChatPanelOpen: boolean;
};

interface IGameContext {
  setState: (state: State | DraftFunction<State>) => void;
  leaveGame: () => void;
  gameRoom: Room<Game> | null;
  players: Array<IPlayer>;
  tracks: Array<ITrack>;
  me: IPlayer | null;
  leader: IPlayer | null;
  isLeader: boolean;
  isIdentityModalOpen: boolean;
  messages: Array<Message>;
  gameState: Game | null;
  isChatPanelOpen: boolean;
  setIsChatPanelOpen: (isOpen: boolean) => void;
}

const initialContextValues = {
  setState: () => {},
  leaveGame: () => {},
  gameRoom: null,
  players: [],
  tracks: [],
  isIdentityModalOpen: false,
  me: null,
  leader: null,
  isLeader: false,
  messages: [],
  gameState: null,
  isChatPanelOpen: false,
  setIsChatPanelOpen: () => {},
};

const initialState = {
  gameState: null,
  isIdentityModalOpen: false,
  isChatPanelOpen: false,
};

export const GameContext =
  React.createContext<IGameContext>(initialContextValues);

export function GameProvider({ children }: { children: React.ReactNode }) {
  // Context

  const { midiBus$: midiBus } = useContext(MidiContext);
  const { cacheStatus, openCacheModal } = useContext(ServiceWorkerContext);

  // Navigation

  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();

  // Get game room from store

  const { gameRoom, storeGameRoom } = useAppStore(state => state);

  // Translation

  const { t } = useTranslation();

  // Create state

  const [state, setState] = useImmer<State>(initialState);

  // Reset state function

  function resetState() {
    setState(initialState);
  }

  // Extract state

  const { gameState, isIdentityModalOpen, isChatPanelOpen } = state;

  // Callbacks handlers

  const handleStateChange = (gameState: Game) => {
    setState(draft => {
      draft.gameState = gameState.clone();
    });
  };

  const players = useMemo(() => {
    return gameState && gameRoom
      ? (Array.from(gameState.players.entries()).map(
          p => p[1] as unknown
        ) as IPlayer[])
      : [];
  }, [gameState]);

  const tracks = useMemo<Array<ITrack>>(() => {
    return gameState && gameRoom
      ? Array.from(gameState.tracks.entries()).map(p => p[1])
      : [];
  }, [gameState]);

  const me = useMemo(() => {
    if (gameState && gameRoom) {
      const me = gameState.players.get(gameRoom?.sessionId);
      return me ? me : null;
    }
    return null;
  }, [players]) as IPlayer | null;

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
  }, [players]) as IPlayer | null;

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

  const setIsChatPanelOpen = useCallback((isOpen: boolean) => {
    setState(draft => {
      draft.isChatPanelOpen = isOpen;
    });
  }, []);

  useEffect(() => {
    async function initGameRoom() {
      if (!gameRoom) {
        if (roomId) {
          try {
            const room = await client.joinById<Game>(roomId);

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

    return () => {};
  }, []);

  useEffect(() => {
    openCacheModal();
  }, [cacheStatus]);

  // Detect when new room is created, and bind the state change handler

  useEffect(() => {
    if (gameRoom) {
      gameRoom.onStateChange.once(handleStateChange);
      gameRoom.onStateChange(handleStateChange);
      gameRoom.onMessage("player-joined", player =>
        onPlayerJoined(player, gameRoom)
      );
      gameRoom.onMessage("player-kicked", player =>
        onPlayerKicked(player, gameRoom)
      );
      gameRoom.onMessage("player-left", player => onPlayerLeft(player));

      gameRoom.onLeave(() => {
        leaveGame();
      });
      gameRoom.onMessage("new-leader", player => {
        onNewLeader(player, meRef.current);
      });

      gameRoom.onMessage("chat-message", message => {
        sfx.playSound("chat-message");
      });

      gameRoom.onMessage("noteon", (note: IPlayerNote) => {
        midiBus?.emit("noteon", note);
      });

      gameRoom.onMessage("noteoff", (note: IPlayerNote) => {
        midiBus?.emit("noteoff", note);
      });
    }

    return () => {
      gameRoom?.removeAllListeners();
    };
  }, [gameRoom, midiBus]);

  return (
    <GameContext.Provider
      value={{
        leaveGame,
        setState,
        gameRoom,
        isIdentityModalOpen,
        players,
        tracks,
        me,
        leader,
        isLeader,
        gameState,
        isChatPanelOpen,
        setIsChatPanelOpen,
        messages: gameState ? Array.from(gameState.messages) : [],
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
