import { Method, Options } from "../types.js";

export default function isIntervalIgnored(method: Method, opt: Options) {
  if (opt.ignoreIntervalOnAdd && method === Method.Add) {
    return true;
  }
  if (opt.ignoreIntervalOnRemove && method === Method.Remove) {
    return true;
  }
  return false;
}
