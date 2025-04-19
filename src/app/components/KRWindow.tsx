"use client";

import { Window, WindowProps } from "@progress/kendo-react-dialogs";

export default function KRWindow({ children, ...rest }: WindowProps) {
  return (
    <Window {...rest}>
      {children}
    </Window>
  );
}