import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import {
  Stethoscope,
  Scan,
  Pill,
  Cpu,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";
import projectLogo from "@/assets/images.jpg";
import { useTheme } from "@/hooks/use-theme";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    {
      to: "/",
      label: "Project Overview",
      description: "About the mission & clinical scope",
      icon: Stethoscope,
    },
    {
      to: "/scan",
      label: "AI Lesion Scanner",
      description: "Interactive triage & dermoscopy",
      icon: Scan,
    },
    {
      to: "/recommendations",
      label: "Medicine & Care",
      description: "Clinical guidelines & prescriptions",
      icon: Pill,
    },
    {
      to: "/architecture",
      label: "System Architecture",
      description: "Tech stack & ML ensemble pipeline",
      icon: Cpu,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-950/10 bg-white/90 backdrop-blur-md transition-colors duration-200 shadow-xs dark:bg-slate-900/90 dark:border-slate-800">
      <div className="flex h-18 w-full items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-10">
        {/* Brand placed at extreme left */}
        <Link to="/" className="flex items-center gap-3 sm:gap-3.5 group select-none transition-opacity hover:opacity-95">
          <div className="relative flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-white border border-emerald-500/25 shadow-xs p-1.5 ring-1 ring-emerald-500/10 dark:bg-slate-800 dark:border-emerald-500/40 dark:ring-emerald-500/20 group-hover:shadow-md group-hover:border-emerald-500/40 group-hover:scale-105 transition-all shrink-0">
            <img
              src={projectLogo}
              alt="Derm-Referral AI Logo"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <span className="font-display text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
                Derm-Referral <span className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">AI</span>
              </span>
              <span className="inline-flex items-center rounded-md bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 text-[10px] font-bold text-emerald-700 uppercase tracking-wider shadow-2xs dark:bg-emerald-950/60 dark:border-emerald-700/60 dark:text-emerald-300">
                Clinical CDSS
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 tracking-normal hidden sm:block mt-0.5">
              Two-Stage AI Skin Lesion Triage Platform
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/60 dark:bg-slate-800/80 dark:border-slate-700/60">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.to === "/"
                ? currentPath === "/"
                : currentPath.startsWith(item.to);

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-white text-emerald-800 shadow-xs border border-emerald-900/10 dark:bg-slate-900 dark:text-emerald-400 dark:border-slate-700"
                    : "text-slate-600 hover:text-emerald-700 hover:bg-white/60 dark:text-slate-300 dark:hover:text-emerald-400 dark:hover:bg-slate-700/60"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Compact Stacked Status + Theme Toggle */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Stacked ISIC Status Badge: Light text below dark text to save horizontal space */}
          <div className="flex items-center gap-2.5 px-3 py-1 rounded-xl bg-emerald-50/80 border border-emerald-200/80 shadow-2xs dark:bg-emerald-950/40 dark:border-emerald-800/60">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <div className="flex flex-col text-left leading-tight">
              <span className="text-[11px] font-bold tracking-tight text-emerald-950 dark:text-emerald-100">
                ISIC 2024
              </span>
              <span className="text-[9.5px] font-medium text-emerald-700/90 dark:text-emerald-400">
                Dual-Stage Ensemble
              </span>
            </div>
          </div>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle light and dark theme"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-white/90 text-slate-600 shadow-2xs hover:bg-slate-100 hover:text-emerald-600 dark:border-slate-700 dark:bg-slate-800/90 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-emerald-400 transition-all cursor-pointer"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-amber-400 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="h-4 w-4 text-slate-600 transition-transform hover:-rotate-12" />
            )}
          </button>
        </div>

        {/* Mobile menu trigger + theme toggle */}
        <div className="flex items-center gap-1.5 lg:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            title={theme === "dark" ? "Light Mode" : "Dark Mode"}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-slate-600" />
            )}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150 dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center justify-between px-1 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">ISIC 2024 Dual-Stage Ensemble</span>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              {theme === "dark" ? <Sun className="h-3.5 w-3.5 text-amber-400" /> : <Moon className="h-3.5 w-3.5" />}
              <span>{theme === "dark" ? "Light" : "Dark"}</span>
            </button>
          </div>

          <div className="grid gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.to === "/"
                  ? currentPath === "/"
                  : currentPath.startsWith(item.to);

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-start gap-3 p-3 rounded-xl text-sm transition-all ${
                    isActive
                      ? "bg-emerald-50 text-emerald-900 font-semibold border border-emerald-200/60 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-800/60"
                      : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      isActive
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{item.label}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{item.description}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
