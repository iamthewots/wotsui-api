import { Options } from "../types";
import ClassManager from "../index";

export default function updateOptions(
  this: ClassManager,
  options: Options | { [prop: string]: any }
) {
  const opt = this.parseOptions(options);
  this.options = { ...this.options, ...opt };
  return this.options;
}
