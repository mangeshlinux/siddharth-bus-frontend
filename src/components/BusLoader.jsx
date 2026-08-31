import React, { useState, useEffect } from 'react';

/**
 * BusLoader Component — Siddharth School Bus & Travels
 * 
 * An animated school bus driving down the road with:
 * - Animated bouncing bus suspension & spinning wheels
 * - Scrolling road dashes and scenery
 * - Exhaust smoke puffs
 * - Headlight beam projection
 * - Dynamic server wake-up timer and friendly messages
 */
export default function BusLoader({
  message = "Waking up server...",
  subtext = "Initial spin-up on free hosting may take 15–30 seconds. Thank you for your patience!",
  fullScreen = true,
  _size = "md",
  showTimer = true
}) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dynamicStatus = () => {
    if (elapsedSeconds < 4) return "Connecting to Siddharth Bus service...";
    if (elapsedSeconds < 10) return "Starting backend instances on cloud...";
    if (elapsedSeconds < 20) return "Waking up database & security services...";
    if (elapsedSeconds < 35) return "Almost ready! Finalizing connection...";
    return "Server is taking a little longer than usual, still waking up...";
  };

  const containerClasses = fullScreen
    ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FBF3E7]/95 backdrop-blur-md p-6 text-center"
    : "w-full py-8 px-4 flex flex-col items-center justify-center bg-[#FBF3E7]/70 rounded-3xl border border-[#B08D57]/30 text-center";

  return (
    <div className={`bus-loader-container select-none ${containerClasses}`}>
      
      {/* ─── Animated SVG Scene ─── */}
      <div className="relative w-full max-w-sm sm:max-w-md h-44 sm:h-52 flex items-center justify-center overflow-hidden">
        
        {/* Background Ambient Glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#D97B29]/10 via-transparent to-[#B08D57]/15 rounded-3xl pointer-events-none" />

        {/* Passing Clouds / Background Elements */}
        <div className="absolute top-3 left-0 w-full h-8 overflow-hidden pointer-events-none opacity-40">
          <svg className="w-[800px] h-full animate-[sceneryMove_12s_linear_infinite]" viewBox="0 0 800 30" fill="none">
            <path d="M50 15 Q65 5 80 15 Q95 8 110 15 Q125 5 140 15 L140 30 L50 30 Z" fill="#B08D57" fillOpacity="0.3" />
            <path d="M450 15 Q465 5 480 15 Q495 8 510 15 Q525 5 540 15 L540 30 L450 30 Z" fill="#B08D57" fillOpacity="0.3" />
            <circle cx="280" cy="12" r="10" fill="#D97B29" fillOpacity="0.15" />
            <circle cx="680" cy="12" r="10" fill="#D97B29" fillOpacity="0.15" />
          </svg>
        </div>

        {/* Bus and Road SVG */}
        <svg
          viewBox="0 0 400 160"
          className="w-full h-full drop-shadow-lg"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Bus Body Gradient */}
            <linearGradient id="busBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FDB813" />
              <stop offset="40%" stopColor="#F5A623" />
              <stop offset="100%" stopColor="#D97B29" />
            </linearGradient>

            {/* Roof Gradient */}
            <linearGradient id="busRoofGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#F5E8D3" />
            </linearGradient>

            {/* Glass Gradient */}
            <linearGradient id="windowGlass" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#BAE6FD" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#7DD3FC" stopOpacity="0.95" />
            </linearGradient>

            {/* Headlight Beam Gradient */}
            <linearGradient id="headlightBeam" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#FEF08A" stopOpacity="0" />
            </linearGradient>

            {/* Wheel Gradient */}
            <radialGradient id="wheelRim" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#9CA3AF" />
              <stop offset="100%" stopColor="#374151" />
            </radialGradient>
          </defs>

          {/* ─── ROAD SECTION (Y=120 to 155) ─── */}
          {/* Road Base */}
          <rect x="0" y="122" width="400" height="24" rx="4" fill="#2A1810" />
          <rect x="0" y="142" width="400" height="4" fill="#3B2314" />
          <line x1="0" y1="123" x2="400" y2="123" stroke="#B08D57" strokeWidth="1.5" strokeOpacity="0.5" />

          {/* Animated Road Dashed Centerlines */}
          <g className="animate-[roadSlide_0.55s_linear_infinite]">
            {[-80, -40, 0, 40, 80, 120, 160, 200, 240, 280, 320, 360, 400, 440].map((x, i) => (
              <rect
                key={i}
                x={x}
                y="132"
                width="22"
                height="4"
                rx="2"
                fill="#FDB813"
                opacity="0.9"
              />
            ))}
          </g>

          {/* ─── ANIMATED BUS GROUP ─── */}
          <g className="animate-[busBounce_0.5s_ease-in-out_infinite]">
            
            {/* Bus Shadow on Road */}
            <ellipse cx="190" cy="123" rx="100" ry="5" fill="#1C110A" opacity="0.4" />

            {/* Headlight Beam Projected Forward */}
            <polygon
              points="285,102 390,88 390,126 285,112"
              fill="url(#headlightBeam)"
              className="animate-[headlightPulse_1.5s_ease-in-out_infinite]"
            />

            {/* Exhaust Pipe (Back) */}
            <rect x="85" y="112" width="10" height="4" rx="1" fill="#4B5563" />
            
            {/* Animated Smoke Puffs */}
            <circle cx="80" cy="113" r="3" fill="#D1D5DB" className="animate-[exhaustPuff1_1.2s_ease-out_infinite]" />
            <circle cx="76" cy="112" r="4" fill="#9CA3AF" className="animate-[exhaustPuff2_1.2s_ease-out_infinite_0.4s]" />
            <circle cx="72" cy="114" r="5" fill="#6B7280" className="animate-[exhaustPuff3_1.2s_ease-out_infinite_0.8s]" />

            {/* Main Bus Body */}
            {/* Lower Chassis / Bumper */}
            <rect x="90" y="108" width="195" height="8" rx="3" fill="#3B2314" />

            {/* Bus Main Shell */}
            <path
              d="M 92 64
                 C 92 56, 98 50, 106 50
                 L 262 50
                 C 276 50, 285 60, 285 76
                 L 285 108
                 L 92 108
                 Z"
              fill="url(#busBodyGrad)"
              stroke="#2A1810"
              strokeWidth="1.5"
            />

            {/* White Roof Cap */}
            <path
              d="M 98 52
                 C 102 48, 108 47, 114 47
                 L 258 47
                 C 264 47, 270 48, 274 52
                 L 98 52 Z"
              fill="url(#busRoofGrad)"
            />

            {/* Roof Warning / Clearance Lights */}
            <circle cx="110" cy="48" r="2" fill="#EF4444" />
            <circle cx="140" cy="47" r="1.5" fill="#F59E0B" />
            <circle cx="230" cy="47" r="1.5" fill="#F59E0B" />
            <circle cx="265" cy="48" r="2" fill="#EF4444" />

            {/* Side Accent Espresso Stripe */}
            <rect x="92" y="93" width="193" height="7" fill="#3B2314" />
            <rect x="92" y="94.5" width="193" height="2" fill="#FFFFFF" opacity="0.6" />

            {/* Bus Lettering: SIDDHARTH */}
            <text
              x="180"
              y="105"
              fill="#3B2314"
              fontSize="6.5"
              fontWeight="900"
              fontFamily="Outfit, sans-serif"
              letterSpacing="1.2"
              textAnchor="middle"
            >
              SIDDHARTH SCHOOL BUS
            </text>

            {/* ─── WINDOWS ─── */}
            {/* Driver Front Windshield */}
            <path
              d="M 252 56
                 L 278 56
                 C 281 62, 282 70, 282 78
                 L 252 78
                 Z"
              fill="url(#windowGlass)"
              stroke="#3B2314"
              strokeWidth="1.2"
            />
            {/* Windshield Glare Line */}
            <line x1="262" y1="58" x2="254" y2="76" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.75" />

            {/* Passenger Windows (4 Windows) */}
            {[
              { x: 102, w: 30 },
              { x: 138, w: 32 },
              { x: 176, w: 32 },
              { x: 214, w: 32 }
            ].map((win, idx) => (
              <g key={idx}>
                <rect
                  x={win.x}
                  y="56"
                  width={win.w}
                  height="22"
                  rx="3"
                  fill="url(#windowGlass)"
                  stroke="#3B2314"
                  strokeWidth="1.2"
                />
                {/* Window Reflection */}
                <line
                  x1={win.x + win.w - 8}
                  y1="58"
                  x2={win.x + 4}
                  y2="76"
                  stroke="#FFFFFF"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  opacity="0.6"
                />
                {/* Little Student Silhouettes */}
                <circle cx={win.x + win.w / 2} cy="69" r="4" fill="#3B2314" opacity="0.7" />
                <path
                  d={`M ${win.x + win.w / 2 - 5} 78 C ${win.x + win.w / 2 - 5} 74, ${win.x + win.w / 2 + 5} 74, ${win.x + win.w / 2 + 5} 78 Z`}
                  fill="#3B2314"
                  opacity="0.7"
                />
              </g>
            ))}

            {/* Headlight Unit */}
            <rect x="281" y="98" width="5" height="8" rx="2" fill="#FEF08A" stroke="#3B2314" strokeWidth="1" />
            <circle cx="283.5" cy="102" r="2.5" fill="#FFFBEB" />

            {/* Tail Light */}
            <rect x="90" y="96" width="3" height="7" rx="1" fill="#EF4444" stroke="#7F1D1D" strokeWidth="0.5" />

            {/* Side Mirror */}
            <rect x="280" y="66" width="4" height="8" rx="1.5" fill="#3B2314" />
            <line x1="276" y1="70" x2="280" y2="70" stroke="#3B2314" strokeWidth="1.5" />

            {/* ─── WHEEL WELLS & WHEELS ─── */}
            {/* Front Wheel Well Cutout */}
            <path d="M 235 110 A 15 15 0 0 1 267 110 Z" fill="#2A1810" />
            {/* Back Wheel Well Cutout */}
            <path d="M 115 110 A 15 15 0 0 1 147 110 Z" fill="#2A1810" />

            {/* Back Wheel */}
            <g transform="translate(131, 110)">
              <g className="animate-[wheelSpin_0.5s_linear_infinite]">
                <circle cx="0" cy="0" r="13" fill="#1F2937" stroke="#111827" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="8" fill="url(#wheelRim)" />
                <circle cx="0" cy="0" r="3.5" fill="#D97B29" />
                {/* Spokes/Bolts */}
                <line x1="-6" y1="0" x2="6" y2="0" stroke="#374151" strokeWidth="1.2" />
                <line x1="0" y1="-6" x2="0" y2="6" stroke="#374151" strokeWidth="1.2" />
              </g>
            </g>

            {/* Front Wheel */}
            <g transform="translate(251, 110)">
              <g className="animate-[wheelSpin_0.5s_linear_infinite]">
                <circle cx="0" cy="0" r="13" fill="#1F2937" stroke="#111827" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="8" fill="url(#wheelRim)" />
                <circle cx="0" cy="0" r="3.5" fill="#D97B29" />
                {/* Spokes/Bolts */}
                <line x1="-6" y1="0" x2="6" y2="0" stroke="#374151" strokeWidth="1.2" />
                <line x1="0" y1="-6" x2="0" y2="6" stroke="#374151" strokeWidth="1.2" />
              </g>
            </g>

          </g>
        </svg>
      </div>

      {/* ─── Status & Feedback Text ─── */}
      <div className="mt-4 max-w-sm space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D97B29]/10 border border-[#D97B29]/30 text-[#D97B29] text-xs font-bold uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-[#D97B29] animate-ping" />
          <span>{message}</span>
        </div>

        <h3 className="text-base sm:text-lg font-black text-[#231A12] font-heading">
          {dynamicStatus()}
        </h3>

        <p className="text-xs text-[#7A6A5C] leading-relaxed">
          {subtext}
        </p>

        {showTimer && elapsedSeconds > 0 && (
          <div className="pt-2 flex items-center justify-center gap-2 text-[11px] font-mono text-[#B08D57] font-semibold">
            <span>Elapsed:</span>
            <span className="bg-white px-2 py-0.5 rounded-md border border-[#B08D57]/30 shadow-2xs">
              {elapsedSeconds}s
            </span>
          </div>
        )}
      </div>

    </div>
  );
}
