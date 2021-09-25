import ProgressManager from "../ProgressManager";

export function getIndex(this: ProgressManager) {
  return this.statistics.index;
}

export function setIndex(this: ProgressManager, val: number) {
  if (typeof val !== "number") {
    return;
  }

  this.statistics.index = Math.min(Math.max(val, 0), this.statistics.length);
  this.evaluateProgress();
}

export function getLength(this: ProgressManager) {
  return this.statistics.length;
}

export function setLength(this: ProgressManager, val: number) {
  if (typeof val !== "number") {
    return;
  }

  this.statistics.length = val;
  this.statistics.errorMargin = 100 / val;
  this.evaluateProgress();
}

export function getPercent(this: ProgressManager) {
  return this.statistics.progressPercent;
}

export function setPercent(this: ProgressManager, val: number) {
  if (typeof val !== "number") {
    return;
  }

  const percent = Math.min(Math.max(val, 0), 100);
  this.statistics.progressPercent = percent;
  this.statistics.index = (this.statistics.length * percent) / 100;
  this.evaluateProgress();
}
