"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { isZh } from "@/lib/i18n";

export default function ContactClient() {
  const { language } = useLanguage();
  const [copied, setCopied] = useState(false);
  const email = "support@prism.lgbt";

  async function copyEmail() {
    await navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="max-w-3xl mx-auto px-6 pt-24 pb-20">
      <h1 className="text-3xl font-bold mb-2">
        {isZh(language) ? "聯絡我們" : "Contact Us"}
      </h1>
      <p className="text-[#6B6890] text-sm mb-10">
        {isZh(language)
          ? "如有問題、建議或合作意向，歡迎聯絡我們。"
          : "Questions, suggestions, or partnership ideas? We'd love to hear from you."}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email card */}
        <div className="bg-white border border-[#E8E6F0] rounded-2xl p-6">
          <div className="text-2xl mb-3">✉️</div>
          <h2 className="font-semibold text-lg text-[#1E1B3A] mb-1">
            {isZh(language) ? "電郵" : "Email"}
          </h2>
          <p className="text-sm text-[#6B6890] mb-4">
            {isZh(language) ? "發送電郵給我們" : "Send us an email"}
          </p>
          <div className="flex items-center gap-2">
            <a
              href={`mailto:${email}`}
              className="text-sm font-medium text-[#7B68EE] hover:text-[#6B5CE7] transition-colors"
            >
              {email}
            </a>
            <button
              onClick={copyEmail}
              className="px-2.5 py-1 text-xs font-medium rounded-lg border border-[#E8E6F0] text-[#6B6890] hover:border-[#7B68EE] hover:text-[#7B68EE] transition-colors"
            >
              {copied
                ? (isZh(language) ? "已複製" : "Copied!")
                : (isZh(language) ? "複製" : "Copy")}
            </button>
          </div>
        </div>

        {/* Feedback form card */}
        <div className="bg-white border border-[#E8E6F0] rounded-2xl p-6">
          <div className="text-2xl mb-3">💬</div>
          <h2 className="font-semibold text-lg text-[#1E1B3A] mb-1">
            {isZh(language) ? "提交反饋" : "Submit Feedback"}
          </h2>
          <p className="text-sm text-[#6B6890] mb-4">
            {isZh(language) ? "透過表單分享你的想法" : "Share your thoughts via our form"}
          </p>
          <a
            href="https://forms.gle/G2J1u9rupXvdydBs8"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#7B68EE] to-[#F5C55A] text-white font-semibold text-sm hover:shadow-md transition-all"
          >
            {isZh(language) ? "打開表單" : "Open Form"} →
          </a>
        </div>
      </div>

      {/* Social links */}
      <div className="mt-10">
        <h2 className="font-semibold text-lg text-[#1E1B3A] mb-4">
          {isZh(language) ? "關注我們" : "Follow Us"}
        </h2>
        <div className="flex flex-wrap gap-3">
          {[
            { name: "Instagram", href: "https://www.instagram.com/prism.lgbt.hk", handle: "@prism.lgbt.hk" },
            { name: "Facebook", href: "https://www.facebook.com/prism.lgbt.hk", handle: "@prism.lgbt.hk" },
            { name: "LinkedIn", href: "https://www.linkedin.com/company/prism-lgbt/", handle: "PRISM" },
          ].map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E8E6F0] rounded-xl hover:border-[#7B68EE] transition-colors"
            >
              <span className="text-sm font-medium text-[#1E1B3A]">{social.name}</span>
              <span className="text-xs text-[#6B6890]">{social.handle}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
