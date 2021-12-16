import { TypewriterOptions } from "../types";
import Typewriter from "../Typewriter.js";

export function parseOptions(obj: { [prop: string]: any } | TypewriterOptions) {
    const opt: TypewriterOptions = {
        timePerChar: 25,
        deleteModifier: 0.5,
    };
    if (typeof obj !== "object") {
        return opt;
    }

    opt.ignorePunctuation = !!obj.ignorePunctuation;
    if (typeof obj.timePerChar === "number") {
        opt.timePerChar = obj.timePerChar;
    }
    if (typeof obj.deleteModifier === "number") {
        opt.deleteModifier = obj.deleteModifier;
    } else {
        opt.deleteModifier = opt.timePerChar;
    }
    return opt;
}

export function getOptions(this: Typewriter, el: Element) {
    const data = this.elementsData.get(el);
    if (!data || !data.options) {
        return this.options;
    }
    return { ...this.options, ...data.options };
}

export function setOptions(this: Typewriter, options: TypewriterOptions, el: Element) {
    const opt = this.parseOptions(options);
    if (!el) {
        this.options = { ...this.options, ...opt };
        return this.options;
    }
    const data = this.elementsData.get(el);
    if (!data) {
        return;
    }
    const newOpt = { ...data.options, ...opt };
    data.options = newOpt;
    return newOpt;
}
