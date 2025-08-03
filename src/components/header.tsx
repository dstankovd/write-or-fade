"use client";

import React from "react";
import { ThemeToggle } from "./theme-toggle";

export interface HeaderProps {
  left?: React.ReactNode[];
  right?: React.ReactNode[];
}

export function HeaderStat({
  label,
  value,
}: {
  label?: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-1 text-foreground text-sm">
      {label && <span className="text-muted-foreground">{label}</span>}
      <span className="font-bold text-foreground">{value}</span>
    </div>
  );
}

export function Header({ left, right }: HeaderProps) {
  return (
    <header className="absolute top-6 left-6 right-6 flex items-center z-10 justify-between">
      {left && left.length > 0 ? (
        <div className="rounded-2xl px-4 py-3 border flex items-center gap-4">
          {left?.map((item, index) => (
            <React.Fragment key={index}>{item}</React.Fragment>
          ))}
        </div>
      ) : (
        <div />
      )}
      <div className="flex items-center gap-4">
        {right && right.length > 0 ? (
          <div className="flex items-center gap-6">
            {right?.map((item, index) => (
              <React.Fragment key={index}>{item}</React.Fragment>
            ))}
          </div>
        ) : (
          <div />
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}
