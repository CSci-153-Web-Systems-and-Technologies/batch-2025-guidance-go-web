import Image from "next/image";

export default function SignupPage() {
  return (
    <div className="grid min-h-screen grid-rows-[auto,1fr,auto] bg-zinc-50">
      {/* Navbar */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="GuidanceGo logo" width={32} height={32} priority className="rounded" />
            <span className="text-lg font-semibold text-zinc-900">GuidanceGo</span>
          </div>
          <nav className="hidden gap-6 text-sm text-zinc-700 sm:flex">
            <a href="/" className="hover:text-zinc-900">Home</a>
            <a href="/aboutpage" className="hover:text-zinc-900">About</a>
            <a href="/servicespage" className="hover:text-zinc-900">Services</a>
            <a href="/contactpage" className="hover:text-zinc-900">Contact</a>
          </nav>
          <div className="flex items-center gap-2">
            <a href="/loginpage" className="rounded-full px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100">Login</a>
            <a href="/signuppage" className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Sign Up</a>
          </div>
        </div>
      </header>

      {/* Hero + Signup Card */}
      <main className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center px-6 py-16">
        <div className="flex w-full items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4">
              <Image src="/logo.png" alt="GuidanceGo logo" width={120} height={120} priority className="mx-auto" />
            </div>
            <h1 className="text-5xl font-bold text-blue-600">GuidanceGo</h1>
            <p className="mt-2 text-lg text-zinc-600">Fast &amp; Secure Counseling Scheduler</p>
          </div>
        </div>

        <div className="mt-8 w-full max-w-sm">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="mb-4 text-center">
              <div className="mx-auto h-10 w-10 rounded-full bg-blue-50 text-blue-600">📝</div>
              <h2 className="mt-2 text-xl font-semibold text-zinc-900">Hello</h2>
              <p className="text-sm text-zinc-500">Sign up for your account</p>
            </div>
            <form className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Name</label>
                <input type="text" placeholder="Your name" className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-blue-200 focus:ring" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Email</label>
                <input type="email" placeholder="you@example.com" className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-blue-200 focus:ring" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Password</label>
                <input type="password" placeholder="Create a password" className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-blue-200 focus:ring" />
              </div>
              <button type="button" className="h-10 w-full rounded-full bg-blue-600 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700">Create account</button>
              <div className="text-center text-sm text-zinc-600">Or sign up with</div>
              <div className="flex gap-2">
                <button type="button" className="h-10 flex-1 rounded-full border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50">Microsoft</button>
                <button type="button" className="h-10 flex-1 rounded-full border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50">Google</button>
              </div>
              <div className="text-center text-sm text-zinc-600">
                Already have an account? <a href="/loginpage" className="text-blue-600 hover:underline">Sign in</a>
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
            <div className="font-semibold text-zinc-100">Quick Links</div>
            <ul className="mt-2 space-y-1">
              <li>Home</li>
              <li>About</li>
              <li>Services</li>
              <li>Contact</li>
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
