import { Link } from "@tanstack/react-router";
import { Heart, ExternalLink, AlertTriangle } from "lucide-react";
import projectLogo from "@/assets/images.jpg";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50/80 text-slate-600 transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Clinical Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-emerald-500/20 p-1 shadow-xs ring-1 ring-emerald-500/10 dark:bg-slate-800 dark:border-emerald-500/40">
                <img
                  src={projectLogo}
                  alt="Derm-Referral AI Logo"
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="font-display text-lg font-bold text-emerald-950 dark:text-white">
                Derm-Referral <span className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">AI</span>
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
              Clinical decision support system engineered to bridge frontline healthcare workers
              with specialist tele-dermatologists. Combining PyTorch EfficientNet-B0 vision features
              with LightGBM tabular meta-learning for fast, calibrated tri-tier risk stratification.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
              <span>ISIC 2024 International Skin Imaging Collaboration Standard</span>
            </div>
          </div>

          {/* Col 2: Platform Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Core Modules
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
                  Project Overview & Mission
                </Link>
              </li>
              <li>
                <Link to="/scan" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
                  AI Lesion Scanner & Workstation
                </Link>
              </li>
              <li>
                <Link to="/recommendations" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
                  Medicine & Clinical Guidelines
                </Link>
              </li>
              <li>
                <Link to="/architecture" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
                  System Architecture & Tech Stack
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Clinical Safety & Protocols */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Clinical Governance
            </h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li>Tri-Tier Referral Engine (Red/Yellow/Green)</li>
              <li>ABCDE Dermoscopic Standard</li>
              <li>Tele-Dermatology District Protocol</li>
              <li>Emergency Oncological Escalation</li>
            </ul>
          </div>
        </div>

        {/* Regulatory & Clinical Disclaimer Banner */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200 flex items-start gap-3 mb-8">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Investigational Medical Device / Decision Support Notice:</strong> Derm-Referral AI
            is an adjunctive clinical decision support software designed to assist licensed clinicians
            and healthcare staff in triaging skin lesions. It is not intended as a standalone diagnostic tool
            nor does it replace histopathological biopsy or physical evaluation by a board-certified dermatologist.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200/80 dark:border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} Derm-Referral AI Platform. Engineered for Global Tele-Dermatology.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
              Powered by PyTorch & LightGBM <Heart className="h-3 w-3 text-red-500 fill-red-500 inline" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
