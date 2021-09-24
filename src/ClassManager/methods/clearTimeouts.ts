import ClassManager from "../index";

export default function clearClassTimeouts(
  this: ClassManager,
  className: string
) {
  const timeouts = this.classTimeouts.get(className);
  if (timeouts && timeouts.length > 0) {
    for (const timeout of timeouts) {
      clearTimeout(timeout);
    }
  }
}
