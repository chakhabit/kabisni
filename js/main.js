// database
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
// Sign Up
async function signUp(email, password, username) {
  try {
    const { data: { user }, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: { username } // Stores username in auth metadata
      }
    });

    if (error) throw error;
    return user;
  } catch (error) {
    console.error("Signup error:", error);
    throw new Error("Signup failed: " + error.message);
  }
}

// Sign in
async function signIn(email, password) {
  const { data, error } = await client.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  return data.user;
}

// Sign out
async function signOut() {
  const { error } = await client.auth.signOut();
  if (error) throw error;
}

// Show log in & sign up ui
document.querySelector("#donthaveAccount").addEventListener("click", showSignUp);
function showSignUp() {
  document.getElementById('signUp').style.display = 'flex';
  document.getElementById('logIn').style.display = 'none';
}

document.querySelector("#haveAccount").addEventListener("click", showLognIn);
function showLognIn() {
  document.getElementById('logIn').style.display = 'flex';
  document.getElementById('signUp').style.display = 'none';
}

// send login & sign up & log out
document.querySelector("#signUpAccount").addEventListener("click", handleSignUp);
async function handleSignUp() {
  const username = document.getElementById('userNameSignUp').value;
  const email = document.getElementById('emailSignUp').value;
  const password = document.getElementById('passwordSignUp').value;

  if (!username || !email || !password) {
    AlertN("الرجاء ملء جميع الحقول");
    return;
  }

  try {
    const { error } = await signUp(email, password, username);
    
    if (error) throw error;
    
    AlertN("تم إرسال رابط التفعيل إلى بريدك الإلكتروني");
    document.getElementById('userNameSignUp').value = "";
   document.getElementById('emailSignUp').value = "";
    document.getElementById('passwordSignUp').value = "";
    showLognIn();
    
  } catch (error) {
    AlertN(`خطأ في التسجيل: ${error.message}`);
  }
}
document.querySelector("#logInAccount").addEventListener("click", handleLogin);
async function handleLogin() {
  const email = document.getElementById('userNameLogIn').value;
  const password = document.getElementById('passwordLogIn').value;
  
  try {
    await signIn(email, password);
    updateUIAfterAuth();
  } catch (error) {
    alert(error.message);
  }
}

document.querySelector("#logOutAccount").addEventListener("click", handleLogout);
async function handleLogout() {
  try {
    await signOut();
    updateUIAfterAuth();
  } catch (error) {
    alert(error.message);
  }
}
// Update the UI after auth check
async function updateUIAfterAuth() {
  try {
    // Check auth state with proper error handling
    const { data: { user }, error } = await client.auth.getUser();
    
    if (error) {
      if (error.message.includes("Auth session missing")) {
        console.log("No active session - showing login screen");
        showLoginScreen();
        return;
      }
      throw error;
    }

    if (user) {
      // Add slight delay for session propagation
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Get profile data with error handling
      const { data: profile, error: profileError } = await client
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();

      const username = profile?.username || user.user_metadata?.username || 'Guest';
      
      document.getElementById('signUp').style.display = 'none';
      document.getElementById('logIn').style.display = 'none';
      document.getElementById('pause').style.display = 'none';
      document.querySelector('.leaderBoarder').style.display = 'none';
      document.getElementById('start_menu').style.display = 'flex';
      document.getElementById('username-display').textContent = username;
      if(isGameRunning == true) {
        document.getElementById('start_menu').style.display = "none";
        setTimeout(() => {
          document.getElementById('start_menu').style.animation = "fade-out 1s";
          setTimeout(() => {
            document.getElementById('start_menu').style.display = "none";
          }, 999);
        }, 5000);
      }

    } else {
      showLoginScreen();
    }
  } catch (error) {
    console.error("UI update error:", error);
    AlertN("Session error. Please refresh the page.");
    showLoginScreen();
  }
}

function showLoginScreen() {
  document.getElementById('signUp').style.display = 'none';
  document.getElementById('logIn').style.display = 'flex';
  document.getElementById('start_menu').style.display = 'none';
}

// Initialize auth state listener
client.auth.onAuthStateChange((event, session) => {
  console.log("Auth state changed:", event);
  if (event === 'INITIAL_SESSION') {
    // Handle initial session loading
    updateUIAfterAuth();
  } else if (event === 'SIGNED_IN') {
    // Wait for session to fully initialize
    setTimeout(updateUIAfterAuth, 500);
  }
});

// Modified initialization code
document.addEventListener('DOMContentLoaded', () => {
  // Give time for session restoration
  setTimeout(updateUIAfterAuth, 300);
});
// Check auth state on page load
document.addEventListener('DOMContentLoaded', () => {
  updateUIAfterAuth();
});


