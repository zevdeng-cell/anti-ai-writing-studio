"use client";
import { useState, useEffect } from "react";

// ─── i18n ────────────────────────────────────────────────────────────────────

const I18N: Record<string, any> = {
  zh: {
    subtitle: "去AI味写作引擎 · 中英双语输出 · SEO / GEO 优化 · 图片方案",
    historyBtn: "生成记录", historyTitle: "最近生成记录", historyClear: "清空",
    historyEmpty: "暂无记录", historyLoad: "载入 →",
    labelTopic: "文章主题", labelExtra: "补充要求", labelExtraOpt: "（选填）",
    labelType: "文章类型", labelMode: "发布平台 / Mode",
    extraHint: "✓ 已添加补充要求，将影响文章生成", extraClear: "清空",
    uploadBtn: "📎 上传文件", techLabel: "自动匹配", techUnit: "项去AI味技巧",
    generateBtn: "✦ 开始生成 — 中文 · 英文 · 图片方案",
    topicPlaceholder: "输入文章主题，按 Enter 开始生成…",
    extraPlaceholder: "💡 可以告诉我更多，例如：\n• 目标读者：25-35岁的北美职场女性\n• 产品名称：Lululemon Align Leggings\n• 写作角度：从初学者踩坑经历切入\n• 竞品对比：和Nike、Alo Yoga相比",
    tabZh: "中文版", tabEn: "English", tabImg: "图片方案",
    seoLabel: "SEO 标题", copyTitle: "复制标题", copyFull: "📋 复制全文（含标题）",
    copyTitleEn: "Copy Title", copyFullEn: "📋 Copy Full Article",
    imgEmpty: "暂无图片数据", copyAllImg: "📋 复制全部图片方案", copiedAllImg: "✓ 已复制全部图片方案",
    copied: "✓ 已复制", imgDescZh: "图片内容描述", craftedBy: "Crafted by", errorPrefix: "✕ ",
    steps: ["","生成中文文章…","生成英文版本…","分析图片方案…"],
    stepTitles: ["","正在生成中文文章","正在生成英文版本","正在规划图片方案"],
    stepDetails: [
      [],
      ["正在构思文章结构，稍等一下…","挑选最合适的去AI味技巧…","努力写出有温度的文字中…","检查标点和语感，快好了…"],
      ["把中文内容转化成地道英文…","优化关键词密度和GEO结构…","让每段话都能被AI搜索引擎引用…","润色语气，减少机器感…"],
      ["分析文章结构，规划插图位置…","生成Alt文字和SEO文件名…","为每张图片写说明文字…","整理图片方案，马上完成…"],
    ],
    reviewTitle: "来自全球创作者的反馈", reviewSub: "国内博主、海外营销人、独立创作者都在用",
  },
  en: {
    subtitle: "Anti-AI Engine · Bilingual Output · SEO / GEO · Image Plan",
    historyBtn: "History", historyTitle: "Recent Generations", historyClear: "Clear",
    historyEmpty: "No history yet", historyLoad: "Load →",
    labelTopic: "Topic", labelExtra: "Extra Requirements", labelExtraOpt: "(optional)",
    labelType: "Article Type", labelMode: "Publishing Mode",
    extraHint: "✓ Extra requirements added — will influence output", extraClear: "Clear",
    uploadBtn: "📎 Upload file", techLabel: "Auto-matched", techUnit: "anti-AI techniques",
    generateBtn: "✦ Generate — Chinese · English · Image Plan",
    topicPlaceholder: "Enter your topic, press Enter to generate…",
    extraPlaceholder: "💡 Tell me more, e.g.:\n• Target audience: women aged 25-35 in North America\n• Product name: Lululemon Align Leggings\n• Angle: start from a beginner's mistakes\n• Compare with: Nike, Alo Yoga",
    tabZh: "Chinese", tabEn: "English", tabImg: "Image Plan",
    seoLabel: "SEO Title", copyTitle: "Copy Title", copyFull: "📋 Copy Full Article (with title)",
    copyTitleEn: "Copy Title", copyFullEn: "📋 Copy Full Article",
    imgEmpty: "No image data", copyAllImg: "📋 Copy All Image Specs", copiedAllImg: "✓ Copied",
    copied: "✓ Copied", imgDescZh: "Image Description (ZH)", craftedBy: "Crafted by", errorPrefix: "✕ ",
    steps: ["","Generating Chinese…","Generating English…","Planning images…"],
    stepTitles: ["","Generating Chinese article","Generating English version","Planning image layout"],
    stepDetails: [
      [],
      ["Thinking through the structure…","Picking the best anti-AI techniques…","Writing with warmth and personality…","Checking rhythm and tone, almost done…"],
      ["Adapting content into natural English…","Optimising keyword density and GEO structure…","Making each paragraph citable by AI search…","Polishing tone and reducing robotic feel…"],
      ["Analysing article structure for image spots…","Generating alt text and SEO filenames…","Writing captions for each image…","Wrapping up the image plan…"],
    ],
    reviewTitle: "What creators around the world say", reviewSub: "Bloggers, marketers, and independent creators worldwide",
  },
};

// ─── Data ────────────────────────────────────────────────────────────────────

const ARTICLE_TYPES: Record<string, {id:string,label:string}[]> = {
  zh: [
    { id:"tutorial", label:"教程 / Guide" }, { id:"opinion", label:"观点 / Opinion" },
    { id:"story", label:"故事 / Story" },     { id:"product", label:"评测 / Review" },
    { id:"industry", label:"行业 / Analysis" },{ id:"lifestyle", label:"随笔 / Lifestyle" },
  ],
  en: [
    { id:"tutorial", label:"Tutorial / Guide" }, { id:"opinion", label:"Opinion / Essay" },
    { id:"story", label:"Story / Narrative" },    { id:"product", label:"Product / Review" },
    { id:"industry", label:"Industry / Analysis" },{ id:"lifestyle", label:"Lifestyle / Personal" },
  ],
};

