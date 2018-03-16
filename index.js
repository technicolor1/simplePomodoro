"use strict";

const breakSetter = document.querySelector("#break"),
   colon = document.querySelector(".colon"),
   minuteSpan = document.querySelector(".minutes"),
   playpause = document.querySelector("button[name=playresume]"),
   pomoBtn = document.querySelector("button[name=pomodoro]"),
   resetBtn = document.querySelector("button[name=reset]"),
   secondSpan = document.querySelector(".seconds"),
   sessionSetter = document.querySelector("#session");

let breakTime = null,
   deadline = null,
   didBreak = false,
   isPaused = false,
   pomodoro = null,
   timeInterval = null,
   timeRemain = null;

let breakTimeSet = document.querySelector("input[name=set-break]"),
   sessionTimeSet = document.querySelector("input[name=set-pomodoro]");

let sounder = new Audio("assets/Early_twilight.mp3");

colon.classList.remove("colon");
resetBtn.classList.add("hide");
playpause.classList.add("hide");
sessionTimeSet.value = 25;
breakTimeSet.value = 5;

function listener() {
   window.requestAnimationFrame(() => {
      document.querySelector("#pomodoro-value").innerHTML = sessionTimeSet.value;
      document.querySelector("#break-value").innerHTML = breakTimeSet.value;
      minuteSpan.innerHTML = sessionTimeSet.value;
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

function timeLeft(end) {
   var total = Date.parse(end) - Date.parse(new Date());
   var seconds = Math.floor((total / 1000) % 60);
   var minutes = Math.floor((total / 1000 / 60) % 60);
   var hours = Math.floor((total / 1000 / 60 / 60) % 60);

   return {
      "total": total,
      "minutes": minutes,
      "seconds": seconds,
      "hours": hours
   };
}

function resetSession() {
   clearInterval(timeInterval);
   sessionSetter.value = pomodoro;
   breakSetter.value = breakTime;
   isPaused = false;
   playpause.innerHTML = "<i class='fas fa-pause'></i>";
   minuteSpan.innerHTML = sessionSetter.value;
   secondSpan.innerHTML = "00";

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
   function updateClock() {
      let time = timeLeft(deadline);

      if (time.hours === 1) {
         minuteSpan.innerHTML = "60";
      } else {
         minuteSpan.innerHTML = (time.minutes);
      }

      if (time.minutes < 10) {
         minuteSpan.innerHTML = "0" + minuteSpan.innerHTML;
      }
      secondSpan.innerHTML = ("0" + time.seconds).slice(-2);

      if (time.total < 0) {
         clearInterval(timeInterval);
         if (didBreak === false) {
            minuteSpan.innerHTML = "00";
            secondSpan.innerHTML = "00";
            sounder.play();
            setTimeout(startBreak, 8000);
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
