/**
 * * Global Variables
 */
let currentlySelectedExerciseButton;

/**
 * * Constructors for various Objects
 */
class Exercise {
     constructor(name, duration, category) {
          this.name = name;
          this.duration = duration;
          this.category = category;
     }
}

class Routine {
     constructor(name, list) {
          this.name = name;
          this.category = list;
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
     refreshExerciseCards();
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
     document.getElementById("testing-area").textContent = exercises;
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
          const newExercise = new Exercise(exerciseName, 0, "");
          existingExerciseData.push(newExercise);
          localStorage.setItem("exerciseDataKey", JSON.stringify(existingExerciseData));

          // Refreshes buttons
          refreshExerciseCards();
     }

     // Always resets the input field to be empty
     document.getElementById("new-exercise-input").value = "";

     // ! for testing area, remove later
     testDisplayExercises();
}

/**
 * The following three functions work together
 * refreshExerciseCards() couples the two following functions together
 * clearExerciseCards() which clears all existing exercise cards
 * renderExerciseCards() which renders all the exercise cards anew
 */
function refreshExerciseCards() {
     clearExerciseCards();
     renderExerciseCards();
}

function clearExerciseCards() {
     const parentExerciseCardsContainer = document.getElementById("exercise-cards-container");
     let childButton = parentExerciseCardsContainer.firstElementChild;

     while (childButton) {
          parentExerciseCardsContainer.removeChild(childButton);
          childButton = parentExerciseCardsContainer.firstElementChild;
     }
}

function renderExerciseCards() {
     // Create the Add Rest button which is always at the beginning
     createNewExerciseCard("rest");

     // Grabs existing exercises data from localStorage and converts it into an array
     const existingExerciseDataInStringForm = localStorage.getItem("exerciseDataKey");
     const existingExerciseDataInArrayForm = existingExerciseDataInStringForm ? JSON.parse(existingExerciseDataInStringForm) : [];

     // Now for each  exercise in the array
     for (i = 0; i < existingExerciseDataInArrayForm.length; i++) {
          const name = existingExerciseDataInArrayForm[i].name;
          createNewExerciseCard(name);
     }

     // Add Event Listeners to to all exercise buttons
     addEventListenerToExerciseButtons();
}

// TODO: Ready for feedback from Vince

function createNewExerciseCard(name) {
     // This is just so that if an exercise name is two words, like "jumping jacks", we won't get class/id/etc as "class="jumping jacks" but rather "class="jumping-jacks"
     // ! This is probably bad?
     const nameHyphenated = name.split(" ").join("-");

     // Create a new div which acts as as container
     const newButtonInputContainer = document.createElement("div");
     newButtonInputContainer.classList.add("container-exercise-card");
     document.getElementById("exercise-cards-container").append(newButtonInputContainer);

     // Create a button then append it to the parent container
     const newButton = document.createElement("button");
     newButton.textContent = name; // ! We do NOT want to force hyphenation here
     newButton.classList.add("button-exercise");
     newButton.id = `${nameHyphenated}`;
     newButtonInputContainer.append(newButton);

     // Create a new label and append it to the parent container (siblings with newButton)
     const newDurationLabel = document.createElement("label");
     newDurationLabel.textContent = "Duration (in seconds)";
     newDurationLabel.classList.add("label-duration");
     newDurationLabel.htmlFor = `input-${nameHyphenated}`; // Setting for
     newButtonInputContainer.append(newDurationLabel);

     // Create a new input and append it to the parent container (siblings with newButton AND newLabel)
     const newDurationInput = document.createElement("input");
     newDurationInput.classList.add("input-duration");
     newDurationInput.id = `input-${nameHyphenated}`;
     newDurationInput.type = "number";
     newDurationInput.name = `input-${nameHyphenated}`;
     newButtonInputContainer.append(newDurationInput);
}

function addEventListenerToExerciseButtons() {
     const exerciseButtons = document.querySelectorAll(".button-exercise");

     exerciseButtons.forEach(function (currentButton) {
          currentButton.addEventListener("click", function () {
               // Hide all labels and inputs first
               const allContainers = document.querySelectorAll(".container-exercise-card");
               allContainers.forEach(function (container) {
                    container.querySelector("label").style.display = "none";
                    container.querySelector("input").style.display = "none";
               });

               // Find the parent container of the button
               const currentContainer = currentButton.closest(".container-exercise-card");

               // Select the label and input within the same container and change their display
               currentContainer.querySelector("label").style.display = "block";
               currentContainer.querySelector("input").style.display = "block";
               ("block");

               // Stores id of current exerciseButton selected/"opened" in global variable
               currentlySelectedExerciseButton = currentButton.id;
          });
     });
}

// TODO: Figuring out how to create new Routine objects

// * Routine constructor. it requires the properties name and a list. (list is an array that stores Exercise objects that have a name + duration properties)
// Up top of the page

function saveNewRoutineToLocalStorage() {
     // Storing Routine name and list of Exercises
     const routineName = document.getElementById("new-routine-input").value;

     // Populate Exercise array
     const exerciseArray = [];
     const newExercise = new Exercise(currentlySelectedExerciseButton);
     console.log(newExercise);

     // Create new Routine
     const newRoutine = new Routine(routineName, exerciseArray);
     // console.log(newRoutine);
}

document.getElementById("button-save-routine").addEventListener("click", function () {
     saveNewRoutineToLocalStorage();
});
