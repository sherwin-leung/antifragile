/** This function handles toggling on and off the view of certain contents when the main three buttons are clicked/tapped
 *
 * @param divId indicates which div to toggle on and off
 */
function toggleViewOnAndOff(divId) {
     let view = document.getElementById(divId);

     // This should be the one used normally
     view.style.display === "block" ? (view.style.display = "none") : (view.style.display = "block");
}

const exercisesArray = [];

function saveNewExercise() {
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
