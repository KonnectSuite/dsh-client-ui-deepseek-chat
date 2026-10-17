// @vitest-environment jsdom
/** Account connection ownership, teardown and failure recovery. */
import { expect, it, vi } from 'vitest'
import { createSnapshotStore } from '@deepseek-ai/dsh-client-store'
import type { BrowserPageOptions, BrowserPageService } from '@deepseek-ai/dsh-client-ui-sidebar-browser/client'
import { emptyBrowserFrame } from '../../ui-sidebar-browser/src/client/browser/BrowserFrame.ts'
import { parseBrowserAddress } from '../../ui-sidebar-browser/src/client/browser/url.ts'
import { createRockwellConnection, ROCKWELL_RESOURCES } from '../src/client/rockwell.ts'

function fixture() {
  const frameStore = createSnapshotStore(emptyBrowserFrame())
  const frame = { ...frameStore, loadUrl: vi.fn(), goBack: vi.fn(), goForward: vi.fn(), reload: vi.fn(), dispose: vi.fn(async () => {}) }
  const unmount = vi.fn()
  const presentation = { mount: vi.fn(() => unmount), dispose: vi.fn() }
  const browser = { emptyFrame: emptyBrowserFrame, clearDesktopStorage: vi.fn(async (_storage: string) => {}),
    createDesktopPage: vi.fn((_options: BrowserPageOptions, _workspace: string) => ({ frame, presentation })),
    parseAddress: parseBrowserAddress,
  } satisfies BrowserPageService
  return { frame, browser, unmount, connection: createRockwellConnection(browser) }
}

it('opens only on request and reuses the account guest across resource navigation', async () => {
  const f = fixture()
  try {
    f.connection.mount('viewport')
    expect(f.browser.createDesktopPage).not.toHaveBeenCalled()
    f.connection.open('knowledgebase')
    expect(f.browser.createDesktopPage.mock.calls[0]?.[0].storage).toBe('rockwell-resources')
    f.connection.open('downloads')
    expect(f.browser.createDesktopPage).toHaveBeenCalledTimes(1)
    expect(f.frame.loadUrl).toHaveBeenLastCalledWith(expect.objectContaining({ url: ROCKWELL_RESOURCES.downloads }))
    expect(f.connection.status.getSnapshot().connected).toBe(true)
    await f.connection.disconnect()
    expect(f.frame.dispose).toHaveBeenCalledTimes(1)
    expect(f.browser.clearDesktopStorage).toHaveBeenCalledWith('rockwell-resources')
    expect(f.connection.status.getSnapshot().connected).toBe(false)
    f.connection.open('samples')
    expect(f.browser.createDesktopPage).toHaveBeenCalledTimes(2)
  } finally { await f.connection.dispose() }
})

it('blocks reconnection during clearing and publishes a retryable failure', async () => {
  const f = fixture()
  let finish!: () => void
  f.browser.clearDesktopStorage.mockImplementationOnce(() => new Promise<void>((resolve) => { finish = resolve }))
  try {
    f.connection.open('knowledgebase')
    const pending = f.connection.disconnect()
    await vi.waitFor(() => { expect(f.browser.clearDesktopStorage).toHaveBeenCalled() })
    f.connection.open('samples')
    expect(f.browser.createDesktopPage).toHaveBeenCalledTimes(1)
    expect(f.connection.disconnect()).toBe(pending)
    finish()
    await pending
    f.browser.clearDesktopStorage.mockRejectedValueOnce(new Error('storage unavailable'))
    const logging = vi.spyOn(console, 'error').mockImplementation(() => {})
    try {
      await f.connection.disconnect()
      expect(f.connection.status.getSnapshot().failed).toBe(true)
      await f.connection.disconnect()
      expect(f.connection.status.getSnapshot().failed).toBe(false)
    } finally { logging.mockRestore() }
  } finally { finish?.(); await f.connection.dispose() }
})
