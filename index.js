
    function playBreathing() {
      window.location.href = "breathingGame/breathing.html"; 
    }

    function playRaisin() {
      window.location.href = "raisinIntro.html"; 
    }

    function playBoth() {
      localStorage.setItem("playMode", "both");
      window.location.href = "breathingGame/breathing.html"; 
    }
