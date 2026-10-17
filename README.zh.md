---
description: "在按账号隔离的 webview 中打开 DeepSeek 聊天的可选桌面页面。"
kind: "package-bundle"
---

# @deepseek-ai/dsh-client-ui-deepseek-chat

[English](README.md) | 中文

## 概述

这个可选的 Cordis 客户端插件在 AryaAI Desktop 左侧导航中添加 DeepSeek 聊天和 Rockwell 资源。它使用 Sidebar Browser 提供程序创建隔离的 webview，并在切换 Harness 会话时保持页面挂载。用户在 DeepSeek 网站内登录；AryaAI 不会向该网站发送 Platform token。WebUI 不注册此页面，因为网站可能拒绝 iframe 嵌入。


## 目录

- [模型体验](#model-experience)
- [已知限制与延期工作](#known-limitations-and-deferred-work)
- [开发备注](#dev-note)

## 使用本包

从 Plugin Market 的 Arya 插件标签页安装 DeepSeek Chat；安装程序不包含它，也不会默认选用它。它的 `dsh.bundle` patch 会安装 Cordis 配置项。Web 应用 bundle 提供 `@deepseek-ai/dsh-client-ui-sidebar-browser`。取消选用此 bundle 即可移除导航条目和 webview。经过校验的插件包通过 Plugin Market 以 GitHub 发布资源分发，而不通过 npm。

## 理解实现

插件通过可撤销的 Cordis effect 注册词典、主页面、导航条目和根级 overlay。首次打开后，overlay 保留一个访客页面，并起始于 Desktop 标题栏下方，使其工具栏占据主面板所属的那一行，而不会覆盖窗口标题条。`deepseek-chat` 存储命名空间为同一 AryaAI 账号跨 Desktop 重启保留网站 Cookie，并与临时工作区浏览器标签页隔离。DeepSeek 仍可独立使网站会话过期。页面沿用相同的访客权限和下载限制。通过检查的 HTTP(S) popup 请求会在聊天 webview 中导航。工具栏的刷新始终有效：屏幕上没有地址时重新打开入口页；载体接受请求时工具栏显示加载进度；载体完全拒绝时则退役该访客页面并重建替代者。

<a id="rockwell-resources"></a>
## Rockwell 资源

从左侧导航打开 Rockwell 资源，选择连接 Rockwell。请直接在 Rockwell 网站登录并完成验证。知识库、下载中心和示例代码的官方入口在同一保留的浏览器中打开。工具栏显示浏览器状态，不代表 Rockwell 登录成功或具备 TechConnect 权限。

`rockwell-resources` 命名空间为本机同一 Arya 账户跨重启保留 Cookie。断开连接 / 清除会话会关闭相关页面，并清除 Cookie、本地存储、HTTP 身份验证和缓存。它不会撤销其他电脑上的 Rockwell 会话，也不会删除已下载文件。关闭 Arya 或禁用插件会保留本地登录。

所属 Rockwell HTTPS 页面发起的下载使用 Electron 保存对话框；每次重定向都必须保持 HTTPS。保存的示例代码和安装程序不会自动执行或导入。其他嵌入浏览器继续执行原有下载限制。这是浏览器访问，而不是官方 Rockwell API 集成：TechConnect 合同、软件许可证、MFA 和网站变更可能限制访问。

启用桌面计算机操作工具后，Arya 可以使用可见页面。应让用户完成登录后再检查页面；引用内容时注明文章 ID、URL 和产品版本。公开手册无需账户。

选择启用 Playwright 记住登录，使 Arya 的浏览器工具保留网站登录状态。新建聊天并要求 Arya 使用 Playwright 打开 Rockwell 知识库，然后在可见 Chromium 窗口中自行完成登录和 MFA。随后 Arya 可通过现有的已记录浏览器工具搜索和阅读账户允许访问的页面。配置重新加载会结束活动浏览器连接，因此切换模式前请完成当前浏览器操作。一个活动聊天占用此配置，直到其运行时卸载；占用期间启动的其他激活不会获得浏览器工具。

在 Windows 上，在聊天右侧栏打开 Native Window，打开其窗口列表，选择 Playwright 正在控制的 Chromium 窗口。停靠该窗口，可在单个显示器上同时查看聊天和登录页面。导航、页面检查和截图使用 Playwright 工具，其浏览器连接不要求前台焦点。桌面鼠标和键盘工具仍要求目标可见并获得焦点。嵌入的 Rockwell Resources 页面与 Playwright 使用独立的身份验证。

专用配置存储在 `DSH_HOME/browser-profiles/rockwell`；Arya 组合定义 Windows 用户主目录后备路径。它由使用本地主机的聊天共享，独立于嵌入页面按 Arya 账户保存的存储。启用后会影响该主机全部 Playwright 浏览，不限于 Rockwell。切换回隔离 Playwright 会保留磁盘配置。断开连接 / 清除会话仅清除嵌入页面；请在 Playwright 内退出 Rockwell 登录。两个浏览器都不报告已验证的 TechConnect 权限。

<a id="model-experience"></a>
## 模型体验

无。这个用户侧网站页面不注册工具、prompt section 或 Session event。

#### KV Cache 影响

页面不添加模型上下文。通过计算机操作工具请求的截图使用这些工具已有的记录图像结果流程。

## 已知限制与后续工作

<a id="known-limitations-and-deferred-work"></a>

- 聊天网站由 DeepSeek 运营，可能独立于本插件变更。
- 公开分发前须单独审查网站嵌入和 DeepSeek 品牌使用。

<a id="dev-note"></a>
### 开发备注

<details>
<summary>维护者上下文</summary>

无。

</details>