////////////////////////////////////////////
function AlertN(msg) {
  let TheAlert = document.querySelector(".alert");
  const alertN = document.createElement("audio");
  alertN.src = "assets/sound/alert.mp3";
  alertN.play();
  TheAlert.textContent = msg;
  TheAlert.style.display = "block";
  TheAlert.style.userSelect = "none";
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
      .from('scores')
      .select(`score,
    game_duration,
    created_at,
    profiles:user_id (username)`)
      .order('score', { ascending: false })
      .limit(1);
  
    if (error) {
      console.error("Error fetching top score:", error);
      return {msg: "error"};
    }
  
    if (data.length > 0) {
      const topPlayer = data[0];
      console.log(`🏆 Top player: ${topPlayer.profiles.username}, Score: ${topPlayer.score}`);
      return {name: topPlayer.profiles.username, score: topPlayer.score};
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
    .from('scores')
    .select(`score,
      game_duration,
      created_at,
      profiles:user_id (username)`)
    .order('score', { ascending: false })
    .range(1, 9);

  if (error) {
    console.error("Error fetching top score:", error);
    return {msg: "error"};
  }

  if (data.length > 0) {
    const topPlayer = data[0];
    console.log(`🏆 player: ${topPlayer.username}, Score: ${topPlayer.score}`);
    return data.map(player => ({
      name: player.profiles?.username || 'Anonymous', 
      score: player.score
    }));
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
  if(document.querySelector(".leaderBoarder .others .text .name")) {

    document.querySelector(".leaderBoarder .others .text .name").textContent = "لايوجد لاعب بعد";
    document.querySelector(".leaderBoarder .others .point").textContent = "لايوجد لاعب بعد";
  }
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


// Start The Game
let scoreD = document.querySelector(".score span");
scoreD.textContent = Math.max(localStorage.getItem("score"), 0);
let gameStartTime;
let gameEndTime;
let gameTimer;
let isGameRunning = false;

// before starting !
if(isGameRunning == false) {
  setTimeout(() => {
    document.querySelector(".enemy").style.display = "block";
    const spaceVoice = document.createElement("audio");
    spaceVoice.src = "assets/sound/space-sound.mp3"
    spaceVoice.play();
    setTimeout(() => {
      document.querySelector(".enemy").style.display = "none";
    }, 4000);
  }, 5000);
}

document.querySelector("#start").addEventListener("click", startGame);

function startGame() {
  isGameRunning = true;
  gameStartTime = new Date();
  gameTimer = setInterval(updateGameTimer, 1000);


  // display : Block | none
  document.querySelector("#save").style.display = "block";
  document.querySelector("#timer").style.display = "block";
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
    bug.style.cssText = `position: absolute; width: 50px; left: calc(${Math.abs(
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
        document.querySelector("#save").remove();
        clearInterval(gameTimer);
        document.querySelector(".main_container").style.pointerEvents = "none";
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

  document.getElementById("save").addEventListener("click", endGame, {once: true});

  function endGame() {
    if (!isGameRunning) return;
    
    isGameRunning = false;
    clearInterval(gameTimer);
    gameEndTime = new Date();
    
    const gameDuration = (gameEndTime - gameStartTime) / 1000;
  
    clearInterval(loop);
    clearInterval(gameLoop);
    document.querySelector(".main_container").style.pointerEvents = "none";
    document.getElementById("save").textContent = "إعادة";
    document.getElementById("save").addEventListener("click", _ => {
      location.reload();
    })
    
    // Verify score is reasonable for the duration
    if (isScoreValid(score, gameDuration)) {
      submitScore(score, gameDuration);
    } else {
      alert("Score submission rejected - possible cheating detected");
    }
  }
  
  function updateGameTimer() {
    const currentTime = new Date();
    const elapsed = (currentTime - gameStartTime) / 1000;
    // console.log(elapsed);
    // console.log(elapsed * 7);
    // console.log("=======================");
    document.getElementById('timer').textContent = elapsed.toFixed(1);
  }
  
  function isScoreValid(score, duration) {
    const maxPossibleScore = duration * 7;
    return score <= maxPossibleScore;
  }

  
}


async function submitScore(newScore, duration) {
  try {
    const { data: { user }, error: userError } = await client.auth.getUser();
    
    if (userError || !user) {
      AlertN("You must be logged in to save scores");
      return false;
    }

    // First get existing score
    const { data: existing, error: fetchError } = await client
      .from('scores')
      .select('score')
      .eq('user_id', user.id)
      .single();

    let shouldUpdate = true;
    
    if (!fetchError && existing) {
      shouldUpdate = newScore > existing.score;
    }

    if (shouldUpdate) {
      const { error } = await client
        .from('scores')
        .upsert({
          user_id: user.id,
          score: newScore,
          game_duration: duration,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id' // Update
        });

      if (error) throw error;
      AlertN("تم تحديث النتيجة بنجاح!");
      return true;
    }
    
    AlertN("نتيجتك السابقة لا تزال الأفضل!");
    return false;

  } catch (error) {
    console.error("Score update error:", error);
    AlertN("فشل حفظ النتيجة. يُرجى المحاولة مرة أخرى.");
    return false;
  }
}