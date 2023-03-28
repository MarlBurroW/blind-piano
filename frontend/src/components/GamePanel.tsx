import { Panel } from "../components/Panel";
import { useTranslation } from "react-i18next";
import { useCallback, useContext } from "react";
import { GameContext } from "../components/context/GameContext";
import { useCopyToClipboard } from "usehooks-ts";
import { Button } from "../components/form/Button";
import { RxExit } from "react-icons/rx";
import toast from "react-hot-toast";
import { useGameRoom, useGameActions } from "../hooks/hooks";

export function GamePanel() {
  const gameRoom = useGameRoom();
  const { leaveGame } = useGameActions();

  const [value, copy] = useCopyToClipboard();
  const { t } = useTranslation();

  const handleInviteFriends = useCallback(() => {
    toast.success(t("notification_messages.link_copied"));
    copy(window.location.href);
  }, [copy]);

  return (
    <Panel padding={0} className="h-full mb-4">
      <div className="flex justify-between items-center p-5 bg-shade-300 rounded-t-3xl">
        <div>
          <span className="font-bold mr-4">
            {gameRoom ? gameRoom.state.name : ""}
          </span>

          <Button onClick={handleInviteFriends} size="sm" style="primary">
            {t("generic.invite_friends")}
          </Button>
        </div>

        <button onClick={() => leaveGame()}>
          <RxExit />
        </button>
      </div>
    </Panel>
  );
}

export default GamePanel;
