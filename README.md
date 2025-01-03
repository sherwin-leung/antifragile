# Antifragile

Antifragile (stylized as "antifragile.") is a simple countdown timer that allows you to create exercises, append them to a list, and save the list as a routine.

## How To Access & Troubleshoot

Simply visit this [GitHub Page](https://sherwin-leung.github.io/antifragile/) to use!

If the app seems broken and issues persist, try [clearing your local storage](https://github.com/sherwin-leung/antifragile?tab=readme-ov-file#-about-storage-of-data). Sometimes updates add/remove things which break parts of the app and clearing your local storage will most likely fix it. But they should generally fix themselves if you give the app a short amount of time.

**Please be aware that all your exercises and the routine will have to be remade until an import/export feature is implemented.** ***Please read the link first - especially if clearing on mobile devices!***

## 💡How To Use

`
As of version 1.09 - subject to change with when additional functionalities are implemented
`

### First Usage

1. Press the pill shaped **Exercise** button to expand the section.
   * Enter in an exercise name, eg. "shadowboxing", and press **Save**. This exercise will be saved and displayed in step 2

2. Press the pill shaped **Routine** button to expand the section
   * Enter a routine name
   * Click/tap on an exercise you want to append to your routine list. There are two by default, "Rest" and "Stretch", and you should see your newly added exercise as a button as well. In this example, you would also see "Shadowboxing"
   * Fill in the two inputs labeled minutes and seconds. _Empty or non-numeric (e) values will default to as 0_
   * Press **Save** and you should see your routine's name, the first exercise's name and duration, and buttons to start and stop at the top portion of your screen. If you have additional timer details enabled (in settings), you may see more information
     
3. Control the timer with the **start/pause** and **stop** buttons

4. Optional: Play around with the settings under the app's title

### Subsequent Uses

* To add a new exercise, simply repeat step 1 above. The new exercise's button will be appended in the **Routine** section
* To add a new routine, simply repeat step 2 above. This will _**overwrite**_ the previous routine until the ability for multiple routines is implemented

## 💾 About Storage of Data

<details>
  
<summary>Click to view information about how data is stored and how to manage it</summary>

There is currently no database storage associated with this app. Exercises and routines are stored in the user's device's **local storage**.

While state and exercises/routines persist through each visit, be aware that they _will_ be deleted if a user manually clears their cookies/site data on a **desktop** or **mobile**.

There may be a case where users may want to manually delete their data associated with Antifragile (nothing sensitive, just saved exercises/routines).

At the moment, there is no functionality to clear existing exerises on the timer, only the ability to add new ones. Additionally, currently creating a new routine only overwrites the previous one, and there is no ability to remove it.

There are plans to implement functionalities to allow users to delete existing exercises and routines in the future, but in the mean time, users using the [timer](https://sherwin-leung.github.io/antifragile/) can delete their associated data (and thus starting the timer with a fresh slate) with the following steps:

</details>

<details>

<summary>Click to see how to delete local storage</summary>
  
### 🖥️ Desktop

_On desktop, you can delete local storage for a site directly without erasing all your cookies._
1. Press **F12** to access dev tools
2. Click **Application** tab
3. Expand **Local storage** under _Storage_ category
4. Click `https://sherwin-leung.github.io`
5. Click the **Ø** symbol next to the filter bar to clear all data

### 📱 Mobile

* Simply clear your browser's cookies/site data. ***Keep in mind that this will probably sign you out of any sites you've signed into on your phone's browser and clear other preferences!***

</details>

## 👀 Known Bugs & Future Plans

### 🐛 Known Bugs

<details>

<summary>Click to view known bugs</summary>

* None found, for now! 😰

</details>

### 🔮 Future Plans
 
<details>

<summary>Click to view planned updates</summary>

Listed roughly in order of priority, but subject to change

* Option to add a "buffer countdown" between each exercise

* Ability to delete exercises
* Sort excercise buttons by alphabetical order

* Store and load multiple routines

* Ability to export data to a JSON file

</details>

## 📄 Version History

<details>

<summary>Click to view version 1 changelog</summary>

* v1.09
  * Visual improvements: animated gradients on some buttons, sections expanding/collapsing instead of appearing/disappearing instantly

* v1.08
  * Added ability to toggle on/off sounds for the timer. A sound plays when you successfully complete the entire routine (all exercises finished without quitting - pausing is okay though) and a sound plays when you stop the routine. Looking to add a sound that plays in between exercises for the routine soon. _The sounds right now are just silly Chaewon/LE SSERAFIM sounds but may change in the future._
 
* v1.07
  * Added ability to toggle on/off extra details related to currently loaded routine in the timer (how many exercises left, which exercise is coming up next, and full exercise list). Instructions view can be toggled on and off as well

* v1.06
  * Added visual feedback when trying to save a duplicate exercise and made the successful save feedback flashier

* v1.05
  * Added visual feedback when trying to save an exercise or routine without inputting a name or a routine with no exercises in its list

* v1.04
  * Added some initial visual feedback to the user when they successfully save exercises and/or routines. More visual feedback to come!

* v1.03
  * Consolidated play/pause/resume functionalities into one button, instead of play and pause/resume

* v1.02
   * Implemented pause/resume button and functionality

* v1.01
   * Fixed bug with out of bounds values for duration inputs

* v1.0
   * Initial Release
  
</details>

## 🙏 Acknowledgments

* V.L. for his mentorship and support
* J.Z. and I.W. for helping me bug test
* LE SSERAFIM's song [ANTIFRAGILE](https://youtu.be/pyf8cbqyfPs) whose name I ~~purloined~~ borrowed
* [Chaewon](https://www.instagram.com/_chaechae_1/?hl=en) for her voice
* [animista](https://animista.net/) - an awesome CSS library for animations
* Various code snippets from Stack Overflow and around the internet. I try to put credits within comments in the source code if it's something I straight copied
