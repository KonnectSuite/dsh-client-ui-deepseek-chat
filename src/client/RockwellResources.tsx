/** Optional Rockwell account browser, retained across main panel changes. */
import { useEffect, useId, useState, type ReactNode } from 'react'
import type { ConfigForm } from '@deepseek-ai/dsh-client-ui-settings/client'
import type { PlaywrightPreference } from './playwright-preference.ts'
import { Button, IconLinkOutlineRegular } from '@deepseek-ai/dsh-client-ui-primitives'
import type { MainPanelId } from '@deepseek-ai/dsh-client-ui-layout/client'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type { createRockwellConnection } from './rockwell.ts'
import css from './DeepSeekChat.module.css'

/** Global navigation identity for the optional account browser. */
export const ROCKWELL_PANEL_ID = 'rockwell-resources' as MainPanelId

/** @param props - navigation icon size. @returns shared link icon. */
export function RockwellIcon({ size }: PropsRuntime<'sidebar.panellist'>): ReactNode {
  return <IconLinkOutlineRegular size={size} />
}

/** @param props - localized panel copy. @returns retained page placeholder. */
export function RockwellPanel({ t }: PropsRuntime<'main'> & PropsLocale<'rockwellResources'>): ReactNode {
  return <main aria-label={t('title')} className={css.page} />
}

type Connection = ReturnType<typeof createRockwellConnection>
type RockwellProps = PropsRuntime<'shell.overlay'> & PropsLocale<'rockwellResources'> & InjectFace<{
  readonly hooks: {
    readonly resourceStatus: Connection['status']
    readonly playwrightPreference: ConfigForm<PlaywrightPreference>
  }
  readonly rememberPlaywright: (enabled: boolean) => Promise<boolean>
  readonly open: Connection['open']
  readonly disconnect: Connection['disconnect']
  readonly mount: Connection['mount']
  readonly back: Connection['back']
  readonly forward: Connection['forward']
  readonly reload: Connection['reload']
}>

/** @param props - connection callbacks and framework-bound status hook. @returns Rockwell browser controls. */
export function RockwellOverlay({ t, usePanelInfo, useResourceStatus, usePlaywrightPreference, rememberPlaywright, mount, open, disconnect,
  back, forward, reload }: RockwellProps): ReactNode {
  const active = usePanelInfo(info => info.activePanelId === ROCKWELL_PANEL_ID)
  const state = useResourceStatus(value => value)
  const preference = usePlaywrightPreference(value => value)
  const [saving, setSaving] = useState(false)
  const [failed, setFailed] = useState(false)
  const persistent = preference.value?.persistent === true
  const remember = async (): Promise<void> => {
    setSaving(true)
    setFailed(false)
    try { setFailed(!await rememberPlaywright(!persistent)) }
    catch (error) { console.error('Playwright preference update failed', error); setFailed(true) }
    finally { setSaving(false) }
  }
  const viewportId = useId()
  useEffect(() => mount(viewportId), [mount, viewportId])
  return <section className={css.overlay} data-active={active || undefined} aria-hidden={!active}>
    <header className={css.resourceToolbar}>
      <span className={css.title}>{t('title')}</span>
      <Button size="sm" disabled={state.busy} onClick={() => { open('knowledgebase') }}>{t(state.connected ? 'knowledgebase' : 'connect')}</Button>
      <Button size="sm" disabled={state.busy} onClick={() => { open('downloads') }}>{t('downloads')}</Button>
      <Button size="sm" disabled={state.busy} onClick={() => { open('samples') }}>{t('samples')}</Button>
      <Button size="sm" disabled={!state.frame.canGoBack || state.busy} onClick={back}>{t('back')}</Button>
      <Button size="sm" disabled={!state.frame.canGoForward || state.busy} onClick={forward}>{t('forward')}</Button>
      <Button size="sm" disabled={!state.connected || state.busy} onClick={reload}>{t('reload')}</Button>
      <Button size="sm" disabled={state.busy} onClick={() => { void disconnect() }}>{t('disconnect')}</Button>
    </header>
    <p className={css.resourceHint} role="status">{t(state.busy ? 'clearing' : state.failed ? 'clear.failed'
      : state.frame.error !== undefined ? 'load.failed' : state.frame.loading ? 'loading'
        : state.connected ? 'opened' : 'disconnected')}</p>
    <p className={css.resourceHint}>{t('hint')}</p>
    <div className={css.resourceToolbar}>
      <Button size="sm" disabled={saving || !preference.writable || preference.value?.mode !== 'launch'
        || preference.value.userDataDir === undefined} onClick={() => { void remember() }}>
        {t(saving ? 'playwright.saving' : persistent ? 'playwright.disable' : 'playwright.enable')}
      </Button>
      <span className={css.status} role="status">{t(failed ? 'playwright.failed' : persistent ? 'playwright.enabled' : 'playwright.disabled')}</span>
    </div>
    <p className={css.resourceHint}>{t('playwright.hint')}</p>
    <div id={viewportId} className={css.viewport} aria-label={t('title')} />
  </section>
}
