import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Star, X, Clock, Users, ChevronRight } from 'lucide-react';
import { IconBubble, IcStar, IcSparkle, gradients } from './CuteIcons';

const cards = [
  {
    id: 1, title: '浪漫晚餐模拟', sub: '约 8 分钟', rating: '4.88', tag: '新上线',
    desc: '学会在高级餐厅约会时的礼仪和对话技巧，从点菜到告别全流程演练。',
    skills: ['餐桌礼仪', '话题引导', '氛围感'],
    participants: 1280,
    image: 'https://images.unsplash.com/photo-1773188243397-29591fa09047?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwZGlubmVyJTIwZGF0ZSUyMGNhbmRsZWxpZ2h0JTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3NzYxNTIyNjh8MA&ixlib=rb-4.1.0&q=80&w=600',
  },
  {
    id: 2, title: '公园下午约会', sub: '约 10 分钟', rating: '4.95', tag: '热门',
    desc: '自然户外环境中的对话练习，学习如何在轻松氛围里展开深度话题。',
    skills: ['自然开场', '深入话题', '肢体语言'],
    participants: 2340,
    image: 'https://images.unsplash.com/photo-1764153466617-08a9a40a7c93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VwbGUlMjB3YWxraW5nJTIwYXV0dW1uJTIwcGFyayUyMHJvbWFudGljfGVufDF8fHx8MTc3NjE1MjI3MHww&ixlib=rb-4.1.0&q=80&w=600',
  },
];

export function FeatureGrid() {
  const [selectedCard, setSelectedCard] = useState<typeof cards[0] | null>(null);

  return (
    <>
      <div className="px-5 pb-4">
        <div className="flex items-center justify-between mb-5">
          <span style={{ color: '#f5efe8', fontSize: '18px', fontWeight: 600, letterSpacing: '0.2px', lineHeight: 1.19 }}>今日练习</span>
          <button style={{ color: '#FF8A80', fontSize: '14px', fontWeight: 400 }}>更多 ›</button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {cards.map((card, idx) => (
            <motion.button
              key={card.id}
              className="flex flex-col text-left overflow-hidden"
              style={{
                borderRadius: 13,
                border: '1px solid rgba(245,239,232,0.08)',
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedCard(card)}
            >
                <div className="flex flex-col overflow-hidden w-full card-interactive" style={{ background: '#453a60', borderRadius: 13 }}>
                <div className="relative w-full" style={{ height: 130 }}>
                  <ImageWithFallback src={card.image} alt={card.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 px-2 py-0.5" style={{ background: 'rgba(0,0,0,0.56)', borderRadius: 5 }}>
                    <span style={{ color: '#f5f5f7', fontSize: '10px', fontWeight: 600 }}>{card.tag}</span>
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex items-center gap-1 mb-1">
                    <Star size={10} color="#FFD93D" strokeWidth={0} fill="#FFD93D" />
                    <span style={{ color: '#f5efe8', fontSize: '12px', fontWeight: 600 }}>{card.rating}</span>
                  </div>
                  <h4 style={{ color: '#f5efe8', fontSize: '15px', fontWeight: 700, letterSpacing: '0px', lineHeight: 1.29, marginBottom: 3 }}>{card.title}</h4>
                  <span style={{ color: 'rgba(245,239,232,0.45)', fontSize: '11px' }}>{card.sub}</span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            className="fixed inset-0 z-[100] flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setSelectedCard(null)} />
            <motion.div
              className="relative mt-auto w-full overflow-hidden"
              style={{ maxWidth: 430, margin: '0 auto', background: '#453a60', borderRadius: '20px 20px 0 0' }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            >
              <div className="relative" style={{ height: 180 }}>
                <ImageWithFallback src={selectedCard.image} alt={selectedCard.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 30%, rgba(61,54,80,0.92) 100%)' }} />
                <motion.button
                  className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(0,0,0,0.4)' }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedCard(null)}
                >
                  <X size={16} color="#fff" />
                </motion.button>
                <div className="absolute bottom-4 left-5">
                  <h2 style={{ color: '#fff', fontSize: '21px', fontWeight: 600, marginBottom: 4 }}>{selectedCard.title}</h2>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Star size={12} color="#FFD93D" fill="#FFD93D" strokeWidth={0} />
                      <span style={{ color: '#fff', fontSize: '13px', fontWeight: 600 }}>{selectedCard.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={12} color="rgba(255,255,255,0.6)" />
                      <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>{selectedCard.sub}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={12} color="rgba(255,255,255,0.6)" />
                      <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>{selectedCard.participants}人参与</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-5 py-5">
                <p style={{ color: 'rgba(245,239,232,0.75)', fontSize: '14px', lineHeight: 1.6, marginBottom: 16 }}>
                  {selectedCard.desc}
                </p>

                <div className="mb-5">
                  <span style={{ color: 'rgba(245,239,232,0.58)', fontSize: '12px', fontWeight: 500, marginBottom: 8, display: 'block' }}>练习技能</span>
                  <div className="flex gap-2">
                    {selectedCard.skills.map(s => (
                      <span key={s} className="px-3 py-1" style={{ background: '#574d72', borderRadius: 6, color: 'rgba(245,239,232,0.75)', fontSize: '12px', fontWeight: 500 }}>{s}</span>
                    ))}
                  </div>
                </div>

                <motion.button
                  className="w-full py-3.5 flex items-center justify-center gap-2"
                  style={{ background: '#FF8A80', borderRadius: 12, color: '#2b2535', fontSize: '15px', fontWeight: 600 }}
                  whileTap={{ scale: 0.97 }}
                >
                  开始练习
                  <ChevronRight size={16} />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}