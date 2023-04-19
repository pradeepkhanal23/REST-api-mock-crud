const apiUrl = "https://jsonplaceholder.typicode.com/todos";
const form = document.querySelector("#todo-form");
const todoList = document.querySelector(".todo-list");
const todoInput = document.querySelector("#todo-input");

function getTodos() {
  fetch(apiUrl + "?_limit=10")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((todo) => addTodoToDOM(todo));
    });
}

function addTodoToDOM(todo) {
  const { id, title, completed } = todo;
  const div = document.createElement("div");
  div.classList.add("todo");
  div.setAttribute("data-id", id);
  if (completed) {
    div.classList.add("done");
  }
  div.appendChild(document.createTextNode(title));
  document.querySelector(".todo-list").appendChild(div);
}

function createTodo(e) {
  e.preventDefault();

  const newTodo = {
    title: e.target.firstElementChild.value,
    completed: false,
  };

  fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    body: JSON.stringify(newTodo),
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      addTodoToDOM(data);
    });

  todoInput.value = "";
  todoInput.focus();
}

function toogleTodo(e) {
  e.preventDefault();

  let todoToggle = e.target.hasAttribute("data-id");
  if (todoToggle) {
    const selectedTodo = e.target;
    const selectedTodoId = selectedTodo.getAttribute("data-id");
    selectedTodo.classList.toggle("done");
    let taskStatus = selectedTodo.classList.contains("done") ? true : false;
    const newData = {
      completed: taskStatus,
    };

    updateTodo(newData, selectedTodoId);
  }
}

const updateTodo = (newTodo, id) => {
  fetch(`${apiUrl}/${id}`, {
    method: "PUT",
    body: JSON.stringify(newTodo),
    headers: {
      "Content-type": "application/json",
    },
  });
};

const deleteTodo = (e) => {
  e.preventDefault();
  if (e.target.classList.contains("todo")) {
    const id = e.target.getAttribute("data-id");
    fetch(`${apiUrl}/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        e.target.remove();
      });
  }
};

const init = () => {
  document.addEventListener("DOMContentLoaded", getTodos);
  form.addEventListener("submit", createTodo);
  todoList.addEventListener("click", toogleTodo);
  todoList.addEventListener("dblclick", deleteTodo);
};

init();
