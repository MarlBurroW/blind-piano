import { useCallback, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { CreateIdentityModal } from "../components/modals/CreateIdentityModal";
import { IIdentity } from "../../../common/types";
import toast from "react-hot-toast";
import { GameContext } from "../components/context/GameContext";
import { AudioContext } from "../components/context/AudioContext";
import { PageTransition } from "../PageTransition";

import { Keyboard } from "../components/Keyboard";
import { GamePanel } from "../components/GamePanel";
import { RightPanel } from "../components/RightPanel";
import { LeftPanel } from "../components/LeftPanel";
import { Panel } from "../components/Panel";
import { useMediaQuery } from "usehooks-ts";
import { useCopyToClipboard } from "usehooks-ts";

import { useMe, useGameRoom, useIdentityModalControl } from "../hooks/hooks";
import { Button } from "../components/form/Button";
import { Instruments } from "../components/Instruments";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";

import { IoPeopleOutline } from "react-icons/io5";

export default function GamePage() {
  const { t } = useTranslation();

  const { setState, leaveGame } = useContext(GameContext);

  const isSmall = useMediaQuery("(max-width: 90rem)");

  const me = useMe();
  const gameRoom = useGameRoom();
  const { closeIdentityModal, isIdentityModalOpen } = useIdentityModalControl();

  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(false);
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
      <div className="flex h-full max-h-[calc(100vh-80px)] py-5 px-5">
        <div
          onClick={() => {
            setIsLeftPanelOpen(false);
            setIsRightPanelOpen(false);
          }}
          className={`${
            (isLeftPanelOpen || isRightPanelOpen) && isSmall
              ? "opacity-70"
              : "opacity-0 pointer-events-none"
          } absolute bg-black top-0 bottom-0 left-0 right-0  z-30 transition-opacity `}
        ></div>
        <div
          style={{
            transform: `translateX(${isSmall && !isLeftPanelOpen ? -120 : 0}%)`,
          }}
          className={`${
            isSmall ? `absolute top-0 left-0 bottom-0 z-40  ` : ""
          } h-full w-96 shrink-0 transition-transform`}
        >
          <LeftPanel></LeftPanel>
        </div>

        <div className="grow flex flex-col items-center px-4 overflow-x-auto">
          <Panel className="flex justify-between  mb-4">
            {isSmall && (
              <IoPeopleOutline
                className="h-8 w-8 cursor-pointer"
                onClick={() => setIsLeftPanelOpen(!isLeftPanelOpen)}
              />
            )}

            <div>
              <span className="font-bold mr-4">
                {gameRoom ? gameRoom.state.name : ""}
              </span>

              <Button onClick={handleInviteFriends} size="sm" style="primary">
                {t("generic.invite_friends")}
              </Button>
            </div>
            {isSmall && (
              <HiOutlineChatBubbleLeftRight
                className="h-8 w-8 cursor-pointer"
                onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
              />
            )}
          </Panel>

          <GamePanel></GamePanel>
          <Keyboard></Keyboard>
        </div>

        <div
          style={{
            transform: `translateX(${isSmall && !isRightPanelOpen ? 120 : 0}%)`,
          }}
          className={`${
            isSmall ? `absolute z-40 top-0 right-0 bottom-0 ` : ""
          } h-full w-96 shrink-0 transition-transform`}
        >
          <RightPanel></RightPanel>
        </div>
      </div>

      <CreateIdentityModal
        isOpen={isIdentityModalOpen || !!!me}
        onIdentityValidated={handleIdentityValidated}
        defaultIdentity={me ? me : null}
        onClose={() =>
          me
            ? setState((draft) => {
                draft.isIdentityModalOpen = false;
              })
            : null
        }
      />
    </PageTransition>
  );
}
