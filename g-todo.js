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
    localStorage.setItem(TODOS_KEY, JSON.stringify(toDos));
}

// -----------------------------------------
// [❌ 2. 할 일 삭제]
// -----------------------------------------
function deleteToDo(event) {
    const li = event.target.parentElement;
    li.remove();
    toDos = toDos.filter((toDo) => toDo.id !== parseInt(li.id));
    saveToDos();
}

// -----------------------------------------
// [✅ 3. 할 일 완료/취소 토글]
// -----------------------------------------
// ✅ 이 함수가 글씨에 취소선을 긋거나 지우는 핵심 로직입니다.
function toggleDone(event) {
    // 1. 클릭된 버튼의 부모(li) 안에서 글자가 써진 span 태그를 찾습니다.
    const span = event.target.parentElement.querySelector("span");
    
    // 2. 현재 취소선이 그어져 있는지 확인합니다.
    const isDone = span.style.textDecoration === "line-through";
    
    if (isDone) {
        // 취소선이 있으면 지웁니다.
        span.style.textDecoration = "none";
        span.style.opacity = "1"; // 불투명도 원상복구
        event.target.innerText = "완료"; // 버튼 텍스트 변경
    } else {
        // 취소선이 없으면 긋습니다.
        span.style.textDecoration = "line-through";
        span.style.opacity = "0.5"; // 약간 투명하게 만들어서 완료된 느낌 줌
        event.target.innerText = "취소"; // 버튼 텍스트 변경
    }
}

// -----------------------------------------
// [✏️ 4. DOM에 할 일 그리기]
// -----------------------------------------
function paintToDo(newTodo) {
    const li = document.createElement("li");
    li.id = newTodo.id;

    const span = document.createElement("span");
    span.innerText = newTodo.text;

    // ✅ 완료 버튼 생성
    const doneBtn = document.createElement("button");
    doneBtn.innerText = "완료";
    doneBtn.style.marginLeft = "10px"; // 삭제 버튼과 간격
    doneBtn.addEventListener("click", toggleDone); // 클릭 시 toggleDone 함수 실행

    // 삭제 버튼 생성
    const delBtn = document.createElement("button");
    delBtn.innerText = "삭제";
    delBtn.addEventListener("click", deleteToDo);

    // li 안에 글자, 완료 버튼, 삭제 버튼 순서대로 삽입
    li.appendChild(span);
    li.appendChild(doneBtn);
    li.appendChild(delBtn);
    
    toDoList.appendChild(li);
}

// -----------------------------------------
// [➕ 5. 할 일 추가 제출 핸들러]
// -----------------------------------------
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

// -----------------------------------------
// [🔄 6. 초기화 및 복원]
// -----------------------------------------
toDoForm.addEventListener("submit", handleToDoSubmit);

const savedToDos = localStorage.getItem(TODOS_KEY);

if (savedToDos !== null) {
    const parsedToDos = JSON.parse(savedToDos);
    toDos = parsedToDos;
    parsedToDos.forEach(paintToDo);
}

// g-app.js의 로그아웃 시 호출
window.resetToDos = function() {
    localStorage.removeItem(TODOS_KEY);
    toDos = [];
    toDoList.innerHTML = "";
};
