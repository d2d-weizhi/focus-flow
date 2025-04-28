# Building Something New, Something Different, Something Better.

FocusFlow is the first of a series of mini-, small-scale app demos that I'm working on as part of a large mission to rebuild a better portfolio than the one I had lost years prior. These projects will range from web applications to mobile apps.

The reason for picking small-scale, limited-scoped project is because it helps to narrow the focus. Typically, a real-world project can take months to finish. But for a portfolio showcase, normally we only need to showcase the core features and functionalities. Also, after spending the first three days working on FocusFlow, I am now fully aware that most of these limited-scope projects can take anywhere between one to two weeks to fully complete.

My main mission and top priority for working on this projects is to focus on producing the highest quality demos, not just proof-of-concepts. I want them to look like part of a polished real-world website/app.

---

# FocusFlow: A Pomodoro-inspired Showcase

To avoid losing focus, I will explain the core features of this simple app in point form. I have also been using Gemini, the AI tool to assist me with building this showcase project. So everything here also serves as our daily recap and notes.

## Thought-process

- The app will always be at the center of the page/screen, even if the user resizes the web page.
- It will have a width of 600px, so that will be fixed.
- I want to provide the user with an option of using either a light/dark theme.
- I will integrate KendoReact into this project later into the development process.
- We will use the default material theme that comes with KendoReact. It already has both the light and 
dark mode.
- We will start building and protoyping this app without worrying about the theme or using KendoReact 
controls.
- Start by using the included tailwindcss and standard HTML input and buttons.

## Key Objectives/Tasks

1. Prototype a Simple UI (minus interation and application logic). Status: **COMPLETED**
2. Add in interaction (event handling). Status: **COMPLETED**
3. Work on application logic (work it feature by feature). Status: **COMPLETED**
4. Implement Dynamic, Smooth-Scaling Design (True Responsive Design). Status: **COMPLETED**
5. Theming & Styles. Status: **PENDING**

Notes:
- For me to begin the final Theming & Styling stage, I'm waiting for my access of ThemeBuilder Pro to come through from the Progress Telerik team. I've already submitted a request, I know they could be process it right now. But I should do another follow-up later this week.
- **I have to temporarily disable the smooth-scaling functionality. The related coding has been commented for those reasons so the app can still function as intended.**

## Daily Progress & Recap (Latest to Oldest)

### 28th, Mon: Audio Notification Added

- Added a ding.mp3 file to the project.
- When a focus period ends, the audio notification will play once.
- When a break period ends, the audio notification will play twice.
- **TODO**: I need to test it again just to be sure that it works as intended.

### 26, Sat: Complete Smooth-Scaling Implementation

- Used `gap-x-8` for specifying gaps between layout elements.
- Modified the horizontal flow for the right panel to a vertical layout in smaller screen sizes.
- Updated the outer `<div>` of the `CircularProgressBar` component with `max-w-` and `min-w-`.

```
<div className="2xl:w-[60%] w-[40%] min-w-[260px] max-w-[600px] aspect-square relative">
```

- I have also added the orientation detection, so it would trigger the `handleResize()` event handler.

### 25, Fri: Smooth-Scaling UI Experiment (Success)

- Implemented a two-column/single-column responsive layout.
  
```
<div className="flex ff-main-container px-8 py-8 w-full h-full"> {/* Our main app's container. */}
	<div className="flex left-panel bg-white p-4 shadow-md rounded-md items-center justify-center"> {/* Left Panel */}
  </div>
  <div className="flex right-panel mr-0 bg-white p-4 shadow-md rounded-md items-center justify-center"> {/* Right Panel */}
  </div>
</div>
```

- I have also used tailwindcss's `@apply` directive in my `global.css` file to import the necessary classes.

