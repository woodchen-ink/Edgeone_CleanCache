# 腾讯云EdgeOne缓存清理工具

直接使用链接: https://onepage.czl.net/tools/eo_cleancache.html

## 介绍
这是一个用于清理 EdgeOne 缓存的 Cloudflare Worker + 单html页面 项目。

## 功能

- 提供了一个 API 接口，用于提交缓存清理任务。
- 支持多种缓存清理类型，如文件、目录、路径前缀等。
- 可以通过配置文件指定腾讯云 API 的密钥和其他参数。

## 使用方法和部署方法

看帖子: https://q58.pro/t/topic/181?u=wood

## 注意事项

- 确保你的腾讯云 API 密钥安全，不要泄露给他人。
- 缓存清理任务可能需要一些时间来完成，具体取决于目标资源的大小和数量。
- 如果遇到任何问题，请检查 Cloudflare Workers 的日志以获取更多信息。

## 贡献

欢迎提交 Issue 和 Pull Request，共同完善这个项目。

## 许可证

本项目采用 [MIT 许可证](LICENSE)。
