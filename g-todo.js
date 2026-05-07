// [📺 DOM 요소]
const toDoForm = document.getElementById("todo-form");
const toDoInput = toDoForm.querySelector("input");
const toDoList = document.getElementById("todo-list");

// [💾 Key 이름]
const TODOS_KEY = "todos";

// [🗃️ 할 일 배열]
let toDos = [];

// -----------------------------------------
// [💾 1. localStorage 저장]
// -----------------------------------------
function saveToDos() {
  // 배열을 문자열(JSON)로 변환하여 저장
  localStorage.setItem(TODOS_KEY, JSON.stringify(toDos));
}

// -----------------------------------------
// [❌ 2. 할 일 삭제]
// -----------------------------------------
function deleteToDo(event) {
  // 1. 클릭된 버튼의 부모 요소(li)를 찾아서 DOM에서 삭제
  const li = event.target.parentElement;
  li.remove();

  // 2. 배열에서 삭제 (filter 사용)
  // li.id는 문자열이므로 parseInt로 숫자로 바꿔서 비교해야 함
  toDos = toDos.filter((toDo) => toDo.id !== parseInt(li.id));

  // 3. 변경된 배열을 다시 저장
  saveToDos();
}

// -----------------------------------------
// [✏️ 3. DOM에 할 일 그리기]
// -----------------------------------------
function paintToDo(newTodo) {
  const li = document.createElement("li");
  li.id = newTodo.id; // 객체의 유니크한 ID를 li 태그의 id로 부여

  const span = document.createElement("span");
  span.innerText = newTodo.text;

  // 삭제 버튼 생성
  const button = document.createElement("button");
  button.innerText = "삭제";
  button.addEventListener("click", deleteToDo);

  // li 안에 글자와 버튼을 넣고, 최종적으로 ul(#todo-list)에 추가
  li.appendChild(span);
  li.appendChild(button);
  toDoList.appendChild(li);
}

// -----------------------------------------
// [➕ 4. 할 일 추가 제출 핸들러]
// -----------------------------------------
function handleToDoSubmit(event) {
  event.preventDefault();
  const newTodoText = toDoInput.value;
  toDoInput.value = ""; // 입력창 비우기

  // 할 일 객체 생성
  const newTodoObj = {
    text: newTodoText,
    id: Date.now(), // 고유 ID 생성
  };

  toDos.push(newTodoObj); // 배열에 넣기
  paintToDo(newTodoObj); // 화면에 그리기
  saveToDos(); // 로컬스토리지 저장
}

// -----------------------------------------
// [🔄 5. 초기화 및 데이터 복원]
// -----------------------------------------
toDoForm.addEventListener("submit", handleToDoSubmit);

// 페이지 로드 시 기존 데이터 불러오기
const savedToDos = localStorage.getItem(TODOS_KEY);

if (savedToDos !== null) {
  const parsedToDos = JSON.parse(savedToDos);
  toDos = parsedToDos; // 기존 배열 복구
  parsedToDos.forEach(paintToDo); // 저장된 것들을 하나씩 화면에 출력
}

// 로그아웃 시 호출될 수 있도록 전역 범위에 reset 함수 선언
window.resetToDos = function () {
  localStorage.removeItem(TODOS_KEY);
  toDos = [];
  toDoList.innerHTML = "";
};
