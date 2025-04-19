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