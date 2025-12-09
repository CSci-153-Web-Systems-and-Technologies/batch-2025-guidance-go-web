import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0b1220] text-gray-300 mt-16">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-6 h-6 rounded-full border-2 border-blue-500" />
            <span className="text-white font-semibold">GuidanceGo</span>
          </div>
          <p className="text-sm text-gray-400">
            Professional counseling services made
            accessible and convenient for everyone.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
            </li>
            <li>
              <Link href="/aboutpage" className="hover:text-white transition-colors">About</Link>
            </li>
            <li>
              <Link href="/servicespage" className="hover:text-white transition-colors">Services</Link>
            </li>
            <li>
              <Link href="/contactpage" className="hover:text-white transition-colors">Contact</Link>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-white font-semibold mb-3">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li>Terms of Service</li>
            <li>Privacy Policy</li>
            <li>HIPAA Compliance</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-3">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="mailto:support@guidancego.com" className="hover:text-white transition-colors">support@guidancego.com</a>
            </li>
            <li>1-800-GUIDANCE</li>
            <li>Available 24/7</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-6 text-center text-xs text-gray-500">
          © 2024 GuidanceGo. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
