import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import Draggable, { DraggableEvent, DraggableData } from "react-draggable";

import chroma from "chroma-js";
interface Props {
  value: number;
  onChange: (value: number) => void;
  max: number;
  min: number;
  formatValue?: (value: number) => string;
  color?: string;
}

const CURSOR_WIDTH = 14;

export function RangeSlider({
  onChange,
  value,
  max,
  min,
  formatValue,
  color,
}: Props) {
  const [cursorX, setCursorX] = useState(0);

  const [containerWidth, setContainerWidth] = useState(0);

  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (!trackRef.current) return;
      const adjustedWidth = trackRef.current.clientWidth - CURSOR_WIDTH;
      setContainerWidth(adjustedWidth);
      setCursorX(((value - min) / (max - min)) * adjustedWidth);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Set internal value from cursorX position, max, min and containerWidth
  useEffect(() => {
    const scaledValue = (cursorX / containerWidth) * (max - min) + min;
    onChange(scaledValue);
  }, [cursorX, containerWidth, max, min, onChange]);

  // Set cursorX position (in pixel) on drag
  const onDrag = useCallback((e: DraggableEvent, data: DraggableData) => {
    setCursorX(data.x);
  }, []);

  const onClickTrack = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const trackRect = trackRef.current?.getBoundingClientRect();
      if (!trackRect) return;
      let positionInTrack = e.clientX - trackRect.left - CURSOR_WIDTH / 2;

      if (positionInTrack > containerWidth) {
        positionInTrack = containerWidth;
      }

      if (positionInTrack < 0) {
        positionInTrack = 0;
      }

      // Vérifiez si la valeur de cursorX a réellement changé avant de la mettre à jour
      if (positionInTrack !== cursorX) {
        setCursorX(positionInTrack);
      }
    },
    [containerWidth, max, min, cursorX]
  );

  return (
    <div
      className=" track w-full bg-shade-700 h-4 rounded-3xl relative cursor-pointer select-none"
      ref={trackRef}
      onMouseDown={onClickTrack}
    >
      {" "}
      <div
        style={{
          width: cursorX + "px",
          backgroundColor: color ? chroma(color).darken(0.5).css() : "",
        }}
        className={`progress absolute  ${
          color ? "" : "bg-primary-500"
        } shadow-lg left-0 h-full rounded-l-md `}
      ></div>
      <Draggable
        axis="x"
        bounds="parent"
        position={{
          x: cursorX,
          y: 0,
        }}
        onDrag={onDrag}
      >
        <div className="group absolute top-0 left-0 bottom-0  flex justify-center">
          <div
            style={{ backgroundColor: color ? color : "" }}
            className={` group-active:opacity-100 opacity-0 pointer-events-none ${
              color ? "" : "bg-shade-500"
            }  transition-opacity indication absolute px-4 py-2  -top-[4rem] rounded-md transform`}
          >
            {formatValue ? formatValue(value) : value}{" "}
          </div>
          <div
            style={{ backgroundColor: color ? color : "" }}
            className={`thumb w-4 h-4  ${
              color ? "" : "bg-primary-400"
            } cursor-pointer transition-all hover:scale-[2] scale-150 rounded-full  mx-auto`}
          ></div>
        </div>
      </Draggable>
    </div>
  );
}
export default RangeSlider;
