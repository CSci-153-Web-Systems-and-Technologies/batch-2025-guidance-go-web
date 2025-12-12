export function HeroCard() {
  return (
    <section className="mx-auto max-w-[1200px]">
      {/* Light blue gradient background matching screenshot */}
      <div className="rounded-2xl border bg-gradient-to-br from-[#eaf3ff] via-white to-white p-6 md:p-10">
        <div className="grid gap-6 md:grid-cols-[1fr_380px]">
          {/* Left: headline and CTAs */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              <span className="text-black">Fast & Secure</span>
              <br />
              <span className="text-blue-600">Counseling Scheduler</span>
            </h1>
            <p className="mt-3 max-w-xl text-zinc-600">
              Connect with professional counselors instantly. Schedule appointments, manage sessions, and get the support you
              need with our secure platform.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a className="rounded-md bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-700" href="/studentappointmentdetailspage">View My Appointments</a>
              <a className="rounded-md border border-blue-200 px-5 py-2.5 text-blue-600 hover:bg-blue-50" href="/studentbookappointmentpage">Book a Session</a>
            </div>
          </div>
          {/* Right: next appointment compact card */}
          <div className="flex items-center justify-end">
            <div className="w-full max-w-sm rounded-xl border bg-white p-4 shadow-md">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100" />
                <div>
                  <div className="text-sm font-semibold">Next Appointment</div>
                  <div className="text-xs text-muted">Dr. Sarah Johnson</div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted">Date:</div>
                <div className="text-right">March 15, 2024</div>
                <div className="text-muted">Time:</div>
                <div className="text-right">2:00 PM</div>
                <div className="text-muted">Type:</div>
                <div className="text-right">Individual Session</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
