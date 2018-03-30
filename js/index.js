"use strict";

const breakSetter = document.querySelector("#break"),
   colon = document.querySelector(".colon"),
   minuteSpan = document.querySelector(".minutes"),
   modal = document.querySelector(".control-arm"),
   playpause = document.querySelector("button[name=playresume]"),
   pomoBtn = document.querySelector("button[name=pomodoro]"),
   resetBtn = document.querySelector("button[name=reset]"),
   secondSpan = document.querySelector(".seconds"),
   sessionSetter = document.querySelector("#session");

const workplace = "js/timer.js";

let breakTime = null,
   deadline = null,
   didBreak = false,
   isPaused = false,
   permitSounds = true,
   pomodoro = null,
   timeInterval = null,
   timeRemain = null;

let breakTimeSet = document.querySelector("input[name=set-break]"),
   sessionTimeSet = document.querySelector("input[name=set-pomodoro]");

let sounder = new Howl({
   "src": ["assets/Early_twilight.mp3"],
   "volume": 0.5
});

// Worker
let worker = null;

// Worker handler
function workerHandle() {
   worker.onmessage = (event) => {
      console.log(event.data);
      timeRemain = event.data.total;

      displayer(event.data);
   }
}

// process worker data to DOM
function displayer(data) {
   if (data.hours === 1) {
      minuteSpan.innerHTML = "60";
   } else {
      minuteSpan.innerHTML = (data.minutes);
   }

   if (data.minutes < 10) {
      minuteSpan.innerHTML = "0" + minuteSpan.innerHTML;
   }
   secondSpan.innerHTML = ("0" + data.seconds).slice(-2);

   if (data.total < 0) {
      endSession();
   }

   if (didBreak === false) {
      document.title = `Working... ${minuteSpan.innerHTML}:${secondSpan.innerHTML}`;
   } else if (didBreak === true) {
      document.title = `Coffee... ${minuteSpan.innerHTML}:${secondSpan.innerHTML}`;
   }

   function endSession() {
      if (didBreak === false) {
         extras(false);
         startBreak();
      } else if (didBreak === true) {
         extras(true);
         startPomodoro();
      }
   }


   function extras(which) {
      if (permitSounds === true) {
         sounder.play();
      }
      if (which === false) {
         if (Push.Permission.has() === true) {
            Push.create("Break Time!", {
               "timeout": 5000
           });
         }
      } else if (which === true) {
         if (Push.Permission.has() === true) {
            Push.create("Start Working!", {
               "timeout": 5000
           });
         }
      }
   }
}

document.onload = init();

function init() {
   colon.classList.remove("colon");
   sessionTimeSet.value = 25;
   breakTimeSet.value = 5;

   let note = document.querySelector(".permit");
   if (Push.Permission.has() === false) {
      note.style.color = "red";
      note.innerHTML = "Notifications are disabled";
   } else if (Push.Permission.has() === true) {
      note.style.color = "red";
      note.innerHTML = "Notifications are enabled";
   }
}

[breakTimeSet, sessionTimeSet].forEach((setter) => {
   listener();
   setter.addEventListener("touchstart", () => {
      listener();
      setter.addEventListener("touchmove", listener);
   }, {"passive": true});

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

   function listener(ev) {
      if (typeof ev === "undefined") {
         return;
      }
      window.requestAnimationFrame(() => {
         let el = ev.target.name;
         document.querySelector("#pomodoro-value").innerHTML = sessionTimeSet.value;
         document.querySelector("#break-value").innerHTML = breakTimeSet.value;
         if (el === "set-pomodoro") {
            minuteSpan.innerHTML = sessionTimeSet.value;
         } else if (el === "set-break") {
            minuteSpan.innerHTML = breakTimeSet.value;
         }
      });
   }
})

document.querySelector("button[name=pomodoro]").addEventListener("click", () => {
   clearInterval(timeInterval);
   startPomodoro();
});

resetBtn.addEventListener("click", resetSession);

const notifBtn = document.querySelector("button[name=notif]");
notifBtn.addEventListener("click", () => {
   Push.Permission.request(onGranted, onDenied);

   function onGranted() {
      console.log("Granted")
   }
   function onDenied() {
      console.log("Denied")
   }
})

const soundBtn = document.querySelector("button[name=sfx]");
soundBtn.addEventListener("click", () => {
   permitSounds = !permitSounds;
   !permitSounds ? soundBtn.style.color = "red" : soundBtn.style.color = "black";
});

//pausing and resuming
playpause.addEventListener("click", () => {
   //pause
   if (isPaused === false) {
      isPaused = true;
      colon.classList.toggle("colon");
      worker.terminate();

      playpause.innerHTML = "<i class='fas fa-play'></i>";

      minuteSpan.classList.toggle("time");
      secondSpan.classList.toggle("time");

   //resume
   } else if (isPaused === true) {
      isPaused = false;
      colon.classList.toggle("colon");
      minuteSpan.classList.toggle("time");
      secondSpan.classList.toggle("time");
      worker = new Worker(workplace);
      worker.postMessage({
         "pomodoro": (new Date(Date.parse(new Date()) + timeRemain)),
         "break": null
      });

      workerHandle();
      playpause.innerHTML = "<i class='fas fa-pause'></i>";
   }
})

function resetSession() {
   worker.terminate();

   sounder.stop();
   sessionSetter.value = pomodoro;
   breakSetter.value = breakTime;
   isPaused = false;
   playpause.innerHTML = "<i class='fas fa-pause'></i>";
   minuteSpan.innerHTML = sessionSetter.value;
   secondSpan.innerHTML = "00";

   if (document.title !== "Pomodoro") {
      document.title = "Pomodoro";
   }

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
   // pomodoro = timeBug(true);
   minuteSpan.innerHTML = (pomodoro);
   secondSpan.innerHTML = ("00");
   deadline = new Date(Date.parse(new Date()) + (pomodoro * 60 * 1000));

   if (worker !== null) {
      worker.terminate();

   }
   worker = new Worker(workplace);
   worker.postMessage({
      "pomodoro": deadline,
      "break": null
   });

   workerHandle();
   didBreak = false;
}

function startBreak() {
   breakTime = breakTimeSet.value;
   // breakTime = timeBug(false);
   minuteSpan.innerHTML = (breakTime);
   secondSpan.innerHTML = ("00");
   deadline = new Date(Date.parse(new Date()) + (breakTime * 60 * 1000));

   worker.terminate();

   worker = new Worker(workplace);
   worker.postMessage({
      "pomodoro": null,
      "break": deadline
   })

   workerHandle();
   didBreak = true;
}

const cog = document.querySelector("button[name=cog]");
cog.addEventListener("click", () => {
   modal.style.display = "block";

   window.onclick = (event) => {
      if (event.target === modal) {
         modal.style.display = "none";
      }
   }
})

function timeBug(which) {
   if (which) {
      return 0.1;
   } else {
      return 0.5;
   }
}
