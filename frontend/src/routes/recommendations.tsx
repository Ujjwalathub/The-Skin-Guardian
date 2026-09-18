import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Pill,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Sparkles,
  HeartPulse,
  Printer,
  ChevronRight,
  ExternalLink,
  FileText,
  Stethoscope,
  Info,
  Sun,
  Flame,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import treatmentsHeroImg from "@/assets/dermatology_treatments.jpg";

export const Route = createFileRoute("/recommendations")({
  head: () => ({
    meta: [
      { title: "Clinical Medicine & Treatment Recommendations — Derm-Referral AI" },
      {
        name: "description",
        content:
          "Evidence-based medication guidelines, prescription topicals, wound care protocols, and specialist action plans based on skin lesion triage severity.",
      },
    ],
  }),
  component: RecommendationsPage,
});

type TriageCategory = "RED" | "YELLOW" | "GREEN";

interface MedicationItem {
  name: string;
  generic: string;
  category: string;
  indication: string;
  dosage: string;
  duration: string;
  instructions: string;
  sideEffects: string;
  warning: string;
}

function RecommendationsPage() {
  const [selectedTier, setSelectedTier] = useState<TriageCategory>("YELLOW");
  const [patientNotes, setPatientNotes] = useState("");

  const medicineProtocols: Record<
    TriageCategory,
    {
      title: string;
      subtitle: string;
      clinicalGoal: string;
      badge: string;
      badgeColor: string;
      bannerBg: string;
      borderColor: string;
      surgicalAction: string;
      medications: MedicationItem[];
    }
  > = {
    RED: {
      title: "High-Risk Suspicion (Melanoma / Invasive Carcinoma)",
      subtitle: "Immediate Surgical Referral & Biopsy Pre-Care",
      clinicalGoal: "Prevent tumor progression, avoid border manipulation, and prepare patient for urgent histopathology.",
      badge: "🔴 Critical Priority — Oncology Referral",
      badgeColor: "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800",
      bannerBg: "bg-rose-50/80 dark:bg-rose-950/30",
      borderColor: "border-rose-300 dark:border-rose-800/70",
      surgicalAction: "Urgent Excision Biopsy (1–2mm margins) or Mohs Micrographic Surgery within 7–14 days. Do not perform cryotherapy or superficial shave.",
      medications: [
        {
          name: "Mupirocin 2% Ointment",
          generic: "Mupirocin (Topical Antibiotic)",
          category: "Post-Biopsy Wound Care",
          indication: "Sterile prophylaxis following punch or diagnostic excision biopsy.",
          dosage: "Apply thin layer to sutured biopsy site",
          duration: "Twice daily for 7 days",
          instructions: "Clean with mild sterile saline solution, apply mupirocin, and dress with non-stick silicone gauze.",
          sideEffects: "Local burning or mild stinging around sutured margin.",
          warning: "Never apply to an unbiopsied, intact suspicious mole as this can mask margin visibility.",
        },
        {
          name: "Silicone Gel / Silicone Sheeting",
          generic: "Medical-Grade Dimethicone",
          category: "Scar Management",
          indication: "Reduction of hypertrophic scar formation following surgical excision.",
          dosage: "Apply after sutures are removed and wound is fully closed",
          duration: "Daily for 8–12 weeks",
          instructions: "Massage gently onto healed incision scar twice daily after morning and evening cleansing.",
          sideEffects: "Mild skin maceration if skin is not dry before application.",
          warning: "Do not apply on open or draining wounds.",
        },
        {
          name: "Systemic Immunotherapy (Specialist Oncology)",
          generic: "Pembrolizumab (Keytruda) / Nivolumab",
          category: "Adjuvant Oncology Therapy",
          indication: "Prescribed strictly by surgical oncologists for confirmed Stage IIB/III melanoma.",
          dosage: "Intravenous infusion (hospital setting only)",
          duration: "Determined by multidisciplinary tumor board",
          instructions: "Requires regular monitoring of hepatic and endocrine panel markers.",
          sideEffects: "Fatigue, immune-mediated pneumonitis, rash, colitis.",
          warning: "Hospital-administered only. Not available for over-the-counter dispensing.",
        },
      ],
    },
    YELLOW: {
      title: "Moderate Risk (Actinic Keratosis / Dysplastic Nevi)",
      subtitle: "Prescription Topical Chemotherapy & Field Cancerization Therapy",
      clinicalGoal: "Target abnormal precancerous keratinocytes, eliminate sun damage, and prevent malignant transformation.",
      badge: "🟡 Moderate Risk — Tele-Dermatology Protocol",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
      bannerBg: "bg-amber-50/80 dark:bg-amber-950/30",
      borderColor: "border-amber-300 dark:border-amber-800/70",
      surgicalAction: "Liquid nitrogen cryotherapy for isolated lesions or tele-dermatology digital dermoscopy surveillance at 3 months.",
      medications: [
        {
          name: "Fluorouracil 5% Topical Cream (Efudex)",
          generic: "5-Fluorouracil (5-FU)",
          category: "Topical Antineoplastic / Antimetabolite",
          indication: "Primary medical treatment for multiple actinic keratoses and superficial solar damage.",
          dosage: "Apply sparingly with non-metal applicator or gloved finger",
          duration: "Twice daily for 2 to 4 weeks (until ulceration stage)",
          instructions: "Wash hands immediately. Expect noticeable erythema, crusting, and peeling. This indicates healthy therapeutic response.",
          sideEffects: "Intense redness, burning sensation, temporary crusting, scaling.",
          warning: "Strictly avoid sunlight and tanning beds. Teratogenic: contraindicated in pregnancy.",
        },
        {
          name: "Imiquimod 5% Cream (Aldara)",
          generic: "Imiquimod (Toll-like Receptor 7 Agonist)",
          category: "Topical Immune Response Modifier",
          indication: "Biopsy-confirmed superficial basal cell carcinoma and hypertrophic actinic keratosis.",
          dosage: "Apply single sachet packet before bedtime",
          duration: "5 consecutive nights per week for 6 weeks",
          instructions: "Leave on skin for 8 hours then wash with mild soap and warm water.",
          sideEffects: "Localized swelling, itching, erosion, flu-like symptoms.",
          warning: "Protect treated area from all UV radiation. Discontinue if ulceration becomes severe.",
        },
        {
          name: "Diclofenac Sodium 3% Gel in 2.5% Hyaluronan",
          generic: "Diclofenac (Topical NSAID / COX-2 Inhibitor)",
          category: "Non-Steroidal Actinic Keratosis Agent",
          indication: "Mild-to-moderate actinic keratoses for patients intolerant to intense 5-FU inflammation.",
          dosage: "Gently smooth 0.5g onto affected 5cm × 5cm lesion zone",
          duration: "Twice daily for 60 to 90 days",
          instructions: "Slower onset than 5-FU but significantly reduced irritation and crusting.",
          sideEffects: "Mild localized contact dermatitis, dry skin, erythema.",
          warning: "Contraindicated in patients with active NSAID-induced asthma or aspirin allergy.",
        },
      ],
    },
    GREEN: {
      title: "Low Risk / Benign Lesion (Seborrheic Keratosis / Dermatitis)",
      subtitle: "Comfort Topicals, Barrier Restoration & Mineral Photoprotection",
      clinicalGoal: "Relieve itching, maintain stratum corneum hydration, and shield against future solar ultraviolet mutational damage.",
      badge: "🟢 Low Risk — Routine Care & Self-Monitoring",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
      bannerBg: "bg-emerald-50/80 dark:bg-emerald-950/30",
      borderColor: "border-emerald-300 dark:border-emerald-800/70",
      surgicalAction: "No surgical intervention indicated. Perform routine patient self-skin examination every 3–6 months using ABCDE criteria.",
      medications: [
        {
          name: "Broad-Spectrum Mineral Sunscreen SPF 50+",
          generic: "Micronized Zinc Oxide 18% + Titanium Dioxide",
          category: "Primary Photoprotection",
          indication: "Daily prevention of photo-aging and UV-induced DNA thymine dimer mutations.",
          dosage: "Liberal application (1/4 teaspoon for face & neck)",
          duration: "Year-round daily use, reapply every 2 hours outdoors",
          instructions: "Apply 15 minutes before sun exposure as the final step of morning skincare.",
          sideEffects: "Minimal. Potential mild white cast on darker skin phototypes.",
          warning: "Essential for all skin phototypes, especially following topical exfoliants.",
        },
        {
          name: "Hydrocortisone 1% Soothing Ointment",
          generic: "Hydrocortisone (Mild Topical Corticosteroid)",
          category: "Anti-Inflammatory Antipruritic",
          indication: "Temporary relief of localized itching and minor eczema associated with irritated benign spots.",
          dosage: "Apply thin layer to pruritic zone",
          duration: "Twice daily for maximum 7 days",
          instructions: "Do not cover with occlusive bandages. Discontinue once itching resolves.",
          sideEffects: "Skin thinning or telangiectasia with prolonged continuous use beyond 14 days.",
          warning: "Do not apply around ocular/periorbital margins.",
        },
        {
          name: "Ceramide & Hyaluronic Acid Barrier Balm",
          generic: "Ceramides 1, 3, 6-II + Phytosphingosine",
          category: "Epidermal Barrier Repair",
          indication: "Rebuilding lipid mantle around dry, scaling seborrheic keratosis crusts.",
          dosage: "Apply liberally to dry lesion sites",
          duration: "As needed daily",
          instructions: "Best applied within 3 minutes of showering while skin is slightly damp.",
          sideEffects: "Non-comedogenic with zero documented systemic adverse reactions.",
          warning: "Safe for pediatric and sensitive adult skin.",
        },
        {
          name: "Ammonium Lactate 12% Moisturizing Lotion",
          generic: "Lactic Acid (Alpha-Hydroxy Acid Keratolytic)",
          category: "Keratolytic Hydrator",
          indication: "Softening rough, hyperkeratotic plaques and scaly harmless skin tags.",
          dosage: "Apply to rough patches after cleansing",
          duration: "Daily until plaque texture softens",
          instructions: "Gently softens and dissolves keratin plugs over several weeks without scarring.",
          sideEffects: "Dryness or mild peeling of surrounding healthy skin.",
          warning: "Do not use on open, weeping or excoriated skin.",
        },
      ],
    },
  };

  const active = medicineProtocols[selectedTier];

  return (
    <div className="min-h-screen bg-slate-50/70 py-8 px-4 sm:px-6 lg:px-8 dark:bg-slate-950 transition-colors duration-200">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border dark:border-emerald-800/50">
                Clinical Pharmacotherapy
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Evidence-Based Dermatological Protocols
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Medicine & Clinical Recommendations
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              Prescription medications, topical therapeutic protocols, post-procedure wound care,
              and specialist action guidelines tailored to lesion triage outcomes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/scan"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs hover:bg-emerald-700 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Scan a New Lesion</span>
            </Link>
          </div>
        </div>

        {/* Hero Image Showcase: Clinical Medications & Treatments */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm overflow-hidden dark:border-slate-800 dark:bg-slate-900">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60">
                Pharmacy & Clinical Desk
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Targeted Therapeutics for Diagnosed Skin Conditions
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Whether managing precancerous sun-damaged spots with antineoplastic topicals like
                Fluorouracil, calming dermatitis flare-ups with non-steroidal calcineurin inhibitors,
                or setting up urgent oncological excision pathways, evidence-backed pharmacotherapy
                is essential for optimal patient outcomes.
              </p>

              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 dark:bg-slate-800/60 dark:border-slate-700/60">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Topical Chemotherapy</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">5-FU & Imiquimod for precancer</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 dark:bg-slate-800/60 dark:border-slate-700/60">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Barrier Therapeutics</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Hydrocortisone & Ceramides</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 dark:bg-slate-800/60 dark:border-slate-700/60">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Broad SPF 50+</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Micro-zinc UV-A/B shielding</div>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="lg:col-span-5 relative">
              <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md">
                <img
                  src={treatmentsHeroImg}
                  alt="Dermatology prescription medicines, ointment tubes, SPF 50+, and sterile gauze"
                  className="w-full h-auto object-cover hover:scale-102 transition-transform duration-300"
                />
              </div>
              <div className="mt-2 text-center text-[11px] text-slate-500 dark:text-slate-400 italic">
                Clinical dispensing setup: Prescription topicals, soothing balms, and post-procedure dressings.
              </div>
            </div>
          </div>
        </div>

        {/* Severity Selector Tabs */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Select Diagnosed Triage Level:</span>
          {(["RED", "YELLOW", "GREEN"] as const).map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-xs ${
                selectedTier === tier
                  ? tier === "RED"
                    ? "bg-rose-600 text-white shadow-rose-600/20"
                    : tier === "YELLOW"
                    ? "bg-amber-500 text-white shadow-amber-500/20"
                    : "bg-emerald-600 text-white shadow-emerald-600/20"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700"
              }`}
            >
              {tier === "RED" && "🔴 Red Flag: High Risk / Malignancy"}
              {tier === "YELLOW" && "🟡 Yellow Flag: Moderate / Pre-Cancer"}
              {tier === "GREEN" && "🟢 Green Flag: Low Risk / Benign"}
            </button>
          ))}
        </div>

        {/* Active Protocol Header Card */}
        <div className={`rounded-3xl border-2 p-6 shadow-sm ${active.bannerBg} ${active.borderColor}`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <span className={`inline-block text-xs font-extrabold px-3 py-1 rounded-full border mb-2 ${active.badgeColor}`}>
                {active.badge}
              </span>
              <h2 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">
                {active.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1">{active.subtitle}</p>
            </div>

            <div className="rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 p-4 max-w-sm">
              <div className="text-xs font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
                <Stethoscope className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Primary Procedural Directive:</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {active.surgicalAction}
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300">
            <strong>Clinical Objective:</strong> {active.clinicalGoal}
          </div>
        </div>

        {/* Medications Grid */}
        <div className="space-y-4">
          <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Pill className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <span>Prescribed Pharmacotherapy Protocols</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {active.medications.map((med, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-emerald-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-500/50 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 uppercase dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
                        {med.category}
                      </span>
                      <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white mt-1">
                        {med.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{med.generic}</p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3 space-y-1.5 text-xs text-slate-700 border border-slate-100 dark:bg-slate-800/60 dark:border-slate-700/60 dark:text-slate-300">
                    <div>
                      <strong>Indication:</strong> {med.indication}
                    </div>
                    <div>
                      <strong>Dosage & Mode:</strong> {med.dosage}
                    </div>
                    <div>
                      <strong>Duration:</strong> {med.duration}
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    <strong>Instructions:</strong> {med.instructions}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    <strong>Side Effects:</strong> {med.sideEffects}
                  </div>
                  <div className="rounded-xl bg-amber-50 p-2 text-[11px] text-amber-900 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-900/60 flex items-start gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <span>{med.warning}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Treatment Progress Timeline */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <span>Expected Treatment Response Timeline</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-slate-800/60 dark:border-slate-700/60">
              <div className="font-bold text-emerald-800 dark:text-emerald-400 mb-1">Days 1 – 3</div>
              <div className="font-semibold text-slate-900 dark:text-white mb-1">Application & Tolerance</div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                Initiate patch application. Watch for acute allergic reactions or hyper-sensitivity.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-slate-800/60 dark:border-slate-700/60">
              <div className="font-bold text-amber-800 dark:text-amber-400 mb-1">Days 7 – 14</div>
              <div className="font-semibold text-slate-900 dark:text-white mb-1">Active Response Stage</div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                Mild redness, flaking, or crusting. For 5-FU/Imiquimod, this confirms abnormal cell destruction.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-slate-800/60 dark:border-slate-700/60">
              <div className="font-bold text-teal-800 dark:text-teal-400 mb-1">Days 21 – 28</div>
              <div className="font-semibold text-slate-900 dark:text-white mb-1">Epithelial Repair</div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                Crust sloughs away. Transition to ceramide healing balms and daily mineral SPF 50+.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-slate-800/60 dark:border-slate-700/60">
              <div className="font-bold text-emerald-800 dark:text-emerald-400 mb-1">Month 2 – 3</div>
              <div className="font-semibold text-slate-900 dark:text-white mb-1">Clinical Re-Check</div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                Follow-up tele-dermatology dermoscopic scan to confirm complete resolution and clear margins.
              </p>
            </div>
          </div>
        </div>

        {/* Emergency "Red Flag" Symptoms Warning */}
        <div className="rounded-3xl border border-rose-200 bg-rose-50/70 p-6 shadow-sm space-y-3 dark:border-rose-900/60 dark:bg-rose-950/30">
          <div className="flex items-center gap-2 text-rose-900 dark:text-rose-200 font-display font-bold text-base">
            <ShieldAlert className="h-5 w-5 text-rose-600 dark:text-rose-400" />
            <span>Emergency Escalation Protocol: When to Head Directly to a Specialist Clinic</span>
          </div>
          <p className="text-xs sm:text-sm text-rose-800 dark:text-rose-300 leading-relaxed">
            If you or your patient notice any of the following symptoms, bypass topical self-care and
            seek immediate surgical consultation:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs text-rose-900 dark:text-rose-200 font-medium">
            <div className="flex items-center gap-2 bg-white/70 dark:bg-rose-900/30 p-2.5 rounded-xl border border-rose-200 dark:border-rose-800/60">
              <XCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
              <span>Spontaneous bleeding without injury</span>
            </div>
            <div className="flex items-center gap-2 bg-white/70 dark:bg-rose-900/30 p-2.5 rounded-xl border border-rose-200 dark:border-rose-800/60">
              <XCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
              <span>Rapid doubling in size within 30 days</span>
            </div>
            <div className="flex items-center gap-2 bg-white/70 dark:bg-rose-900/30 p-2.5 rounded-xl border border-rose-200 dark:border-rose-800/60">
              <XCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
              <span>Jet-black or bluish-gray pigment clusters</span>
            </div>
            <div className="flex items-center gap-2 bg-white/70 dark:bg-rose-900/30 p-2.5 rounded-xl border border-rose-200 dark:border-rose-800/60">
              <XCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
              <span>Firm tender subcutaneous nodule</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
