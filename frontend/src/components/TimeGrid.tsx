import { throttle } from "lodash";
import { useContext, useEffect, useRef, useState } from "react";
import { useKeyPress } from "react-use";

import { ITrack } from "../../../common/types";
import { Ruler } from "./Ruler";
import { SequencerContext } from "./context/SequencerContext";

interface TimeGridProps {
  tracks: ITrack[];
}

export function TimeGrid({ tracks }: TimeGridProps) {
  const { timeSignature } = useContext(SequencerContext);
  const beatsPerMeasure = parseInt(timeSignature.split("/")[0]);
  const [measureWidth, setMeasureWidth] = useState(150);
  const totalMeasures = 32; // Nombre initial de mesures

  const rulerContainerRef = useRef<HTMLDivElement>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);

  const syncScroll = (
    sourceRef: React.RefObject<HTMLDivElement>,
    targetRef: React.RefObject<HTMLDivElement>
  ) => {
    if (sourceRef.current && targetRef.current) {
      targetRef.current.scrollLeft = sourceRef.current.scrollLeft;
    }
  };

  useEffect(() => {
    const handleRulerScroll = () =>
      syncScroll(rulerContainerRef, gridContainerRef);
    const handleGridScroll = () =>
      syncScroll(gridContainerRef, rulerContainerRef);

    const rulerContainer = rulerContainerRef.current;
    const gridContainer = gridContainerRef.current;

    if (rulerContainer && gridContainer) {
      rulerContainer.addEventListener("scroll", handleRulerScroll);
      gridContainer.addEventListener("scroll", handleGridScroll);

      return () => {
        rulerContainer.removeEventListener("scroll", handleRulerScroll);
        gridContainer.removeEventListener("scroll", handleGridScroll);
      };
    }
  }, []);

  const getBackground = () => {
    // Création du fond pour les mesures
    const measureBackground = `linear-gradient(to right, rgba(255, 255, 255, 0.1) ${measureWidth}px, transparent ${measureWidth}px) 0 0 / ${
      measureWidth * 2
    }px 100% repeat-x`;

    // Création des lignes pour les temps
    const beatWidth = measureWidth / beatsPerMeasure;
    const beatBackground = `linear-gradient(to right, rgba(0, 0, 0, 0.5) 1px, transparent 1px) 0 0 / ${beatWidth}px 100% repeat-x`;

    return `${beatBackground}, ${measureBackground}`;
  };

  const [ctrlPressed] = useKeyPress("Meta");

  return (
    <div className=" overflow-y-hidden w-full h-full relative">
      <div
        ref={rulerContainerRef}
        className="absolute top-0 left-0 overflow-x-scroll w-full no-scrollbar"
      >
        <Ruler
          measureWidth={measureWidth}
          totalMeasures={totalMeasures}
          beatsPerMeasure={beatsPerMeasure}
        />
      </div>
      <div
        ref={gridContainerRef}
        className="w-full h-full overflow-x-scroll overflow-y-scroll pt-10"
      >
        <div
          className=""
          style={{
            width: `${totalMeasures * measureWidth}px`,
            height: "100%",
            background: getBackground(),
          }}
        >
          {tracks.map(track => (
            <div
              key={track.id}
              style={{ height: "130px" }}
              className={"border-b border-shade-600"}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TimeGrid;
