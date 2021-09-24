import { Direction, Options } from "../../ProgressManager/types.js";

export default function parseOptions(obj: { [prop: string]: any }) {
  const opt: Options = {
    direction: Direction.Linear,
  };
  if (typeof obj !== "object") {
    return opt;
  }

  opt.autoReset = !!obj.autoReset;
  if (typeof obj.direction === "number") {
    opt.direction = obj.direction;
  }
  return opt;
}
