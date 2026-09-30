/** Optional Desktop Chat website page mounted through Cordis client slots. */
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-client-ui-layout/client'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar/client'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar-right/client'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar-browser/client'
import { DeepSeekChatIcon, DeepSeekChatOverlay, DeepSeekChatPanel, CHAT_PANEL_ID } from './DeepSeekChat.tsx'
import { en, zh } from './locales.ts'

/** Services required to register the application page. */
export const inject = ['slots', 'locale', 'sidebarRight']

/** Register a retained Desktop page without changing the workspace Browser tab plugin. */
export function apply(ctx: Context): void {
  const namespace = 'deepseekChat'
  ctx.inject(['browserPages', 'layout'], (scope) => {
    const t = scope.locale.bind(namespace)
    scope.effect(() => scope.locale.register(namespace, { zh, en }), 'ui-deepseek-chat.copy')
    scope.effect(() => {
      const closeOldTabs = (): void => {
        const mounted = scope.sidebarRight.mounted.getSnapshot()
        if (mounted === undefined) return
        for (const tab of scope.sidebarRight.openTabs.getSnapshot()) {
          if (tab.sessionId === mounted && tab.kind === 'deepseek-chat') scope.sidebarRight.close(tab.tabId)
        }
      }
      const offMounted = scope.sidebarRight.mounted.subscribe(closeOldTabs)
      const offTabs = scope.sidebarRight.openTabs.subscribe(closeOldTabs)
      closeOldTabs()
      return () => { offMounted(); offTabs() }
    }, 'ui-deepseek-chat: retire session tabs')
    scope.slots.inject('main', () => scope.slots.register({
      name: 'main', key: CHAT_PANEL_ID, locale: namespace,
    }, DeepSeekChatPanel))
    scope.slots.inject('sidebar.panellist', () => scope.slots.register({
      name: 'sidebar.panellist', id: CHAT_PANEL_ID, order: -5, locale: namespace,
      label: () => t('title'),
    }, DeepSeekChatIcon))
    scope.slots.inject('shell.overlay', () => scope.slots.register({
      name: 'shell.overlay', id: CHAT_PANEL_ID, locale: namespace,
      inject: () => ({ browserPages: scope.browserPages }),
    }, DeepSeekChatOverlay))
  })
}
