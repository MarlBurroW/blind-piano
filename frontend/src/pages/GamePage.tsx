import { useCallback, useContext } from "react";
import { useTranslation } from "react-i18next";
import { CreateIdentityModal } from "../components/modals/CreateIdentityModal";
import { IIdentity } from "../types";
import { PlayerList } from "../components/PlayerList";
import { GameContext } from "../components/context/GameContext";
import { PageTransition } from "../PageTransition";
import { Chat } from "../components/Chat";
import { RxExit } from "react-icons/rx";
import { Button } from "../components/form/Button";
import { useCopyToClipboard } from "usehooks-ts";

export default function GamePage() {
  const { t } = useTranslation();

  const { me, isIdentityModalOpen, setState, gameRoom, leaveGame } =
    useContext(GameContext);

  const [value, copy] = useCopyToClipboard();

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
      <div className="flex w-full h-full  py-5 px-5">
        <div className="w-96 p-5 shadow-2xl rounded-3xl bg-gradient-to-b from-shade-400 to-shade-600">
          <div className="font-bold text-2xl mb-5 text-center">
            {t("generic.players")}
          </div>
          <div className="grow">
            <PlayerList />
          </div>
        </div>
        <div className="grow flex flex-col items-center px-4">
          <div className="w-full h-full overflow-hidden text-center shadow-2xl rounded-3xl bg-gradient-to-b from-shade-400 to-shade-500 mb-4">
            <div className="flex justify-between items-center p-5 bg-shade-600">
              <div>
                <span className="font-bold mr-4">
                  {gameRoom ? gameRoom.state.name : ""}
                </span>

                <Button onClick={() => copy("A")} size="sm" style="primary">
                  Copy link
                </Button>

                <p>Copied value: {value ?? "Nothing is copied yet!"}</p>
              </div>

              <button onClick={() => leaveGame()}>
                <RxExit />
              </button>
            </div>
          </div>
          <div className="w-full h-full p-5  h-[500px] text-center shadow-2xl rounded-3xl bg-gradient-to-b from-shade-400 to-shade-600"></div>
        </div>

        <div className="w-96 p-5 flex flex-col  shadow-2xl rounded-3xl bg-gradient-to-b from-shade-400 to-shade-600">
          <div className="font-bold shrink text-2xl mb-5 text-center">
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
