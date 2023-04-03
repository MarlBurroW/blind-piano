import { IPatch, IInstrument, IPlayerNote } from "../../../common/types";

import { useEffect, useRef, useState } from "react";
import EventEmitter from "eventemitter3";
import instrumentManager from "../classes/InstrumentManager";

interface Props {
  patch: IPatch;
  bus: EventEmitter;
  output: AudioNode;
}

export function Instrument({ patch, bus, output }: Props) {
  const instrumentRef = useRef<IInstrument | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      instrumentRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    instrumentRef.current = instrumentManager.createInstrument(patch);

    instrumentRef.current?.setOutputNode(output);

    setLoading(true);
    instrumentRef.current?.load().then(() => {
      setLoading(false);
    });

    function noteOn(note: IPlayerNote) {
      instrumentRef.current?.playNote(note);
    }

    function noteOff(note: IPlayerNote) {
      instrumentRef.current?.stopNote(note);
    }

    bus.on("noteon", noteOn);
    bus.on("noteoff", noteOff);

    return () => {
      bus.off("noteon", noteOn);
      bus.off("noteoff", noteOff);
      instrumentRef.current?.setOutputNode(output);
      instrumentRef.current?.dispose();
    };
  }, [patch]);

  return <></>;
}
