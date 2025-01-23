'use client';

import Image from "next/image";
import { useState } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const navigation = [
  { name: 'Team', href: '/team' },
  { name: 'Contact', href: '/contact' },
  { name: 'Events', href: '/events' },
  { name: 'Resources', href: '/resources' },
  { name: 'Directions', href: '/clubroom' },
];

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="flex-1 lg:flex lg:justify-start">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Brooklyn College Computer Science Club</span>
            <Image
              alt="computer science club logo"
              src="/club-logo.png"
              width={130}
              height={129}
              className="h-8 w-auto"
            />
          </Link>
        </div>
        <div className="flex-1 hidden lg:flex lg:justify-center">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-semibold leading-6 text-gray-900 hover:text-bc-red px-4"
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="flex-1 lg:flex lg:justify-end">
          {/* You can add something here for the right side if needed */}
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {/* Mobile menu dialog remains unchanged */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        {/* ... (rest of the mobile menu code) ... */}
      </Dialog>
    </header>
  );
}
