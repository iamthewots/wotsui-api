import Typewriter from "../Typewriter";

export default function stopChange(this: Typewriter, el: Element) {
  const data = this.elementsData.get(el);
  if (!data) {
    return;
  }
  data.changeStatus.isAllowed = false;
}
