export default function AboutPage() {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-blue-700">About GuidanceGo</h1>
        <p className="mt-2 max-w-3xl text-zinc-600">
          GuidanceGo is a web-based counseling appointment scheduler designed to make
          it simple for students to connect with counselors and get support when
          they need it most.
        </p>
      </header>

      <div className="space-y-3">
        <p className="text-zinc-700">
          Built for <span className="font-semibold">Visayas State University</span> students, GuidanceGo
          streamlines booking and managing counseling sessions with a modern, secure
          experience.
        </p>
        <ul className="list-disc space-y-2 pl-6 text-zinc-700">
          <li>Easily book counseling sessions online</li>
          <li>Choose between in-person or Google Meet sessions</li>
          <li>Get reminders so you never miss an appointment</li>
          <li>Request help anonymously when needed</li>
          <li>Fast, student-friendly interface accessible on any device</li>
        </ul>
      </div>
    </section>
  );
}
