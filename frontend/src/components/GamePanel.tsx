import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Panel } from "../components/Panel";
import { Button } from "../components/form/Button";
import { useGameRoom, useTracks } from "../hooks/hooks";
import { TrackModal } from "./modals/TrackModal";

export function GamePanel() {
  const gameRoom = useGameRoom();
  const tracks = useTracks();

  const { t } = useTranslation();

  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);

  return (
    <Panel padding={0} className="h-full mb-4">
      <Button onClick={() => setIsTrackModalOpen(true)}>Add track</Button>

      <TrackModal
        track={null}
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
        onCreated={track => gameRoom?.send("add-track", track)}
      />

      <div>
        {tracks.map(track => (
          <div className="mb-2" key={track.id}>
            {JSON.stringify(track)}
          </div>
        ))}
      </div>
    </Panel>
  );
}

export default GamePanel;
