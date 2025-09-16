"use client";
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const lastScroll = useRef(0);
  const [hidden, setHidden] = useState(false);
  const [elevated, setElevated] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setElevated(y > 24);
      if (Math.abs(y - lastScroll.current) < 4) return;
      if (y > lastScroll.current && y > 80) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScroll.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const linkBase = "text-base-subtler hover:text-base-text transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-sm";

  return (
    <div className={`fixed top-0 inset-x-0 z-50 transition-transform duration-300 ease-out ${hidden ? '-translate-y-full' : 'translate-y-0'}`}>
      <nav className={`mx-auto max-w-7xl px-6 py-4 flex items-center justify-between rounded-b-xl transition-all duration-300 backdrop-saturate-150 ${elevated ? 'backdrop-blur bg-white/70 shadow-sm ring-1 ring-black/5' : 'bg-transparent'} motion-safe:shadow-sm`}
        aria-label="Primary">
        <Link href="/" className="font-serif text-xl tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-sm">
          Cal Check
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/" className={`${linkBase} ${pathname === '/' ? 'text-base-text font-medium' : ''}`}>New Goal</Link>
          <Link href="/goals" className={`${linkBase} ${pathname?.startsWith('/goals') ? 'text-base-text font-medium' : ''}`}>Goals</Link>
          <a href="https://github.com/adh1rajsingh/cal-check" target="_blank" rel="noreferrer" className={linkBase}>GitHub</a>
        </div>
      </nav>
    </div>
  );
}
