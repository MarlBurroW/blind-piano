import { useCallback, useContext, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { IoPeopleOutline } from "react-icons/io5";
import { useMediaQuery } from "usehooks-ts";
import { useCopyToClipboard } from "usehooks-ts";

import { IIdentity } from "../../../common/types";
import { PageTransition } from "../PageTransition";
import { GamePanel } from "../components/GamePanel";
import { Instruments } from "../components/Instruments";
import { Keyboard } from "../components/Keyboard";
import { LeftPanel } from "../components/LeftPanel";
import { Panel } from "../components/Panel";
import { RightPanel } from "../components/RightPanel";
import { AudioContext } from "../components/context/AudioContext";
import { GameContext } from "../components/context/GameContext";
import { Button } from "../components/form/Button";
import { CreateIdentityModal } from "../components/modals/CreateIdentityModal";
import { useGameRoom, useIdentityModalControl, useMe } from "../hooks/hooks";

export default function GamePage() {
  const { t } = useTranslation();

  const { setState, leaveGame } = useContext(GameContext);

  const isSmall = useMediaQuery("(max-width: 90rem)");

  const me = useMe();
  const gameRoom = useGameRoom();
  const { closeIdentityModal, isIdentityModalOpen } = useIdentityModalControl();

  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);

  const handleIdentityValidated = useCallback(
    (identity: IIdentity) => {
      closeIdentityModal();

      gameRoom?.send("update-identity", identity);
    },
    [gameRoom, isIdentityModalOpen, closeIdentityModal]
  );

  const [value, copy] = useCopyToClipboard();
  const handleInviteFriends = useCallback(() => {
    toast.success(t("notification_messages.link_copied"));
    copy(window.location.href);
  }, [copy]);

  // On game room change, listen to events

  return (
    <PageTransition>
      <div className="flex h-full max-h-[100vh] py-5 px-5">
        <div className="grow flex flex-col items-center px-4 overflow-x-auto">
          <Panel className="flex justify-between  mb-4">
            <div>
              <span className="font-bold mr-4">
                {gameRoom ? gameRoom.state.name : ""}
              </span>

              <Button onClick={handleInviteFriends} size="sm" style="primary">
                {t("generic.invite_friends")}
              </Button>
            </div>

            <HiOutlineChatBubbleLeftRight
              className="h-8 w-8 cursor-pointer"
              onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
            />
          </Panel>

          <GamePanel></GamePanel>
          <Keyboard></Keyboard>
        </div>

        <div
          style={{
            width: `${isRightPanelOpen ? "24rem" : "0px"}`,
          }}
          className={`relative h-full w-96 shrink-0 transition-all overflow-hidden`}
        >
          <div className="absolute w-96 left-0 right-0 bottom-0 top-0">
            <RightPanel></RightPanel>
          </div>
        </div>
      </div>

      <CreateIdentityModal
        isOpen={isIdentityModalOpen || !!!me}
        onIdentityValidated={handleIdentityValidated}
        defaultIdentity={me ? me : null}
        onClose={() =>
          me
            ? setState(draft => {
                draft.isIdentityModalOpen = false;
              })
            : null
        }
      />
    </PageTransition>
  );
}
