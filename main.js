import { ClassManager, IntersectionManager, Typewriter } from "./dist/index.js";

const typEl = document.getElementById("typewriter");

const tpw = new Typewriter({
  timePerChar: 25,
  ignorePunctuation: true,
});
tpw.initElement(typEl);
setTimeout(() => {
  tpw.write(typEl);
}, 1000);
typEl.addEventListener("restoredtext", () => {
  console.log("Eureka");
});

const intEl = document.getElementById("intersection");
const intMan = new IntersectionManager({
  toggleOpacity: false,
  intersectionClass: "on-int",
  noIntersectionClass: "no-int",
});
intMan.observe(intEl);

const cmEl = document.getElementById("classmanager");
const cM = new ClassManager(cmEl, {
  target: 1,
  queue: true,
  interval: 250,
  invert: true,
});
cM.add("cm");
cmEl.addEventListener("classapplied", () => {
  cM.remove("cm");
});
