import ProgressManager from "../ProgressManager";
import { Evaluation, Options } from "../types.js";

export function parseOptions(
    this: ProgressManager,
    obj: { [prop: string]: any } | Options
) {
    const opt: Options = {
        evaluation: Evaluation.Linear,
    };
    if (typeof obj !== "object") {
        return opt;
    }
    opt.autoReset = !!obj.autoReset;
    if (typeof obj.evaluation === "number") {
        if (Object.values(Evaluation).includes(obj.evaluation)) {
            opt.evaluation = obj.evaluation;
        }
    }
    return opt;
}

export function getOptions(this: ProgressManager): Options {
    return this.options;
}

export function setOptions(
    this: ProgressManager,
    options: { [prop: string]: any } | Options
) {
    if (typeof options !== "object") {
        return;
    }
    const opt = this.parseOptions(options);
    this.options = { ...this.options, ...opt };
    return this.options;
}
