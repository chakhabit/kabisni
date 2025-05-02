// Alert
function AlertN(msg) {
  let TheAlert = document.querySelector(".alert");
  const alertN = document.createElement("audio");
  alertN.src = "assets/sound/alert.mp3";
  alertN.play();
  TheAlert.textContent = msg;
  TheAlert.style.display = "block";
  setTimeout(() => {
    TheAlert.style.animation = "fade-out 1s";
    setTimeout(() => {
      TheAlert.style.display = "none";
    }, 1000);
  }, 5000);
}
// store
let skins = ["triangleUp", "triangleDown", "star-six", "x-shape", "heart", "infinity", "pacman"];
let price = 100;
let priceName = "p" + price;
for (let i = 0; i < skins.length; i += 2) {
  let row = document.createElement("div");
  row.classList.add("row");
  document.getElementById("menu").after(row);

  // First box
  let box1 = document.createElement("div");
  box1.classList.add("box", priceName);
  let shapeBox1 = document.createElement("div");
  shapeBox1.classList.add(skins[i], "storeBox", "shape");
  let span = document.createElement("span");
  span.style.cssText = "position: relative;top: 57%;font-weight: 500;color: #3a0ca3;"
  span.textContent =  price + " زمبيط ";
  span.setAttribute("dir", "rtl");
  box1.appendChild(span);
  price = price + 200;
  priceName = "p" + price;
  box1.appendChild(shapeBox1);
  row.appendChild(box1);

  // Second box (only if there's a next skin)
  if (i + 1 < skins.length) {
    let box2 = document.createElement("div");
    box2.classList.add("box", priceName);
    let shapeBox2 = document.createElement("div");
    shapeBox2.classList.add(skins[i + 1], "storeBox", "shape");
    let span = document.createElement("span");
    span.style.cssText = "position: relative;top: 57%;font-weight: 500;color: #3a0ca3;"
    span.textContent =  price + " زمبيط ";
    span.setAttribute("dir", "rtl");
    box2.appendChild(span);
  price = price + 200;
  priceName = "p" + price;
    box2.appendChild(shapeBox2);
    row.appendChild(box2);
  }
}
document.querySelector("#pointStore").textContent = localStorage.getItem("storePoint") || 0;
const storePoint = parseInt(localStorage.getItem("storePoint") || "0", 10);
const thresholds = [100, 300, 500, 800, 1000]; 

thresholds.forEach((point) => {
  if (storePoint >= point) {
    document.querySelectorAll(`.row .p${point}`).forEach((el) => {
      el.style.pointerEvents = "all";
      el.classList.add("no-before");
      el.classList.add("Unlocked");
    });
  }
});

document.querySelectorAll(".Unlocked").forEach(el => {
  el.addEventListener("click", (e) => {
  document.querySelector(".player").classList.remove(document.querySelector(".player").classList[2]);
  document.querySelector(".player").classList.add(e.currentTarget.lastElementChild.classList[0]);
  });
});

document.querySelector(".store_icon button").addEventListener("click", () => {
  document.querySelector(".main_container .store").style.display = "block";

  document.querySelector(".main_container .store .close").addEventListener("click", (_) => {
    document.querySelector(".main_container .store").style.display = "none";
  })
})

// User click No
document.querySelector("#abd").addEventListener("click", (e) => {
  let abdi = document.createElement("p");
  abdi.textContent = "من سمح للعبد أن يقرر ؟";
  e.target.insertAdjacentElement("afterend", abdi);
  e.target.style.cursor = "no-drop";
  e.target.style.pointerEvents = "none";
});

// click before start
let cheeter = (_) => {
  AlertN("لا تحاول الغش أيها الوغد");
  document.body.style.animation = "rotate 2s ease";
};
document
  .querySelector(".player")
  .addEventListener("click", cheeter, { once: true });
