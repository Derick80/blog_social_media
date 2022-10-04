export const spriteNames = ["outline:home", "solid:home"] as const;
type SpriteName = (typeof spriteNames)[number];
export type SpriteProps = {
    name: SpriteName;
} & JSX.IntrinsicElements["svg"];
