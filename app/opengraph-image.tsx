import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'THVMAX — Thu Ta Soe | Art Direction, Motion & Product Design';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0b0c0d',
          color: '#f2f2f0',
          padding: 72,
          fontFamily: 'Helvetica Neue, Arial, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 12, height: 12, background: '#f2f2f0' }} />
          <span
            style={{
              fontSize: 28,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#8a8f94',
            }}
          >
            THVMAX
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 120, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1 }}>
            Thu Ta Soe
          </div>
          <div style={{ fontSize: 40, color: '#8a8f94', marginTop: 24 }}>
            Art Direction — Motion — Product Design
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 28,
            color: '#8a8f94',
          }}
        >
          <span>Abu Dhabi, UAE</span>
          <span>thvmaxart.com</span>
        </div>
      </div>
    ),
    size,
  );
}