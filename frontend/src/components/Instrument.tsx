import { useCallback, useEffect, useRef, useState } from "react";

import { IInstrument, IPlayerNote } from "../../../common/types";
import instrumentManager from "../classes/InstrumentManager";
import Track from "../classes/Track";

interface Props {
  track: Track;
}

export function Instrument({ track }: Props) {
  const instrumentRef = useRef<IInstrument | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      instrumentRef.current?.dispose();
    };
  }, []);

  const onTrackDataChanged = useCallback(() => {
    if (track.patch) {
      instrumentRef.current = instrumentManager.createInstrument(track.patch);
      instrumentRef.current?.setOutputNode(track.gainNode);

      setLoading(true);

      instrumentRef.current?.load().then(() => {
        setLoading(false);
      });
    }
  }, [track]);

  useEffect(() => {
    function noteOn(note: IPlayerNote) {
      instrumentRef.current?.playNote(note);
    }

    function noteOff(note: IPlayerNote) {
      instrumentRef.current?.stopNote(note);
    }

    track.bus.on("noteon", noteOn);
    track.bus.on("noteoff", noteOff);

    track.bus.on("track-data-changed", onTrackDataChanged);

    onTrackDataChanged();

    return () => {
      track.bus.off("noteon", noteOn);
      track.bus.off("noteoff", noteOff);
      track.bus.off("track-data-changed", onTrackDataChanged);

      instrumentRef.current?.dispose();
    };
  }, [track, onTrackDataChanged]);

  return <></>;
}
