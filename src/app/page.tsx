"use client";

import { createRef, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { playSmIcon, pauseSmIcon, stopSmIcon } from '@progress/kendo-svg-icons';
import { DeviceTypes, getDeviceInformation } from "./shared/utils";
import { KRNumericTextBox, KRButton, CircularProgressBar, TimePeriodIndicators, TimePeriodType } from "./components/FFComponents";
// Dynamically import our KRWindow component.
const KRWindow = dynamic(() => import ('./components/KRWindow'), { ssr: false });

const TOTAL_CYCLES = 4;

export default function Home() {

	const [windowDimensions, setWindowDimensions] = useState({
			width: 0,
			height: 0,
		});

	const [deviceType, setDeviceType] = useState<DeviceTypes>(DeviceTypes.PC_LAPTOP);

  const [orientation, setOrientation] = useState<string>("unknown");

	/**
	 * @description - our countdown timer needs time to load.
	 * @type {boolean}
	 * @default {true}
	 */
	const [isLoading, setIsLoading] = useState<boolean>(true);

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
	 * @default {25}
	 */
	const [timeLeft, setTimeLeft] = useState<number>(25 * 60);

	/**
	 * @description - Indicating how much time has passed since the start of a time period.
	 * @type {number}
	 * @default {0} - We always start with 0 seconds.
	 */
	const [timeElapsed, setTimeElapsed] = useState(0);

	/**
	 * @description - Indicates if the current time period if a Focus or Break period.
	 * @type {string} - "focus" | "focus"
	 * @default {"focus"} - The app will always start with the first "focus" period.
	 */
	const [activePeriodType, setActivePeriodType] = useState<"focus" | "break">("focus");

	/**
	 * @description - indicates which time period is currently active. It also 
	 * 								corresponds with the index of the periods array.
	 * @type {number} - 0 to 7 (8 time periods)
	 * @default {0} - Index of array always begins with 0.
	 */
	const [activePeriod, setActivePeriod] = useState<number>(0);

	/**
	 * @description - Indicates if the current cycle the timer is in.
	 * @type {number}
	 * @default {1} - The app will always start in the first cycle (1 of 4).
	 */
	const [currCycle, setCurrCycle] = useState<number>(1);

	/**
	 * @description - A flag value for toggling our Window dialog.
	 * @type {boolean}
	 * @default {false}
	 */
	const [isShowWindow, setIsShowWindow] = useState<boolean>(false);

	const timerId = useRef<NodeJS.Timeout | null>(null);
	const focusTimeRef = createRef<HTMLInputElement>();
  // const periodStartTimeRef = useRef<number | null>(null);

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
	const periods : TimePeriodType[] = [
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
		localStorage.setItem("userFocusTime", focusTimeRef.current!.value);
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
		setActivePeriodType('focus');
		setActivePeriod(0);
		setCurrCycle(1); 
		setTimeElapsed(0);
		// ... (And clear the timeout if it's active)
		clearTimeout(timerId.current!); 
	}

	useEffect(() => {
		/**
		 * Our operation for checking browser innerWidth, innerHeight, deviceType and orientation.
		 */
		const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize(); 

		const getDeviceInfo = () => {
      getDeviceInformation().then(({ deviceType, orientation }) => {
        if (deviceType == DeviceTypes.MOBILE_PHONE) {
          setDeviceType(deviceType)
        } else if ((orientation.indexOf("landscape") != -1 && window.innerWidth < 1600) ||
          (orientation.indexOf("portrait") != -1 && window.innerWidth > 400)) {
          setDeviceType(DeviceTypes.TABLET);
        } else {
					window.addEventListener('resize', handleResize);
				}

				if (orientation.indexOf("landscape") != -1)
        	setOrientation("landscape");
				else
					setOrientation("portrait");
      }); 
    };

		getDeviceInfo();
    

    window.addEventListener("orientationchange", getDeviceInfo);

		// Get user's sessTheme and focusTime
		// const sessTheme = localStorage.getItem("sessTheme");
		
		if (isLoading) {
			setTimeout(() => {
				setFocusTime(parseInt(localStorage.getItem("userFocusTime")!));
				setTimeLeft(focusTimeInSec(parseInt(localStorage.getItem("userFocusTime")!)));
				setIsLoading(false);
			}, 3000);
		}

		// The user has started the clock, and it's not paused.
		if (isRunning && !isPaused && timeLeft > 0) {
			timerId.current = setTimeout(() => {
				setTimeLeft((prevTime) => prevTime - 1);
				setTimeElapsed(timeElapsed => timeElapsed + 1); // Update elapsed time
			}, 1000);
		} else if (timerId.current) {
      clearTimeout(timerId.current);
      timerId.current = null;
    }

		// Handle cycle or timer completion
		if (timeLeft == 0) {
			if (activePeriodType === 'focus') {
				setActivePeriodType('break');
				setTimeLeft(breakTimeInSec(focusTime));

				// Increment activePeriod if not the last break period
				if (activePeriod < periods.length - 1) {
					setActivePeriod(activePeriod + 1); 
					setTimeElapsed(0);	// Reset with each period switch.
				}
			} else if (activePeriodType === 'break' && currCycle < TOTAL_CYCLES) {
				setActivePeriodType('focus');
				setCurrCycle(prevCycle => prevCycle + 1);
				setTimeLeft(focusTimeInSec(focusTime));

				// Increment activePeriod unless it's the very last period
				if (activePeriod < periods.length - 1) {
					setActivePeriod(activePeriod + 1);
					setTimeElapsed(0);	// Reset with each period switch.
				} 
			} else {
				appReset();
			}
		}

		// Cleanup function to clear the timeout when the effect runs again
    return () => {
      if (timerId.current !== null) {
        clearTimeout(timerId.current);
      }
			
			if (deviceType === DeviceTypes.PC_LAPTOP) {
				window.removeEventListener('resize', handleResize);
			}
			
			window.removeEventListener('orientationchange', getDeviceInfo);
    };

	}, [isRunning, isPaused, timeLeft, focusTime, orientation]);

	return (
			<div
				className="flex flex-col items-center justify-center rounded-lg shadow-md p-[2.5%] mx-8 my-[2%]"
				style={{
					backgroundColor: "#FAF9F6",
					height: `${deviceType === DeviceTypes.TABLET 
						? .8 * windowDimensions.height 
						: deviceType ==  DeviceTypes.MOBILE_PHONE
							? .6 * windowDimensions.height
							: .7 * windowDimensions.height
					}px`,
					width: `${deviceType === DeviceTypes.TABLET
						? .6 * windowDimensions.width
						: deviceType == DeviceTypes.MOBILE_PHONE
							? .8 * windowDimensions.width
							: .7 * windowDimensions.width
					}px`
				}}
			>
					{/*
					Our Pomodoro Time and controls will be placed inside this container.
					Always remember, when we want to layout items vertically inside a container,
					we need to use flex-col.

					Our app container will have a maxWidth of 600px. Height will wrap around contents.
				*/}
				
				{/*
					A button for the user to set their focus time in minutes.
				*/}
				<KRButton
					id="btnSetFocusTime"
					fillMode={"outline"}
					onClick={onSetFocusTimeClicked}
					className="kr-buttons"
					style={{
						width: "300px",
						height: "100px",
						borderRadius: "8px",
					}}
				>
					Set Focus Time
				</KRButton>
				
				{/* We will use a <div /> to act as a spacer between our content items. This helps to maintain a consistent layout. */}
				<div className="w-full h-[5%]" />
				
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
									style={{
										fontSize: "1rem",
										fontWeight: "400",
										fontFamily: "Roboto",
										letterSpacing: "1px"
									}}
								/>
							</fieldset>
							<div className="flex w-full justify-center mt-4">
								<KRButton 
									id="btnSaveFocusTime"
									type="submit" 
									fillMode={'solid'} 
									themeColor={'secondary'} 
									className="kr-buttons mr-4"
									onClick={onSaveFocusTimeClicked}
								>
									Save Time
								</KRButton>
								<KRButton 
									type="button"
									className="kr-buttons"
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
						totalTime={activePeriodType === "focus" ? focusTimeInSec(focusTime) : breakTimeInSec(focusTime)}
						activePeriod={activePeriodType}	
					/>
					{/* Timer display */}
					{isLoading ? (
						<div className="animate-pulse absolute inset-0 countdown-timer flex items-center justify-center text-5xl font-bold text-gray-500" id="timerDisplay">
							00:00
						</div>
					) : (
						<div className="absolute inset-0 countdown-timer flex items-center justify-center text-5xl font-bold" id="timerDisplay">
							{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
						</div>
					)}
					
				</div>

				<div className="w-full h-[5%]" /> {/* Separator */}
				
				<TimePeriodIndicators 
					arrPeriods={periods} 
					activePeriodIndex={activePeriod} 
					timeElapsed={timeElapsed} />
				
				<div className="w-full h-[8%]" /> {/* Separator */}

				{/* Control Buttons */}
				<div className="flex items-center justify-center space-x-[5%]"> 
					{
						!isRunning && 
						<KRButton 
							id="btnStart"
							className="kr-buttons"
							fillMode={'solid'}
							themeColor={'primary'}
							svgIcon={playSmIcon}
							onClick={onStartClicked}
							style={{
								width: "200px",
								height: "70px",
								borderRadius: "8px",
							}}
						>
							Start
						</KRButton>
					}

					{isRunning && !isPaused &&
						<KRButton 
							id="btnStart"
							className="kr-buttons"
							fillMode={'solid'}
							themeColor={'light'}
							svgIcon={pauseSmIcon}
							onClick={onPauseClicked}
							style={{
								width: "200px",
								height: "70px",
								borderRadius: "8px",
							}}
						>
							Pause
						</KRButton>
					}

					{isRunning && isPaused &&
						<KRButton 
							id="btnStart"
							className="kr-buttons"
							fillMode={'solid'}
							themeColor={'success'}
							svgIcon={playSmIcon}
							onClick={onResumeClicked}
							style={{
								width: "200px",
								height: "70px",
								borderRadius: "8px",
							}}
						>
							Resume
						</KRButton>
					}

					<KRButton 
						id="btnStop"
						className="kr-buttons"
						fillMode={'solid'}
						themeColor={'error'}
						disabled={!isRunning}
						svgIcon={stopSmIcon}
						onClick={onStopClicked}
						style={{
							width: "200px",
							height: "70px",
							borderRadius: "8px",
						}}
					>
						Stop
					</KRButton>
				</div>

			</div>
	);
}
