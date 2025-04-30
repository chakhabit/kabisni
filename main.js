document.querySelector("#abd").addEventListener("click", (e) => {
  let abdi = document.createElement("p");
  abdi.textContent= "من سمح للعبد أن يقرر ؟";
  e.target.insertAdjacentElement('afterend', abdi);
  e.target.style.cursor = "no-drop";
  e.target.style.pointerEvents = "none";
});
document.querySelector("#start").addEventListener("click", (e) => {
  e.target.parentElement.style.animation = "fade-out 1s";
  setTimeout(() => {
    e.target.parentElement.style.display = "none";
  }, 999);

// Level 1
let circle = document.getElementById("circle");
const chillColors = [
  "#A8D8EA",
  "#76C4D4",
  "#4A89DC",
  "#88C9A1",
  "#6DBCB3",
  "#F5C3C2",
  "#D4B8D9",
  "#E8D5B5",
  "#D9BF77",
  "#E0E0E0",
];
let score = 0;
let vittese = 2000;
let scoreD = document.querySelector(".score span");
let scoreCount = setInterval(() => {
  scoreD.textContent = score;
}, 1000);
let loop = setInterval(randomly, vittese);
let count = 1;
let i = 0;
let lv2 = false;

function randomly() {
  count++;
  let randX = parseInt(Math.random() * 100);
  let randY = parseInt(Math.random() * 100);
  if (randX < 12) randX += 12;
  if (randY < 12) randY += 12;
  circle.style.cssText = `left: calc(${Math.abs(
    randX
  )}% - 50px); top: calc(${Math.abs(randY)}% - 50px)`;
  circle.style.backgroundColor = `${chillColors[i]}`;
  if (count % 3 === 0 && vittese > 100) {
    i = (i + 1) % chillColors.length;
    clearInterval(loop);
    vittese = Math.max(vittese - 100, 100);
    loop = setInterval(randomly, vittese);
  }
  if (vittese === 100 && !lv2) {
    lv2 = true;
    clearInterval(loop);
    startLv2();
  }
}
// Alert sound
const alertN = document.createElement("audio");
alertN.src = "assets/sound/alert.mp3";
// Start Level 2
function moveCircle() {
  let randX = parseInt(Math.random() * 100);
  let randY = parseInt(Math.random() * 100);
  if (randX < 12) randX += 12;
  if (randY < 12) randY += 12;

  circle.style.cssText = `left: calc(${Math.abs(randX)}% - 50px); 
                           top: calc(${Math.abs(randY)}% - 50px)`;
  circle.style.backgroundColor = chillColors[i];
}
let gameLoop;
function startLv2() {
  gameLoop = setInterval(moveCircle, 900);
  alertN.play();
  yippyLoop();
  document.querySelector(".alert").style.display = "block";
  setTimeout(() => {
    document.querySelector(".alert").style.animation = "fade-out 1s";
    setTimeout(() => {
      document.querySelector(".alert").style.display = "none";
    }, 999);
  }, 5000);
}

const yippyAudio = document.createElement("audio");
yippyAudio.src = "assets/sound/Yippee.mp3";
let yippyIteration = 0;
const maxYippyIteration = 10;
function yippyLoop() {
  if (yippyIteration >= maxYippyIteration) return;
  yippy();
  yippyIteration++;
  let yippyTime = setTimeout(yippyLoop, 2000);
  // condition for lv3
  if(yippyIteration === 10) {
    clearTimeout(yippyTime);
    verifyLv2();
  }
}
function yippy() {
  let randX = parseInt(Math.random() * 100);
  let randY = parseInt(Math.random() * 100);
  if (randX < 12) randX += 12;
  if (randY < 12) randY += 12;
  let bug = document.createElement("img");
  bug.src = "assets/img/Hoarding_Bug_Lethal_Company.png";
  bug.classList.add("bug");
  circle.after(bug);
  bug.style.cssText = `position: absolute;user-select: none; width: 50px; left: calc(${Math.abs(
    randX
  )}% - 50px); top: calc(${Math.abs(randY)}% - 50px); cursor: pointer`;
  yippyAudio.play();
  function yippyEatScore() {
    if (document.contains(bug)) {
      score--;
    } else {
      clearInterval(scoreEat);
    }
  }
  let scoreEat = setInterval(yippyEatScore, 1000);
  bug.addEventListener("dblclick", (_) => {
    bug.remove();
    clearInterval(scoreEat);
  });
}
// Verify Level 2
function verifyLv2() {
  setTimeout(() => {
    thereAreAnyBugs();
  }, 3000);
  function thereAreAnyBugs() {
    if(document.getElementsByClassName("bug").length > 0) {
      clearInterval(scoreCount);
      clearInterval(gameLoop);
      document.querySelector(".looser").style.display = "flex";
    }
    else
      startLv3();
  }
} 
// Press This Level 3
function startLv3() {
  ArrowList = ["ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight"];
  let randArrow = null;
  function pressThis() {
    randArrow = Math.floor(Math.random() * ArrowList.length);
    console.log(`press ${ArrowList[randArrow]}`);
  }
  pressThis();
  document.addEventListener("keydown", (e) => {
    if (ArrowList.includes(e.key)) {
      if (e.key === ArrowList[randArrow]) {
        score++;
        console.log(score);
      }
      pressThis();
    }
  });
} 

// Click The Circle
circle.addEventListener("click", (_) => {
  console.log(score);
  score++;
});
})
