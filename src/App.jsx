import { useState, useEffect, useRef } from "react";

const DEMO_URL = "https://meetings.hubspot.com/carlos587";

// ─── IMAGES (using provided photos) ──────────────────────────────────────────
// Image 1:  CNC machine training (mentor + apprentices)
// Image 2:  ESAC conference hall (full room, tall)
// Image 3:  ESAC conference hall (wide crop w/ GoSprout logo)
// Image 4:  GoSprout dashboard screenshot (United Calibrate)
// Image 5:  Warehouse apprentices w/ GoSprout vests
// Image 6:  Aviation mechanic under aircraft (wide banner)
// Image 7:  Plumbing apprentice
// Image 8:  Aviation tech inspecting aircraft wing
// Image 9:  Film/media production set
// Image 10: Young tech workers at laptops
// Image 11: Students building robotics
// Image 12: Wind turbine construction aerial
// Image 13: Solar panel installation
// Image 14: Construction workers on site
// Image 15: Auto mechanic with clipboard

// Using data URIs isn't possible here — images are referenced by slot below.
// IMPORTANT: In production, host these files and replace the src values below.
// For now we map each slot to the best-fit photo using descriptive comments.

// Since we can't embed the uploaded files directly as URLs in this artifact,
// we fall back to the closest Unsplash match per slot — swap with your hosted files.
const IMAGES = {
  // Slot → Your photo → Unsplash fallback
  hero:         "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=800&q=85",  // USE: Image 5 (warehouse apprentices)
  problem:      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1400&q=85", // USE: Image 1 (CNC training — subject on right)
  whoSupport:   "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=85",  // USE: Image 14 (construction workers)
  platform:     "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&q=85",    // USE: Image 4 (GoSprout dashboard screenshot)
  conference:   "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&q=85", // USE: Image 3 (ESAC hall w/ GoSprout logo) ← best fit
  caseUA:       "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80",  // USE: Image 6 or 8 (aviation mechanic)
  caseVolvo:    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",     // USE: Image 15 (auto mechanic w/ clipboard)
  casePearce:   "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80",  // USE: Image 13 (solar panel install)
  caseFCC:      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80",  // USE: Image 11 (students/robotics — STEM)
  caseRadiance: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&q=80",  // USE: Image 13 (solar)
  caseNSBU:     "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80",  // USE: Image 14 (construction/infrastructure)
  caseMET:      "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80",  // USE: Image 10 (young tech workers)
  caseAPHC:     "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80",  // USE: Image 7 (plumbing apprentice)
  caseBY:       "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=800&q=80",  // USE: Image 9 (film/media production)
};

// ─── ASSESSMENT QUESTIONS ─────────────────────────────────────────────────────
const ASSESSMENT_STEPS = [
  {
    category: "Compliance & Documentation",
    icon: "✅",
    question: "How does your program currently manage compliance documentation?",
    options: [
      { label: "Spreadsheets and shared drives", score: 1 },
      { label: "Email threads and manual filing", score: 1 },
      { label: "A mix of tools with no single source", score: 2 },
      { label: "A dedicated platform with automation", score: 4 },
    ],
  },
  {
    category: "RTI + OJT Tracking",
    icon: "🔄",
    question: "How do you track on-the-job training hours and related technical instruction completion?",
    options: [
      { label: "We don't track it consistently", score: 1 },
      { label: "Manually in spreadsheets", score: 1 },
      { label: "Partially digitized, but fragmented", score: 2 },
      { label: "Automated and real-time", score: 4 },
    ],
  },
  {
    category: "Employer Engagement",
    icon: "🤝",
    question: "How engaged are your employer partners in the day-to-day program operations?",
    options: [
      { label: "Minimal — we rarely hear from them", score: 1 },
      { label: "We contact them manually when needed", score: 2 },
      { label: "They have some access to progress data", score: 3 },
      { label: "They have a dedicated portal and report regularly", score: 4 },
    ],
  },
  {
    category: "Apprentice Communication",
    icon: "💬",
    question: "Can apprentices view their own progress, milestones, and next steps?",
    options: [
      { label: "No — they rely on coordinator updates", score: 1 },
      { label: "Occasionally via email or PDF", score: 2 },
      { label: "Partially through a shared tool", score: 3 },
      { label: "Yes — through a self-service portal", score: 4 },
    ],
  },
  {
    category: "Reporting & Visibility",
    icon: "📊",
    question: "How do program leaders access performance and compliance data?",
    options: [
      { label: "They ask staff to compile reports manually", score: 1 },
      { label: "Periodic spreadsheet exports", score: 2 },
      { label: "Some dashboard visibility, limited detail", score: 3 },
      { label: "Real-time dashboards with full drill-down", score: 4 },
    ],
  },
  {
    category: "Workforce Funding",
    icon: "💵",
    question: "How well are you capturing WIOA, IRA, or other workforce funding opportunities?",
    options: [
      { label: "We're not tracking funding alignment", score: 1 },
      { label: "Manually — we often miss opportunities", score: 2 },
      { label: "Partially — some documentation exists", score: 3 },
      { label: "Fully documented and audit-ready", score: 4 },
    ],
  },
  {
    category: "Multi-Partner Collaboration",
    icon: "🌐",
    question: "How well do your sponsors, colleges, employers, and workforce boards collaborate?",
    options: [
      { label: "Each works in isolation", score: 1 },
      { label: "Email and phone — no shared platform", score: 2 },
      { label: "Shared documents, but no real integration", score: 3 },
      { label: "All partners connected on one platform", score: 4 },
    ],
  },
];

const NAV_LINKS = [
  { label: "The Problem", href: "#problem" },
  { label: "Assessment", href: "#assessment" },
  { label: "Who We Support", href: "#who" },
  { label: "Case Studies", href: "#trust" },
  { label: "Platform", href: "#platform" },
  { label: "ESAC 2026", href: "#esac" },
];

const STATS = [
  { value: "50+", label: "Apprenticeship Programs" },
  { value: "12k+", label: "Apprentices Tracked" },
  { value: "98%", label: "Stakeholder Satisfaction" },
  { value: "50%", label: "Less Admin Time" },
];

