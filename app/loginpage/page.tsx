export default function LoginPage() {
  return (
    <div className="grid min-h-screen grid-rows-[auto,1fr,auto] bg-zinc-50">
      {/* Navbar */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full border-2 border-blue-600" />
            <span className="text-lg font-semibold text-zinc-900">GuidanceGo</span>
          </div>
          <nav className="hidden gap-6 text-sm text-zinc-700 sm:flex">
            <a href="/" className="hover:text-zinc-900">Home</a>
            <a href="#" className="hover:text-zinc-900">About</a>
            <a href="#" className="hover:text-zinc-900">Services</a>
            <a href="#" className="hover:text-zinc-900">Contact</a>
          </nav>
          <div className="flex items-center gap-2">
            <a href="/loginpage" className="rounded-full px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100">Login</a>
            <a href="#" className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Sign Up</a>
          </div>
        </div>
      </header>

      {/* Hero + Login Card */}
      <main className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center px-6 py-16">
        <div className="flex w-full items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-24 w-24 rounded-full border-4 border-blue-600" />
            <h1 className="text-5xl font-bold text-blue-600">GuidanceGo</h1>
            <p className="mt-2 text-lg text-zinc-600">Fast &amp; Secure Counseling Scheduler</p>
          </div>
        </div>

        <div className="mt-8 w-full max-w-sm">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="mb-4 text-center">
              <div className="mx-auto h-10 w-10 rounded-full bg-blue-50 text-blue-600">👤</div>
              <h2 className="mt-2 text-xl font-semibold text-zinc-900">Welcome</h2>
              <p className="text-sm text-zinc-500">Sign in to your account</p>
            </div>
            <form className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Email</label>
                <input type="email" placeholder="you@example.com" className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-blue-200 focus:ring" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Password</label>
                <input type="password" placeholder="••••••••" className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-blue-200 focus:ring" />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-zinc-700">
                  <input type="checkbox" className="h-4 w-4 rounded border-zinc-300" />
                  Keep me signed in
                </label>
                <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
              </div>
              <button type="button" className="h-10 w-full rounded-full bg-blue-600 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700">Sign In</button>
              <div className="text-center text-sm text-zinc-600">
                Don't have an account? <a href="#" className="text-blue-600 hover:underline">Sign up</a>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-[#0b1220] px-6 py-10 text-sm text-zinc-300">
        <div className="mx-auto grid max-w-6xl grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-3">
            <div className="flex items-center gap-2 text-zinc-100">
              <div className="h-7 w-7 rounded-full border-2 border-blue-500" />
              <span className="font-semibold">GuidanceGo</span>
            </div>
            <p className="mt-2 text-zinc-400">Professional counseling services made accessible and convenient for everyone.</p>
          </div>
          <div className="col-span-6 md:col-span-3">
            <div className="font-semibold text-zinc-100">Services</div>
            <ul className="mt-2 space-y-1">
              <li>Individual Therapy</li>
              <li>Group Therapy</li>
              <li>Emergency Sessions</li>
              <li>Resources</li>
            </ul>
          </div>
          <div className="col-span-6 md:col-span-3">
            <div className="font-semibold text-zinc-100">Legal</div>
            <ul className="mt-2 space-y-1">
              <li>Terms of Service</li>
              <li>Privacy Policy</li>
              <li>HIPAA Compliance</li>
            </ul>
          </div>
          <div className="col-span-12 md:col-span-3">
            <div className="font-semibold text-zinc-100">Contact</div>
            <ul className="mt-2 space-y-1">
              <li>support@guidancego.com</li>
              <li>1-800-GUIDANCE</li>
              <li>Available 24/7</li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-6 max-w-6xl text-center text-zinc-400">© 2024 GuidanceGo. All rights reserved.</div>
      </footer>
    </div>
  );
}
