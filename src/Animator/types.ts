export interface Options {
  [prop: string]: any;
  target: Target;
  queue?: boolean;
  interval?: number | string;
  adaptDelay?: number | string;
  adaptDuration?: number | string;
}

export enum Target {
  "Self",
  "Children",
}

export interface Animation {
  id: string;
  animation: AnimationProperties[];
}

export interface AnimationProperties {
  [prop: string]: any;
  delay?: number | string;
  direction?: string | "normal" | "reverse" | "alternate" | "alternate-reverse";
  duration: number | string;
  fillMode?: string | "none" | "forwards" | "backwards" | "both";
  iterationCount?: number | string;
  name: string;
  timingFunction?:
    | string
    | "ease"
    | "ease-in"
    | "ease-out"
    | "ease-in-out"
    | "linear";
}
