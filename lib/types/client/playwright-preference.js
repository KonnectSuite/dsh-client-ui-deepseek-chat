/** Select remembered sign-in with a visible browser or restore isolated launches.
 * @param form - browser provider's settings form.
 * @param enabled - whether website authentication should survive browser shutdown.
 * @returns whether the host accepted the atomic update. */
export function setRememberedPlaywright(form, enabled) {
    const current = form.getSnapshot();
    if (!current.writable || current.value?.mode !== 'launch' || current.value.userDataDir === undefined) {
        return Promise.resolve(false);
    }
    return form.mutate([
        { op: 'set', path: ['persistent'], value: enabled },
        enabled ? { op: 'set', path: ['headless'], value: false } : { op: 'unset', path: ['headless'] },
    ], current.revision);
}
//# sourceMappingURL=playwright-preference.js.map