import { useCallback, useContext, useState } from "react";
import { useTranslation } from "react-i18next";

import { IIdentity } from "../../../common/types";
import { PageTransition } from "../PageTransition";
import { GamePanel } from "../components/GamePanel";
import { Keyboard } from "../components/Keyboard";
import { MenuBar } from "../components/MenuBar";
import { RightPanel } from "../components/RightPanel";
import { GameContext } from "../components/context/GameContext";
import { CreateIdentityModal } from "../components/modals/CreateIdentityModal";
import {
  useGameRoom,
  useIdentityModalControl,
  useMe,
  usePlayers,
  useUIControl,
} from "../hooks/hooks";

export default function GamePage() {
  const { t } = useTranslation();

  const { setState, leaveGame } = useContext(GameContext);

  const me = useMe();
  const gameRoom = useGameRoom();
  const { closeIdentityModal, isIdentityModalOpen } = useIdentityModalControl();

  const handleIdentityValidated = useCallback(
    (identity: IIdentity) => {
      closeIdentityModal();

      gameRoom?.send("update-identity", identity);
    },
    [gameRoom, isIdentityModalOpen, closeIdentityModal]
  );

  const { isChatPanelOpen } = useUIControl();

  // On game room change, listen to events

  return (
    <PageTransition>
      <div className="flex h-full max-h-[100vh] py-5 px-5">
        <div className="grow flex flex-col items-center px-4 overflow-x-auto">
          <MenuBar></MenuBar>

          <GamePanel></GamePanel>
          <Keyboard></Keyboard>
        </div>

        <div
          style={{
            width: `${isChatPanelOpen ? "24rem" : "0px"}`,
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
