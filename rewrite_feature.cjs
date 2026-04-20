const fs = require('fs');

const content = import { motion } from 'motion/react';
import { Keyboard, Dumbbell, Stethoscope, Users, BookOpen, Fingerprint } from 'lucide-react';

const features = [
  {
    label: '恋爱键盘',
    Icon: Keyboard,
    bg: '#FFE4E6',
    color: '#E11D48',
    badge: null,
  },
  {
    label: '训练场',
    Icon: Dumbbell,
    bg: '#E0E7FF',
    color: '#4F46E5',
    badge: '新',
  },
  {
    label: '聊天诊断',
    Icon: Stethoscope,
    bg: '#FAE8FF',
    color: '#C026D3',
    badge: null,
  },
  {
    label: '社区',
    Icon: Users,
    bg: '#E0F2FE',
    color: '#0284C7',
    badge: null,
  },
  {
    label: '恋爱秘籍',
    Icon: BookOpen,
    bg: '#FEF3C7',
    color: '#D97706',
    badge: null,
  },
  {
    label: '人设中心',
    Icon: Fingerprint,
    bg: '#DCFCE7',
    color: '#059669',
    badge: null,
  },
];

export function FeatureGrid() {
  return (
    <div className="pb-6">
      <div className="px-5 mb-4 flex items-center justify-between">
        <span style={{ color: '#111827', fontSize: '18px', fontWeight: 800, letterSpacing: '-0.3px' }}>功能入口</span>
        <span style={{ color: '#10B981', fontSize: '14px', fontWeight: 600 }}>查看全部 &rarr;</span>
      </div>

      <div className="px-5">
        <div className="grid grid-cols-3 gap-3">  
          {features.map((feature, index) => (
            <motion.button
              key={feature.label}
              className="flex flex-col items-center gap-2 bg-white rounded-3xl p-4 shadow-[0_8px_24px_rgba(0,0,0,0.04)] border border-gray-100"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4, ease: 'easeOut' }}
              whileTap={{ scale: 0.95 }}
            >
              <div
                className="relative rounded-2xl flex items-center justify-center"
                style={{
                  width: '100%',
                  aspectRatio: '1/1',
                  background: feature.bg,
                }}
              >
                <feature.Icon size={28} color={feature.color} strokeWidth={2.5} />

                {feature.badge && (
                  <div
                    className="absolute -top-2 -right-2 rounded-full flex items-center justify-center shadow-sm"
                    style={{
                      background: '#10B981',
                      padding: '4px 8px',
                    }}
                  >
                    <span style={{ color: '#FFFFFF', fontSize: '10px', fontWeight: 800 }}>
                      {feature.badge}
                    </span>
                  </div>
                )}
              </div>

              <span style={{ color: '#374151', fontSize: '13px', fontWeight: 700 }}>{feature.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
;

fs.writeFileSync('C:/FoxSay/src/components/home/FeatureGrid.jsx', content, 'utf8');
console.log('Wrote FeatureGrid.jsx');
