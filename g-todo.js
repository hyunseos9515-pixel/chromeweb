const toDoForm = document.getElementById("todo-form");
const toDoInput = toDoForm.querySelector("input");
const toDoList = document.getElementById("todo-list");

const TODOS_KEY = "todos";
let toDos = [];

function saveToDos() {
  localStorage.setItem(TODOS_KEY, JSON.stringify(toDos));
}

function deleteToDo(event) {
  const li = event.target.parentElement;
  li.remove();
  toDos = toDos.filter((toDo) => toDo.id !== parseInt(li.id));
  saveToDos();
}

// 완료 버튼 클릭 시 줄 긋기 기능
function toggleDone(event) {
  const span = event.target.parentElement.querySelector("span");
  const isDone = span.style.textDecoration === "line-through";

  if (isDone) {
    span.style.textDecoration = "none";
    span.style.opacity = "1";
    event.target.innerText = "완료";
  } else {
    span.style.textDecoration = "line-through";
    span.style.opacity = "0.5";
    event.target.innerText = "취소";
  }
}

function paintToDo(newTodo) {
  const li = document.createElement("li");
  li.id = newTodo.id;

  const span = document.createElement("span");
  span.innerText = newTodo.text;

  // 완료 버튼 생성
  const doneBtn = document.createElement("button");
  doneBtn.innerText = "완료";
  doneBtn.addEventListener("click", toggleDone);

  // 삭제 버튼 생성
  const delBtn = document.createElement("button");
  delBtn.innerText = "삭제";
  delBtn.addEventListener("click", deleteToDo);

  li.appendChild(span);
  li.appendChild(doneBtn);
  li.appendChild(delBtn);
  toDoList.appendChild(li);
}

function handleToDoSubmit(event) {
  event.preventDefault();
  const newTodoText = toDoInput.value;
  toDoInput.value = "";
  const newTodoObj = {
    text: newTodoText,
    id: Date.now(),
  };
  toDos.push(newTodoObj);
  paintToDo(newTodoObj);
  saveToDos();
}

toDoForm.addEventListener("submit", handleToDoSubmit);

const savedToDos = localStorage.getItem(TODOS_KEY);

if (savedToDos !== null) {
  const parsedToDos = JSON.parse(savedToDos);
  toDos = parsedToDos;
  parsedToDos.forEach(paintToDo);
}

window.resetToDos = function () {
  localStorage.removeItem(TODOS_KEY);
  toDos = [];
  toDoList.innerHTML = "";
};
