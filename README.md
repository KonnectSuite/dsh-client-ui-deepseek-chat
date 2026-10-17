---
description: "Optional desktop page that opens DeepSeek Chat in an account-scoped webview."
kind: "package-bundle"
---

# @deepseek-ai/dsh-client-ui-deepseek-chat

English | [中文](README.zh.md)

## Summary

This optional Cordis client plugin adds DeepSeek Chat and Rockwell Resources to AryaAI Desktop's left navigation. It uses the Sidebar Browser provider for an isolated webview and keeps the page mounted while the selected Harness Session changes. The user signs in on the DeepSeek website; AryaAI does not send its Platform token to that website. The plugin does not register the page in WebUI, where the website may refuse iframe embedding.


## Table of Contents

- [Model Experience](#model-experience)
- [Known Limitations and Deferred Work](#known-limitations-and-deferred-work)
- [Dev Note](#dev-note)

## Use this package

Install DeepSeek Chat from the Arya plugins tab in Plugin Market; it is not included in the installer or selected by default. Its `dsh.bundle` patch installs the Cordis row. The Web bundle supplies `@deepseek-ai/dsh-client-ui-sidebar-browser`. Removing the bundle selection removes the navigation entry and webview. Verified packages are distributed as GitHub release assets through Plugin Market, rather than npm.

## Understand the implementation

The plugin registers its locale, main page, navigation row, and root overlay through reversible Cordis effects. The overlay retains one guest after its first opening, and begins below the Desktop caption strip so its toolbar occupies the row a main panel owns rather than painting over the window's title strip. Its `deepseek-chat` storage namespace keeps website cookies across Desktop restarts for the same AryaAI account, separate from temporary workspace Browser tabs. DeepSeek may expire the website session independently. The same guest permissions and download restrictions apply. Approved HTTP(S) popup requests navigate the Chat webview. Toolbar Reload always acts: with no address on screen it reopens the entry point, a request the carrier accepts is reported in the toolbar, and a request the carrier refuses outright retires the guest and stands up its replacement.

## Rockwell Resources

Open Rockwell Resources from the left navigation and choose Connect Rockwell. Sign in directly on Rockwell’s website and complete any verification there. Knowledgebase, Download Center and Sample Code open their official entry points in one retained browser. The toolbar reports browser state, not successful Rockwell authentication or TechConnect entitlement.

The `rockwell-resources` namespace preserves cookies across restarts for the same Arya account on this computer. Disconnect / Clear session closes its guests and clears cookies, local storage, HTTP authentication and cache. It does not revoke Rockwell sessions on other computers or delete downloaded files. Closing Arya or disabling this plugin preserves the local sign-in.

Downloads from an owned Rockwell HTTPS page use Electron’s save dialog; each redirect must remain HTTPS. Saved sample code and installers are not executed or imported automatically. Other embedded browsers keep their existing download restrictions. This is browser access, not an official Rockwell API integration: TechConnect contracts, software licenses, MFA and website changes can limit access.

Arya can use the visible page through desktop computer-use tools when those tools are enabled. Let the user complete sign-in before inspecting the page, and cite article IDs, URLs and product revisions when using its content. Public manuals remain available without an account.

Choose Enable remembered Playwright sign-in to let Arya's browser tools retain website authentication. Start a new chat and ask Arya to open the Rockwell Knowledgebase using Playwright; complete sign-in and MFA yourself in the visible Chromium window. Arya can then search and read pages allowed by that account using its existing logged browser tools. Configuration reload ends active browser connections, so finish current browser operations before switching modes. One live chat owns this profile until its runtime unloads; another activation started while it is busy receives no browser tools.

On Windows, open Native Window in the chat's right sidebar, open its window list, and select the Chromium window Playwright is controlling. Dock that window to keep chat and sign-in on one monitor. Use Playwright tools for navigation, page inspection, and screenshots; their browser connection does not require foreground focus. Desktop mouse and keyboard tools still require the target to be visible and focused. The embedded Rockwell Resources page has separate authentication from Playwright.

This dedicated profile is stored at `DSH_HOME/browser-profiles/rockwell`, with the Windows user-home fallback defined by the Arya composition. It is shared by chats using that local host, independent of the embedded page's Arya-account storage. Enabling it affects all Playwright browsing on that host, not only Rockwell. Switching to isolated Playwright retains the saved profile. Disconnect / Clear session clears only the embedded page; sign out within Playwright to end its Rockwell sign-in. Neither browser reports verified TechConnect entitlement.

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
