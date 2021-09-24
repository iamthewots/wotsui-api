import ProgressManager from "../index";

export default function evaluateCheckpoints(this: ProgressManager) {
  this._checkpoints.forEach((val) => {
    const { index, length, delta } = this._stats;
    const { direction } = this._options;
    if (this.skipCheckpoint(val)) {
      return;
    }
    if (
      direction !== Direction.Bidirectional &&
      this._log.indexOf(val) !== -1
    ) {
      return;
    }

    const i = (length * val) / 100;
    if (
      (direction === Direction.Linear && i <= index + delta) ||
      ((direction === Direction.Precise ||
        direction === Direction.Bidirectional) &&
        (i === index || (i >= index - delta && i <= index + delta)))
    ) {
      this.emitEvent(val);
      if (direction === Direction.Bidirectional) {
        return;
      }
      this._log.push(val);
    }
  });
}
