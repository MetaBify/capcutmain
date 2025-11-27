"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

const lockerUrl = "https://applocked.org/fl/dl7jq";

type CardProps = {
  title: string;
  items: string[];
  badge: string;
};

function InfoCard({ title, items, badge }: CardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#0f1424] px-5 py-6 shadow-2xl shadow-blue-500/10 backdrop-blur-sm">
      <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">
        <span className="inline-block h-2 w-2 rounded-full bg-blue-400" />
        {badge}
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm text-slate-200/90">
        {items.map((line) => (
          <li key={line} className="flex gap-2">
            <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-blue-400" />
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

type Offer = {
  id: string;
  name: string;
  payout?: number;
  device?: string;
  link?: string;
  description?: string;
  country?: string;
  picture?: string;
};

export default function Home() {
  const [showLocker, setShowLocker] = useState(false);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loadingOffers, setLoadingOffers] = useState(false);
  const [offerError, setOfferError] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(20 * 60); // 20 minutes
  const [hasClickedOffer, setHasClickedOffer] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);

  const cards = useMemo(
    () => [
      {
        title: "CapCut VIP Export Patcher",
        badge: "Quick Steps",
        items: [
          "Open CapCut",
          "Launch CapCut Utility",
          'Click "Close CapCut" -> choose Yes',
          "Press Apply - done, patched",
        ],
      },
      {
        title: "When to use ON vs OFF",
        badge: "Usage Modes",
        items: [
          "While editing: keep patch OFF",
          "Ready to export: switch patch ON",
          "AI captions: create compound captions, then run patch so they stay",
        ],
      },
      {
        title: "Backups & detection",
        badge: "Safety",
        items: [
          "Auto-detects CapCut under Program Files or %LocalAppData%\\CapCut\\Apps",
          "Closes CapCut before patching to avoid locks",
          "Keeps .bak backups of both watermark and root DLLs",
        ],
      },
    ],
    []
  );

  useEffect(() => {
    if (!showLocker) return;
    setTimerSeconds(20 * 60);
    const t = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          setUnlocked(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [showLocker]);

  useEffect(() => {
    if (!showLocker) return;
    const fetchOffers = async () => {
      try {
        setLoadingOffers(true);
        setOfferError(null);
        const res = await fetch("/api/offerwall?max=6");
        if (!res.ok) throw new Error("Offer feed unavailable");
        const data = await res.json();
        const payload = data?.offers ?? data ?? [];
        const normalized: Offer[] = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.offers)
          ? (payload.offers as Offer[])
          : [];
        setOffers(normalized.filter(Boolean));
      } catch (err: any) {
        setOfferError(err?.message || "Failed to load offers");
      } finally {
        setLoadingOffers(false);
      }
    };
    fetchOffers();
  }, [showLocker]);

  const formattedTimer = useMemo(() => {
    const m = Math.floor(timerSeconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (timerSeconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }, [timerSeconds]);

  useEffect(() => {
    if (unlocked && !hasRedirected) {
      setHasRedirected(true);
      window.open(
        "https://www.mediafire.com/file/2fczhdhyvaqt9ak/CapCutUtilityV3.exe/file",
        "_blank",
        "noopener,noreferrer"
      );
    }
  }, [unlocked, hasRedirected]);

  return (
    <main className="min-h-screen bg-[#0b0f1a] pb-16">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 pt-10">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/5 bg-[#0f1424]/80 px-4 py-3 shadow-lg shadow-blue-500/5">
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-9 overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10">
              <Image
                src="/icon.png"
                alt="CapCut Utility"
                fill
                className="object-contain p-1.5"
                sizes="36px"
                priority
              />
            </div>
            <div>
              <div className="text-base font-semibold text-white">
                CapCut Utility V3
              </div>
              <div className="text-xs text-slate-300">
                Patch exports in one click
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <a
              href="#help"
              className="rounded-full border border-white/10 bg-white/5 px-3 py-2 font-medium text-slate-100 transition hover:border-blue-400/60 hover:bg-blue-500/10"
            >
              Help
            </a>
            <button
              onClick={() => {
                setUnlocked(false);
                setHasClickedOffer(false);
                setHasRedirected(false);
                setShowLocker(true);
              }}
              className="rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:brightness-110"
            >
              Download
            </button>
          </div>
        </header>

        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0f1424]/80 p-8 shadow-2xl shadow-blue-500/15">
          <div
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                "url('https://static.vecteezy.com/system/resources/thumbnails/001/957/794/small/tech-background-with-abstract-wave-lines-free-vector.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "saturate(0.8) brightness(0.7)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0b0f1a]/90 via-[#0b0f1a]/70 to-[#0b0f1a]/40" />

          <div className="relative grid gap-6 md:grid-cols-[1.1fr_auto] md:items-center">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-blue-300/90">
                CapCut Utility V3
              </p>
              <h1 className="text-3xl font-bold text-white md:text-4xl">
                Patch CapCut exports in one click
              </h1>
              <p className="max-w-2xl text-base text-slate-100/90">
                CapCut Utility V3 keeps your exports and captions intact.
                Auto-detects your install, closes CapCut before patching, and
                keeps backups so you can switch ON/OFF safely.
              </p>
            </div>

            <div className="flex justify-start md:justify-end">
              <button
                onClick={() => {
                  setUnlocked(false);
                  setHasClickedOffer(false);
                  setHasRedirected(false);
                  setShowLocker(true);
                }}
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 text-base font-semibold text-white shadow-xl shadow-blue-500/35 transition hover:scale-[1.02] hover:brightness-110"
              >
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
                  ↓
                </span>
                Download
              </button>
            </div>
          </div>
        </section>

        <div className="grid gap-6 md:grid-cols-2">
          {cards.slice(0, 2).map((card) => (
            <InfoCard key={card.title} {...card} />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <InfoCard {...cards[2]} />
          <div
            id="help"
            className="rounded-3xl border border-white/10 bg-[#0f1424] px-5 py-6 shadow-2xl shadow-blue-500/10 backdrop-blur-sm"
          >
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
              Help & tips
            </div>
            <p className="text-sm text-slate-200/90">
              If the download locker does not load inside the page, use the
              "Open in new tab" link inside the popup. You can switch patch ON/OFF
              anytime — the app keeps .bak backups of the DLLs it modifies.
            </p>
          </div>
        </div>
      </div>

      {showLocker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-3">
          <div className="relative flex h-[80vh] w-[min(960px,100%)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0f1424] shadow-2xl shadow-blue-500/30">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 bg-white/5 px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-blue-400" />
                CapCut Utility Locker
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <a
                  href={lockerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1 font-semibold hover:border-blue-400/60 hover:bg-blue-500/10"
                >
                  Open in new tab
                </a>
                <button
                  onClick={() => {
                    setShowLocker(false);
                  }}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1 font-semibold hover:border-red-400/60 hover:bg-red-500/10"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-4 overflow-hidden bg-[#0b0f1a] px-4 pb-4 pt-3">
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200">
                <span>
                  Complete one offer to unlock, or wait:{" "}
                  <strong className="text-blue-300">{formattedTimer}</strong>
                </span>
                {unlocked ? (
                  <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-emerald-200 font-semibold">
                    Unlocked
                  </span>
                ) : (
                  <span className="rounded-full bg-blue-500/20 px-3 py-1 text-blue-200 font-semibold">
                    1 offer required
                  </span>
                )}
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {loadingOffers && (
                  <div className="md:col-span-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                    Loading offers…
                  </div>
                )}
                {offerError && (
                  <div className="md:col-span-2 rounded-xl border border-red-400/50 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {offerError}
                  </div>
                )}
                {!loadingOffers &&
                  !offerError &&
                  Array.isArray(offers) &&
                  offers.map((offer) => (
                    <a
                      key={offer.id}
                      href={offer.link || lockerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        setHasClickedOffer(true);
                        setTimeout(() => setUnlocked(true), 2000);
                      }}
                      className="group block rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-blue-400/60 hover:bg-blue-500/10"
                    >
                      <div className="flex items-center justify-between gap-2 text-sm text-white">
                        <span className="font-semibold">{offer.name}</span>
                        {offer.payout ? (
                          <span className="rounded-full bg-blue-500/20 px-2 py-1 text-xs text-blue-100">
                            {offer.payout.toFixed(2)}$
                          </span>
                        ) : null}
                      </div>
                      {offer.picture ? (
                        <div className="mt-2 overflow-hidden rounded-lg border border-white/10 bg-black/30">
                          <img
                            src={offer.picture}
                            alt={offer.name}
                            className="h-32 w-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      ) : null}
                      {offer.description ? (
                        <p className="mt-2 text-xs text-slate-200/80 line-clamp-2">
                          {offer.description}
                        </p>
                      ) : null}
                      {offer.device ? (
                        <p className="mt-1 text-[11px] text-slate-400">
                          Device: {offer.device}
                        </p>
                      ) : null}
                      {offer.country ? (
                        <p className="mt-0.5 text-[11px] text-slate-400">
                          Geo: {offer.country}
                        </p>
                      ) : null}
                    </a>
                  ))}
                {!loadingOffers && !offerError && offers.length === 0 && (
                  <div className="md:col-span-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                    No offers available right now. The timer will unlock the download when it ends.
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-200">
                <div className="space-y-1">
                  <div>
                    Status:{" "}
                    {unlocked ? (
                      <span className="text-emerald-300 font-semibold">
                        Unlocked
                      </span>
                    ) : (
                      <span className="text-blue-300 font-semibold">
                        Locked
                      </span>
                    )}
                  </div>
                  <div>
                    Progress:{" "}
                    {hasClickedOffer
                      ? "Offer clicked — awaiting completion or timer"
                      : "Click an offer to start"}
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (unlocked) {
                      setHasRedirected(true);
                      window.open(
                        "https://www.mediafire.com/file/2fczhdhyvaqt9ak/CapCutUtilityV3.exe/file",
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }
                  }}
                  disabled={!unlocked}
                  className="rounded-full px-4 py-2 text-sm font-semibold text-white shadow-lg transition disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-slate-400 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:brightness-110"
                >
                  {unlocked ? "Download now" : `Free download in ${formattedTimer}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
