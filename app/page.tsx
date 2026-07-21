const features = [
  {
    icon: "🤖",
    title: "AI Care Assistant",
    description:
      "Turn spoken or written health updates into clear, organized information.",
  },
  {
    icon: "🎙️",
    title: "Voice Accessibility",
    description:
      "Designed for older adults, blind users, and anyone who prefers speaking.",
  },
  {
    icon: "📋",
    title: "Doctor Summary",
    description:
      "Create a concise summary of symptoms, medications, and recent changes.",
  },
  {
    icon: "🚨",
    title: "Emergency Guidance",
    description:
      "Display the appropriate emergency number based on the user’s country.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-3xl">❤️</span>
            <span className="text-xl font-bold text-blue-700">
              CareBridge AI
            </span>
          </div>

          <a
  href="/dashboard"
  className="rounded-full border border-blue-700 px-5 py-2 text-blue-700 font-semibold hover:bg-blue-50 transition"
>
  Try Demo
</a>
        </div>
      </nav>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center">
        <div>
          <div className="mb-5 inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-800">
            AI support for caregivers and families
          </div>

          <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-6xl">
            Smarter care for
            <span className="block text-blue-700">every family.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            CareBridge AI helps family caregivers and people living with
            chronic diseases organize health updates, track changes, and
            prepare clearer information for healthcare professionals.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a
  href="/dashboard"
  className="rounded-full bg-blue-700 px-7 py-3 font-semibold text-white shadow-lg transition hover:bg-blue-800"
>
  Start Health Check-In
</a>

   <a
  href="/dashboard"
  className="rounded-full border border-slate-300 bg-white px-7 py-3 font-semibold text-slate-800 transition hover:bg-slate-100"
>
  🗣 Speak to CareBridge
</a>
          </div>

          <p className="mt-5 text-sm text-slate-500">
            CareBridge provides educational support and does not replace a
            doctor or emergency services.
          </p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Daily check-in</p>
              <h2 className="text-2xl font-bold">Good morning, Maria 👋</h2>
            </div>

            <div className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
              Care plan active
            </div>
          </div>

          <div className="rounded-2xl bg-blue-50 p-5">
            <p className="font-semibold text-blue-900">
              How is your father feeling today?
            </p>

            <p className="mt-2 text-sm text-blue-800">
              Speak naturally or type a short health update.
            </p>

            <div className="mt-5 rounded-xl bg-white p-4 text-slate-500 shadow-sm">
              “His legs look more swollen today, and he seems more tired.”
            </div>

            <button className="mt-4 w-full rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white">
              Analyze Health Update
            </button>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-2xl">💊</p>
              <p className="mt-2 font-semibold">Medications</p>
              <p className="text-sm text-slate-500">3 scheduled today</p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-2xl">📈</p>
              <p className="mt-2 font-semibold">Health Timeline</p>
              <p className="text-sm text-slate-500">View recent changes</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-semibold text-blue-700">Accessible by design</p>

            <h2 className="mt-3 text-4xl font-bold">
              One place to understand what changed
            </h2>

            <p className="mt-4 text-lg text-slate-600">
              CareBridge transforms everyday caregiver observations into
              useful, organized health information.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
              >
                <div className="text-4xl">{feature.icon}</div>
                <h3 className="mt-4 text-xl font-bold">{feature.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-slate-950 px-6 py-8 text-center text-sm text-slate-300">
        <p className="font-semibold text-white">
          ❤️ CareBridge AI — Better information. Better care. Better lives.
        </p>
        <p className="mt-2">
          Prototype created for OpenAI Build Week.
        </p>
      </footer>
    </main>
  );
}