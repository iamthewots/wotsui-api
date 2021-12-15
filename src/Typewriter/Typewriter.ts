import { initElement } from "./methods/element.js";
import { getOptions, parseOptions, setOptions } from "./methods/options.js";
import clearText from "./methods/text-clear.js";
import deleteText from "./methods/text-delete.js";
import restoreText from "./methods/text-restore.js";
import stopText from "./methods/text-stop.js";
import writeText from "./methods/text-write.js";
import { ElementData, Options } from "./types";

export default class Typewriter {
    protected options: Options;
    protected elementsData: Map<Element, ElementData> = new Map();

    constructor(options: Options) {
        this.options = this.parseOptions(options);
    }

    parseOptions = parseOptions;
    static parseOptions = parseOptions;
    getOptions = getOptions;
    setOptions = setOptions;

    clearText = clearText;
    deleteText = deleteText;
    restoreText = restoreText;
    stopText = stopText;
    writeText = writeText;

    initElement = initElement;
}
