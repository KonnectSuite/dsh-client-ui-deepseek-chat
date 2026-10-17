/** Optional Rockwell account browser, retained across main panel changes. */
import { type ReactNode } from 'react';
import type { ConfigForm } from '@deepseek-ai/dsh-client-ui-settings/client';
import type { PlaywrightPreference } from './playwright-preference.ts';
import type { MainPanelId } from '@deepseek-ai/dsh-client-ui-layout/client';
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { createRockwellConnection } from './rockwell.ts';
/** Global navigation identity for the optional account browser. */
export declare const ROCKWELL_PANEL_ID: MainPanelId;
/** @param props - navigation icon size. @returns shared link icon. */
export declare function RockwellIcon({ size }: PropsRuntime<'sidebar.panellist'>): ReactNode;
/** @param props - localized panel copy. @returns retained page placeholder. */
export declare function RockwellPanel({ t }: PropsRuntime<'main'> & PropsLocale<'rockwellResources'>): ReactNode;
type Connection = ReturnType<typeof createRockwellConnection>;
type RockwellProps = PropsRuntime<'shell.overlay'> & PropsLocale<'rockwellResources'> & InjectFace<{
    readonly hooks: {
        readonly resourceStatus: Connection['status'];
        readonly playwrightPreference: ConfigForm<PlaywrightPreference>;
    };
    readonly rememberPlaywright: (enabled: boolean) => Promise<boolean>;
    readonly open: Connection['open'];
    readonly disconnect: Connection['disconnect'];
    readonly mount: Connection['mount'];
    readonly back: Connection['back'];
    readonly forward: Connection['forward'];
    readonly reload: Connection['reload'];
}>;
/** @param props - connection callbacks and framework-bound status hook. @returns Rockwell browser controls. */
export declare function RockwellOverlay({ t, usePanelInfo, useResourceStatus, usePlaywrightPreference, rememberPlaywright, mount, open, disconnect, back, forward, reload }: RockwellProps): ReactNode;
export {};
//# sourceMappingURL=RockwellResources.d.ts.map