let mainTimerInstance;
let currentStintTimerInstance;
let setupDone = false;
let raceLength;
let numberOfStints;

function startTimer() {
  mainTimerInstance = new easytimer.Timer();

  mainTimerInstance.start({
    countdown: true,
    startValues: { minutes: raceLength },
  });
  document.getElementById("main-timer-output").innerText = mainTimerInstance
    .getTimeValues()
    .toString();

  // Update the DOM every time the timer ticks
  mainTimerInstance.addEventListener("secondsUpdated", function (e) {
    document.getElementById("main-timer-output").innerText = mainTimerInstance
      .getTimeValues()
      .toString();
  });

  // Display final time when the countdown is over
  mainTimerInstance.addEventListener("targetAchieved", function (e) {
    document.getElementById("main-timer-output").innerText =
      "Race done, great work!";
  });

  updateStintTimer();
  updateDriverChangeCount();
}

function updateDriverChangeCount() {
  document.getElementById('stints-remaining-output').innerText = `${numberOfStints}`;
}

function updateStintTimer() {
  currentStintTimerInstance = new easytimer.Timer();

  // get the equal stint length until the end
  const secondsRemaining = mainTimerInstance.getTotalTimeValues().seconds;
  const stintSeconds = secondsRemaining / numberOfStints;

  currentStintTimerInstance.start({
    countdown: true,
    startValues: { seconds: stintSeconds },
  });

  currentStintTimerInstance.addEventListener("secondsUpdated", function (e) {
    document.getElementById("next-stint-timer-output").innerText =
      currentStintTimerInstance.getTimeValues().toString();
  });
}

function executeDriverChange() {
  updateStintTimer();

  numberOfStints--;
  updateDriverChangeCount();
}

function setupVariables() {
  const startButton = document.getElementById("btn-start-timer");

  const inputRaceLength = Number(
    document.getElementById("race-length-form-field").value
  );
  const inputNumberOfSwitches = Number(
    document.getElementById("driver-switches-form-field").value
  );

  if (!Number.isNaN(inputRaceLength) && !Number.isNaN(inputNumberOfSwitches)) {
    raceLength = inputRaceLength;
    numberOfStints = inputNumberOfSwitches;

    const remainingTime = moment.duration(raceLength, "minutes");

    // Format and display remaining time
    const formattedTime = moment
      .utc(remainingTime.asMilliseconds())
      .format("HH:mm:ss");
    document.getElementById("main-timer-output").innerText = formattedTime;

    const setupContainer = document.getElementById("setup-container");
    setupContainer.innerHTML = "";

    startButton.removeAttribute("disabled");
    closeModal();

    setupDone = true;
  }
}

function closeModal() {
  const modalElement = document.getElementById("exampleModal");
  const modal = bootstrap.Modal.getInstance(modalElement); // Get the modal instance
  if (modal) {
    modal.hide(); // Hide the modal
  }
}
