/**
 * ========================================
 *  KenBurnsImage — 通用"活"图组件
 * ========================================
 *  - Ken Burns：慢推慢拉 + 轻微平移（8~14s 循环）
 *  - 视差倾斜：跟随鼠标/指针轻微 3D 倾斜（可关）
 *  - 呼吸光斑：顶层 radial-gradient 缓动（可关）
 *  - seed：让同章多张图的动画相位错开
 * ========================================
 */
import { useRef, CSSProperties, MouseEvent, ReactNode, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

interface Props {
  src: string;
  alt?: string;
  seed?: number;              // 影响动画方向与相位
  duration?: number;          // Ken Burns 循环时长（秒）
  tilt?: boolean;             // 启用视差倾斜
  tiltStrength?: number;      // 倾斜最大角度（°）
  glow?: boolean;             // 启用呼吸光斑
  glowColor?: string;         // 光斑颜色 rgba
  style?: CSSProperties;      // 透传到容器
  imgStyle?: CSSProperties;   // 透传到 <img>
  overlay?: ReactNode;        // 图片之上的覆盖层
  dimmed?: boolean;           // 变暗（如 VIP 锁定）
  loading?: 'eager' | 'lazy';
}

export function KenBurnsImage({
  src,
  alt = '',
  seed = 0,
  duration = 11,
  tilt = true,
  tiltStrength = 4,
  glow = false,
  glowColor = 'rgba(255,255,255,0.14)',
  style,
  imgStyle,
  overlay,
  dimmed = false,
  loading = 'lazy',
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  // 指针位置（归一化 -0.5 ~ 0.5）
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rx = useSpring(useTransform(py, [-0.5, 0.5], [tiltStrength, -tiltStrength]), { stiffness: 160, damping: 18 });
  const ry = useSpring(useTransform(px, [-0.5, 0.5], [-tiltStrength, tiltStrength]), { stiffness: 160, damping: 18 });

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!tilt) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const handleLeave = () => { px.set(0); py.set(0); };

  // 按 seed 选不同方向/相位，避免整屏同步
  const dir = seed % 4;                 // 0=放大, 1=向左推, 2=向右推, 3=拉远
  const delay = (seed * 0.37) % 3;      // 错开起始时间

  // 用 useMemo 稳定对象引用 —— 父组件 state 变化时不再触发 Framer Motion 重新开始 Ken Burns 循环
  const kenBurnsKeyframes = useMemo(() => {
    switch (dir) {
      case 1:
        return { scale: [1.02, 1.1, 1.02], x: ['-1%', '2%', '-1%'], y: ['0%', '-1%', '0%'] };
      case 2:
        return { scale: [1.06, 1.0, 1.06], x: ['2%', '-2%', '2%'], y: ['1%', '0%', '1%'] };
      case 3:
        return { scale: [1.1, 1.03, 1.1], x: ['0%', '1%', '0%'], y: ['-1%', '1%', '-1%'] };
      default:
        return { scale: [1.0, 1.08, 1.0], x: ['0%', '-1%', '0%'], y: ['0%', '1%', '0%'] };
    }
  }, [dir]);
  const kenBurnsTransition = useMemo(() => ({ duration, repeat: Infinity, ease: 'easeInOut' as const, delay }), [duration, delay]);

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        position: 'relative', width: '100%', height: '100%',
        overflow: 'hidden',
        transformStyle: 'preserve-3d',
        perspective: 1200,
        ...style,
      }}
    >
      <motion.div
        style={{
          position: 'absolute', inset: 0,
          rotateX: tilt ? rx : 0,
          rotateY: tilt ? ry : 0,
          willChange: 'transform',
        }}
      >
        <motion.img
          src={src}
          alt={alt}
          loading={loading}
          draggable={false}
          animate={kenBurnsKeyframes}
          transition={kenBurnsTransition}
          style={{
            width: '100%', height: '100%', objectFit: 'cover', display: 'block',
            userSelect: 'none', pointerEvents: 'none',
            filter: dimmed ? 'brightness(0.5) saturate(0.6)' : undefined,
            ...imgStyle,
          }}
        />
        {/* 呼吸光斑 */}
        {glow && (
          <motion.div
            aria-hidden
            animate={{ opacity: [0.35, 0.75, 0.35] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: delay * 0.6 }}
            style={{
              position: 'absolute', inset: 0,
              background: `radial-gradient(ellipse 60% 45% at 30% 25%, ${glowColor} 0%, transparent 70%)`,
              pointerEvents: 'none', mixBlendMode: 'screen',
            }}
          />
        )}
      </motion.div>
      {overlay}
    </motion.div>
  );
}

export default KenBurnsImage;
