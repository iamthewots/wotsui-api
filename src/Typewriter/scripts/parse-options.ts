import { Options, TypewriterOptions } from "../Typewriter";

export default function parseOptions(obj: Options | undefined) {
  const opt: TypewriterOptions = {
    timePerChar: 25,
    ignorePunctuation: false,
  };
  if (typeof obj !== "object") {
    return opt;
  }

  opt.ignorePunctuation = !!obj.ignorePunctuation;
  if (typeof obj.timePerChar === "number") {
    opt.timePerChar = obj.timePerChar;
  }
  return opt;
}
