/**
 * Cute Icon System — soft gradients, rounded strokes, warm colors
 * Each icon sits inside a gradient circle for a polished, modern look.
 */
import { useId } from 'react';

export function IconBubble({ size = 44, bg, children, className, glow = false, glowColor }) {
  const extractColor = (bgStr) => {
    const match = bgStr.match(/#[A-Fa-f0-9]{6}/);
    return match ? match[0] : '#FF8A80';
  };
  const gc = glowColor || extractColor(bg);

  return (
    <div
      className={`flex items-center justify-center flex-shrink-0 relative ${className || ''}`}
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.3,
        background: bg,
      }}
    >
      {glow && (
        <div
          className="icon-bubble-glow"
          style={{
            position: 'absolute',
            inset: -3,
            borderRadius: size * 0.3 + 3,
            background: gc,
            opacity: 0,
            filter: `blur(${Math.max(6, size * 0.2)}px)`,
            zIndex: -1,
            pointerEvents: 'none',
          }}
        />
      )}
      {children}
    </div>
  );
}

/* ─── Cute SVG Icons ─── */

export function IcChat({ size = 20, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M20 12c0 4.418-3.582 7-8 7a9.863 9.863 0 01-3.2-.53L4 20l1.338-3.346C4.493 15.373 4 13.74 4 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" fill={color} opacity={0.2} />
      <path d="M20 12c0 4.418-3.582 7-8 7a9.863 9.863 0 01-3.2-.53L4 20l1.338-3.346C4.493 15.373 4 13.74 4 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="12" r="1" fill={color} />
      <circle cx="12" cy="12" r="1" fill={color} />
      <circle cx="15" cy="12" r="1" fill={color} />
    </svg>
  );
}

