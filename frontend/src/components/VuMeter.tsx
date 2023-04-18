import chroma from "chroma-js";
import { useEffect, useState } from "react";

interface Props {
  analyser: AnalyserNode;
  color?: string;
}

const MAX_LEVEL = 75;

export function VuMeter({ analyser, color }: Props) {
  const [levelIndicator, setLevelIndicator] = useState(0);

  const updateLevel = () => {
    if (analyser) {
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(dataArray);

      // Calculer le niveau moyen
      const level =
        dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;

      // Ajuster le niveau en fonction de la valeur maximale définie
      const adjustedLevel = (level / MAX_LEVEL) * 100;
      setLevelIndicator(Math.min(adjustedLevel, 100));

      // Appeler la fonction de manière récursive
      requestAnimationFrame(updateLevel);
    }
  };

  useEffect(() => {
    if (analyser) {
      const animationId = requestAnimationFrame(updateLevel);

      // Nettoyer lors du démontage
      return () => {
        cancelAnimationFrame(animationId);
      };
    }
  }, [analyser]);

  return (
    <div
      style={{
        backgroundColor: color
          ? chroma(color).luminance(0.05).css()
          : undefined,
      }}
      className="bg-shade-400  h-2 mb-4 rounded-lg w-full"
    >
      <div
        style={{
          width: `${levelIndicator.toFixed(1)}%`,
        }}
        className={`h-2 rounded-lg bg-green-500`}
      ></div>
    </div>
  );
}
export default VuMeter;
