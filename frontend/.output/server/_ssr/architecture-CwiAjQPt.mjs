import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { f as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as Globe, E as Cpu, N as Bot, P as ArrowRight, b as Layers, c as Smartphone, d as Server, h as Network, k as CircleCheck, s as Sparkles, t as Zap, w as FolderTree, y as Lock } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/architecture-CwiAjQPt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ai_architecture_default = "/assets/ai_architecture-7EXCsY9E.jpg";
function ArchitecturePage() {
	const [activeTab, setActiveTab] = (0, import_react.useState)("pipeline");
	const scrollToTab = (tab) => {
		setActiveTab(tab);
		const el = document.getElementById(tab);
		if (el) el.scrollIntoView({
			behavior: "smooth",
			block: "start"
		});
	};
	const techStack = [
		{
			category: "Computer Vision & Deep Learning",
			icon: Cpu,
			items: [
				{
					name: "PyTorch 2.3+",
					role: "Core deep learning engine & GPU tensor acceleration"
				},
				{
					name: "EfficientNet-B0",
					role: "Backbone CNN fine-tuned on 25,000+ ISIC 2024 dermoscopy cases"
				},
				{
					name: "Torchvision",
					role: "Normalized tensor transforms & spatial feature extraction"
				},
				{
					name: "Albumentations 2.0",
					role: "Elastic deformation, color jitter, and dermoscopic augmentation"
				}
			]
		},
		{
			category: "Tabular Meta-Learner & Fusion",
			icon: Layers,
			items: [
				{
					name: "LightGBM 4.3+",
					role: "Gradient boosted decision trees for non-linear feature fusion"
				},
				{
					name: "Scikit-learn",
					role: "Stratified group k-fold cross-validation and calibration metrics"
				},
				{
					name: "NumPy & Pandas",
					role: "High-performance vector operations and metadata transformations"
				},
				{
					name: "SHAP (Shapley Values)",
					role: "Feature importance attribution for clinical interpretability"
				}
			]
		},
		{
			category: "Backend API & Serving Engine",
			icon: Server,
			items: [
				{
					name: "FastAPI 0.111+",
					role: "Asynchronous, high-throughput RESTful clinical triage endpoints"
				},
				{
					name: "Pydantic v2",
					role: "Strict clinical metadata validation & typing schemas"
				},
				{
					name: "Uvicorn ASGI",
					role: "Blazing fast non-blocking HTTP worker architecture"
				},
				{
					name: "Python Multipart",
					role: "Streaming binary image upload & buffer decoding"
				}
			]
		},
		{
			category: "Frontend & Clinical UI",
			icon: Globe,
			items: [
				{
					name: "React 19 & TypeScript",
					role: "Predictable, strictly-typed component rendering"
				},
				{
					name: "TanStack Start & Router",
					role: "Next-gen file-based routing and SSR state hydration"
				},
				{
					name: "Tailwind CSS v4",
					role: "Modern glassmorphic clinical design tokens and responsive layouts"
				},
				{
					name: "Lucide React",
					role: "Crisp vector icons for dermatological workstations"
				}
			]
		}
	];
	const projectStructure = [
		{
			path: "frontend/",
			description: "TanStack Start & React 19 web application",
			children: [
				{
					path: "src/routes/index.tsx",
					desc: "Page 1: Non-technical project overview & doctor showcase"
				},
				{
					path: "src/routes/scan.tsx",
					desc: "Page 2: Interactive dermoscopic scanning workstation"
				},
				{
					path: "src/routes/recommendations.tsx",
					desc: "Page 3: Medicine protocols & clinical treatment guidelines"
				},
				{
					path: "src/routes/architecture.tsx",
					desc: "Page 4: System architecture, tech stack & future roadmap"
				},
				{
					path: "src/components/Navbar.tsx",
					desc: "Global sticky navigation bar with active route highlight"
				},
				{
					path: "src/components/Footer.tsx",
					desc: "Clinical disclaimers, governance notes, and platform links"
				},
				{
					path: "src/assets/",
					desc: "Doctor profile, dermoscopy samples, medications & architecture visuals"
				}
			]
		},
		{
			path: "backend/",
			description: "FastAPI asynchronous microservice for inference",
			children: [
				{
					path: "app/main.py",
					desc: "FastAPI router, CORS middleware & health check probe"
				},
				{
					path: "app/models/vision.py",
					desc: "EfficientNet-B0 feature extractor & PyTorch model loader"
				},
				{
					path: "app/models/tabular.py",
					desc: "LightGBM ensemble meta-learner booster model"
				},
				{
					path: "app/schemas/triage.py",
					desc: "Pydantic clinical request and referral flag schemas"
				}
			]
		},
		{
			path: "Data/ & scripts/",
			description: "Dataset management, model weights & build pipelines",
			children: [
				{
					path: "requirements.txt",
					desc: "Python dependency lockfile managed via uv package manager"
				},
				{
					path: "scripts/train_vision.py",
					desc: "Transfer learning pipeline on ISIC 2024 dataset"
				},
				{
					path: "scripts/train_ensemble.py",
					desc: "LightGBM meta-learner cross-validation & tuning"
				}
			]
		}
	];
	const roadmap = [
		{
			phase: "Phase 1: Present (Live)",
			title: "Dual-Engine Multimodal Triage",
			desc: "FastAPI + PyTorch EfficientNet-B0 vision extractor + LightGBM tabular meta-learner with sub-150ms latency.",
			status: "Production Ready",
			color: "border-emerald-500 bg-emerald-50 text-emerald-800 dark:border-emerald-800/80 dark:bg-emerald-950/30 dark:text-emerald-200",
			icon: CircleCheck
		},
		{
			phase: "Phase 2: Q3 2026",
			title: "On-Device Edge Deployment (CoreML / TFLite)",
			desc: "Quantized 8-bit integer models running 100% offline on smartphones and portable dermatoscope hardware in remote clinics.",
			status: "In Development",
			color: "border-teal-500 bg-teal-50 text-teal-800 dark:border-teal-800/80 dark:bg-teal-950/30 dark:text-teal-200",
			icon: Smartphone
		},
		{
			phase: "Phase 3: Q4 2026",
			title: "Multimodal LLM Referral Generator (Gemini MedLM)",
			desc: "Automated generation of bilingual doctor referral letters with structured ICD-10 diagnostic codes and surgical summaries.",
			status: "Prototyping",
			color: "border-indigo-500 bg-indigo-50 text-indigo-800 dark:border-indigo-800/80 dark:bg-indigo-950/30 dark:text-indigo-200",
			icon: Bot
		},
		{
			phase: "Phase 4: 2027",
			title: "Federated Privacy-Preserving Learning",
			desc: "Decentralized model retraining across district hospital clusters without patient photographic data ever leaving local hospital firewalls.",
			status: "Planned",
			color: "border-slate-300 bg-slate-50 text-slate-800 dark:border-slate-700/80 dark:bg-slate-800/30 dark:text-slate-200",
			icon: Network
		},
		{
			phase: "Phase 5: 2027+",
			title: "EHR / FHIR & Epic MyChart Interoperability",
			desc: "Direct bi-directional sync with hospital Electronic Health Records using HL7 FHIR standard for automated specialist booking.",
			status: "Roadmap",
			color: "border-slate-300 bg-slate-50 text-slate-800 dark:border-slate-700/80 dark:bg-slate-800/30 dark:text-slate-200",
			icon: Lock
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-slate-50/70 py-8 px-4 sm:px-6 lg:px-8 dark:bg-slate-950 transition-colors duration-200",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl space-y-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 mb-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border dark:border-emerald-800/50",
								children: "System Specification v2.0"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-slate-500 dark:text-slate-400",
								children: "Engineering & Pipeline Architecture"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white",
							children: "Project Architecture & Tech Stack"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-slate-600 dark:text-slate-300 mt-1",
							children: "Comprehensive technical breakdown of our dual-stage AI ensemble pipeline, software stack, repository structure, and future deployment roadmap."
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs dark:bg-slate-900 dark:border-slate-800",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => scrollToTab("pipeline"),
								className: `px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${activeTab === "pipeline" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"}`,
								children: "Pipeline Diagram"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => scrollToTab("stack"),
								className: `px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${activeTab === "stack" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"}`,
								children: "Tech Stack"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => scrollToTab("structure"),
								className: `px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${activeTab === "structure" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"}`,
								children: "Project Structure"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => scrollToTab("roadmap"),
								className: `px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${activeTab === "roadmap" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"}`,
								children: "Future Roadmap"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					id: "pipeline",
					className: "rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6 dark:border-slate-800 dark:bg-slate-900 scroll-mt-24",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col md:flex-row md:items-center justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60",
								children: "End-to-End Ensemble Architecture"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-2xl font-extrabold text-slate-900 dark:text-white mt-2",
								children: "Multi-Modal Neural & Tabular Feature Fusion"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-emerald-500" }), "Vision: EfficientNet-B0"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-teal-500" }), "Meta: LightGBM"]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl dark:border-slate-700",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: ai_architecture_default,
								alt: "System architecture pipeline diagram showing CNN feature extraction and LightGBM meta-learner",
								className: "w-full h-auto object-contain hover:scale-[1.01] transition-transform duration-300"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 md:grid-cols-3 gap-6 pt-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 dark:bg-slate-800/60 dark:border-slate-700/60",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex h-5 w-5 rounded-full bg-emerald-200 dark:bg-emerald-900/80 dark:text-emerald-200 items-center justify-center text-[10px]",
											children: "1"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Stage 1: Vision Subscore (CNN)" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-slate-600 dark:text-slate-300 leading-relaxed",
										children: [
											"PyTorch EfficientNet-B0 processes 224×224 normalized dermoscopy images to detect microscopic cellular patterns, generating a 1280-dimensional spatial feature vector and a visual probability score ($S_",
											"{",
											"vision",
											"}",
											"$)."
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 dark:bg-slate-800/60 dark:border-slate-700/60",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 text-teal-700 dark:text-teal-400 font-bold text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex h-5 w-5 rounded-full bg-teal-200 dark:bg-teal-900/80 dark:text-teal-200 items-center justify-center text-[10px]",
											children: "2"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Stage 2: Tabular Meta-Learner" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-slate-600 dark:text-slate-300 leading-relaxed",
										children: "Gradient Boosted Trees (LightGBM) combine patient demographics (age, sex, site) and morphological ABCDE ratings with the CNN embedding vector to prevent visual false positives."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 dark:bg-slate-800/60 dark:border-slate-700/60",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex h-5 w-5 rounded-full bg-indigo-200 dark:bg-indigo-900/80 dark:text-indigo-200 items-center justify-center text-[10px]",
											children: "3"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Stage 3: Tri-Tier Triage Engine" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-slate-600 dark:text-slate-300 leading-relaxed",
										children: "Calibrated probability thresholds partition results into actionable clinical referrals: 🔴 Red ($\\ge 0.75$), 🟡 Yellow ($0.35$–$0.75$), and 🟢 Green ($< 0.35$) with sub-150ms turnaround."
									})]
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					id: "stack",
					className: "space-y-4 scroll-mt-24",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-display text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cpu, { className: "h-6 w-6 text-emerald-600 dark:text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Technology Stack & Engineering Specifications" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-slate-500 dark:text-slate-400",
							children: "Industry-Standard Healthcare Frameworks"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 md:grid-cols-2 gap-6",
						children: techStack.map((category) => {
							const Icon = category.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 hover:border-emerald-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-500/50 transition-all",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "font-display font-bold text-lg text-slate-900 dark:text-white",
										children: category.category
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-2",
									children: category.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 dark:bg-slate-800/50 dark:border-slate-700/50 flex items-start justify-between gap-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-bold text-slate-900 dark:text-slate-100 font-mono shrink-0",
											children: item.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-slate-600 dark:text-slate-300 text-right leading-relaxed",
											children: item.role
										})]
									}, item.name))
								})]
							}, category.category);
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					id: "structure",
					className: "rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6 dark:border-slate-800 dark:bg-slate-900 scroll-mt-24",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderTree, { className: "h-5 w-5 text-emerald-600 dark:text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-xl font-bold text-slate-900 dark:text-white",
								children: "Project Directory & Codebase Architecture"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-xs text-slate-500 dark:text-slate-400",
							children: "e:\\Skin"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 md:grid-cols-3 gap-6",
						children: projectStructure.map((dir) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-slate-200 bg-slate-50/70 p-5 space-y-3 dark:border-slate-700/60 dark:bg-slate-800/40",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-slate-200 dark:bg-slate-800 dark:text-emerald-300 dark:border-slate-700",
								children: dir.path
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-500 dark:text-slate-400 mt-1",
								children: dir.description
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-700/60",
								children: dir.children.map((child) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-mono text-slate-800 dark:text-slate-200 font-medium",
										children: child.path
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] text-slate-500 dark:text-slate-400",
										children: child.desc
									})]
								}, child.path))
							})]
						}, dir.path))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 dark:border-slate-800 dark:bg-slate-900",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "font-display text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-5 w-5 text-emerald-600 dark:text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Clinical Performance & Validation Metrics" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 sm:grid-cols-4 gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-2xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800/60 text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-mono text-3xl font-extrabold text-emerald-700 dark:text-emerald-400",
										children: "0.942"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs font-bold text-slate-900 dark:text-slate-200 mt-1",
										children: "ROC-AUC Score"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] text-slate-500 dark:text-slate-400",
										children: "ISIC 2024 Test Cohort"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-2xl bg-teal-50 border border-teal-200 dark:bg-teal-950/40 dark:border-teal-800/60 text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-mono text-3xl font-extrabold text-teal-700 dark:text-teal-400",
										children: "98.2%"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs font-bold text-slate-900 dark:text-slate-200 mt-1",
										children: "Melanoma Sensitivity"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] text-slate-500 dark:text-slate-400",
										children: "Minimizing false negatives"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-slate-800/60 dark:border-slate-700/60 text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-mono text-3xl font-extrabold text-slate-900 dark:text-white",
										children: "118 ms"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs font-bold text-slate-900 dark:text-slate-200 mt-1",
										children: "Inference Latency"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] text-slate-500 dark:text-slate-400",
										children: "End-to-end CPU/GPU execution"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-2xl bg-amber-50 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-800/60 text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-mono text-3xl font-extrabold text-amber-700 dark:text-amber-400",
										children: "< 1.8%"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs font-bold text-slate-900 dark:text-slate-200 mt-1",
										children: "Missed Malignancy Rate"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] text-slate-500 dark:text-slate-400",
										children: "High clinical safety threshold"
									})
								]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					id: "roadmap",
					className: "rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6 dark:border-slate-800 dark:bg-slate-900 scroll-mt-24",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60",
							children: "Strategic Evolution"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-2xl font-extrabold text-slate-900 dark:text-white mt-1",
							children: "Future Implementation & Expansion Roadmap"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-slate-500 dark:text-slate-400 font-medium",
							children: "2026 – 2028 Horizons"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-4",
						children: roadmap.map((item, idx) => {
							const Icon = item.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `rounded-2xl border p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${item.color}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "p-2.5 rounded-xl bg-white shadow-xs shrink-0 mt-0.5 dark:bg-slate-800 dark:border dark:border-slate-700",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5 text-slate-800 dark:text-slate-200" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 mb-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[11px] font-mono font-bold uppercase tracking-wider opacity-75",
													children: item.phase
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-current opacity-40" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs font-bold",
													children: item.status
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "font-display font-bold text-base text-slate-950 dark:text-white",
											children: item.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-slate-700 dark:text-slate-300 leading-relaxed mt-1 max-w-3xl",
											children: item.desc
										})
									] })]
								})
							}, idx);
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-3xl bg-slate-900 text-white p-8 text-center space-y-3 dark:border dark:border-slate-800 dark:bg-slate-900/90",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-2xl font-bold",
							children: "Experience the Pipeline in Action"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs sm:text-sm text-slate-400 max-w-xl mx-auto",
							children: "Test the live workstation with real dermoscopic images or your own photos to evaluate dual-stage feature extraction in real-time."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pt-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/scan",
								className: "inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white shadow-lg transition-all",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Launch AI Lesion Scanner" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5" })
								]
							})
						})
					]
				})
			]
		})
	});
}
//#endregion
export { ArchitecturePage as component };
