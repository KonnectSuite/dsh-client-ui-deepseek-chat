---
description: "在按账号隔离的 webview 中打开 DeepSeek 聊天的可选桌面页面。"
kind: "package-reference"
---

# @deepseek-ai/dsh-client-ui-deepseek-chat

[English](README.md) | 中文

## 概述

这个可选的 Cordis 客户端插件在 AryaAI Desktop 左侧导航中添加 DeepSeek 聊天。它使用 Sidebar Browser 提供程序创建隔离的 webview，并在切换 Harness 会话时保持页面挂载。用户在 DeepSeek 网站内登录；AryaAI 不会向该网站发送 Platform token。WebUI 不注册此页面，因为网站可能拒绝 iframe 嵌入。

## 使用本包

将 `@deepseek-ai/dsh-client-ui-deepseek-chat` 安装为 profile 依赖，并在 Web 应用 bundle 之后把它加入该 profile 的 `dsh.profile.bundles` 列表。它的 `dsh.bundle` patch 会安装 Cordis 配置项。Web 应用 bundle 提供 `@deepseek-ai/dsh-client-ui-sidebar-browser`。取消选用此 bundle 即可移除导航条目和 webview。在确定 DeepSeek 网站和品牌的分发方式前，本包保持私有。

## 理解实现

插件通过可撤销的 Cordis effect 注册词典、主页面、导航条目和根级 overlay。首次打开后，overlay 保留一个访客页面。`deepseek-chat` 存储命名空间为同一 AryaAI 账号跨 Desktop 重启保留网站 Cookie，并与临时工作区浏览器标签页隔离。DeepSeek 仍可独立使网站会话过期。页面沿用相同的访客权限和下载限制。通过检查的 HTTP(S) popup 请求会在聊天 webview 中导航。

## 模型体验

无。这个用户侧网站页面不注册工具、prompt section 或 Session event。

#### KV Cache 影响

无；网站浏览内容不进入模型请求。

## 已知限制与后续工作

- 聊天网站由 DeepSeek 运营，可能独立于本插件变更。
- 公开分发前须单独审查网站嵌入和 DeepSeek 品牌使用。
