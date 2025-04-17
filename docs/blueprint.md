# **App Name**: FocusFlow

## Core Features:

- Circular Progress Timer: Display a large circular progress bar that visually represents the time remaining in the current focus or break period. The gutter should be greyish and translucent, and the progress bar itself should be off-white.
- Timer Display: Display a timer in the middle of the circular progress bar, showing the time remaining in the current focus or break period.
- Timer Controls: Implement 'Start/Pause/Resume' and 'Stop' buttons to control the timer. The 'Stop' button will have a distinct red look and feel.
- Custom Time Setting: Implement a settings button at the top center that allows the user to set a custom focus time period. Calculate the break period based on the user-defined focus time (30 - focus time if focus time < 30, 60 - focus time if focus time > 30).
- Focus/Break Cycle Indicator: Create a horizontal indicator showing 4 cycles of focus/break periods. The length of the bars will be dependent on the user-specified time period (calculated by percentage). The indicator's progress will show time elapsed.

## Style Guidelines:

- Background: Dark gradient background.
- Primary UI elements: Off-white color.
- Stop Button: Red color scheme.
- Accent: Teal (#008080) for highlights and interactive elements.
- Exit icon: A door with a right arrow located at the top right.
- Center the circular progress bar and timer. Place the 'Start/Pause/Resume' and 'Stop' buttons at the bottom.
- Position the focus/break cycle indicator between the circular progress bar and the buttons below.

## Original User Request:
I want to create a simple single page web application using React/TypeScript. Do NOT use Next.js. This is a Pomodoro app with a large circular progress bar at the center, timer in the middle, and then two buttons at the bottom. One button is "Start/Pause/Resume". The second button is "Stop". The app will have a dark gradient background, and the rest of the UI will be off-white. The only exception is the "Stop Button". It will have a red look and feel. To the top right of the web page, we will have an exit icon that looks like a door with a right arrow. For our circular progress bar, the gutter will be greyish and translucent. The progress bar itself will be off-white. There should be a button at the top center that will allow the user to set a custom focus time period. If the entered focus time is under 30 minutes, the break period will be 30 - entered focus time. If the entered focus time is larger than 30, the break time will be 60 - entered focus time. Finally, between the circular progress bar and the buttons below, we will have a horizontal section that will show the focus/break period cycle (long bar for focus period, short for break). The length of the bars will be dependent on the user specific time period (calculated by percentage). The whole indicator will contain 4 cycles of focus-break time periods. While the circular progress bar is showing time left (counting down), the horizontal indicator's progress will show time elapsed (counting up). This horizontal indicator will also be split like the long-short-long-short-... bars.
  