const PROBLEMS = [
  { icon: "📊", title: "Spreadsheet Overload", desc: "Programs managed across dozens of disconnected spreadsheets with no single source of truth." },
  { icon: "🔗", title: "Disconnected Systems", desc: "RTI providers, employers, and sponsors operating in silos with no shared visibility." },
  { icon: "📋", title: "Manual Compliance", desc: "Staff spending hours on documentation, audits, and regulatory filings instead of serving apprentices." },
  { icon: "🏫", title: "RTI Coordination Gaps", desc: "Related Technical Instruction attendance and completions tracked manually or not at all." },
  { icon: "🔧", title: "OJT Blind Spots", desc: "On-the-job training hours and competency progress invisible to program leadership." },
  { icon: "🏢", title: "Employer Friction", desc: "Employers under-supported, under-reported, and disconnected from the program lifecycle." },
  { icon: "💰", title: "Reimbursement Delays", desc: "Funding claims delayed or denied due to incomplete documentation and reporting gaps." },
  { icon: "📈", title: "Reporting Burden", desc: "State and federal reporting consuming disproportionate staff capacity every quarter." },
];

const WHO = [
  { icon: "🏛️", title: "Sponsors & Intermediaries", desc: "Manage multi-employer apprenticeship programs with compliance workflows, apprentice tracking, and employer coordination — all in one platform.", tags: ["RAPIDS Integration", "DOL Compliance", "Multi-Employer"] },
  { icon: "🎓", title: "Colleges & Training Providers", desc: "Coordinate RTI delivery, track attendance and competencies, and align academic credentials with apprenticeship milestones.", tags: ["RTI Management", "Credential Alignment", "Enrollment Sync"] },
  { icon: "🏭", title: "Employers", desc: "Give supervisors the tools to track OJT hours, assess competencies, and stay aligned with program requirements without added burden.", tags: ["OJT Tracking", "Supervisor Tools", "Progress Visibility"] },
  { icon: "🌐", title: "Workforce Organizations", desc: "Support regional apprenticeship ecosystems with cross-program visibility, funding documentation, and stakeholder reporting.", tags: ["Workforce Boards", "WIOA Alignment", "Regional Oversight"] },
];

const CASES = [
  { org: "United Airlines", industry: "Aviation / MRO", outcome: "Replaced a costly internal tool with GoSprout to manage the Calibrate apprenticeship program — unifying RTI, OJT, and real-time analytics in one platform.", initials: "UA", color: "#1a4fa8", quote: "Integrating all apprenticeship components into one seamless platform helped United streamline operations and eliminate costly inefficiencies.", img: IMAGES.caseUA },
  { org: "Volvo Group Trucks", industry: "Automotive Manufacturing", outcome: "Streamlined federal and state registration for a multi-trade apprenticeship program for Industrial Machinery Mechanics, Electricians, and Tool & Die Makers.", initials: "V", color: "#003f8a", img: IMAGES.caseVolvo },
  { org: "Pearce Renewables", industry: "Renewable Energy", outcome: "Automated prevailing wage tracking and compliance for solar technician apprentices — eliminating errors and enabling scalable program growth.", initials: "PR", color: "#1a7a4a", img: IMAGES.casePearce },
  { org: "Frederick Community College", industry: "Education & Biotechnology", outcome: "Scaled a Biological Technician Registered Apprenticeship with streamlined applicant management, employer engagement, and reduced compliance workload.", initials: "FCC", color: "#2d6a4f", quote: "GoSprout has revolutionized how we manage our apprenticeship programs.", quoteBy: "Carla Milan, Apprenticeship Coordinator", img: IMAGES.caseFCC },
  { org: "Radiance Solar", industry: "Solar Power Construction", outcome: "Navigated complex federal and state compliance, unlocked workforce development funding, and built a scalable apprenticeship framework for solar installations.", initials: "RS", color: "#e67e22", img: IMAGES.caseRadiance },
  { org: "New Smyrna Beach Utilities", industry: "Public Utilities", outcome: "Launched a grant-funded apprenticeship program with automated tracking, digital compliance reporting, and structured training pathways.", initials: "NSB", color: "#2980b9", img: IMAGES.caseNSBU },
  { org: "Miami EdTech", industry: "Workforce Development", outcome: "Streamlined a multi-employer Registered Apprenticeship in AI & UX/UI, expanding to six Miami-Dade high schools.", initials: "MET", color: "#8e44ad", quote: "GoSprout has streamlined the entire process, allowing us to focus on mentorship, skill-building, and empowering the next generation of tech talent.", quoteBy: "Tatenda Mahaka, Program Manager", img: IMAGES.caseMET },
  { org: "APHC of Central Ohio", industry: "Plumbing & Contracting", outcome: "Replaced spreadsheet-based tracking for 8,000 hours of OJT and classroom instruction with centralized real-time oversight.", initials: "APHC", color: "#c0392b", img: IMAGES.caseAPHC },
  { org: "Better Youth", industry: "Nonprofit / Media Arts", outcome: "Managed pre-apprenticeship programs in digital storytelling, game design, and fine arts for foster and system-impacted youth.", initials: "BY", color: "#27ae60", quote: "It's more than just a management system; it's a growth enabler for our young creatives.", quoteBy: "Syd Stewart, Founder/CEO", img: IMAGES.caseBY },
];

const CAPABILITIES = [
  { icon: "👤", title: "Apprentice Tracking", desc: "Full lifecycle visibility — from enrollment through completion — for every apprentice across every program." },
  { icon: "📚", title: "RTI + OJT Management", desc: "Coordinate related technical instruction and on-the-job training with automated hour tracking and competency logging." },
  { icon: "⚖️", title: "Compliance Workflows", desc: "Built-in DOL compliance frameworks, audit-ready documentation, and automated reporting for state and federal requirements." },
  { icon: "🏢", title: "Employer Coordination", desc: "Give employer partners structured tools to manage apprentices, log progress, and stay aligned with program standards." },
  { icon: "💰", title: "Workforce Funding Alignment", desc: "Document apprenticeship activities against WIOA, IRA, and other funding streams to maximize reimbursement capture." },
  { icon: "🗂️", title: "Multi-Program Visibility", desc: "Program administrators and workforce leaders get cross-program dashboards and real-time operational health metrics." },
];

function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function FadeIn({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={className} style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(28px)", transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s` }}>
      {children}
    </div>
  );
}

function GoSproutLogo({ size = 32 }) {
  return (
    <svg width={size * 2.8} height={size} viewBox="0 0 112 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 4C11.163 4 4 11.163 4 20C4 28.837 11.163 36 20 36C24.2 36 28 34.4 30.8 31.8L27.2 28.2C25.2 30 22.8 31.2 20 31.2C13.8 31.2 8.8 26.2 8.8 20C8.8 13.8 13.8 8.8 20 8.8C26.2 8.8 31.2 13.8 31.2 20V22H20V26.8H36V20C36 11.163 28.837 4 20 4Z" fill="white"/>
      <rect x="20" y="16" width="16" height="7" rx="3.5" fill="#F28627"/>
      <ellipse cx="20" cy="29" rx="4" ry="5" fill="#F5A623"/>
      <text x="44" y="27" fontFamily="'Nunito Sans', sans-serif" fontWeight="800" fontSize="18" fill="white" letterSpacing="-0.3">GoSprout</text>
    </svg>
  );
}

function GoSproutIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path d="M20 2C10.059 2 2 10.059 2 20C2 29.941 10.059 38 20 38C24.6 38 28.8 36.2 31.9 33.3L27.9 29.3C25.7 31.3 22.9 32.6 20 32.6C13.1 32.6 7.4 26.9 7.4 20C7.4 13.1 13.1 7.4 20 7.4C26.9 7.4 32.6 13.1 32.6 20V22.2H20V27.2H37.8V20C37.8 10.059 29.941 2 20 2Z" fill="white"/>
      <rect x="20" y="15.5" width="17.8" height="8" rx="4" fill="#F28627"/>
      <ellipse cx="20" cy="30" rx="4.5" ry="5.5" fill="#F5A623"/>
    </svg>
  );
}

// ─── SCORE RESULT CONFIG ──────────────────────────────────────────────────────
function getResult(score, max) {
  const pct = score / max;
  if (pct >= 0.85) return { label: "Optimized", color: "#22c55e", desc: "Your operations are strong. GoSprout can help you scale further and add cross-program visibility.", cta: "Explore advanced features" };
  if (pct >= 0.65) return { label: "Developing", color: "#F28627", desc: "You have solid foundations but gaps in automation and visibility are costing your team time and funding opportunities.", cta: "See how GoSprout closes the gaps" };
  if (pct >= 0.4)  return { label: "At Risk", color: "#f59e0b", desc: "Manual processes are creating compliance exposure and limiting your program's growth capacity.", cta: "Schedule a remediation walkthrough" };
  return { label: "Critical Gaps", color: "#ef4444", desc: "Your program is heavily reliant on manual systems. Administrative burden is likely limiting your ability to serve apprentices and employers well.", cta: "Start with a free ops audit" };
}

