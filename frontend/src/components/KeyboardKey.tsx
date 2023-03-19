import { useCallback, useState, useMemo, memo, useEffect } from "react";
import type { Note } from "webmidi";
import _ from "lodash";
interface Props {
  note: Note;

  state: { active: { [key: string]: string } };
  onMouseDown: (note: Note, gliss?: boolean) => void;
  onMouseUp: (note: Note, gliss?: boolean) => void;
  onMouseEnter: (note: Note, gliss?: boolean) => void;
  onMouseLeave: (note: Note, gliss?: boolean) => void;
}

function hasAccidentalAfter(note: Note) {
  if (note.accidental) {
    return false;
  }

  if (["C", "D", "F", "G", "A"].includes(note.name)) {
    return true;
  }
}

const noteClasses = {
  normal:
    "shadow-inner shadow-gray-400 bg-gradient-to-b from-slate-300 to-slate-100 w-[4em] h-full  relative",
  accidental:
    "bg-gradient-to-b from-slate-800 to-slate-900 w-[2em] h-2/3 relative left-[1em] z-10 rounded-b-md",
};

export const KeyboardKey = memo(
  ({
    note,
    state,
    onMouseDown,
    onMouseUp,
    onMouseEnter,
    onMouseLeave,
  }: Props) => {
    const gradient = useMemo(() => {
      const colors = Object.values(state.active);
      if (colors.length === 1) {
        return `linear-gradient(to bottom, ${colors[0]} 0%, ${colors[0]} 100%)`;
      } else {
        let stops = "";
        const stopPercent = 100 / (colors.length - 1);

        for (let i = 0; i < colors.length; i++) {
          // détermine le pourcentage équivalent à ce segment.
          const stop = `${i * stopPercent}%`;
          stops += `${colors[i]} ${stop},`;
        }

        return `linear-gradient(to bottom, ${stops.slice(0, -1)})`;
      }
    }, [state.active]);

    return (
      <div
        onMouseDown={() => onMouseDown(note, false)}
        onMouseUp={() => onMouseUp(note, false)}
        onMouseEnter={() => onMouseEnter(note, true)}
        onMouseLeave={() => onMouseLeave(note, true)}
        style={
          Object.keys(state.active).length > 0 ? { background: gradient } : {}
        }
        className={`${
          note.accidental ? noteClasses.accidental : noteClasses.normal
        } ${
          hasAccidentalAfter(note) ? "-mr-[2em]" : ""
        } shrink-0 cursor-pointer relative select-none flex flex-col justify-end`}
      ></div>
    );
  },
  (prev, next) => {
    return _.isEqual(prev.state.active, next.state.active);
  }
);
export default KeyboardKey;
