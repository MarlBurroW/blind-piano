import { Panel } from "../components/Panel";
import { useTranslation } from "react-i18next";
import { Button } from "../components/form/Button";
import { useGameRoom } from "../hooks/hooks";
import { useState } from "react";
import { TrackModal } from "./modals/TrackModal";

export function GamePanel() {
  const gameRoom = useGameRoom();

  const { t } = useTranslation();

  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);

  return (
    <Panel padding={0} className="h-full mb-4">
      <Button onClick={() => setIsTrackModalOpen(true)}>Add track</Button>

      <TrackModal
        track={null}
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
      />
    </Panel>
  );
}

export default GamePanel;
