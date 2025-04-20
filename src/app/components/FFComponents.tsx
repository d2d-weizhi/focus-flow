"use client";

import React, { forwardRef, ComponentPropsWithoutRef } from "react";
import { NumericTextBox } from "@progress/kendo-react-inputs";
import { Button, ButtonProps } from "@progress/kendo-react-buttons";
import { Window, WindowProps } from "@progress/kendo-react-dialogs";

interface KRButtonProps extends ButtonProps {
  onClickEvent ?: () => void;
}

interface KRNumericTextBoxProps extends ComponentPropsWithoutRef<typeof NumericTextBox> {
  placeholder?: string;
}

interface CircularProgressBarProps {
  isPaused: boolean;
  timeLeft: number;     // This is in seconds, taken from the timeLeft state variable.
  totalTime: number;
  activePeriod: "focus" | "break";
}

interface TimePeriodType {
  periodType: "focus" | "break";
  duration: number;
}

export type { TimePeriodType };

interface TimePeriodIndicatorsProps {
  arrPeriods: TimePeriodType[];
  activePeriodIndex: number;
  timeElapsed: number;
}

/* 
  Must be careful when disabling linting. Should only do it when we are aware of the potential 
  type implications. In this situation, we know exactly what we will be passing, so this is still 
  acceptable.
*/
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const KRNumericTextBox = forwardRef<any, KRNumericTextBoxProps>(
  ({ ...rest }, ref) => {
    return <NumericTextBox ref={ref} {...rest} />; 
  }
);

// ESLint has an issue when the component doesn't have a displayName.
KRNumericTextBox.displayName = "KRNumericTextBox";

export { KRNumericTextBox };

export function KRButton({ onClickEvent, children, ...rest }: KRButtonProps) {
  return (
    <Button onClick={onClickEvent} {...rest}>
      {children}
    </Button>
  );
}

export function KRWindow({ children, ...rest }: WindowProps) {
  return (
    <Window {...rest}>
      {children}
    </Window>
  );
}

export function CircularProgressBar({ isPaused, timeLeft, totalTime, activePeriod }: CircularProgressBarProps) {
  const progressPercent = 100 - (timeLeft / totalTime) * 100;
  const strokeDashoffset = (283 * progressPercent) / 100;
  
  return (
    <div className="w-[75%] max-w-[300px] aspect-square relative">
      {/* Shadow Element */}
      <div className="absolute inset-0 rounded-full bg-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)] -z-10" />
			<svg className="w-full h-full" viewBox="0 0 100 100">
				{/* Conic Gradient for Stroke */}
        <defs> {/* Define the gradient within the circle element */}
          {/* Focus Gradient */}
          <linearGradient id="focusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="100%" stopColor="#2563eb" /> {/* Slightly lighter shade of focus */}
            <stop offset="0%" stopColor="#3f51b5" /> {/* Main focus color */}
          </linearGradient>

          {/* Break Gradient */}
          <linearGradient id="breakGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="100%" stopColor="#facc15" /> {/* Slightly lighter shade of break */}
            <stop offset="0%" stopColor="#F59E0B" /> {/* Main break color */}
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="45" stroke="#D1D5DC" strokeWidth="10" style={{ opacity: 0.4 }} fill="none" />
        <circle
					cx="50"
					cy="50"
					r="45"
					stroke={`url(#${activePeriod === 'focus' ? 'focusGradient' : 'breakGradient'})`}
					strokeWidth="10"
					fill="none"
					strokeDasharray="283"
					strokeDashoffset={strokeDashoffset}
					style={{ 
            transform: 'rotate(-90deg)', 
            transformOrigin: '50% 50%',
            animationDuration: `${timeLeft}s`, // Use timeLeft here
            zIndex: 10,
          }}
          className={`shadow-md circular-progress ${isPaused ? 'paused' : ''} transition-all duration-500`}
				/>
			</svg>
		</div>
  );
}

/* 
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
*/
export function TimePeriodIndicators({ arrPeriods, activePeriodIndex, timeElapsed }: TimePeriodIndicatorsProps) {
  return (
    <div className="flex w-[80%] max-w-[350px] h-1.5">
      {arrPeriods.map((period, index) => {
        // 1. Determine if this is the active period
        const isActive = index === activePeriodIndex;

        // 2. Calculate percentage for active period, 100% for others
        const percentage = isActive 
          ? (timeElapsed / period.duration) * 100 // Use period.duration directly
          : (index < activePeriodIndex ? 100 : 0); 

        return (
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
                width: `${percentage}%`, // Initial width of 0% 
                backgroundColor: '#454545',
                opacity: 1.0
              }} 
            />
          </div>
        );
      })}
    </div>
  );
}