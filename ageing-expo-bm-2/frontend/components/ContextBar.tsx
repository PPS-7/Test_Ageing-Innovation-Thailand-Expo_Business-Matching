"use client";

import Link from "next/link";
import { useLang } from "@/context/LangContext";

interface Crumb {
  label_key: Parameters<ReturnType<typeof useLang>["t"]>[0];
  href?: string;
}

interface Props {
  crumbs: Crumb[];
}

export default function ContextBar({ crumbs }: Props) {
  const { t } = useLang();
  return (
    <div className="bg-navy-mid border-b border-navy-border">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-1.5 flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
        {/* Site link */}
        <a
          href="https://ageinginnovationexpo.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] text-white/50 hover:text-accent-cyan transition-colors"
        >
          🌐 {t("ctx_home")}
        </a>

        {crumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-2">
            <span className="text-white/25 text-[11px]">›</span>
            {crumb.href ? (
              <Link
                href={crumb.href}
                className="text-[11px] text-white/50 hover:text-accent-cyan transition-colors"
              >
                {t(crumb.label_key)}
              </Link>
            ) : (
              <span className="text-[11px] font-bold text-accent-cyan">
                {t(crumb.label_key)}
              </span>
            )}
          </span>
        ))}

        {/* Mockup badge */}
        <span className="ml-auto text-[10px] bg-white/10 text-white/60 px-2 py-0.5 rounded font-mono flex-shrink-0">
          PLATFORM MOCKUP
        </span>
      </div>
    </div>
  );
}
