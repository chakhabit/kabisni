// database ////////////////////////////////////
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';
  const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
async function submitBestScore(mokabiss, newScore) {
  const { data: existing } = await client
    .from('mokabisoun')
    .select('*')
    .eq('mokabiss', mokabiss)
    .single();

  if (!existing) {
    await client.from('mokabisoun').insert([{ mokabiss, bestScore: newScore }]);
  } else if (newScore > existing.bestScore) {
    await client.from('mokabisoun').update({ bestScore: newScore }).eq('mokabiss', mokabiss);
  }
}
////////////////////////////////////////////
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
    }, 999);
  }, 5000);
}
// best kabasin
document.querySelector("#bestKabasin").addEventListener("click", e => {
  const startMenu = document.querySelector("#start_menu");
  const leaderBoard = document.querySelector(".leaderBoarder"); 
  
  startMenu.style.animation = "fade-out 1s";
  setTimeout(() => {
    startMenu.style.display = "none";
    leaderBoard.style.display = "flex";
    leaderBoard.style.animation = "fade-in 1s"; 
  }, 1000);

  async function getTopPlayer() {
    const { data, error } = await client
      .from('mokabisoun')
      .select('*')
      .order('bestScore', { ascending: false })
      .limit(1);
  
    if (error) {
      console.error("Error fetching top score:", error);
      return {msg: "error"};
    }
  
    if (data.length > 0) {
      const topPlayer = data[0];
      console.log(`🏆 Top player: ${topPlayer.mokabiss}, Score: ${topPlayer.bestScore}`);
      return {name: topPlayer.mokabiss, score: topPlayer.bestScore};
    } else {
      console.log("No scores found yet.");
      return {msg: "none"};
    }
}

(async function() {
  let bestPlayerOb = await getTopPlayer();
  if(!bestPlayerOb.msg) {
    document.querySelector(".leaderBoarder .leader .name").textContent = bestPlayerOb.name;
    document.querySelector(".leaderBoarder .leader .point").textContent = bestPlayerOb.score;
  }
  else {
    document.querySelector(".leaderBoarder .leader .name").textContent = "لايوجد لاعب بعد";
    document.querySelector(".leaderBoarder .leader .point").textContent = "لايوجد لاعب بعد";
  }
})();


async function getOtherPlayer() {
  const { data, error } = await client
    .from('mokabisoun')
    .select('*')
    .order('bestScore', { ascending: false })
    .range(1, 9);

  if (error) {
    console.error("Error fetching top score:", error);
    return {msg: "error"};
  }

  if (data.length > 0) {
    const topPlayer = data[0];
    console.log(`🏆 player: ${topPlayer.mokabiss}, Score: ${topPlayer.bestScore}`);
    return data.map(player => ({name: player.mokabiss, score: player.bestScore}));
  } else {
    console.log("No scores found yet.");
    return {msg: "none"};
  }
}

(async function() {
let playerOb = await getOtherPlayer();

if(!playerOb.msg) {
  let index = 2;
  document.querySelector(".others").innerHTML = "";
  playerOb.forEach(e => {
    const listItem = document.createElement('li');
  
    const textDiv = document.createElement('div');
    textDiv.className = 'text';
  
    const profilePic = document.createElement("div");
    profilePic.classList.add("profile_pic", "before-profile-leaders", "before-profile-others");
  
    profilePic.setAttribute("data-content", `#${index}`);
  
    const img = document.createElement('img');
    img.src = 'assets/img/others.png';
    img.alt = 'others';
  
    const nameSpan = document.createElement('span');
    nameSpan.className = 'name';
    nameSpan.textContent = e.name;
  
    const pointSpan = document.createElement('span');
    pointSpan.className = 'point';
    pointSpan.textContent = e.score;
  
    profilePic.appendChild(img);
    textDiv.appendChild(profilePic);
    textDiv.appendChild(nameSpan);
    listItem.appendChild(textDiv);
    listItem.appendChild(pointSpan);
    document.querySelector(".others").append(listItem);
  
    index++;
  });
  
}
else {
  document.querySelector(".leaderBoarder .others .text .name").textContent = "لايوجد لاعب بعد";
  document.querySelector(".leaderBoarder .others .point").textContent = "لايوجد لاعب بعد";
}
})();



});
document.querySelector(".leaderBoarder .close_container").addEventListener("click", () => {
  const leaderBoard = document.querySelector(".leaderBoarder");
  const startMenu = document.querySelector("#start_menu");
  
  leaderBoard.style.animation = "fade-out 1s";
  setTimeout(() => {
    leaderBoard.style.display = "none";
    startMenu.style.display = "flex";
    startMenu.style.animation = "fade-in 1s";
  }, 999);
});
// Store
function store() {
  const skins = [
    "circle",
    "triangleUp",
    "triangleDown",
    "star-six",
    "x-shape",
    "heart",
    "infinity",
    "pacman",
  ];
  let skinPrice = 0;
  const menu = document.getElementById("menu");

  // Generate store boxes
  function createBox(skin, skinPrice) {
    const box = document.createElement("div");
    box.classList.add("box", `p${skinPrice}`);

    const shape = document.createElement("div");
    shape.classList.add(skin, "storeBox", "shape");

    const skinPriceLabel = document.createElement("span");
    skinPriceLabel.style.cssText = `
    position: relative;
    top: 57%;
    font-weight: 500;
    color: #3a0ca3;
    font-size: 13px;
  `;
    skinPriceLabel.textContent = `${skinPrice} زمبيط`;
    skinPriceLabel.setAttribute("dir", "rtl");

    box.appendChild(skinPriceLabel);
    box.appendChild(shape);
    return box;
  }

  // Generate store rows
  for (let i = 0; i < skins.length; i += 2) {
    const row = document.createElement("div");
    row.classList.add("row");
    menu.after(row);

    // First skin box
    row.appendChild(createBox(skins[i], skinPrice));
    skinPrice += 200;

    // Second skin box (if exists)
    if (i + 1 < skins.length) {
      row.appendChild(createBox(skins[i + 1], skinPrice));
      skinPrice += 200;
    }
  }

  // Verification if he get the skin price or not
  function pointStoreVerification() {
    document.querySelector("#pointStore").textContent = localStorage.getItem("storePoint") || 0;
    const storePoint = parseInt(localStorage.getItem("storePoint") || "0");
    const skinPrice = [0, 200, 400, 600, 800, 1000, 1200, 1400];
    skinPrice.forEach((point) => {
      if (storePoint >= point) {
        document.querySelectorAll(`.row .p${point}`).forEach((el) => {
          el.style.pointerEvents = "all";
          el.classList.add("no-before");
          el.classList.add("Unlocked");
        });
      }
    });
  }
  setInterval(() => {
    pointStoreVerification();
  }, 500);



  function heChooseTheSkin() {
    document.querySelectorAll(".Unlocked").forEach((el) => {
      el.addEventListener("click", (e) => {

        document.querySelectorAll(".Unlocked").forEach((box) => {
          box.style.backgroundColor = "";
        });
  
        e.currentTarget.style.backgroundColor = "rgba(255, 215, 0, 0.23)";
  
        // Update player skin
        const player = document.querySelector(".player");
        player.classList.remove(player.classList[2]);
        player.classList.add(e.currentTarget.lastElementChild.classList[0]);
        localStorage.setItem("shape", e.currentTarget.lastElementChild.classList[0]
        );
      });
    });
  }

  setInterval(() => {
    heChooseTheSkin();
  }, 500);


  function openCloseStore() {
    document.querySelector(".store_icon button").addEventListener("click", () => {
      document.querySelector(".main_container .store").style.display = "block";
  
      const closeIcon = document.querySelector(".main_container .store .close");

      closeIcon.addEventListener("click", _ => {
        document.querySelector(".main_container .store").style.display = "none";
        });

        document.addEventListener("click", (e) => {
          if(!document.querySelector(".main_container .store").contains(e.target) &&  
    !document.querySelector(".store_icon button").contains(e.target) )
            document.querySelector(".main_container .store").style.display = "none";
          });


    });
  }
  openCloseStore();
}
store();
saveTheSkin();

