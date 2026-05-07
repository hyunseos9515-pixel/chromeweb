// [🔑 환경 설정]
const API_KEY = "e09346b58c32bf773e23cb8c0c8156f6"; // 👈 여기에 OpenWeatherMap API 키를 입력하세요! (따옴표 안에)
const IMG_COUNT = 5; // img 폴더에 넣은 이미지 개수

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
  // 파일명을 0.jpg, 1.jpg, 2.jpg로 고정했습니다.
  bgImage.style.backgroundImage = `url('img/${randomNum}.jpg')`;
}

// -----------------------------------------
// [👤 3. 로그인 / 로그아웃]
// -----------------------------------------
function paintGreeting(username) {
  const date = new Date();
  const hours = date.getHours();
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

function onLoginSubmit(event) {
  event.preventDefault();
  const usernameInput = loginInput.value;
  localStorage.setItem(USERNAME_KEY, usernameInput);
  displayScreens(true);
  paintGreeting(usernameInput);
}

function onLogoutClick() {
  localStorage.removeItem(USERNAME_KEY);
  if (window.resetToDos) window.resetToDos(); // g-todo.js의 초기화 함수 호출
  window.location.reload();
}

// -----------------------------------------
// [🌦️ 4. 날씨 & 위치 API]
// -----------------------------------------
function onGeoOk(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=kr`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const cityEl = weatherWidget.querySelector(".location");
      const tempEl = weatherWidget.querySelector(".temp");
      const descEl = weatherWidget.querySelector(".desc");
      const iconEl = weatherWidget.querySelector(".weather-icon");

      cityEl.innerText = data.name;
      tempEl.innerText = `${Math.round(data.main.temp)}°C`;
      descEl.innerText = data.weather[0].description;

      const iconCode = data.weather[0].icon;
      iconEl.innerHTML = `<img src="https://openweathermap.org/img/wn/${iconCode}@2x.png">`;
    })
    .catch(() => console.log("날씨 정보를 불러올 수 없습니다."));
}

function onGeoError() {
  console.log("위치 정보 권한이 거부되었습니다.");
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
  if (API_KEY) {
    navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError);
  }
} else {
  displayScreens(false);
}
