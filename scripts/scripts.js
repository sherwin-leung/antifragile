/**
 * * Global Variables
 */
let currentlySelectedExerciseButtonId;
let tempExerciseArray = [];

/**
 * * Constructors for various Objects
 */
class Exercise {
     constructor(name, durationMinutes, durationSeconds) {
          this.name = name;
          this.durationMinutes = durationMinutes;
          this.durationSeconds = durationSeconds;
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
     generateOverlayPhrase();
     refreshExerciseCards();
     populateTimerDetailsOnLoad();
     populateExerciseList();
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
     document.getElementById("button-save-new-routine").style.display = "none";
}

// Helper function - showShowNewRoutineButton() show the [Save New Routine] button in the New Routine section
function showSaveNewRoutineButton() {
     document.getElementById("button-save-new-routine").style.display = "block";
}

// Helper function - convertToStringAndPad2() converts the parameter into a String and then pads it with 0 in front if it is less than two chars
function convertToStringAndPad2(x) {
     if (isNaN(parseInt(x))) {
          return "".padStart(2, "0");
     }

     return String(x).padStart(2, "0");
}

// Helper function - resetTimerDisplayCurrentExerciseNameColor() does as its name says, in the event that current exercise being displayed's name was changed to anything other than lilac
function resetTimerDisplayCurrentExerciseNameColor() {
     // This is the same as var(--clr--lilac) in CSS variables
     document.getElementById("timer-display-current-exercise-name").style.color = "#e7d1ff";
}

// Helper function - hideRoutineAndExerciseSectionsAndResetTheirButtons() hides the Routine and Exercise sections and resets their buttons to show + (plus)
function hideRoutineAndExerciseSectionsAndResetTheirButtons() {
     const routineSectionView = document.getElementById("div-new-routine");
     const exerciseSectionView = document.getElementById("div-new-exercise");

     routineSectionView.style.display = "none";
     exerciseSectionView.style.display = "none";

     // Sets the buttons to have +
     document.getElementById("button-new-routine").innerHTML = `<i class="fa-solid fa-plus"></i> Routine`;
     document.getElementById("button-new-exercise").innerHTML = `<i class="fa-solid fa-plus"></i> Exercise`;
}

// Helper function - disableElement() sets the "disabled" attribute to an element
function disableElement(element) {
     element.setAttribute("disabled", "");
}

// Helper function - enableElement() removes the "disabled" attribute from an element
function enableElement(element) {
     element.removeAttribute("disabled");
}

/**
 * * Disable scrolling while the overlay is showing in case that main content height is > 100vh, which is the overlay's height
 */

// Add no-scroll to entire page
document.body.classList.add("no-scroll");

// After the overlay animation (1.5s), enable scrolling again (add 2 millisecond buffer) by removing the no-scroll class
setTimeout(function () {
     document.body.classList.remove("no-scroll");
}, 1502);

/**
 * * This functions handles generating a random phrase each time the page is loaded/reloaded
 */
function generateOverlayPhrase() {
     const arrayOfPhrases = ["an exercise timer"];
     const randomIndex = Math.floor(Math.random() * arrayOfPhrases.length);

     document.getElementById("overlay-phrase").textContent = arrayOfPhrases[randomIndex];
}

/**
 * * This function handles toggling on and off the view of certain contents when the main three buttons are clicked/tapped
 * @param divId indicates which div to toggle on and off
 */

function toggleViewOnAndOff(divId) {
     const sectionId = document.getElementById(divId);

     if (sectionId.style.display === "block") {
          sectionId.style.display = "none";
          showPlusOnButton(sectionId.id);
     } else {
          sectionId.style.display = "block";
          showMinusOnButton(sectionId.id);
     }
}

/**
 * * These two functions below make the [Routine] and [Exercise] buttons show either a + or -, dependng on whether the section is expanded or not
 * @param {} sectionId tells the function which is section is getting expanded/closed
 */

// 1
function showPlusOnButton(sectionId) {
     if (sectionId === "div-new-routine") {
          document.getElementById("button-new-routine").innerHTML = `<i class="fa-solid fa-plus"></i> Routine`;
     } else if (sectionId === "div-new-exercise") {
          document.getElementById("button-new-exercise").innerHTML = `<i class="fa-solid fa-plus"></i> Exercise`;
     }
}

// 2
function showMinusOnButton(sectionId) {
     if (sectionId === "div-new-routine") {
          document.getElementById("button-new-routine").innerHTML = `<i class="fa-solid fa-minus"></i> Routine`;
     } else if (sectionId === "div-new-exercise") {
          document.getElementById("button-new-exercise").innerHTML = `<i class="fa-solid fa-minus"></i> Exercise`;
     }
}

/**
 * * The following TWO functions work together *
 * 1) populateExerciseList() this function displays the currently loaded Routine to the user. It persists on page load and refreshes when user saves a new Routine
 * 2) addToggleExerciseListViewFunctionToButton() - because a new button to toggle exercise list view is generated each time a new Routine is saved, it needs to be re-assigned the function enabling it to toggle views
 */
function populateExerciseList() {
     // Grab the saved Routine from localStorage
     const grabbedData = localStorage.getItem("routineDataKey");

     if (grabbedData === null) {
          return;
     }

     const currentlyLoadedRoutine = JSON.parse(grabbedData);

     // Displaying the exercise list in the Routine
     const exerciseDetails = document.getElementById("exercise-details");

     // Creates button for toggling exercise list view
     let htmlString = `<button class='button-toggle-lists' id='button-toggle-exercise-list'><i class="fa-solid fa-angle-down"></i> Show Exercise List <i class="fa-solid fa-angle-down"></i></button>`;

     htmlString += "<ol id='ol-currently-loaded-routine'>";
     for (i = 0; i < currentlyLoadedRoutine.exerciseList.length; i++) {
          htmlString += `<li>${currentlyLoadedRoutine.exerciseList[i].name} - ${convertToStringAndPad2(
               currentlyLoadedRoutine.exerciseList[i].durationMinutes
          )}m:${convertToStringAndPad2(currentlyLoadedRoutine.exerciseList[i].durationSeconds)}s</li>`;
     }
     htmlString += "</ol>";

     exerciseDetails.innerHTML = htmlString;

     addToggleExerciseListViewFunctionToButton();
}

// Paired with above
function addToggleExerciseListViewFunctionToButton() {
     const exerciseListToggleButton = document.getElementById("button-toggle-exercise-list");
     exerciseListToggleButton.addEventListener("click", function () {
          const olRoutine = document.getElementById("ol-currently-loaded-routine");

          if (olRoutine.style.display === "block") {
               olRoutine.style.display = "none";
               exerciseListToggleButton.innerHTML = `<i class="fa-solid fa-angle-down"></i> Show Exercise List <i class="fa-solid fa-angle-down"></i>`;
          } else {
               olRoutine.style.display = "block";
               exerciseListToggleButton.innerHTML = `<i class="fa-solid fa-angle-up"></i> Hide Exercise List <i
                            class="fa-solid fa-angle-up"></i>`;
          }
     });
}

/**
 * * This function handles the creation and saving of new Exercises into localStorage
 * Paired with EventListener below that assigns it to the button [Save Exercise]
 */
function saveNewExerciseToLocalStorage() {
     event.preventDefault();

     // Get existing data from localStorage or retrieve an empty array if there is none as a fallback
     const existingExerciseData = JSON.parse(localStorage.getItem("exerciseDataKey")) || [];

     // Store user's input
     const exerciseName = sanitize(convertToTitleCase(document.getElementById("new-exercise-input").value));

     // Only create a new Exercise if its name isn't an empty string and it doesn't already exist
     if (exerciseName.trim().length > 0 && checkIfAlreadyExistsInLocalStorage(existingExerciseData, exerciseName) === false) {
          // Create a new Exercise Object and pushes it into the existing exercise data. Afterwards, save existing data with the new Exercise to localStorage
          const newExercise = new Exercise(exerciseName, 0, 0);
          existingExerciseData.push(newExercise);
          localStorage.setItem("exerciseDataKey", JSON.stringify(existingExerciseData));

          // Refreshes buttons
          refreshExerciseCards();
     }

     // Always resets the input field to be empty
     document.getElementById("new-exercise-input").value = "";
}

// Paired with above
document.getElementById("button-save-new-exercise").addEventListener("click", function () {
     saveNewExerciseToLocalStorage();
});

/**
 * * The following THREE functions work together
 * 1) refreshExerciseCards() couples the two following functions together
 * 2) clearExerciseCards() which clears all existing exercise cards
 * 3) renderExerciseCards() which renders all the exercise cards anew, assigns functions to the buttons, and validation checks for inputs
 */

// 1
function refreshExerciseCards() {
     clearExerciseCards();
     renderExerciseCards();
}

// 2
function clearExerciseCards() {
     const parentExerciseCardsContainer = document.getElementById("exercise-cards-container");
     let exerciseCard = parentExerciseCardsContainer.firstElementChild;

     while (exerciseCard) {
          parentExerciseCardsContainer.removeChild(exerciseCard);
          exerciseCard = parentExerciseCardsContainer.firstElementChild;
     }
}

// 3
function renderExerciseCards() {
     // Create the Rest button which is always at the beginning
     createNewExerciseCard("Rest");
     createNewExerciseCard("Stretch");

     // Grabs existing exercises data from localStorage and converts it into an array
     const existingExerciseDataInStringForm = localStorage.getItem("exerciseDataKey");
     const existingExerciseDataInArrayForm = existingExerciseDataInStringForm ? JSON.parse(existingExerciseDataInStringForm) : [];

     // Now for each  exercise in the array
     for (i = 0; i < existingExerciseDataInArrayForm.length; i++) {
          const name = existingExerciseDataInArrayForm[i].name;
          createNewExerciseCard(name);
     }

     // Add Event Listeners to to all [Exercise] buttons
     addEventListenerToExerciseButtons();

     // Add Event Listeners to all [Add] buttons
     addEventListenerToAddButtons();

     // Ensures that the minutes (for duration) that a user inputs cannot be a negative number
     enforceValidInputMinutesValue();

     // Ensures that the seconds (for duration) that a user inputs cannot outside of 0-59
     enforceValidInputSecondsValue();
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

     // Create a new div which acts as as the CARD container
     const newCard = document.createElement("div");
     newCard.classList.add("exercise-card");
     document.getElementById("exercise-cards-container").append(newCard);

     // Create a button then append it to the parent container
     const newButtonExercise = document.createElement("button");
     newButtonExercise.textContent = name; // ! We do NOT want to force hyphenation here
     newButtonExercise.classList.add("button-exercise");
     newButtonExercise.id = `${nameHyphenated}`;
     newCard.append(newButtonExercise);

     // Create a new label and append it to the parent container for MINUTES
     const newLabelMinutesDuration = document.createElement("label");
     newLabelMinutesDuration.textContent = "Minutes";
     newLabelMinutesDuration.classList.add("label-minutes-duration");
     newLabelMinutesDuration.htmlFor = `input-minutes-${nameHyphenated}`; // Setting for
     newCard.append(newLabelMinutesDuration);

     // Create a new input and append it to the parent container for MINUTES
     const newInputMinutesDuration = document.createElement("input");
     newInputMinutesDuration.classList.add("input-minutes-duration");
     newInputMinutesDuration.id = `input-minutes-${nameHyphenated}`;
     newInputMinutesDuration.type = "number";
     newInputMinutesDuration.inputMode = "numeric";
     newInputMinutesDuration.name = `input-minutes-${nameHyphenated}`;
     // newInputMinutesDuration.placeholder = 0;
     newInputMinutesDuration.min = 0;
     newCard.append(newInputMinutesDuration);

     // Create a new seconds label and append it to the parent container for SECONDS
     const newLabelSecondsDuration = document.createElement("label");
     newLabelSecondsDuration.textContent = "Seconds";
     newLabelSecondsDuration.classList.add("label-seconds-duration");
     newLabelSecondsDuration.htmlFor = `input-seconds-${nameHyphenated}`; // Setting for
     newCard.append(newLabelSecondsDuration);

     // Create a new seconds input and append it to the parent container for SECONDS
     const newInputSecondsDuration = document.createElement("input");
     newInputSecondsDuration.classList.add("input-seconds-duration");
     newInputSecondsDuration.id = `input-seconds-${nameHyphenated}`;
     newInputSecondsDuration.type = "number";
     newInputSecondsDuration.inputMode = "numeric";
     newInputSecondsDuration.name = `input-seconds-${nameHyphenated}`;
     // newInputSecondsDuration.placeholder = 0;
     newInputSecondsDuration.min = 0;
     newInputSecondsDuration.max = 59;
     newCard.append(newInputSecondsDuration);

     // Create another button and append it to the parent container. This one is for submitting
     const newAddButton = document.createElement("button");
     newAddButton.textContent = "Add";
     newAddButton.classList.add("button-add");
     newCard.append(newAddButton);
}

/**
 * * This function gives all exercise buttons an Event Listener
 *
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
               const minutesLabel = currentParentContainer.querySelector("label");
               const minutesInput = currentParentContainer.querySelector("input");

               const secondsLabel = currentParentContainer.querySelector(".label-seconds-duration");
               const secondsInput = currentParentContainer.querySelector(".input-seconds-duration");

               const addButton = currentParentContainer.querySelector(".button-add");

               // Check the visibility of current cluster. This acts as the toggle switch
               // Could just check one element's display for less written code, but to be safe, check all
               const isCurrentClusterVisible =
                    minutesLabel.style.display === "block" &&
                    minutesInput.style.display === "block" &&
                    secondsLabel.style.display === "block" &&
                    secondsInput.style.display === "block" &&
                    addButton.style.display === "block";

               // Hide all labels, inputs, and [Add] buttons
               const allContainers = document.querySelectorAll(".exercise-card");
               allContainers.forEach(function (container) {
                    container.querySelector("label").style.display = "none";
                    container.querySelector("input").style.display = "none";

                    container.querySelector(".label-seconds-duration").style.display = "none";
                    container.querySelector(".input-seconds-duration").style.display = "none";

                    container.querySelector(".button-add").style.display = "none";
               });

               // If the current cluster is hidden, show it
               if (isCurrentClusterVisible === false) {
                    minutesLabel.style.display = "block";
                    minutesInput.style.display = "block";

                    secondsLabel.style.display = "block";
                    secondsInput.style.display = "block";

                    addButton.style.display = "block";
               }

               // Stores id of current exerciseButton selected/"expanded" in global variable to keep track of which is selected/"expanded"
               currentlySelectedExerciseButtonId = currentButton.id;
          });
     });
}

/**
 * * This function allows the user to use the exercise cards to add exercises into a temporary array which will then be used as a property of new Routines
 * Paired with it is the Event Listener function that assigns the function to ALL [Add] buttons
 */
function addToTempExerciseList() {
     // Converts value from string to int
     const minutes = parseInt(document.getElementById(`input-minutes-${currentlySelectedExerciseButtonId}`).value);
     const seconds = parseInt(document.getElementById(`input-seconds-${currentlySelectedExerciseButtonId}`).value);

     // currentlySelectedExerciseButtonId may have a hyphen, ie "thai-sit-ups", but we want it to be "thai sit ups" when we form the list
     const stringWithHyphensArray = currentlySelectedExerciseButtonId.split("-");
     const newStringWithWhiteSpace = stringWithHyphensArray.join(" ");

     const newExercise = new Exercise(newStringWithWhiteSpace, minutes, seconds);
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
 * * This function enforces that the user can only input positive numbers in the input for duration in minutes
 * Credits: https://stackoverflow.com/questions/34577806/how-to-prevent-inserting-value-that-is-greater-than-to-max-in-number-field-in-ht
 */
function enforceValidInputMinutesValue() {
     const allInputMinutes = document.getElementsByClassName("input-minutes-duration");

     for (let i = 0; i < allInputMinutes.length; i++) {
          allInputMinutes[i].oninput = function () {
               const min = parseInt(this.min);

               if (parseInt(this.value) < min) {
                    this.value = min;
               }
          };
     }
}

/**
 * * This function enforces that the user can only input numbers between 0-59 inclusive in the input for duration in seconds
 * Credits: https://stackoverflow.com/questions/34577806/how-to-prevent-inserting-value-that-is-greater-than-to-max-in-number-field-in-ht
 */
function enforceValidInputSecondsValue() {
     const allInputSeconds = document.getElementsByClassName("input-seconds-duration");

     for (let i = 0; i < allInputSeconds.length; i++) {
          allInputSeconds[i].oninput = function () {
               const max = parseInt(this.max);
               const min = parseInt(this.min);

               if (parseInt(this.value) > max) {
                    this.value = max;
               } else if (parseInt(this.value) < min) {
                    this.value = min;
               }
          };
     }
}

/**
 * * The following FOUR functions work together
 * 1) displayRoutineBeingBuiltDetails() shows users the list of exercise for the current Routine that they're building
 * 2) createTempExerciseList() builds a string from tempExerciseArray and returns it
 * 3) createClearButton() creates the button to be assigned to the clearRoutineBeingBuilt() function
 * 4) clearRoutineBeingBuiltDetails() clears out the list of exercises the user currently is building for a new Routine for if the user wants to restart selection process
 */

// 1
function displayRoutineBeingBuiltDetails() {
     document.getElementById("routine-being-built-details").innerHTML = createTempExerciseList();
     createClearButton();
}

// 2
function createTempExerciseList() {
     htmlString = `<p id="p-exercise-to-add">Exercises To Add</p>`;

     htmlString += "<ol>";
     for (i = 0; i < tempExerciseArray.length; i++) {
          htmlString += `<li>${tempExerciseArray[i].name} - ${convertToStringAndPad2(tempExerciseArray[i].durationMinutes)}m:${convertToStringAndPad2(
               tempExerciseArray[i].durationSeconds
          )}s</li>`;
     }
     htmlString += "</ol>";

     return htmlString;
}

// 3
function createClearButton() {
     const clearButton = document.createElement("button");
     clearButton.textContent = "Clear";
     clearButton.id = "button-clear";
     document.getElementById("routine-being-built-details").append(clearButton);

     document.getElementById("button-clear").addEventListener("click", function () {
          clearRoutineBeingBuiltDetails();
     });
}

// 4
function clearRoutineBeingBuiltDetails() {
     tempExerciseArray = [];
     displayRoutineBeingBuiltDetails();

     document.getElementById("routine-being-built-details").textContent = "";
}

/**
 * * This function handles the creation and saving of new Routines into localStorage
 * Paired with it is the Event Listener that assigns the function to the [Save New Routine] button
 */
function saveNewRoutineToLocalStorage() {
     // Store name of new Routine from input
     const routineName = sanitize(convertToTitleCase(document.getElementById("new-routine-input").value));

     // Only create a new Routine if its name isn't an empty string
     if (routineName.trim().length > 0) {
          const newRoutine = new Routine(routineName, tempExerciseArray);
          localStorage.setItem("routineDataKey", JSON.stringify(newRoutine));
     }
}

// Paired with above
document.getElementById("button-save-new-routine").addEventListener("click", function () {
     // Saves Routine to localStorage first
     saveNewRoutineToLocalStorage();

     // Resets the input field to be empty
     document.getElementById("new-routine-input").value = "";

     // Empties out the temporary array
     tempExerciseArray = [];

     // Clear the Routine being built's exercist list details
     document.getElementById("routine-being-built-details").textContent = "";

     // Hides the [Save New Routine] button for next time
     hideSaveNewRoutineButton();

     // Closes Routine/Exercse sections so users can focus on the timer section. Reset the buttons to show + (plus)
     // TODO: See if users prefer this or not
     hideRoutineAndExerciseSectionsAndResetTheirButtons();

     // Populates the exercise list which users can open and close
     populateExerciseList();

     // Timer section gets populated with the new Routine's info
     populateTimerDetailsOnLoad();

     // Resets the Exercise name's color to lilac in case it's been changed to yellow
     resetTimerDisplayCurrentExerciseNameColor();
});

/**
 * * The following function and Event Listener work together to hide and show the instructions for creating and saving a new Routine
 */

function toggleInstructionsView() {
     const instructions = document.getElementById("ol-instructions");
     const showInstructionsLabel = document.getElementById("button-toggle-instructions");

     if (instructions.style.display === "block") {
          instructions.style.display = "none";
          showInstructionsLabel.innerHTML = `<i class="fa-solid fa-angle-down"></i> Show Instructions <i class="fa-solid fa-angle-down"></i>`;
     } else {
          instructions.style.display = "block";
          showInstructionsLabel.innerHTML = `<i class="fa-solid fa-angle-up"></i> Hide Instructions <i class="fa-solid fa-angle-up"></i>`;
     }
}

// Paired with above
document.getElementById("button-toggle-instructions").addEventListener("click", function () {
     toggleInstructionsView();
});

/**
 * * The following SEVEN functions, TWO Event Listeners, and variables work together to start/stop and display the countdown timer
 * Event Listeners - Assigns function to startButton/pauseButton/stopButton and disables/enables relevant buttons when clicked
 *
 * 1) createTempArraysForTimer() grabs Routine data and stores the name & duration of each Exercise in the Routine's exerciseList in global temporary arrays
 *
 * 2) startCountdown() starts the countdown for the current Exercise (based on the index). Fires up tick() and then tells it to run every 1 second. If there are no Exercises left in the exercise list, it performs clean up and stops the countdown
 *
 * 3) togglePauseAndResumeCountdown() is for the [Pause button]. It calls function 4) and 5) below. If the timer is currently paused, it will resume it from where it left off. If it's currently running, it will pause it at the current countdown state
 *
 * 4) pauseCountdown() pauses the timer if it is currently running
 *
 * 5) resumeCountdown() resumes the countdown if it was paused by the function above
 *
 * 6) stopCountdown() stops the countdown and performs a lot of clean up. If the user presses [Start] again, it restarts the countdown from the beginning of the list
 *
 * 7) tick() in charge of displaying  to the user the countdown timer. If the seconds reach -1 (the duration is over), it stops the countdown, increments the index by 1, and tells startCountdown() to run for the next Exercise if there is one
 *
 */

let timerIntervalId;
let totalCountdownTimeInSeconds;

let tempArrayOfNames = [];
let tempArrayOfDurations = [];

let currentExerciseIndex = 0; // To keep track of the current exercise that's being timed

let isTimerPaused = false;

const timerDisplayExerciseName = document.getElementById("timer-display-current-exercise-name");
const timerDisplayCountdown = document.getElementById("timer-display-countdown");

const startButton = document.getElementById("button-start");
const pauseButton = document.getElementById("button-pause");
const stopButton = document.getElementById("button-stop");

// * [Pause] and [Stop] starts off disabled
disableElement(pauseButton);
disableElement(stopButton);

// Event Listener 1 [Start]
startButton.addEventListener("click", function () {
     disableElement(startButton);
     enableElement(pauseButton);
     enableElement(stopButton);

     createTempArraysForTimer();

     // Start the countdown for the first exercise
     currentExerciseIndex = 0;
     startCountdown();
});

// Event Listener 2 [Pause]
pauseButton.addEventListener("click", function () {
     togglePauseAndResumeCountdown();
});

// Event Listener 3 [Stop] - performs a lot of clean up
stopButton.addEventListener("click", function () {
     enableElement(startButton);
     disableElement(pauseButton);
     disableElement(stopButton);

     stopCountdown();

     // Resets pause button back to the icon in case it's currently showing "R"
     pauseButton.innerHTML = `<i class="fa-solid fa-pause"></i>`;

     // Reset timer pause switch
     isTimerPaused = false;

     // Change timer display text
     timerDisplayExerciseName.textContent = "Stopped";
     timerDisplayCountdown.textContent = "00:00";
});

// 1
function createTempArraysForTimer() {
     const grabbedData = localStorage.getItem("routineDataKey");

     if (grabbedData === null) {
          return;
     }

     const currentlyLoadedRoutine = JSON.parse(grabbedData);

     // Grab each exercise's name & duration and put them into their own separate temporary arrays (one for name, one for duration)
     for (let i = 0; i < currentlyLoadedRoutine.exerciseList.length; i++) {
          // Names
          const exerciseName = currentlyLoadedRoutine.exerciseList[i].name;
          tempArrayOfNames.push(exerciseName);

          // Full durations in seconds
          const startingMinutes = currentlyLoadedRoutine.exerciseList[i].durationMinutes;
          const startingSeconds = currentlyLoadedRoutine.exerciseList[i].durationSeconds;
          const totalTimeInSeconds = startingMinutes * 60 + startingSeconds;
          tempArrayOfDurations.push(totalTimeInSeconds);
     }
}

// 2
function startCountdown() {
     // If there are no more exercises, stop the timer from running
     // Also perform a little clean up with buttons
     if (currentExerciseIndex === tempArrayOfDurations.length) {
          stopCountdown();

          timerDisplayExerciseName.textContent = "✨Finished!✨";
          timerDisplayExerciseName.style.color = "#ffcc74";

          enableElement(startButton);
          disableElement(pauseButton);
          disableElement(stopButton);

          return;
     }

     resetTimerDisplayCurrentExerciseNameColor();
     totalCountdownTimeInSeconds = tempArrayOfDurations[currentExerciseIndex];

     tick(); // Call the update function once to display the initial time..
     timerIntervalId = setInterval(tick, 1000); // ..then call the function every second
}

// 3
function togglePauseAndResumeCountdown() {
     if (isTimerPaused === false) {
          pauseCountdown();
          timerDisplayExerciseName.style.color = "#e7d1ff";
     } else {
          resumeCountdown();
     }
}

// 4
function pauseCountdown() {
     clearInterval(timerIntervalId);
     isTimerPaused = true;
     pauseButton.innerHTML = `<i class="fa-solid fa-r"></i>`;
     timerDisplayExerciseName.textContent = "Paused";
}

// 5
function resumeCountdown() {
     timerIntervalId = setInterval(tick, 1000);
     isTimerPaused = false;
     pauseButton.innerHTML = `<i class="fa-solid fa-pause"></i>`;
     timerDisplayExerciseName.textContent = tempArrayOfNames[currentExerciseIndex];
}

// 6
function stopCountdown() {
     clearInterval(timerIntervalId);

     // Empties out temp arrays to ensure previous instances of countdowns are erased
     // * Must be run every time stopCountdown is called, so cannot be in an Event Listener
     tempArrayOfNames = [];
     tempArrayOfDurations = [];
}

// 7
function tick() {
     // Stop the countdown when time is up for the current exercise
     if (totalCountdownTimeInSeconds < 0) {
          clearInterval(timerIntervalId); // Triger stop

          // Move on to the next exercise
          currentExerciseIndex++;

          // Start the countdown for the next exercise
          startCountdown();

          return;
     }

     // Calculate minutes and seconds for the current exercise
     const displayMinutes = Math.floor(totalCountdownTimeInSeconds / 60);
     const displaySeconds = totalCountdownTimeInSeconds % 60;

     // Update display with the current exercise name
     timerDisplayExerciseName.textContent = tempArrayOfNames[currentExerciseIndex];

     // Update the display with the current exercise time
     timerDisplayCountdown.textContent = `${convertToStringAndPad2(displayMinutes)}:${convertToStringAndPad2(displaySeconds)}`;

     // Decrement the time for the current exercise
     totalCountdownTimeInSeconds--;
}

/**
 * * Populating Timer Section with the currently loaded Routine's name, first Exercise name & duration in its exerciseList
 */
function populateTimerDetailsOnLoad() {
     const grabbedData = localStorage.getItem("routineDataKey");

     if (grabbedData === null) {
          return;
     }

     const routineName = document.getElementById("timer-display-routine-name");
     routineName.textContent = JSON.parse(grabbedData).name;

     const routineText = document.getElementById("timer-display-routine-text");
     routineText.textContent = "Routine";

     const currentExerciseText = document.getElementById("timer-display-current-exercise-text");
     currentExerciseText.textContent = "Current Exercise";

     const exerciseName = document.getElementById("timer-display-current-exercise-name");
     exerciseName.innerHTML = JSON.parse(grabbedData).exerciseList[0].name;

     const minutes = `${JSON.parse(grabbedData).exerciseList[0].durationMinutes}`;
     const seconds = `${JSON.parse(grabbedData).exerciseList[0].durationSeconds}`;

     const countdown = document.getElementById("timer-display-countdown");
     countdown.textContent = `${convertToStringAndPad2(minutes)}:${convertToStringAndPad2(seconds)}`;

     document.getElementById("control-buttons-container").style.display = "block";
}
