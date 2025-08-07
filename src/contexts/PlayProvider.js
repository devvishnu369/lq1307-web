"use client";
import { PlayProvider } from "./Play";

export function Providers({ children }) {
  return <PlayProvider>{children}</PlayProvider>;
}