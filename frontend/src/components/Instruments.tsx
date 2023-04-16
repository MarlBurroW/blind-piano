import Track from "../classes/Track";
import { Instrument } from "../components/Instrument";

interface Props {
  tracks: Record<string, Track>;
}

export function Instruments({ tracks }: Props) {
  return (
    <div>
      {Object.keys(tracks).map(trackId => {
        return <Instrument key={trackId} track={tracks[trackId]} />;
      })}
    </div>
  );
}
