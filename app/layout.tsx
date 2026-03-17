import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Anti-AI Writing Studio",
  description: "去AI味写作引擎 · 中英双语输出 · SEO / GEO 优化 · 图片方案",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
