// @vitest-environment jsdom
/** User-visible resource controls and account status wording. */
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, it } from 'vitest'
import { emptyBrowserFrame } from '../../ui-sidebar-browser/src/client/browser/BrowserFrame.ts'
import { ROCKWELL_PANEL_ID, RockwellOverlay } from '../src/client/RockwellResources.tsx'
import { rockwellEn } from '../src/client/locales.ts'

it('presents optional sign-in without claiming authenticated account access', () => {
  const html = renderToStaticMarkup(createElement(RockwellOverlay, {
    t: (key: keyof typeof rockwellEn) => rockwellEn[key],
    usePanelInfo: (select: (info: { activePanelId: string }) => boolean) => select({ activePanelId: ROCKWELL_PANEL_ID }),
    useResourceStatus: (select: (state: object) => object) => select({
      connected: false, busy: false, failed: false, frame: emptyBrowserFrame(),
    }),
    usePlaywrightPreference: (select: (state: object) => object) => select({
      writable: true, value: { mode: 'launch', persistent: false, userDataDir: '/fixture/rockwell' },
    }),
    rememberPlaywright: async () => true,
    mount: () => () => {}, open: () => {}, disconnect: async () => {},
    back: () => {}, forward: () => {}, reload: () => {},
  } as never))
  expect(html).toContain('Connect Rockwell')
  expect(html).toContain('Rockwell browser disconnected')
  expect(html).toContain('Disconnect / Clear session')
  expect(html).toMatchSnapshot()
})
