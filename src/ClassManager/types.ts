export interface Options {
  [prop: string]: any;
  target: "self" | "children";
  queue?: boolean;
  interval?: number | number[];
}

export type TimeoutsMap = Map<string, number[]>;
