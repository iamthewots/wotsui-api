import { Method } from "../types.js";
import ClassManager from "../index.js";

export default function emitEvent(
  this: ClassManager,
  target: Element,
  method: Method,
  className: string
) {
  const eventName = method === Method.Add ? "classadded" : "classremoved";
  const e = new CustomEvent(eventName, {
    detail: {
      className,
      target
    }
  });
  this.el.dispatchEvent(e);
}
