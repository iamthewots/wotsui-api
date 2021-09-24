import { Method, Options } from "../types.js";

export default function isElementSkipped(
  el: Element,
  className: string,
  method: Method,
  opt: Options
) {
  if (!opt.reactive) {
    return false;
  }
  const classIsApplied = el.classList.contains(className);
  if (classIsApplied && method === Method.Add) {
    return true;
  }
  if (!classIsApplied && method === Method.Remove) {
    return true;
  }
  return false;
}
