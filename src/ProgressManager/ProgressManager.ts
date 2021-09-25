import { Options, Statistics } from "./types";
import { getOptions, parseOptions, setOptions } from "./methods/options.js";
import addCheckpoint from "./methods/add-checkpoint.js";
import emitEvent from "./methods/emit-event.js";
import evaluateProgress from "./methods/evaluate-progress.js";
import {
  getIndex,
  getLength,
  getPercent,
  setIndex,
  setLength,
  setPercent,
} from "./methods/statistics.js";
import { clearHistory, clearProgress } from "./methods/clear.js";

export default class ProgressManager {
  protected el?: Element;
  protected options: Options;
  protected statistics: Statistics;
  protected checkpoints: Set<number> = new Set();
  protected history: number[] = [];

  constructor(length: number, options: Options, el?: Element) {
    if (typeof length !== "number") {
      throw new Error("Invalid length");
    }
    this.options = this.parseOptions(options);
    this.statistics = {
      index: 0,
      length,
      errorMargin: 100 / length,
      progressPercent: 0,
    };
  }

  parseOptions = parseOptions;
  static parseOptions = parseOptions;
  getOptions = getOptions;
  setOptions = setOptions;

  addCheckpoint = addCheckpoint;
  evaluateProgress = evaluateProgress;

  getIndex = getIndex;
  setIndex = setIndex;
  getLength = getLength;
  setLength = setLength;
  getPercent = getPercent;
  setPercent = setPercent;

  clearHistory = clearHistory;
  clearProgress = clearProgress;

  protected emitEvent = emitEvent;
}
