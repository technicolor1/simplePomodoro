"use strict";

const breakSetter = document.querySelector("#break"),
   colon = document.querySelector(".colon"),
   minuteSpan = document.querySelector(".minutes"),
   playpause = document.querySelector("button[name=playresume]"),
   pomoBtn = document.querySelector("button[name=pomodoro]"),
   progress = document.querySelector("#progress1"),
   resetBtn = document.querySelector("button[name=reset]"),
   secondSpan = document.querySelector(".seconds"),
   sessionSetter = document.querySelector("#session");

let breakTime = null,
   deadline = null,
   didBreak = false,
   isPaused = false,
   pomodoro = null,
   progressremain = null,
   timeInterval = null,
   timeRemain = null;

let breakTimeSet = document.querySelector("input[name=set-break]"),
   sessionTimeSet = document.querySelector("input[name=set-pomodoro]");

colon.classList.remove("colon");
resetBtn.classList.add("hide");
playpause.classList.add("hide");
sessionTimeSet.value = 25;
breakTimeSet.value = 5;

function listener(ev) {
   window.requestAnimationFrame(() => {
      document.querySelector("#pomodoro-value").innerHTML = sessionTimeSet.value;
      document.querySelector("#break-value").innerHTML = breakTimeSet.value;
   });
}

[breakTimeSet, sessionTimeSet].forEach((setter) => {
   listener();
   setter.addEventListener("touchstart", () => {
      listener();
      setter.addEventListener("touchmove", listener);
   });

   setter.addEventListener("touchend", () => {
      setter.removeEventListener("touchmove", listener);
   })

   setter.addEventListener("mousedown", () => {
      listener();
      setter.addEventListener("mousemove", listener);
   });

   setter.addEventListener("mouseup", () => {
      setter.removeEventListener("mousemove", listener);
   })
})

document.querySelector("button[name=pomodoro]").addEventListener("click", () => {
   clearInterval(timeInterval);
   startPomodoro();
});

resetBtn.addEventListener("click", () => {
   resetSession();
})

function resetSession() {
   clearInterval(timeInterval);
   sessionSetter.value = pomodoro;
   breakSetter.value = breakTime;
   isPaused = false;
   playpause.innerHTML = "<i class='fas fa-pause'></i>";
   minuteSpan.innerHTML = sessionSetter.value;
   secondSpan.innerHTML = "00";
   progressremain = null;

   progress.style.width = 0;

   colon.classList.remove("colon");

   minuteSpan.classList.remove("time");
   secondSpan.classList.remove("time");

   sessionSetter.classList.remove("fadeOutLeft");
   sessionSetter.classList.add("fadeInLeft");

   breakSetter.classList.remove("fadeOutRight");
   breakSetter.classList.add("fadeInRight");

   resetBtn.classList.remove("rotateIn");
   resetBtn.classList.add("rotateOut");
   resetBtn.classList.add("hide");

   playpause.classList.remove("ZoomIn");
   playpause.classList.add("zoomOut");
   playpause.classList.add("hide");

   pomoBtn.classList.remove("zoomOut");
   pomoBtn.classList.remove("hide");
   pomoBtn.classList.add("zoomIn");
}

function timeLeft(end) {
   var total = Date.parse(end) - Date.parse(new Date());
   var seconds = Math.floor((total / 1000) % 60);
   var minutes = Math.floor((total / 1000 / 60) % 60);
   var hours = Math.floor((total / 1000 / 60 / 60) % 60);

   console.log(total);

   return {
      "total": total,
      "minutes": minutes,
      "seconds": seconds,
      "hours": hours
   };
}

//pausing and resuming
playpause.addEventListener("click", () => {
   //pause
   if (isPaused === false) {
      isPaused = true;
      colon.classList.toggle("colon");
      clearInterval(timeInterval);
      timeRemain = timeLeft(deadline).total;
      playpause.innerHTML = "<i class='fas fa-play'></i>";

      minuteSpan.classList.toggle("time");
      secondSpan.classList.toggle("time");

      progressremain = (progress.style.width).slice(0, -1);
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
   sessionSetter.classList.remove("fadeInLeft");
   breakSetter.classList.remove("fadeInRight");
   sessionSetter.classList.add("fadeOutLeft");
   breakSetter.classList.add("fadeOutRight");

   resetBtn.classList.remove("hide");
   resetBtn.classList.remove("rotateOut");
   resetBtn.classList.add("rotateIn");

   playpause.classList.remove("hide");
   playpause.classList.remove("zoomOut");
   playpause.classList.add("zoomIn");

   pomoBtn.classList.remove("zoomIn");
   pomoBtn.classList.add("zoomOut");
   pomoBtn.classList.add("hide");

   pomodoro = sessionTimeSet.value;
   minuteSpan.innerHTML = (pomodoro);
   secondSpan.innerHTML = ("00");
   deadline = new Date(Date.parse(new Date()) + (pomodoro * 60 * 1000));
   startTimer(deadline);
   didBreak = false;
}

function startBreak() {
   breakTime = breakTimeSet.value;
   minuteSpan.innerHTML = (breakTime);
   secondSpan.innerHTML = ("00");
   deadline = new Date(Date.parse(new Date()) + (breakTime * 60 * 1000));
   startTimer(deadline);
   didBreak = true;
}

function startTimer(deadline) {
   let percent = 100 / (pomodoro * 60);
   let width = 0;

   if (progressremain !== null) {
      width = parseFloat(progressremain);
   }
   function updateClock() {
      let time = timeLeft(deadline);
      minuteSpan.innerHTML = (time.minutes);

      // don't change the bar unless time is elapsing
      //FIXME: width still increases when resuming from pause
      if (time.total !== (pomodoro * 60000)) {
         width += percent;
         progress.style.width = width + "%";
      }

      if (time.hours === 1) {
         minuteSpan.innerHTML = "60";
      }

      if (time.minutes < 10) {
         minuteSpan.innerHTML = "0" + minuteSpan.innerHTML;
      }
      secondSpan.innerHTML = ("0" + time.seconds).slice(-2);

      // console.log(time.total);
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