export function IcHeart({ size = 20, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 21s-7-5.562-7-10.5C5 7.462 7.239 5 10 5c1.584 0 2.987.81 3.5 2 .513-1.19 1.916-2 3.5-2 2.761 0 5 2.462 5 5.5C22 15.438 12 21 12 21z" fill={color} opacity={0.25} />
      <path d="M12 21s-7-5.562-7-10.5C5 7.462 7.239 5 10 5c1.584 0 2.987.81 3.5 2 .513-1.19 1.916-2 3.5-2 2.761 0 5 2.462 5 5.5C22 15.438 12 21 12 21z" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IcFire({ size = 20, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 22c4.418 0 7-3.134 7-7 0-2.5-1.5-4.5-3-6-.5 1-2 2-3 1.5.5-2.5-.5-5.5-3-7.5 0 3-1.5 5-3 6.5S4 13 4 15c0 3.866 2.582 7 8 7z" fill={color} opacity={0.25} />
      <path d="M12 22c4.418 0 7-3.134 7-7 0-2.5-1.5-4.5-3-6-.5 1-2 2-3 1.5.5-2.5-.5-5.5-3-7.5 0 3-1.5 5-3 6.5S4 13 4 15c0 3.866 2.582 7 8 7z" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IcTarget({ size = 20, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8" stroke={color} strokeWidth={1.8} opacity={0.3} />
      <circle cx="12" cy="12" r="5" stroke={color} strokeWidth={1.8} opacity={0.6} />
      <circle cx="12" cy="12" r="2" fill={color} />
    </svg>
  );
}

export function IcStar({ size = 20, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2l2.939 5.955L21 8.955l-4.5 4.386L17.878 20 12 16.955 6.122 20l1.378-6.659L3 8.955l6.061-1L12 2z" fill={color} opacity={0.25} />
      <path d="M12 2l2.939 5.955L21 8.955l-4.5 4.386L17.878 20 12 16.955 6.122 20l1.378-6.659L3 8.955l6.061-1L12 2z" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IcBook({ size = 20, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15z" fill={color} opacity={0.2} />
      <path d="M4 4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15z" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke={color} strokeWidth={1.8} />
      <path d="M9 7h6M9 11h4" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  );
}

export function IcCalendar({ size = 20, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="18" rx="3" fill={color} opacity={0.2} />
      <rect x="3" y="4" width="18" height="18" rx="3" stroke={color} strokeWidth={1.8} />
      <path d="M16 2v4M8 2v4M3 10h18" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <circle cx="8" cy="15" r="1.5" fill={color} />
      <circle cx="12" cy="15" r="1.5" fill={color} opacity={0.5} />
    </svg>
  );
}

export function IcTrophy({ size = 20, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M8 21h8M12 17v4M6 4h12v4a6 6 0 01-12 0V4z" fill={color} opacity={0.2} />
      <path d="M6 4h12v4a6 6 0 01-12 0V4z" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 8H4a2 2 0 010-4h2M18 8h2a2 2 0 000-4h-2M8 21h8M12 17v4" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IcSparkle({ size = 20, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5L12 2z" fill={color} opacity={0.3} />
      <path d="M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5L12 2z" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 16l.75 2.25L22 19l-2.25.75L19 22l-.75-2.25L16 19l2.25-.75L19 16z" fill={color} opacity={0.5} />
      <path d="M5 16l.5 1.5L7 18l-1.5.5L5 20l-.5-1.5L3 18l1.5-.5L5 16z" fill={color} opacity={0.4} />
    </svg>
  );
}

export function IcBolt({ size = 20, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill={color} opacity={0.25} />
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IcShield({ size = 20, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2l8 4v5c0 5.25-3.5 9.74-8 11-4.5-1.26-8-5.75-8-11V6l8-4z" fill={color} opacity={0.2} />
      <path d="M12 2l8 4v5c0 5.25-3.5 9.74-8 11-4.5-1.26-8-5.75-8-11V6l8-4z" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IcEye({ size = 20, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" fill={color} opacity={0.15} />
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" stroke={color} strokeWidth={1.8} />
      <circle cx="12" cy="12" r="1" fill={color} />
    </svg>
  );
}

export function IcWave({ size = 20, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M7.5 4.5C9 3 11 3 12.5 4.5L17 9c.5.5 1 .5 1.5 0l1-1" stroke={color} strokeWidth={2} strokeLinecap="round" opacity={0.4} />
      <path d="M6 10l-1.5 1.5c-2 2-2 5 0 7s5 2 7 0l7-7c1-1 1-2.5 0-3.5s-2.5-1-3.5 0l-4 4" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 11l-2 2" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </svg>
  );
}

export function IcLetter({ size = 20, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="14" rx="3" fill={color} opacity={0.2} />
      <rect x="3" y="5" width="18" height="14" rx="3" stroke={color} strokeWidth={1.8} />
      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="18" cy="8" r="3" fill={color} opacity={0.6} />
    </svg>
  );
}

export function IcDove({ size = 20, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M18 8c2-1 4 0 4 2s-2 4-5 5l-4 2-3 3-2-1 2-4-3-2c-2-1-3-3-2-5l5 3c1-2 3-4 5-4 0 0 1 0 3 1z" fill={color} opacity={0.2} />
      <path d="M18 8c2-1 4 0 4 2s-2 4-5 5l-4 2-3 3-2-1 2-4-3-2c-2-1-3-3-2-5l5 3c1-2 3-4 5-4 0 0 1 0 3 1z" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IcGift({ size = 20, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="8" width="18" height="4" rx="1.5" fill={color} opacity={0.3} />
      <rect x="3" y="8" width="18" height="4" rx="1.5" stroke={color} strokeWidth={1.8} />
      <path d="M12 8v13M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" stroke={color} strokeWidth={1.8} />
      <path d="M7.5 8C6 8 5 7 5 5.5S6 3 7.5 3c2 0 4.5 2.5 4.5 5M16.5 8c1.5 0 2.5-1 2.5-2.5S18 3 16.5 3c-2 0-4.5 2.5-4.5 5" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </svg>
  );
}

export function IcHeartSpark({ size = 20, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 21s-7-5.562-7-10.5C5 7.462 7.239 5 10 5c1.584 0 2.987.81 3.5 2 .513-1.19 1.916-2 3.5-2 2.761 0 5 2.462 5 5.5C22 15.438 12 21 12 21z" fill={color} opacity={0.3} />
      <path d="M12 21s-7-5.562-7-10.5C5 7.462 7.239 5 10 5c1.584 0 2.987.81 3.5 2 .513-1.19 1.916-2 3.5-2 2.761 0 5 2.462 5 5.5C22 15.438 12 21 12 21z" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 3l.5 1.5L18 5l-1.5.5L16 7l-.5-1.5L14 5l1.5-.5L16 3z" fill={color} />
    </svg>
  );
}

export function IcMask({ size = 20, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 4C8 4 4 7 4 12s4 8 8 8 8-4 8-8-4-8-8-8z" fill={color} opacity={0.15} />
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth={1.8} />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <circle cx="9" cy="10" r="1.2" fill={color} />
      <circle cx="15" cy="10" r="1.2" fill={color} />
    </svg>
  );
}

export function IcPen({ size = 20, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" fill={color} opacity={0.2} />
      <path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 5l4 4" stroke={color} strokeWidth={1.8} />
    </svg>
  );
}

export function IcRobot({ size = 20, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="4" y="8" width="16" height="12" rx="3" fill={color} opacity={0.2} />
      <rect x="4" y="8" width="16" height="12" rx="3" stroke={color} strokeWidth={1.8} />
      <path d="M12 8V5M9 5h6" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <circle cx="9" cy="13" r="1.5" fill={color} />
      <circle cx="15" cy="13" r="1.5" fill={color} />
      <path d="M10 17h4" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <path d="M2 13h2M20 13h2" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </svg>
  );
}

export function IcRadar({ size = 20, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth={1.5} opacity={0.2} />
      <circle cx="12" cy="12" r="6" stroke={color} strokeWidth={1.5} opacity={0.4} />
      <circle cx="12" cy="12" r="3" stroke={color} strokeWidth={1.5} opacity={0.7} />
      <path d="M12 3v9l6.36 3.64" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <circle cx="12" cy="12" r="1.5" fill={color} />
    </svg>
  );
}

export function IcCrown({ size = 20, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M3 18h18l-2-10-4.5 4L12 6l-2.5 6L5 8l-2 10z" fill={color} opacity={0.3} />
      <path d="M3 18h18l-2-10-4.5 4L12 6l-2.5 6L5 8l-2 10z" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 18h18v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" fill={color} opacity={0.15} stroke={color} strokeWidth={1.8} />
    </svg>
  );
}

export function IcLightbulb({ size = 20, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M9 21h6M12 3a6 6 0 014 10.5V17a1 1 0 01-1 1h-6a1 1 0 01-1-1v-3.5A6 6 0 0112 3z" fill={color} opacity={0.2} />
      <path d="M12 3a6 6 0 014 10.5V17a1 1 0 01-1 1h-6a1 1 0 01-1-1v-3.5A6 6 0 0112 3z" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 21h6M10 17h4" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </svg>
  );
}

export function IcChart({ size = 20, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="3" fill={color} opacity={0.1} stroke={color} strokeWidth={1.5} />
      <path d="M7 17v-4" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
      <path d="M12 17v-8" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
      <path d="M17 17v-6" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
    </svg>
  );
}

/* 生气/愤怒表情图标 — 圆形黄色脸蛋，V形眉毛、斜眼、咬牙 */
export function IcAngryFace({ size = 28 }) {
  const id = useId();
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" style={{ display: 'block' }}>
      {/* Face circle + dark outline to match emoji style */}
      <circle cx="18" cy="18" r="16.5" fill={`url(#${id})`} stroke="#4A3520" strokeWidth="1.4" />
      {/* Left eyebrow — angry V */}
      <path d="M9.5 12.8 L14.5 10.5" stroke="#6D4C2A" strokeWidth="2.4" strokeLinecap="round" />
      {/* Right eyebrow — angry V */}
      <path d="M26.5 12.8 L21.5 10.5" stroke="#6D4C2A" strokeWidth="2.4" strokeLinecap="round" />
      {/* Left eye — squinted */}
      <ellipse cx="12.5" cy="15.8" rx="2.1" ry="1.7" fill="#5D4037" />
      {/* Right eye — squinted */}
      <ellipse cx="23.5" cy="15.8" rx="2.1" ry="1.7" fill="#5D4037" />
      {/* Mouth — gritted teeth block with outline */}
      <rect x="10" y="22" width="16" height="6.2" rx="2.2" fill="#5D4037" stroke="#4E342E" strokeWidth="0.6" />
      {/* Teeth rows */}
      <rect x="10.8" y="22.5" width="14.4" height="2.5" rx="0.6" fill="#FAFAFA" />
      <rect x="10.8" y="25.3" width="14.4" height="2.3" rx="0.6" fill="#E0E0E0" />
      {/* Tooth gaps */}
      <line x1="14" y1="22.2" x2="14" y2="28" stroke="#5D4037" strokeWidth="0.7" />
      <line x1="18" y1="22.2" x2="18" y2="28" stroke="#5D4037" strokeWidth="0.7" />
      <line x1="22" y1="22.2" x2="22" y2="28" stroke="#5D4037" strokeWidth="0.7" />
      <defs>
        <linearGradient id={id} x1="4" y1="2" x2="32" y2="34">
          <stop offset="0%" stopColor="#FFD54F" />
          <stop offset="100%" stopColor="#FFA726" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ─── Pre-made gradient color palettes ─── */
export const gradients = {
  coral:   'linear-gradient(135deg, #FF8A80, #FF6B6B)',
  peach:   'linear-gradient(135deg, #FFB199, #FF8A80)',
  purple:  'linear-gradient(135deg, #B39DDB, #9B7EDE)',
  lilac:   'linear-gradient(135deg, #CE93D8, #AB47BC)',
  mint:    'linear-gradient(135deg, #80CBC4, #4ECDC4)',
  sky:     'linear-gradient(135deg, #81D4FA, #4FC3F7)',
  golden:  'linear-gradient(135deg, #FFE082, #FFD54F)',
  rose:    'linear-gradient(135deg, #F48FB1, #EC407A)',
  lemon:   'linear-gradient(135deg, #FFF59D, #FFEE58)',
  teal:    'linear-gradient(135deg, #80CBC4, #26A69A)',
  indigo:  'linear-gradient(135deg, #9FA8DA, #7986CB)',
  orange:  'linear-gradient(135deg, #FFCC80, #FFA726)',
  coralSoft: 'linear-gradient(135deg, rgba(255,138,128,0.2), rgba(255,107,107,0.1))',
  purpleSoft: 'linear-gradient(135deg, rgba(155,126,222,0.25), rgba(179,157,219,0.1))',
  mintSoft: 'linear-gradient(135deg, rgba(78,205,196,0.2), rgba(128,203,196,0.1))',
  goldenSoft: 'linear-gradient(135deg, rgba(255,217,61,0.2), rgba(255,238,88,0.1))',
  skySoft: 'linear-gradient(135deg, rgba(79,195,247,0.2), rgba(129,212,250,0.1))',
  roseSoft: 'linear-gradient(135deg, rgba(244,143,177,0.2), rgba(236,64,122,0.1))',
};
