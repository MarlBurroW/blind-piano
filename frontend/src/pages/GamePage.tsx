import client from "../services/colyseus";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useAppStore from "../stores/app";
import useGameStore from "../stores/game";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { CreateIdentityModal } from "../components/modals/CreateIdentityModal";
import { IIdentity } from "../types";
import { PlayerItem } from "../components/PlayerItem";

export default function GamePage() {
  const { roomId } = useParams<{ roomId: string }>();

  const { players, storeGameState, gameRoom, storeGameRoom } = useGameStore(
    (state) => state
  );
  const { me } = useGameStore((state) => state.computed);

  const navigate = useNavigate();
  const { t } = useTranslation();

  const [isIdentityModalOpen, setIdentityModalOpen] = useState<any>(false);

  function onIdentityCreated(identity: IIdentity) {
    setIdentityModalOpen(false);
    gameRoom?.send("create-identity", identity);
  }

  useEffect(() => {
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
      } else {
        storeGameRoom(gameRoom);
      }
    }
    initGameRoom();
  }, []);

  function handleStateChange(state: any) {
    storeGameState(state);
  }

  useEffect(() => {
    if (gameRoom) {
      gameRoom.onMessage("create-identity", () => {
        setIdentityModalOpen(true);
      });

      gameRoom.onMessage("player-joined", (player) => {
        toast.info(
          t("notification_messages.player_joined", {
            nickname: player.nickname,
          })
        );
      });

      gameRoom.onMessage("player-left", (player) => {
        toast.info(
          t("notification_messages.player_left", {
            nickname: player.nickname,
          })
        );
      });

      gameRoom.onMessage("new-leader", (player) => {
        if (player.id === gameRoom.sessionId) {
          toast.info(t("notification_messages.you_are_new_leader"));
        } else {
          toast.info(
            t("notification_messages.new_leader", {
              nickname: player.nickname,
            })
          );
        }
      });

      gameRoom.onStateChange.once(handleStateChange);
      gameRoom.onStateChange(handleStateChange);
    }
  }, [gameRoom]);

  return (
    <div className="flex p-10 w-full">
      <div className="w-96  p-5 shadow-xl rounded-2xl text-center bg-base-200 dark:bg-base-800">
        <div className="font-bold text-2xl mb-5">{t("generic.players")}</div>
        {players.map((player) => {
          return (
            <PlayerItem
              key={player.id}
              className="mb-2"
              player={player}
            ></PlayerItem>
          );
        })}
      </div>

      <CreateIdentityModal
        isOpen={isIdentityModalOpen}
        onIdentityCreated={onIdentityCreated}
      />
    </div>
  );
}
