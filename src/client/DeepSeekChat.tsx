/** Root-level DeepSeek Chat page and retained Desktop webview. */
import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { BrandWordmark, IconChevronLeftOutlineRegular, IconChevronRightOutlineRegular,
  IconRefreshOutlineRegular } from '@deepseek-ai/dsh-client-ui-primitives'
import type { MainPanelId } from '@deepseek-ai/dsh-client-ui-layout/client'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type { BrowserFrameState, BrowserPage, BrowserPageService,
  BrowserTarget } from '@deepseek-ai/dsh-client-ui-sidebar-browser/client'
import { DEEPSEEK_CHAT_URL } from './definition.ts'
import css from './DeepSeekChat.module.css'

/** The global page identity shared by the left navigation row and main slot. */
export const CHAT_PANEL_ID = 'deepseek-chat' as MainPanelId

/**
 * How long a reload request may go unanswered before the guest is rebuilt.
 * A carrier that accepts the request publishes loading state in the same turn,
 * so this only ever elapses when the request was refused outright.
 */
const RELOAD_REFUSAL_MS = 300

/** Decorative icon for the left navigation row. */
export function DeepSeekChatIcon({ size }: PropsRuntime<'sidebar.panellist'>): ReactNode {
  return <span className={css.whale} style={{ width: size, height: size }}><BrandWordmark size={size} /></span>
}

/** Main-slot occupant; the connected webview stays in the root overlay across panel changes. */
export function DeepSeekChatPanel({ t }: PropsRuntime<'main'> & PropsLocale<'deepseekChat'>): ReactNode {
  return <main aria-label={t('title')} className={css.page} />
}

type ChatOverlayProps = PropsRuntime<'shell.overlay'> & PropsLocale<'deepseekChat'>
  & InjectFace<{ readonly browserPages: BrowserPageService }>

/** Keep one embedded Chat guest connected while Harness Sessions and main panels change. */
export function DeepSeekChatOverlay({ browserPages, t, usePanelInfo }: ChatOverlayProps): ReactNode {
  const active = usePanelInfo(info => info.activePanelId === CHAT_PANEL_ID)
  const viewportId = useId()
  const page = useRef<BrowserPage | null>(null)
  const [frame, setFrame] = useState<BrowserFrameState>(() => browserPages.emptyFrame())
  const [opened, setOpened] = useState(false)
  /** Bumped to retire a guest the carrier would not reload and stand up its replacement. */
  const [generation, setGeneration] = useState(0)
  /** Address a replacement guest must come back to; the first guest opens the entry point. */
  const resume = useRef<BrowserTarget | undefined>(undefined)
  const refusal = useRef<number | undefined>(undefined)

  useEffect(() => { if (active) setOpened(true) }, [active])

  useEffect(() => {
    if (!opened) return undefined
    const created = browserPages.createDesktopPage({
      initial: undefined,
      storage: 'deepseek-chat',
      persist: () => {},
      openRequested: (url) => {
        const target = browserPages.parseAddress(url, window.location.origin)
        if (target.ok) created.frame.loadUrl(target.target)
      },
    }, 'global:deepseek-chat')
    page.current = created
    const unmount = created.presentation.mount(viewportId)
    const unsubscribe = created.frame.subscribe(() => { setFrame(created.frame.getSnapshot()) })
    const destination = resume.current ?? entryPoint(browserPages)
    resume.current = undefined
    if (destination !== undefined) created.frame.loadUrl(destination)
    return () => {
      unsubscribe()
      unmount()
      page.current = null
      void created.frame.dispose()
    }
  }, [browserPages, viewportId, opened, generation])

  useEffect(() => () => { window.clearTimeout(refusal.current) }, [])

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
  const reload = (): void => {
    const created = page.current
    if (created === null) return
    const before = created.frame.getSnapshot()
    if (before.target === undefined) {
      const destination = entryPoint(browserPages)
      if (destination !== undefined) created.frame.loadUrl(destination)
      return
    }
    created.frame.reload()
    window.clearTimeout(refusal.current)
    refusal.current = window.setTimeout(() => {
      if (page.current?.frame.getSnapshot() !== before) return
      resume.current = before.target
      setGeneration(current => current + 1)
    }, RELOAD_REFUSAL_MS)
  }

  return <section className={css.overlay} data-active={active || undefined} aria-hidden={!active}>
    <header className={css.toolbar}>
      <button type="button" aria-label={t('back')} disabled={!frame.canGoBack}
        onClick={() => { page.current?.frame.goBack() }}><IconChevronLeftOutlineRegular /></button>
      <button type="button" aria-label={t('forward')} disabled={!frame.canGoForward}
        onClick={() => { page.current?.frame.goForward() }}><IconChevronRightOutlineRegular /></button>
      {/* Never disabled: with no address on screen the control re-enters the page. */}
      <button type="button" aria-label={t('reload')} onClick={reload}><IconRefreshOutlineRegular /></button>
      <span className={css.title}>{t('title')}</span>
      {frame.loading && frame.error === undefined && <span className={css.status}>{t('load.hint')}</span>}
    </header>
    {frame.error !== undefined && <p className={css.error} role="status">{t('load.failed')}</p>}
    <div id={viewportId} className={css.viewport} aria-label={t('title')} />
  </section>
}

/** The page's own entry point, reduced by the carrier's address policy. */
function entryPoint(browserPages: BrowserPageService): BrowserTarget | undefined {
  const destination = browserPages.parseAddress(DEEPSEEK_CHAT_URL, window.location.origin)
  return destination.ok ? destination.target : undefined
}
