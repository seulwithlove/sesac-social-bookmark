import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuid } from "uuid";
export { default as DummyProfile } from "@/public/profile-dummy.png";
export const DummyProfileFile = "/profile_dummy.png";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const newToken = () => uuid();

export const uniqId = (cnt = 5) =>
  Math.random()
    .toString(36)
    .substring(2, cnt + 2);

export const uniqNumId = (cnt = 5) =>
  Math.random()
    .toString(10)
    .substring(2, cnt + 2);

export const DynamicCsses = [
  "translate-x-[-20px]",
  "translate-x-[-40px]",
  "translate-x-[-60px]",
  "translate-x-[-80px]",
  "translate-x-[-100px]",
  "translate-x-[-120px]",
  "translate-x-1",
  "translate-x-1.5",
  "translate-x-2",
  "translate-x-2.5",
  "translate-x-3",
  "translate-x-3.5",
  "translate-x-4",
  "translate-x-4.5",
  "translate-x-5",
];
