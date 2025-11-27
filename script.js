gsap.registerPlugin(MorphSVGPlugin);

// timings (seconds)
const INHALE = 4;
const HOLD = 4;
const EXHALE = 4;

const phaseEl = document.getElementById("phase");
const timerEl = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");

const lungPath = document.getElementById("lung-path");
const bronchi = document.querySelector("#bronchi path");
const diaphragm = document.getElementById("diaphragm");

const lungSmall = document.getElementById("lung-small");
const lungBig = document.getElementById("lung-big");
const diaSmall = document.getElementById("dia-small");
const diaBig = document.getElementById("dia-big");

let phase = "ready";
let remaining = 0;
let timerInterval = null;
let mainTl = null;

function setPhase(name, duration) {
  phase = name;
  remaining = duration;
  phaseEl.textContent = name.toUpperCase();
  timerEl.textContent = duration.toFixed(1);

  if (name === "inhale") {
    phaseEl.style.color = "#22c55e";
  } else if (name === "hold") {
    phaseEl.style.color = "#e5e7eb";
  } else if (name === "exhale") {
    phaseEl.style.color = "#60a5fa";
  } else {
    phaseEl.style.color = "#a5b4fc";
  }
}

function startTimer() {
  if (timerInterval) clearInterval(timerInterval);
  const tickRate = 100;

  timerInterval = setInterval(() => {
    remaining -= tickRate / 1000;
    if (remaining < 0) remaining = 0;
    timerEl.textContent = remaining.toFixed(1);
  }, tickRate);
}

function stopTimer() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = null;
}

function buildTimeline() {
  if (mainTl) mainTl.kill();

  mainTl = gsap.timeline({
    paused: true,
    onStart: () => {
      setPhase("inhale", INHALE);
      startTimer();
    },
    onComplete: () => {
      stopTimer();
      phaseEl.textContent = "Cycle Complete";
      phaseEl.style.color = "#a5b4fc";
      timerEl.textContent = "0.0";
      startBtn.disabled = false;
    }
  });

  // INHALE: lungs expand + diaphragm down + bronchi light up
  mainTl.to(lungPath, {
    duration: INHALE,
    morphSVG: lungBig,
    attr: { "fill-opacity": 0.9 },
    ease: "power2.inOut"
  }, 0);

  mainTl.to(diaphragm, {
    duration: INHALE,
    morphSVG: diaBig,
    ease: "power2.inOut"
  }, 0);

  mainTl.to(bronchi, {
    duration: INHALE * 0.7,
    opacity: 1,
    ease: "power2.out"
  }, INHALE * 0.3);

  // switch to HOLD after inhale duration
  mainTl.call(() => setPhase("hold", HOLD), null, INHALE);

  // HOLD: subtle pulsing, bronchi steady
  mainTl.to(lungPath, {
    duration: HOLD,
    scale: 1.03,
    transformOrigin: "50% 60%",
    yoyo: true,
    repeat: 1,
    ease: "sine.inOut"
  }, INHALE);

  // EXHALE: lungs shrink + diaphragm up + bronchi dim
  mainTl.call(() => setPhase("exhale", EXHALE), null, INHALE + HOLD);

  mainTl.to(lungPath, {
    duration: EXHALE,
    morphSVG: lungSmall,
    attr: { "fill-opacity": 0.12 },
    ease: "power2.inOut"
  }, INHALE + HOLD);

  mainTl.to(diaphragm, {
    duration: EXHALE,
    morphSVG: diaSmall,
    ease: "power2.inOut"
  }, INHALE + HOLD);

  mainTl.to(bronchi, {
    duration: EXHALE,
    opacity: 0.0,
    ease: "power2.inOut"
  }, INHALE + HOLD);
}

startBtn.addEventListener("click", () => {
  startBtn.disabled = true;
  stopTimer();
  buildTimeline();
  mainTl.restart();
});
