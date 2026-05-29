export default function ApexFledLogo({ size = 32, id = 'af' }: { size?: number; id?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Left face: dark navy, darkens toward outer edge */}
        <linearGradient id={`${id}-l`} x1="50" y1="50" x2="8" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#0f2460" />
        </linearGradient>

        {/* Right face: bright blue, lightens toward outer edge */}
        <linearGradient id={`${id}-r`} x1="50" y1="50" x2="92" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1d4ed8" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>

        {/* Center ridge: bright sky-blue fading to nothing */}
        <linearGradient id={`${id}-s`} x1="50" y1="5" x2="50" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#eff6ff" />
          <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
        </linearGradient>

        {/* Right outer edge gleam */}
        <linearGradient id={`${id}-e`} x1="50" y1="5" x2="92" y2="95" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.7" />
          <stop offset="55%" stopColor="#60a5fa" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/*
        LEFT FACE
        Apex → outer-bottom-left → along bottom (with V-notch) → center-bottom
        Closing edge is the center spine (center-bottom → apex)
      */}
      <polygon
        points="50,5 8,95 22,95 30,72 40,95 50,95"
        fill={`url(#${id}-l)`}
      />

      {/*
        RIGHT FACE (mirror of left)
        Apex → center-bottom → along bottom (with V-notch) → outer-bottom-right
        Closing edge is the right outer edge (outer-bottom-right → apex)
      */}
      <polygon
        points="50,5 50,95 60,95 70,72 78,95 92,95"
        fill={`url(#${id}-r)`}
      />

      {/* Thin gleam on the right outer edge */}
      <line
        x1="50" y1="5" x2="92" y2="95"
        stroke={`url(#${id}-e)`}
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Center spine ridge highlight */}
      <polygon
        points="50,5 53.5,44 46.5,44"
        fill={`url(#${id}-s)`}
      />

      {/* Bright apex dot */}
      <circle cx="50" cy="5" r="1.8" fill="#dbeafe" />
    </svg>
  );
}
