window.__ModuleLoader__.load({
	id: "@deepseek-ai/dsh-client-ui-deepseek-chat",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react_jsx_runtime = require("react/jsx-runtime");
		let react = require("react");
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		let _deepseek_ai_dsh_client_store = require("@deepseek-ai/dsh-client-store");
		//#region lib/types/client/playwright-preference.js
		/** Select remembered sign-in with a visible browser or restore isolated launches.
		* @param form - browser provider's settings form.
		* @param enabled - whether website authentication should survive browser shutdown.
		* @returns whether the host accepted the atomic update. */
		function setRememberedPlaywright(form, enabled) {
			const current = form.getSnapshot();
			if (!current.writable || current.value?.mode !== "launch" || current.value.userDataDir === void 0) return Promise.resolve(false);
			return form.mutate([{
				op: "set",
				path: ["persistent"],
				value: enabled
			}, enabled ? {
				op: "set",
				path: ["headless"],
				value: false
			} : {
				op: "unset",
				path: ["headless"]
			}], current.revision);
		}
		//#endregion
		//#region lib/types/client/definition.js
		/** DeepSeek's Chat website, opened only inside the Desktop guest. */
		const DEEPSEEK_CHAT_URL = "https://chat.deepseek.com/";
		//#endregion
		//#region \0dsh-css:C:\Users\KNPhu\.arya\github\KonnectSuite\AryaAI\packages\client\ui-deepseek-chat\src\client\DeepSeekChat.module.css.mjs
		const css = "._5aJb8a_whale{color:var(--dsw-static-deepseek-450);flex:none;display:inline-block;overflow:hidden}._5aJb8a_whale svg{max-width:none;display:block}._5aJb8a_page{background:var(--dsw-alias-bg-base);flex:1;min-height:0}._5aJb8a_overlay{top:0;bottom:0;left:var(--dsh-main-left);right:var(--dsh-main-right);z-index:1;background:var(--dsw-alias-bg-base);visibility:hidden;pointer-events:none;flex-direction:column;display:flex;position:absolute;overflow:hidden}[data-windows-titlebar] ._5aJb8a_overlay{top:var(--dsh-windows-titlebar-height)}._5aJb8a_overlay[data-active]{visibility:visible;pointer-events:auto}._5aJb8a_toolbar{border-bottom:.5px solid var(--dsw-alias-border-l3);flex:none;align-items:center;gap:6px;height:42px;padding:0 12px;display:flex}._5aJb8a_toolbar button{border-radius:var(--dsw-radius-sm);width:28px;height:28px;color:var(--dsw-alias-label-primary);cursor:pointer;background:0 0;border:0;place-items:center;display:grid}._5aJb8a_toolbar button:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}._5aJb8a_toolbar button:disabled{opacity:.4;cursor:default}._5aJb8a_title{color:var(--dsw-alias-label-primary);margin-left:8px;font-weight:500}._5aJb8a_status{color:var(--dsw-alias-label-secondary);font-size:12px}._5aJb8a_viewport{flex:1;min-height:0}._5aJb8a_error{color:var(--dsw-alias-state-error-primary);margin:0;padding:8px 12px}._5aJb8a_resourceToolbar{border-bottom:.5px solid var(--dsw-alias-border-l3);flex-wrap:wrap;flex:none;align-items:center;gap:6px;padding:8px 12px;display:flex}._5aJb8a_resourceHint{color:var(--dsw-alias-label-secondary);margin:0;padding:6px 12px;font-size:13px}";
		const tagId = "@deepseek-ai/dsh-client-ui-deepseek-chat/DeepSeekChat.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@deepseek-ai/dsh-client-ui-deepseek-chat";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var DeepSeekChat_module_css_default = {
			"error": "_5aJb8a_error",
			"overlay": "_5aJb8a_overlay",
			"page": "_5aJb8a_page",
			"resourceHint": "_5aJb8a_resourceHint",
			"resourceToolbar": "_5aJb8a_resourceToolbar",
			"status": "_5aJb8a_status",
			"title": "_5aJb8a_title",
			"toolbar": "_5aJb8a_toolbar",
			"viewport": "_5aJb8a_viewport",
			"whale": "_5aJb8a_whale"
		};
		//#endregion
		//#region lib/types/client/DeepSeekChat.js
		/** Root-level DeepSeek Chat page and retained Desktop webview. */
		/** The global page identity shared by the left navigation row and main slot. */
		const CHAT_PANEL_ID = "deepseek-chat";
		/**
		* How long a reload request may go unanswered before the guest is rebuilt.
		* A carrier that accepts the request publishes loading state in the same turn,
		* so this only ever elapses when the request was refused outright.
		*/
		const RELOAD_REFUSAL_MS = 300;
		/** Decorative icon for the left navigation row. */
		function DeepSeekChatIcon({ size }) {
			return (0, react_jsx_runtime.jsx)("span", {
				className: DeepSeekChat_module_css_default.whale,
				style: {
					width: size,
					height: size
				},
				children: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.BrandWordmark, { size })
			});
		}
		/** Main-slot occupant; the connected webview stays in the root overlay across panel changes. */
		function DeepSeekChatPanel({ t }) {
			return (0, react_jsx_runtime.jsx)("main", {
				"aria-label": t("title"),
				className: DeepSeekChat_module_css_default.page
			});
		}
		/** Keep one embedded Chat guest connected while Harness Sessions and main panels change. */
		function DeepSeekChatOverlay({ browserPages, t, usePanelInfo }) {
			const active = usePanelInfo((info) => info.activePanelId === CHAT_PANEL_ID);
			const viewportId = (0, react.useId)();
			const page = (0, react.useRef)(null);
			const [frame, setFrame] = (0, react.useState)(() => browserPages.emptyFrame());
			const [opened, setOpened] = (0, react.useState)(false);
			/** Bumped to retire a guest the carrier would not reload and stand up its replacement. */
			const [generation, setGeneration] = (0, react.useState)(0);
			/** Address a replacement guest must come back to; the first guest opens the entry point. */
			const resume = (0, react.useRef)(void 0);
			const refusal = (0, react.useRef)(void 0);
			(0, react.useEffect)(() => {
				if (active) setOpened(true);
			}, [active]);
			(0, react.useEffect)(() => {
				if (!opened) return void 0;
				const created = browserPages.createDesktopPage({
					initial: void 0,
					storage: "deepseek-chat",
					persist: () => {},
					openRequested: (url) => {
						const target = browserPages.parseAddress(url, window.location.origin);
						if (target.ok) created.frame.loadUrl(target.target);
					}
				}, "global:deepseek-chat");
				page.current = created;
				const unmount = created.presentation.mount(viewportId);
				const unsubscribe = created.frame.subscribe(() => {
					setFrame(created.frame.getSnapshot());
				});
				const destination = resume.current ?? entryPoint(browserPages);
				resume.current = void 0;
				if (destination !== void 0) created.frame.loadUrl(destination);
				return () => {
					unsubscribe();
					unmount();
					page.current = null;
					created.frame.dispose();
				};
			}, [
				browserPages,
				viewportId,
				opened,
				generation
			]);
			(0, react.useEffect)(() => () => {
				window.clearTimeout(refusal.current);
			}, []);
			/**
			* Reload the page on screen.
			*
			* The Desktop carrier answers a same-address reload with `<webview>.reload()`,
			* but returns silently — publishing no state at all — when it cannot act: no
			* address, no guest element, or an aborted lifetime. A click that publishes
			* nothing is indistinguishable from a broken button, so a snapshot that has
			* not moved by the next turn is read as a refusal and answered by retiring the
			* guest and standing up its replacement, which navigates for real. With no
			* address on screen there is nothing to reload, so the page is re-entered
			* rather than left alone.
			*/
			const reload = () => {
				const created = page.current;
				if (created === null) return;
				const before = created.frame.getSnapshot();
				if (before.target === void 0) {
					const destination = entryPoint(browserPages);
					if (destination !== void 0) created.frame.loadUrl(destination);
					return;
				}
				created.frame.reload();
				window.clearTimeout(refusal.current);
				refusal.current = window.setTimeout(() => {
					if (page.current?.frame.getSnapshot() !== before) return;
					resume.current = before.target;
					setGeneration((current) => current + 1);
				}, RELOAD_REFUSAL_MS);
			};
			return (0, react_jsx_runtime.jsxs)("section", {
				className: DeepSeekChat_module_css_default.overlay,
				"data-active": active || void 0,
				"aria-hidden": !active,
				children: [
					(0, react_jsx_runtime.jsxs)("header", {
						className: DeepSeekChat_module_css_default.toolbar,
						children: [
							(0, react_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": t("back"),
								disabled: !frame.canGoBack,
								onClick: () => {
									page.current?.frame.goBack();
								},
								children: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronLeftOutlineRegular, {})
							}),
							(0, react_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": t("forward"),
								disabled: !frame.canGoForward,
								onClick: () => {
									page.current?.frame.goForward();
								},
								children: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronRightOutlineRegular, {})
							}),
							(0, react_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": t("reload"),
								onClick: reload,
								children: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconRefreshOutlineRegular, {})
							}),
							(0, react_jsx_runtime.jsx)("span", {
								className: DeepSeekChat_module_css_default.title,
								children: t("title")
							}),
							frame.loading && frame.error === void 0 && (0, react_jsx_runtime.jsx)("span", {
								className: DeepSeekChat_module_css_default.status,
								children: t("load.hint")
							})
						]
					}),
					frame.error !== void 0 && (0, react_jsx_runtime.jsx)("p", {
						className: DeepSeekChat_module_css_default.error,
						role: "status",
						children: t("load.failed")
					}),
					(0, react_jsx_runtime.jsx)("div", {
						id: viewportId,
						className: DeepSeekChat_module_css_default.viewport,
						"aria-label": t("title")
					})
				]
			});
		}
		/** The page's own entry point, reduced by the carrier's address policy. */
		function entryPoint(browserPages) {
			const destination = browserPages.parseAddress(DEEPSEEK_CHAT_URL, window.location.origin);
			return destination.ok ? destination.target : void 0;
		}
		//#endregion
		//#region lib/types/client/locales.js
		/** Copy owned by the optional DeepSeek Chat page. */
		const zh = {
			title: "DeepSeek 聊天",
			back: "后退",
			forward: "前进",
			reload: "刷新",
			"load.failed": "页面加载失败；请刷新重试。",
			"load.hint": "正在载入 DeepSeek 聊天…"
		};
		/** English copy with the same keys. */
		const en = {
			title: "DeepSeek Chat",
			back: "Back",
			forward: "Forward",
			reload: "Reload",
			"load.failed": "The page could not load; reload and try again.",
			"load.hint": "Loading DeepSeek Chat…"
		};
		/** English copy for the optional Rockwell browser. */
		const rockwellEn = {
			"playwright.enable": "Enable remembered Playwright sign-in",
			"playwright.disable": "Use isolated Playwright",
			"playwright.saving": "Saving browser preference…",
			"playwright.failed": "Could not save browser preference. Try again.",
			"playwright.enabled": "Playwright remembers website sign-in · Account access is verified on the website",
			"playwright.disabled": "Playwright uses temporary browser sessions",
			"playwright.hint": "After changing this setting, start a new chat and ask Arya to open Rockwell Knowledgebase using Playwright. Sign in yourself in the visible browser. One live chat can use the saved profile at a time. This embedded page has a separate login; clearing it does not erase Playwright’s saved login.",
			title: "Rockwell Resources",
			connect: "Connect Rockwell",
			knowledgebase: "Knowledgebase",
			downloads: "Download Center",
			samples: "Sample Code",
			back: "Back",
			forward: "Forward",
			reload: "Reload",
			disconnect: "Disconnect / Clear session",
			clearing: "Clearing local Rockwell session…",
			"clear.failed": "Local session could not be cleared. Retry Disconnect / Clear session.",
			"load.failed": "The page could not load. Sign in to Arya if needed, then reload.",
			loading: "Loading Rockwell…",
			opened: "Browser open · Rockwell determines your account access",
			disconnected: "Rockwell browser disconnected",
			hint: "Sign in directly on Rockwell’s website. Knowledgebase and software access depend on your account. Arya can use the visible browser through desktop computer-use tools. Downloads ask where to save."
		};
		/** Chinese copy with the same resource controls. */
		const rockwellZh = {
			"playwright.enable": "启用 Playwright 登录保留",
			"playwright.disable": "使用隔离的 Playwright",
			"playwright.saving": "正在保存浏览器设置…",
			"playwright.failed": "无法保存浏览器设置。请重试。",
			"playwright.enabled": "Playwright 保留网站登录 · 账户访问权限由网站验证",
			"playwright.disabled": "Playwright 使用临时浏览器会话",
			"playwright.hint": "修改设置后，请新建聊天并让 Arya 使用 Playwright 打开 Rockwell 知识库。请在可见浏览器中自行登录。每次仅一个活动聊天能使用保存的配置文件。此嵌入页面具有单独的登录；清除此页面不会清除 Playwright 保存的登录。",
			title: "Rockwell 资源",
			connect: "连接 Rockwell",
			knowledgebase: "知识库",
			downloads: "下载中心",
			samples: "示例代码",
			back: "后退",
			forward: "前进",
			reload: "刷新",
			disconnect: "断开连接 / 清除会话",
			clearing: "正在清除本地 Rockwell 会话…",
			"clear.failed": "无法清除本地会话。请重试断开连接 / 清除会话。",
			"load.failed": "页面加载失败。如有需要，请登录 Arya 后刷新。",
			loading: "正在加载 Rockwell…",
			opened: "浏览器已打开 · 账户权限由 Rockwell 决定",
			disconnected: "Rockwell 浏览器已断开",
			hint: "请直接在 Rockwell 网站登录。知识库和软件访问权限取决于您的账户。Arya 可通过桌面计算机操作工具使用可见浏览器。下载时会询问保存位置。"
		};
		//#endregion
		//#region lib/types/client/rockwell.js
		/** Retained Rockwell guest and local account disconnection lifecycle. */
		/** Official resource entry points; authentication is performed by the user on the website. */
		const ROCKWELL_RESOURCES = {
			knowledgebase: "https://support.rockwellautomation.com/",
			downloads: "https://compatibility.rockwellautomation.com/Pages/home.aspx",
			samples: "https://www.rockwellautomation.com/en-us/support/product/product-downloads/application-code-library/sample-code.html"
		};
		/** Create an idle account connection with owned guest teardown.
		* @param browser - Desktop page provider.
		* @returns account page operations and observable status. */
		function createRockwellConnection(browser) {
			const status = (0, _deepseek_ai_dsh_client_store.createSnapshotStore)({
				connected: false,
				busy: false,
				failed: false,
				frame: browser.emptyFrame()
			});
			let page;
			let container;
			let unmount;
			let unsubscribe;
			let disconnecting;
			let disposed = false;
			const close = async () => {
				const previous = page;
				page = void 0;
				unsubscribe?.();
				unsubscribe = void 0;
				unmount?.();
				unmount = void 0;
				await previous?.frame.dispose();
			};
			const open = (resource) => {
				if (disposed || disconnecting !== void 0) return;
				if (page === void 0) {
					const created = browser.createDesktopPage({
						initial: void 0,
						storage: "rockwell-resources",
						persist: () => {},
						openRequested: (url) => {
							const target = browser.parseAddress(url, window.location.origin);
							if (target.ok) created.frame.loadUrl(target.target);
						}
					}, "global:rockwell-resources");
					page = created;
					unsubscribe = created.frame.subscribe(() => {
						status.set({
							...status.getSnapshot(),
							frame: created.frame.getSnapshot()
						});
					});
					if (container !== void 0) unmount = created.presentation.mount(container);
				}
				const target = browser.parseAddress(ROCKWELL_RESOURCES[resource], window.location.origin);
				if (!target.ok) throw new Error("Rockwell resource URL was refused");
				status.set({
					...status.getSnapshot(),
					connected: true,
					failed: false
				});
				page.frame.loadUrl(target.target);
			};
			const disconnect = () => {
				if (disconnecting !== void 0) return disconnecting;
				status.set({
					...status.getSnapshot(),
					busy: true,
					failed: false
				});
				disconnecting = (async () => {
					try {
						await close();
						await browser.clearDesktopStorage("rockwell-resources");
						status.set({
							connected: false,
							busy: false,
							failed: false,
							frame: browser.emptyFrame()
						});
					} catch (error) {
						console.error("Rockwell browser disconnection failed", error);
						status.set({
							connected: false,
							busy: false,
							failed: true,
							frame: browser.emptyFrame()
						});
					} finally {
						disconnecting = void 0;
					}
				})();
				return disconnecting;
			};
			return {
				status,
				open,
				disconnect,
				mount(id) {
					container = id;
					if (page !== void 0) unmount = page.presentation.mount(id);
					return () => {
						container = void 0;
						unmount?.();
						unmount = void 0;
					};
				},
				back: () => {
					page?.frame.goBack();
				},
				forward: () => {
					page?.frame.goForward();
				},
				reload: () => {
					page?.frame.reload();
				},
				async dispose() {
					disposed = true;
					await disconnecting;
					await close();
				}
			};
		}
		//#endregion
		//#region lib/types/client/RockwellResources.js
		/** Optional Rockwell account browser, retained across main panel changes. */
		/** Global navigation identity for the optional account browser. */
		const ROCKWELL_PANEL_ID = "rockwell-resources";
		/** @param props - navigation icon size. @returns shared link icon. */
		function RockwellIcon({ size }) {
			return (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLinkOutlineRegular, { size });
		}
		/** @param props - localized panel copy. @returns retained page placeholder. */
		function RockwellPanel({ t }) {
			return (0, react_jsx_runtime.jsx)("main", {
				"aria-label": t("title"),
				className: DeepSeekChat_module_css_default.page
			});
		}
		/** @param props - connection callbacks and framework-bound status hook. @returns Rockwell browser controls. */
		function RockwellOverlay({ t, usePanelInfo, useResourceStatus, usePlaywrightPreference, rememberPlaywright, mount, open, disconnect, back, forward, reload }) {
			const active = usePanelInfo((info) => info.activePanelId === ROCKWELL_PANEL_ID);
			const state = useResourceStatus((value) => value);
			const preference = usePlaywrightPreference((value) => value);
			const [saving, setSaving] = (0, react.useState)(false);
			const [failed, setFailed] = (0, react.useState)(false);
			const persistent = preference.value?.persistent === true;
			const remember = async () => {
				setSaving(true);
				setFailed(false);
				try {
					setFailed(!await rememberPlaywright(!persistent));
				} catch (error) {
					console.error("Playwright preference update failed", error);
					setFailed(true);
				} finally {
					setSaving(false);
				}
			};
			const viewportId = (0, react.useId)();
			(0, react.useEffect)(() => mount(viewportId), [mount, viewportId]);
			return (0, react_jsx_runtime.jsxs)("section", {
				className: DeepSeekChat_module_css_default.overlay,
				"data-active": active || void 0,
				"aria-hidden": !active,
				children: [
					(0, react_jsx_runtime.jsxs)("header", {
						className: DeepSeekChat_module_css_default.resourceToolbar,
						children: [
							(0, react_jsx_runtime.jsx)("span", {
								className: DeepSeekChat_module_css_default.title,
								children: t("title")
							}),
							(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								size: "sm",
								disabled: state.busy,
								onClick: () => {
									open("knowledgebase");
								},
								children: t(state.connected ? "knowledgebase" : "connect")
							}),
							(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								size: "sm",
								disabled: state.busy,
								onClick: () => {
									open("downloads");
								},
								children: t("downloads")
							}),
							(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								size: "sm",
								disabled: state.busy,
								onClick: () => {
									open("samples");
								},
								children: t("samples")
							}),
							(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								size: "sm",
								disabled: !state.frame.canGoBack || state.busy,
								onClick: back,
								children: t("back")
							}),
							(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								size: "sm",
								disabled: !state.frame.canGoForward || state.busy,
								onClick: forward,
								children: t("forward")
							}),
							(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								size: "sm",
								disabled: !state.connected || state.busy,
								onClick: reload,
								children: t("reload")
							}),
							(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								size: "sm",
								disabled: state.busy,
								onClick: () => {
									disconnect();
								},
								children: t("disconnect")
							})
						]
					}),
					(0, react_jsx_runtime.jsx)("p", {
						className: DeepSeekChat_module_css_default.resourceHint,
						role: "status",
						children: t(state.busy ? "clearing" : state.failed ? "clear.failed" : state.frame.error !== void 0 ? "load.failed" : state.frame.loading ? "loading" : state.connected ? "opened" : "disconnected")
					}),
					(0, react_jsx_runtime.jsx)("p", {
						className: DeepSeekChat_module_css_default.resourceHint,
						children: t("hint")
					}),
					(0, react_jsx_runtime.jsxs)("div", {
						className: DeepSeekChat_module_css_default.resourceToolbar,
						children: [(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							size: "sm",
							disabled: saving || !preference.writable || preference.value?.mode !== "launch" || preference.value.userDataDir === void 0,
							onClick: () => {
								remember();
							},
							children: t(saving ? "playwright.saving" : persistent ? "playwright.disable" : "playwright.enable")
						}), (0, react_jsx_runtime.jsx)("span", {
							className: DeepSeekChat_module_css_default.status,
							role: "status",
							children: t(failed ? "playwright.failed" : persistent ? "playwright.enabled" : "playwright.disabled")
						})]
					}),
					(0, react_jsx_runtime.jsx)("p", {
						className: DeepSeekChat_module_css_default.resourceHint,
						children: t("playwright.hint")
					}),
					(0, react_jsx_runtime.jsx)("div", {
						id: viewportId,
						className: DeepSeekChat_module_css_default.viewport,
						"aria-label": t("title")
					})
				]
			});
		}
		//#endregion
		//#region lib/types/client/index.js
		/** Services required to register the application page. */
		const inject = [
			"slots",
			"locale",
			"sidebarRight"
		];
		/** Register a retained Desktop page without changing the workspace Browser tab plugin. */
		function apply(ctx) {
			const namespace = "deepseekChat";
			ctx.inject(["browserPages", "layout"], (scope) => {
				const rockwell = createRockwellConnection(scope.browserPages);
				const resourceT = scope.locale.bind("rockwellResources");
				scope.effect(() => scope.locale.register("rockwellResources", {
					en: rockwellEn,
					zh: rockwellZh
				}), "rockwell.copy");
				scope.effect(() => () => rockwell.dispose(), "rockwell.guest");
				scope.slots.inject("main", () => scope.slots.register({
					name: "main",
					key: ROCKWELL_PANEL_ID,
					locale: "rockwellResources"
				}, RockwellPanel));
				scope.slots.inject("sidebar.panellist", () => scope.slots.register({
					name: "sidebar.panellist",
					id: ROCKWELL_PANEL_ID,
					order: -6,
					locale: "rockwellResources",
					label: () => resourceT("title")
				}, RockwellIcon));
				scope.inject(["configForms"], (accountScope) => {
					const form = accountScope.configForms.get("browser-use-playwright");
					accountScope.slots.inject("shell.overlay", () => accountScope.slots.register({
						name: "shell.overlay",
						id: ROCKWELL_PANEL_ID,
						locale: "rockwellResources",
						inject: () => ({
							hooks: {
								resourceStatus: rockwell.status,
								playwrightPreference: form
							},
							rememberPlaywright: (enabled) => setRememberedPlaywright(form, enabled),
							open: rockwell.open,
							disconnect: rockwell.disconnect,
							mount: rockwell.mount,
							back: rockwell.back,
							forward: rockwell.forward,
							reload: rockwell.reload
						})
					}, RockwellOverlay));
				});
				const t = scope.locale.bind(namespace);
				scope.effect(() => scope.locale.register(namespace, {
					zh,
					en
				}), "ui-deepseek-chat.copy");
				scope.effect(() => {
					const closeOldTabs = () => {
						const mounted = scope.sidebarRight.mounted.getSnapshot();
						if (mounted === void 0) return;
						for (const tab of scope.sidebarRight.openTabs.getSnapshot()) if (tab.sessionId === mounted && tab.kind === "deepseek-chat") scope.sidebarRight.close(tab.tabId);
					};
					const offMounted = scope.sidebarRight.mounted.subscribe(closeOldTabs);
					const offTabs = scope.sidebarRight.openTabs.subscribe(closeOldTabs);
					closeOldTabs();
					return () => {
						offMounted();
						offTabs();
					};
				}, "ui-deepseek-chat: retire session tabs");
				scope.slots.inject("main", () => scope.slots.register({
					name: "main",
					key: CHAT_PANEL_ID,
					locale: namespace
				}, DeepSeekChatPanel));
				scope.slots.inject("sidebar.panellist", () => scope.slots.register({
					name: "sidebar.panellist",
					id: CHAT_PANEL_ID,
					order: -5,
					locale: namespace,
					label: () => t("title")
				}, DeepSeekChatIcon));
				scope.slots.inject("shell.overlay", () => scope.slots.register({
					name: "shell.overlay",
					id: CHAT_PANEL_ID,
					locale: namespace,
					inject: () => ({ browserPages: scope.browserPages })
				}, DeepSeekChatOverlay));
			});
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map