function saveTheSkin() {
  document.querySelector(".player").classList.remove(document.querySelector(".player").classList[2]);
  document.querySelector(".player").classList.add(localStorage.getItem("shape") || "circle");
}  

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
  inputValue.style.cursor = "no-drop"
  inputValue.style.userSelect = "none"
  inputValue.classList.add("fixed");
  document.getElementsByClassName("contactForChangeName")[0].innerHTML =
    'لا يمكنك تعديل الاسم مجددا.  <a href="#">راسلنا</a>';
    document.querySelector(".contactForChangeName a").addEventListener("click", _ => AlertN("قيس روحك أيها الضايع"));}

// Start The Game
let scoreD = document.querySelector(".score span");
scoreD.textContent = Math.max(localStorage.getItem("score"), 0);

document.querySelector("#start").addEventListener("click", async function(e) {
  // Name validation
  async function nameValidationIfNotExiste() {
    async function nameValidBDD(userName) {
      const { data: existing } = await client
        .from('mokabisoun')
        .select('mokabiss')
        .eq('mokabiss', userName)
        .single();
    
      return !existing;
    }
    
    let nameValid = false;
    const niggaWord = /n[a-z]*i[a-z]*g[a-z]*g[a-z]*a[a-z]*/;
    const speacilChar = /[§!@#\.$%^&*()_+=\[\]{};':"\\|<>\/?]/;
    const numbers = /[0-9]+/;
    
    if (inputValue.value.toLowerCase().length >= 4 && inputValue.value.toLowerCase().length <= 10) {
      nameValid = true;
      if (niggaWord.test(inputValue.value.toLowerCase().toLowerCase())) {
        alert("This illegal word is not allowed !");
        nameValid = false;
      }
      if (speacilChar.test(inputValue.value.toLowerCase()) || numbers.test(inputValue.value.toLowerCase())) {
        alert("Numbers & special characters are not allowed !");
        nameValid = false;
      }
    } else {
      alert("Give a name between 4 and 10 characters !");
    }
  
    if (nameValid) {
      try {
        const isNameAvailable = await nameValidBDD(inputValue.value.toLowerCase());
        if (!isNameAvailable) {
          alert("This username is already taken!");
          return false;
        }
        else {
          return true;
        }
      } catch (error) {
        console.error("Error checking username:", error);
        return false;
      }
    }
  }
  if (!inputValue.classList.contains("fixed")) {
    e.preventDefault();
    const isValid = await nameValidationIfNotExiste();
    if (!isValid) return;
  }

  localStorage.setItem("userName", inputValue.value.toLowerCase().trim());

  // display : Block | none
  document.querySelector("#save").style.display = "block";
  document.querySelector(".player").removeEventListener("click", cheeter);
  document.querySelector("#start_menu").style.animation = "fade-out 1s";
  setTimeout(() => {
    document.querySelector("#start_menu").style.display = "none";
  }, 999);

  setTimeout(() => {
    AlertN("لا تنسى حفظ تقدمك بعد الانتهاء")
  }, 5000);
  // Level 1
  let circle = document.querySelector(".player");
  // const chillColors = ["#A8D8EA", "#76C4D4","#4A89DC","#88C9A1","#6DBCB3","#F5C3C2","#D4B8D9","#E8D5B5","#D9BF77","#E0E0E0"];
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
    document.querySelector("#pointStore").textContent =
      localStorage.getItem("storePoint") || 0;
    localStorage.setItem(
      "score",
      Math.max(score, localStorage.getItem("score"), 0)
    );

    if (score !== preScore) {
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
  )}% - 50px); top: calc(${Math.abs(
      randY
    )}% - 50px); cursor: pointer; animation: bug linear 2s infinite`;
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
  document.getElementById("save").addEventListener("click", e => {
    clearInterval(loop);
    clearInterval(gameLoop);
    document.querySelector(".main_container").style.pointerEvents = "none";
    AlertN("تم حفظ التقدم أيها الضائع في حياتك");
    document.getElementById("save").textContent = "إعادة";
    e.stopPropagation();   
    document.getElementById("save").addEventListener("click", _ => {
      location.reload();
    })
    submitBestScore(localStorage.getItem("userName"), score);
  }, {once: true})
});

