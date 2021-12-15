import ClassManager from "../ClassManager";
import { Method } from "../types.js";

export default function emitEvent(
    this: ClassManager,
    target: Element,
    method: Method,
    className: string
) {
    const eName = method === Method.Add ? "classadded" : "classremoved";
    const e = new CustomEvent(eName, {
        detail: {
            className,
            target,
        },
    });
    this.el.dispatchEvent(e);
}
