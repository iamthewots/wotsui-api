import ProgressManager from "../ProgressManager";

export function clearProgress(this: ProgressManager) {
  this.statistics.index = 0;
  this.clearHistory();
}

export function clearHistory(this: ProgressManager) {
  this.history = [];
}
