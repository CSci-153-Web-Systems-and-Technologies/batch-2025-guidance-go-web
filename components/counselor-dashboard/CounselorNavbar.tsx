"use client";

import { Bell, ChevronDown } from "lucide-react";
import Image from "next/image";
import { LogoImage } from "../ui/Logo";
import Link from "next/link";

export function CounselorNavbar() {
  return (
    <header className="sticky top-0 z-30 border-b bg-white">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-8 rounded-full bg-white overflow-hidden ring-2 ring-blue-500">
              <LogoImage fill sizes="32px" className="object-contain" priority />
            </div>
            <span className="font-semibold text-blue-600">GuidanceGo</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link className="text-zinc-700 hover:text-black" href="/">Home</Link>
            <a className="text-zinc-700 hover:text-black" href="#">About</a>
            <a className="text-zinc-700 hover:text-black" href="#">Services</a>
            <a className="text-zinc-700 hover:text-black" href="#">Contact</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-flex items-center rounded-full border px-3 py-1 text-sm text-zinc-700">Counselor View</span>
          <button className="relative rounded-full p-2 hover:bg-muted transition-colors" aria-label="Notifications">
            <Bell className="h-5 w-5 text-zinc-700" />
            <span className="absolute right-1 top-1 inline-block h-2 w-2 rounded-full bg-primary" />
          </button>
          <button className="flex items-center gap-3 rounded-full border px-3 py-2 hover:bg-muted transition-colors">
            <div className="h-8 w-8 rounded-full bg-white" />
            <div className="hidden sm:block text-left">
              <div className="text-sm font-medium text-black">Sarah Johnson</div>
              <div className="text-xs text-zinc-700">Student</div>
            </div>
            <ChevronDown className="h-4 w-4 text-zinc-700" />
          </button>
        </div>
      </div>
      <div className="h-[3px] w-full bg-blue-500/60" />
    </header>
  );
}
