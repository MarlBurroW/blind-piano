import { useCallback, useContext } from "react";
import { useTranslation } from "react-i18next";
import { CreateIdentityModal } from "../components/modals/CreateIdentityModal";
import { IIdentity } from "../../../common/types";

import { GameContext } from "../components/context/GameContext";
import { PageTransition } from "../PageTransition";

import { Keyboard } from "../components/Keyboard";
import { GamePanel } from "../components/GamePanel";
import { RightPanel } from "../components/RightPanel";
import { LeftPanel } from "../components/LeftPanel";

import { useMe, useGameRoom, useIdentityModalControl } from "../hooks/hooks";

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

  // On game room change, listen to events

  return (
    <PageTransition>
      <div className="flex h-full max-h-[calc(100vh-80px)] py-5 px-5">
        <div className="h-full w-96 shrink-0">
          <LeftPanel></LeftPanel>
        </div>
        <div className="grow flex flex-col items-center px-4 overflow-x-auto">
          <GamePanel></GamePanel>
          <Keyboard></Keyboard>
        </div>

        <div className="shrink-0 h-full w-96">
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
