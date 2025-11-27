import { NextRequest, NextResponse } from "next/server";

// Default to lockedapp endpoint per Offer API docs; override with OFFER_API_URL if provided.
const API_URL =
  process.env.OFFER_API_URL || "https://lockedapp.org/api/v2";
// Prefer env var, fallback to provided key for convenience.
const API_KEY =
  process.env.OFFERS_API_KEY ||
  "36845|JCPCwKKfLwamW07XHqJB9N9kvzEo7xUMY4VgODFu16216c51";

export async function GET(req: NextRequest) {
  try {
    if (!API_KEY) {
      return NextResponse.json(
        { error: "Missing OFFERS_API_KEY" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(req.url);
    const max = searchParams.get("max") || "6";
    const min = searchParams.get("min") || "";
    const ctype = searchParams.get("ctype") || "";

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      (req as any).ip ||
      "1.1.1.1";
    const userAgent = req.headers.get("user-agent") || "Mozilla/5.0";

    const url = new URL(API_URL);
    url.searchParams.set("ip", ip);
    url.searchParams.set("user_agent", userAgent);
    url.searchParams.set("max", max);
    if (min) url.searchParams.set("min", min);
    if (ctype) url.searchParams.set("ctype", ctype);

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: "Upstream error", detail: text },
        { status: res.status }
      );
    }

    const data = await res.json();
    const raw = data?.offers ?? data ?? [];

    const offers = Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.offers)
      ? raw.offers
      : [];

    const normalized = offers.map((o: any) => ({
      id: String(o.offerid ?? o.id ?? o.offer_id ?? crypto.randomUUID()),
      name: o.name_short || o.name || "Offer",
      description: o.description || o.adcopy || "",
      payout: typeof o.payout === "string" ? parseFloat(o.payout) : o.payout,
      device: o.device || "",
      country: o.country || "",
      link: o.link || o.url || "",
      picture: o.picture || o.thumbnail || "",
      epc: typeof o.epc === "string" ? parseFloat(o.epc) : o.epc,
    }));

    return NextResponse.json({ offers: normalized });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to fetch offers" },
      { status: 500 }
    );
  }
}
