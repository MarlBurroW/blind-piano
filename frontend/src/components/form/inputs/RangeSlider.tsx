import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import Draggable, { DraggableEvent, DraggableData } from "react-draggable";

interface Props {
  value: number;
  onChange: (value: number) => void;
  max: number;
  min: number;
  formatValue?: (value: number) => string;
}

export function RangeSlider({ onChange, value, max, min, formatValue }: Props) {
  const [internalValue, setInternalValue] = useState(value);

  const [cursorX, setCursorX] = useState(0);

  const [containerWidth, setContainerWidth] = useState(0);

  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      const cursorWidth = 14;

      if (!trackRef.current) return;
      const adjustedWidth = trackRef.current.clientWidth - cursorWidth;
      setContainerWidth(adjustedWidth);
      setCursorX(((internalValue - min) / (max - min)) * adjustedWidth);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [internalValue, min, max]);

  // Set internal value from cursorX position, max, min and containerWidth
  useEffect(() => {
    const scaledValue = (cursorX / containerWidth) * (max - min) + min;
    setInternalValue(scaledValue);
  }, [cursorX, containerWidth, max, min]);

  // Send value when internal value changes
  useEffect(() => {
    onChange(internalValue);
  }, [internalValue, onChange]);

  // Internal value when value prop changes
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Set cursorX position (in pixel) on drag
  const onDrag = useCallback((e: DraggableEvent, data: DraggableData) => {
    setCursorX(data.x);
  }, []);

  const onClickTrack = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const trackRect = trackRef.current?.getBoundingClientRect();
      if (!trackRect) return;
      const positionInTrack = e.clientX - trackRect.left;

      setCursorX(positionInTrack);
    },
    [containerWidth, max, min]
  );

  return (
    <div
      className=" track w-full bg-shade-700 h-4 rounded-md relative cursor-pointer"
      ref={trackRef}
      onClick={onClickTrack}
    >
      {" "}
      <div
        style={{ width: cursorX + "px" }}
        className="progress absolute  bg-gradient-to-b   from-primary-500 to-primary-600 shadow-lg  shadow-primary-600/100 left-0 h-full rounded-l-md "
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
          <div className="group-hover:opacity-100 group-active:opacity-100 opacity-0  transition-opacity indication absolute px-2 py-2 bg-shade-50 -top-[4rem] rounded-md transform ">
            {formatValue ? formatValue(internalValue) : internalValue}
          </div>
          <div className="thumb w-4 h-4 bg-primary-400 cursor-pointer transition-all hover:scale-[2] scale-150 rounded-full  mx-auto "></div>
        </div>
      </Draggable>
    </div>
  );
}
export default RangeSlider;
