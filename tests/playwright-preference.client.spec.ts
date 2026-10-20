/** Atomic browser preference changes through the shared settings form. */
import { expect, it, vi } from 'vitest'
import type { ConfigForm, ConfigFormSnapshot } from '@deepseek-ai/dsh-client-ui-settings/client'
import { setRememberedPlaywright, type PlaywrightPreference } from '../src/client/playwright-preference.ts'

function fixture(value: PlaywrightPreference, writable = true) {
  const snapshot: ConfigFormSnapshot<PlaywrightPreference> = {
    status: 'ready', value, writable, revision: 7, base: {}, user: {},
  }
  const mutate = vi.fn<ConfigForm<PlaywrightPreference>['mutate']>().mockResolvedValue(true)
  const form: ConfigForm<PlaywrightPreference> = {
    getSnapshot: () => snapshot, subscribe: () => () => {}, mutate,
    set: vi.fn(), unset: vi.fn(),
  }
  return { form, mutate }
}

it('enables a visible remembered browser with one revision-fenced write', async () => {
  const { form, mutate } = fixture({ mode: 'launch', userDataDir: '/fixture/profile' })
  expect(await setRememberedPlaywright(form, true)).toBe(true)
  expect(mutate).toHaveBeenCalledWith([
    { op: 'set', path: ['persistent'], value: true },
    { op: 'set', path: ['headless'], value: false },
  ], 7)
})

it('restores isolated launches and the inherited visibility setting', async () => {
  const { form, mutate } = fixture({ mode: 'launch', userDataDir: '/fixture/profile' })
  await setRememberedPlaywright(form, false)
  expect(mutate).toHaveBeenCalledWith([
    { op: 'set', path: ['persistent'], value: false },
    { op: 'unset', path: ['headless'] },
  ], 7)
  mutate.mockResolvedValueOnce(false)
  expect(await setRememberedPlaywright(form, true)).toBe(false)
})

it.each([
  [{ mode: 'attach' }, true],
  [{ mode: 'launch' }, true],
  [{ mode: 'launch', userDataDir: '/fixture/profile' }, false],
] as const)('refuses unsupported or read-only settings %j', async (value, writable) => {
  const { form, mutate } = fixture(value, writable)
  expect(await setRememberedPlaywright(form, true)).toBe(false)
  expect(mutate).not.toHaveBeenCalled()
})