```
.ff-main-container {
  @apply 2xl:flex-row xl:flex-col lg:flex-col md:flex-col;
  @apply 2xl:space-y-0 2xl:space-x-8;
  @apply xl:space-y-8 xl:space-x-0 lg:space-y-8 lg:space-x-0 md:space-y-8 md:space-x-0;
  background-color: #FAF9F6;
}

.left-panel {
  @apply 2xl:flex-col xl:flex-row lg:flex-row md:flex-row;
  @apply 2xl:w-[50%] xl:w-full lg:w-full md:w-full;
  @apply 2xl:h-full xl:h-[65%] lg:h-[65%] md:h-[65%];
  @apply 2xl:mr-8;
}

.right-panel {
  @apply 2xl:flex-col xl:flex-row lg:flex-row md:flex-row;
  @apply 2xl:w-[50%] xl:w-full lg:w-full md:w-full;
  @apply 2xl:h-full xl:h-[35%] lg:h-[35%] md:h-[35%];
}
```

- Next, I was able to implement a method to calculate the necessary scaling for the button's fontSize.

```
function  calcFontSettings(width: number): string {
	if (width >= 1600) {
		setBtnIconSize(Math.floor(1.65 * 20));
		return "1.65rem";
	} else if (width >= 768 && width < 1600) {
		let currScaleFactor = 1 + (((width - 768) / (1600 - 768)) * .65);  // <- The formula I've been using.
		setBtnIconSize(Math.round(currScaleFactor * 20));
		return `${currScaleFactor}rem`;
	} else {	// Anything smaller, we can assume to be a mobile phone.
		setBtnIconSize(Math.floor(0.95 * 20));
		return "0.95rem";
	}
	}
```

- The scaling can be enhanced further, and I also want to ensure that the scaling takes into account mobile phones 
  in portrait mode.

```
<KRButton
	id="btnSetFocusTime"
	fillMode={"solid"}
	themeColor={"secondary"}
	onClick={onSetFocusTimeClicked}
	className="kr-buttons"
	style={{
		fontSize: `${btnFontSettings.fontSize}`,
		lineHeight: `${btnFontSettings.fontSize}`,
		width: "100%",
		height: "10%",
		minWidth: "150px",
		minHeight: "70px",
		maxWidth: "450px"
	}}
>
	<div className="flex w-full items-center">
		<Timer size={btnIconSize} />&nbsp;Set Focus Time
	</div>
</KRButton>
```

### 22nd, Tue: Setting Unique User Sessions

- Implemented unique user-specific sessions without the use of a user account, or logins.
- Used `localStorage` technique because it's the simplest for the current use-case.
- Added `isLoading` state variable in the `Home` component.
- Created a `timeout` of 3s within the `useEffect` hook so that the UI has time to load the `userFocusTime` from `localStorage`.
- When user saves a new focus time, it will be updated to the `userFocusTime` storage.
- Added the pulsing animation to the countdown timer "00:00" when `isLoading==true`.
- Display new countdown timer once loading is finished.
- When user presses the exit button (top-left), display a translucant white overlay that says the session has ended and they can close the tab/window.
- Injected "Roboto" font via Google fonts CDN. So the UI now has a consistent font family.

#### Part Two: Laying Some Groundwork for Tomorrow

- I've decided to add a new (but temporary) dimension tabs at the top-left corner of the web page.
- My goal and mission when it comes to creating a truly responsive design is to make all the dimensions of UI elements relative to the actual page/screen estate size.
- media queries may have been the way to create responsive web design in the early days, but they are not the best way to create a seamless UX these days.
- I've been testing this web app at 150% magnification for days (it is my browser's default mode).
- It also made me realize that my assumptions are not going to be a reliable way to make decision in the ideal dimensions.
- I need to default my magnification to 100% and use it as the baseline for everything that I want to achieve.
- Regardless of whether a user's machine has been scaled by default (Windows does it, sometimes at 150%, sometimes 175%, or even 200%), we need to ensure that our UI is able to handle whatever scaling factor the user is having.
- Are percentages a possible solution? Gemini did suggest using `rem` as a way to scale font sizes. It's something I'll need to explore tomorrow.

