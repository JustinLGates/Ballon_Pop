//#region

let clickCount = 0;
let height = 120;
let width = 100;
let inflationRate = 20;
let maxSize = 300;
let currentPopCount = 0;
let heighestPopCount = 0;
let gameLength = 30000;
let clockId = 0;
let timeRemaining = 0;
let currentPlayer = {};
let currentColor = "red";
let posssibleColors = ["green", "red", "blue", "purple", "pink"];

function startGame() {
  console.log("game started");
  document.getElementById("score-board").classList.add("hidden");
  document.getElementById("game-controls").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");

  startClock();
  setTimeout(stopGame, gameLength - 1000);
}
function startClock() {
  timeRemaining = gameLength;
  drawClock();
  clockId = setInterval(drawClock, 1000);
}
function stopClock() {
  clearInterval(clockId);
}
function drawClock() {
  let countdownElement = document.getElementById("countdown");
  timeRemaining -= 1000;
  console.log(timeRemaining);
  countdownElement.innerText = (timeRemaining / 1000).toString();
}
function inflate() {
  clickCount++;
  height += inflationRate;
  width += inflationRate;
  checkBalloonPop();
  draw();
}

function checkBalloonPop() {
  if (height >= maxSize) {
    // @ts-ignore
    document.getElementById("pop-sound").play();
    currentPopCount++;
    height = 0;
    width = 0;
    // @ts-ignore
    let ballonElement = document.getElementById("balloon");
    ballonElement.classList.remove(currentColor);
    getRandomColor();
    ballonElement.classList.add(currentColor);
  }
}
function getRandomColor() {
  let i = Math.floor(Math.random() * posssibleColors.length);
  currentColor = posssibleColors[i];
}
function draw() {
  let heighestPopCountElement = document.getElementById("heighest-pop-count");
  let clickCountElement = document.getElementById("click-count");
  let ballonElement = document.getElementById("balloon");
  let popcountElement = document.getElementById("pop-count");
  let playerNameElement = document.getElementById("player-name");
  ballonElement.style.height = height.toString() + "px";
  ballonElement.style.width = width.toString() + "px";
  clickCountElement.innerText = clickCount.toString();
  popcountElement.innerText = currentPopCount.toString();
  heighestPopCountElement.innerText = currentPlayer.topScore.toString();
  playerNameElement.innerText = currentPlayer.name;
}
function stopGame() {
  document.getElementById("score-board").classList.remove("hidden");
  document.getElementById("game-controls").classList.remove("hidden");
  document.getElementById("game").classList.add("hidden");
  clickCount = 0;
  height = 120;
  width = 100;

  if (currentPopCount > currentPlayer.topScore) {
    currentPlayer.topScore = currentPopCount;
    savePlayers();
  }
  currentPopCount = 0;

  stopClock();
  draw();
  drawScoreBoard();
}
//#endregion

let players = [];
loadPlayers();

function setPlayer(event) {
  event.preventDefault();

  let form = event.target;
  let playerName = form.playerName.value;

  currentPlayer = players.find((player) => player.name == playerName);

  if (!currentPlayer) {
    currentPlayer = { name: playerName, topScore: 0 };
    players.push(currentPlayer);
    savePlayers();
  }
  form.reset();

  form.classList.add("hidden");
  document.getElementById("game-controls").classList.remove("hidden");
  document.getElementById("current-player-card").classList.remove("hidden");
  draw();
  drawScoreBoard();
}
function changePlayer() {
  console.log("called change player function");
  document.getElementById("player-form").classList.remove("hidden");
  document.getElementById("game-controls").classList.add("hidden");
}
function savePlayers() {
  window.localStorage.setItem("players", JSON.stringify(players));
}
function loadPlayers() {
  let playersData = JSON.parse(window.localStorage.getItem("players"));
  if (!playersData) {
    players = [];
  } else {
    players = playersData;
  }
}
function drawScoreBoard() {
  let template = "";
  players.sort((p1, p2) => p2.topScore - p1.topScore);
  players.forEach((player) => {
    template += `  <div class="dflex space-between">
    <span>
      <i class="fa fa-user-circle" aria-hidden="true"></i>
      ${player.name}
    </span>
    <span>score: ${player.topScore}</span>
  </div>`;
  });
  document.getElementById("players").innerHTML = template;
}
drawScoreBoard();
