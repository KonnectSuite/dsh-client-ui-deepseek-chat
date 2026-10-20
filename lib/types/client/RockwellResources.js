import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/** Optional Rockwell account browser, retained across main panel changes. */
import { useEffect, useId, useState } from 'react';
import { Button, IconLinkOutlineRegular } from '@deepseek-ai/dsh-client-ui-primitives';
import css from './DeepSeekChat.module.css';
/** Global navigation identity for the optional account browser. */
export const ROCKWELL_PANEL_ID = 'rockwell-resources';
/** @param props - navigation icon size. @returns shared link icon. */
export function RockwellIcon({ size }) {
    return _jsx(IconLinkOutlineRegular, { size: size });
}
/** @param props - localized panel copy. @returns retained page placeholder. */
export function RockwellPanel({ t }) {
    return _jsx("main", { "aria-label": t('title'), className: css.page });
}
/** @param props - connection callbacks and framework-bound status hook. @returns Rockwell browser controls. */
export function RockwellOverlay({ t, usePanelInfo, useResourceStatus, usePlaywrightPreference, rememberPlaywright, mount, open, disconnect, back, forward, reload }) {
    const active = usePanelInfo(info => info.activePanelId === ROCKWELL_PANEL_ID);
    const state = useResourceStatus(value => value);
    const preference = usePlaywrightPreference(value => value);
    const [saving, setSaving] = useState(false);
    const [failed, setFailed] = useState(false);
    const persistent = preference.value?.persistent === true;
    const remember = async () => {
        setSaving(true);
        setFailed(false);
        try {
            setFailed(!await rememberPlaywright(!persistent));
        }
        catch (error) {
            console.error('Playwright preference update failed', error);
            setFailed(true);
        }
        finally {
            setSaving(false);
        }
    };
    const viewportId = useId();
    useEffect(() => mount(viewportId), [mount, viewportId]);
    return _jsxs("section", { className: css.overlay, "data-active": active || undefined, "aria-hidden": !active, children: [_jsxs("header", { className: css.resourceToolbar, children: [_jsx("span", { className: css.title, children: t('title') }), _jsx(Button, { size: "sm", disabled: state.busy, onClick: () => { open('knowledgebase'); }, children: t(state.connected ? 'knowledgebase' : 'connect') }), _jsx(Button, { size: "sm", disabled: state.busy, onClick: () => { open('downloads'); }, children: t('downloads') }), _jsx(Button, { size: "sm", disabled: state.busy, onClick: () => { open('samples'); }, children: t('samples') }), _jsx(Button, { size: "sm", disabled: !state.frame.canGoBack || state.busy, onClick: back, children: t('back') }), _jsx(Button, { size: "sm", disabled: !state.frame.canGoForward || state.busy, onClick: forward, children: t('forward') }), _jsx(Button, { size: "sm", disabled: !state.connected || state.busy, onClick: reload, children: t('reload') }), _jsx(Button, { size: "sm", disabled: state.busy, onClick: () => { void disconnect(); }, children: t('disconnect') })] }), _jsx("p", { className: css.resourceHint, role: "status", children: t(state.busy ? 'clearing' : state.failed ? 'clear.failed'
                    : state.frame.error !== undefined ? 'load.failed' : state.frame.loading ? 'loading'
                        : state.connected ? 'opened' : 'disconnected') }), _jsx("p", { className: css.resourceHint, children: t('hint') }), _jsxs("div", { className: css.resourceToolbar, children: [_jsx(Button, { size: "sm", disabled: saving || !preference.writable || preference.value?.mode !== 'launch'
                            || preference.value.userDataDir === undefined, onClick: () => { void remember(); }, children: t(saving ? 'playwright.saving' : persistent ? 'playwright.disable' : 'playwright.enable') }), _jsx("span", { className: css.status, role: "status", children: t(failed ? 'playwright.failed' : persistent ? 'playwright.enabled' : 'playwright.disabled') })] }), _jsx("p", { className: css.resourceHint, children: t('playwright.hint') }), _jsx("div", { id: viewportId, className: css.viewport, "aria-label": t('title') })] });
}
//# sourceMappingURL=RockwellResources.js.map