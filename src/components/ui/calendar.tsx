"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { type DayPickerProps } from "react-day-picker";
import { cn } from "@/lib/utils";
import "react-day-picker/dist/style.css";

export type CalendarProps = DayPickerProps;

export function Calendar({ className, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays
      className={cn("rounded-md border bg-white p-3 shadow", className)}
      {...props}
    />
  );
}