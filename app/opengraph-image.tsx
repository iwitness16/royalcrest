import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "RoyalCrest Bank"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1b2a4a 0%, #243354 50%, #2d4a7a 100%)",
          position: "relative",
          fontFamily: "serif",
        }}
      >
        {/* Gold top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "linear-gradient(90deg, #c9a84c, #f0d080, #c9a84c)",
          }}
        />

        {/* Background decorative circles */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(201,168,76,0.08)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-60px",
            left: "-60px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(45,74,122,0.3)",
          }}
        />

        {/* Logo image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://royalcrestfinancials.com/banklogo.png"
          width={120}
          height={120}
          alt="RoyalCrest Bank Logo"
          style={{ objectFit: "contain", marginBottom: "24px" }}
        />

        {/* Bank name */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "10px",
            marginBottom: "16px",
          }}
        >
          <span
            style={{
              fontSize: "72px",
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-1px",
            }}
          >
            RoyalCrest
          </span>
          <span
            style={{
              fontSize: "72px",
              fontWeight: 300,
              color: "#c9a84c",
              letterSpacing: "-1px",
            }}
          >
            Bank
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "26px",
            color: "rgba(255,255,255,0.65)",
            letterSpacing: "1px",
            marginBottom: "36px",
          }}
        >
          Secure Banking for Everyone
        </div>

        {/* Gold divider */}
        <div
          style={{
            width: "80px",
            height: "3px",
            background: "#c9a84c",
            borderRadius: "2px",
            marginBottom: "28px",
          }}
        />

        {/* Trust badges row */}
        <div
          style={{
            display: "flex",
            gap: "24px",
          }}
        >
          {["FDIC Insured", "256-bit SSL", "150+ Countries"].map((badge) => (
            <div
              key={badge}
              style={{
                display: "flex",
                alignItems: "center",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(201,168,76,0.3)",
                borderRadius: "24px",
                padding: "8px 20px",
                fontSize: "18px",
                color: "rgba(255,255,255,0.75)",
              }}
            >
              {badge}
            </div>
          ))}
        </div>

        {/* Domain */}
        <div
          style={{
            position: "absolute",
            bottom: "28px",
            fontSize: "18px",
            color: "rgba(201,168,76,0.7)",
            letterSpacing: "1px",
          }}
        >
          royalcrestfinancials.com
        </div>

        {/* Gold bottom accent bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "linear-gradient(90deg, #c9a84c, #f0d080, #c9a84c)",
          }}
        />
      </div>
    ),
    { ...size }
  )
}
