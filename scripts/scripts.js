/**
 * Runs this function upon page load
 */
window.onload = pageLoad();

/**
 * This function is a collection of functions that need to be run upon the user loading the page
 */
function pageLoad() {
     testDisplayExercises();
}

/**
 * This function handles toggling on and off the view of certain contents when the main three buttons are clicked/tapped
 * @param divId indicates which div to toggle on and off
 */
function toggleViewOnAndOff(divId) {
     const view = document.getElementById(divId);

     if (view.style.display === "block") {
          view.style.display = "none";
     } else {
          view.style.display = "block";
     }
}

/**
 * This function handles the saving of new exercises into localStorage
 */
// TODO: Make it so that exercise names must be unique
function saveNewExerciseToLocalStorage() {
     event.preventDefault();

     // Get existing data from localStorage or retrieve an empty array if there is none as a fallback
     const existingExerciseData = JSON.parse(localStorage.getItem("exerciseDataKey")) || [];

     // Creates a new exercise object
     const newExercise = {
          name: document.getElementById("new-exercise-input").value,
          category: "",
     };

     // Pushes the new exercise object into the existing exercise data
     existingExerciseData.push(newExercise);

     // Save existing data with the new exercise to localStorage
     localStorage.setItem("exerciseDataKey", JSON.stringify(existingExerciseData));

     // Resets the input field to be empty
     document.getElementById("new-exercise-input").value = "";

     // ! remove later on
     testDisplayExercises();
}

// * WORKING ON CODE BELOW

// ! remove later on
function testDisplayExercises() {
     const exercise = localStorage.getItem("exerciseDataKey");
     document.getElementById("test").innerHTML = exercise;
}

function populateButtonsForRoutine() {}
