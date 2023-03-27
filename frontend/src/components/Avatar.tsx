import { Result } from "@dicebear/core";
import { createAvatar, schema } from "@dicebear/core";
import { bottts } from "@dicebear/collection";
import { useMemo } from "react";
interface Props {
  seed: string;
  size?: number;
  background?: boolean;
  scale?: number;
  circle?: boolean;
  className?: string;
  style?: Object;
}

export function Avatar({
  seed,
  size = 128,
  background,
  scale = 85,
  circle,
  className,
  style = {},
}: Props) {
  const renderedAvatar = useMemo(() => {
    return createAvatar(bottts, {
      seed,
      size,
      scale,
      radius: circle ? 50 : 0,
      backgroundType: background ? ["gradientLinear", "solid"] : [],
      backgroundColor: background
        ? ["ffdfbf", "c0aede", "d1d4f9", "ffd5dc", "ffdfbf"]
        : [],
    }).toDataUriSync();
  }, [seed, size]);

  return <img style={style} className={className} src={renderedAvatar} />;
}
export default Avatar;