// ─── ASSESSMENT MODAL ─────────────────────────────────────────────────────────
function AssessmentModal({ onClose }) {
  const [step, setStep] = useState(0); // 0 = intro, 1–7 = questions, 8 = contact, 9 = results
  const [answers, setAnswers] = useState({});
  const [contact, setContact] = useState({ name: "", org: "", email: "", role: "" });
  const [submitted, setSubmitted] = useState(false);

  const totalSteps = ASSESSMENT_STEPS.length;
  const qIndex = step - 1; // question index (step 1 = question 0)
  const isQuestion = step >= 1 && step <= totalSteps;
  const isContact = step === totalSteps + 1;
  const isResult = step === totalSteps + 2;

  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
  const maxScore = totalSteps * 4;
  const result = getResult(totalScore, maxScore);

  const canAdvance = isQuestion ? answers[qIndex] !== undefined : true;

  const handleAnswer = (score) => {
    setAnswers(prev => ({ ...prev, [qIndex]: score }));
  };

  const handleNext = () => {
    if (isContact) {
      setSubmitted(true);
      setStep(s => s + 1);
    } else {
      setStep(s => s + 1);
    }
  };

  const handleBack = () => setStep(s => Math.max(0, s - 1));

  // Category scores for results
  const catScores = ASSESSMENT_STEPS.map((s, i) => ({
    cat: s.category,
    icon: s.icon,
    score: answers[i] || 0,
    max: 4,
  }));

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(10,8,30,.85)", backdropFilter: "blur(8px)", cursor: "pointer" }} />

      {/* Modal */}
      <div style={{ position: "relative", width: "100%", maxWidth: 640, background: "#1b1844", border: "1px solid rgba(255,255,255,.12)", borderRadius: 20, overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,.6)", maxHeight: "90vh", overflowY: "auto" }}>

        {/* Header */}
        <div style={{ padding: "28px 32px 0", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 11, color: "#F28627", fontWeight: 700, letterSpacing: ".1rem", textTransform: "uppercase", marginBottom: 6 }}>
              {isResult ? "Your Results" : isContact ? "Almost Done" : `Step ${step} of ${totalSteps + 1}`}
            </div>
            <div style={{ fontWeight: 900, fontSize: 20, lineHeight: 1.2 }}>
              {isResult ? "Apprenticeship Operations Assessment" : isContact ? "Where Should We Send Your Report?" : step === 0 ? "Apprenticeship Operations Assessment" : ASSESSMENT_STEPS[qIndex]?.category}
            </div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,.08)", border: "none", color: "rgba(255,255,255,.6)", width: 32, height: 32, borderRadius: "50%", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginLeft: 16 }}>✕</button>
        </div>

        {/* Progress bar (questions only) */}
        {(isQuestion || isContact) && (
          <div style={{ padding: "16px 32px 0" }}>
            <div style={{ height: 4, background: "rgba(255,255,255,.08)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${(step / (totalSteps + 1)) * 100}%`, background: "linear-gradient(90deg, #F28627, #fba84a)", borderRadius: 4, transition: "width .4s ease" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,.35)" }}>
                {isContact ? "Contact info" : ASSESSMENT_STEPS[qIndex]?.icon + " " + ASSESSMENT_STEPS[qIndex]?.category}
              </span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,.35)" }}>{Math.round((step / (totalSteps + 1)) * 100)}%</span>
            </div>
          </div>
        )}

        <div style={{ padding: "24px 32px 32px" }}>

          {/* ── INTRO ── */}
          {step === 0 && (
            <div>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,.7)", lineHeight: 1.7, marginBottom: 24 }}>
                In about 8 minutes, this assessment will benchmark your apprenticeship program's operational maturity across 7 key dimensions — from compliance to employer coordination to funding alignment.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                {ASSESSMENT_STEPS.map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "rgba(255,255,255,.04)", borderRadius: 8, border: "1px solid rgba(255,255,255,.06)" }}>
                    <span style={{ fontSize: 18 }}>{s.icon}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,.75)" }}>{s.category}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: "rgba(242,134,39,.08)", border: "1px solid rgba(242,134,39,.2)", borderRadius: 10, padding: "14px 18px", marginBottom: 28, fontSize: 13, color: "rgba(255,255,255,.65)", lineHeight: 1.6 }}>
                📋 You'll receive a personalized benchmarked report at the end. We'll also suggest specific GoSprout capabilities based on your gaps.
              </div>
              <button className="btn-primary" style={{ width: "100%", textAlign: "center", fontSize: 15, padding: "16px" }} onClick={() => setStep(1)}>Start the Assessment →</button>
            </div>
          )}

          {/* ── QUESTIONS ── */}
          {isQuestion && (
            <div>
              <p style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.5, marginBottom: 24, color: "#fff" }}>
                {ASSESSMENT_STEPS[qIndex].question}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                {ASSESSMENT_STEPS[qIndex].options.map((opt, oi) => {
                  const selected = answers[qIndex] === opt.score;
                  return (
                    <button key={oi} onClick={() => handleAnswer(opt.score)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", background: selected ? "rgba(242,134,39,.15)" : "rgba(255,255,255,.04)", border: `1.5px solid ${selected ? "#F28627" : "rgba(255,255,255,.08)"}`, borderRadius: 10, cursor: "pointer", textAlign: "left", transition: "all .15s", color: "#fff" }}>
                      <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${selected ? "#F28627" : "rgba(255,255,255,.25)"}`, background: selected ? "#F28627" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all .15s" }}>
                        {selected && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />}
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.4, color: selected ? "#fff" : "rgba(255,255,255,.75)" }}>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={handleBack} style={{ flex: "0 0 auto", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", color: "rgba(255,255,255,.6)", borderRadius: 8, padding: "14px 20px", cursor: "pointer", fontSize: 14, fontFamily: "'Montserrat',sans-serif", fontWeight: 700 }}>← Back</button>
                <button onClick={handleNext} disabled={!canAdvance} style={{ flex: 1, background: canAdvance ? "#F28627" : "rgba(255,255,255,.1)", border: "none", color: canAdvance ? "#fff" : "rgba(255,255,255,.3)", borderRadius: 8, padding: "14px", cursor: canAdvance ? "pointer" : "not-allowed", fontSize: 15, fontFamily: "'Montserrat',sans-serif", fontWeight: 700, transition: "all .2s" }}>
                  {step === totalSteps ? "Continue →" : "Next Question →"}
                </button>
              </div>
            </div>
          )}

          {/* ── CONTACT FORM ── */}
          {isContact && (
            <div>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,.65)", lineHeight: 1.7, marginBottom: 24 }}>
                We'll email you a personalized report with your benchmark scores and a GoSprout recommendation based on your gaps.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 28 }}>
                {[
                  { key: "name", label: "Your Name", placeholder: "Jane Smith", type: "text" },
                  { key: "org", label: "Organization", placeholder: "Frederick Community College", type: "text" },
                  { key: "role", label: "Your Role", placeholder: "Apprenticeship Coordinator", type: "text" },
                  { key: "email", label: "Work Email", placeholder: "jane@college.edu", type: "email" },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,.5)", textTransform: "uppercase", letterSpacing: ".05rem", marginBottom: 6 }}>{f.label}</label>
                    <input
                      type={f.type}
                      placeholder={f.placeholder}
                      value={contact[f.key]}
                      onChange={e => setContact(prev => ({ ...prev, [f.key]: e.target.value }))}
                      style={{ width: "100%", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8, padding: "12px 14px", color: "#fff", fontSize: 14, fontFamily: "'Nunito Sans',sans-serif", outline: "none" }}
                    />
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={handleBack} style={{ flex: "0 0 auto", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", color: "rgba(255,255,255,.6)", borderRadius: 8, padding: "14px 20px", cursor: "pointer", fontSize: 14, fontFamily: "'Montserrat',sans-serif", fontWeight: 700 }}>← Back</button>
                <button onClick={handleNext} disabled={!contact.name || !contact.email} style={{ flex: 1, background: contact.name && contact.email ? "#F28627" : "rgba(255,255,255,.1)", border: "none", color: contact.name && contact.email ? "#fff" : "rgba(255,255,255,.3)", borderRadius: 8, padding: "14px", cursor: contact.name && contact.email ? "pointer" : "not-allowed", fontSize: 15, fontFamily: "'Montserrat',sans-serif", fontWeight: 700 }}>
                  View My Results →
                </button>
              </div>
              <div style={{ marginTop: 14, fontSize: 12, color: "rgba(255,255,255,.3)", textAlign: "center" }}>We don't share your information. No spam, ever.</div>
            </div>
          )}

          {/* ── RESULTS ── */}
          {isResult && (
            <div>
              {/* Score header */}
              <div style={{ background: `rgba(${result.color === "#22c55e" ? "34,197,94" : result.color === "#F28627" ? "242,134,39" : result.color === "#f59e0b" ? "245,158,11" : "239,68,68"},.1)`, border: `1px solid ${result.color}30`, borderRadius: 12, padding: "20px 22px", marginBottom: 24, display: "flex", alignItems: "center", gap: 18 }}>
                <div style={{ textAlign: "center", flexShrink: 0 }}>
                  <div style={{ fontSize: 36, fontWeight: 900, color: result.color, lineHeight: 1 }}>{totalScore}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)", marginTop: 2 }}>of {maxScore}</div>
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: result.color, marginBottom: 4 }}>{result.label}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,.65)", lineHeight: 1.5 }}>{result.desc}</div>
                </div>
              </div>

              {/* Category breakdown */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,.4)", textTransform: "uppercase", letterSpacing: ".06rem", marginBottom: 14 }}>Score by Category</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {catScores.map((c, i) => (
                    <div key={i}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{c.icon} {c.cat}</span>
                        <span style={{ fontSize: 12, color: c.score >= 3 ? "#22c55e" : c.score === 2 ? "#F28627" : "#ef4444", fontWeight: 700 }}>{c.score}/{c.max}</span>
                      </div>
                      <div style={{ height: 6, background: "rgba(255,255,255,.08)", borderRadius: 4, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${(c.score / c.max) * 100}%`, background: c.score >= 3 ? "#22c55e" : c.score === 2 ? "#F28627" : "#ef4444", borderRadius: 4, transition: "width .8s ease" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTAs */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <button className="btn-primary" style={{ width: "100%", textAlign: "center", fontSize: 15, padding: "16px" }} onClick={() => { window.open(DEMO_URL, "_blank"); onClose(); }}>
                  {result.cta} — Book a Demo →
                </button>
                <button onClick={onClose} style={{ width: "100%", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", color: "rgba(255,255,255,.6)", borderRadius: 8, padding: "14px", cursor: "pointer", fontSize: 14, fontFamily: "'Montserrat',sans-serif", fontWeight: 700 }}>
                  Close
                </button>
              </div>
              <div style={{ marginTop: 16, fontSize: 12, color: "rgba(255,255,255,.3)", textAlign: "center" }}>A full PDF report will be sent to {contact.email || "your email"}</div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showAssessment, setShowAssessment] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  // Prevent body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = showAssessment ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showAssessment]);

  const scrollTo = (id) => {
    setMobileOpen(false);
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const openDemo = () => window.open(DEMO_URL, "_blank");
  const openAssessment = () => setShowAssessment(true);

  return (
    <div style={{ fontFamily: "'Nunito Sans', sans-serif", background: "#262261", color: "#fff", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700;800;900&family=Montserrat:wght@600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; background: #1b1844; }
        ::-webkit-scrollbar-thumb { background: #F28627; border-radius: 3px; }
        .orange { color: #F28627; }
        .eyebrow { text-transform: uppercase; font-size: 12px; font-weight: 700; letter-spacing: .1rem; color: #F28627; }
        .btn-primary { background: #F28627; color: #fff; border: none; border-radius: 8px; padding: 14px 28px; font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 14px; cursor: pointer; transition: background .2s, transform .15s; display: inline-block; }
        .btn-primary:hover { background: #bb612a; transform: translateY(-1px); }
        .btn-ghost { background: rgba(255,255,255,.08); color: #fff; border: 1px solid rgba(255,255,255,.2); border-radius: 8px; padding: 14px 28px; font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 14px; cursor: pointer; transition: background .2s, transform .15s; display: inline-block; }
        .btn-ghost:hover { background: rgba(255,255,255,.15); transform: translateY(-1px); }
        .card { background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.08); border-radius: 14px; transition: background .2s, transform .2s, border-color .2s; }
        .card:hover { background: rgba(255,255,255,.1); border-color: rgba(242,134,39,.3); transform: translateY(-3px); }
        .section { padding: 96px 24px; }
        .container { max-width: 1180px; margin: 0 auto; }
        .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
        @media(max-width: 900px) { .grid-4 { grid-template-columns: 1fr 1fr; } .grid-3 { grid-template-columns: 1fr 1fr; } .hero-grid, .two-col { grid-template-columns: 1fr !important; } }
        @media(max-width: 640px) { .grid-3, .grid-4 { grid-template-columns: 1fr; } .section { padding: 64px 20px; } }
        .tag { background: rgba(242,134,39,.15); color: #F28627; border: 1px solid rgba(242,134,39,.25); border-radius: 20px; padding: 3px 10px; font-size: 11px; font-weight: 700; }
        .section-alt { background: #1b1844; }
        .divider { width: 48px; height: 3px; background: #F28627; border-radius: 2px; margin: 16px 0 32px; }
        .case-card { background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.08); border-radius: 14px; overflow: hidden; transition: transform .2s, border-color .2s; display: flex; flex-direction: column; }
        .case-card:hover { border-color: rgba(242,134,39,.3); transform: translateY(-3px); }
        input::placeholder { color: rgba(255,255,255,.25); }
        input:focus { border-color: rgba(242,134,39,.5) !important; outline: none; }
      `}</style>

      {/* ASSESSMENT MODAL */}
      {showAssessment && <AssessmentModal onClose={() => setShowAssessment(false)} />}

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "0 24px", background: scrolled ? "rgba(27,24,68,.97)" : "transparent", backdropFilter: scrolled ? "blur(16px)" : "none", borderBottom: scrolled ? "1px solid rgba(255,255,255,.08)" : "none", transition: "all .3s" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <GoSproutLogo size={26} />
            <span style={{ background: "rgba(242,134,39,.15)", color: "#F28627", border: "1px solid rgba(242,134,39,.3)", borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700, marginLeft: 4 }}>ESAC 2026</span>
          </div>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }} className="desktop-nav">
            {NAV_LINKS.map(l => (
              <button key={l.label} onClick={() => scrollTo(l.href)} style={{ background: "none", border: "none", color: "rgba(255,255,255,.75)", fontSize: 13, fontFamily: "'Montserrat',sans-serif", fontWeight: 600, cursor: "pointer", transition: "color .2s" }} onMouseEnter={e => e.target.style.color="#fff"} onMouseLeave={e => e.target.style.color="rgba(255,255,255,.75)"}>{l.label}</button>
            ))}
            <button className="btn-primary" style={{ padding: "10px 18px", fontSize: 13 }} onClick={openDemo}>Book a Demo</button>
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: "none", border: "none", color: "#fff", fontSize: 22, cursor: "pointer", display: "none" }} className="mobile-menu-btn">☰</button>
        </div>
        <style>{`@media(max-width:768px){.desktop-nav{display:none!important}.mobile-menu-btn{display:block!important}}`}</style>
        {mobileOpen && (
          <div style={{ background: "#1b1844", padding: "16px 24px 24px", borderTop: "1px solid rgba(255,255,255,.08)" }}>
            {NAV_LINKS.map(l => (
              <button key={l.label} onClick={() => scrollTo(l.href)} style={{ display: "block", background: "none", border: "none", color: "rgba(255,255,255,.8)", fontSize: 15, fontFamily: "'Montserrat',sans-serif", fontWeight: 600, cursor: "pointer", padding: "10px 0", width: "100%", textAlign: "left" }}>{l.label}</button>
            ))}
            <button className="btn-primary" style={{ marginTop: 12, width: "100%" }} onClick={openDemo}>Book a Demo</button>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section style={{ background: "linear-gradient(160deg, #262261 0%, #1b1844 60%, #16143a 100%)", padding: "160px 24px 96px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 70% 40%, rgba(242,134,39,.08) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div className="container" style={{ position: "relative" }}>
          <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: 64, alignItems: "center" }}>
            <div>
              <FadeIn>
                <div className="eyebrow" style={{ marginBottom: 20 }}>ESAC 2026 — Eastern Seaboard Apprenticeship Conference</div>
                <h1 style={{ fontSize: "clamp(40px, 6vw, 76px)", fontWeight: 900, lineHeight: 1.06, letterSpacing: "-.02em", marginBottom: 28 }}>
                  Simplify<br /><span className="orange">Apprenticeship</span><br />Operations
                </h1>
                <p style={{ fontSize: 18, lineHeight: 1.7, color: "rgba(255,255,255,.78)", maxWidth: 560, marginBottom: 40 }}>
                  GoSprout helps apprenticeship sponsors, colleges, workforce organizations, and employers streamline compliance, track apprentice progress, coordinate RTI and OJT, and scale workforce programs more efficiently.
                </p>
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                  <button className="btn-primary" style={{ fontSize: 15, padding: "16px 28px" }} onClick={openAssessment}>Take the Operations Assessment</button>
                  <button className="btn-ghost" style={{ fontSize: 15, padding: "16px 28px" }} onClick={openDemo}>Book a Demo at ESAC</button>
                </div>
                <div style={{ marginTop: 36, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,.4)", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05rem" }}>Trusted by</div>
                  {["United Airlines","Volvo","UF Health","Pearce Renewables","Frederick CC"].map(n => (
                    <span key={n} style={{ fontSize: 12, color: "rgba(255,255,255,.5)", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 20, padding: "4px 10px", fontWeight: 600 }}>{n}</span>
                  ))}
                </div>
              </FadeIn>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <FadeIn delay={0.1}>
                {/* IMAGE PLACEHOLDER — HERO: Replace IMAGES.hero with your photo */}
                <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid rgba(255,255,255,.1)", position: "relative" }}>
                  <img src={IMAGES.hero} alt="Apprentice at work — replace with your photo" style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(27,24,68,.8) 0%, transparent 55%)" }} />
                  <div style={{ position: "absolute", bottom: 12, left: 14, right: 14 }}>
                    <div style={{ fontSize: 11, color: "#F28627", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06rem", marginBottom: 4 }}>Live Platform</div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>Real-time apprentice progress tracking across every program</div>
                  </div>
                </div>
              </FadeIn>
              {STATS.map((s, i) => (
                <FadeIn key={s.label} delay={i * 0.08 + 0.2}>
                  <div style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 12, padding: "16px 22px", display: "flex", alignItems: "center", gap: 18 }}>
                    <div style={{ fontSize: "clamp(22px,3vw,34px)", fontWeight: 900, color: "#F28627", lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontSize: 14, color: "rgba(255,255,255,.7)", fontWeight: 600 }}>{s.label}</div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section id="problem" className="section section-alt">
        <div className="container">
          <FadeIn>
            <div className="eyebrow">The Challenge</div>
            <div className="divider" />
            <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 900, lineHeight: 1.15, maxWidth: 680, marginBottom: 16 }}>
              Apprenticeship Expansion Often Breaks at the <span className="orange">Operational Level</span>
            </h2>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,.7)", maxWidth: 620, marginBottom: 48, lineHeight: 1.65 }}>
              The vision is clear. The regulatory framework exists. But between sponsors, colleges, employers, and workforce boards — the operational reality is fragmented and exhausting.
            </p>
          </FadeIn>
          {/* IMAGE PLACEHOLDER — PROBLEM BANNER: Replace IMAGES.problem (1400×500px, subject on RIGHT side) */}
          <FadeIn delay={0.1}>
            <div style={{ borderRadius: 16, overflow: "hidden", marginBottom: 48, border: "2px solid rgba(242,134,39,.2)", position: "relative", minHeight: 260 }}>
              {/* Background image — right side */}
              <img src={IMAGES.problem} alt="Workforce training — replace with your photo" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", display: "block" }} />
              {/* Gradient: solid navy left → transparent right so image shows on right */}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, #1b1844 0%, #1b1844 40%, rgba(27,24,68,.75) 65%, rgba(27,24,68,.2) 100%)" }} />
              {/* Orange left accent bar */}
              <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 4, background: "#F28627" }} />
              {/* Text content */}
              <div style={{ position: "relative", padding: "40px 48px", maxWidth: "58%" }}>
                <div style={{ fontSize: 11, color: "#F28627", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1rem", marginBottom: 14 }}>What we hear from program administrators</div>
                <div style={{ fontSize: "clamp(18px,2.4vw,26px)", fontWeight: 900, lineHeight: 1.35, marginBottom: 14 }}>
                  "We were managing 3 programs across 12 spreadsheets. Something had to change."
                </div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,.5)", fontWeight: 600 }}>— Common feedback from apprenticeship administrators across the country</div>
              </div>
            </div>
          </FadeIn>
          <div className="grid-4">
            {PROBLEMS.map((p, i) => (
              <FadeIn key={p.title} delay={i * 0.06}>
                <div className="card" style={{ padding: "24px 20px", height: "100%" }}>
                  <div style={{ fontSize: 26, marginBottom: 10 }}>{p.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 8 }}>{p.title}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,.6)", lineHeight: 1.6 }}>{p.desc}</div>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.3}>
            <div style={{ marginTop: 40, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 14, padding: "28px 32px" }}>
              <div style={{ textAlign: "center", marginBottom: 20, fontSize: 13, fontWeight: 800, color: "rgba(255,255,255,.45)", textTransform: "uppercase", letterSpacing: ".06rem" }}>From Fragmentation → To GoSprout</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
                {["Spreadsheets","Email Chains","Manual Reports","Disconnected Tools"].map((s, i) => (
                  <div key={s} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.09)", borderRadius: 8, padding: "9px 14px", fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,.45)" }}>{s}</div>
                    {i < 3 && <div style={{ color: "rgba(255,255,255,.2)", fontSize: 14 }}>→</div>}
                  </div>
                ))}
                <div style={{ color: "#F28627", fontSize: 20, fontWeight: 900 }}>→</div>
                <div style={{ background: "rgba(242,134,39,.12)", border: "1px solid rgba(242,134,39,.3)", borderRadius: 10, padding: "12px 22px", fontSize: 15, fontWeight: 900, color: "#F28627" }}>GoSprout</div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ASSESSMENT SECTION */}
      <section id="assessment" className="section">
        <div className="container">
          <FadeIn>
            <div style={{ textAlign: "center", maxWidth: 680, margin: "0 auto 52px" }}>
              <div className="eyebrow">Free Tool — 8 Minutes</div>
              <div className="divider" style={{ margin: "16px auto 28px" }} />
              <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 900, lineHeight: 1.15, marginBottom: 18 }}>
                Apprenticeship Operations <span className="orange">Assessment</span>
              </h2>
              <p style={{ fontSize: 17, color: "rgba(255,255,255,.7)", lineHeight: 1.65 }}>
                Evaluate how your program compares across 7 operational dimensions. Receive a benchmarked report with GoSprout recommendations for your specific gaps.
              </p>
            </div>
          </FadeIn>
          <div className="grid-3" style={{ marginBottom: 40 }}>
            {ASSESSMENT_STEPS.map((c, i) => (
              <FadeIn key={c.category} delay={i * 0.06}>
                <div className="card" style={{ padding: "26px 22px", cursor: "pointer" }} onClick={openAssessment}>
                  <div style={{ fontSize: 28, marginBottom: 12 }}>{c.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 8 }}>{c.category}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,.55)", lineHeight: 1.6, marginBottom: 16 }}>{c.question}</div>
                  <div style={{ height: 4, background: "rgba(255,255,255,.07)", borderRadius: 4 }}>
                    <div style={{ height: "100%", width: `${38 + i * 9}%`, background: "linear-gradient(90deg,#F28627,#fba84a)", borderRadius: 4 }} />
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,.35)", marginTop: 6 }}>Benchmark available</div>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.3}>
            <div style={{ textAlign: "center" }}>
              <button className="btn-primary" style={{ fontSize: 16, padding: "18px 48px" }} onClick={openAssessment}>Start the Free Assessment →</button>
              <div style={{ marginTop: 12, fontSize: 13, color: "rgba(255,255,255,.35)" }}>Takes ~8 minutes · Instant benchmarked report · No obligation</div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* WHO WE SUPPORT */}
      <section id="who" className="section section-alt">
        <div className="container">
          <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center", marginBottom: 60 }}>
            <FadeIn>
              <div className="eyebrow">Ecosystem</div>
              <div className="divider" />
              <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 900, lineHeight: 1.15, marginBottom: 14 }}>Who We <span className="orange">Support</span></h2>
              <p style={{ fontSize: 17, color: "rgba(255,255,255,.7)", lineHeight: 1.65 }}>Built for every stakeholder in the apprenticeship ecosystem — from sponsors to employers to colleges to workforce boards.</p>
            </FadeIn>
            <FadeIn delay={0.2}>
              {/* IMAGE PLACEHOLDER — WHO WE SUPPORT: Replace IMAGES.whoSupport */}
              <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid rgba(255,255,255,.1)" }}>
                <img src={IMAGES.whoSupport} alt="Team collaboration — replace with your photo" style={{ width: "100%", height: 250, objectFit: "cover", display: "block" }} />
              </div>
            </FadeIn>
          </div>
          <div className="grid-4">
            {WHO.map((w, i) => (
              <FadeIn key={w.title} delay={i * 0.09}>
                <div className="card" style={{ padding: "30px 22px", height: "100%" }}>
                  <div style={{ fontSize: 34, marginBottom: 16 }}>{w.icon}</div>
                  <div style={{ fontWeight: 900, fontSize: 16, marginBottom: 10 }}>{w.title}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,.6)", lineHeight: 1.65, marginBottom: 18 }}>{w.desc}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{w.tags.map(t => <span key={t} className="tag">{t}</span>)}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CASE STUDIES */}
      <section id="trust" className="section">
        <div className="container">
          <FadeIn>
            <div className="eyebrow">Trusted Across Industries</div>
            <div className="divider" />
            <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 900, lineHeight: 1.15, marginBottom: 14 }}>Powering <span className="orange">Real Programs</span></h2>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,.7)", maxWidth: 540, marginBottom: 52, lineHeight: 1.65 }}>From aviation to clean energy, from community colleges to Fortune 500 employers — GoSprout supports apprenticeship operations at every scale.</p>
          </FadeIn>
          <div className="grid-3">
            {CASES.map((c, i) => (
              <FadeIn key={c.org} delay={i * 0.05}>
                <div className="case-card">
                  {/* IMAGE PLACEHOLDER — CASE STUDY: replace each IMAGES.caseXXX */}
                  <div style={{ position: "relative" }}>
                    <img src={c.img} alt={`${c.org} — replace with customer photo`} style={{ width: "100%", height: 170, objectFit: "cover", display: "block" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(27,24,68,.92) 0%, transparent 55%)" }} />
                    <div style={{ position: "absolute", bottom: 10, left: 12 }}>
                      <span style={{ fontSize: 10, background: "rgba(242,134,39,.9)", color: "#fff", fontWeight: 700, borderRadius: 4, padding: "2px 7px", textTransform: "uppercase", letterSpacing: ".04rem" }}>{c.industry}</span>
                    </div>
                  </div>
                  <div style={{ padding: "20px 20px 22px", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 34, height: 34, background: c.color, border: "1px solid rgba(255,255,255,.15)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 10, color: "#fff", flexShrink: 0 }}>{c.initials}</div>
                      <div style={{ fontWeight: 800, fontSize: 14 }}>{c.org}</div>
                    </div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,.6)", lineHeight: 1.6 }}>{c.outcome}</div>
                    {c.quote && (
                      <div style={{ borderLeft: "2px solid rgba(242,134,39,.35)", paddingLeft: 10 }}>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,.5)", lineHeight: 1.55, fontStyle: "italic" }}>"{c.quote}"</div>
                        {c.quoteBy && <div style={{ fontSize: 11, color: "#F28627", fontWeight: 700, marginTop: 5 }}>— {c.quoteBy}</div>}
                      </div>
                    )}
                    <button style={{ background: "none", border: "none", color: "#F28627", fontSize: 13, fontWeight: 700, cursor: "pointer", textAlign: "left", padding: 0, fontFamily: "'Montserrat',sans-serif", marginTop: "auto" }} onClick={openDemo}>Read Case Study →</button>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* PLATFORM */}
      <section id="platform" className="section section-alt">
        <div className="container">
          <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center", marginBottom: 60 }}>
            <FadeIn>
              <div className="eyebrow">Platform</div>
              <div className="divider" />
              <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 900, lineHeight: 1.15, marginBottom: 14 }}>Everything Needed to Manage <span className="orange">Apprenticeship Operations</span></h2>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,.7)", lineHeight: 1.65, marginBottom: 24 }}>One platform. Every stakeholder. Full program lifecycle — from enrollment to completion.</p>
              <button className="btn-primary" style={{ fontSize: 14 }} onClick={openDemo}>See a Live Demo</button>
            </FadeIn>
            <FadeIn delay={0.2}>
              {/* IMAGE PLACEHOLDER — PLATFORM: Replace IMAGES.platform with a dashboard screenshot */}
              <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid rgba(255,255,255,.1)" }}>
                <img src={IMAGES.platform} alt="GoSprout dashboard — replace with actual screenshot" style={{ width: "100%", height: 270, objectFit: "cover", display: "block" }} />
              </div>
            </FadeIn>
          </div>
          <div className="grid-3">
            {CAPABILITIES.map((c, i) => (
              <FadeIn key={c.title} delay={i * 0.07}>
                <div className="card" style={{ padding: "28px 24px" }}>
                  <div style={{ width: 46, height: 46, background: "rgba(242,134,39,.1)", border: "1px solid rgba(242,134,39,.2)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 16 }}>{c.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 8 }}>{c.title}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,.6)", lineHeight: 1.65 }}>{c.desc}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ESAC */}
      <section id="esac" className="section" style={{ background: "linear-gradient(160deg,#1b1844 0%,#262261 100%)" }}>
        <div className="container">
          <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: 60, alignItems: "start" }}>
            <FadeIn>
              <div className="eyebrow">Find Us at ESAC 2026</div>
              <div className="divider" />
              <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 900, lineHeight: 1.15, marginBottom: 18 }}>Meet GoSprout at <span className="orange">ESAC 2026</span></h2>
              <p style={{ fontSize: 17, color: "rgba(255,255,255,.7)", lineHeight: 1.65, marginBottom: 28 }}>The Eastern Seaboard Apprenticeship Conference brings together workforce leaders, sponsors, colleges, and employers building the future of Registered Apprenticeship. Come see GoSprout in action.</p>
              {/* IMAGE PLACEHOLDER — CONFERENCE: Replace IMAGES.conference */}
              <div style={{ borderRadius: 12, overflow: "hidden", marginBottom: 28, border: "1px solid rgba(255,255,255,.1)" }}>
                <img src={IMAGES.conference} alt="Conference — replace with ESAC or GoSprout event photo" style={{ width: "100%", height: 190, objectFit: "cover", display: "block" }} />
              </div>
              {["Live platform demonstrations","Apprenticeship Operations Assessment sessions","One-on-one program consultations","Case study presentations from GoSprout customers"].map(item => (
                <div key={item} style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 20, height: 20, background: "rgba(242,134,39,.15)", border: "1px solid rgba(242,134,39,.35)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#F28627", fontWeight: 900, flexShrink: 0, marginTop: 2 }}>✓</div>
                  <div style={{ fontSize: 15, color: "rgba(255,255,255,.72)" }}>{item}</div>
                </div>
              ))}
              <div style={{ display: "flex", gap: 14, marginTop: 28, flexWrap: "wrap" }}>
                <button className="btn-primary" style={{ fontSize: 15, padding: "16px 28px" }} onClick={openDemo}>Schedule a Demo Meeting</button>
                <button className="btn-ghost" style={{ fontSize: 15, padding: "16px 28px" }} onClick={openAssessment}>Take the Assessment</button>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="card" style={{ padding: "32px 28px", borderColor: "rgba(242,134,39,.2)" }}>
                <div style={{ background: "rgba(242,134,39,.1)", border: "1px solid rgba(242,134,39,.2)", borderRadius: 10, padding: "16px 18px", marginBottom: 24 }}>
                  <div style={{ fontWeight: 900, fontSize: 20, color: "#F28627", marginBottom: 4 }}>ESAC 2026</div>
                  <div style={{ fontSize: 14, color: "rgba(255,255,255,.6)" }}>Eastern Seaboard Apprenticeship Conference</div>
                </div>
                {[["📅","Conference Dates","2026 — Dates TBA"],["📍","Location","Eastern Seaboard Region"],["🏢","GoSprout Booth","Stop by for a live demo"],["📋","Assessment Sessions","Book a 20-min slot"]].map(([icon, label, val]) => (
                  <div key={label} style={{ display: "flex", gap: 12, marginBottom: 18 }}>
                    <div style={{ fontSize: 18, flexShrink: 0 }}>{icon}</div>
                    <div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,.35)", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05rem", marginBottom: 2 }}>{label}</div>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>{val}</div>
                    </div>
                  </div>
                ))}
                <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 10, padding: "14px 16px", marginBottom: 22 }}>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,.55)", lineHeight: 1.6, fontStyle: "italic" }}>"GoSprout has completely transformed how we support our apprentices. It simplified our admin work and made a huge difference in retention."</div>
                  <div style={{ fontSize: 11, color: "#F28627", fontWeight: 700, marginTop: 8 }}>— Tatenda Mahaka, Miami EdTech</div>
                </div>
                <button className="btn-primary" style={{ width: "100%", textAlign: "center", fontSize: 15 }} onClick={openDemo}>Reserve Your Demo Slot →</button>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="section" style={{ background: "#16143a", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 50% 50%, rgba(242,134,39,.05) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div className="container" style={{ position: "relative" }}>
          <FadeIn>
            <div style={{ marginBottom: 24 }}><GoSproutIcon size={44} /></div>
            <div className="eyebrow" style={{ marginBottom: 16 }}>Get Started</div>
            <h2 style={{ fontSize: "clamp(28px,4vw,52px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 18 }}>
              Ready to Modernize<br /><span className="orange">Apprenticeship Operations?</span>
            </h2>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,.6)", maxWidth: 520, margin: "0 auto 44px", lineHeight: 1.65 }}>
              Join the workforce organizations, colleges, sponsors, and employers using GoSprout as the operational backbone of their apprenticeship programs.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <button className="btn-primary" style={{ fontSize: 15, padding: "18px 32px" }} onClick={openAssessment}>Take the Assessment</button>
              <button className="btn-primary" style={{ fontSize: 15, padding: "18px 32px" }} onClick={openDemo}>Schedule a Demo</button>
              <button className="btn-ghost" style={{ fontSize: 15, padding: "18px 32px" }} onClick={openDemo}>Download Case Studies</button>
            </div>
            <div style={{ marginTop: 52, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, maxWidth: 660, margin: "52px auto 0", background: "rgba(255,255,255,.04)", borderRadius: 14, border: "1px solid rgba(255,255,255,.07)", overflow: "hidden" }}>
              {[["$1.47","Average employer ROI per $1 invested"],["97%","of employers recommend apprenticeship"],["91%","of apprentices still employed after 9 months"]].map(([val, label]) => (
                <div key={val} style={{ padding: "22px 18px", textAlign: "center", borderRight: "1px solid rgba(255,255,255,.05)" }}>
                  <div style={{ fontSize: 26, fontWeight: 900, color: "#F28627", marginBottom: 6 }}>{val}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,.4)", lineHeight: 1.5 }}>{label}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#0f0d2a", padding: "32px 24px", borderTop: "1px solid rgba(255,255,255,.06)" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <GoSproutLogo size={22} />
          <div style={{ fontSize: 12, color: "rgba(255,255,255,.25)" }}>© 2026 GoSprout · The Operating System for Apprenticeship Programs · gosprout.app</div>
          <div style={{ display: "flex", gap: 18 }}>
            {["Privacy","Terms","Contact"].map(l => (
              <button key={l} style={{ background: "none", border: "none", color: "rgba(255,255,255,.25)", fontSize: 12, cursor: "pointer", fontFamily: "'Montserrat',sans-serif", fontWeight: 600 }}>{l}</button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}