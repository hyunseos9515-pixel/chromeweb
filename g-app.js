// [🔑 환경 설정]
const API_KEY = "e09346b58c32bf773e23cb8c0c8156f6";
const IMG_COUNT = 5;

// [📺 DOM 요소]
const loginContainer = document.querySelector("#login-container");
const loginClock = document.querySelector("#login-clock");
const loginDate = document.querySelector("#login-date");
const loginForm = document.querySelector("#login-form");
const loginInput = document.querySelector("#login-form input");
const mainContainer = document.querySelector("#main-container");
const mainClock = document.querySelector("#main-clock");
const mainDate = document.querySelector("#main-date");
const greeting = document.querySelector("#greeting");
const logoutBtn = document.querySelector("#logout-btn");
const bgImage = document.querySelector("#bg-image");
const weatherWidget = document.querySelector("#weather");

// [💾 Key 이름]
const USERNAME_KEY = "username";

// -----------------------------------------
// [🕒 1. 실시간 시계 & 날짜]
// -----------------------------------------
function getClock() {
  const date = new Date();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const clockStr = `${hours}:${minutes}:${seconds}`;

  loginClock.innerText = clockStr;
  mainClock.innerText = clockStr;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const week = ["일", "월", "화", "수", "목", "금", "토"];
  const dateStr = `${year}년 ${month}월 ${day}일 ${week[date.getDay()]}요일`;

  loginDate.innerText = dateStr;
  mainDate.innerText = dateStr;
}

// -----------------------------------------
// [🖼️ 2. 랜덤 배경 이미지]
// -----------------------------------------
function setRandomBackground() {
  const randomNum = Math.floor(Math.random() * IMG_COUNT);
  bgImage.style.backgroundImage = `url('img/${randomNum}.jpg')`;
}

// -----------------------------------------
// [👤 3. 로그인 / 로그아웃]
// -----------------------------------------
function paintGreeting(username) {
  const hours = new Date().getHours();
  let timeText = "안녕하세요";

  if (hours >= 5 && hours < 12) timeText = "좋은 아침이에요";
  else if (hours >= 12 && hours < 18) timeText = "좋은 오후에요";
  else timeText = "좋은 밤이에요";

  greeting.innerText = `${timeText}, ${username}님!`;
}

function displayScreens(isLoggedIn) {
  if (isLoggedIn) {
    loginContainer.classList.add("hidden");
    mainContainer.classList.remove("hidden");
    weatherWidget.classList.remove("hidden");
  } else {
    loginContainer.classList.remove("hidden");
    mainContainer.classList.add("hidden");
    weatherWidget.classList.add("hidden");
  }
}

// -----------------------------------------
// [🌦️ 4. 실제 날씨 API 호출]
// -----------------------------------------
function onGeoOk(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  // 한국어 설정(&lang=kr)과 섭씨 온도(&units=metric)가 적용된 URL입니다.
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=kr`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const cityEl = weatherWidget.querySelector(".location");
      const tempEl = weatherWidget.querySelector(".temp");
      const descEl = weatherWidget.querySelector(".desc");

      cityEl.innerText = `${data.name}-si`;
      tempEl.innerText = `${Math.round(data.main.temp)}°C`;
      descEl.innerText = data.weather[0].description;
    })
    .catch((error) =>
      console.log("날씨 정보를 가져오는 데 실패했습니다.", error),
    );
}

function onGeoError() {
  alert("위치 정보를 허용하지 않아 실시간 날씨를 불러올 수 없습니다.");
}

// -----------------------------------------
// [➕ 이벤트 핸들러]
// -----------------------------------------
function onLoginSubmit(event) {
  event.preventDefault();
  const usernameInput = loginInput.value;
  localStorage.setItem(USERNAME_KEY, usernameInput);
  displayScreens(true);
  paintGreeting(usernameInput);
  navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError);
}

function onLogoutClick() {
  localStorage.removeItem(USERNAME_KEY);
  if (window.resetToDos) window.resetToDos();
  window.location.reload();
}

// -----------------------------------------
// [🚀 실행]
// -----------------------------------------
setRandomBackground();
getClock();
setInterval(getClock, 1000);

loginForm.addEventListener("submit", onLoginSubmit);
logoutBtn.addEventListener("click", onLogoutClick);

const savedUsername = localStorage.getItem(USERNAME_KEY);

if (savedUsername) {
  displayScreens(true);
  paintGreeting(savedUsername);
  navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError);
} else {
  displayScreens(false);
}
