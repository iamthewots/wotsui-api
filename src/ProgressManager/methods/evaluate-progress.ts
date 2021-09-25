import ProgressManager from "../ProgressManager";
import { Evaluation } from "../types.js";

export default function evaluateProgress(this: ProgressManager) {
  this.checkpoints.forEach((val) => {
    const { index, length, errorMargin } = this.statistics;
    const { evaluation } = this.options;
    if (
      evaluation !== Evaluation.Bidirectional &&
      this.history.indexOf(val) !== -1
    ) {
      return;
    }
    const i = (length * val) / 100;
    if (evaluation === Evaluation.Linear && !(i <= index + errorMargin)) {
      return;
    }
    if (
      (evaluation === Evaluation.Precise ||
        evaluation === Evaluation.Bidirectional) &&
      (i === index || i >= index - errorMargin || i <= index + errorMargin)
    ) {
      return;
    }
    this.emitEvent(val);
    if (evaluation !== Evaluation.Bidirectional) {
      this.history.push(val);
    }
  });
}
