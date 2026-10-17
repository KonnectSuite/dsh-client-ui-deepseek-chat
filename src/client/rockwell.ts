/** Retained Rockwell guest and local account disconnection lifecycle. */
import { createSnapshotStore, type SnapshotStore } from '@deepseek-ai/dsh-client-store'
import type { BrowserFrameState, BrowserPage, BrowserPageService } from '@deepseek-ai/dsh-client-ui-sidebar-browser/client'

/** Official resource entry points; authentication is performed by the user on the website. */
export const ROCKWELL_RESOURCES = {
  knowledgebase: 'https://support.rockwellautomation.com/',
  downloads: 'https://compatibility.rockwellautomation.com/Pages/home.aspx',
  samples: 'https://www.rockwellautomation.com/en-us/support/product/product-downloads/application-code-library/sample-code.html',
} as const

/** Local browser status; connected does not establish Rockwell authentication. */
export interface RockwellConnectionStatus {
  readonly connected: boolean
  readonly busy: boolean
  readonly failed: boolean
  readonly frame: BrowserFrameState
}

/** Account guest operations bound to one plugin registration. */
export interface RockwellConnection {
  readonly status: SnapshotStore<RockwellConnectionStatus>
  /** Open an official resource in the account guest. */
  readonly open: (resource: keyof typeof ROCKWELL_RESOURCES) => void
  /** Close the guest and clear local account data. */
  readonly disconnect: () => Promise<void>
  /** Attach the retained guest to the viewport and return its unmount callback. */
  readonly mount: (id: string) => () => void
  /** Navigate backward in the current guest. */
  readonly back: () => void
  /** Navigate forward in the current guest. */
  readonly forward: () => void
  /** Reload the current guest. */
  readonly reload: () => void
  /** Release the guest without erasing the local account. */
  readonly dispose: () => Promise<void>
}

/** Create an idle account connection with owned guest teardown.
 * @param browser - Desktop page provider.
 * @returns account page operations and observable status. */
export function createRockwellConnection(browser: BrowserPageService): RockwellConnection {
  const status = createSnapshotStore({ connected: false, busy: false, failed: false, frame: browser.emptyFrame() })
  let page: BrowserPage | undefined
  let container: string | undefined
  let unmount: (() => void) | undefined
  let unsubscribe: (() => void) | undefined
  let disconnecting: Promise<void> | undefined
  let disposed = false
  const close = async (): Promise<void> => {
    const previous = page
    page = undefined
    unsubscribe?.()
    unsubscribe = undefined
    unmount?.()
    unmount = undefined
    await previous?.frame.dispose()
  }
  const open = (resource: keyof typeof ROCKWELL_RESOURCES): void => {
    if (disposed || disconnecting !== undefined) return
    if (page === undefined) {
      const created = browser.createDesktopPage({ initial: undefined, storage: 'rockwell-resources',
        persist: () => {}, openRequested: (url) => {
          const target = browser.parseAddress(url, window.location.origin)
          if (target.ok) created.frame.loadUrl(target.target)
        } }, 'global:rockwell-resources')
      page = created
      unsubscribe = created.frame.subscribe(() => {
        status.set({ ...status.getSnapshot(), frame: created.frame.getSnapshot() })
      })
      if (container !== undefined) unmount = created.presentation.mount(container)
    }
    const target = browser.parseAddress(ROCKWELL_RESOURCES[resource], window.location.origin)
    if (!target.ok) throw new Error('Rockwell resource URL was refused')
    status.set({ ...status.getSnapshot(), connected: true, failed: false })
    page.frame.loadUrl(target.target)
  }
  const disconnect = (): Promise<void> => {
    if (disconnecting !== undefined) return disconnecting
    status.set({ ...status.getSnapshot(), busy: true, failed: false })
    disconnecting = (async () => {
      try {
        await close()
        await browser.clearDesktopStorage('rockwell-resources')
        status.set({ connected: false, busy: false, failed: false, frame: browser.emptyFrame() })
      } catch (error) {
        console.error('Rockwell browser disconnection failed', error)
        status.set({ connected: false, busy: false, failed: true, frame: browser.emptyFrame() })
      } finally { disconnecting = undefined }
    })()
    return disconnecting
  }
  return {
    status, open, disconnect,
    mount(id: string): () => void {
      container = id
      if (page !== undefined) unmount = page.presentation.mount(id)
      return () => { container = undefined; unmount?.(); unmount = undefined }
    },
    back: () => { page?.frame.goBack() },
    forward: () => { page?.frame.goForward() },
    reload: () => { page?.frame.reload() },
    async dispose(): Promise<void> { disposed = true; await disconnecting; await close() },
  }
}
