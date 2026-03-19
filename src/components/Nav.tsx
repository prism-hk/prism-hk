"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";

type NavLink = {
  href: string;
  key: string;
  label?: { en: string; zh: string };
  children?: { href: string; label: { en: string; zh: string } }[];
};

const navLinks: NavLink[] = [
  { href: "/", key: "home" },
  { href: "/directory", key: "directory" },
  {
    href: "/health",
    key: "health",
    children: [
      { href: "/health", label: { en: "Health & Support", zh: "健康支援" } },
      {
        href: "/emergency",
        label: { en: "Emergency Services", zh: "緊急服務" },
      },
    ],
  },
  { href: "/events", key: "events" },
  {
    href: "/learn",
    key: "learn",
    children: [
      { href: "/learn", label: { en: "About Us", zh: "關於我們" } },
      {
        href: "/learn/resources",
        label: { en: "Educational Resources", zh: "教育資源" },
      },
    ],
  },
  { href: "/get-involved", key: "getInvolved" },
  { href: "/support", key: "support" },
];

export default function Nav() {
  const { language } = useLanguage();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpandedKey, setMobileExpandedKey] = useState<string | null>(
    null
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#E8E6F0]">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <span
            className="text-xl font-bold bg-gradient-to-r from-[#7B68EE] to-[#E879F9] bg-clip-text text-transparent"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            PRISM
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            if (link.children) {
              return (
                <div key={link.href} className="relative group">
                  <Link
                    href={link.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "text-[#7B68EE] bg-[#7B68EE]/10"
                        : "text-[#1E1B3A] hover:text-[#7B68EE] hover:bg-[#7B68EE]/5"
                    }`}
                  >
                    {t(link.key as any, language)}
                  </Link>

                  {/* Dropdown */}
                  <div className="absolute top-full left-0 pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
                    <div className="bg-white rounded-lg shadow-lg border border-[#E8E6F0] py-1 min-w-[200px]">
                      {link.children.map((child) => {
                        const childActive = pathname === child.href;
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`block px-4 py-2.5 text-sm font-medium transition-colors ${
                              childActive
                                ? "text-[#7B68EE] bg-[#7B68EE]/10"
                                : "text-[#1E1B3A] hover:text-[#7B68EE] hover:bg-[#7B68EE]/5"
                            }`}
                          >
                            {language === "zh"
                              ? child.label.zh
                              : child.label.en}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "text-[#7B68EE] bg-[#7B68EE]/10"
                    : "text-[#1E1B3A] hover:text-[#7B68EE] hover:bg-[#7B68EE]/5"
                }`}
              >
                {t(link.key as any, language)}
              </Link>
            );
          })}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-5 h-0.5 bg-[#1E1B3A] transition-transform ${
              mobileOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-[#1E1B3A] transition-opacity ${
              mobileOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-[#1E1B3A] transition-transform ${
              mobileOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-[#E8E6F0] px-4 pb-4">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            if (link.children) {
              const isExpanded = mobileExpandedKey === link.key;
              return (
                <div key={link.href}>
                  <button
                    onClick={() =>
                      setMobileExpandedKey(isExpanded ? null : link.key)
                    }
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "text-[#7B68EE] bg-[#7B68EE]/10"
                        : "text-[#1E1B3A] hover:text-[#7B68EE] hover:bg-[#7B68EE]/5"
                    }`}
                  >
                    {t(link.key as any, language)}
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {isExpanded && (
                    <div className="pl-4">
                      {link.children.map((child) => {
                        const childActive = pathname === child.href;
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setMobileOpen(false)}
                            className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              childActive
                                ? "text-[#7B68EE] bg-[#7B68EE]/10"
                                : "text-[#4A4668] hover:text-[#7B68EE] hover:bg-[#7B68EE]/5"
                            }`}
                          >
                            {language === "zh"
                              ? child.label.zh
                              : child.label.en}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "text-[#7B68EE] bg-[#7B68EE]/10"
                    : "text-[#1E1B3A] hover:text-[#7B68EE] hover:bg-[#7B68EE]/5"
                }`}
              >
                {t(link.key as any, language)}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
