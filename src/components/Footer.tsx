"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import { t, ui } from "@/lib/i18n";

const linkColumns = [
  { href: "/directory", key: "directory" as const },
  { href: "/health", key: "health" as const },
  { href: "/events", key: "events" as const },
  { href: "/learn", key: "learn" as const },
  { href: "/get-involved", key: "getInvolved" as const },
  { href: "/support", key: "support" as const },
];

export default function Footer() {
  const { language } = useLanguage();

  return (
    <footer
      className="border-t border-[#E8E6F0] mt-16"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Top: Logo + tagline */}
        <div className="mb-8">
          <Link href="/">
            <span className="text-2xl bg-gradient-to-r from-[#5EEDB8] via-[#F5C55A] to-[#EC4899] bg-clip-text text-transparent" style={{ fontFamily: "'This Appeal', sans-serif", letterSpacing: "0.25em" }}>
              PRISM
            </span>
          </Link>
          <p className="mt-2 text-sm text-[#6B6890]">
            {t("footerTagline", language)}
          </p>
        </div>

        {/* Middle: Link columns */}
        <div className="flex flex-wrap justify-between gap-4 mb-10">
          {linkColumns.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-[#1E1B3A] hover:text-[#7B68EE] transition-colors"
            >
              <span className="block">{t(link.key, language)}</span>
            </Link>
          ))}
        </div>

        {/* Bottom: Built with love + copyright */}
        <div className="pt-6 border-t border-[#E8E6F0] flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-[#6B6890]">
            {t("footerBuiltWith", language)}
          </p>
          <p className="text-xs text-[#6B6890]">
            &copy; {new Date().getFullYear()} PRISM HK
          </p>
        </div>
      </div>
    </footer>
  );
}
