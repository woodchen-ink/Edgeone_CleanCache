import { CleanCacheForm } from "./form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "腾讯云EdgeOne缓存刷新工具",
  description: "单页面清理腾讯云Edgeone缓存，提供快速便捷的缓存刷新功能，支持URL、目录、Host、全部以及基于缓存标签的刷新操作。数据保存在浏览器本地，不会上传到任何服务器。",
};

export default function CleanCachePage() {
  return (
    <div className="w-full max-w-4xl mx-auto flex items-start justify-center">
      <CleanCacheForm />
    </div>
  );
}