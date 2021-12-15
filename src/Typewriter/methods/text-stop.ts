import { Status } from "../types.js";
import Typewriter from "../Typewriter";

export default function stopText(this: Typewriter, el: Element) {
    const data = this.elementsData.get(el);
    if (!data || data.status !== Status.InProgress) {
        return;
    }

    data.status = Status.Partial;
}