// Name check
let inputValue = document.querySelector("input");
const userName = localStorage.getItem("userName");
if (userName) {
  inputValue.value = userName;
  inputValue.disabled = true;
  document.getElementsByClassName("contactForChangeName")[0].innerHTML =
    'لا يمكنك تعديل الاسم مجددا.  <a href="mailto:mekibes.al@gmail.com">راسلنا</a>';
}
// Start The Game
let scoreD = document.querySelector(".score span");
scoreD.textContent = Math.max(localStorage.getItem("score"), 0);
document.querySelector("#start").addEventListener("click", (e) => {
  document.querySelector(".player").removeEventListener("click", cheeter);
  // Name validation
  let nameValid = false;
  const niggaWord = /n[a-z]*i[a-z]*g[a-z]*g[a-z]*a[a-z]*/;
  const speacilChar = /[§!@#$%^&*()_+=\[\]{};':"\\|<>\/?]/;
  const numbers = /[0-9]+/;
  if (inputValue.value.length >= 4 && inputValue.value.length <= 10) {
    nameValid = true;
    if (niggaWord.test(inputValue.value.toLowerCase())) {
      alert("This illegal word is not allowed !");
      nameValid = false;
    }
    if (
      speacilChar.test(inputValue.value.toLowerCase()) ||
      numbers.test(inputValue.value.toLowerCase())
    ) {
      alert("Numbers & special characters is not allowed !");
      nameValid = false;
    }
  } else {
    alert("Give a name between 4 and 10 characters !");
  }
  if (!nameValid) {
    e.preventDefault();
    return;
  }
  localStorage.setItem("userName", inputValue.value.trim());
  e.target.parentElement.style.animation = "fade-out 1s";
  setTimeout(() => {
    e.target.parentElement.style.display = "none";
  }, 999);

  // Level 1
  let circle = document.querySelector(".player");
  // const chillColors = [
  //   "#A8D8EA",
  //   "#76C4D4",
  //   "#4A89DC",
  //   "#88C9A1",
  //   "#6DBCB3",
  //   "#F5C3C2",
  //   "#D4B8D9",
  //   "#E8D5B5",
  //   "#D9BF77",
  //   "#E0E0E0",
  // ];
  let score = 0;
  localStorage.setItem(
    "score",
    Math.max(score, localStorage.getItem("score"), 0)
  );
  let vittese = 2000;
  // let vittese = 200;
  let preScore = score;
  let scoreCount = setInterval(() => {
    scoreD.textContent = score;
    document.querySelector("#pointStore").textContent = localStorage.getItem("storePoint") || 0;
    localStorage.setItem(
      "score",
      Math.max(score, localStorage.getItem("score"), 0)
    );
    
    if(score !== preScore) {
      const currentScore = parseInt(localStorage.getItem("storePoint")) || 0;
      const pointChange = score - preScore;
      localStorage.setItem("storePoint", currentScore + pointChange);
      preScore = score;
    }
    
  }, 500);
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
    // circle.style.backgroundColor = `${chillColors[i]}`;
    if (count % 3 === 0 && vittese > 100) {
      // i = (i + 1) % chillColors.length;
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
  // Start Level 2
  function moveCircle() {
    let randX = parseInt(Math.random() * 100);
    let randY = parseInt(Math.random() * 100);
    if (randX < 12) randX += 12;
    if (randY < 12) randY += 12;

    circle.style.cssText = `left: calc(${Math.abs(randX)}% - 50px); 
                           top: calc(${Math.abs(randY)}% - 50px)`;
    // circle.style.backgroundColor = chillColors[i];
  }
  let gameLoop;
  function startLv2() {
    gameLoop = setInterval(moveCircle, 900);
    AlertN("إنتبه من الهورينغ... تخلص منه !!");
    yippyLoop();
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
    if (yippyIteration === 10) {
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
    bug.style.cssText = `position: absolute; user-select: none; user-drag: none;-webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none; width: 50px; left: calc(${Math.abs(
      randX
    )}% - 50px); top: calc(${Math.abs(randY)}% - 50px); cursor: pointer; animation: bug linear 2s infinite`;
    yippyAudio.play();
    function yippyEatScore() {
      if (document.contains(bug)) {
        score--;
        pointMinus("-1", randX, randY);
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
      if (document.getElementsByClassName("bug").length > 0) {
        clearInterval(scoreCount);
        clearInterval(gameLoop);
        document.querySelector(".looser").style.display = "flex";
      } else startLv3();
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
  // point + - display
  function pointPlus(p, myEvent) {
    let point = document.createElement("span");
    point.textContent = p;
    point.style.cssText = `
      position: absolute;
      left: ${myEvent.pageX}px;
      top: ${myEvent.pageY}px;
      color: red;
      font-weight: bold;
      z-index: 10;
      user-select: none;
      pointer-events: none;
      transition: all 0.5s ease-out;
    `;
    document.body.appendChild(point);
      setTimeout(() => {
      point.style.opacity = "0";
      point.style.transform = "translateY(-20px)";
    }, 0);
  
    setTimeout(() => {
      point.remove();
    }, 500);
  }
  function pointMinus(p, X, Y) {
    let point = document.createElement("span");
    point.textContent = p;
    point.style.cssText = `
      position: absolute;
      left: calc(${Math.abs(X)}% - 50px);
      top: calc(${Math.abs(Y)}% - 50px);
      color: red;
      font-weight: bold;
      z-index: 10;
      user-select: none;
      pointer-events: none;
      transition: all 0.5s ease-out;
    `;
    document.body.appendChild(point);
      setTimeout(() => {
      point.style.opacity = "0";
      point.style.transform = "translateY(-20px)";
    }, 0);
  
    setTimeout(() => {
      point.remove();
    }, 500);
  }
  // Click The Circle
  circle.addEventListener("click", (e) => {
    score++;
    pointPlus("+1", e);
  });
  
});