### 20th, Sun

#### Part One: Implementing Circular Progress Bar Animation

**Key Learnings:**

- Decided to externalize the Circular Progress Bar as a distinct component because this would be inline with reusability best practice.
- For simpler animations, it is more performant to use CSS animation.
- Took a few tries before we could figure out the correct way to calculate the value for animating the progress bar in a counterclockwise direction.
- Added a single level ternary operation for feeding the total focus/break time to the component.
- **TODO:** I will need to set up another test for making sure that the circular progress bar is working and behaving correctly (i.e. when switching between focus and break time periods).

**Challenges & Solutions:**

1. Initial `strokeDashoffset` Calculation: 
  **Problem:** The first calculation was inverting the progress.
  **Solution:** Inverted the percentage calculation to `100 - (timeLeft / totalTime) * 100`


2. Progress Bar Starting Empty:
  **Problem:** The progress bar was completely empty at the beginning of a time period.
  **Solution:**  Gemini, the AI tool's answers were not 100% wrong, they were mostly half right. The answers were spread out across a few of the responses, so I used a manual output/desired results to test and work backwards. Found the proper solution: `const strokeDashoffset = (283 * progressPercent) / 100;`


3. Incorrect `totalTime` Unit: 
  **Problem:** The `totalTime` prop was being passed in minutes, not seconds.
  **Solution:** Converted focusTime to seconds within the `CircularProgressBar` component:  `totalTime={activePeriod === "focus" ? focusTime * 60 : calcBreakTime(focusTime)}`

#### Part Two: Circular Progress Bar + Time Period Cycles Indicator

- We picked a good secondary colour, `#F59E0B` to signify our "break time" period.
- Named the secondary colour as "Spiced Honey".
- To simplify and prevent potential error when it comes to calculating the time period in seconds, I have renamed and added `breakTimeInSec(focusTime)` and `focusTimeInSec(focusTime)` functions.
- Refactored part of the code to make calculating the timeElapse simpler. All that is needed is `setTimeElapsed(timeElapsed => timeElapsed + 1);`
- We only reset our `timeElapsed` state variable to 0 whenever a time period switches between 'focus' and 'break'.
- Learned that `timerId` serves as a unique identifier for each instance of `setTimeout()`. The "coat checking" analogy helps. We store its value as a reference using `timerId.current`. 
- Remember to always clear the timeout when it is no longer needed (stopping or pausing it).Use the `clearTimeout(timerId)` function.
- Added two separate gradient effects for our `CircularProgressBar` with a 45% diagonal effect. This provides a natural lighting effect in accordance to material design guidelines.
- When working with gradient effects within SVGs, we need to remember the following steps:
    1. Identify your colour to start with (`offset="0%"`)
    2. Where does the colour begin, coordinate-wise (e.g. `x1="100%", y1="0%"`, that is bottom-right)
    3. Identify your next colour stop (`offset="100%"`)
    4. Finally, where does this colour end (e.g. `x2="0%", y2="100%"`, that is top-left)
- Additional note on gradient manipulation, when `offset="0%"`, it refers to the bottom of your SVG. `offset="100%"` is the top.
- If for some reason you need to rotate your gradient, you use `gradientTransform="rotate(angle/degrees)"`.
- Added a slight animation to the `CircularProgressBar` so it will have a "refilling" CSS animation when a time period finishes and transitions, `transition-all duration-500`.
- When tweaking the dimensions of the `CircularProgressBar`, I also realized that I need to adjust both the 
radius and the center point of the circle. That way, it will remain centered in the `viewPort`.

### 19th, Sat

#### Part One: Finishing up the UI prototyping

