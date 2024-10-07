/**
 * * Global Variables
 */

/**
 * * Constructors for various Objects
 */
class Exercise {
     constructor(name, category) {
          this.name = name;
          this.category = category;
     }
}

/**
 * * On page load, run this function
 */
window.onload = pageLoad();

/**
 * * This function is a collection of functions that need to be run upon the user loading the page
 */
function pageLoad() {
     testDisplayExercises();
     refreshExerciseButtons();
}

/**
 * * Helper Functions
 *
 * checkIfAlreadyExistsInLocalStorage() checks if an exercise or routine already exists in localStorage
 *
 * toTitleCase() changes the first letter of each word in a string to capital using regex
 */
// ! for testing area, remove later
function testDisplayExercises() {
     // puts stuff in the testing area
     const exercises = localStorage.getItem("exerciseDataKey");
     document.getElementById("testing-area").innerHTML = exercises;
}

function checkIfAlreadyExistsInLocalStorage(arrayToCheck, name) {
     for (i = 0; i < arrayToCheck.length; i++) {
          if (arrayToCheck[i].name === name) {
               return true;
          }
     }
     return false;
}

function toTitleCase(string) {
     return string.toLowerCase().replace(/\b\w/g, function (s) {
          return s.toUpperCase();
     });
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

     // Store user's input
     const exerciseName = document.getElementById("new-exercise-input").value;
     // const exerciseName = toTitleCase(document.getElementById("new-exercise-input").value);

     // Only create a new Exercise if its name isn't an empty string and it doesn't already exist
     if (exerciseName.trim().length > 0 && checkIfAlreadyExistsInLocalStorage(existingExerciseData, exerciseName) === false) {
          // Create a new Exercise Object and pushes it into the existing exercise data. Afterwards, save existing data with the new exercise to localStorage
          const newExercise = new Exercise(exerciseName, "");
          existingExerciseData.push(newExercise);
          localStorage.setItem("exerciseDataKey", JSON.stringify(existingExerciseData));

          // Refreshes buttons
          refreshExerciseButtons();
     }

     // Always resets the input field to be empty
     document.getElementById("new-exercise-input").value = "";

     // ! for testing area, remove later
     testDisplayExercises();
}

/**
 * The following three functions work together
 * refreshExerciseButtons() couples the two following functions together
 * clearExerciseButtons() which clears all existing exercise buttons
 * renderExerciseButtons() which renders all the exercise buttons anew
 */
function refreshExerciseButtons() {
     clearExerciseButtons();
     renderExerciseButtons();
}

function clearExerciseButtons() {
     const parentButtonsContainer = document.getElementById("exercise-buttons-container");
     let childButton = parentButtonsContainer.firstElementChild;

     while (childButton) {
          parentButtonsContainer.removeChild(childButton);
          childButton = parentButtonsContainer.firstElementChild;
     }
}

function renderExerciseButtons() {
     // Create the Add Rest button which is always at the beginning
     const restButton = document.createElement("button");
     restButton.classList.add("exercise-button");
     restButton.innerHTML = "Add Rest";
     document.getElementById("exercise-buttons-container").append(restButton);

     // Grabs existing exercises data from localStorage and converts it into an object
     const existingExerciseDataInStringForm = localStorage.getItem("exerciseDataKey");
     const existingExerciseDataInObjectForm = existingExerciseDataInStringForm ? JSON.parse(existingExerciseDataInStringForm) : [];

     for (i = 0; i < existingExerciseDataInObjectForm.length; i++) {
          // Create a button for it and assign various properties to it, then append it to the parent
          const exerciseName = existingExerciseDataInObjectForm[i].name;
          const newButton = document.createElement("button");

          newButton.classList.add("exercise-button");
          newButton.innerHTML = exerciseName;
          document.getElementById("exercise-buttons-container").append(newButton);
     }

     // Add Event Listeners to to all exercise buttons
     // addEventListenerToExerciseButtons();
}

// TODO: WORKING ON CODE BELOW

// function addEventListenerToExerciseButtons() {
//      const exerciseButtons = document.querySelectorAll(".exercise-button");

//      exerciseButtons.forEach(function (button) {
//           button.addEventListener("click", function () {
//                // Changing styles for visual clarity
//                button.style.backgroundColor = "pink";

//                // Inserting timer input
//                const newInputTimer = document.createElement("input");
//                newInputTimer.type = "number";
//                button.append(newInputTimer);

//                const exerciseButton = document.querySelector(".exercise-button");
//                const parent = document.querySelector(".exercise-button").parentNode;
//                parent.insertBefore(newInputTimer, exerciseButton.nextSibling);
//           });
//      });
// }
