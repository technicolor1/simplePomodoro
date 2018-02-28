let breakTime = 5,
   deadline = null,
   didBreak = false,
   isPaused = false,
   pomodoro = 25,
   timeInterval = null,
   timeRemain = null;

const coffee = document.querySelector("button[name=break]"),
   colon = document.querySelector(".colon"),
   minuteSpan = document.querySelector(".minutes"),
   secondSpan = document.querySelector(".seconds");


window.onload = () => {
   colon.classList.remove("colon");

};

document.querySelector("button[name=pomodoro]").addEventListener("click", () => {
   clearInterval(timeInterval);
   startPomodoro();
});

document.querySelector("button[name=break]").addEventListener("click", () => {
   clearInterval(timeInterval);
   startBreak();
});

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
const playpause = document.querySelector("button[name=playresume]");
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
   minuteSpan.innerHTML = (pomodoro);
   secondSpan.innerHTML = ("00");
   deadline = new Date(Date.parse(new Date()) + (pomodoro * 60 * 1000));
   startTimer(deadline);
   didBreak = false;
}

function startBreak() {
   colon.classList.add("colon");
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
