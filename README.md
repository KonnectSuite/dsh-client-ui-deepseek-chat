---
description: "Optional desktop page that opens DeepSeek Chat in an account-scoped webview."
kind: "package-bundle"
---

# @deepseek-ai/dsh-client-ui-deepseek-chat

English | [中文](README.zh.md)

## Summary

This optional Cordis client plugin adds DeepSeek Chat to AryaAI Desktop's left navigation. It uses the Sidebar Browser provider for an isolated webview and keeps the page mounted while the selected Harness Session changes. The user signs in on the DeepSeek website; AryaAI does not send its Platform token to that website. The plugin does not register the page in WebUI, where the website may refuse iframe embedding.


## Table of Contents

- [Model Experience](#model-experience)
- [Known Limitations and Deferred Work](#known-limitations-and-deferred-work)
- [Dev Note](#dev-note)

## Use this package

Install DeepSeek Chat from the Arya plugins tab in Plugin Market; it is not included in the installer or selected by default. Its `dsh.bundle` patch installs the Cordis row. The Web bundle supplies `@deepseek-ai/dsh-client-ui-sidebar-browser`. Removing the bundle selection removes the navigation entry and webview. Verified packages are distributed as GitHub release assets through Plugin Market, rather than npm. Rockwell Resources now ships as the separate `@deepseek-ai/dsh-client-ui-rockwell-resources` plugin; install it separately to keep that page.

## Understand the implementation

The plugin registers its locale, main page, navigation row, and root overlay through reversible Cordis effects. The overlay retains one guest after its first opening, and begins below the Desktop caption strip so its toolbar occupies the row a main panel owns rather than painting over the window's title strip. Its `deepseek-chat` storage namespace keeps website cookies across Desktop restarts for the same AryaAI account, separate from temporary workspace Browser tabs. DeepSeek may expire the website session independently. The same guest permissions and download restrictions apply. Approved HTTP(S) popup requests navigate the Chat webview. Toolbar Reload always acts: with no address on screen it reopens the entry point, a request the carrier accepts is reported in the toolbar, and a request the carrier refuses outright retires the guest and stands up its replacement.

## Model Experience

None, as this user-facing website page registers no tool, prompt section, or Session event.

#### KV Cache effect

The page adds no model context. Screenshots requested through computer-use tools follow those tools’ logged image-result path.

## Known Limitations and Deferred Work

- The Chat website is operated by DeepSeek and may change independently of this plugin.
- A public distribution decision requires separate review of website embedding and DeepSeek branding.

<a id="dev-note"></a>
### Dev Note

<details>
<summary>Maintainer context</summary>

None.

</details>
