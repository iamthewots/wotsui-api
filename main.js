import {
  ClassManager,
  IntersectionManager,
  ProgressManager,
  Typewriter,
} from "./dist/index.js";

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

const pmEl = document.getElementById("progressmanager");
const pmSpan = pmEl.querySelector("span");
pmSpan.innerText = "0";
const btns = pmEl.querySelectorAll("button");
const btn1 = btns[0];
const btn2 = btns[1];
const btn3 = btns[2];
btn1.addEventListener("click", () => {
  adv(-1);
});
btn2.addEventListener("click", () => {
  adv(1);
});
let progress = 0;
const proMan = new ProgressManager(pmEl, 50);
proMan.addCheckpoint([3, 4, 25]);

pmEl.addEventListener("progress", (e) => {
  console.log(e.detail);
});

pmEl.addEventListener("25%", (e) => {
  console.log("Cannavaro su Cannavacciuolo");
});
btn3.addEventListener("click", () => {
  proMan.percent = 25;
});

function adv(n) {
  progress += n;
  proMan.index = progress;
  pmSpan.innerText = `${progress}`;
}
