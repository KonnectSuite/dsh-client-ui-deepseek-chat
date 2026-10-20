import { setRememberedPlaywright } from "./playwright-preference.js";
import { DeepSeekChatIcon, DeepSeekChatOverlay, DeepSeekChatPanel, CHAT_PANEL_ID } from "./DeepSeekChat.js";
import { en, zh, rockwellEn, rockwellZh } from "./locales.js";
import { createRockwellConnection } from "./rockwell.js";
import { ROCKWELL_PANEL_ID, RockwellIcon, RockwellPanel, RockwellOverlay } from "./RockwellResources.js";
/** Services required to register the application page. */
export const inject = ['slots', 'locale', 'sidebarRight'];
/** Register a retained Desktop page without changing the workspace Browser tab plugin. */
export function apply(ctx) {
    const namespace = 'deepseekChat';
    ctx.inject(['browserPages', 'layout'], (scope) => {
        const rockwell = createRockwellConnection(scope.browserPages);
        const resourceT = scope.locale.bind('rockwellResources');
        scope.effect(() => scope.locale.register('rockwellResources', { en: rockwellEn, zh: rockwellZh }), 'rockwell.copy');
        scope.effect(() => () => rockwell.dispose(), 'rockwell.guest');
        scope.slots.inject('main', () => scope.slots.register({
            name: 'main', key: ROCKWELL_PANEL_ID, locale: 'rockwellResources',
        }, RockwellPanel));
        scope.slots.inject('sidebar.panellist', () => scope.slots.register({
            name: 'sidebar.panellist', id: ROCKWELL_PANEL_ID, order: -6, locale: 'rockwellResources',
            label: () => resourceT('title'),
        }, RockwellIcon));
        scope.inject(['configForms'], (accountScope) => {
            const form = accountScope.configForms.get('browser-use-playwright');
            accountScope.slots.inject('shell.overlay', () => accountScope.slots.register({
                name: 'shell.overlay', id: ROCKWELL_PANEL_ID, locale: 'rockwellResources',
                inject: () => ({ hooks: { resourceStatus: rockwell.status, playwrightPreference: form },
                    rememberPlaywright: (enabled) => setRememberedPlaywright(form, enabled),
                    open: rockwell.open, disconnect: rockwell.disconnect,
                    mount: rockwell.mount, back: rockwell.back, forward: rockwell.forward, reload: rockwell.reload }),
            }, RockwellOverlay));
        });
        const t = scope.locale.bind(namespace);
        scope.effect(() => scope.locale.register(namespace, { zh, en }), 'ui-deepseek-chat.copy');
        scope.effect(() => {
            const closeOldTabs = () => {
                const mounted = scope.sidebarRight.mounted.getSnapshot();
                if (mounted === undefined)
                    return;
                for (const tab of scope.sidebarRight.openTabs.getSnapshot()) {
                    if (tab.sessionId === mounted && tab.kind === 'deepseek-chat')
                        scope.sidebarRight.close(tab.tabId);
                }
            };
            const offMounted = scope.sidebarRight.mounted.subscribe(closeOldTabs);
            const offTabs = scope.sidebarRight.openTabs.subscribe(closeOldTabs);
            closeOldTabs();
            return () => { offMounted(); offTabs(); };
        }, 'ui-deepseek-chat: retire session tabs');
        scope.slots.inject('main', () => scope.slots.register({
            name: 'main', key: CHAT_PANEL_ID, locale: namespace,
        }, DeepSeekChatPanel));
        scope.slots.inject('sidebar.panellist', () => scope.slots.register({
            name: 'sidebar.panellist', id: CHAT_PANEL_ID, order: -5, locale: namespace,
            label: () => t('title'),
        }, DeepSeekChatIcon));
        scope.slots.inject('shell.overlay', () => scope.slots.register({
            name: 'shell.overlay', id: CHAT_PANEL_ID, locale: namespace,
            inject: () => ({ browserPages: scope.browserPages }),
        }, DeepSeekChatOverlay));
    });
}
//# sourceMappingURL=index.js.map