const PUBLISH_MODES: Record<string, {id:string,label:string,desc:string,zhWords:string,enWords:string}[]> = {
  zh: [
    { id:"blog",   label:"📝 普通博客",    desc:"中文 ~1000字 · 英文 ~700词",  zhWords:"约1000字（≤1100字）", enWords:"~700 words (max 800)" },
    { id:"medium", label:"📰 Medium 专业", desc:"中文 ~2500字 · 英文 ~1800词", zhWords:"约2500字（≤2800字）", enWords:"~1800 words (max 2000)" },
  ],
  en: [
    { id:"blog",   label:"📝 Standard Blog", desc:"~1000 words ZH · ~700 words EN",  zhWords:"约1000字（≤1100字）", enWords:"~700 words (max 800)" },
    { id:"medium", label:"📰 Medium Pro",    desc:"~2500 words ZH · ~1800 words EN", zhWords:"约2500字（≤2800字）", enWords:"~1800 words (max 2000)" },
  ],
};

const TECHNIQUES: Record<string, Record<string,string>> = {
  zh: {
    "①":"聊天式口语，禁止说明书词汇","②":"节奏起伏，短长句混搭",
    "③":"句尾多样化，解释句与观点句区分","④":"说话语气，加入自言自语",
    "⑤":"读者视角，提前说出读者烦恼","⑥":"具体落地，加小例子和数字场景",
    "⑦":"加入情绪流动，写出真实感受变化","⑧":"允许逻辑不完美，边想边写感",
    "⑨":"观点鲜明，直接站队不中立","⑩":"彻底消除句式重复",
  },
  en: {
    "①":"Conversational tone, no textbook language","②":"Varied rhythm, mix short and long sentences",
    "③":"Diverse sentence endings, separate opinion from fact","④":"Talking voice, include inner monologue",
    "⑤":"Reader-first, address their pain points upfront","⑥":"Concrete details, add examples and real numbers",
    "⑦":"Emotional flow, show genuine feelings changing","⑧":"Allow imperfect logic, think-as-you-write feel",
    "⑨":"Take a clear stance, no sitting on the fence","⑩":"Eliminate all repetitive sentence patterns",
  },
};

const TYPE_TECHNIQUES: Record<string,string[]> = {
  tutorial:["①","②","③","⑥","⑩"], opinion:["①","③","④","⑦","⑨","⑩"],
  story:["②","④","⑤","⑦","⑧","⑩"], product:["①","③","⑤","⑥","⑨","⑩"],
  industry:["①","②","⑥","⑨","⑩"], lifestyle:["②","④","⑤","⑦","⑧","⑩"],
};

const REVIEWS_A = [
  { name:"陈晓薇", role:"独立博主", av:"陈", color:"#7c3aed", text:"用了这个工具之后，我的文章再也没有被读者说像AI写的了。英文版直接可以发Medium，省了我好多事。" },
  { name:"Marcus Liu", role:"Content Strategist", av:"M", color:"#3b82f6", text:"The bilingual output is a game-changer. I get a polished English draft that actually sounds human, plus image SEO specs ready to hand off." },
  { name:"林建国", role:"跨境电商卖家", av:"林", color:"#10b981", text:"做跨境电商需要大量产品描述，以前担心AI味太重被降权。现在生成的内容感觉真的是人写的，收录速度明显快了。" },
  { name:"Sophie Müller", role:"Freelance Writer, Berlin", av:"S", color:"#f59e0b", text:"As a non-native English speaker, I use this to turn my rough Chinese drafts into proper English. The GEO optimization is something I didn't even know I needed." },
  { name:"张若尘", role:"公众号作者", av:"张", color:"#ec4899", text:"以前自己改AI文章要花两三个小时，现在直接出稿，偶尔微调几句就能发。粉丝说最近文章读起来顺多了。" },
  { name:"Kevin Park", role:"Marketing Lead, Seoul", av:"K", color:"#8b5cf6", text:"We target both Chinese and English-speaking markets. This tool cuts our content production time in half." },
];

const REVIEWS_B = [
  { name:"吴晗", role:"SEO顾问", av:"吴", color:"#06b6d4", text:"图片方案这个功能太实用了，Alt文字、文件名、说明文字一次全给你，直接复制给设计师，完美。" },
  { name:"Priya Sharma", role:"Blogger, Mumbai", av:"P", color:"#f97316", text:"I was skeptical at first, but the output genuinely reads like something a thoughtful human wrote. My Google rankings improved noticeably within a month." },
  { name:"赵梦琪", role:"新媒体运营", av:"赵", color:"#7c3aed", text:"以前用ChatGPT生成总有那种格式感，这个工具生成的完全不一样，更有个性，读者互动率提升了很多。" },
  { name:"Tom Eriksson", role:"SEM Specialist, Stockholm", av:"T", color:"#3b82f6", text:"The GEO optimization is what sets this apart. Content is structured so AI search engines actually cite it." },
  { name:"方浩然", role:"自媒体创业者", av:"方", color:"#10b981", text:"同时输出中英文帮我打开了海外流量渠道。以前完全没想过可以这么低成本做双语内容。" },
  { name:"Aiko Tanaka", role:"Content Creator, Tokyo", av:"A", color:"#ec4899", text:"I use this for my English and Chinese content. The anti-AI techniques apply universally." },
];

const STEP_ICONS = ["", "✍️", "🌐", "🖼️"];
const STEP_WIDTHS = ["0%", "33%", "66%", "95%"];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getMaxTokens(modeId: string, step: string) {
  if (step === "img") return 2048;
  return modeId === "medium" ? 8000 : 4096;
}

