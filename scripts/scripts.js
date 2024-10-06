/**
 * * Global Variables
 */
const existingExerciseArray = []; // Holds the names of all exercises that have already been created as buttons by user
const existingRoutineArray = []; // Holds the names of all routines that have already been created by user

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
 * * Helper Functions
 */

// Check if an exercise or routine already exists in localStorage by checking arrays stored as global variables and seeing if the name already exists in it
function checkIfAlreadyExistsInLocalStorage(arrayToCheck, name) {
     return arrayToCheck.includes(name.toLowerCase());
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

     // Store user input value
     const exerciseName = document.getElementById("new-exercise-input").value;

     // Only create a new Exercise if its name isn't an empty string and it doesn't already exist
     if (exerciseName.trim().length > 0 && checkIfAlreadyExistsInLocalStorage(existingExerciseArray, exerciseName) === false) {
          // Create a new Exercise Object, its name will be the value from input
          const newExercise = new Exercise(exerciseName, "");

          // Pushes the new Exercise Object into the existing exercise data
          existingExerciseData.push(newExercise);

          // Save existing data with the new exercise to localStorage
          localStorage.setItem("exerciseDataKey", JSON.stringify(existingExerciseData));

          // Refreshes buttons to display new one created
          refreshExerciseButtons();
     }

     // Always resets the input field to be empty
     document.getElementById("new-exercise-input").value = "";

     // ! Enable when deploy
     // document.getElementById("div-new-exercise").style.display = "none";

     // ! for testing area, remove later
     testDisplayExercises();
}

/**
 * This function clears all existing exercise buttons
 */
function clearExerciseButtons() {
     let parentButtonsContainer = document.getElementById("exercise-buttons-container");
     let childButton = parentButtonsContainer.firstElementChild;

     while (childButton) {
          parentButtonsContainer.removeChild(childButton);
          childButton = parentButtonsContainer.firstElementChild;
     }
}

/**
 * This function renders all exercises stored in the localStorage exercise array as buttons
 */
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
          // Grab the name of the exercise in the current index
          const exerciseName = existingExerciseDataInObjectForm[i].name;

          // Create a button for it and assign various properties to it, then append it to the parent
          const newButton = document.createElement("button");
          newButton.classList.add("exercise-button");
          newButton.innerHTML = exerciseName;
          document.getElementById("exercise-buttons-container").append(newButton);

          // Add the new exercise the global array that tracks which exercises exist already
          existingExerciseArray.push(exerciseName.toLowerCase());
     }
}

/**
 * This function couples two functions together
 * clearExerciseButtons() clears existing exercise buttons
 * renderExerciseButtons() renders all the buttons anew
 */
function refreshExerciseButtons() {
     clearExerciseButtons();
     renderExerciseButtons();
}

// ! for testing area, remove later
function testDisplayExercises() {
     const exercises = localStorage.getItem("exerciseDataKey");
     document.getElementById("testing-area").innerHTML = exercises;
}

// * WORKING ON CODE BELOW

function saveNewRoutineToLocalStorage() {
     event.preventDefault();

     // Get existing data from localStorage or retrieve an empty array if there is none as a fallback
     const existingRoutineData = JSON.parse(localStorage.getItem("exerciseRoutineKey")) || [];

     // Create class for Routine Objects
     class Routine {
          constructor(name, listOfExercises) {
               this.name = name;
               this.listOfExercises = listOfExercises;
          }
     }

     const routineName = document.getElementById("new-routine-input").value;
     console.log(routineName);

     // Only create a new Routine if its name isn't an empty string and it doesn't already exist
     if (routineName.trim().length > 0 && checkIfAlreadyExistsInLocalStorage(existingRoutineArray, routineName) === false) {
          // TODO CONTINUE FROM HERE
     }
}

// have to check if name is valid and doesn't already exist DONE

// create an empty array and then add in the name of exercise the user presses the associated button for. allow users to add duplicate

// create a new Routine object using the name and array with exercises as the parameters
