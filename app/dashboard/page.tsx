"use client";

import { useState, useEffect } from "react";

const medications = [
  {
    name: "Lisinopril",
    dose: "10 mg",
    time: "8:00 AM",
    status: "Taken",
  },
  {
    name: "Metformin",
    dose: "500 mg",
    time: "12:00 PM",
    status: "Due soon",
  },
  {
    name: "Atorvastatin",
    dose: "20 mg",
    time: "8:00 PM",
    status: "Later",
  },
];

const timeline = [
  {
    day: "Today",
    title: "Increased leg swelling",
    description: "Caregiver reported swelling in both legs and more fatigue.",
  },
  {
    day: "Yesterday",
    title: "Weight recorded",
    description: "Weight increased by 2 pounds compared with Monday.",
  },
  {
    day: "Monday",
    title: "Medication completed",
    description: "All scheduled medications were marked as taken.",
  },
];
type TimelineEntry = {
  id: number;
  date: string;
  time: string;
  healthUpdate: string;
  analysis: string;
};
export default function DashboardPage() {
  const [healthUpdate, setHealthUpdate] = useState("");
  const [result, setResult] = useState("");
  const sections = result
  ? result.split(/\n(?=🟡|📋|🤒|⚠️|💡|👨‍⚕️|✅)/)
  : [];
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [transcript, setTranscript] = useState("");
  const [timelineEntries, setTimelineEntries] = useState<TimelineEntry[]>([]);
  const [timelineLoaded, setTimelineLoaded] = useState(false);
  useEffect(() => {
  const savedTimeline = localStorage.getItem("carebridge-timeline");

  if (savedTimeline) {
    try {
      const parsedTimeline = JSON.parse(savedTimeline);
      setTimelineEntries(parsedTimeline);
    } catch (error) {
      console.error("Could not load the saved timeline:", error);
    }
  }

  setTimelineLoaded(true);
}, []);
useEffect(() => {
  if (!timelineLoaded) {
    return;
  }

  localStorage.setItem(
    "carebridge-timeline",
    JSON.stringify(timelineEntries)
  );
}, [timelineEntries, timelineLoaded]);
  function startRecording() {
  const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Speech recognition is not supported in this browser.");
    return;
  }

  const recognitionInstance = new SpeechRecognition();

  recognitionInstance.lang = "en-US";
  recognitionInstance.continuous = false;
  recognitionInstance.interimResults = false;

  recognitionInstance.onstart = () => {
    setRecording(true);
  };

  recognitionInstance.onend = () => {
    setRecording(false);
  };

  recognitionInstance.onresult = (event: any) => {
    const text = event.results[0][0].transcript;

    setTranscript(text);
    setHealthUpdate(text);
  };

  recognitionInstance.start();

  setRecognition(recognitionInstance);
}
function generateDoctorSummary() {
  if (timelineEntries.length === 0) {
    alert("Please create at least one health update first.");
    return;
  }

  const timelineHtml = timelineEntries
    .map(
      (entry) => `
        <div class="timeline-entry">
          <div class="entry-header">
            <strong>${entry.date}</strong>
            <span>${entry.time}</span>
          </div>

          <p><strong>Caregiver update:</strong></p>
          <p>${entry.healthUpdate}</p>

          <p><strong>CareBridge analysis:</strong></p>
          <p class="analysis">${entry.analysis}</p>
        </div>
      `
    )
    .join("");

  const reportWindow = window.open("", "_blank");

  if (!reportWindow) {
    alert("Please allow pop-ups to generate the doctor summary.");
    return;
  }

  reportWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>CareBridge Doctor Summary</title>

        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 40px auto;
            padding: 20px;
            color: #0f172a;
            line-height: 1.6;
          }

          .header {
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }

          .brand {
            color: #1d4ed8;
            font-size: 28px;
            font-weight: bold;
          }

          .patient-card {
            background: #f1f5f9;
            border-radius: 12px;
            padding: 18px;
            margin-bottom: 25px;
          }

          .timeline-entry {
            border: 1px solid #cbd5e1;
            border-radius: 12px;
            padding: 18px;
            margin-bottom: 20px;
            page-break-inside: avoid;
          }

          .entry-header {
            display: flex;
            justify-content: space-between;
            color: #1d4ed8;
          }

          .analysis {
            white-space: pre-wrap;
          }

          .disclaimer {
            margin-top: 30px;
            padding: 15px;
            background: #fff7ed;
            border: 1px solid #fdba74;
            border-radius: 10px;
            font-size: 13px;
          }

          @media print {
            button {
              display: none;
            }
          }
        </style>
      </head>

      <body>
        <div class="header">
          <div class="brand">💗 CareBridge AI</div>
          <p>Doctor Visit Summary</p>
        </div>

        <div class="patient-card">
          <h2>Patient Information</h2>
          <p><strong>Name:</strong> Robert Johnson</p>
          <p><strong>Conditions:</strong> Heart failure · Diabetes</p>
          <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
        </div>

        <h2>Recent Health Timeline</h2>

        ${timelineHtml}

        <div class="disclaimer">
          CareBridge AI provides educational and organizational support only.
          It does not diagnose conditions or replace professional medical care
          or emergency services.
        </div>

        <br />

        <button onclick="window.print()">
          Print or Save as PDF
        </button>
      </body>
    </html>
  `);

  reportWindow.document.close();
}
async function analyzeHealthUpdate() {
  
  if (!healthUpdate.trim()) {
    setResult("Please enter a health update before analyzing.");
    return;
  }

  setLoading(true);
  setResult("");

  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        healthUpdate,
      }),
    });

    if (!response.ok) {
      throw new Error("The analysis request failed.");
    }

    const data = await response.json();

    setResult(data.message);
    const now = new Date();

const newEntry: TimelineEntry = {
  id: Date.now(),
  date: now.toLocaleDateString(),
  time: now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }),
  healthUpdate,
  analysis: data.message,
};

setTimelineEntries((prev) => [newEntry, ...prev]);
    
  } catch (error) {
    console.error(error);
    setResult(
      "CareBridge could not analyze this update. Please try again."
    );
  } finally {
    setLoading(false);
  }
}
  return (  
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">❤️</span>

            <div>
              <p className="text-xl font-bold text-blue-700">CareBridge AI</p>
              <p className="text-xs text-slate-500">
                Smarter Care for Every Family
              </p>
            </div>
          </div>

          <button className="rounded-full bg-red-50 px-5 py-2 font-semibold text-red-700">
            🚨 Emergency Help
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-3xl bg-slate-950 p-5 text-white">
          <div className="mb-8">
            <p className="text-sm text-slate-400">Current profile</p>
            <p className="mt-1 text-xl font-bold">Robert Johnson</p>
            <p className="text-sm text-slate-400">
              Heart failure · Diabetes
            </p>
          </div>

          <nav className="space-y-2">
            <button className="w-full rounded-xl bg-blue-600 px-4 py-3 text-left font-semibold">
              🏠 Dashboard
            </button>

            <button className="w-full rounded-xl px-4 py-3 text-left text-slate-300 hover:bg-slate-800">
              🤖 AI Assistant
            </button>

            <button className="w-full rounded-xl px-4 py-3 text-left text-slate-300 hover:bg-slate-800">
              💊 Medications
            </button>

            <button className="w-full rounded-xl px-4 py-3 text-left text-slate-300 hover:bg-slate-800">
              📈 Health Timeline
            </button>

            <button className="w-full rounded-xl px-4 py-3 text-left text-slate-300 hover:bg-slate-800">
              📄 Doctor Summary
            </button>
          </nav>

          <div className="mt-10 rounded-2xl bg-slate-800 p-4">
            <p className="text-sm font-semibold">Accessibility</p>
            <p className="mt-1 text-xs leading-5 text-slate-400">
              Voice, large text, and multilingual support are available.
            </p>
          </div>
        </aside>

        <section>
          <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="font-semibold text-blue-700">
  {new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })}
</p>

              <h1 className="mt-1 text-4xl font-bold">
                Good morning, Maria 👋
              </h1>

              <p className="mt-2 text-slate-600">
                Here is today’s care overview for your father.
              </p>
            </div>

            <button className="rounded-full bg-blue-700 px-6 py-3 font-semibold text-white shadow-lg">
              + Add Health Update
            </button>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
            <div className="space-y-6">
              <article className="rounded-3xl bg-gradient-to-br from-blue-700 to-indigo-700 p-7 text-white shadow-lg">
                <p className="text-sm font-semibold text-blue-100">
                  AI DAILY CHECK-IN
                </p>

                <h2 className="mt-3 text-3xl font-bold">
                  How is Robert feeling today?
                </h2>

                <p className="mt-3 max-w-2xl leading-7 text-blue-100">
                  Speak naturally or type what you noticed. CareBridge will
                  organize the update and help prepare useful questions for
                  the healthcare team.
                 </p>

                 <div className="mt-6 rounded-2xl bg-white/10 p-4">
                  <textarea 
                  value={healthUpdate}
                  onChange={(e) => setHealthUpdate(e.target.value)}
                  className="min-h-28 w-full resize-none bg-transparent text-white outline-none placeholder:text-blue-200"
                  placeholder="Example: His legs are more swollen today, and he seems more tired..."/>

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <button
                      onClick={analyzeHealthUpdate}
                      disabled={loading}
                      className="rounded-xl bg-white px-5 py-3 font-semibold text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                     >
                     {loading ? "⏳ Analyzing..." : "Analyze Update"}
                      </button>

                     <button
  onClick={startRecording}
  className="rounded-xl border border-white/40 px-5 py-3 font-semibold text-white"
>
  🎙 {recording ? "Listening..." : "Record Voice"}
</button>
                      </div>
                      {result && (
                      <div className="mt-6 rounded-2xl border border-emerald-300 bg-emerald-50 p-5 text-left">
                      <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-2xl">
                     🤖
                      </div>

                      <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                     AI Care Assistant
                    </p>
                   <h3 className="font-bold text-emerald-950">
                   CareBridge AI Analysis
                </h3>
                </div>
                </div>

                 <div className="mt-4 space-y-4">
                {sections.map((section, index) => (
                <div
                key={index}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
               >
               <pre className="whitespace-pre-wrap font-sans text-slate-700">
               {section}
               </pre>
               </div>
               ))}
                 </div>

                  <div className="mt-4 rounded-xl bg-white/70 p-3 text-xs leading-5 text-slate-500">
                   CareBridge provides educational and organizational support only. It does
                  not diagnose conditions or replace professional medical care or emergency
                 services.
                  </div>
                  </div>
                )}
                  </div>
                  </article>

                  <article className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                 <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-blue-700">
                      TODAY
                    </p>
                    <h2 className="mt-1 text-2xl font-bold">Medications</h2>
                  </div>

                  <button className="font-semibold text-blue-700">
                    View all
                  </button>
                </div>

                <div className="mt-5 space-y-3">
                  {medications.map((medication) => (
                    <div
                      key={medication.name}
                      className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center"
                    >
                      <div className="flex items-center gap-4">
                        <div className="rounded-xl bg-blue-50 p-3 text-2xl">
                          💊
                        </div>

                        <div>
                          <p className="font-bold">{medication.name}</p>
                          <p className="text-sm text-slate-500">
                            {medication.dose} · {medication.time}
                          </p>
                        </div>
                      </div>

                      <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                        {medication.status}
                      </span>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div>
                  <p className="text-sm font-semibold text-blue-700">
                    RECENT CHANGES
                  </p>
                  <h2 className="mt-1 text-2xl font-bold">Health Timeline</h2>
                </div>

                <div className="mt-6 space-y-4">
  {timelineEntries.length === 0 ? (
    <p className="text-sm text-slate-500">
      No health updates saved yet.
    </p>
  ) : (
    timelineEntries.map((entry) => (
      <div
        key={entry.id}
        className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
      >
        <div className="flex items-center justify-between gap-4">
          <p className="font-semibold text-blue-700">
            {entry.date}
          </p>

          <p className="text-sm text-slate-500">
            {entry.time}
          </p>
        </div>

        <p className="mt-3 font-semibold text-slate-900">
          Caregiver update
        </p>

        <p className="mt-1 text-sm leading-6 text-slate-600">
          {entry.healthUpdate}
        </p>
      </div>
    ))
  )}
</div>
              </article>
            </div>

            <div className="space-y-6">
              <article className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <p className="text-sm font-semibold text-blue-700">
                  TODAY’S STATUS
                </p>

                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-green-50 p-4">
                    <p className="text-2xl">✅</p>
                    <p className="mt-2 text-2xl font-bold">1</p>
                    <p className="text-sm text-slate-600">Medication taken</p>
                  </div>

                  <div className="rounded-2xl bg-amber-50 p-4">
                    <p className="text-2xl">⏰</p>
                    <p className="mt-2 text-2xl font-bold">2</p>
                    <p className="text-sm text-slate-600">Still scheduled</p>
                  </div>

                  <div className="rounded-2xl bg-blue-50 p-4">
                    <p className="text-2xl">🩺</p>
                    <p className="mt-2 text-2xl font-bold">3</p>
                    <p className="text-sm text-slate-600">Recent updates</p>
                  </div>

                  <div className="rounded-2xl bg-purple-50 p-4">
                    <p className="text-2xl">📄</p>
                    <p className="mt-2 text-2xl font-bold">1</p>
                    <p className="text-sm text-slate-600">Summary ready</p>
                  </div>
                </div>
              </article>

              <article className="rounded-3xl border border-red-200 bg-red-50 p-6">
                <p className="text-sm font-semibold text-red-700">
                  SAFETY SUPPORT
                </p>

                <h2 className="mt-2 text-2xl font-bold text-red-950">
                  Emergency help
                </h2>

                <p className="mt-3 leading-7 text-red-900">
                  For severe breathing difficulty, chest pain, unconsciousness,
                  or another life-threatening emergency, call local emergency
                  services immediately.
                </p>

                <button className="mt-5 w-full rounded-xl bg-red-700 px-5 py-3 font-semibold text-white">
                  Call 911 — United States
                </button>
              </article>

              <article className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <p className="text-sm font-semibold text-blue-700">
                  DOCTOR VISIT
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  Summary ready to review
                </h2>

                <p className="mt-3 leading-7 text-slate-600">
                  CareBridge has organized Robert’s recent symptoms,
                  medications, and timeline into a concise visit summary.
                </p>

                <button
                 onClick={generateDoctorSummary}
                 className="mt-5 w-full rounded-xl border border-blue-700 px-5 py-3 font-semibold text-blue-700">
                  View Doctor Summary
                </button>
              </article>
            </div>
          </div>
        </section>
      </div>

      <footer className="border-t border-slate-200 bg-white px-6 py-5 text-center text-xs text-slate-500">
        CareBridge provides educational and organizational support. It does not
        diagnose conditions or replace professional medical care.
      </footer>
    </main>
  );
}