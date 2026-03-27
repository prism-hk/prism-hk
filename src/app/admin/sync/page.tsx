"use client";

import { useState } from "react";

type Tab = "listings" | "translations";

type SyncResult = {
  success: boolean;
  listings?: {
    rows_processed: number;
    rows_upserted: number;
    errors: { row: number; error: string }[];
    duration_ms: number;
  };
  error?: string;
};

export default function AdminSyncPage() {
  const [tab, setTab] = useState<Tab>("listings");
  const [secret, setSecret] = useState("");

  // Listings sync state
  const [listingStatus, setListingStatus] = useState<"idle" | "syncing" | "done" | "error">("idle");
  const [listingResult, setListingResult] = useState<SyncResult | null>(null);
  const [listingLog, setListingLog] = useState<string[]>([]);

  // Translations sync state
  const [transStatus, setTransStatus] = useState<"idle" | "syncing" | "done" | "error">("idle");
  const [transLog, setTransLog] = useState<string[]>([]);

  const addListingLog = (msg: string) => setListingLog((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  const addTransLog = (msg: string) => setTransLog((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  async function handleListingSync() {
    if (!secret) return;
    setListingStatus("syncing");
    setListingResult(null);
    setListingLog([]);
    addListingLog("Starting sync...");
    addListingLog("Fetching sheets & upserting to Supabase...");

    try {
      const res = await fetch("/api/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${secret}`,
        },
        body: JSON.stringify({}),
      });

      const data: SyncResult = await res.json();
      setListingResult(data);

      if (data.success && data.listings) {
        const l = data.listings;
        addListingLog(`Processed ${l.rows_processed} rows from Google Sheets`);
        addListingLog(`Upserted ${l.rows_upserted} listings to Supabase`);
        if (l.errors.length > 0) {
          addListingLog(`${l.errors.length} error(s):`);
          l.errors.forEach((e) => addListingLog(`  Row ${e.row}: ${e.error}`));
        }
        addListingLog(`Done in ${(l.duration_ms / 1000).toFixed(1)}s`);
        setListingStatus("done");
      } else {
        addListingLog(`Error: ${data.error || "Unknown error"}`);
        setListingStatus("error");
      }
    } catch (err) {
      addListingLog(`Network error: ${err instanceof Error ? err.message : String(err)}`);
      setListingStatus("error");
    }
  }

  async function handleTranslationSync() {
    if (!secret) return;
    setTransStatus("syncing");
    setTransLog([]);
    addTransLog("Triggering redeploy to sync translations...");
    addTransLog("This reads the Translations tab and rebuilds the site.");

    try {
      const res = await fetch("/api/redeploy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${secret}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        addTransLog("Redeploy triggered successfully!");
        addTransLog(`Deploy ID: ${data.deployId || "N/A"}`);
        addTransLog("The site will rebuild with updated translations in ~1-2 minutes.");
        addTransLog("Tabs synced: Translations (UI text, tags, districts, categories)");
        setTransStatus("done");
      } else {
        addTransLog(`Error: ${data.error || "Unknown error"}`);
        if (data.error?.includes("DEPLOY_HOOK_URL")) {
          addTransLog("Deploy hook not configured. Ask your admin to set DEPLOY_HOOK_URL in Vercel env vars.");
        }
        setTransStatus("error");
      }
    } catch (err) {
      addTransLog(`Network error: ${err instanceof Error ? err.message : String(err)}`);
      setTransStatus("error");
    }
  }

  const currentStatus = tab === "listings" ? listingStatus : transStatus;
  const currentLog = tab === "listings" ? listingLog : transLog;

  return (
    <div className="max-w-2xl mx-auto px-6 pt-24 pb-20">
      <h1 className="text-3xl font-bold mb-2">Sync Dashboard</h1>
      <p className="text-sm text-[#6B6890] mb-6">
        Keep the PRISM directory and translations up to date from the Google Sheet.
      </p>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#F5F4FA] rounded-lg p-1 mb-6">
        <button
          onClick={() => setTab("listings")}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            tab === "listings"
              ? "bg-white shadow-sm text-[#7B68EE]"
              : "text-[#6B6890] hover:text-[#7B68EE]"
          }`}
        >
          Sync Listings
        </button>
        <button
          onClick={() => setTab("translations")}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            tab === "translations"
              ? "bg-white shadow-sm text-[#7B68EE]"
              : "text-[#6B6890] hover:text-[#7B68EE]"
          }`}
        >
          Sync Translations
        </button>
      </div>

      {/* Secret input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-[#1E1B3A] mb-1">
          Sync Secret
        </label>
        <input
          type="password"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          placeholder="Enter sync secret"
          className="w-full px-4 py-2.5 bg-white border border-[#E8E6F0] rounded-xl text-sm focus:outline-none focus:border-[#7B68EE] focus:ring-1 focus:ring-[#7B68EE]"
        />
      </div>

      {/* Tab descriptions */}
      {tab === "listings" ? (
        <p className="text-xs text-[#6B6890] mb-4">
          Syncs the <strong>Directory</strong>, <strong>Testing Services</strong>, and <strong>Emergency Services</strong> tabs
          from Google Sheets into Supabase. Updates happen instantly.
        </p>
      ) : (
        <p className="text-xs text-[#6B6890] mb-4">
          Syncs the <strong>Translations</strong> tab (UI text, tags, districts, category names) by
          triggering a site redeploy. Takes ~1-2 minutes to go live.
        </p>
      )}

      {/* Action button */}
      <button
        onClick={tab === "listings" ? handleListingSync : handleTranslationSync}
        disabled={!secret || currentStatus === "syncing"}
        className={`w-full px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all ${
          currentStatus === "syncing"
            ? "bg-[#A78BFA] cursor-wait"
            : currentStatus === "done"
              ? "bg-[#22C55E] hover:bg-[#16A34A]"
              : currentStatus === "error"
                ? "bg-[#EF4444] hover:bg-[#DC2626]"
                : "bg-[#7B68EE] hover:bg-[#6B5CE7]"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {currentStatus === "syncing"
          ? tab === "listings" ? "Syncing Listings..." : "Triggering Redeploy..."
          : currentStatus === "done"
            ? "Done — Run Again?"
            : currentStatus === "error"
              ? "Failed — Retry?"
              : tab === "listings" ? "Sync Listings" : "Sync Translations"}
      </button>

      {/* Log output */}
      {currentLog.length > 0 && (
        <div className="mt-6 bg-[#1E1B3A] rounded-xl p-4 font-mono text-xs leading-relaxed overflow-auto max-h-80">
          {currentLog.map((line, i) => (
            <div
              key={i}
              className={
                line.includes("Error") || line.includes("error")
                  ? "text-red-400"
                  : line.includes("Done") || line.includes("success")
                    ? "text-green-400"
                    : "text-gray-300"
              }
            >
              {line}
            </div>
          ))}
          {currentStatus === "syncing" && (
            <div className="text-[#A78BFA] animate-pulse">...</div>
          )}
        </div>
      )}

      {/* Listing sync summary card */}
      {tab === "listings" && listingResult?.success && listingResult.listings && (
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-[#E8E6F0] p-4 text-center">
            <div className="text-2xl font-bold text-[#7B68EE]">
              {listingResult.listings.rows_processed}
            </div>
            <div className="text-xs text-[#6B6890] mt-1">Rows Processed</div>
          </div>
          <div className="bg-white rounded-xl border border-[#E8E6F0] p-4 text-center">
            <div className="text-2xl font-bold text-[#22C55E]">
              {listingResult.listings.rows_upserted}
            </div>
            <div className="text-xs text-[#6B6890] mt-1">Upserted</div>
          </div>
          <div className="bg-white rounded-xl border border-[#E8E6F0] p-4 text-center">
            <div className="text-2xl font-bold text-[#1E1B3A]">
              {(listingResult.listings.duration_ms / 1000).toFixed(1)}s
            </div>
            <div className="text-xs text-[#6B6890] mt-1">Duration</div>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-8 text-xs text-[#6B6890] space-y-1">
        <p>Listing sync runs automatically daily at 6:00 AM HKT.</p>
        <p>Translation sync runs automatically on every deploy.</p>
        <p>
          Google Sheet:{" "}
          <a
            href="https://docs.google.com/spreadsheets/d/1zKolQNmY8g_oDPBPiiQLmFeNC6KFmz7xXCNgBvAtWhY"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#7B68EE] hover:underline"
          >
            Open Sheet
          </a>
        </p>
      </div>
    </div>
  );
}
