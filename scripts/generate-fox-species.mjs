/**
 * 使用 Pollinations.ai 免费 API 批量生成 12 只狐狸物种形象图
 * 运行方式：node scripts/generate-fox-species.mjs
 */
import https from 'https';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = path.resolve('public/species');
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// 统一风格前缀
const STYLE = 'cute kawaii chibi fox character, flat illustration, clean vector style, centered, solid color background, round body, big expressive eyes, fluffy tail, cartoon mascot, high quality, no text';

const species = [
  { file: 'haiwanghu',   prompt: `${STYLE}, a playful fox wearing a golden crown tilted sideways, holding multiple fishing rods with heart-shaped hooks, ocean blue gradient background, mischievous winking expression` },
  { file: 'tiantianhu',  prompt: `${STYLE}, an adorable fox with sparkly heart-shaped eyes, tongue sticking out, tail wagging like a propeller, surrounded by floating pink hearts, warm pink gradient background` },
  { file: 'laosihu',     prompt: `${STYLE}, a cool fox wearing dark sunglasses, one paw on a tiny steering wheel, confident smirk, red sports car silhouette behind, dark red gradient background` },
  { file: 'zhuangsihu',  prompt: `${STYLE}, a fox lying belly-up playing dead, X eyes, soul floating above the body as a tiny ghost fox, chat bubble with "已读" text, purple grey gradient background` },
  { file: 'songsonghu',  prompt: `${STYLE}, a timid fox curled into a tiny ball, only pointy ears and scared eyes visible, wrapped in a blanket shell, shivering lines, deep purple gradient background` },
  { file: 'zhiwuhu',     prompt: `${STYLE}, a fox sitting inside a flower pot like a plant, small green sprout growing from head, blank empty stare, leaves around ears, green purple gradient background` },
  { file: 'xiaochouhu',  prompt: `${STYLE}, a fox with colorful clown face paint, red nose, holding a balloon in one paw, single tear drop, forced smile, teal green gradient background` },
  { file: 'lianfeihu',   prompt: `${STYLE}, a lazy fox slouching on a tiny couch, surrounded by bubble tea cups and phone, messy fur, tired but content expression, grey green gradient background` },
  { file: 'beiweihu',    prompt: `${STYLE}, a small fox kneeling down offering a giant glowing heart above its head, puppy eyes looking up, the heart is much bigger than the fox, dark green gradient background` },
  { file: 'caonihu',     prompt: `${STYLE}, a fox disguised in fluffy alpaca wool coat, innocent big eyes, but fox ears and tail peeking out, golden yellow gradient background, cheeky hidden smile` },
  { file: 'lvchahu',     prompt: `${STYLE}, a fox delicately holding a cup of green matcha tea, angelic innocent expression on front, tiny devil shadow behind, matcha green and gold gradient background` },
  { file: 'xinjihu',     prompt: `${STYLE}, a fox wearing round glasses pushing them up with one paw, chess board pattern behind, knowing smirk, scheming expression, dark orange gold gradient background` },
];

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    const request = (reqUrl) => {
      https.get(reqUrl, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          request(res.headers.location);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} for ${reqUrl}`));
          return;
        }
        res.pipe(file);
        file.on('finish', () => { file.close(); resolve(); });
      }).on('error', reject);
    };
    request(url);
  });
}

async function main() {
  console.log(`🦊 开始生成 ${species.length} 只狐狸物种形象...\n`);

  for (let i = 0; i < species.length; i++) {
    const s = species[i];
    const filepath = path.join(OUTPUT_DIR, `${s.file}.jpg`);

    if (fs.existsSync(filepath) && fs.statSync(filepath).size > 10000) {
      console.log(`⏭️  [${i + 1}/${species.length}] ${s.file}.jpg 已存在，跳过`);
      continue;
    }

    const encodedPrompt = encodeURIComponent(s.prompt);
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&nologo=true&seed=${1000 + i}`;

    console.log(`🎨 [${i + 1}/${species.length}] 正在生成 ${s.file}.jpg ...`);

    try {
      await downloadImage(url, filepath);
      const size = fs.statSync(filepath).size;
      console.log(`   ✅ ${s.file}.jpg — ${(size / 1024).toFixed(1)} KB`);
    } catch (err) {
      console.error(`   ❌ ${s.file}.jpg 失败: ${err.message}`);
    }
  }

  console.log('\n🎉 全部完成！图片保存在 public/species/');
}

main();
