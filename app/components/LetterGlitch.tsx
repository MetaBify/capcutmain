"use client";

import React, { useMemo } from "react";

type Props = {
  glitchSpeed?: number; // in ms
  centerVignette?: boolean;
  outerVignette?: boolean;
  smooth?: boolean;
};

const LetterGlitch: React.FC<Props> = ({
  glitchSpeed = 85,
  centerVignette = true,
  outerVignette = true,
  smooth = true,
}) => {
  const animationDuration = useMemo(
    () => `${Math.max(20, glitchSpeed)}ms`,
    [glitchSpeed]
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
      <div
        className="absolute inset-0 opacity-40 mix-blend-screen"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(59,130,246,0.08) 0px, rgba(59,130,246,0.08) 1px, transparent 1px, transparent 3px)",
        }}
      />

      <div
        className="absolute inset-0 text-[18vw] font-black uppercase leading-none tracking-tight text-white/4"
        style={{
          animation: `glitch-shift ${animationDuration} steps(2, end) infinite`,
          textShadow:
            "2px 0 2px rgba(59,130,246,0.35), -2px 0 2px rgba(16,185,129,0.35)",
          filter: smooth ? "blur(0.5px)" : undefined,
        }}
      >
        CAPCUT UTILITY V3
      </div>

      <div
        className="absolute inset-0 text-[18vw] font-black uppercase leading-none tracking-tight text-white/5"
        style={{
          animation: `glitch-shift-alt ${animationDuration} steps(3, end) infinite`,
          textShadow:
            "-2px 0 2px rgba(236,72,153,0.3), 2px 0 2px rgba(59,130,246,0.3)",
          filter: smooth ? "blur(0.4px)" : undefined,
        }}
      >
        CAPCUT UTILITY V3
      </div>

      {centerVignette && (
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.55) 70%)",
            mixBlendMode: "multiply",
          }}
        />
      )}

      {outerVignette && (
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.75) 90%)",
            mixBlendMode: "multiply",
          }}
        />
      )}

      <style jsx global>{`
        @keyframes glitch-shift {
          0% {
            transform: translate3d(0, 0, 0);
          }
          25% {
            transform: translate3d(-3px, 1px, 0);
          }
          50% {
            transform: translate3d(3px, -2px, 0);
          }
          75% {
            transform: translate3d(-1px, 2px, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }
        @keyframes glitch-shift-alt {
          0% {
            transform: translate3d(1px, -1px, 0);
          }
          25% {
            transform: translate3d(-2px, 3px, 0);
          }
          50% {
            transform: translate3d(2px, -3px, 0);
          }
          75% {
            transform: translate3d(-3px, 2px, 0);
          }
          100% {
            transform: translate3d(1px, -1px, 0);
          }
        }
      `}</style>
    </div>
  );
};

export default LetterGlitch;
