"use strict";

let breakTime = null,
    deadline = null,
    didBreak = false,
    isPaused = false,
    pomodoro = null,
    timeInterval = null,
    timeRemain = null;

let breakTimeSet = document.querySelector("input[name=set-break]"),
    sessionTimeSet = document.querySelector("input[name=set-pomodoro]");

const coffee = document.querySelector("button[name=break]"),
      colon = document.querySelector(".colon"),
      minuteSpan = document.querySelector(".minutes"),
      playpause = document.querySelector("button[name=playresume]"),
      secondSpan = document.querySelector(".seconds"),
      sessionSetter = document.querySelector("#session"),
      breakSetter = document.querySelector("#break"),
      resetBtn = document.querySelector("button[name=reset]");

// on window load
window.onload = () => {
   colon.classList.remove("colon");
   sessionTimeSet.value = 25;
   breakTimeSet.value = 5;
};

function listener() {
   window.requestAnimationFrame(() => {
      document.querySelector("#pomodoro-value").innerHTML = sessionTimeSet.value;
      document.querySelector("#break-value").innerHTML = breakTimeSet.value;
      minuteSpan.innerText = sessionTimeSet.value;
   });
}
// listen for changes from session slider
// FIXME: doesn't work for touch
sessionTimeSet.addEventListener("mousedown", () => {
   listener();
   sessionTimeSet.addEventListener("mousemove", listener);
});
sessionTimeSet.addEventListener("mouseup", () => {
   sessionTimeSet.removeEventListener("mousemove", listener);
});

// listen for changes from break slider
// FIXME: doesn't work for touch
breakTimeSet.addEventListener("mousedown", () => {
   listener();
   breakTimeSet.addEventListener("mousemove", listener);
});
breakTimeSet.addEventListener("mouseup", () => {
   breakTimeSet.removeEventListener("mousemove", listener);
});

document.querySelector("button[name=pomodoro]").addEventListener("click", () => {
   clearInterval(timeInterval);
   startPomodoro();
});

resetBtn.addEventListener("click", () => {
   resetSession();
})

function resetSession() {
   colon.classList.remove("colon");
   minuteSpan.classList.remove("time");
   secondSpan.classList.remove("time");
   clearInterval(timeInterval);
   sessionSetter.value = pomodoro;
   breakSetter.value = breakTime;
   isPaused = false;
   playpause.innerHTML = "<i class='fas fa-pause'></i>";
   minuteSpan.innerHTML = sessionSetter.value;
   secondSpan.innerHTML = "00";

   sessionSetter.classList.remove("fadeOut-session");
   sessionSetter.classList.add("fadeIn-session");

   breakSetter.classList.remove("fadeOut-break");
   breakSetter.classList.add("fadeIn-break");
}

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

//pausing and resuming
playpause.addEventListener("click", () => {
   //pause
   if (isPaused === false) {
      isPaused = true;
      colon.classList.toggle("colon");
      minuteSpan.classList.toggle("time");
      secondSpan.classList.toggle("time");
      clearInterval(timeInterval);
      timeRemain = timeLeft(deadline).total;
      playpause.innerHTML = "<i class='fas fa-play'></i>";
      //resume
   } else if (isPaused === true) {
      isPaused = false;
      colon.classList.toggle("colon");
      minuteSpan.classList.toggle("time");
      secondSpan.classList.toggle("time");
      deadline = new Date(Date.parse(new Date()) + timeRemain);
      startTimer(deadline);
      playpause.innerHTML = "<i class='fas fa-pause'></i>";
   }
})


function startPomodoro() {
   colon.classList.add("colon");
   sessionSetter.classList.remove("fadeIn-session");
   breakSetter.classList.remove("fadeIn-break");
   sessionSetter.classList.add("fadeOut-session");
   breakSetter.classList.add("fadeOut-break");

   pomodoro = sessionTimeSet.value;
   minuteSpan.innerHTML = (pomodoro);
   secondSpan.innerHTML = ("00");
   deadline = new Date(Date.parse(new Date()) + (pomodoro * 60 * 1000));
   startTimer(deadline);
   didBreak = false;
}

function startBreak() {
   colon.classList.add("colon");
   playpause.classList.remove("hide");
   breakTime = breakTimeSet.value;
   minuteSpan.innerHTML = (breakTime);
   secondSpan.innerHTML = ("00");
   deadline = new Date(Date.parse(new Date()) + (breakTime * 60 * 1000));
   startTimer(deadline);
   didBreak = true;
}

function startTimer(deadline) {
   function updateClock() {
      const time = timeLeft(deadline);
      minuteSpan.innerHTML = (time.minutes);
      secondSpan.innerHTML = ("0" + time.seconds).slice(-2);

      if (time.total < 0) {
         clearInterval(timeInterval);
         if (didBreak === false) {
            startBreak();
         } else if (didBreak === true) {
            startPomodoro();
         }
      }
   }

   /*
    * avoid delay
    * makes clock accurate to millisecond when pause/resume
    */
   updateClock();
   timeInterval = setInterval(updateClock, 1000);
}
