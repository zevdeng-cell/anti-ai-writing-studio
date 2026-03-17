# ✦ Anti-AI Writing Studio

> 去AI味写作引擎 · 中英双语输出 · SEO / GEO 优化 · 图片方案

A bilingual content generation tool that produces natural, human-sounding articles in both Chinese and English — with built-in SEO/GEO optimization and image placement suggestions.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![Powered by Claude](https://img.shields.io/badge/Powered%20by-Claude%20Sonnet-7c3aed)

---

## ✨ Features

- **去AI味写作** — 10 proven techniques to make AI-generated content sound genuinely human
- **中英双语输出** — Generates a Chinese article and a full English SEO/GEO version simultaneously
- **Article summary** — Auto-generates a short italic teaser between the title and body
- **Image SEO plan** — Recommends image placements with alt text, filenames, and captions in both languages
- **Two publishing modes** — Standard blog (~1000 words ZH / ~700 words EN) or Medium Professional (~2500 words ZH / ~1800 words EN)
- **Supplementary requirements** — Add custom instructions or upload a reference `.txt` file
- **Generation history** — Saves last 10 articles locally for quick reload
- **中英文界面切换** — Full UI available in both Chinese and English
- **International audience** — Content defaults to Western cultural references (US/UK/AU/CA/EU)

---

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/anti-ai-writing-studio.git
cd anti-ai-writing-studio
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.local.example .env.local
```

Open `.env.local` and add your Anthropic API key:

```env
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxx
```

> Get your API key at [console.anthropic.com](https://console.anthropic.com)

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deploy to Vercel

```bash
npm i -g vercel
vercel --prod
```

Then go to your Vercel project → **Settings → Environment Variables** and add:

| Key | Value |
|-----|-------|
| `ANTHROPIC_API_KEY` | `sk-ant-your-key-here` |

Redeploy once after adding the key.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/anti-ai-writing-studio)

---

## 🗂️ Project Structure

```
anti-ai-writing-studio/
├── app/
│   ├── page.tsx              # Main frontend UI
│   └── api/
│       └── generate/
│           └── route.ts      # Server-side API route (keeps API key secure)
├── .env.local.example        # Environment variable template
├── .env.local                # Your local secrets (never commit this)
├── .gitignore
├── package.json
└── next.config.ts
```

---

## 🔑 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | ✅ Yes | Your Anthropic API key from console.anthropic.com |

---

## 💡 Anti-AI Writing Techniques

| # | 中文说明 | English |
|---|---------|---------|
| ① | 聊天式口语，禁止说明书词汇 | Conversational tone, no textbook language |
| ② | 节奏起伏，短长句混搭 | Varied rhythm, mix short and long sentences |
| ③ | 句尾多样化，解释句与观点句区分 | Diverse sentence endings |
| ④ | 说话语气，加入自言自语 | Talking voice, include inner monologue |
| ⑤ | 读者视角，提前说出读者烦恼 | Reader-first, address pain points upfront |
| ⑥ | 具体落地，加小例子和数字场景 | Concrete details, real examples and numbers |
| ⑦ | 加入情绪流动，写出真实感受变化 | Emotional flow, show genuine feelings |
| ⑧ | 允许逻辑不完美，边想边写感 | Allow imperfect logic, think-as-you-write |
| ⑨ | 观点鲜明，直接站队不中立 | Take a clear stance, no sitting on the fence |
| ⑩ | 彻底消除句式重复 | Eliminate all repetitive sentence patterns |

---

## 📦 Tech Stack

- [Next.js 15](https://nextjs.org/) — React framework
- [Anthropic Claude Sonnet](https://www.anthropic.com/) — AI model
- [Vercel](https://vercel.com/) — Deployment platform
- Pure CSS-in-JS styling (no UI library dependency)

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

## 🙌 Author

Made with ❤️ by **Steven Deng**

If you find this useful, give the repo a ⭐
