"use client";

import { createRef, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { DoorOpen } from "lucide-react";
import { playSmIcon, pauseSmIcon, stopSmIcon } from '@progress/kendo-svg-icons';
import { KRNumericTextBox, KRButton, CircularProgressBar } from "./components/FFComponents";
// Dynamically import our KRWindow component.
const KRWindow = dynamic(() => import ('./components/KRWindow'), { ssr: false });

const TOTAL_CYCLES = 4;

export default function Home() {
	/**
	 * @description - Indicates whether or not the user has started a new Focus session, 
	 * 								or when the session has resumed.
	 * @type {boolean}
	 * @default {false}
	 */
	const [isRunning, setIsRunning] = useState<boolean>(false);

	/**
	 * @description - Indicates whether or not the user has hit pause.
	 * @type {boolean}
	 * @default {false}
	 */
	const [isPaused, setIsPaused] = useState<boolean>(false);

	/**
	 * @description - The amount of focus time period in minutes. This is the 
	 * 								user-friendly version. The maximum value is 60 (minutes), 
	 * 								and the minimum is 10 (minutes).
	 * @type {number}
	 * @default {25}
	 */
	const [focusTime, setFocusTime] = useState<number>(25);

	/**
	 * @description - Amount of focus time period in seconds. Used for internal
	 * 								calculations and application logic.
	 * @type {number}
	 * @default {25 * 60}
	 */
	const [timeLeft, setTimeLeft] = useState<number>(25 * 60);

	/**
	 * @description - Indicates if the current time period if a Focus or Break period.
	 * @type {string} - "focus" | "focus"
	 * @default {"focus"} - The app will always start with the first "focus" period.
	 */
	const [activePeriod, setActivePeriod] = useState<"focus" | "break">("focus");

	/**
	 * @description - Indicates if the current cycle the timer is in.
	 * @type {number}
	 * @default {1} - The app will always start in the first cycle (1 of 4).
	 */
	const [currCycle, setCurrCycle] = useState<number>(1);

	/**
	 * @description - By default, this app will start in a light material theme.
	 * @type {string} - Possible values are "light" | "dark"
	 * @default {"light"}
	 */
	// const [sessTheme, setSessTheme] = useState<string>("light");

	/**
	 * @description - A flag value for toggling our Window dialog.
	 * @type {boolean}
	 * @default {false}
	 */
	const [isShowWindow, setIsShowWindow] = useState<boolean>(false);

	const timer = useRef<NodeJS.Timeout | null>(null);
	const focusTimeRef = createRef<HTMLInputElement>();

	/**
	 * @description - We need to calculate the breakTime in seconds so that we can pass it to the timeLeft state 
	 * 								variable.
	 * @param focusTime - Time for each focus period.
	 * @returns {number} - Total number of seconds for the break period.
	 */
	const breakTimeInSec = (focusTime: number) => {
		return focusTime < 30 
			? (30 - focusTime) * 60		// focusTime < 30 minutes, break will be (30 - focusTime) * 60 seconds.
			: (60 - focusTime) * 60;	// focusTime < 60 minutes, break will be (60 - focusTime) * 60 seconds.
	};

	const focusTimeInSec = (focusTime: number) => {
		return focusTime * 60;
	};

	// Calculate minutes and seconds
	const minutes = Math.floor(timeLeft / 60);
	const seconds = timeLeft % 60;

	/**
	 * 1 cycle = 1 focus period + 1 break period
	 */
	const periods = [
		{ periodType: "focus", duration: focusTimeInSec(focusTime) },
		{ periodType: "break", duration: breakTimeInSec(focusTime) },
		{ periodType: "focus", duration: focusTimeInSec(focusTime) },
		{ periodType: "break", duration: breakTimeInSec(focusTime) },
		{ periodType: "focus", duration: focusTimeInSec(focusTime) },
		{ periodType: "break", duration: breakTimeInSec(focusTime) },
		{ periodType: "focus", duration: focusTimeInSec(focusTime) },
		{ periodType: "break", duration: breakTimeInSec(focusTime) }
	];

	function onSetFocusTimeClicked() {
		setIsShowWindow(true);
	}

	function onSaveFocusTimeClicked() {
		setFocusTime(parseInt(focusTimeRef.current!.value));
		setTimeLeft(focusTimeInSec(parseInt(focusTimeRef.current!.value)));
		setIsShowWindow(false);
	}

	function onCloseFocusTimeWindow() {
		setIsShowWindow(false);
	}

	function onStartClicked() {
		setIsRunning(true);
	}

	function onPauseClicked() {
		setIsPaused(true);
	}

	function onResumeClicked() {
		setIsPaused(false);
	}

	function onStopClicked() {
		appReset();
	}

	function appReset() {
		setIsRunning(false);
		setIsPaused(false);
		/** 
		 * TODO: When the timer is stopped, we should reset the following:
		 * 	- reset timeLeft state value.
		 *  - reset the currentCycle state value.
		 *  - reset the countdown timer value.
		 *  - reset the circular progress bar.
		 *  - reset the time period/time elapsed indicator bar
		 */ 

		setTimeLeft(focusTimeInSec(focusTime)); // Reset to initial focus time
		setActivePeriod('focus');
		setCurrCycle(1); 
		// ... (And clear the timeout if it's active)
		clearTimeout(timer.current!); 
	}

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
				setTimeLeft(breakTimeInSec(focusTime));
			} else if (activePeriod === 'break' && currCycle < TOTAL_CYCLES) {
				setActivePeriod('focus');
				setCurrCycle(prevCycle => prevCycle + 1);
				setTimeLeft(focusTimeInSec(focusTime));
			} else {
				appReset();
			}
		}

	}, [isRunning, isPaused, timeLeft, focusTime]);

	return (
		<div className="relative h-screen w-screen flex items-center justify-center">
			{/* Exit Button */}
			<KRButton 
				id="btnExitApp"
				type="button" 
				fillMode={'outline'}
				style={{ position: 'absolute', top: '1rem', right: '1rem' }}
			>
				<DoorOpen stroke="#141414" strokeWidth={1.5} />
			</KRButton>
			
			{/*
				Our Pomodoro Time and controls will be placed inside the container below.
				Always remember, when we want to layout items vertically inside a container,
				we need to use flex-col.
			*/}
			<div
				className="flex flex-col items-center justify-center rounded-lg shadow-md p-8 mx-8 my-16 w-600"
				style={{ maxWidth: "600px", backgroundColor: "#FAF9F6" }}
			>
				{/*
					Our app container will have a min-height of 500px, and max-height of 700px.
					This is to ensure that it will still look good on screens with smaller height dimensions.
				*/}
				
				{/*
					A button for the user to set their focus time in minutes.
				*/}
				<KRButton
					id="btnSetFocusTime"
					fillMode={"outline"}
					onClick={onSetFocusTimeClicked}
				>
					Set Focus Time
				</KRButton>
				
				{/* We will use a <div /> to act as a spacer between our content items. This helps to maintain a consistent layout. */}
				<div className="w-full h-6" />
				
				{/*
					A modal dialog/window for the user to set their focus time in minutes.
					We will later replace this with a KendoReact Dialog component.
				*/}
				{
					isShowWindow && 
					<KRWindow 
						id="winFocusTime" 
						resizable={false}
						onClose={onCloseFocusTimeWindow}
						title={'Set Focus Time'} 
						initialHeight={200} 
						className="flex flex-col">
						<form className="k-form">
							<fieldset>
								<KRNumericTextBox 
									defaultValue={focusTime} 
									max={60} 
									min={10} 
									placeholder="Minutes" 
									ref={focusTimeRef}
									id="tbFocusTimeMin" 
									className="w-full" 
								/>
							</fieldset>
							<div className="flex w-full justify-center mt-4">
								<KRButton 
									id="btnSaveFocusTime"
									type="submit" 
									fillMode={'solid'} 
									themeColor={'secondary'} 
									className="mr-4"
									onClick={onSaveFocusTimeClicked}
								>
									Save Time
								</KRButton>
								<KRButton 
									type="button"
									onClick={onCloseFocusTimeWindow}
								>
									Cancel
								</KRButton>
							</div>
						</form>
					</KRWindow>
				}
				
				<div className="flex flex-col items-center justify-center relative w-full h-full">
					{/* Progress Circle Wrapper */}
					<CircularProgressBar 
						isPaused={isPaused} 
						timeLeft={timeLeft} 
						totalTime={activePeriod === "focus" ? focusTimeInSec(focusTime) : breakTimeInSec(focusTime)}
						activePeriod={activePeriod}	
					/>
					{/* Timer display */}
					<div className="absolute inset-0 flex items-center justify-center text-5xl font-bold" id="timerDisplay">
						{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
					</div>
				</div>

				<div className="w-full h-6" /> {/* Separator */}
				
				{/* 
					Time Period Indicators 
						- These are a set of long-short bars to depict our Focus and Break 
							times.
						- We will turn this into a dynamic section when we put in the 
							coding logic.
						- I've set the width to 80% because it will look more natural.
						- The height has been set to h-1.5, which is 6px 
							(1rem * 1.5 * 0.25 = 6px)
						- This indicators will consist of the gutters (translucent) and 
							their corresponding indicators (opaque off-white).
				*/}
				<div className="flex w-[80%] max-w-[350px] h-1.5">
					{periods.map((period, index) => (
						<div 
							key={index} // Always add a unique key when rendering with .map()
							className={`h-full rounded-full ${
								period.periodType === 'focus' ? 'bg-gray-300 w-1/4' : 'bg-gray-300 w-1/8'
							} ${
								index !== 0 && 'ml-2'
							}`} 
							style={{ opacity: 0.4 }} 
						>
							<div 
								className="period-indicator h-1.5 rounded-full" // Add a class for styling
								style={{ 
									width: '0%', // Initial width of 0% 
									backgroundColor: '#454545',
									opacity: 1.0
								}} />
						</div>
					))}
				</div>
				
				<div className="w-full h-6" /> {/* Separator */}

				{/* Control Buttons */}
				<div className="flex items-center justify-center space-x-4"> 
					{
						!isRunning && 
						<KRButton 
							id="btnStart"
							fillMode={'solid'}
							themeColor={'primary'}
							svgIcon={playSmIcon}
							onClick={onStartClicked}
						>
							Start
						</KRButton>
					}

					{isRunning && !isPaused &&
						<KRButton 
							id="btnStart"
							fillMode={'solid'}
							themeColor={'light'}
							svgIcon={pauseSmIcon}
							onClick={onPauseClicked}
						>
							Pause
						</KRButton>
					}

					{isRunning && isPaused &&
						<KRButton 
							id="btnStart"
							fillMode={'solid'}
							themeColor={'success'}
							svgIcon={playSmIcon}
							onClick={onResumeClicked}
						>
							Resume
						</KRButton>
					}

					<KRButton 
						id="btnStop"
						fillMode={'solid'}
						themeColor={'error'}
						disabled={!isRunning}
						svgIcon={stopSmIcon}
						onClick={onStopClicked}
					>
						Stop
					</KRButton>
				</div>
			</div>
		</div>
	);
}
