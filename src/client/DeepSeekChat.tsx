/** Root-level DeepSeek Chat page and retained Desktop webview. */
import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { BrandWordmark, IconChevronLeftOutlineRegular, IconChevronRightOutlineRegular,
  IconRefreshOutlineRegular } from '@deepseek-ai/dsh-client-ui-primitives'
import type { MainPanelId } from '@deepseek-ai/dsh-client-ui-layout/client'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type { BrowserFrameState, BrowserPage, BrowserPageService } from '@deepseek-ai/dsh-client-ui-sidebar-browser/client'
import { DEEPSEEK_CHAT_URL } from './definition.ts'
import css from './DeepSeekChat.module.css'

/** The global page identity shared by the left navigation row and main slot. */
export const CHAT_PANEL_ID = 'deepseek-chat' as MainPanelId

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
    const destination = browserPages.parseAddress(DEEPSEEK_CHAT_URL, window.location.origin)
    if (destination.ok) created.frame.loadUrl(destination.target)
    return () => {
      unsubscribe()
      unmount()
      page.current = null
      void created.frame.dispose()
    }
  }, [browserPages, viewportId, opened])

  return <section className={css.overlay} data-active={active || undefined} aria-hidden={!active}>
    <header className={css.toolbar}>
      <button type="button" aria-label={t('back')} disabled={!frame.canGoBack}
        onClick={() => { page.current?.frame.goBack() }}><IconChevronLeftOutlineRegular /></button>
      <button type="button" aria-label={t('forward')} disabled={!frame.canGoForward}
        onClick={() => { page.current?.frame.goForward() }}><IconChevronRightOutlineRegular /></button>
      <button type="button" aria-label={t('reload')} disabled={frame.target === undefined}
        onClick={() => { page.current?.frame.reload() }}><IconRefreshOutlineRegular /></button>
      <span className={css.title}>{t('title')}</span>
    </header>
    {frame.error !== undefined && <p className={css.error} role="status">{t('load.failed')}</p>}
    <div id={viewportId} className={css.viewport} aria-label={t('title')} />
  </section>
}
