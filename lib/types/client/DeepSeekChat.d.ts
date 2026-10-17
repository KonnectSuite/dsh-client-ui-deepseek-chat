/** Root-level DeepSeek Chat page and retained Desktop webview. */
import { type ReactNode } from 'react';
import type { MainPanelId } from '@deepseek-ai/dsh-client-ui-layout/client';
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { BrowserPageService } from '@deepseek-ai/dsh-client-ui-sidebar-browser/client';
/** The global page identity shared by the left navigation row and main slot. */
export declare const CHAT_PANEL_ID: MainPanelId;
/** Decorative icon for the left navigation row. */
export declare function DeepSeekChatIcon({ size }: PropsRuntime<'sidebar.panellist'>): ReactNode;
/** Main-slot occupant; the connected webview stays in the root overlay across panel changes. */
export declare function DeepSeekChatPanel({ t }: PropsRuntime<'main'> & PropsLocale<'deepseekChat'>): ReactNode;
type ChatOverlayProps = PropsRuntime<'shell.overlay'> & PropsLocale<'deepseekChat'> & InjectFace<{
    readonly browserPages: BrowserPageService;
}>;
/** Keep one embedded Chat guest connected while Harness Sessions and main panels change. */
export declare function DeepSeekChatOverlay({ browserPages, t, usePanelInfo }: ChatOverlayProps): ReactNode;
export {};
//# sourceMappingURL=DeepSeekChat.d.ts.map