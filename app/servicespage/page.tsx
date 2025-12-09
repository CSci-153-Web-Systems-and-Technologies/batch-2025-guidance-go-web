type Service = {
  title: string;
  description: string;
};

const services: Service[] = [
  {
    title: "Online Counseling",
    description: "Meet your counselor via Google Meet from anywhere.",
  },
  {
    title: "In-Person Counseling",
    description: "Confidential sessions held at the campus counseling office.",
  },
  {
    title: "Academic & Career Guidance",
    description: "Plan courses, improve study habits, and explore career paths.",
  },
  {
    title: "Mental Health Support",
    description: "Get support for stress, anxiety, and overall wellbeing.",
  },
  {
    title: "Crisis Check-in",
    description: "Quick check-ins when you need immediate assistance.",
  },
  {
    title: "Anonymous Student Support",
    description: "Ask for help privately without revealing your identity.",
  },
];

export default function ServicesPage() {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-blue-700">Our Services</h1>
        <p className="mt-2 max-w-3xl text-zinc-600">
          GuidanceGo offers a range of student-centered services. Here are a few of
          the ways we can help you.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <article
            key={i}
            className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <h3 className="text-lg font-semibold text-zinc-900">{s.title}</h3>
            <p className="mt-2 text-sm text-zinc-600">{s.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
