import { memo } from "react";
import { ReactSVG } from "react-svg";

import symbolDefs from "../icons/symbol-defs.svg";

export function SVGSymbols() {
  const MemoizedSymbolDefs = memo(() => {
    return <ReactSVG src={symbolDefs} />;
  });

  return <MemoizedSymbolDefs />;
}

interface Props {
  name: string;
  className?: string;
}

export function Icon({ name, className }: Props) {
  return (
    <svg className={className}>
      <use xlinkHref={`#${name}`} />
    </svg>
  );
}
