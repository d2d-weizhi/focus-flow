"use client";

import React, { forwardRef, ComponentPropsWithoutRef } from "react";
import { NumericTextBox } from "@progress/kendo-react-inputs";
import { Button, ButtonProps } from "@progress/kendo-react-buttons";
import { Window, WindowProps } from "@progress/kendo-react-dialogs";

interface KRButtonProps extends ButtonProps {
  onClickEvent ?: () => void;
}

interface KRNumericTextBoxProps extends ComponentPropsWithoutRef<any> {
  // ... any other custom props you might need for KRNumericTextBox
}

const KRNumericTextBox = forwardRef<any, KRNumericTextBoxProps>(
  ({ ...rest }, ref) => {
    return <NumericTextBox ref={ref} {...rest} />; 
  }
);

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