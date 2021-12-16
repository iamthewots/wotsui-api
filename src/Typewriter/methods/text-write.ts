import { TypewriterOptions, Status } from "../types.js";
import Typewriter from "../Typewriter.js";

export default async function writeText(this: Typewriter, el: Element) {
    const data = this.elementsData.get(el);
    if (!data || data.status === Status.InProgress) {
        return;
    }

    data.status = Status.InProgress;
    const opt = this.getOptions(el);
    const { textNodesData, lastNodeIndex, lastCharIndex } = data;
    for (let i = 0; i < textNodesData.length; i++) {
        const { node, text } = textNodesData[i];
        if (!text || text === "" || i < lastNodeIndex) {
            continue;
        }

        for (
            let j = i === lastNodeIndex ? lastCharIndex : 0;
            j < text.length;
            j++
        ) {
            if (data.status !== Status.InProgress) {
                data.lastNodeIndex = i;
                data.lastCharIndex = j;
                return;
            }

            const char = text[j];
            node.textContent += char;
            const ttw = getTimeToWait(char, opt);
            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve(null);
                }, ttw);
            });
        }
    }
    data.status = Status.Initial;
    data.lastNodeIndex = textNodesData.length - 1;
    data.lastNodeIndex =
        textNodesData[textNodesData.length - 1].text.length - 1;
}

function getTimeToWait(char: string, opt: TypewriterOptions) {
    const tpc = opt.timePerChar;
    if (opt.ignorePunctuation) {
        return tpc;
    }
    if (char.match(/\W/g)) {
        if (char.match(/[\@\{\}\[\]\(\)]/)) {
            return tpc * 3;
        }
        if (char.match(/[\,\>\<\%\$\€]/)) {
            return tpc * 6;
        }
        if (char.match(/[:;]/)) {
            return tpc * 9;
        }
        if (char.match(/[\.\?\!]/)) {
            return tpc * 12;
        }
    }
    return tpc;
}