function buildZhPrompt(topic: string, typeLabel: string, tecs: string[], modeObj: any, extraCtx: string) {
  const tecList = tecs.map(t => `${t} ${TECHNIQUES.zh[t]}`).join("\n");
  const mediumExtra = modeObj.id === "medium"
    ? "\n\nMedium专业文章额外要求：\n- 开头用一个引人入胜的故事或场景切入\n- 中间分3-4个自然章节，每章节有小标题（用【】包裹）\n- 结尾给读者一个明确的行动建议或思考问题\n- 整体有完整的情绪弧线：引入→冲突→转折→结论" : "";
  return `你是一位长居海外、面向国际华人读者写作的中文内容创作者。写一篇关于「${topic}」的${typeLabel}文章。\n\n输出格式（严格按此顺序）：\n第一行：TITLE: [标题]\n第二行：SUMMARY: [30-50字的一句话小结]\n第三行起：正文\n\nSEO标题要求：15-30字，自然口语，含核心关键词，禁止全面指南、深度解析等套路。\n\n正文去AI味规则：\n${tecList}\n\n【读者定位】读者主要是海外华人：举例优先用欧美场景，货币默认用美元，避免中国本土文化参照。\n\n禁令：不用因此/所以/首先/综上；省略号≤1；感叹号≤2；破折号≤2。\n字数：${modeObj.zhWords}。格式：无Markdown标题符，自然段落。${mediumExtra}${extraCtx}\n\n直接输出，无前言。`;
}

function buildEnPrompt(topic: string, zhBody: string, typeLabel: string, zhTitle: string, modeObj: any, extraCtx: string) {
  const mediumExtra = modeObj.id === "medium"
    ? "\nMedium-specific: Open with a hook story. Use 3-4 sections with bold subheadings. End with actionable takeaway. ~7 min read." : "\nNo markdown headers or bullet points.";
  return `You are an expert SEO and GEO content writer for an international English-speaking audience.\nTopic: "${topic}" | Type: ${typeLabel} | Ref: ${zhTitle}\nContext: ${zhBody.slice(0,300)}...\n\nOutput format (strictly in this order):\nLine 1: TITLE: [SEO title, 50-65 chars]\nLine 2: SUMMARY: [One sentence, 20-35 words, hooking the reader]\nLine 3+: Article body ${modeObj.enWords}\n\nAudience: Western readers (US/UK/AU/CA/EU). Use Western cultural references. Default USD. Avoid China-specific references.\nSEO/GEO: keyword 3-5x, varied sentences, max 2 exclamation marks, self-contained paragraphs.${mediumExtra}${extraCtx}\nOutput directly.`;
}

function buildImgPrompt(topic: string, zhBody: string, zhTitle: string, enTitle: string) {
  return `图片SEO专家。只输出JSON数组。\n主题：${topic} | 中文标题：${zhTitle} | 英文标题：${enTitle}\n正文：${zhBody.slice(0,400)}\n格式：[{"position":"...","reason":"...","zh_description":"...","en_description":"...","image_type":"实拍照片","alt_zh":"...","alt_en":"...","filename":"xxx.jpg","caption_zh":"...","caption_en":"..."}]\n输出3-4张，只有JSON。`;
}

function parseOutput(raw: string) {
  const titleMatch   = raw.match(/^TITLE:\s*(.+)/m);
  const summaryMatch = raw.match(/^SUMMARY:\s*(.+)/m);
  const title   = titleMatch   ? titleMatch[1].trim()   : "";
  const summary = summaryMatch ? summaryMatch[1].trim()  : "";
  const body = raw.replace(/^TITLE:\s*.+\n?/m,"").replace(/^SUMMARY:\s*.+\n?/m,"").replace(/^\n/,"").trim();
  return { title, summary, body };
}

// *** KEY DIFFERENCE from artifact: calls /api/generate instead of Anthropic directly ***
async function callAPI(messages: {role:string,content:string}[], maxTokens: number) {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, max_tokens: maxTokens }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).error || `HTTP ${res.status}`);
  }
  const data = await res.json();
  return data.text as string;
}

function doCopy(text: string, key: string, setCopied: (k:string)=>void) {
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.cssText = "position:fixed;opacity:0;top:0;left:0;width:1px;height:1px";
    document.body.appendChild(ta);
    ta.focus(); ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    if (!ok) throw new Error("execCommand failed");
    setCopied(key); setTimeout(() => setCopied(""), 1800);
  } catch {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => { setCopied(key); setTimeout(() => setCopied(""), 1800); }).catch(() => {});
    }
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FileUploadBtn({ label, onText }: { label: string; onText: (t:string)=>void }) {
  const [hover, setHover] = useState(false);
  return (
    <label onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{position:"absolute",bottom:10,right:10,display:"flex",alignItems:"center",gap:5,padding:"4px 10px",borderRadius:6,cursor:"pointer",border:hover?"1px solid rgba(139,92,246,0.4)":"1px solid rgba(255,255,255,0.08)",background:"rgba(255,255,255,0.04)",color:hover?"rgba(139,92,246,0.8)":"rgba(255,255,255,0.3)",fontSize:11,fontWeight:500,transition:"all 0.2s",userSelect:"none"}}>
      {label}
      <input type="file" accept=".txt,.md,.csv" style={{display:"none"}} onChange={e => {
        const file = e.target.files?.[0]; if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => { let text = (ev.target?.result as string) || ""; if (text.length > 3000) text = text.slice(0,3000) + "\n…"; onText(text); };
        reader.readAsText(file); e.target.value = "";
      }} />
    </label>
  );
}

function SpinIcon() {
  return <span style={{display:"inline-block",width:16,height:16,border:"2px solid rgba(255,255,255,0.2)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin 0.7s linear infinite",flexShrink:0}} />;
}
function PulseIcon() {
  return <span style={{display:"inline-block",width:7,height:7,borderRadius:"50%",background:"#a78bfa",animation:"pulse 1s ease-in-out infinite",flexShrink:0}} />;
}

