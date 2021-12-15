import {
    add,
    clearClassTimeouts,
    manageChildrenClass,
    manageClass,
    manageSelfClass,
    remove,
} from "./methods/class.js";
import emitEvent from "./methods/emit-event.js";
import { getOptions, parseOptions, setOptions } from "./methods/options.js";
import { ClassManagerOptions } from "./types";

export default class ClassManager {
    protected el: Element;
    protected options: ClassManagerOptions;
    protected classTimeouts: Map<string, number[]> = new Map();

    constructor(el: Element, options: ClassManagerOptions) {
        if (!(el instanceof Element)) {
            throw new Error("Invalid element");
        }
        this.el = el;
        this.options = this.parseOptions(options);
    }

    parseOptions = parseOptions;
    static parseOptions = parseOptions;
    getOptions = getOptions;
    setOptions = setOptions;

    add = add;
    remove = remove;
    clearClassTimeouts = clearClassTimeouts;
    protected manageClass = manageClass;
    protected manageSelfClass = manageSelfClass;
    protected manageChildrenClass = manageChildrenClass;

    emitEvent = emitEvent;
}
