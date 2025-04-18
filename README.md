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

To avoid losing focus, I will explain the core features of this simple app in point form. I have also 
been using Gemini, the AI tool to assist me with building this showcase project. So everything here 
also serves as our daily recap and notes.

## Thought-process

- The app will always be at the center of the page/screen, even if the user resizes the web page.
- It will have a height of 900px, so that will be fixed.
- I want to provide the user with an option of using either a light/dark theme.
- I will integrate KendoReact into this project later into the development process.
- We will use the default material theme that comes with KendoReact. It already has both the light and 
dark mode.
- We will start building and protoyping this app without worrying about the theme or using KendoReact 
controls.
- Start by using the included tailwindcss and standard HTML input and buttons.

## (18 Apr, Fri) Today's progress & recap

- In the morning, we have started laying out the contents of the app.
- We have centered our app's main container inside the `<body></body>` tag.
- We have set the container's minWidth to 600px and maxWidth to 900px.
- We don't have to set the height because it will automatically wrap our contents.
- We have made the app container a flex-column in order to achieve a top-down layout.
- We also created a `<div />` tag as a separator between the contents for consistency.
- We have added our circular progress bar and timer. I manually set the offset so I can 
visualize the progress bar in motion when the timer starts counting down.
- I have replaced the buttons in the UI with KendoReact Buttons.
- Identified potential issues/workarounds especially when we need to toggle the colour of the "Start/Pause/Resume" button. The `themeColor={''}` prop doesn't have an option for grey background. So we will need to cater for that in our coding logic later.
- I've added the KendoReact Window control (part of the dialog library).
- I still need to replace the input field, perhaps use a NumericTextBox for 
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

Primary     : `#3f51b5` (same primary colour, no change)
Secondary   : `#D1D5DC` or `bg-gray-300` in tailwindcss
Background  : `#FAF9F6` (off-white with slight yellow tones to
              give it a more paper-like feel.)
Text        : `#141414` (slightly lighter tone of black so it 
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