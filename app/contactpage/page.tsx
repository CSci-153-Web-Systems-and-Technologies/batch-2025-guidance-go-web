export default function ContactPage() {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-blue-700">Contact Us</h1>
        <p className="mt-2 max-w-3xl text-zinc-600">
          Have questions or need help scheduling a session? Reach out to the
          GuidanceGo team and we’ll get back to you as soon as possible.
        </p>
      </header>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="text-sm text-zinc-500">Email</div>
        <div className="mt-1 text-lg font-semibold text-zinc-900">
          <a href="mailto:piadopojohnkyle@gmail.com" className="text-blue-600 hover:underline">
            piadopojohnkyle@gmail.com
          </a>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <div>
            <div className="text-sm text-zinc-500">Office</div>
            <div className="font-medium text-zinc-900">Student Counseling Center, VSU</div>
          </div>
          <div>
            <div className="text-sm text-zinc-500">Hours</div>
            <div className="font-medium text-zinc-900">Mon–Fri, 9:00 AM – 5:00 PM</div>
          </div>
        </div>
      </div>
    </section>
  );
}
