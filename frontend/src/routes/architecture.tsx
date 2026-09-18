import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Cpu,
  Layers,
  Database,
  GitBranch,
  Terminal,
  Zap,
  FolderTree,
  FileCode,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Server,
  Globe,
  Radio,
  FileText,
  Lock,
  Smartphone,
  Bot,
  Network,
} from "lucide-react";

import architectureDiagramImg from "@/assets/ai_architecture.jpg";

export const Route = createFileRoute("/architecture")({
  head: () => ({
    meta: [
      { title: "System Architecture, Tech Stack & Roadmap — Derm-Referral AI" },
      {
        name: "description",
        content:
          "Complete technical architecture, two-stage deep learning pipeline (EfficientNet + LightGBM), project file structure, and future deployment roadmap.",
      },
    ],
  }),
  component: ArchitecturePage,
});

function ArchitecturePage() {
  const [activeTab, setActiveTab] = useState<"pipeline" | "stack" | "structure" | "roadmap">("pipeline");

  const scrollToTab = (tab: "pipeline" | "stack" | "structure" | "roadmap") => {
    setActiveTab(tab);
    const el = document.getElementById(tab);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const techStack = [
    {
      category: "Computer Vision & Deep Learning",
      icon: Cpu,
      items: [
        { name: "PyTorch 2.3+", role: "Core deep learning engine & GPU tensor acceleration" },
        { name: "EfficientNet-B0", role: "Backbone CNN fine-tuned on 25,000+ ISIC 2024 dermoscopy cases" },
        { name: "Torchvision", role: "Normalized tensor transforms & spatial feature extraction" },
        { name: "Albumentations 2.0", role: "Elastic deformation, color jitter, and dermoscopic augmentation" },
      ],
    },
    {
      category: "Tabular Meta-Learner & Fusion",
      icon: Layers,
      items: [
        { name: "LightGBM 4.3+", role: "Gradient boosted decision trees for non-linear feature fusion" },
        { name: "Scikit-learn", role: "Stratified group k-fold cross-validation and calibration metrics" },
        { name: "NumPy & Pandas", role: "High-performance vector operations and metadata transformations" },
        { name: "SHAP (Shapley Values)", role: "Feature importance attribution for clinical interpretability" },
      ],
    },
    {
      category: "Backend API & Serving Engine",
      icon: Server,
      items: [
        { name: "FastAPI 0.111+", role: "Asynchronous, high-throughput RESTful clinical triage endpoints" },
        { name: "Pydantic v2", role: "Strict clinical metadata validation & typing schemas" },
        { name: "Uvicorn ASGI", role: "Blazing fast non-blocking HTTP worker architecture" },
        { name: "Python Multipart", role: "Streaming binary image upload & buffer decoding" },
      ],
    },
    {
      category: "Frontend & Clinical UI",
      icon: Globe,
      items: [
        { name: "React 19 & TypeScript", role: "Predictable, strictly-typed component rendering" },
        { name: "TanStack Start & Router", role: "Next-gen file-based routing and SSR state hydration" },
        { name: "Tailwind CSS v4", role: "Modern glassmorphic clinical design tokens and responsive layouts" },
        { name: "Lucide React", role: "Crisp vector icons for dermatological workstations" },
      ],
    },
  ];

  const projectStructure = [
    {
      path: "frontend/",
      description: "TanStack Start & React 19 web application",
      children: [
        { path: "src/routes/index.tsx", desc: "Page 1: Non-technical project overview & doctor showcase" },
        { path: "src/routes/scan.tsx", desc: "Page 2: Interactive dermoscopic scanning workstation" },
        { path: "src/routes/recommendations.tsx", desc: "Page 3: Medicine protocols & clinical treatment guidelines" },
        { path: "src/routes/architecture.tsx", desc: "Page 4: System architecture, tech stack & future roadmap" },
        { path: "src/components/Navbar.tsx", desc: "Global sticky navigation bar with active route highlight" },
        { path: "src/components/Footer.tsx", desc: "Clinical disclaimers, governance notes, and platform links" },
        { path: "src/assets/", desc: "Doctor profile, dermoscopy samples, medications & architecture visuals" },
      ],
    },
    {
      path: "backend/",
      description: "FastAPI asynchronous microservice for inference",
      children: [
        { path: "app/main.py", desc: "FastAPI router, CORS middleware & health check probe" },
        { path: "app/models/vision.py", desc: "EfficientNet-B0 feature extractor & PyTorch model loader" },
        { path: "app/models/tabular.py", desc: "LightGBM ensemble meta-learner booster model" },
        { path: "app/schemas/triage.py", desc: "Pydantic clinical request and referral flag schemas" },
      ],
    },
    {
      path: "Data/ & scripts/",
      description: "Dataset management, model weights & build pipelines",
      children: [
        { path: "requirements.txt", desc: "Python dependency lockfile managed via uv package manager" },
        { path: "scripts/train_vision.py", desc: "Transfer learning pipeline on ISIC 2024 dataset" },
        { path: "scripts/train_ensemble.py", desc: "LightGBM meta-learner cross-validation & tuning" },
      ],
    },
  ];

  const roadmap = [
    {
      phase: "Phase 1: Present (Live)",
      title: "Dual-Engine Multimodal Triage",
      desc: "FastAPI + PyTorch EfficientNet-B0 vision extractor + LightGBM tabular meta-learner with sub-150ms latency.",
      status: "Production Ready",
      color: "border-emerald-500 bg-emerald-50 text-emerald-800 dark:border-emerald-800/80 dark:bg-emerald-950/30 dark:text-emerald-200",
      icon: CheckCircle2,
    },
    {
      phase: "Phase 2: Q3 2026",
      title: "On-Device Edge Deployment (CoreML / TFLite)",
      desc: "Quantized 8-bit integer models running 100% offline on smartphones and portable dermatoscope hardware in remote clinics.",
      status: "In Development",
      color: "border-teal-500 bg-teal-50 text-teal-800 dark:border-teal-800/80 dark:bg-teal-950/30 dark:text-teal-200",
      icon: Smartphone,
    },
    {
      phase: "Phase 3: Q4 2026",
      title: "Multimodal LLM Referral Generator (Gemini MedLM)",
      desc: "Automated generation of bilingual doctor referral letters with structured ICD-10 diagnostic codes and surgical summaries.",
      status: "Prototyping",
      color: "border-indigo-500 bg-indigo-50 text-indigo-800 dark:border-indigo-800/80 dark:bg-indigo-950/30 dark:text-indigo-200",
      icon: Bot,
    },
    {
      phase: "Phase 4: 2027",
      title: "Federated Privacy-Preserving Learning",
      desc: "Decentralized model retraining across district hospital clusters without patient photographic data ever leaving local hospital firewalls.",
      status: "Planned",
      color: "border-slate-300 bg-slate-50 text-slate-800 dark:border-slate-700/80 dark:bg-slate-800/30 dark:text-slate-200",
      icon: Network,
    },
    {
      phase: "Phase 5: 2027+",
      title: "EHR / FHIR & Epic MyChart Interoperability",
      desc: "Direct bi-directional sync with hospital Electronic Health Records using HL7 FHIR standard for automated specialist booking.",
      status: "Roadmap",
      color: "border-slate-300 bg-slate-50 text-slate-800 dark:border-slate-700/80 dark:bg-slate-800/30 dark:text-slate-200",
      icon: Lock,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/70 py-8 px-4 sm:px-6 lg:px-8 dark:bg-slate-950 transition-colors duration-200">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border dark:border-emerald-800/50">
                System Specification v2.0
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Engineering & Pipeline Architecture</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Project Architecture & Tech Stack
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              Comprehensive technical breakdown of our dual-stage AI ensemble pipeline, software
              stack, repository structure, and future deployment roadmap.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs dark:bg-slate-900 dark:border-slate-800">
            <button
              onClick={() => scrollToTab("pipeline")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "pipeline"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              }`}
            >
              Pipeline Diagram
            </button>
            <button
              onClick={() => scrollToTab("stack")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "stack"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              }`}
            >
              Tech Stack
            </button>
            <button
              onClick={() => scrollToTab("structure")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "structure"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              }`}
            >
              Project Structure
            </button>
            <button
              onClick={() => scrollToTab("roadmap")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "roadmap"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              }`}
            >
              Future Roadmap
            </button>
          </div>
        </div>

        {/* Section 1: Visual Architecture Pipeline Diagram */}
        <div id="pipeline" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6 dark:border-slate-800 dark:bg-slate-900 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60">
                End-to-End Ensemble Architecture
              </span>
              <h2 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
                Multi-Modal Neural & Tabular Feature Fusion
              </h2>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Vision: EfficientNet-B0
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-teal-500" />
                Meta: LightGBM
              </span>
            </div>
          </div>

          {/* High-Resolution Diagram Showcase */}
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl dark:border-slate-700">
            <img
              src={architectureDiagramImg}
              alt="System architecture pipeline diagram showing CNN feature extraction and LightGBM meta-learner"
              className="w-full h-auto object-contain hover:scale-[1.01] transition-transform duration-300"
            />
          </div>

          {/* Step-by-Step Flow Explanation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 dark:bg-slate-800/60 dark:border-slate-700/60">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                <span className="flex h-5 w-5 rounded-full bg-emerald-200 dark:bg-emerald-900/80 dark:text-emerald-200 items-center justify-center text-[10px]">
                  1
                </span>
                <span>Stage 1: Vision Subscore (CNN)</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                PyTorch EfficientNet-B0 processes 224×224 normalized dermoscopy images to detect
                microscopic cellular patterns, generating a 1280-dimensional spatial feature vector
                and a visual probability score ($S_{'{'}vision{'}'}$).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 dark:bg-slate-800/60 dark:border-slate-700/60">
              <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 font-bold text-xs">
                <span className="flex h-5 w-5 rounded-full bg-teal-200 dark:bg-teal-900/80 dark:text-teal-200 items-center justify-center text-[10px]">
                  2
                </span>
                <span>Stage 2: Tabular Meta-Learner</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Gradient Boosted Trees (LightGBM) combine patient demographics (age, sex, site) and
                morphological ABCDE ratings with the CNN embedding vector to prevent visual false positives.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 dark:bg-slate-800/60 dark:border-slate-700/60">
              <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold text-xs">
                <span className="flex h-5 w-5 rounded-full bg-indigo-200 dark:bg-indigo-900/80 dark:text-indigo-200 items-center justify-center text-[10px]">
                  3
                </span>
                <span>Stage 3: Tri-Tier Triage Engine</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Calibrated probability thresholds partition results into actionable clinical referrals:
                🔴 Red ($\ge 0.75$), 🟡 Yellow ($0.35$–$0.75$), and 🟢 Green ($&lt; 0.35$) with sub-150ms turnaround.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Complete Tech Stack */}
        <div id="stack" className="space-y-4 scroll-mt-24">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              <span>Technology Stack & Engineering Specifications</span>
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">Industry-Standard Healthcare Frameworks</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {techStack.map((category) => {
              const Icon = category.icon;
              return (
                <div
                  key={category.category}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 hover:border-emerald-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-500/50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                      {category.category}
                    </h4>
                  </div>

                  <div className="space-y-2">
                    {category.items.map((item) => (
                      <div
                        key={item.name}
                        className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 dark:bg-slate-800/50 dark:border-slate-700/50 flex items-start justify-between gap-4"
                      >
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100 font-mono shrink-0">
                          {item.name}
                        </span>
                        <span className="text-xs text-slate-600 dark:text-slate-300 text-right leading-relaxed">
                          {item.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Repository Structure Explorer */}
        <div id="structure" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6 dark:border-slate-800 dark:bg-slate-900 scroll-mt-24">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderTree className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                Project Directory & Codebase Architecture
              </h3>
            </div>
            <span className="font-mono text-xs text-slate-500 dark:text-slate-400">e:\Skin</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projectStructure.map((dir) => (
              <div
                key={dir.path}
                className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 space-y-3 dark:border-slate-700/60 dark:bg-slate-800/40"
              >
                <div>
                  <span className="font-mono text-xs font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-slate-200 dark:bg-slate-800 dark:text-emerald-300 dark:border-slate-700">
                    {dir.path}
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{dir.description}</p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-700/60">
                  {dir.children.map((child) => (
                    <div key={child.path} className="text-xs">
                      <div className="font-mono text-slate-800 dark:text-slate-200 font-medium">{child.path}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{child.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Performance Benchmarks & Validation */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Zap className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <span>Clinical Performance & Validation Metrics</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800/60 text-center">
              <div className="font-mono text-3xl font-extrabold text-emerald-700 dark:text-emerald-400">0.942</div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-200 mt-1">ROC-AUC Score</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">ISIC 2024 Test Cohort</div>
            </div>
            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 dark:bg-teal-950/40 dark:border-teal-800/60 text-center">
              <div className="font-mono text-3xl font-extrabold text-teal-700 dark:text-teal-400">98.2%</div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-200 mt-1">Melanoma Sensitivity</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Minimizing false negatives</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-slate-800/60 dark:border-slate-700/60 text-center">
              <div className="font-mono text-3xl font-extrabold text-slate-900 dark:text-white">118 ms</div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-200 mt-1">Inference Latency</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">End-to-end CPU/GPU execution</div>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-800/60 text-center">
              <div className="font-mono text-3xl font-extrabold text-amber-700 dark:text-amber-400">&lt; 1.8%</div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-200 mt-1">Missed Malignancy Rate</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">High clinical safety threshold</div>
            </div>
          </div>
        </div>

        {/* Section 5: Future Implementations & Strategic Roadmap */}
        <div id="roadmap" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6 dark:border-slate-800 dark:bg-slate-900 scroll-mt-24">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60">
                Strategic Evolution
              </span>
              <h3 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                Future Implementation & Expansion Roadmap
              </h3>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">2026 – 2028 Horizons</span>
          </div>

          <div className="space-y-4">
            {roadmap.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${item.color}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-xl bg-white shadow-xs shrink-0 mt-0.5 dark:bg-slate-800 dark:border dark:border-slate-700">
                      <Icon className="h-5 w-5 text-slate-800 dark:text-slate-200" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider opacity-75">
                          {item.phase}
                        </span>
                        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-40" />
                        <span className="text-xs font-bold">{item.status}</span>
                      </div>
                      <h4 className="font-display font-bold text-base text-slate-950 dark:text-white">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mt-1 max-w-3xl">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA to Scanner */}
        <div className="rounded-3xl bg-slate-900 text-white p-8 text-center space-y-3 dark:border dark:border-slate-800 dark:bg-slate-900/90">
          <h3 className="font-display text-2xl font-bold">Experience the Pipeline in Action</h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Test the live workstation with real dermoscopic images or your own photos to evaluate
            dual-stage feature extraction in real-time.
          </p>
          <div className="pt-2">
            <Link
              to="/scan"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white shadow-lg transition-all"
            >
              <Sparkles className="h-4 w-4" />
              <span>Launch AI Lesion Scanner</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
