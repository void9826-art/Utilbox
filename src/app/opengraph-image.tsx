import { ImageResponse } from "next/og";

import { siteConfig } from "@/config/site";
import { TOOL_COUNT } from "@/config/tools";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The social card, drawn at request time rather than shipped as a static file
 * so it stays in step with the tool count and the brand name.
 *
 * The renderer here is Satori, which supports a subset of CSS: every element
 * with more than one child needs an explicit display, and interpolated text is
 * kept as a single string so it counts as one child.
 */
export default function OpenGraphImage() {
  const subtitle = `${TOOL_COUNT} utilities for PDFs, images, text, code and numbers — running in your browser, so your files never leave your device.`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffffff",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#212121",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="34"
              height="34"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.25"
            >
              <path d="M4 7h16M4 12h10M4 17h6" strokeLinecap="round" />
              <circle cx="18.5" cy="15.5" r="3.5" />
            </svg>
          </div>
          <div style={{ display: "flex", fontSize: 34, fontWeight: 600, color: "#212121" }}>
            {siteConfig.name}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              display: "flex",
              fontSize: 68,
              fontWeight: 600,
              color: "#212121",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              maxWidth: 940,
            }}
          >
            Free tools for work, school and everyday life
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              color: "#616161",
              maxWidth: 900,
              lineHeight: 1.4,
            }}
          >
            {subtitle}
          </div>
        </div>

        <div style={{ display: "flex", gap: "14px" }}>
          {["No sign-up", "No watermark", "Files stay on your device"].map((label) => (
            <div
              key={label}
              style={{
                display: "flex",
                fontSize: 22,
                color: "#212121",
                background: "#f2f2f2",
                border: "1px solid #e0e0e0",
                borderRadius: 999,
                padding: "10px 22px",
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
