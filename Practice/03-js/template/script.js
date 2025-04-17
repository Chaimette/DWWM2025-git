"use strict";

const fields = [
  { label: "Nom", type: "text", name: "nom" },
  { label: "Email", type: "email", name: "email" },
  { label: "Message", type: "textarea", name: "message" },
];

const additionalFieldTypes = [
  { label: "Téléphone", type: "tel", name: "phone" },
  { label: "date", type: "date", name: "date" },
  { label: "Age", type: "number", name: "age" },
];

let fieldCounter = 0;
let addedFields = [];
function generateField(fieldData, isRemovable = false) {
  const template = document.querySelector("#template");
  const fieldElement = template.content.cloneNode(true);

  const formGroup = fieldElement.querySelector(".form-group");
  if (isRemovable) {
    formGroup.dataset.fieldId = fieldData.name;
  }

  const label = fieldElement.querySelector("label");
  label.textContent = fieldData.label;
  label.setAttribute("for", fieldData.name);

  const inputContainer = fieldElement.querySelector(".input-container");
  let inputElement;
  if (fieldData.type === "textarea") {
    inputElement = document.createElement("textarea");
  } else {
    inputElement = document.createElement("input");
    inputElement.type = fieldData.type;
  }
  inputElement.name = fieldData.name;
  inputElement.id = fieldData.name;
  inputElement.required = true;

  inputContainer.appendChild(inputElement);
  if (isRemovable) {
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "remove-field-btn";
    removeButton.textContent = "Supprimer";
    removeButton.dataset.fieldId = fieldData.name;
    removeButton.addEventListener("click", function () {
      removeSpecificField(fieldData.name);
    });
    formGroup.appendChild(removeButton);

    //event listener de validation
    inputElement.addEventListener("blur", function () {
      validateField(inputElement);
    });
  }
  return fieldElement;
}

function validateField(field) {
  const errorElement = field.parentNode.parentNode.querySelector(".error");
  errorElement.style.display = "none";
  errorElement.textContent = "";

  if (field.value.trim() === "") {
    errorElement.textContent = "Ce champ est requis";
    errorElement.style.display = "block";
    return false;
  }

  if (field.type === "email" && !validateEmail(field.value)) {
    errorElement.textContent = "Veuillez entrer une adresse email valide";
    errorElement.style.display = "block";
    return false;
  }

  if (field.type === "tel" && !validatePhone(field.value)) {
    errorElement.textContent = "Veuillez entrer un numéro de téléphone valide";
    errorElement.style.display = "block";
    return false;
  }

  return true;
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePhone(phone) {
  const re = /^[0-9\s\+\-\(\)]{8,}$/;
  return re.test(phone);
}

let currentAdditionalFieldIndex = 0;

function addNewField() {
  const removedFields = addedFields.filter((field) => field.isRemoved);
  if (removedFields.length > 0) {
    const fieldToReactivate = removedFields[0];
    fieldToReactivate.isRemoved = false;

    const formElement = document.querySelector("#form");
    formElement.appendChild(generateField(fieldToReactivate.fieldData, true));

    updateFieldButtonStatus();
    return;
  }

  if (currentAdditionalFieldIndex >= additionalFieldTypes.length+1) {
    alert("Tous les types de champs supplémentaires ont été ajoutés.");
    return;
  }

  const newField = { ...additionalFieldTypes[currentAdditionalFieldIndex] };
  fieldCounter++;
  newField.name = `${newField.name}-${fieldCounter}`;

  const formElement = document.querySelector("#form");
  formElement.appendChild(generateField(newField, true));

  addedFields.push({
    fieldData: newField,
    index: currentAdditionalFieldIndex,
    isRemoved: false,
  });

  currentAdditionalFieldIndex++;

  updateFieldButtonStatus();
}

function removeSpecificField(fieldId) {
  const formElement = document.querySelector("#form");
  const fieldElement = formElement.querySelector(
    `.form-group[data-field-id="${fieldId}"]`
  );
  if (fieldElement) {
    const fieldIndex = addedFields.findIndex(
      (field) => field.fieldData.name === fieldId
    );
    if (fieldIndex !== -1) {
      addedFields[fieldIndex].isRemoved = true;
    }

    formElement.removeChild(fieldElement);

    updateFieldButtonStatus();
  }
}
function updateFieldButtonStatus() {
  const availableNewFields =
    currentAdditionalFieldIndex < additionalFieldTypes.length;
  const hasRemovedFields = addedFields.some((field) => field.isRemoved);

  document.getElementById("add-field").disabled = !(
    availableNewFields || hasRemovedFields
  );
}

function initForm() {
  const formElement = document.querySelector("#form");

  fields.forEach((field) => {
    formElement.appendChild(generateField(field, false));
  });

  document.getElementById("add-field").addEventListener("click", addNewField);

  document
    .getElementById("submit-form")
    .addEventListener("click", function (e) {
      e.preventDefault();
      let isValid = true;
      const inputs = formElement.querySelectorAll("input, textarea");

      inputs.forEach((input) => {
        if (!validateField(input)) {
          isValid = false;
        }
      });

      if (isValid) {
        alert("Envoyé avec succès!");
        // console.log(
        //   "Données du formulaire:",
        //   Object.fromEntries(new FormData(formElement))
        // );
      }
    });
  updateFieldButtonStatus();
}

document.addEventListener("DOMContentLoaded", initForm);
