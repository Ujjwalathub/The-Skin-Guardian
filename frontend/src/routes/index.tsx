import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Clock,
  Camera,
  Layers,
  HeartPulse,
  Award,
  CheckCircle,
  AlertCircle,
  Stethoscope,
  Microscope,
  FileText,
  UserCheck,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import doctorImg from "@/assets/skin_doctor.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Derm-Referral AI — Clinical Decision Support for Skin Lesions" },
      {
        name: "description",
        content:
          "Derm-Referral AI helps clinics and patients spot suspicious skin lesions early with dual-stage AI triage, fast-tracking urgent cases to dermatologists.",
      },
    ],
  }),
  component: OverviewPage,
});

function OverviewPage() {
  const coreFunctions = [
    {
      step: "01",
      title: "Point & Snap a Photo",
      desc: "Take a clear picture of any mole, rash, or unusual skin spot using any smartphone or dermatoscope attachment. No complicated medical setup required.",
      icon: Camera,
      badge: "Easy & Fast",
    },
    {
      step: "02",
      title: "Dual-Stage AI Safety Check",
      desc: "Our dual-engine inspects microscopic visual patterns (like jagged borders and color variation) alongside patient details like age and lesion location.",
      icon: Microscope,
      badge: "Vision + Clinical Data",
    },
    {
      step: "03",
      title: "Clear Traffic Light Guidance",
      desc: "You get a straightforward, color-coded safety level: Green (routine monitoring), Yellow (tele-dermatology review), or Red (urgent physical biopsy).",
      icon: HeartPulse,
      badge: "Instant Decision",
    },
    {
      step: "04",
      title: "Fast-Track Specialist Referral",
      desc: "Connects local clinics directly with regional dermatologists, drastically cutting months of waiting and making sure urgent cases get seen first.",
      icon: FileText,
      badge: "Zero Delay",
    },
  ];

  const abcdeGuide = [
    {
      letter: "A",
      title: "Asymmetry",
      description: "One half does not match the other half in shape or outline.",
      severity: "High Warning",
      color: "border-amber-400 text-amber-600 bg-amber-50 dark:border-amber-600/60 dark:text-amber-400 dark:bg-amber-950/40",
    },
    {
      letter: "B",
      title: "Border",
      description: "Edges are ragged, notched, blurred, or poorly defined.",
      severity: "High Warning",
      color: "border-amber-400 text-amber-600 bg-amber-50 dark:border-amber-600/60 dark:text-amber-400 dark:bg-amber-950/40",
    },
    {
      letter: "C",
      title: "Color",
      description: "Pigment is not uniform. Shades of tan, brown, black, or blue.",
      severity: "Critical",
      color: "border-rose-400 text-rose-600 bg-rose-50 dark:border-rose-600/60 dark:text-rose-400 dark:bg-rose-950/40",
    },
    {
      letter: "D",
      title: "Diameter",
      description: "Lesion is larger than 6mm (about the size of a pencil eraser).",
      severity: "Moderate",
      color: "border-emerald-400 text-emerald-600 bg-emerald-50 dark:border-emerald-600/60 dark:text-emerald-400 dark:bg-emerald-950/40",
    },
    {
      letter: "E",
      title: "Evolving",
      description: "The spot is changing in size, shape, surface, or color over time.",
      severity: "Critical",
      color: "border-rose-400 text-rose-600 bg-rose-50 dark:border-rose-600/60 dark:text-rose-400 dark:bg-rose-950/40",
    },
  ];

  const faqs = [
    {
      q: "Does this replace a visit to an actual dermatologist?",
      a: "No. Derm-Referral AI is an intelligent clinical decision support system. It is designed to empower primary care nurses, doctors, and patients to prioritize who needs an urgent in-person biopsy and who can safely be monitored, reducing unnecessary anxiety and specialist waitlists.",
    },
    {
      q: "How accurate is the AI system?",
      a: "Trained and benchmarked on over 25,000 verified dermoscopic cases from the International Skin Imaging Collaboration (ISIC 2024), our ensemble achieves 98.2% sensitivity for melanoma, ensuring critical cases are not missed.",
    },
    {
      q: "What should I do if my scan produces a RED flag?",
      a: "A Red Flag indicates morphological features highly associated with malignancy. You should schedule an urgent in-person visit with a dermatologist or surgical clinic for a physical excision biopsy immediately.",
    },
    {
      q: "Can I use it for normal skin issues like eczema or dry skin?",
      a: "Yes! The platform also differentiates benign conditions, inflammatory rashes, and dysplastic moles, offering tailored post-care guidance and medicine advice.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 pb-20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-200">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-24">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-emerald-100/40 via-teal-100/30 to-amber-100/30 blur-3xl pointer-events-none -z-10 dark:from-emerald-950/20 dark:via-teal-950/15 dark:to-amber-950/15" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Headline */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-semibold tracking-wide dark:bg-emerald-950/60 dark:border-emerald-800/60 dark:text-emerald-300">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>AI-Assisted Tele-Dermatology Triage</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
                Catching Suspicious Skin Spots{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 dark:from-emerald-400 dark:via-teal-400 dark:to-emerald-300">
                  Months Earlier.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                Skin cancer is over <strong>99% curable</strong> when caught in its early stages.
                Derm-Referral AI combines advanced vision deep learning with patient clinical factors
                to give clinics and patients clear, instant referral guidance.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/scan"
                  className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                >
                  <Camera className="h-4 w-4" />
                  <span>Start a Skin Scan</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  to="/recommendations"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-800 font-semibold text-sm shadow-xs hover:bg-slate-50 hover:border-emerald-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700 transition-all"
                >
                  <Stethoscope className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Medicine & Treatment Care</span>
                </Link>

                <Link
                  to="/architecture"
                  className="flex items-center gap-1.5 px-4 py-3.5 text-slate-600 text-sm font-medium hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors"
                >
                  <span>Explore Tech Stack</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Quick Trust Highlights */}
              <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800 grid grid-cols-3 gap-4">
                <div>
                  <div className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400">98.2%</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Melanoma Sensitivity</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white">&lt; 150ms</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Analysis Turnaround</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-teal-700 dark:text-teal-400">3-Tier</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Red/Yellow/Green Triage</div>
                </div>
              </div>
            </div>

            {/* Right: Doctor Profile Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Outer Glass Card */}
                <div className="relative rounded-3xl border border-emerald-900/10 bg-white/90 p-4 sm:p-5 shadow-2xl shadow-emerald-950/10 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-black/40">
                  {/* Doctor Image Container */}
                  <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 shadow-inner">
                    <img
                      src={doctorImg}
                      alt="Dr. Elena Vance, Board-Certified Dermatologist examining skin lesion"
                      className="h-full w-full object-cover object-top hover:scale-102 transition-transform duration-500"
                    />
                    {/* Live Specialist Badge */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-emerald-900/85 px-3 py-1 text-xs font-semibold text-white shadow-lg backdrop-blur-md">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Specialist Verified</span>
                    </div>

                    {/* Image Caption Gradient Overlay */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent p-4 text-white">
                      <div className="font-display font-bold text-base">Dr. Elena Vance, MD, FAAD</div>
                      <div className="text-xs text-emerald-300 font-medium">
                        Board-Certified Dermatologist & Clinical Advisor
                      </div>
                    </div>
                  </div>

                  {/* Doctor Quote Card */}
                  <div className="mt-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/60 p-4 space-y-2 dark:bg-emerald-950/40 dark:border-emerald-800/50">
                    <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
                      <Stethoscope className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Clinical Specialist Perspective</span>
                    </div>
                    <blockquote className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
                      "In dermatology, early detection is the difference between a minor 10-minute outpatient
                      procedure and advanced oncology. Derm-Referral AI gives frontline doctors the confidence
                      to triage immediately and never let an aggressive lesion slip through."
                    </blockquote>
                    <div className="flex items-center justify-between pt-2 border-t border-emerald-200/60 dark:border-emerald-800/50 text-[11px] text-emerald-900 dark:text-emerald-300 font-medium">
                      <span>St. Jude Tele-Derm Network</span>
                      <span className="text-slate-500 dark:text-slate-400">ISIC Verified Reviewer</span>
                    </div>
                  </div>

                  {/* Clinical Confidence Pills */}
                  <div className="mt-3 flex items-center justify-around text-center text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Biopsy Decision Guidance</span>
                    </div>
                    <div className="h-3 w-px bg-slate-200 dark:bg-slate-700" />
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                      <span>Patient Privacy Preserved</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: How It Works in 4 Simple Steps */}
      <section className="py-16 bg-white border-y border-slate-200/60 dark:bg-slate-900/50 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 dark:bg-emerald-950/60 dark:border-emerald-800/60 dark:text-emerald-300">
              Simple 4-Step Process
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              How Derm-Referral AI Works
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300">
              Designed so that any healthcare worker or patient can assess a concerning skin spot
              without needing advanced medical degrees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreFunctions.map((func) => {
              const Icon = func.icon;
              return (
                <div
                  key={func.step}
                  className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:shadow-md hover:border-emerald-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-500/50 dark:hover:bg-slate-900/80 transition-all group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-2xl font-black text-emerald-600/40 group-hover:text-emerald-600 dark:text-emerald-400/60 dark:group-hover:text-emerald-400 transition-colors">
                      {func.step}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full dark:bg-emerald-950/80 dark:text-emerald-300 dark:border dark:border-emerald-800/60">
                      {func.badge}
                    </span>
                  </div>

                  <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shadow-xs mb-4 group-hover:scale-110 dark:bg-slate-800 dark:border-slate-700 dark:text-emerald-400 transition-transform">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {func.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {func.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 3: The 3-Tier Traffic Light Guidance Explained */}
      <section className="py-16 bg-slate-50 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 dark:bg-emerald-950/60 dark:border-emerald-800/60 dark:text-emerald-300">
              Clinical Triage Protocol
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Understanding Your Results
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300">
              Rather than confusing technical probabilities, every assessment is distilled into
              actionable, standardized triage flags.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Green Flag */}
            <div className="rounded-3xl border-2 border-emerald-300 bg-white p-6 shadow-sm relative overflow-hidden dark:bg-slate-900 dark:border-emerald-500/60">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg dark:bg-emerald-950 dark:text-emerald-300">
                  🟢
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-emerald-950 dark:text-emerald-200">Green Flag</h3>
                  <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">Low Risk / Benign</span>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                The lesion exhibits uniform pigmentation, smooth symmetric borders, and characteristics
                typical of common benign moles or minor dermatitis.
              </p>
              <div className="rounded-xl bg-emerald-50 p-3 text-xs text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200 font-medium space-y-1">
                <div className="font-bold">Recommended Action:</div>
                <div>Routine local monitoring. Perform self-skin exam in 6 months.</div>
              </div>
            </div>

            {/* Yellow Flag */}
            <div className="rounded-3xl border-2 border-amber-300 bg-white p-6 shadow-sm relative overflow-hidden dark:bg-slate-900 dark:border-amber-500/60">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-lg dark:bg-amber-950 dark:text-amber-300">
                  🟡
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-amber-950 dark:text-amber-200">Yellow Flag</h3>
                  <span className="text-xs text-amber-700 dark:text-amber-400 font-semibold">Moderate Risk / Atypical</span>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                Noticeable morphological irregularities such as mild border blurring or color variation.
                Requires professional verification to prevent progression.
              </p>
              <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-900 dark:bg-amber-950/50 dark:text-amber-200 font-medium space-y-1">
                <div className="font-bold">Recommended Action:</div>
                <div>Tele-dermatology digital consultation within 2 to 4 weeks.</div>
              </div>
            </div>

            {/* Red Flag */}
            <div className="rounded-3xl border-2 border-rose-400 bg-white p-6 shadow-md relative overflow-hidden dark:bg-slate-900 dark:border-rose-500/60">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-lg dark:bg-rose-950 dark:text-rose-300">
                  🔴
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-rose-950 dark:text-rose-200">Red Flag</h3>
                  <span className="text-xs text-rose-700 dark:text-rose-400 font-semibold">High Suspicion / Urgent</span>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                High probability of melanoma or invasive basal cell carcinoma. Exhibits multiple
                concerning features: deep asymmetry, dark pigment clusters, or rapid growth.
              </p>
              <div className="rounded-xl bg-rose-50 p-3 text-xs text-rose-900 dark:bg-rose-950/50 dark:text-rose-200 font-medium space-y-1">
                <div className="font-bold">Recommended Action:</div>
                <div>Urgent physical biopsy & immediate oncological specialist escalation.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: ABCDE Visual Guide for Non-Technical Users */}
      <section className="py-16 bg-white border-b border-slate-200/60 dark:bg-slate-900/50 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 dark:bg-emerald-950/60 dark:border-emerald-800/60 dark:text-emerald-300">
                Patient Self-Check Guide
              </span>
              <h2 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
                The ABCDE Rule of Skin Checks
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                What dermatologists look for when evaluating whether a mole is dangerous.
              </p>
            </div>
            <Link
              to="/scan"
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 transition-colors"
            >
              <span>Test with AI Scanner</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {abcdeGuide.map((item) => (
              <div
                key={item.letter}
                className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-emerald-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-500/50 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`h-10 w-10 rounded-xl flex items-center justify-center font-display font-black text-xl border ${item.color}`}
                  >
                    {item.letter}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
                    {item.severity}
                  </span>
                </div>
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: FAQs */}
      <section className="py-16 bg-slate-50 dark:bg-slate-950">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-10">
            <h2 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Common questions from patients, clinicians, and community health centers.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900"
              >
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                  {faq.q}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-4">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: Launch CTA Banner */}
      <section className="py-12 bg-white dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 p-8 sm:p-12 text-white shadow-xl relative overflow-hidden dark:from-emerald-950 dark:via-teal-950 dark:to-slate-900 dark:border dark:border-emerald-800/40">
            <div className="relative z-10 max-w-2xl space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-800/60 px-3 py-1 rounded-full border border-emerald-700/50">
                Ready to analyze a lesion?
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
                Try the Live Dermoscopic AI Scanner Now
              </h2>
              <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
                Upload your skin photo or test with our verified clinical presets to see real-time
                dual-stage malignancy risk calculation in under 150 milliseconds.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/scan"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-emerald-950 font-bold text-sm shadow-md hover:bg-emerald-50 transition-all"
                >
                  <Camera className="h-4 w-4 text-emerald-700" />
                  <span>Launch AI Scanner</span>
                </Link>
                <Link
                  to="/recommendations"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-800/80 text-white font-semibold text-sm border border-emerald-700 hover:bg-emerald-800 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 transition-all"
                >
                  <Stethoscope className="h-4 w-4" />
                  <span>View Clinical Treatments</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
