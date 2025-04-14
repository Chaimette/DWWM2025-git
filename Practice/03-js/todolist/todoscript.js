"use strict";
/*
    1. Créer une todo list. à chaque appui sur le bouton ajout,
    créer un nouvel élément dans la liste.
    cet élément doit contenir la valeur de l'input et une croix.
    On en profitera pour vider l'input.
    2. le clique sur un élément de la liste lui ajoutera une classe qui aura pour 
    effet de barrer l'élément.
    3. le clique sur la croix supprimera l'élément concerné.
    4. sauvegarder la liste en localstorage.
    5. afficher la liste sauvegardé au chargement de la page.
    6. éditer la liste lorsque l'on coche ou supprime un élément.
    Bonus : Utiliser le drag and drop pour déplacer nos éléments dans la liste. il faudra penser à sauvegarder les éléments déplacé.
 */

const form = document.querySelector("form");
const taskList = document.getElementById("task-list");
const taskInput = document.getElementById("new-task");

let tasks = [];

function loadTasks() {
  const tasksString = localStorage.getItem("tasks");
  if (tasksString) {
    tasks = JSON.parse(tasksString);
    renderTasks();
  }
}

form.addEventListener("submit", addTask);

/**
 * Ajoute une nouvelle task
 * @param {SubmitEvent} e
 */
function addTask(e) {
  e.preventDefault();

  const data = new FormData(form);
  const taskText = data.get("task");

  if (taskText === "") return;

  const task = {
    id: tasks.length,
    text: taskText,
    completed: false,
  };
  tasks.push(task);

  saveTasks();

  renderTasks();

  taskInput.value = "";
}

function renderTasks() {
  taskList.innerHTML = "";
  // ! Ne pas oublier de réinitialiser les id des tasks pour que le drag and drop fonctionne correctement.
  tasks.forEach((task, index) => {
    task.id = index;
  });
  
  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.classList.add("task-item");
    li.setAttribute("draggable", "true");
    li.setAttribute("data-id", task.id);

    if (task.completed) {
      li.classList.add("completed");
    }

    li.innerHTML = `
                <span>${task.text}</span>
                <button class="delete-btn">✖</button>
            `;

    li.addEventListener("dragstart", handleDragStart);
    li.addEventListener("dragover", handleDragOver);
    li.addEventListener("drop", handleDrop);
    li.addEventListener("dragend", handleDragEnd);

    li.addEventListener("click", (e) => {
      if (e.target !== li.querySelector(".delete-btn")) {
        toggleTask(task.id);
      }
    });

    const deleteBtn = li.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => {
      deleteTask(task.id);
    });

    taskList.appendChild(li);
  });
}

/**
 *
 * @param {number} taskId
 */
function toggleTask(taskId) {
  const task = tasks.find((t) => t.id === taskId);

  if (task) {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  }
}

/**
 *
 * @param {number} taskId
 */
function deleteTask(taskId) {
  tasks = tasks.filter((t) => t.id !== taskId);
  saveTasks();
  renderTasks();
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

let draggedTaskIndex = null;

function handleDragStart(e) {
  draggedTaskIndex = tasks.findIndex(
    (task) => task.id === parseInt(e.target.getAttribute("data-id"))
  );
  e.target.classList.add("dragging");
}

function handleDragOver(e) {
  e.preventDefault();
  const draggingElement = document.querySelector(".dragging");
  const targetElement = e.target.closest(".task-item");

  if (targetElement && targetElement !== draggingElement) {
    const targetIndex = tasks.findIndex(
      (task) => task.id === parseInt(targetElement.getAttribute("data-id"))
    );
    if (draggedTaskIndex !== null && targetIndex !== -1) {
      const [draggedTask] = tasks.splice(draggedTaskIndex, 1);
      tasks.splice(targetIndex, 0, draggedTask);

      draggedTaskIndex = targetIndex;

      renderTasks();
    }
  }
}
function handleDrop(e) {
  e.preventDefault();
  saveTasks();
}

function handleDragEnd(e) {
  e.target.classList.remove("dragging");
  draggedTaskIndex = null;
}

loadTasks();
