"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

type CalendarProps = {
  mode?: "single" | "multiple" | "range";
  selected?: Date | Date[] | { from?: Date; to?: Date } | undefined;
  onSelect?: (date: any) => void;
  className?: string;
  captionLayout?: "buttons" | "dropdown";
  month?: Date;
  onMonthChange?: (month: Date) => void;
  modifiers?: Record<string, (date: Date) => boolean> | any;
  modifiersClassNames?: Record<string, string>;
};

export function Calendar({ mode = "single", selected, onSelect, className, captionLayout = "buttons", month, onMonthChange, modifiers, modifiersClassNames }: CalendarProps) {
  return (
    <DayPicker
      mode={mode as any}
      selected={selected as any}
      onSelect={onSelect as any}
      className={className}
      month={month}
      onMonthChange={onMonthChange}
      captionLayout={captionLayout as any}
      modifiers={modifiers}
      modifiersClassNames={modifiersClassNames}
    />
  );
}
