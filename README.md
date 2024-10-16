# Antifragile

Antifragile (stylized as "antifragile.") is a simple countdown timer that allows you to create exercises, append them to a list, and save the list as a routine.

## To Access

* Simply visit this [GitHub Page](https://sherwin-leung.github.io/antifragile/) to use!

## How To Use

`As of version 1.0 - subject to change with when additional functionalities are implemented`

### First Usage

1. Press the pill shaped **Exercise** button to expand the section.
   * Enter in an exercise name, eg. "shadowboxing", and press **Save**. This exercise will be saved and displayed in step 2

2. Press the pill shaped **Routine** button to expand the section
   * Enter a routine name
   * Click/tap on an exercise you want to append to your routine list. There are two by default, "Rest" and "Stretch", and you should see your newly added exercise as a button as well. In this example, you would also see "Shadowboxing"
   * Fill in the two inputs labeled minutes and seconds. _Empty or non-numeric values will default to as 0_
   * Press **Save** and you should see your routine's name, the first exercise's name and duration, and a button to start and stop at the top portion of your screen
3. Control the timer with the **start** and **stop** buttons

### Subsequent Uses

* To add a new exercise, simply repeat step 1 above. The new exercise's button will be appended in the **Routine** section
* To add a new routine, simply repeat step 2 above. This will overwrite the previous routine

## About Storage of Data

<details>
  
<summary>Click to view information about how data is stored and how to manage it</summary>

There is currently no database storage associated with this app. Exercises and routines are stored in the user's device's **local storage**.

While state and exercises/routines persist through each visit, be aware that they _will_ be deleted if a user manually clears their cookies/site data on a **desktop** or **mobile**.

There may be a case where users may want to manually delete their data associated with Antifragile (nothing sensitive, just saved exercises/routines).

At the moment, there is no functionality to clear existing exerises on the timer, only the ability to add new ones. Additionally, currently creating a new routine only overwrites the previous one, and there is no ability to remove it.

There are plans to implement functionalities to allow users to delete existing exercises and routines in the future, but in the mean time, users using the [timer](https://sherwin-leung.github.io/antifragile/) can delete their associated data (and thus starting the timer with a fresh slate) with the following steps:

### Desktop

_On desktop, you can delete local storage for a site directly without erasing all your cookies._
1. Press **F12** to access dev tools
2. Click **Application** tab
3. Expand **Local storage** under _Storage_ category
4. Click **https://sherwin-leung.github.io**
5. Click the **Ø** symbol next to the filter bar to clear all data

### Mobile

* Simply clear your browser's cookies/site data. ***Keep in mind that this will probably sign you out of any sites you've signed into on your phone's browser!***

</details>

## Known Bugs & Future Plans

### Known Bugs

* High on the priority list to fix

<details>

<summary>View known bugs</summary>

* The ability to enter negative number in the input. For example, entering a duration of 1 minute but **-50** as the seconds will result in the timer showing as 01:-50 at first, but upon clicking the play button, the countdown will start properly at 00:10

* Similarly, entering any value over 59 in seconds will cause similar behaviors as above. Entering 0 minutes and **65** seconds will display as 00:65, but become 01:05 once the play button is clicked and will countdown properly

</details>

### Future Plans

* Roughly in order of priority, but subject to change
  
<details>

<summary>Click to view planned updates</summary>

* Implement visual feedback to the user to indicate successes when saving exercises/routines, or errors such as missing an exercise/routine name while saving

* Pause button
* Skip exercise button

* Sounds
* Mute button

* Option to add a "buffer countdown" between each exercise

* Display upcoming exercise's name
* Display how many exercises left in routine
* Highlight where the user progress

* Ability to delete exercises

* Ability to save multiple routines
* Ability to delete routines
* Ability to edit current routine

* Pin favorite exercises buttons to the top
* Sort excercise buttons by alphabetical order

</details>

## Version History

* 1.0
   * Initial Release

## Acknowledgments

* V.L. for his mentorship and support
* J.Z. and I.W. for helping me bug test
* LE SSERAFIM's song [ANTIFRAGILE](https://youtu.be/pyf8cbqyfPs) whose name I borrowed ~~(purloined)~~
* [animista](https://animista.net/) - an awesome CSS library for animations
