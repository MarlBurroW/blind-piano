import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { usePlayers } from "../../../hooks/hooks";
import { Avatar } from "../../Avatar";
import { SelectPlayerModal } from "../../modals/SelectPlayerModal";

interface Props {
  value: string | null;
  onChange: (value: string | null) => void;
  [x: string]: any;
}

export const PlayerInput = (props: Props) => {
  const players = usePlayers();

  const player = players.find(player => player.id === props.value);

  const { t } = useTranslation();

  const [selectPlayerModal, setSelectPlayerModal] = useState(false);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter") {
        // Effectuez l'action souhaitée, par exemple, ouvrir une modal
        setSelectPlayerModal(true);
      }
    },
    []
  );

  useEffect(() => {
    if (player) {
      props.onChange(player.id);
    } else {
      props.onChange(null);
    }
  }, [players, player]);

  return (
    <>
      <SelectPlayerModal
        onSelected={player => props.onChange(player.id)}
        defaultPlayer={player || null}
        isOpen={selectPlayerModal}
        onClose={() => setSelectPlayerModal(false)}
      ></SelectPlayerModal>

      <div
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onClick={() => setSelectPlayerModal(true)}
        style={{
          borderColor: player?.color,
          borderLeftWidth: player ? 8 : 0,
        }}
        className={`w-full cursor-pointer flex items-center bg-shade-200 mb-2 py-4 px-5 outline-none ring-primary-300 focus:outline-none focus:ring rounded-3xl`}
      >
        {player && (
          <Avatar
            background={true}
            circle
            size={30}
            seed={player.avatarSeed}
            className="mr-4"
          ></Avatar>
        )}

        {player ? player.nickname : t("inputs.player_input.placeholder")}
      </div>
    </>
  );
};
export default PlayerInput;
