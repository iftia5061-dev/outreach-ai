'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className = '' }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/prospects', label: 'Prospects' },
    { href: '/leads', label: 'Leads' },
    { href: '/ai-inbox', label: 'AI Inbox' },
    { href: '/email', label: 'Email' },
    { href: '/whatsapp', label: 'WhatsApp' },
    { href: '/linkedin', label: 'LinkedIn' },
    { href: '/conversations', label: 'Conversations' },
    { href: '/campaigns', label: 'Campaigns' },
    { href: '/ai-assistant', label: 'AI Assistant' },
    { href: '/knowledge-base', label: 'Knowledge Base' },
    { href: '/calendar', label: 'Calendar' },
    { href: '/meetings', label: 'Meetings' },
    { href: '/analytics', label: 'Analytics' },
    { href: '/telephone-ai', label: 'Telephone AI' },
    { href: '/ai-settings', label: 'AI Settings' },
    { href: '/clients', label: 'Clients' },
    { href: '/settings', label: 'Settings' },
  ];

  return (
    <div className={`w-52 bg-gray-900 flex flex-col ${className}`}>
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-base font-semibold text-white">OutreachAI</h1>
        <p className="text-xs text-gray-400">Admin panel</p>
      </div>
      <nav className="flex flex-col py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors ${
                isActive
                  ? 'text-white bg-blue-500'
                  : 'text-gray-400 hover:bg-gray-800'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
