import { motion } from 'motion/react';

function Bone({ w, h, r = 8, className = '' }: { w: string | number; h: number; r?: number; className?: string }) {
  return (
    <motion.div
      className={`skeleton-bone ${className}`}
      style={{
        width: typeof w === 'number' ? w : w,
        height: h,
        borderRadius: r,
        background: 'rgba(245,239,232,0.05)',
      }}
    />
  );
}

export function HomeSkeletonLoader() {
  return (
    <div className="px-5 pt-6 pb-8">
      {/* Greeting area */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Bone w={80} h={14} className="mb-2" />
          <Bone w={140} h={22} />
        </div>
        <Bone w={44} h={44} r={22} />
      </div>

      {/* Stats pills */}
      <div className="flex gap-3 mb-6">
        <Bone w="33%" h={56} r={14} />
        <Bone w="33%" h={56} r={14} />
        <Bone w="33%" h={56} r={14} />
      </div>

      {/* Hero card */}
      <Bone w="100%" h={160} r={16} className="mb-6" />

      {/* Feature grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Bone w="100%" h={110} r={14} />
        <Bone w="100%" h={110} r={14} />
        <Bone w="100%" h={110} r={14} />
        <Bone w="100%" h={110} r={14} />
      </div>

      {/* Stream card */}
      <Bone w="100%" h={84} r={16} />
    </div>
  );
}
