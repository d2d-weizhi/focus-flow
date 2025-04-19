"use client";

import React from "react";
import { Button, ButtonProps } from "@progress/kendo-react-buttons";

interface KRButtonProps extends ButtonProps {
  onClickEvent ?: () => void;
}

export default function KRButton({ onClickEvent, children, ...rest }: KRButtonProps) {
  return (
    <Button onClick={onClickEvent} {...rest}>
      {children}
    </Button>
  );
}