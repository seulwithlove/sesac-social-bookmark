"use client";
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const THEMES = ["dark", "system", "light"] as const;
const THEME_ICONS = {
  dark: <MonitorIcon />,
  system: <SunIcon />,
  light: <MoonIcon />,
};

export default function ThemeChanger() {
  const { theme, setTheme } = useTheme();
  const [mount, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
  }, []);

  if (!mount || !theme) return <button></button>;

  const changeTheme = () => {
    const idx = THEMES.indexOf(theme as keyof typeof THEME_ICONS) + 1;
    setTheme(THEMES[idx % THEMES.length]);
  };

  return (
    <button onClick={changeTheme} className="btn-icon">
      {THEME_ICONS[theme as keyof typeof THEME_ICONS]}
    </button>
  );
}
