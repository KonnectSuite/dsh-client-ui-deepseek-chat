---
description: "Optional desktop page that opens DeepSeek Chat in an account-scoped webview."
kind: "package-reference"
---

# @deepseek-ai/dsh-client-ui-deepseek-chat

English | [中文](README.zh.md)

## Summary

This optional Cordis client plugin adds DeepSeek Chat to AryaAI Desktop's left navigation. It uses the Sidebar Browser provider for an isolated webview and keeps the page mounted while the selected Harness Session changes. The user signs in on the DeepSeek website; AryaAI does not send its Platform token to that website. The plugin does not register the page in WebUI, where the website may refuse iframe embedding.

## Use this package

Install `@deepseek-ai/dsh-client-ui-deepseek-chat` as a profile dependency and add it to that profile's `dsh.profile.bundles` list after the Web application bundle. Its `dsh.bundle` patch installs the Cordis row. The Web bundle supplies `@deepseek-ai/dsh-client-ui-sidebar-browser`. Removing the bundle selection removes the navigation entry and webview. The package is private pending a distribution decision for DeepSeek's website and branding.

## Understand the implementation

The plugin registers its locale, main page, navigation row, and root overlay through reversible Cordis effects. The overlay retains one guest after its first opening. Its `deepseek-chat` storage namespace keeps website cookies across Desktop restarts for the same AryaAI account, separate from temporary workspace Browser tabs. DeepSeek may expire the website session independently. The same guest permissions and download restrictions apply. Approved HTTP(S) popup requests navigate the Chat webview.

## Model Experience

None, as this user-facing website page registers no tool, prompt section, or Session event.

#### KV Cache effect

None; website browsing does not enter a model request.

## Known Limitations and Deferred Work

- The Chat website is operated by DeepSeek and may change independently of this plugin.
- A public distribution decision requires separate review of website embedding and DeepSeek branding.
