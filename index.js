let breakTime = 1,
    deadline = null,
    didBreak = false,
    pomodoro = 1,
    timeInterval = null,
    timeRemain = null;

const minuteSpan = document.querySelector(".minutes"),
      pauseResume = document.querySelector("button[name=pause]"),
      resume = document.querySelector("button[name=resume]"),
      secondSpan = document.querySelector(".seconds");


function timeLeft(end) {
   var total = Date.parse(end) - Date.parse(new Date());
   var seconds = Math.floor((total / 1000) % 60);
   var minutes = Math.floor((total / 1000 / 60) % 60);

   return {
      "total": total,
      "minutes": minutes,
      "seconds": seconds
   };
}

//Pause if timer is running
function stopClock() {
   clearInterval(timeInterval);
   timeRemain = timeLeft(deadline).total;
}

function resumeClock() {
   deadline = new Date(Date.parse(new Date()) + timeRemain);

   //Start the clock
   startTimer(deadline);
}

pauseResume.addEventListener("click", () => {
   stopClock();
});

resume.addEventListener("click", () => {
   resumeClock();
})


function startPomodoro() {
   minuteSpan.innerHTML = ("0" + pomodoro).slice(-2);
   secondSpan.innerHTML = ("00");
   deadline = new Date(Date.parse(new Date()) + (pomodoro * 60 * 1000));
   startTimer(deadline);
   didBreak = false;
}

function startBreak() {
   minuteSpan.innerHTML = ("0" + breakTime).slice(-2);
   secondSpan.innerHTML = ("00");
   deadline = new Date(Date.parse(new Date()) + (breakTime * 60 * 1000));
   startTimer(deadline);
   didBreak = true;
}

function startTimer(deadline) {
   timeInterval = setInterval(() => {
      const time = timeLeft(deadline);
      minuteSpan.innerHTML = ("0" + time.minutes).slice(-2);
      secondSpan.innerHTML = ("0" + time.seconds).slice(-2);

      if (time.total < 0) {
         clearInterval(timeInterval);
         if (didBreak === false) {
            startBreak();
         } else if (didBreak === true) {
            startPomodoro();
         }
      }
   }, 1000);
}

/*
 *Window.onload = () => {
 *startPomodoro();
 *};
 */

document.querySelector("button[name=pomodoro]").addEventListener("click", () => {
   clearInterval(timeInterval);
   startPomodoro();
});

document.querySelector("button[name=break]").addEventListener("click", () => {
   clearInterval(timeInterval);
   startBreak();
});
