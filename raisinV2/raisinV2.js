const steps = [
  { text: "Hold the raisin in your hand.", img: "images/hold.jpg" },
  { text: "Look closely at the raisin.", img: "images/look.png" },
  { text: "Touch the raisin gently.", img: "images/touch.png" },
  { text: "Smell the raisin slowly.", img: "images/smell.png" },
  { text: "Put the raisin in your mouth.", img: "images/mouth.png" },
  { text: "Chew the raisin gently.", img: "images/chew.png" },
  { text: "Swallow the raisin.", img: "images/chew.png" },
  { text: "Notice how you feel now.", img: "images/hold.jpg" }
];

let stepIndex = 0;
let round = 1;
let stepTimer = 30;
let countdownInterval = null;
let isPaused = false;
let isStarted = false;

const instructionEl = document.getElementById("instruction");
const roundEl = document.getElementById("roundDisplay");
const imageEl = document.getElementById("stepImage");
const timerEl = document.getElementById("timer");
const pauseBtn = document.getElementById("pauseBtn");

function loadStep() {
  instructionEl.textContent = steps[stepIndex].text;
  imageEl.src = steps[stepIndex].img;
  stepTimer = 30;
  timerEl.textContent = `⏳ ${stepTimer}s`;
}

function startGame() {
  if (isStarted) return; // prevent double start
  isStarted = true;
  isPaused = false;

  loadStep();

  countdownInterval = setInterval(() => {
    if (!isPaused) {
      stepTimer--;

      if (stepTimer <= 0) {
        nextStep();
      }

      timerEl.textContent = `⏳ ${stepTimer}s`;
    }
  }, 1000);
}

function nextStep() {
  stepIndex++;

  if (stepIndex >= steps.length) {
    stepIndex = 0;
    round++;
    roundEl.textContent = `Round: ${round} / 10`;

    if (round > 10) {
      stopGame();
      return;
    }
  }

  loadStep();
}

function pauseGame() {
  isPaused = !isPaused;

  if (isPaused) {
    pauseBtn.textContent = "Resume";
    pauseBtn.classList.add("paused");
  } else {
    pauseBtn.textContent = "Pause";
    pauseBtn.classList.remove("paused");
  }
}

function resetGame() {
  clearInterval(countdownInterval);

  countdownInterval = null;
  stepIndex = 0;
  round = 1;
  isPaused = false;
  isStarted = false;

  roundEl.textContent = "Round: 1 / 10";
  pauseBtn.textContent = "Pause";
  pauseBtn.classList.remove("paused");

  loadStep();
}

function stopGame() {
  clearInterval(countdownInterval);

  instructionEl.innerHTML = `<div class="finished">✅ 10 Rounds Complete! Great job!</div>`;
  timerEl.textContent = "⏳ Finished";

  isStarted = false;
}
