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
    <div className="w-[75%] max-w-[300px] aspect-square">
			<svg className="w-full h-full" viewBox="0 0 100 100">
				<circle cx="50" cy="50" r="45" stroke="#D1D5DC" strokeWidth="10" style={{ opacity: 0.4 }} fill="none" />
				<circle
					cx="50"
					cy="50"
					r="45"
					stroke={activePeriod === "focus" ? "#3f51b5" : "#F59E0B"}
					strokeWidth="10"
					fill="none"
					strokeDasharray="283"
					strokeDashoffset={strokeDashoffset}
					style={{ 
            transform: 'rotate(-90deg)', 
            transformOrigin: '50% 50%',
            animationDuration: `${timeLeft}s`, // Use timeLeft here
          }}
          className={`circular-progress ${isPaused ? 'paused' : ''}`}
				/>
			</svg>
		</div>
  );
}