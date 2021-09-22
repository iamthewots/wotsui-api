import { Direction, Options, ProgressStatistics } from "./types.js";

export default class ProgressManager {
  private _el: Element;
  private _options: Options;
  private _stats: ProgressStatistics;
  private _checkpoints: Set<number>;
  private _log: number[] = [];

  constructor(el: Element, length: number, options: Options) {
    this._el = el;
    this._options = this.parseOptions(options);
    this._stats = {
      index: 0,
      length,
      delta: length / 100,
      percent: 0,
    };
    this._checkpoints = new Set();
  }

  parseOptions(obj: { [prop: string]: any }) {
    const opt: Options = {
      direction: Direction.Linear,
    };
    if (typeof obj !== "object") {
      return opt;
    }

    opt.autoReset = !!obj.autoReset;
    if (typeof obj.direction === "number") {
      opt.direction = obj.direction;
    }
    return opt;
  }

  addCheckpoint(checkpoint: number | number[]) {
    if (Array.isArray(checkpoint)) {
      checkpoint.forEach((cp) => {
        this.addCheckpoint(cp);
      });
    }
    if (typeof checkpoint === "number") {
      const val = Math.min(Math.max(0, checkpoint), 100);
      this._checkpoints.add(val);
    }
  }

  private evaluateCheckpoints() {
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

  private skipCheckpoint(val: number) {
    const { direction } = this._options;
    if (
      direction !== Direction.Bidirectional &&
      this._log.indexOf(val) !== -1
    ) {
      return true;
    }
    return false;
  }

  private emitEvent(val: number) {
    const eName = `${val}%`;
    const e = new CustomEvent(eName);
    this._el.dispatchEvent(e);
    const genEv = new CustomEvent("progress", {
      detail: val,
    });
    this._el.dispatchEvent(genEv);
  }

  reset() {
    this._stats.index = 0;
    this.clearLog();
  }

  clearLog() {
    this._log = [];
  }

  get index() {
    return this._stats.index;
  }

  set index(val: number) {
    if (typeof val !== "number") {
      return;
    }
    this._stats.index = Math.min(Math.max(val, 0), this._stats.length);
    this._stats.percent = (this._stats.index * 100) / this._stats.length;
    this.evaluateCheckpoints();
  }

  get length() {
    return this._stats.length;
  }

  set length(val: number) {
    if (typeof val !== "number") {
      return;
    }
    this._stats.length = length;
    this._stats.delta = length / 100;
    this.evaluateCheckpoints();
  }

  get percent() {
    return this._stats.percent;
  }

  set percent(val: number) {
    const perc = Math.min(Math.max(val, 0), 100);
    this._stats.percent = perc;
    this._stats.index = (this._stats.length * perc) / 100;
    this.evaluateCheckpoints();
  }
}
