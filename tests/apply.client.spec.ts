// @vitest-environment jsdom
/** Cordis registration and disposal for the optional Desktop page. */
import { afterEach, expect, it, vi } from 'vitest'
import { Context } from '@deepseek-ai/cordis'
import { createSnapshotStore } from '@deepseek-ai/dsh-client-store'
import type { TabId } from '@deepseek-ai/dsh-client-ui-dockkit'
import { apply, inject } from '../src/client/index.ts'
import { CHAT_PANEL_ID, DeepSeekChatIcon, DeepSeekChatOverlay, DeepSeekChatPanel } from '../src/client/DeepSeekChat.tsx'

const contexts: Context[] = []
afterEach(async () => {
  await Promise.all(contexts.splice(0).map(ctx => ctx.fiber.dispose()))
  vi.unstubAllGlobals()
})

it('registers and removes the Desktop page independently of the Browser plugin', async () => {
  const ctx = new Context()
  contexts.push(ctx)
  const registered: { name: string; key?: string; component: unknown }[] = []
  const dictionaries = new Map<string, unknown>()
  const slots = {
    inject: (_name: string, register: () => () => void) => ctx.effect(register),
    register: (options: { name: string; key?: string }, component: unknown) => {
      const entry = { ...options, component }
      registered.push(entry)
      return () => { registered.splice(registered.indexOf(entry), 1) }
    },
  }
  const openTabs = createSnapshotStore<readonly { sessionId: string; tabId: TabId; kind?: string }[]>([])
  const mounted = createSnapshotStore<string | undefined>(undefined)
  const sidebarRight = { openTabs, mounted, close: vi.fn() }
  ctx.provide('slots', slots as never)
  ctx.provide('locale', {
    bind: () => (key: string) => key,
    register: (namespace: string, value: unknown) => {
      dictionaries.set(namespace, value)
      return () => { dictionaries.delete(namespace) }
    },
  } as never)
  ctx.provide('sidebarRight', sidebarRight as never)
  ctx.provide('layout', {} as never)
  ctx.provide('browserPages', {} as never)
  const fiber = ctx.plugin({ inject: [...inject], apply })
  await fiber.await()
  expect(registered.map(entry => [entry.name, entry.key, entry.component])).toEqual([
    ['main', CHAT_PANEL_ID, DeepSeekChatPanel],
    ['sidebar.panellist', undefined, DeepSeekChatIcon],
    ['shell.overlay', undefined, DeepSeekChatOverlay],
  ])
  expect(dictionaries.has('deepseekChat')).toBe(true)
  openTabs.set([{ sessionId: 'session', tabId: 'old-chat' as TabId, kind: 'deepseek-chat' }])
  mounted.set('session')
  expect(sidebarRight.close).toHaveBeenCalledWith('old-chat')
  await fiber.dispose()
  expect(dictionaries.size).toBe(0)
})

it('does not register the page without the Desktop browser carrier', async () => {
  const ctx = new Context()
  contexts.push(ctx)
  ctx.provide('slots', {} as never)
  ctx.provide('locale', {} as never)
  ctx.provide('sidebarRight', {} as never)
  const fiber = ctx.plugin({ inject: [...inject], apply })
  await fiber.await()
  await fiber.dispose()
})
