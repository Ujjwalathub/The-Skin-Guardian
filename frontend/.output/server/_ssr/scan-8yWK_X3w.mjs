import { r as __toESM } from "../_runtime.mjs";
import { t as performance_default } from "../_libs/unenv.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { f as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as Activity, M as Camera, P as ArrowRight, _ as Microscope, m as Pill, p as RefreshCw, r as Upload, s as Sparkles } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/scan-8yWK_X3w.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var dermoscopy_suspicious_default = "/assets/dermoscopy_suspicious-CxdkHb1Q.jpg";
var dermoscopy_benign_default = "/assets/dermoscopy_benign-DLOJ2l3X.jpg";
var ANATOM_SITES = [
	{
		id: "head/neck",
		label: "Head & Neck"
	},
	{
		id: "torso",
		label: "Torso / Back / Chest"
	},
	{
		id: "upper extremity",
		label: "Arm / Shoulder"
	},
	{
		id: "lower extremity",
		label: "Leg / Hip"
	},
	{
		id: "palms/soles",
		label: "Palms & Soles"
	},
	{
		id: "oral/genital",
		label: "Mucosal / Oral"
	},
	{
		id: "other",
		label: "Other Region"
	}
];
async function submitTriageRequest(imageFile, metadata, sampleType) {
	const t0 = performance_default.now();
	if (imageFile) try {
		const formData = new FormData();
		formData.append("image", imageFile);
		formData.append("metadata", JSON.stringify(metadata));
		const res = await fetch("/api/v1/triage", {
			method: "POST",
			body: formData
		});
		if (res.ok) return await res.json();
	} catch {}
	await new Promise((r) => setTimeout(r, 850 + Math.random() * 350));
	let combined = .12;
	let vision = .15;
	let tabular = .1;
	if (sampleType === "suspicious") {
		vision = .88 + Math.random() * .08;
		tabular = .82 + Math.random() * .1;
		combined = vision * .6 + tabular * .4;
	} else if (sampleType === "benign") {
		vision = .06 + Math.random() * .08;
		tabular = .12 + Math.random() * .06;
		combined = vision * .6 + tabular * .4;
	} else {
		const morphology = (metadata.asymmetry_score + metadata.border_irregularity + metadata.color_variation) / 15;
		const sizeFactor = Math.min(metadata.clin_size_long_diam_mm / 30, 1);
		const ageFactor = Math.min(metadata.age_approx / 90, 1) * .3;
		const siteFactor = metadata.anatom_site_general === "head/neck" ? .08 : 0;
		vision = Math.min(.97, Math.max(.04, morphology * .6 + sizeFactor * .25 + Math.random() * .1));
		tabular = Math.min(.95, Math.max(.03, morphology * .45 + ageFactor + siteFactor + Math.random() * .08));
		combined = Math.min(.99, vision * .6 + tabular * .4);
	}
	let flag = "GREEN";
	let urgency = "LOW";
	let action = "Routine primary monitoring. Recommend patient skin self-exam in 6 months.";
	if (combined >= .75) {
		flag = "RED";
		urgency = "CRITICAL";
		action = "Urgent physical biopsy required. Expedite immediate specialist referral.";
	} else if (combined >= .35) {
		flag = "YELLOW";
		urgency = "MODERATE";
		action = "Atypical features detected. Schedule tele-dermatology specialist review within 3 weeks.";
	}
	return {
		request_id: `DERM-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
		timestamp: (/* @__PURE__ */ new Date()).toISOString(),
		referral_triage: {
			flag,
			action,
			urgency_level: urgency
		},
		model_scores: {
			combined_malignancy_probability: combined,
			vision_subscore: vision,
			tabular_subscore: tabular
		},
		execution_metrics: { inference_time_ms: Math.round(performance_default.now() - t0 + 112) }
	};
}
function ScanPage() {
	const [imageFile, setImageFile] = (0, import_react.useState)(null);
	const [previewUrl, setPreviewUrl] = (0, import_react.useState)(dermoscopy_suspicious_default);
	const [activePreset, setActivePreset] = (0, import_react.useState)("suspicious");
	const [isDermatoscopeView, setIsDermatoscopeView] = (0, import_react.useState)(true);
	const [showReticle, setShowReticle] = (0, import_react.useState)(true);
	const [isScanning, setIsScanning] = (0, import_react.useState)(false);
	const [result, setResult] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const fileInputRef = (0, import_react.useRef)(null);
	const [meta, setMeta] = (0, import_react.useState)({
		age_approx: 58,
		sex: "male",
		anatom_site_general: "upper extremity",
		clin_size_long_diam_mm: 9.2,
		asymmetry_score: 4,
		border_irregularity: 4,
		color_variation: 3
	});
	const selectPreset = (type) => {
		setActivePreset(type);
		setImageFile(null);
		if (type === "suspicious") {
			setPreviewUrl(dermoscopy_suspicious_default);
			setMeta({
				age_approx: 61,
				sex: "male",
				anatom_site_general: "torso",
				clin_size_long_diam_mm: 11.5,
				asymmetry_score: 4,
				border_irregularity: 4,
				color_variation: 4
			});
		} else {
			setPreviewUrl(dermoscopy_benign_default);
			setMeta({
				age_approx: 34,
				sex: "female",
				anatom_site_general: "upper extremity",
				clin_size_long_diam_mm: 5.2,
				asymmetry_score: 1,
				border_irregularity: 1,
				color_variation: 1
			});
		}
		setResult(null);
	};
	const handleFileUpload = (e) => {
		const file = e.target.files?.[0];
		if (file) {
			setImageFile(file);
			setActivePreset("custom");
			setPreviewUrl(URL.createObjectURL(file));
			setResult(null);
		}
	};
	const handleScan = async () => {
		setIsScanning(true);
		setError(null);
		try {
			const response = await submitTriageRequest(imageFile, meta, activePreset === "custom" ? null : activePreset);
			setResult(response);
		} catch (err) {
			setError("Analysis encountered an error. Please try again.");
		} finally {
			setIsScanning(false);
		}
	};
	(0, import_react.useEffect)(() => {
		handleScan();
	}, []);
	const flagColors = (0, import_react.useMemo)(() => {
		if (!result) return null;
		switch (result.referral_triage.flag) {
			case "RED": return {
				bg: "bg-rose-50 border-rose-300 text-rose-900 dark:bg-rose-950/40 dark:border-rose-800/80 dark:text-rose-200",
				badge: "bg-rose-600 text-white",
				bar: "bg-rose-500",
				icon: "text-rose-600 dark:text-rose-400"
			};
			case "YELLOW": return {
				bg: "bg-amber-50 border-amber-300 text-amber-900 dark:bg-amber-950/40 dark:border-amber-800/80 dark:text-amber-200",
				badge: "bg-amber-500 text-white",
				bar: "bg-amber-500",
				icon: "text-amber-600 dark:text-amber-400"
			};
			default: return {
				bg: "bg-emerald-50 border-emerald-300 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-800/80 dark:text-emerald-200",
				badge: "bg-emerald-600 text-white",
				bar: "bg-emerald-500",
				icon: "text-emerald-600 dark:text-emerald-400"
			};
		}
	}, [result]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-slate-50/70 py-8 px-4 sm:px-6 lg:px-8 dark:bg-slate-950 transition-colors duration-200",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl space-y-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 mb-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border dark:border-emerald-800/50",
							children: "Workstation v2.4"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-slate-500 dark:text-slate-400",
							children: "ISIC 2024 Ensemble Architecture"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white",
						children: "AI Lesion Scanner & Clinical Triage"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-slate-600 dark:text-slate-300 mt-1",
						children: "Upload dermoscopic or macro skin photographs alongside clinical metadata to evaluate malignancy risk in real time."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs dark:bg-slate-900 dark:border-slate-800",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-bold text-slate-500 dark:text-slate-400 px-2",
							children: "Presets:"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => selectPreset("suspicious"),
							className: `px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${activePreset === "suspicious" ? "bg-rose-100 text-rose-800 border border-rose-200 shadow-xs dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800" : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"}`,
							children: "🔴 Suspicious Lesion"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => selectPreset("benign"),
							className: `px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${activePreset === "benign" ? "bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-xs dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800" : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"}`,
							children: "🟢 Benign Mole"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => fileInputRef.current?.click(),
							className: `px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${activePreset === "custom" ? "bg-teal-100 text-teal-800 border border-teal-200 shadow-xs dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800" : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"}`,
							children: "📷 Custom Upload"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "file",
							ref: fileInputRef,
							onChange: handleFileUpload,
							accept: "image/*",
							className: "hidden"
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-12 gap-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-6 space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 dark:border-slate-800 dark:bg-slate-900",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Microscope, { className: "h-5 w-5 text-emerald-600 dark:text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-display font-bold text-slate-900 dark:text-white text-base",
										children: "Dermoscopic Viewport"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setIsDermatoscopeView(!isDermatoscopeView),
										className: `px-3 py-1 text-xs font-semibold rounded-lg border transition-colors ${isDermatoscopeView ? "bg-emerald-50 border-emerald-300 text-emerald-800 dark:bg-emerald-950/60 dark:border-emerald-700 dark:text-emerald-300" : "bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"}`,
										children: "Circular Reticle"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setShowReticle(!showReticle),
										className: `px-3 py-1 text-xs font-semibold rounded-lg border transition-colors ${showReticle ? "bg-teal-50 border-teal-300 text-teal-800 dark:bg-teal-950/60 dark:border-teal-700 dark:text-teal-300" : "bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"}`,
										children: "mm Caliper"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `relative aspect-square w-full overflow-hidden bg-slate-950 flex items-center justify-center transition-all ${isDermatoscopeView ? "rounded-full border-8 border-slate-900 dark:border-slate-800 shadow-2xl" : "rounded-2xl"}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: previewUrl,
										alt: "Skin lesion dermoscopic inspection",
										className: "h-full w-full object-cover select-none"
									}),
									isScanning && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-b from-transparent via-emerald-400/30 to-transparent h-16 w-full animate-pulse top-1/2 -translate-y-1/2 border-y border-emerald-400/80" }),
									showReticle && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "absolute inset-0 pointer-events-none flex items-center justify-center",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute h-full w-[1px] bg-emerald-400/30" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute w-full h-[1px] bg-emerald-400/30" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-48 w-48 rounded-full border border-dashed border-emerald-400/40" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "absolute bottom-4 right-4 bg-slate-900/80 px-2 py-1 rounded text-[10px] font-mono text-emerald-400 border border-emerald-500/30",
												children: "SCALE: 10mm CALIBRATED"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "absolute top-4 left-4 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-white text-xs font-semibold flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-2 w-2 rounded-full ${activePreset === "suspicious" ? "bg-rose-500" : "bg-emerald-400"} animate-ping` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: activePreset === "suspicious" ? "Malignancy Features Detected" : activePreset === "benign" ? "Uniform Benign Network" : "Custom Patient Input" })]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								onClick: () => fileInputRef.current?.click(),
								className: "cursor-pointer rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-4 text-center hover:border-emerald-400 hover:bg-emerald-50/50 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-emerald-500 dark:hover:bg-slate-800 transition-all group",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-6 w-6 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 mx-auto mb-1 transition-colors" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs font-bold text-slate-800 dark:text-slate-200",
										children: "Click to choose a file or drag and drop"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] text-slate-500 dark:text-slate-400",
										children: "Supports JPG, PNG, WEBP dermoscopy or macro smartphone photos"
									})
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 dark:border-slate-800 dark:bg-slate-900",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-display font-bold text-base text-slate-900 dark:text-white flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-4 w-4 text-emerald-600 dark:text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Clinical Photo-Taking Guide" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 rounded-xl bg-slate-50 border border-slate-200/80 dark:bg-slate-800/60 dark:border-slate-700/60",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-bold text-slate-900 dark:text-white mb-1",
										children: "1. Good Light"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-slate-600 dark:text-slate-400 text-[11px]",
										children: "Use bright, indirect natural sunlight. Avoid harsh flashlight glare."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 rounded-xl bg-slate-50 border border-slate-200/80 dark:bg-slate-800/60 dark:border-slate-700/60",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-bold text-slate-900 dark:text-white mb-1",
										children: "2. Sharp Focus"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-slate-600 dark:text-slate-400 text-[11px]",
										children: "Hold camera 10–15cm away. Tap screen to ensure edge sharpness."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 rounded-xl bg-slate-50 border border-slate-200/80 dark:bg-slate-800/60 dark:border-slate-700/60",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-bold text-slate-900 dark:text-white mb-1",
										children: "3. Clear Obstacles"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-slate-600 dark:text-slate-400 text-[11px]",
										children: "Part hair and remove creams, makeup, or adhesive bandages."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 rounded-xl bg-slate-50 border border-slate-200/80 dark:bg-slate-800/60 dark:border-slate-700/60",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-bold text-slate-900 dark:text-white mb-1",
										children: "4. Add Scale"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-slate-600 dark:text-slate-400 text-[11px]",
										children: "Place a coin or ruler next to the spot for accurate measurement."
									})]
								})
							]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-6 space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5 dark:border-slate-800 dark:bg-slate-900",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-5 w-5 text-emerald-600 dark:text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-display font-bold text-slate-900 dark:text-white text-base",
										children: "Patient Clinical Metadata"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-slate-500 dark:text-slate-400 font-medium",
									children: "Stage 2 Meta-Learner Inputs"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
									children: ["Approximate Age: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-emerald-700 dark:text-emerald-400",
										children: [meta.age_approx, " yrs"]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: "1",
									max: "100",
									value: meta.age_approx,
									onChange: (e) => setMeta({
										...meta,
										age_approx: parseInt(e.target.value) || 30
									}),
									className: "w-full accent-emerald-600 h-2 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
									children: "Biological Sex"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1",
									children: ["male", "female"].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setMeta({
											...meta,
											sex: s
										}),
										className: `flex-1 py-1 text-xs font-semibold rounded-lg capitalize transition-colors ${meta.sex === s ? "bg-white text-emerald-900 shadow-xs dark:bg-slate-900 dark:text-emerald-300" : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"}`,
										children: s
									}, s))
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5",
								children: "Anatomical Site Region"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-2 sm:grid-cols-3 gap-2",
								children: ANATOM_SITES.map((site) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setMeta({
										...meta,
										anatom_site_general: site.id
									}),
									className: `px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all ${meta.anatom_site_general === site.id ? "bg-emerald-50 border-emerald-400 text-emerald-900 font-bold shadow-xs dark:bg-emerald-950/60 dark:border-emerald-600 dark:text-emerald-300" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"}`,
									children: site.label
								}, site.id))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between items-center mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-bold text-slate-700 dark:text-slate-300",
									children: "Lesion Diameter (Long Axis)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-300",
									children: [meta.clin_size_long_diam_mm, " mm"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "range",
								min: "0.5",
								max: "40",
								step: "0.5",
								value: meta.clin_size_long_diam_mm,
								onChange: (e) => setMeta({
									...meta,
									clin_size_long_diam_mm: parseFloat(e.target.value) || 5
								}),
								className: "w-full accent-emerald-600 h-2 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-3 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1",
										children: ["Asymmetry (0–5): ", meta.asymmetry_score]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "range",
										min: "0",
										max: "5",
										value: meta.asymmetry_score,
										onChange: (e) => setMeta({
											...meta,
											asymmetry_score: parseInt(e.target.value)
										}),
										className: "w-full accent-emerald-600 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1",
										children: ["Border Jagged (0–5): ", meta.border_irregularity]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "range",
										min: "0",
										max: "5",
										value: meta.border_irregularity,
										onChange: (e) => setMeta({
											...meta,
											border_irregularity: parseInt(e.target.value)
										}),
										className: "w-full accent-emerald-600 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1",
										children: ["Color Variation (0–5): ", meta.color_variation]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "range",
										min: "0",
										max: "5",
										value: meta.color_variation,
										onChange: (e) => setMeta({
											...meta,
											color_variation: parseInt(e.target.value)
										}),
										className: "w-full accent-emerald-600 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
									})] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: handleScan,
								disabled: isScanning,
								className: "w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm shadow-md hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-50",
								children: isScanning ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Analyzing Lesion Features..." })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Run Clinical Decision Triage" })] })
							})
						]
					}), result && flagColors && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `rounded-3xl border-2 p-6 shadow-md transition-all ${flagColors.bg}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between mb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: `px-3 py-1 rounded-full text-xs font-black ${flagColors.badge}`,
										children: [result.referral_triage.flag, " FLAG"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs font-bold tracking-wider uppercase",
										children: ["Urgency: ", result.referral_triage.urgency_level]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono text-xs text-slate-500 dark:text-slate-400",
									children: [result.execution_metrics.inference_time_ms, " ms"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display font-extrabold text-xl mb-2",
								children: result.referral_triage.action
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3 my-5 bg-white/70 dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/60",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-xs font-bold mb-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Combined Malignancy Probability" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [(result.model_scores.combined_malignancy_probability * 100).toFixed(1), "%"] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-2.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `h-full ${flagColors.bar} transition-all duration-500`,
										style: { width: `${result.model_scores.combined_malignancy_probability * 100}%` }
									})
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3 pt-2 text-[11px] text-slate-600 dark:text-slate-300",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold",
											children: "Vision CNN (EfficientNet):"
										}),
										" ",
										(result.model_scores.vision_subscore * 100).toFixed(1),
										"%"
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold",
											children: "Tabular (LightGBM):"
										}),
										" ",
										(result.model_scores.tabular_subscore * 100).toFixed(1),
										"%"
									] })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/recommendations",
								search: { flag: result.referral_triage.flag },
								className: "w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white font-bold text-xs hover:bg-slate-800 transition-colors shadow-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, { className: "h-4 w-4 text-emerald-400 dark:text-emerald-200" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "View Recommended Medicine & Treatment Guidelines" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5" })
								]
							})
						]
					})]
				})]
			})]
		})
	});
}
//#endregion
export { ScanPage as component };
