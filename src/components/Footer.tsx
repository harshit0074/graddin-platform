import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-[#E8DFD3] bg-[#F5EFEB] text-[#1C140E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-[#2C1B14] text-[#FAF7F2] flex items-center justify-center font-serif text-lg font-bold">
                G
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#1C140E]">
                GRADD<span className="text-[#C99A6B]">In</span>
              </span>
            </div>
            <p className="text-sm text-[#72635A] max-w-sm leading-relaxed">
              The place where ambitious students meet the startups building what comes next. High-impact internships, authentic teams, zero busywork.
            </p>
            <div className="pt-2 text-xs text-[#8C7A70]">
              © {new Date().getFullYear()} GRADDIn Platform Inc. All rights reserved.
            </div>
          </div>

          {/* Column 1: For Students */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#2C1B14]">For Students</h4>
            <ul className="space-y-2 text-sm text-[#72635A]">
              <li><Link href="/internships" className="hover:text-[#1C140E] transition-colors">Browse Internships</Link></li>
              <li><Link href="/signup" className="hover:text-[#1C140E] transition-colors">Create Student Profile</Link></li>
              <li><Link href="/student/applications" className="hover:text-[#1C140E] transition-colors">Application Tracker</Link></li>
              <li><Link href="/internships?role_type=Remote" className="hover:text-[#1C140E] transition-colors">Remote Opportunities</Link></li>
            </ul>
          </div>

          {/* Column 2: For Startups */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#2C1B14]">For Startups</h4>
            <ul className="space-y-2 text-sm text-[#72635A]">
              <li><Link href="/signup" className="hover:text-[#1C140E] transition-colors">Post an Internship</Link></li>
              <li><Link href="/company/dashboard" className="hover:text-[#1C140E] transition-colors">Recruiter Dashboard</Link></li>
              <li><Link href="/company/candidates" className="hover:text-[#1C140E] transition-colors">AI Match Ranking</Link></li>
              <li><Link href="/#verification" className="hover:text-[#1C140E] transition-colors">LinkedIn Verification</Link></li>
            </ul>
          </div>

          {/* Column 3: Platform & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#2C1B14]">Company</h4>
            <ul className="space-y-2 text-sm text-[#72635A]">
              <li><Link href="/#about" className="hover:text-[#1C140E] transition-colors">Our Philosophy</Link></li>
              <li><Link href="/#faq" className="hover:text-[#1C140E] transition-colors">Frequently Asked</Link></li>
              <li><Link href="/settings" className="hover:text-[#1C140E] transition-colors">Privacy & Terms</Link></li>
              <li className="pt-2">
                <span className="inline-flex items-center gap-1.5 text-xs text-[#72635A] bg-[#EADBCE]/50 px-2.5 py-1 rounded-md border border-[#DFD5C6]">
                  🌐 Language: English (US)
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
