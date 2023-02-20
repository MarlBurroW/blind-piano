import { useCallback, useContext } from "react";
import { useTranslation } from "react-i18next";
import { CreateIdentityModal } from "../components/modals/CreateIdentityModal";
import { IIdentity } from "../types";
import { PlayerList } from "../components/PlayerList";
import { GameContext } from "../components/context/GameContext";
import { PageTransition } from "../PageTransition";
import { Chat } from "../components/Chat";

export default function GamePage() {
  const { t } = useTranslation();

  const { me, isIdentityModalOpen, setState, gameRoom, leaveGame } =
    useContext(GameContext);

  const handleIdentityValidated = useCallback(
    (identity: IIdentity) => {
      setState((draft) => {
        draft.isIdentityModalOpen = false;
      });

      gameRoom?.send("update-identity", identity);
    },
    [gameRoom, isIdentityModalOpen]
  );

  // On game room change, listen to events

  return (
    <PageTransition>
      <div className="flex w-full h-full px-5 py-5">
        <div className="w-96 p-5 shadow-xl flex flex-col rounded-2xl text-center  bg-base-200 dark:bg-base-800">
          <div className="font-bold text-2xl mb-5">{t("generic.players")}</div>
          <div className="grow">
            <PlayerList />
          </div>

          <button onClick={() => leaveGame()}>Back</button>
        </div>
        <div className="grow flex flex-col justify-center items-center"></div>

        <div className="w-96 p-5 flex flex-col shadow-xl rounded-2xl text-center bg-base-200 dark:bg-base-800">
          <div className="font-bold shrink text-2xl mb-5">
            {t("generic.chat")}
          </div>
          <Chat />
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
