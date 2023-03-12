import { useCallback, useState, useMemo } from "react";
import type { Note } from "webmidi";

interface Props {
  note: Note;
  gliss: boolean;
  onKeyDown: (note: Note) => void;
  onKeyUp: (note: Note) => void;
  state: { active: { [key: string]: string } };
}

function hasAccidentalAfter(note: Note) {
  if (note.accidental) {
    return false;
  }

  if (["C", "D", "F", "G", "A"].includes(note.name)) {
    return true;
  }
}

export function KeyboardKey({
  note,
  gliss = false,
  onKeyDown,
  onKeyUp,
  state,
}: Props) {
  const onPlayNoteInput = useCallback(() => {
    onKeyDown(note);
  }, [state, onKeyDown]);

  const onStopNoteInput = useCallback(() => {
    onKeyUp(note);
  }, [state, onKeyUp]);

  const noteClasses = {
    normal:
      "  shadow-inner shadow-gray-400 bg-gradient-to-b from-slate-300 to-slate-100 w-[4rem] h-full  relative",
    accidental:
      "bg-gradient-to-b from-slate-800 to-slate-900 w-[2rem] h-2/3 relative left-[1rem] z-10 rounded-b-md",
  };

  const gradient = useMemo(() => {
    const colors = Object.values(state.active);
    if (colors.length === 1) {
      return `linear-gradient(to bottom, ${colors[0]} 0%, ${colors[0]} 100%)`;
    }
    const stops = [];
    let segment = 100 / (colors.length - 1);

    for (let i = 0; i < colors.length; i++) {
      // détermine le pourcentage équivalent à ce segment.
      const stop = `${segment * i}%`;

      if (i == 0) {
        stops.push(`${colors[0]} ${stop}`);
      } else if (i == colors.length - 1) {
        stops.push(`${colors[colors.length - 1]} ${stop}`);
      } else {
        stops.push(`${colors[i]} ${stop}`);
        stops.push(`${colors[i]} ${stop}"`);
      }
    }

    return `linear-gradient(to bottom, ${stops.join(", ")})`;
  }, [state.active]);

  return (
    <div
      style={
        Object.keys(state.active).length > 0 ? { background: gradient } : {}
      }
      onMouseDown={onPlayNoteInput}
      onMouseUp={onStopNoteInput}
      onMouseLeave={onStopNoteInput}
      onMouseEnter={gliss ? onPlayNoteInput : () => {}}
      className={`${
        note.accidental ? noteClasses.accidental : noteClasses.normal
      } ${
        hasAccidentalAfter(note) ? "-mr-[2rem]" : ""
      } shrink-0 cursor-pointer relative select-none transition-all flex flex-col justify-end`}
    ></div>
  );
}
export default KeyboardKey;
