"use client";

import { createRef, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { DoorOpen, CircleStop, CirclePlay, CirclePause, Timer } from "lucide-react";
import { getDeviceInformation } from "./shared/utils";
import { KRNumericTextBox, KRButton, CircularProgressBar, TimePeriodIndicators, TimePeriodType } from "./components/FFComponents";
// Dynamically import our KRWindow component.
const KRWindow = dynamic(() => import ('./components/KRWindow'), { ssr: false });

const TOTAL_CYCLES = 4;

export default function Home() {

	const [windowDimensions, setWindowDimensions] = useState({
		width: 0,
		height: 0,
	});
	
	// const [isMobile, setIsMobile] = useState(false);
	
	/**
	 * The maximum font size for the timer is 6.8rem;
	 */
	const [timerStyles, setTimerStyles] = useState({
		fontSize: "2.5rem",
	});
	
	/**
	 * >= 1600px - 1.8rem, >= 1440px - 1.65rem, >= 1280px - 1.5rem, >= 1024px - 1.25rem, >= 768px - 1.125rem
	 */
	const [btnFontSettings, setBtnFontSettings] = useState({
		fontSize: "1.125rem",
		lineHeight: "1.125rem"
	});

	const [btnIconSize, setBtnIconSize] = useState<number>(20);

	//const [deviceType, setDeviceType] = useState<DeviceTypes>(DeviceTypes.PC_LAPTOP);

  const [orientation, setOrientation] = useState<string>("unknown");

	const [showOverlay, setShowOverlay] = useState(false);

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

	function onExitClicked() {
    setShowOverlay(true);
  }

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

	function  calcFontSettings(width: number): string {
		if (width >= 1600) {
			setBtnIconSize(Math.floor(1.8 * 20));
			return "1.8rem";
		} else if (width >= 768 && width < 1600) {
			const currScaleFactor = 1.125 + (((width - 768) / (1600 - 768)) * .8);
			setBtnIconSize(Math.round(currScaleFactor * 20));
			return `${currScaleFactor}rem`;
		} else {	// Anything smaller, we can assume to be a mobile phone.
			setBtnIconSize(Math.floor(1.125 * 20));
			return "1.125rem";
		}
	}
	
	function calcTimerStyles(width: number): { fontSize: string } {
		if (width >= 1600) {
			return { fontSize: "6.8rem" };
		} else if (width >= 768 && width < 1600) {
			const currScaleFactor = 2.5 + (((width - 768) / (1600 - 768)) * 4.3);
			return { fontSize: `${currScaleFactor.toFixed(3)}rem` };
		} else {	// Anything smaller, we can assume to be a mobile phone.
			return { fontSize: "2.5rem" };
		}
	}

	useEffect(() => {
		/**
		 * Our operation for checking browser innerWidth, innerHeight, deviceType and orientation.
		 */
		const handleResize = () => {
			const resizedWidth = window.innerWidth;
			const resizedHeight = window.innerHeight;

      setWindowDimensions({
        width: resizedWidth,
        height: resizedHeight,
      });

			setBtnFontSettings({ 
				fontSize: calcFontSettings(resizedWidth),
				lineHeight: calcFontSettings(resizedWidth) 
			});
			
			setTimerStyles(calcTimerStyles(resizedWidth));
    };

		const getDeviceInfo = () => {
      if (getDeviceInformation().indexOf("landscape") != -1)
				setOrientation("landscape");
			else
				setOrientation("portrait");
		};
		
		// console.log(window.innerWidth);
		//setCpbStyles(calcCpbStyles(window.innerWidth));
		getDeviceInfo();

		window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", getDeviceInfo);

		// Get user's sessTheme and focusTime
		// const sessTheme = localStorage.getItem("sessTheme");
		
		if (isLoading) {
			setTimeout(() => {
				setBtnFontSettings({ 
					fontSize: calcFontSettings(windowDimensions.width),
					lineHeight: calcFontSettings(windowDimensions.width) 
				});
				
				setTimerStyles(calcTimerStyles(window.innerWidth));
				
				// setCpbStyles(calcCpbStyles(windowDimensions.width));
				
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

			window.removeEventListener('resize', handleResize);
			window.removeEventListener('orientationchange', getDeviceInfo);
    };

	}, [isRunning, isPaused, timeLeft, focusTime, orientation, timerStyles]);

	return (
		<div className="flex ff-main-container items-center w-full h-full"> {/* Our main app's container. */}
			<div className="flex left-panel bg-white shadow-md rounded-md items-center justify-center gap-y-8"> {/* Left Panel */}
				{/* Left Panel Content Wrapper */}
				<div className="flex flex-row items-center justify-center relative w-full xl:min-h-[400px] xl:max-h-[600px]">
					{/* Progress Circle Wrapper */}
						
						<CircularProgressBar 
							isPaused={isPaused} 
							timeLeft={timeLeft} 
							totalTime={activePeriodType === "focus" ? focusTimeInSec(focusTime) : breakTimeInSec(focusTime)}
							activePeriod={activePeriodType}
						/>
						{/* Timer display */}
						{isLoading ? (
							<div
								className="animate-pulse absolute inset-0 countdown-timer flex items-center justify-center text-5xl font-bold text-gray-500"
								id="timerDisplay"
								style={{
									fontSize: `${timerStyles.fontSize}`,
								}}
							>
								00:00
							</div>
						) : (
							<div
								className="absolute inset-0 countdown-timer flex items-center justify-center text-5xl font-bold" id="timerDisplay"
								style={{
									fontSize: `${timerStyles.fontSize}`,
								}}
							>
								{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
							</div>
						)}
				</div>
				
				<TimePeriodIndicators
					arrPeriods={periods}
					activePeriodIndex={activePeriod}
					timeElapsed={timeElapsed} />
				
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

      </div>
			
      <div className="flex right-panel mr-0 bg-white shadow-md rounded-md items-center justify-center"> {/* Right Panel */}
				{/* Right Panel Content Wrapper */}
				<div className="flex 2xl:flex-col xl:flex-row lg:flex-row md:flex-row items-center justify-center relative w-full h-full">
					{/* Button Wrapper */}
					<div className="control-buttons items-center justify-center h-full">
						{/*
							A button for the user to set their focus time in minutes.
						*/}
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
									<Timer size={btnIconSize} strokeWidth={2} />&nbsp;Set Focus Time
								</div>
						</KRButton>

						{
							!isRunning && 
							<KRButton 
								id="btnStart"
								className="kr-buttons"
								fillMode={'solid'}
								themeColor={'primary'}
								onClick={onStartClicked}
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
									<CirclePlay size={btnIconSize} strokeWidth={2} />&nbsp;Start
								</div>
							</KRButton>
						}

						{isRunning && !isPaused &&
							<KRButton 
								id="btnStart"
								className="kr-buttons"
								fillMode={'solid'}
								themeColor={'light'}
								onClick={onPauseClicked}
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
									<CirclePause size={btnIconSize} strokeWidth={2} />&nbsp;Pause
								</div>
							</KRButton>
						}

						{isRunning && isPaused &&
							<KRButton 
								id="btnStart"
								className="kr-buttons"
								fillMode={'solid'}
								themeColor={'success'}
								onClick={onResumeClicked}
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
									<CirclePlay size={btnIconSize} strokeWidth={2} />&nbsp;Resume
								</div>
							</KRButton>
						}

						<KRButton 
							id="btnStop"
							className="kr-buttons"
							fillMode={'solid'}
							themeColor={'error'}
							disabled={!isRunning}
							iconClass="h-[50%]"
							onClick={onStopClicked}
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
								<CircleStop size={btnIconSize} strokeWidth={2} />&nbsp;Stop
							</div>
						</KRButton>

						<KRButton 
							id="btnExitApp"
							className="kr-buttons"
							type="button" 
							fillMode={'solid'}
							themeColor={"light"}
							onClick={onExitClicked}
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
								<DoorOpen size={btnIconSize} strokeWidth={2} />&nbsp;End Session
							</div>
						</KRButton>

					</div>
				</div>
      </div>
			
			{/* Overlay */}
			{showOverlay && (
				<div
					className="fixed top-0 left-0 w-screen h-screen bg-[#FAF9F6] flex items-center justify-center z-50"
					style={{
						opacity: 0.95
					}}
				>
					<p className="text-lg text-gray-800 mx-6 align-middle text-center">
						Your session has ended. You may now close this tab/window.
					</p>
				</div>
			)}
		</div>
	);
}
