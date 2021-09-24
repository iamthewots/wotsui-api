import IntersectionManager from "../index";

export default function getObserver(
  this: IntersectionManager,
  threshold: number
) {
  const thr = Math.min(Math.max(threshold, 0), 1);
  let obs = this.observersList.get(thr);
  if (obs) {
    return obs;
  }
  obs = new IntersectionObserver(
    (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach((entry) => {
        this.emitEvent(entry);
        const opt = this.applyOptions(entry);
        const el = entry.target;
        if (entry.isIntersecting) {
          if (opt.intersectionHandler) {
            opt.intersectionHandler(entry);
          }
          if (opt.observeOnce) {
            observer.unobserve(el);
          }
        } else if (opt.noIntersectionHandler) {
          opt.noIntersectionHandler(entry);
        }
      });
    },
    {
      threshold: thr,
    }
  );
  return obs;
}
