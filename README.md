This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

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

## Daily Progress & Recap

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


1. Progress Bar Starting Empty:
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
- Added a slight animation to the `CircularProgressBar` so it will have a "refilling" CSS animation when a time period finishes and transitions, `transition-all duration-500`.

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