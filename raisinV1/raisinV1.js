  const circle = document.getElementById("circle");
  const instruction = document.getElementById("instruction");
  const timerDisplay = document.getElementById("timer");
  const roundDisplay = document.getElementById("round");

  const f1 = document.getElementById("f1");
  const f2 = document.getElementById("f2");
  const f3 = document.getElementById("f3");

  const steps = [
    { state: "center", text: "Hold at CENTER of the tongue" },
    { state: "upper-left", text: "Move to UPPER LEFT of the tongue" },
    { state: "lower-right", text: "Move to LOWER RIGHT of the tongue" },
    { state: "upper-right", text: "Move to UPPER RIGHT of the tongue" },
    { state: "lower-left", text: "Move to LOWER LEFT  of the tongue" },
    { state: "center", text: "Return to CENTER" }
  ];

  let index = 0;
  let round = 0;
  let maxRounds = 10;
  let chewing = false;

  let animationInterval = null;
  let countdownInterval = null;
  let timeLeft = 5;

  function updateTimer() {
    timerDisplay.innerText = timeLeft;
    timeLeft--;
  }

  function moveCircle() {
    if (round >= maxRounds || chewing) return;

    circle.classList.remove(
      "center", "upper-left", "lower-right", "upper-right", "lower-left"
    );

    const step = steps[index];
    circle.classList.add(step.state);
    instruction.innerText = step.text;

    timeLeft = 5;
    timerDisplay.innerText = timeLeft;

    index++;

    if (index >= steps.length) {
      index = 0;
      round++;
      roundDisplay.innerText = `Round ${round}/10`;
      startChewingPhase();
    }
  }

  function startChewingPhase() {
    chewing = true;
    pauseAnimation();

    instruction.innerText = "Break it and chew slowly...";
    circle.style.opacity = "0";

    [f1, f2, f3].forEach(f => {
      f.style.left = "50%";
      f.style.top = "62%";
      f.style.opacity = "1";
    });

    f1.style.transform = "translate(-40px, -10px)";
    f2.style.transform = "translate(10px, 30px)";
    f3.style.transform = "translate(40px, -20px)";

    setTimeout(() => {
      [f1, f2, f3].forEach(f => f.style.opacity = "0");
      instruction.innerText = "Swallow it slowly.";

      setTimeout(() => {
        circle.style.opacity = "1";
        chewing = false;
        instruction.innerText = round < maxRounds 
          ? `Round ${round} complete. Press Start for next round.` 
          : "Session complete ✅";
        timerDisplay.innerText = "5";
      }, 3000);

    }, 5000);
  }

  function startAnimation() {
    if (!animationInterval && !chewing && round < maxRounds) {
      moveCircle();
      updateTimer();
      animationInterval = setInterval(moveCircle, 5000);
      countdownInterval = setInterval(updateTimer, 1000);
    }
  }

  function pauseAnimation() {
    clearInterval(animationInterval);
    clearInterval(countdownInterval);
    animationInterval = null;
    countdownInterval = null;
  }

  function resetAnimation() {
    pauseAnimation();
    index = 0;
    timeLeft = 5;

    circle.style.opacity = "1";
    circle.className = "circle center";

    [f1, f2, f3].forEach(f => f.style.opacity = "0");

    timerDisplay.innerText = "5";
    instruction.innerText = `Reset. Continue from Round ${round}/10`;
  }