import EventEmitter from "eventemitter3";
import { IPatch } from "../../../common/types";
import { Instrument } from "../components/Instrument";

interface Props {
  buses: Map<string, EventEmitter>;
  patches: Map<string, IPatch>;
  outputs: Map<string, AudioNode>;
}

export function Instruments({ buses, patches, outputs }: Props) {
  const instruments = Array.from(patches)
    .filter(([playerId, patch]) => {
      const bus = buses.get(playerId);
      const output = outputs.get(playerId);

      if (!bus || !output || !patch) {
        return false;
      }

      return true;
    })
    .map(([playerId, patch]) => {
      const bus = buses.get(playerId);
      const output = outputs.get(playerId);

      return {
        playerId,
        bus,
        output,
        patch,
      };
    });

  return (
    <div>
      {instruments.map(({ bus, output, patch, playerId }) => {
        return (
          <Instrument
            key={playerId}
            bus={bus!}
            output={output!}
            patch={patch}
          />
        );
      })}
    </div>
  );
}
