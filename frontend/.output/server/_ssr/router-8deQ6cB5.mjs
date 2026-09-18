import { n as __exportAll, r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react, t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { a as useRouterState, c as Outlet, d as createRootRouteWithContext, f as Link, i as HeadContent, l as lazyRouteComponent, p as useRouter, r as Scripts, s as createRouter, u as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as Cpu, a as Sun, f as Scan, g as Moon, i as TriangleAlert, m as Pill, n as X, o as Stethoscope, v as Menu, x as Heart } from "../_libs/lucide-react.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-8deQ6cB5.js
var router_8deQ6cB5_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-DsO2lpIc.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	window.__lovableReportRuntimeError?.({
		message,
		stack: error instanceof Error ? error.stack : void 0,
		filename: window.location.pathname
	});
}
var images_default = "/assets/images-C9KIwR-q.jpg";
function useTheme() {
	const [theme, setTheme] = (0, import_react.useState)(() => {
		if (typeof window === "undefined") return "light";
		try {
			const saved = localStorage.getItem("theme");
			if (saved === "light" || saved === "dark") return saved;
			return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
		} catch {
			return "light";
		}
	});
	(0, import_react.useEffect)(() => {
		const root = document.documentElement;
		if (theme === "dark") root.classList.add("dark");
		else root.classList.remove("dark");
		try {
			localStorage.setItem("theme", theme);
		} catch {}
	}, [theme]);
	const toggleTheme = () => {
		setTheme((prev) => prev === "dark" ? "light" : "dark");
	};
	return {
		theme,
		setTheme,
		toggleTheme,
		isDark: theme === "dark"
	};
}
function Navbar() {
	const [mobileOpen, setMobileOpen] = (0, import_react.useState)(false);
	const currentPath = useRouterState().location.pathname;
	const { theme, toggleTheme } = useTheme();
	const navLinks = [
		{
			to: "/",
			label: "Project Overview",
			description: "About the mission & clinical scope",
			icon: Stethoscope
		},
		{
			to: "/scan",
			label: "AI Lesion Scanner",
			description: "Interactive triage & dermoscopy",
			icon: Scan
		},
		{
			to: "/recommendations",
			label: "Medicine & Care",
			description: "Clinical guidelines & prescriptions",
			icon: Pill
		},
		{
			to: "/architecture",
			label: "System Architecture",
			description: "Tech stack & ML ensemble pipeline",
			icon: Cpu
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-50 w-full border-b border-emerald-950/10 bg-white/90 backdrop-blur-md transition-colors duration-200 shadow-xs dark:bg-slate-900/90 dark:border-slate-800",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-18 w-full items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-3 sm:gap-3.5 group select-none transition-opacity hover:opacity-95",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-white border border-emerald-500/25 shadow-xs p-1.5 ring-1 ring-emerald-500/10 dark:bg-slate-800 dark:border-emerald-500/40 dark:ring-emerald-500/20 group-hover:shadow-md group-hover:border-emerald-500/40 group-hover:scale-105 transition-all shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: images_default,
							alt: "Derm-Referral AI Logo",
							className: "h-full w-full object-contain"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col justify-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 sm:gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-display text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white leading-none",
								children: ["Derm-Referral ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent",
									children: "AI"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "inline-flex items-center rounded-md bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 text-[10px] font-bold text-emerald-700 uppercase tracking-wider shadow-2xs dark:bg-emerald-950/60 dark:border-emerald-700/60 dark:text-emerald-300",
								children: "Clinical CDSS"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] font-medium text-slate-500 dark:text-slate-400 tracking-normal hidden sm:block mt-0.5",
							children: "Two-Stage AI Skin Lesion Triage Platform"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "hidden lg:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/60 dark:bg-slate-800/80 dark:border-slate-700/60",
					children: navLinks.map((item) => {
						const Icon = item.icon;
						const isActive = item.to === "/" ? currentPath === "/" : currentPath.startsWith(item.to);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							className: `relative flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${isActive ? "bg-white text-emerald-800 shadow-xs border border-emerald-900/10 dark:bg-slate-900 dark:text-emerald-400 dark:border-slate-700" : "text-slate-600 hover:text-emerald-700 hover:bg-white/60 dark:text-slate-300 dark:hover:text-emerald-400 dark:hover:bg-slate-700/60"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `h-3.5 w-3.5 ${isActive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-400"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.label })]
						}, item.to);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden sm:flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5 px-3 py-1 rounded-xl bg-emerald-50/80 border border-emerald-200/80 shadow-2xs dark:bg-emerald-950/40 dark:border-emerald-800/60",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "relative flex h-2 w-2 shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex rounded-full h-2 w-2 bg-emerald-500" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col text-left leading-tight",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-bold tracking-tight text-emerald-950 dark:text-emerald-100",
								children: "ISIC 2024"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[9.5px] font-medium text-emerald-700/90 dark:text-emerald-400",
								children: "Dual-Stage Ensemble"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: toggleTheme,
						"aria-label": "Toggle light and dark theme",
						className: "flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-white/90 text-slate-600 shadow-2xs hover:bg-slate-100 hover:text-emerald-600 dark:border-slate-700 dark:bg-slate-800/90 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-emerald-400 transition-all cursor-pointer",
						title: theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode",
						children: theme === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "h-4 w-4 text-amber-400 transition-transform hover:rotate-45" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "h-4 w-4 text-slate-600 transition-transform hover:-rotate-12" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 lg:hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: toggleTheme,
						"aria-label": "Toggle theme",
						className: "p-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors",
						title: theme === "dark" ? "Light Mode" : "Dark Mode",
						children: theme === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "h-4 w-4 text-amber-400" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "h-4 w-4 text-slate-600" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setMobileOpen(!mobileOpen),
						className: "p-2 rounded-xl text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors",
						"aria-label": "Toggle navigation",
						children: mobileOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-6 w-6" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-6 w-6" })
					})]
				})
			]
		}), mobileOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150 dark:bg-slate-900 dark:border-slate-800",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between px-1 pb-2 border-b border-slate-100 dark:border-slate-800",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "relative flex h-2 w-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex rounded-full h-2 w-2 bg-emerald-500" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-bold text-slate-800 dark:text-slate-200",
						children: "ISIC 2024 Dual-Stage Ensemble"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: toggleTheme,
					className: "flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
					children: [theme === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "h-3.5 w-3.5 text-amber-400" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: theme === "dark" ? "Light" : "Dark" })]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-1",
				children: navLinks.map((item) => {
					const Icon = item.icon;
					const isActive = item.to === "/" ? currentPath === "/" : currentPath.startsWith(item.to);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: item.to,
						onClick: () => setMobileOpen(false),
						className: `flex items-start gap-3 p-3 rounded-xl text-sm transition-all ${isActive ? "bg-emerald-50 text-emerald-900 font-semibold border border-emerald-200/60 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-800/60" : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `p-2 rounded-lg ${isActive ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-semibold",
							children: item.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-slate-500 dark:text-slate-400",
							children: item.description
						})] })]
					}, item.to);
				})
			})]
		})]
	});
}
function Footer() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "border-t border-slate-200 bg-slate-50/80 text-slate-600 transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-400",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 md:grid-cols-4 gap-8 mb-12",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "md:col-span-2 space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-emerald-500/20 p-1 shadow-xs ring-1 ring-emerald-500/10 dark:bg-slate-800 dark:border-emerald-500/40",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: images_default,
											alt: "Derm-Referral AI Logo",
											className: "h-full w-full object-contain"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-display text-lg font-bold text-emerald-950 dark:text-white",
										children: ["Derm-Referral ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent",
											children: "AI"
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-slate-600 dark:text-slate-400 max-w-md leading-relaxed",
									children: "Clinical decision support system engineered to bridge frontline healthcare workers with specialist tele-dermatologists. Combining PyTorch EfficientNet-B0 vision features with LightGBM tabular meta-learning for fast, calibrated tri-tier risk stratification."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block h-2 w-2 rounded-full bg-emerald-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ISIC 2024 International Skin Imaging Collaboration Standard" })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3",
							children: "Core Modules"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "space-y-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/",
									className: "hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors",
									children: "Project Overview & Mission"
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/scan",
									className: "hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors",
									children: "AI Lesion Scanner & Workstation"
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/recommendations",
									className: "hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors",
									children: "Medicine & Clinical Guidelines"
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/architecture",
									className: "hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors",
									children: "System Architecture & Tech Stack"
								}) })
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3",
							children: "Clinical Governance"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "space-y-2 text-sm text-slate-500 dark:text-slate-400",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Tri-Tier Referral Engine (Red/Yellow/Green)" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "ABCDE Dermoscopic Standard" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Tele-Dermatology District Protocol" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Emergency Oncological Escalation" })
							]
						})] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200 flex items-start gap-3 mb-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "leading-relaxed",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Investigational Medical Device / Decision Support Notice:" }), " Derm-Referral AI is an adjunctive clinical decision support software designed to assist licensed clinicians and healthcare staff in triaging skin lesions. It is not intended as a standalone diagnostic tool nor does it replace histopathological biopsy or physical evaluation by a board-certified dermatologist."]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-t border-slate-200/80 dark:border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						"© ",
						(/* @__PURE__ */ new Date()).getFullYear(),
						" Derm-Referral AI Platform. Engineered for Global Tele-Dermatology."
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1 text-slate-400 dark:text-slate-500",
							children: ["Powered by PyTorch & LightGBM ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "h-3 w-3 text-red-500 fill-red-500 inline" })]
						})
					})]
				})
			]
		})
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$4 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Derm-Referral AI | Skin Lesion Triage Platform" },
			{
				name: "description",
				content: "Two-Stage AI Skin Lesion Triage & Clinical Decision Support System"
			},
			{
				name: "author",
				content: "Derm-Referral AI"
			},
			{
				property: "og:title",
				content: "Derm-Referral AI | Skin Lesion Triage Platform"
			},
			{
				property: "og:description",
				content: "Two-Stage AI Skin Lesion Triage & Clinical Decision Support System"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: ""
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("head", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", { dangerouslySetInnerHTML: { __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var isDark = theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch(e) {}
              })();
            ` } })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$4.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-screen flex-col bg-slate-50/50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
			]
		})
	});
}
var $$splitComponentImporter$3 = () => import("./routes-DzkrsMFT.mjs");
var Route$3 = createFileRoute("/")({
	head: () => ({ meta: [{ title: "Derm-Referral AI — Clinical Decision Support for Skin Lesions" }, {
		name: "description",
		content: "Derm-Referral AI helps clinics and patients spot suspicious skin lesions early with dual-stage AI triage, fast-tracking urgent cases to dermatologists."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./architecture-CwiAjQPt.mjs");
var Route$2 = createFileRoute("/architecture")({
	head: () => ({ meta: [{ title: "System Architecture, Tech Stack & Roadmap — Derm-Referral AI" }, {
		name: "description",
		content: "Complete technical architecture, two-stage deep learning pipeline (EfficientNet + LightGBM), project file structure, and future deployment roadmap."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./recommendations-bJDYnJaI.mjs");
var Route$1 = createFileRoute("/recommendations")({
	head: () => ({ meta: [{ title: "Clinical Medicine & Treatment Recommendations — Derm-Referral AI" }, {
		name: "description",
		content: "Evidence-based medication guidelines, prescription topicals, wound care protocols, and specialist action plans based on skin lesion triage severity."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./scan-8yWK_X3w.mjs");
var Route = createFileRoute("/scan")({
	head: () => ({ meta: [{ title: "AI Lesion Scanner & Triage Workstation — Derm-Referral AI" }, {
		name: "description",
		content: "Scan and analyze skin lesions using deep learning vision and clinical metadata. Instant tri-tier referral guidance for melanoma and skin cancer risk."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var rootRouteChildren = {
	IndexRoute: Route$3.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$4
	}),
	ArchitectureRoute: Route$2.update({
		id: "/architecture",
		path: "/architecture",
		getParentRoute: () => Route$4
	}),
	RecommendationsRoute: Route$1.update({
		id: "/recommendations",
		path: "/recommendations",
		getParentRoute: () => Route$4
	}),
	ScanRoute: Route.update({
		id: "/scan",
		path: "/scan",
		getParentRoute: () => Route$4
	})
};
var routeTree = Route$4._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter, router_8deQ6cB5_exports as t };