function CopyBtn({ text, id, label, copiedLabel, copied, onCopy }: any) {
  const active = copied === id;
  return (
    <button onClick={() => onCopy(text, id)} style={{padding:"5px 14px",fontSize:12,borderRadius:6,cursor:"pointer",fontWeight:500,border:active?"1px solid rgba(139,92,246,0.6)":"1px solid rgba(255,255,255,0.08)",background:active?"rgba(139,92,246,0.15)":"rgba(255,255,255,0.04)",color:active?"#c4b5fd":"rgba(255,255,255,0.45)",transition:"all 0.2s",whiteSpace:"nowrap"}}>
      {active ? copiedLabel : label}
    </button>
  );
}

function ReviewCard({ t }: { t: any }) {
  return (
    <div style={{flexShrink:0,width:300,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:"18px 20px",margin:"0 10px",display:"flex",flexDirection:"column",gap:12}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:36,height:36,borderRadius:10,background:t.color+"22",border:"1px solid "+t.color+"44",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:t.color,flexShrink:0}}>{t.av}</div>
        <div>
          <div style={{fontSize:13,fontWeight:600,color:"rgba(255,255,255,0.8)"}}>{t.name}</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.3)",marginTop:1}}>{t.role}</div>
        </div>
        <div style={{marginLeft:"auto",display:"flex",gap:2}}>{[0,1,2,3,4].map(i => <span key={i} style={{fontSize:11,color:"#f59e0b"}}>★</span>)}</div>
      </div>
      <p style={{margin:0,fontSize:13,lineHeight:1.7,color:"rgba(255,255,255,0.5)"}}>&ldquo;{t.text}&rdquo;</p>
    </div>
  );
}

function ReviewRow({ items, animName }: { items: any[]; animName: string }) {
  const doubled = [...items,...items];
  const mask = "linear-gradient(90deg,transparent,black 8%,black 92%,transparent)";
  return (
    <div style={{overflow:"hidden",WebkitMaskImage:mask,maskImage:mask}}>
      <div style={{display:"flex",animation:`${animName} ${items.length*5}s linear infinite`}}>
        {doubled.map((t,i) => <ReviewCard key={i} t={t} />)}
      </div>
    </div>
  );
}