- Begun exporting the Button control by KR into a separate FC that I've named `KRButton`. This method of importing our control to the app worked.
- Decided to move both `KRButton` and `KRNumericTextBox` into a consolidated file called `./components/FFComponents.tsx`. 'FF' represents our project title "FocusFlow".
- Learned something new this morning: using dynamic imports for the `KRWindow` component (wrapped around the KendoReact Window component). 
- UI rapid prototyping is completed. Next stage is to add the application logic.
- When implementing our state management, I've decided it would keep things simple by using the out-of-the-box state management. It won't overcomplicate things.

#### Part Two: Adding Application Logic

- When building the application logic, I will attempt to break it down into individual sections (although there may be some overlaps between some of the features and how they work, so I'll need to keep it all in mind and add TODOs when needed.)
- We will start building our application logic using individual state values. After everything has been coded and tested, we can switch over to using a single `appState` object (i.e. `ffState`). This will reduce the likelihood of making unintended coding errors.
- When retrieving the input value from KRNumericTextBox, we need to use the `ref` prop. That way, we can get its value by using `setFocusTime(parseInt(focusTimeRef.current!.value));`.
- We need to use `forwardRef` to correctly pass refs to wrapped components and `ComponentPropsWithoutRef` to exclude the ref prop from the wrapped component's prop types.
- Discovered that `React.ElementRef` is deprecated and no longer necessary for typing refs in functional components that use `forwardRef`.
- Use separate event handlers for our control buttons because it will make our code more readable and easier to maintain in the long run.
- Instead of nesting complicated ternary logic operations in a single UI component, we will separate it into 3 code segments.
```
{
  !isRunning && 
  /* Start button */
}

{
  isRunning && !isPaused &&
  /* Pause button */
}

{
  isRunning && isPaused &&
  /* Resume button */
}
```
- Note that they are still considered the same component, just separated by the different state values and logic.
- Added the `currCycle` and `activePeriod` state variables so that the application can keep track of the current time period & cycle.

```
const [activePeriod, setActivePeriod] = useState<"focus" | "break">("focus");

const [currCycle, setCurrCycle] = useState<number>(1);
```

- Implemented a closure called `calcBreakTime` so that it can return the break time in seconds. This is used purely for updating the value of `timeLeft` when we're doing the countdown.
- Implemented `useEffect(() => {}, [])` to handle our time countdown operations.

```
useEffect(() => {
  // The user as started the clock, and it's not paused.
  if (isRunning && !isPaused && timeLeft > 0) {
    timer.current = setTimeout(() => {
      // We will count our time down every second.
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);
  } else {
    clearTimeout(timer.current!);
  }

  // Handle cycle or timer completion
  if (timeLeft == 0) {
    if (activePeriod === 'focus') {
      setActivePeriod('break');
      setTimeLeft(calcBreakTime(focusTime));
    } else if (activePeriod === 'break' && currCycle < TOTAL_CYCLES) {
      setActivePeriod('focus');
      setCurrCycle(prevCycle => prevCycle + 1);
      setTimeLeft(focusTime * 60);
    } else {
      setIsRunning(false);
    }
  }
}, [isRunning, isPaused, timeLeft, focusTime]);
```

- **TODO:** Conduct a thorough testing tomorrow morning. Set `focusTime` to 25 and let it run the full cycle (total start to finish: 2 hours).
- Realised that the `timeLeft` state variable wasn't updated properly when saving Focus Time value in the Window. Turns out, I needed to pass the KRNumericTextBox's value to the state function as well.

```
function onSaveFocusTimeClicked() {
  setFocusTime(parseInt(focusTimeRef.current!.value));
  setTimeLeft(parseInt(focusTimeRef.current!.value) * 60);
  setIsShowWindow(false);
}
```

- When deploying to Vercel, there were linting issues. Current workaround is to use the commenting statement `// eslint-disable-next-line  @typescript-eslint/no-explicit-any`.
- Note: Only use it when we know the exact types that we're trying to pass.

### 18th, Fri

- Started laying out the contents of the app.
- Centered our app's main container inside the `<body></body>` tag.
- Set the container's fixed width to 600px.
- Don't have to set the height because it will automatically wrap our contents.
- Made the app container a flex-column in order to achieve a top-down layout.
- Created a `<div />` tag as a separator between the contents for consistency.
- Added our circular progress bar and timer. I manually set the offset so I can 
visualize the progress bar in motion when the timer starts counting down.
- Replaced the buttons in the UI with KendoReact Buttons.
- Identified potential issues/workarounds especially when we need to toggle the colour of the "Start/Pause/Resume" button. The `themeColor={''}` prop doesn't have an option for grey background. So we will need to cater for that in our coding logic later.
- Added the KendoReact Window control (part of the dialog library).
- Still need to replace the input field, perhaps use a NumericTextBox for 
entering and setting the minutes.

## Features

- App will start with an off-white background. Unlike the KendoReact default theme's 
white background, we want something perhaps off-white. Plain white can be too glaring 
for the user.
- Text colour will be very close to black, but we also don't want it to just be `#000`.
- We will set these values now, so we don't have to change many things later on.
- I want an exit button (just an icon with outlined button) at the top-right corner of the page. It 
always sticks to that corner.



## Colour Scheme:

The colour scheme that I have decided upon is an off shoot of the
default KendoReact Material theme.

**Light Theme**

- Primary     : `#3f51b5` (same primary colour, no change)
- Secondary   : `#F59E0B` (name: Spiced Honey, vibe: warm, relaxing, sunset, )
- Tertiary    :
- Inactive    : `#D1D5DC` or `bg-gray-300` in tailwindcss. (Note: KR's default Material
              theme has a pink-like secondary colour in it's palette. It also has a 
              tertiary colour. We will need to decipher about theming later in the 
              development process.)
- Background  : `#FAF9F6` (off-white with slight yellow tones to
              give it a more paper-like feel.)
- Text        : `#141414` (slightly lighter tone of black so it 
              doesn't come off too strongly)

**Dark Theme**

To be determined. But likely an inverse of the light theme.


### Setting Focus Time

- At the top-center of the app, there will be a button that will trigger a dialog for entering the 
focus time period in minutes.
- Focus time < 30 min, Break time = 30 - Focus time
- Focus time > 30 min, Break time = 60 - Focus time

### Circular Progress Bar & Timer
- Next, below the button we will have a large circular progress bar.
- It will be counting down time left in a counterclockwise direction (starting at 12 o'clock).
- Gutter will be greyish, darker and translucent.
- Circular Progress Bar foreground will use `#3f51b5`. It will also be the default material theme's 
primary color. We can use this for now.
- Right at the center, we will show a large timer counting down the minutes and seconds for each time 
period.

### Time Period + Time Elapsed Indicator

- Below our circular progress bar, we will have a time period indicator.
- It will have a horizontal layout.
- The time periods will be split up with a small tiny in between.
- It will be a thinner line or rects with rounded edges.
- Long bars: represent focus time period.
- Short bars: represent break time period.
- Entire indicator will consists of 4 cycles of Focus-Break periods.
- The gutter will again be more translucent but still visible to the user.
- The time elapsed indicator will be more obvious. We can use off-white to show how much time has 
passed over each time period.

### Control buttons
- Position: Bottom center
- Only be TWO buttons
- **"Start/Pause/Resume"** are a single button, just different states and actions.
- **"Start"** - default state. It will have the primary color as stated above.
- **"Pause"** - after the timer is started, we will display the "Pause" text for the button. It will 
have a secondary "grey" colour.
- **"Resume"** - after the user hits pause. We will allow the user to resume the timer. I'm not sure if 
we should give the button a slightly light blue colour or green. 
- To indicator resuming. But for a minimalistic design, it might seem a little too much. Love to know 
your thoughts later.
- **"Stop"** is the second button. By default, it will be hidden. It will only show when the timer is 
started. In the started and paused state, this button will still be visible. 
- Once triggered, everything will reset and the button will be hidden again. 
