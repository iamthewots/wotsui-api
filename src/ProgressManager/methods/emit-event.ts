import ProgressManager from "../ProgressManager";

export default function emitEvent(this: ProgressManager, val: number) {
  if (!this.el) {
    return;
  }

  const eName = `${val}percent`;
  const valueEvent = new CustomEvent(eName);
  this.el.dispatchEvent(valueEvent);
  const genericEvent = new CustomEvent("progress", {
    detail: val,
  });
  this.el.dispatchEvent(genericEvent);
}
