/** This function handles toggling on and off the view of certain contents when the main three buttons are clicked/tapped
 *
 * @param divId indicates which div to toggle on and off
 */
function toggleViewOnAndOff(divId) {
     let view = document.getElementById(divId);

     if (view.style.display === "block") {
          view.style.display = "none";
     } else {
          view.style.display = "block";
     }
}

// ! Not going to use, just was used for practicing. Will delete

const exercisesArray = [];

function saveNewExerciseToArray() {
     // Prevents page from refreshing
     event.preventDefault();

     // Stores the input's value
     let inputValue = document.getElementById("new-exercise-input").value;
     console.log(inputValue);

     // Pushes the value into the array
     exercisesArray.push(inputValue);
     console.log(exercisesArray);

     // Resets the input field to be empty
     document.getElementById("new-exercise-input").value = "";

     // Toggles view off again
     toggleViewOnAndOff("div-new-exercise");
}

// ! End

// TODO: Working on the code below

console.log("i don't want this code");

function saveNewExerciseToLocalStorage() {
     event.preventDefault();
     console.log("stepping in");

     // Get existing data from localStorage or retrieve an empty array if there is none as a fallback
     const existingExerciseData = JSON.parse(localStorage.getItem("exerciseData")) || [];
     console.log("step 1");
     console.log(`existingExerciseData is type of:  ${typeof existingExerciseData}`);

     // Get input's value (the name of the exercise)
     let newExercise = document.getElementById("new-exercise-input").value;
     console.log("step 2");

     // Append name of new exercise to existing data
     existingExerciseData.push(newExercise);
     console.log(existingExerciseData);
     console.log("step 3");

     // Save data to localStorage
     localStorage.setItem("exerciseData", JSON.stringify(existingExerciseData));
     console.log("step 4");

     // Resets the input field to be empty
     document.getElementById("new-exercise-input").value = "";
     console.log("step 5");
}
