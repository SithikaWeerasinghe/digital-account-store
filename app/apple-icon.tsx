import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

/** Apple touch icon (iOS home screen) — dark tile with the ApexFled mark. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0c11',
          backgroundImage:
            'radial-gradient(circle at 50% 35%, rgba(0,158,227,0.35), rgba(10,12,17,0) 65%)',
        }}
      >
        {/* Triangle mark */}
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: '46px solid transparent',
            borderRight: '46px solid transparent',
            borderBottom: '78px solid #3b82f6',
          }}
        />
      </div>
    ),
    { ...size }
  );
}
