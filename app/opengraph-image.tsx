import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = 'ApexFled — premium digital subscriptions & accounts';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Open Graph / social share preview image, generated at request time. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0c11',
          backgroundImage:
            'radial-gradient(circle at 50% 30%, rgba(0,158,227,0.25), rgba(10,12,17,0) 60%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Triangle mark */}
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: '70px solid transparent',
            borderRight: '70px solid transparent',
            borderBottom: '120px solid #3b82f6',
            marginBottom: 40,
          }}
        />
        <div style={{ display: 'flex', fontSize: 96, fontWeight: 900, letterSpacing: 8 }}>
          <span style={{ color: '#ffffff' }}>APEX</span>
          <span style={{ color: '#3b82f6' }}>FLED</span>
        </div>
        <div style={{ marginTop: 24, fontSize: 34, color: '#94a3b8', textAlign: 'center', maxWidth: 900 }}>
          Premium digital subscriptions, accounts &amp; software — fast delivery
        </div>
      </div>
    ),
    { ...size }
  );
}