function Testimonials({ t }: { t: any }) {
  return (
    <div style={{paddingBottom:60}}>
      <div style={{maxWidth:820,margin:"0 auto",padding:"0 24px 32px",textAlign:"center"}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(139,92,246,0.1)",border:"1px solid rgba(139,92,246,0.2)",borderRadius:20,padding:"5px 14px",marginBottom:16}}>
          <span style={{fontSize:11,color:"#a78bfa",letterSpacing:1}}>USER REVIEWS</span>
        </div>
        <h2 style={{margin:"0 0 8px",fontSize:22,fontWeight:700,background:"linear-gradient(135deg,#e2d9f3,#a78bfa 50%,#60a5fa)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{t.reviewTitle}</h2>
        <p style={{margin:0,fontSize:13,color:"rgba(255,255,255,0.3)"}}>{t.reviewSub}</p>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        <ReviewRow items={REVIEWS_A} animName="marquee" />
        <ReviewRow items={REVIEWS_B} animName="marquee2" />
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function Home() {
  const [lang, setLang]         = useState("zh");
  const [topic, setTopic]       = useState("");
  const [extra, setExtra]       = useState("");
  const [type, setType]         = useState("tutorial");
  const [mode, setMode]         = useState("blog");
  const [loading, setLoading]   = useState(false);
  const [stepIdx, setStepIdx]   = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [dots, setDots]         = useState("");
  const [result, setResult]     = useState<any>(null);
  const [activeTab, setActiveTab] = useState("zh");
  const [copied, setCopied]     = useState("");
  const [history, setHistory]   = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const t = I18N[lang];
  const articleTypes = ARTICLE_TYPES[lang];
  const publishModes = PUBLISH_MODES[lang];
  const tecs = TYPE_TECHNIQUES[type] || [];
  const cp = (text: string, key: string) => doCopy(text, key, setCopied);

  useEffect(() => {
    const saved = localStorage.getItem("aaw_history");
    if (saved) { try { setHistory(JSON.parse(saved)); } catch {} }
  }, []);

  useEffect(() => {
    if (!loading) { setTipIndex(0); setDots(""); return; }
    const ti = setInterval(() => setTipIndex(i => (i+1) % 4), 2800);
    const td = setInterval(() => setDots(d => d.length >= 3 ? "" : d+"."), 500);
    return () => { clearInterval(ti); clearInterval(td); };
  }, [loading, stepIdx]);

  const saveHistory = (entry: any) => {
    const next = [entry, ...history].slice(0, 10);
    setHistory(next);
    localStorage.setItem("aaw_history", JSON.stringify(next));
  };

  const generate = async () => {
    if (!topic.trim() || loading) return;
    setLoading(true); setResult(null); setActiveTab("zh");
    const typeLabel = (articleTypes.find(a => a.id === type) || {label:""}).label;
    const modeObj = publishModes.find(m => m.id === mode) || publishModes[0];
    const extraCtx = extra.trim() ? `\n\n【补充要求】\n${extra.trim()}` : "";
    try {
      setStepIdx(1);
      const zh = await callAPI([{role:"user",content:buildZhPrompt(topic,typeLabel,tecs,modeObj,extraCtx)}], getMaxTokens(modeObj.id,"zh"));
      const zhOut = parseOutput(zh);

      setStepIdx(2); setActiveTab("en");
      const en = await callAPI([{role:"user",content:buildEnPrompt(topic,zhOut.body,typeLabel,zhOut.title,modeObj,extraCtx)}], getMaxTokens(modeObj.id,"en"));
      const enOut = parseOutput(en);

      setStepIdx(3); setActiveTab("img");
      const imgRaw = await callAPI([{role:"user",content:buildImgPrompt(topic,zhOut.body,zhOut.title,enOut.title)}], getMaxTokens(modeObj.id,"img"));
      let images: any[] = [];
      try { images = JSON.parse(imgRaw.replace(/```json|```/g,"").trim()); } catch {}

      const entry = {
        id:Date.now(), topic, type, mode,
        zhTitle:zhOut.title, zhSummary:zhOut.summary, zhBody:zhOut.body,
        enTitle:enOut.title, enSummary:enOut.summary, enBody:enOut.body,
        images,
        ts:new Date().toLocaleString("zh-CN",{month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"}),
      };
      setResult(entry); saveHistory(entry); setActiveTab("zh");
    } catch(e: any) {
      setResult({error: e.message});
    }
    setStepIdx(0); setLoading(false);
  };

  const TYPE_ICON_MAP: Record<string,string> = {"实拍照片":"📷","插画":"🎨","信息图":"📊","截图":"🖥️","对比图":"↔️"};
  const glass = {background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:16,backdropFilter:"blur(12px)"};
  const labelStyle = {display:"block",fontSize:15,fontWeight:700,color:"rgba(255,255,255,0.85)",letterSpacing:"0.2px",marginBottom:10};
  const outputTabs = [
    {id:"zh",  label:t.tabZh,  sub:result?.zhBody ? result.zhBody.replace(/\s/g,"").length+(lang==="zh"?"字":" chars") : ""},
    {id:"en",  label:t.tabEn,  sub:result?.enBody ? result.enBody.trim().split(/\s+/).length+" words" : ""},
    {id:"img", label:t.tabImg, sub:result?.images?.length ? result.images.length+(lang==="zh"?" 张":" imgs") : ""},
  ];

  return (
    <main style={{minHeight:"100vh",background:"#0d0d14",color:"rgba(255,255,255,0.85)",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",position:"relative",overflowX:"hidden"}}>
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
        <div style={{position:"absolute",top:"-20%",left:"-10%",width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle,rgba(124,58,237,0.18) 0%,transparent 70%)",filter:"blur(40px)"}} />
        <div style={{position:"absolute",top:"30%",right:"-15%",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(59,130,246,0.15) 0%,transparent 70%)",filter:"blur(40px)"}} />
        <div style={{position:"absolute",bottom:"-10%",left:"30%",width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(16,185,129,0.1) 0%,transparent 70%)",filter:"blur(40px)"}} />
      </div>
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,backgroundImage:"linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)",backgroundSize:"60px 60px"}} />

      <div style={{position:"relative",zIndex:10,maxWidth:820,margin:"0 auto",padding:"0 24px 60px"}}>
        {/* Header */}
        <div style={{padding:"40px 0 36px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
              <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#7c3aed,#3b82f6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,boxShadow:"0 0 20px rgba(124,58,237,0.4)"}}>✦</div>
              <h1 style={{margin:0,fontSize:22,fontWeight:700,letterSpacing:"-0.3px",background:"linear-gradient(135deg,#e2d9f3 0%,#a78bfa 50%,#60a5fa 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Anti-AI Writing Studio</h1>
            </div>
            <p style={{margin:0,fontSize:13,color:"rgba(255,255,255,0.35)"}}>{t.subtitle}</p>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{display:"flex",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:3,gap:3}}>
              {["zh","en"].map(l => (
                <button key={l} onClick={() => setLang(l)} style={{padding:"5px 12px",borderRadius:6,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,transition:"all 0.2s",background:lang===l?"rgba(139,92,246,0.3)":"transparent",color:lang===l?"#c4b5fd":"rgba(255,255,255,0.35)"}}>
                  {l === "zh" ? "中文" : "EN"}
                </button>
              ))}
            </div>
            <button onClick={() => setShowHistory(!showHistory)} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 18px",borderRadius:10,cursor:"pointer",border:showHistory?"1px solid rgba(139,92,246,0.5)":"1px solid rgba(255,255,255,0.1)",background:showHistory?"rgba(139,92,246,0.12)":"rgba(255,255,255,0.04)",color:showHistory?"#c4b5fd":"rgba(255,255,255,0.5)",fontSize:13,fontWeight:500,transition:"all 0.2s"}}>
              <span>🕐</span>{t.historyBtn}
              {history.length > 0 && <span style={{background:"rgba(139,92,246,0.3)",color:"#c4b5fd",fontSize:11,padding:"1px 7px",borderRadius:10}}>{history.length}</span>}
            </button>
          </div>
        </div>

        {/* History */}
        {showHistory && (
          <div style={{...glass,marginBottom:20,overflow:"hidden"}}>
            <div style={{padding:"14px 20px",borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <span style={{fontSize:13,fontWeight:600,color:"rgba(255,255,255,0.6)"}}>{t.historyTitle}</span>
              {history.length > 0 && <button onClick={() => { setHistory([]); localStorage.removeItem("aaw_history"); }} style={{background:"transparent",border:"1px solid rgba(239,68,68,0.2)",color:"rgba(239,68,68,0.5)",fontSize:11,padding:"3px 10px",borderRadius:6,cursor:"pointer"}}>{t.historyClear}</button>}
            </div>
            {history.length === 0
              ? <div style={{padding:32,textAlign:"center",color:"rgba(255,255,255,0.2)",fontSize:13}}>{t.historyEmpty}</div>
              : history.map((h, i) => (
                <div key={h.id} onClick={() => { setResult(h); setTopic(h.topic); setType(h.type); setMode(h.mode||"blog"); setActiveTab("zh"); setShowHistory(false); }}
                  style={{padding:"12px 20px",borderBottom:"1px solid rgba(255,255,255,0.04)",cursor:"pointer",display:"flex",alignItems:"center",gap:12,transition:"background 0.15s"}}
                  onMouseEnter={e => (e.currentTarget.style.background="rgba(139,92,246,0.06)")}
                  onMouseLeave={e => (e.currentTarget.style.background="transparent")}>
                  <span style={{fontSize:11,color:"rgba(255,255,255,0.2)",minWidth:18}}>{i+1}</span>
                  <span style={{fontSize:11,color:"rgba(255,255,255,0.25)",minWidth:75}}>{h.ts}</span>
                  <span style={{fontSize:11,background:"rgba(139,92,246,0.15)",color:"#a78bfa",border:"1px solid rgba(139,92,246,0.2)",borderRadius:6,padding:"2px 8px",flexShrink:0}}>
                    {(ARTICLE_TYPES.zh.find(a => a.id===h.type)||{label:h.type}).label}
                  </span>
                  <span style={{flex:1,fontSize:13,color:"rgba(255,255,255,0.65)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{h.topic}</span>
                  <span style={{fontSize:11,color:"rgba(139,92,246,0.6)"}}>{t.historyLoad}</span>
                </div>
              ))
            }
          </div>
        )}

        {/* Input card */}
        <div style={{...glass,padding:28,marginBottom:20}}>
          <div style={{marginBottom:22}}>
            <label style={labelStyle as any}>{t.labelTopic}</label>
            <input value={topic} onChange={e => setTopic(e.target.value)} onKeyDown={e => e.key==="Enter" && generate()}
              placeholder={t.topicPlaceholder}
              style={{width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,padding:"13px 16px",color:"rgba(255,255,255,0.85)",fontSize:15,outline:"none",transition:"border-color 0.2s",boxSizing:"border-box"}}
              onFocus={e => (e.target.style.borderColor="rgba(139,92,246,0.5)")} onBlur={e => (e.target.style.borderColor="rgba(255,255,255,0.1)")} />
          </div>

          <div style={{marginBottom:22}}>
            <label style={labelStyle as any}>{t.labelExtra} <span style={{fontSize:13,fontWeight:400,color:"rgba(255,255,255,0.3)"}}>{t.labelExtraOpt}</span></label>
            <div style={{position:"relative"}}>
              <textarea value={extra} onChange={e => setExtra(e.target.value)} rows={3} placeholder={t.extraPlaceholder}
                style={{width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,padding:"13px 16px",paddingBottom:40,color:"rgba(255,255,255,0.85)",fontSize:14,outline:"none",transition:"border-color 0.2s",boxSizing:"border-box",resize:"vertical",lineHeight:1.7,fontFamily:"inherit"}}
                onFocus={e => (e.target.style.borderColor="rgba(139,92,246,0.5)")} onBlur={e => (e.target.style.borderColor="rgba(255,255,255,0.1)")} />
              <FileUploadBtn label={t.uploadBtn} onText={tx => setExtra(p => p ? p+"\n\n"+tx : tx)} />
            </div>
            {extra.trim() && (
              <div style={{marginTop:6,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <span style={{fontSize:11,color:"rgba(139,92,246,0.6)"}}>{t.extraHint}</span>
                <button onClick={() => setExtra("")} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.2)",fontSize:11,cursor:"pointer"}}>{t.extraClear}</button>
              </div>
            )}
          </div>

          <div style={{marginBottom:22}}>
            <label style={labelStyle as any}>{t.labelType}</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {articleTypes.map(at => {
                const active = type===at.id;
                return <button key={at.id} onClick={() => setType(at.id)} style={{padding:"7px 16px",borderRadius:8,fontSize:13,cursor:"pointer",fontWeight:500,transition:"all 0.2s",border:active?"1px solid rgba(139,92,246,0.5)":"1px solid rgba(255,255,255,0.08)",background:active?"rgba(139,92,246,0.15)":"rgba(255,255,255,0.03)",color:active?"#c4b5fd":"rgba(255,255,255,0.45)"}}>{at.label}</button>;
              })}
            </div>
          </div>

          <div style={{marginBottom:22}}>
            <label style={labelStyle as any}>{t.labelMode}</label>
            <div style={{display:"flex",gap:10}}>
              {publishModes.map(m => {
                const active = mode===m.id;
                return (
                  <button key={m.id} onClick={() => setMode(m.id)} style={{flex:1,padding:"12px 16px",borderRadius:10,fontSize:13,cursor:"pointer",fontWeight:500,transition:"all 0.2s",textAlign:"left",border:active?"1px solid rgba(139,92,246,0.5)":"1px solid rgba(255,255,255,0.08)",background:active?"rgba(139,92,246,0.12)":"rgba(255,255,255,0.03)",color:active?"#c4b5fd":"rgba(255,255,255,0.45)"}}>
                    <div style={{marginBottom:4}}>{m.label}</div>
                    <div style={{fontSize:11,opacity:0.6,fontWeight:400}}>{m.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:10,padding:"12px 16px",marginBottom:22}}>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.25)",marginBottom:8,letterSpacing:"0.5px",textTransform:"uppercase"}}>{t.techLabel} · {tecs.length} {t.techUnit}</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:"6px 20px"}}>
              {tecs.map(tc => <span key={tc} style={{fontSize:12,color:"rgba(255,255,255,0.3)"}}><span style={{color:"#a78bfa"}}>{tc}</span> {TECHNIQUES[lang][tc]}</span>)}
            </div>
          </div>

          <button onClick={generate} disabled={loading||!topic.trim()} style={{width:"100%",padding:"14px",borderRadius:10,fontSize:14,fontWeight:600,cursor:loading||!topic.trim()?"not-allowed":"pointer",border:"none",transition:"all 0.2s",background:loading||!topic.trim()?"rgba(255,255,255,0.05)":"linear-gradient(135deg,#7c3aed,#3b82f6)",color:loading||!topic.trim()?"rgba(255,255,255,0.2)":"#fff",boxShadow:loading||!topic.trim()?"none":"0 0 30px rgba(124,58,237,0.35)"}}>
            {loading ? <span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10}}><SpinIcon />{t.steps[stepIdx]}</span> : t.generateBtn}
          </button>

          {loading && (
            <div style={{marginTop:16}}>
              <div style={{background:"rgba(139,92,246,0.06)",border:"1px solid rgba(139,92,246,0.15)",borderRadius:10,padding:"12px 16px",marginBottom:14,display:"flex",alignItems:"flex-start",gap:12}}>
                <span style={{fontSize:20,flexShrink:0,lineHeight:1}}>{STEP_ICONS[stepIdx]}</span>
                <div>
                  <div style={{fontSize:12,color:"#a78bfa",fontWeight:600,marginBottom:3}}>{t.stepTitles[stepIdx]}{dots}</div>
                  <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",lineHeight:1.6}}>{(t.stepDetails[stepIdx]||[])[tipIndex]}</div>
                </div>
              </div>
              <div style={{height:3,background:"rgba(255,255,255,0.06)",borderRadius:2,overflow:"hidden"}}>
                <div style={{height:"100%",borderRadius:2,transition:"width 0.6s ease",background:"linear-gradient(90deg,#7c3aed,#3b82f6)",width:STEP_WIDTHS[stepIdx],boxShadow:"0 0 10px rgba(139,92,246,0.6)"}} />
              </div>
              <div style={{display:"flex",gap:6,marginTop:10}}>
                {t.steps.slice(1).map((s: string, i: number) => {
                  const done = stepIdx>i, act = stepIdx===i+1;
                  return (
                    <div key={i} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:5,padding:"5px 8px",borderRadius:6,fontSize:11,fontWeight:500,background:done?"rgba(139,92,246,0.15)":act?"rgba(139,92,246,0.08)":"rgba(255,255,255,0.03)",border:done?"1px solid rgba(139,92,246,0.3)":act?"1px solid rgba(139,92,246,0.2)":"1px solid rgba(255,255,255,0.05)",color:done?"#a78bfa":act?"rgba(255,255,255,0.6)":"rgba(255,255,255,0.2)"}}>
                      {done ? "✓" : act ? <PulseIcon /> : "○"}<span>{s.replace("…","")}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {result?.error && (
          <div style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:12,padding:"16px 20px",marginBottom:20,color:"rgba(239,68,68,0.8)",fontSize:13}}>{t.errorPrefix}{result.error}</div>
        )}

        {result && !result.error && (
          <div style={{...glass,overflow:"hidden"}}>
            <div style={{display:"flex",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
              {outputTabs.map(tab => {
                const active = activeTab===tab.id;
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{flex:1,padding:"14px 12px",background:active?"rgba(139,92,246,0.08)":"transparent",border:"none",borderBottom:active?"2px solid #8b5cf6":"2px solid transparent",cursor:"pointer",fontSize:13,fontWeight:500,display:"flex",alignItems:"center",justifyContent:"center",gap:6,transition:"all 0.2s",color:active?"#c4b5fd":"rgba(255,255,255,0.35)"}}>
                    {tab.label}{tab.sub && <span style={{fontSize:11,opacity:0.6,background:"rgba(255,255,255,0.06)",borderRadius:4,padding:"1px 6px"}}>{tab.sub}</span>}
                  </button>
                );
              })}
            </div>

            {activeTab==="zh" && (
              <div>
                {result.zhTitle && (
                  <div style={{padding:"20px 28px",borderBottom:"1px solid rgba(255,255,255,0.06)",background:"rgba(139,92,246,0.04)"}}>
                    <div style={{fontSize:11,color:"rgba(255,255,255,0.25)",letterSpacing:"0.5px",textTransform:"uppercase",marginBottom:8}}>{t.seoLabel}</div>
                    <div style={{display:"flex",alignItems:"flex-start",gap:16}}>
                      <div style={{flex:1,fontSize:18,fontWeight:700,color:"rgba(255,255,255,0.9)",lineHeight:1.5}}>{result.zhTitle}</div>
                      <CopyBtn text={result.zhTitle} id="zh-t" label={t.copyTitle} copiedLabel={t.copied} copied={copied} onCopy={cp} />
                    </div>
                  </div>
                )}
                <div style={{padding:"24px 28px",fontSize:15,lineHeight:1.95,color:"rgba(255,255,255,0.7)",whiteSpace:"pre-wrap",minHeight:200,fontFamily:"'Noto Serif SC','Georgia',serif"}}>
                  {result.zhSummary && <p style={{fontStyle:"italic",color:"rgba(255,255,255,0.45)",fontSize:14,lineHeight:1.8,borderLeft:"2px solid rgba(139,92,246,0.4)",paddingLeft:14,marginBottom:24,marginTop:0}}>{result.zhSummary}</p>}
                  {result.zhBody}
                </div>
                <div style={{padding:"16px 28px 20px",borderTop:"1px solid rgba(255,255,255,0.05)"}}>
                  <CopyBtn text={(result.zhTitle?result.zhTitle+"\n\n":"")+(result.zhSummary?result.zhSummary+"\n\n":"")+result.zhBody} id="zh-f" label={t.copyFull} copiedLabel={t.copied} copied={copied} onCopy={cp} />
                </div>
              </div>
            )}

            {activeTab==="en" && (
              <div>
                {result.enTitle && (
                  <div style={{padding:"20px 28px",borderBottom:"1px solid rgba(255,255,255,0.06)",background:"rgba(59,130,246,0.04)"}}>
                    <div style={{fontSize:11,color:"rgba(255,255,255,0.25)",letterSpacing:"0.5px",textTransform:"uppercase",marginBottom:8}}>SEO Title · {result.enTitle.length} chars</div>
                    <div style={{display:"flex",alignItems:"flex-start",gap:16}}>
                      <div style={{flex:1,fontSize:18,fontWeight:700,color:"rgba(255,255,255,0.9)",lineHeight:1.5,fontFamily:"Georgia,serif"}}>{result.enTitle}</div>
                      <CopyBtn text={result.enTitle} id="en-t" label={t.copyTitleEn} copiedLabel={t.copied} copied={copied} onCopy={cp} />
                    </div>
                  </div>
                )}
                <div style={{padding:"24px 28px",fontSize:15,lineHeight:1.9,color:"rgba(255,255,255,0.7)",whiteSpace:"pre-wrap",minHeight:200,fontFamily:"Georgia,serif"}}>
                  {result.enSummary && <p style={{fontStyle:"italic",color:"rgba(255,255,255,0.45)",fontSize:14,lineHeight:1.8,borderLeft:"2px solid rgba(59,130,246,0.4)",paddingLeft:14,marginBottom:24,marginTop:0,fontFamily:"Georgia,serif"}}>{result.enSummary}</p>}
                  {result.enBody}
                </div>
                <div style={{padding:"16px 28px 20px",borderTop:"1px solid rgba(255,255,255,0.05)",display:"flex",alignItems:"center",gap:12}}>
                  <CopyBtn text={(result.enTitle?result.enTitle+"\n\n":"")+(result.enSummary?result.enSummary+"\n\n":"")+result.enBody} id="en-f" label={t.copyFullEn} copiedLabel={t.copied} copied={copied} onCopy={cp} />
                  <span style={{marginLeft:"auto",fontSize:11,color:"rgba(255,255,255,0.2)"}}>✓ SEO · ✓ GEO / AI Search</span>
                </div>
              </div>
            )}

            {activeTab==="img" && (
              <div style={{padding:24}}>
                {(!result.images||result.images.length===0)
                  ? <div style={{textAlign:"center",color:"rgba(255,255,255,0.2)",padding:40,fontSize:13}}>{t.imgEmpty}</div>
                  : (
                    <div style={{display:"flex",flexDirection:"column",gap:14}}>
                      {result.images.map((img: any, i: number) => (
                        <div key={i} style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:12,overflow:"hidden"}}>
                          <div style={{padding:"12px 18px",borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",gap:10,background:"rgba(139,92,246,0.05)"}}>
                            <div style={{width:26,height:26,borderRadius:8,background:"linear-gradient(135deg,#7c3aed,#3b82f6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"#fff",flexShrink:0}}>{i+1}</div>
                            <div style={{flex:1}}>
                              <div style={{fontSize:13,fontWeight:600,color:"rgba(255,255,255,0.75)"}}>{img.position}</div>
                              <div style={{fontSize:11,color:"rgba(255,255,255,0.3)",marginTop:2}}>{img.reason}</div>
                            </div>
                            <span style={{fontSize:11,background:"rgba(139,92,246,0.12)",border:"1px solid rgba(139,92,246,0.2)",color:"#a78bfa",borderRadius:6,padding:"3px 10px"}}>{TYPE_ICON_MAP[img.image_type]||"🖼️"} {img.image_type}</span>
                          </div>
                          <div style={{padding:16}}>
                            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                              {[{flag:"🇨🇳",label:t.imgDescZh,val:img.zh_description},{flag:"🇺🇸",label:"Image Description",val:img.en_description}].map(row => (
                                <div key={row.label} style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,padding:12}}>
                                  <div style={{fontSize:11,color:"rgba(255,255,255,0.25)",marginBottom:6}}>{row.flag} {row.label}</div>
                                  <div style={{fontSize:12,color:"rgba(255,255,255,0.55)",lineHeight:1.6}}>{row.val}</div>
                                </div>
                              ))}
                            </div>
                            <div style={{display:"flex",flexDirection:"column",gap:6}}>
                              {[
                                {label:"Alt 中文",val:img.alt_zh,id:`az${i}`},
                                {label:"Alt EN",val:img.alt_en,id:`ae${i}`},
                                {label:"Filename",val:img.filename,id:`fn${i}`,mono:true},
                                {label:"说明 (中)",val:img.caption_zh,id:`cz${i}`},
                                {label:"Caption",val:img.caption_en,id:`ce${i}`},
                              ].filter(r => r.val).map(row => (
                                <div key={row.id} style={{display:"flex",alignItems:"center",gap:10,background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:7,padding:"7px 12px"}}>
                                  <span style={{fontSize:11,color:"rgba(255,255,255,0.25)",minWidth:72}}>{row.label}</span>
                                  <span style={{flex:1,fontSize:12,color:"rgba(255,255,255,0.5)",fontFamily:(row as any).mono?"monospace":"inherit",wordBreak:"break-all"}}>{row.val}</span>
                                  <CopyBtn text={row.val} id={row.id} label="Copy" copiedLabel={t.copied} copied={copied} onCopy={cp} />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                      <button onClick={() => cp(result.images.map((img: any,i: number) => `=== 图片 ${i+1} ===\n位置：${img.position}\n原因：${img.reason}\n类型：${img.image_type}\n\n中文描述：${img.zh_description}\nEN: ${img.en_description}\n\nAlt中：${img.alt_zh}\nAlt EN: ${img.alt_en}\nFilename: ${img.filename}\n说明（中）：${img.caption_zh}\nCaption: ${img.caption_en}`).join("\n\n"), "all-img")}
                        style={{width:"100%",padding:"12px",borderRadius:10,fontSize:13,fontWeight:500,cursor:"pointer",border:copied==="all-img"?"1px solid rgba(139,92,246,0.5)":"1px solid rgba(255,255,255,0.08)",background:copied==="all-img"?"rgba(139,92,246,0.1)":"rgba(255,255,255,0.03)",color:copied==="all-img"?"#c4b5fd":"rgba(255,255,255,0.4)",transition:"all 0.2s"}}>
                        {copied==="all-img" ? t.copiedAllImg : t.copyAllImg}
                      </button>
                    </div>
                  )
                }
              </div>
            )}
          </div>
        )}
      </div>

      <Testimonials t={t} />

      <div style={{textAlign:"center",paddingBottom:40}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:10,padding:"10px 24px",borderRadius:30,background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)"}}>
          <div style={{width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#7c3aed,#3b82f6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"#fff"}}>S</div>
          <span style={{fontSize:13,color:"rgba(255,255,255,0.3)"}}>{t.craftedBy}</span>
          <span style={{fontSize:13,fontWeight:600,background:"linear-gradient(135deg,#a78bfa,#60a5fa)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Steven Deng</span>
        </div>
      </div>

      <style>{`
        input::placeholder,textarea::placeholder{color:rgba(255,255,255,0.2)}
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(139,92,246,0.3);border-radius:2px}
        @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes marquee2{from{transform:translateX(-50%)}to{transform:translateX(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(0.7)}}
      `}</style>
    </main>
  );
}add main page UI
