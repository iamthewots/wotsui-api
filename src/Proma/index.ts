import { Options, ProgressStatistics } from "./types";
import addCheckpoint from "./methods/add-checkpoint.js";
import parseOptions from "./methods/parse-options.js";

export default class ProgressManager {
  protected _el: Element;
  protected _options: Options;
  protected _stats: ProgressStatistics;
  protected _checkpoints: Set<number>;
  protected _log: number[] = [];

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

  parseOptions = parseOptions;
  static parseOptions = parseOptions;
  addCheckpoint = addCheckpoint;
}
