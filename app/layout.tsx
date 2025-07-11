import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/ui/footer";

export const metadata: Metadata = {
  title: "腾讯云EdgeOne缓存刷新工具",
  description: "单页面清理腾讯云Edgeone缓存，提供快速便捷的缓存刷新功能，支持URL、目录、Host、全部以及基于缓存标签的刷新操作。数据保存在浏览器本地，不会上传到任何服务器。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const randomImage = `https://random-api.czl.net/pic/normal`;

  return (
    <html lang="zh-CN">
      <body 
        style={{ 
          backgroundImage: `url(${randomImage})`, 
          backgroundSize: "cover", 
          backgroundPosition: "center", 
          backgroundAttachment: "fixed",
          backdropFilter: "blur(5px)" 
        }}
        className="overflow-x-hidden"
      >
        <div className="min-h-screen flex flex-col">
          <main className="flex-1 pb-20 px-4 py-8">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
