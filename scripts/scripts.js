/**
 * * Global Variables
 */
let currentlySelectedExerciseButtonId;
let tempExerciseArray = [];

/**
 * * Constructors for various Objects
 */
class Exercise {
     constructor(name, duration) {
          this.name = name;
          this.duration = duration;
     }
}

class Routine {
     constructor(name, exerciseList) {
          this.name = name;
          this.exerciseList = exerciseList;
     }
}

/**
 * * On page load, run this function
 */
window.onload = pageLoad();

/**
 * This function is a collection of functions that need to be run upon the user loading the page
 */
function pageLoad() {
     refreshExerciseCards();
     displayCurrentlyLoadedRoutine();
}

/**
 * * Helper Functions
 */

// Helper function - sanitize() sanitizes a string by replacing special characters with their HTML entity equivalents to prevent XSS attacks
function sanitize(string) {
     const map = {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#x27;",
          "/": "&#x2F;",
     };
     const reg = /[&<>"'/]/gi;
     return string.replace(reg, (match) => map[match]);
}

// Helper function - checkIfAlreadyExistsInLocalStorage() checks if an exercise or routine already exists in localStorage
function checkIfAlreadyExistsInLocalStorage(arrayToCheck, name) {
     for (i = 0; i < arrayToCheck.length; i++) {
          if (arrayToCheck[i].name === name) {
               return true;
          }
     }
     return false;
}

// Helper function - convertToTitleCase(str) takes a string and returns it As Title Case (capitalizes the first letter of each word in a string)
function convertToTitleCase(str) {
     return str.toLowerCase().replace(/\b\w/g, (s) => s.toUpperCase());
}

// Helper function - hideShowNewRoutineButton() hides the [Save New Routine] button in the New Routine section
function hideSaveNewRoutineButton() {
     document.getElementById("button-save-routine").style.display = "none";
}

// Helper function - showShowNewRoutineButton() show the [Save New Routine] button in the New Routine section
function showSaveNewRoutineButton() {
     document.getElementById("button-save-routine").style.display = "block";
}

/**
 * * This function handles toggling on and off the view of certain contents when the main three buttons are clicked/tapped
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
 * * This function displays the currently loaded Routine to the user. It persists on page load and refreshes when user saves a new Routine
 */
function displayCurrentlyLoadedRoutine() {
     // Grab the saved Routine from localStorage
     const currentlyLoadedRoutine = JSON.parse(localStorage.getItem("routineDataKey"));

     if (currentlyLoadedRoutine !== null) {
          // Displaying the Routine's name
          const currentlyLoadedRoutineName = document.getElementById("currently-loaded-routine-name");
          currentlyLoadedRoutineName.textContent = currentlyLoadedRoutine.name;

          // Displaying the exercise list in the Routine
          const exerciseDetails = document.getElementById("exercise-details");

          let htmlString = "<h3>Exercise List:</h3>";

          htmlString += "<ol>";
          for (i = 0; i < currentlyLoadedRoutine.exerciseList.length; i++) {
               htmlString += `<li>${currentlyLoadedRoutine.exerciseList[i].name} - ${currentlyLoadedRoutine.exerciseList[i].duration} seconds</li>`;
          }
          htmlString += "</ol>";

          exerciseDetails.innerHTML = htmlString;
     }
}

/**
 * * This function handles the creation and saving of new Exercises into localStorage
 */
function saveNewExerciseToLocalStorage() {
     event.preventDefault();

     // Get existing data from localStorage or retrieve an empty array if there is none as a fallback
     const existingExerciseData = JSON.parse(localStorage.getItem("exerciseDataKey")) || [];

     // Store user's input
     const exerciseName = sanitize(document.getElementById("new-exercise-input").value);

     // Only create a new Exercise if its name isn't an empty string and it doesn't already exist
     if (exerciseName.trim().length > 0 && checkIfAlreadyExistsInLocalStorage(existingExerciseData, exerciseName) === false) {
          // Create a new Exercise Object and pushes it into the existing exercise data. Afterwards, save existing data with the new Exercise to localStorage
          const newExercise = new Exercise(exerciseName, 0);
          existingExerciseData.push(newExercise);
          localStorage.setItem("exerciseDataKey", JSON.stringify(existingExerciseData));

          // Refreshes buttons
          refreshExerciseCards();
     }

     // Always resets the input field to be empty
     document.getElementById("new-exercise-input").value = "";
}

/**
 * * The following three functions work together
 * 1) refreshExerciseCards() couples the two following functions together
 * 2) clearExerciseCards() which clears all existing exercise cards
 * 3) renderExerciseCards() which renders all the exercise cards anew
 */
function refreshExerciseCards() {
     clearExerciseCards();
     renderExerciseCards();
}

function clearExerciseCards() {
     const parentExerciseCardsContainer = document.getElementById("exercise-cards-container");
     let exerciseCard = parentExerciseCardsContainer.firstElementChild;

     while (exerciseCard) {
          parentExerciseCardsContainer.removeChild(exerciseCard);
          exerciseCard = parentExerciseCardsContainer.firstElementChild;
     }
}

function renderExerciseCards() {
     // Create the Add Rest button which is always at the beginning
     createNewExerciseCard("Rest");

     // Grabs existing exercises data from localStorage and converts it into an array
     const existingExerciseDataInStringForm = localStorage.getItem("exerciseDataKey");
     const existingExerciseDataInArrayForm = existingExerciseDataInStringForm ? JSON.parse(existingExerciseDataInStringForm) : [];

     // Now for each  exercise in the array
     for (i = 0; i < existingExerciseDataInArrayForm.length; i++) {
          const name = existingExerciseDataInArrayForm[i].name;
          createNewExerciseCard(name);
     }

     // Add Event Listeners to to all [exercise] buttons
     addEventListenerToExerciseButtons();

     // Add Event Listeners to all [Add] buttons
     addEventListenerToAddButtons();
}

/**
 * * This function creates an exercise "card", which consists of:
 * 1) A div container (parent)
 * 2) A button displaying the exercise's name (child)
 * 3) A label for the input below
 * 4) A number input for the exercise duration
 * 5) A button that allows the user to add the exercise & duration to a temporary array which will pushed into the Routine object later
 *
 * @param {*} name Retrieves name of exercise(s) from localStorage key/value pair exerciseDataKey
 */
function createNewExerciseCard(name) {
     // This is just so that if an exercise name is two words, like "jumping jacks", we won't get class/id/etc as "class="jumping jacks" but rather "class="jumping-jacks"
     const nameHyphenated = name.split(" ").join("-");

     // Create a new div which acts as as the card container
     const newButtonInputContainer = document.createElement("div");
     newButtonInputContainer.classList.add("exercise-card");
     document.getElementById("exercise-cards-container").append(newButtonInputContainer);

     // Create a button then append it to the parent container
     const newExerciseButton = document.createElement("button");
     newExerciseButton.textContent = name; // ! We do NOT want to force hyphenation here
     newExerciseButton.classList.add("button-exercise");
     newExerciseButton.id = `${nameHyphenated}`;
     newButtonInputContainer.append(newExerciseButton);

     // Create a new label and append it to the parent container
     const newDurationLabel = document.createElement("label");
     newDurationLabel.textContent = "Duration (in seconds)";
     newDurationLabel.classList.add("label-duration");
     newDurationLabel.htmlFor = `input-${nameHyphenated}`; // Setting for
     newButtonInputContainer.append(newDurationLabel);

     // Create a new input and append it to the parent container
     const newDurationInput = document.createElement("input");
     newDurationInput.classList.add("input-duration");
     newDurationInput.id = `input-${nameHyphenated}`;
     newDurationInput.type = "number";
     newDurationInput.name = `input-${nameHyphenated}`;
     newDurationInput.value = 60; // default value
     newButtonInputContainer.append(newDurationInput);

     // Create another button and append it to the parent container. This one is for submitting
     const newAddButton = document.createElement("button");
     newAddButton.textContent = "Add";
     newAddButton.classList.add("button-add");
     newButtonInputContainer.append(newAddButton);
}

/**
 * * This function gives all exercise buttons an Event Listener
 * 1) On click of a button, it will unhide/"expand" the exercise card associated with  it and hide/"close" previous expanded cards
 * 2) The user clicks on the a button that has its card expanded, it will hide it
 * 3) Also stores the id of the currently expanded button in global variable currentSelectedExerciseButtonId
 */
function addEventListenerToExerciseButtons() {
     const exerciseButtons = document.querySelectorAll(".button-exercise");

     exerciseButtons.forEach(function (currentButton) {
          currentButton.addEventListener("click", function () {
               // Find the parent container of the current button
               const currentParentContainer = currentButton.closest(".exercise-card");

               // Storing the current label, input, and [Add] button's *display*. Call it a "cluster"
               const currentLabel = currentParentContainer.querySelector("label");
               const currentInput = currentParentContainer.querySelector("input");
               const currentAddButton = currentParentContainer.querySelector(".button-add");

               // Check the visibility of current cluster. This acts as the toggle switch
               const isCurrentClusterVisible =
                    currentLabel.style.display === "block" && currentInput.style.display === "block" && currentAddButton.style.display === "block";

               // Hide all labels, inputs, and [Add] buttons
               const allContainers = document.querySelectorAll(".exercise-card");
               allContainers.forEach(function (container) {
                    container.querySelector("label").style.display = "none";
                    container.querySelector("input").style.display = "none";
                    container.querySelector(".button-add").style.display = "none";
               });

               // If the current cluster is hidden, show it
               if (isCurrentClusterVisible === false) {
                    currentLabel.style.display = "block";
                    currentInput.style.display = "block";
                    currentAddButton.style.display = "block";
               }

               // Stores id of current exerciseButton selected/"expanded" in global variable to keep track of which is selected/"expanded"
               currentlySelectedExerciseButtonId = currentButton.id;
          });
     });
}

/**
 * * This function allows the user to use the exercise cards to add exercises into a temporary array which will then be used as a property of new Routines
 * Paired with it is the Event Listener that assigns the function to ALL [Add] buttons
 */
function addToTempExerciseList() {
     const exerciseDuration = sanitize(document.getElementById(`input-${currentlySelectedExerciseButtonId}`).value);

     const newExercise = new Exercise(currentlySelectedExerciseButtonId, exerciseDuration);
     tempExerciseArray.push(newExercise); // tempExerciseArray in global variables
}

// Paired with above and below
function addEventListenerToAddButtons() {
     const addButtons = document.querySelectorAll(".button-add");

     addButtons.forEach(function (currentButton) {
          currentButton.addEventListener("click", function () {
               // Adds currently selected exercise  to temp array
               addToTempExerciseList();
               // Shows user the new list of exercises they're building
               displayRoutineBeingBuiltDetails();
               // Shows button to allow user to save the Routine
               showSaveNewRoutineButton();
          });
     });
}

/**
 * * This function shows users the list of exercise for the current Routine that they're building
 */
function displayRoutineBeingBuiltDetails() {
     const routineBeingBuiltDetails = document.getElementById("routine-being-built-details");

     htmlString = "<h4>Exercises To Add</h4>";

     htmlString += "<ol>";
     for (i = 0; i < tempExerciseArray.length; i++) {
          htmlString += `<li>${tempExerciseArray[i].name} - ${tempExerciseArray[i].duration}</li>`;
     }
     htmlString += "</ol>";

     routineBeingBuiltDetails.innerHTML = htmlString;
}

/**
 * * This function handles the creation and saving of new Routines into localStorage
 * Paired with it is the Event Listener that assigns the function to the [Save New Routine] button
 */
function saveNewRoutineToLocalStorage() {
     // Store name of new Routine from input
     const routineName = sanitize(document.getElementById("new-routine-input").value);

     // Only create a new Routine if its name isn't an empty string
     if (routineName.trim().length > 0) {
          const newRoutine = new Routine(routineName, tempExerciseArray);
          localStorage.setItem("routineDataKey", JSON.stringify(newRoutine));

          // Always resets the input field to be empty
          document.getElementById("new-routine-input").value = "";

          // Empties out the temporary array
          tempExerciseArray = [];

          // Clear the Routine being built's exercist list details
          document.getElementById("routine-being-built-details").textContent = "";

          // Hides the [Save New Routine] button for next time
          hideSaveNewRoutineButton();

          // Displays to the user the currently loaded Routine
          displayCurrentlyLoadedRoutine();
     }
}

// Paired with above
document.getElementById("button-save-routine").addEventListener("click", function () {
     saveNewRoutineToLocalStorage();
});

// TODO:
