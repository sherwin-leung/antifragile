/**
 * * Global Variables
 */
const existingExerciseArray = [];

/**
 * * Helper Functions
 */

function checkIfExerciseAlreadyExists(exercise) {
     return existingExerciseArray.includes(exercise.toLowerCase());
}

/**
 * * On page load, run this function
 */
window.onload = pageLoad();

/**
 * This function is a collection of functions that need to be run upon the user loading the page
 */
function pageLoad() {
     testDisplayExercises();
     populateButtonsForNewRoutines();
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
function saveNewExerciseToLocalStorage() {
     event.preventDefault();

     // Get existing data from localStorage or retrieve an empty array if there is none as a fallback
     const existingExerciseData = JSON.parse(localStorage.getItem("exerciseDataKey")) || [];

     // Create class for Exercise Objects
     class Exercise {
          constructor(name, category) {
               this.name = name;
               this.category = category;
          }
     }

     // Store user input value
     const exerciseName = document.getElementById("new-exercise-input").value;

     // Only create a new exercise if it isn't an empty string and it doesn't already exist
     if (exerciseName.trim().length > 0 && checkIfExerciseAlreadyExists(exerciseName) === false) {
          // Create a new Exercise Object, its name will be the value from input
          const newExercise = new Exercise(exerciseName, "");

          // Pushes the new Exercise Object into the existing exercise data
          existingExerciseData.push(newExercise);

          // Save existing data with the new exercise to localStorage
          localStorage.setItem("exerciseDataKey", JSON.stringify(existingExerciseData));

          // Populates routine section with a new button for the new exercise
          populateButtonsForNewRoutines();
     }

     // Always resets the input field to be empty
     document.getElementById("new-exercise-input").value = "";

     // ! for testing area, remove later
     testDisplayExercises();
}

/**
 * This function populates the exercise buttons that a user can click on to add exercises to a new routine
 */

function populateButtonsForNewRoutines() {
     // Grabs existing exercises data from localStorage and converts it into an object
     const existingExerciseDataInStringForm = localStorage.getItem("exerciseDataKey");
     const existingExerciseDataInObjectForm = existingExerciseDataInStringForm ? JSON.parse(existingExerciseDataInStringForm) : [];

     for (i = 0; i < existingExerciseDataInObjectForm.length; i++) {
          // If an exercise already exists as a button, don't create another one for it
          if (checkIfExerciseAlreadyExists(existingExerciseDataInObjectForm[i].name)) {
               continue;
          } else {
               const newButton = document.createElement("button");
               const exerciseName = existingExerciseDataInObjectForm[i].name;
               // TODO: Should add a class/ids to these buttons?

               newButton.innerHTML = exerciseName;
               document.getElementById("div-new-routine").append(newButton);
               existingExerciseArray.push(exerciseName.toLowerCase());
          }
     }
}

// * WORKING ON CODE BELOW

// ! for testing area, remove later
function testDisplayExercises() {
     const exercises = localStorage.getItem("exerciseDataKey");
     document.getElementById("testing-area").innerHTML = exercises;
}

console.log(existingExerciseArray);
