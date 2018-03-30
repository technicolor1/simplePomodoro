/*
 * new Worker:
 * start timer using deadline messaged from indexjs
 * then message the time to indexjs to process into DOM
 *
 * When user pauses:
 * message also contains time remaining
 * use it to resume the time
 * then terminate worker
 *
 * When user resets:
 * post message to worker to reset
 * then terminate worker
 */

// Handle messages
onmessage = (event) => {
   if (event.data.pomodoro !== null) {
      startTimer(event.data.pomodoro);
   } else if (event.data.break !== null) {
      startTimer(event.data.break);
   }
}

// Parse time
function timeLeft(deadline) {
   var total = Date.parse(deadline) - Date.parse(new Date());
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

function startTimer(deadline) {
   function updateClock() {
      let time = timeLeft(deadline);
      postMessage(time);
   }

   // Do not delay in winding up timer
   updateClock();
   setInterval(updateClock, 1000);
}
