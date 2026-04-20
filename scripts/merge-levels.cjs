/**
 * 合并 6 批关卡卡 -> C:/FoxSay/data/level-cards.json
 */
const fs = require('fs');

const batch1 = require('./gen-levels-1.cjs');
const batch2 = require('./gen-levels-2.cjs');
const batch3 = require('./gen-levels-3.cjs');
const batch4 = require('./gen-levels-4.cjs');
const batch5 = require('./gen-levels-5.cjs');
const batch6 = require('./gen-levels-6.cjs');

const allLevels = { ...batch1, ...batch2, ...batch3, ...batch4, ...batch5, ...batch6 };

const finalData = {
  version: '2.0',
  schema: 'level-v2',
  updated_at: new Date().toISOString(),
  fields_schema: {
    meta: 'kid/title/chapter_id/chapter_name/level_index/difficulty/estimated_turns/unlock_condition/vip_required',
    world: 'era/city/season/world_rules/social_context/tone',
    scene: 'location/time_of_day/weather/atmosphere/sensory_details/props',
    story_node: 'premise/player_objective/narrative_arc/key_plot_beats/branching_hints',
    characters: 'npc_list[] + player_role',
    dialogue: 'opening_message/opening_choices/system_narration_style/max_turns/min_turns_for_good_ending',
    scoring: 'dimensions[]/pass_score/perfect_score_threshold/fail_conditions',
    endings: 'good/neutral/bad',
    tags: '标签'
  },
  levels: allLevels
};

const outPath = 'C:/FoxSay/data/level-cards.json';
fs.writeFileSync(outPath, JSON.stringify(finalData, null, 2), 'utf-8');

const ids = Object.keys(allLevels).sort();
console.log('✅ 合并完成');
console.log(`📝 共 ${ids.length} 个关卡：${ids.join(', ')}`);
console.log(`📁 输出到: ${outPath}`);
console.log(`📊 文件大小: ${(fs.statSync(outPath).size / 1024).toFixed(1)} KB`);
