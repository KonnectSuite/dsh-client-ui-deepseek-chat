/** Retained Rockwell guest and local account disconnection lifecycle. */
import { createSnapshotStore } from '@deepseek-ai/dsh-client-store';
/** Official resource entry points; authentication is performed by the user on the website. */
export const ROCKWELL_RESOURCES = {
    knowledgebase: 'https://support.rockwellautomation.com/',
    downloads: 'https://compatibility.rockwellautomation.com/Pages/home.aspx',
    samples: 'https://www.rockwellautomation.com/en-us/support/product/product-downloads/application-code-library/sample-code.html',
};
/** Create an idle account connection with owned guest teardown.
 * @param browser - Desktop page provider.
 * @returns account page operations and observable status. */
export function createRockwellConnection(browser) {
    const status = createSnapshotStore({ connected: false, busy: false, failed: false, frame: browser.emptyFrame() });
    let page;
    let container;
    let unmount;
    let unsubscribe;
    let disconnecting;
    let disposed = false;
    const close = async () => {
        const previous = page;
        page = undefined;
        unsubscribe?.();
        unsubscribe = undefined;
        unmount?.();
        unmount = undefined;
        await previous?.frame.dispose();
    };
    const open = (resource) => {
        if (disposed || disconnecting !== undefined)
            return;
        if (page === undefined) {
            const created = browser.createDesktopPage({ initial: undefined, storage: 'rockwell-resources',
                persist: () => { }, openRequested: (url) => {
                    const target = browser.parseAddress(url, window.location.origin);
                    if (target.ok)
                        created.frame.loadUrl(target.target);
                } }, 'global:rockwell-resources');
            page = created;
            unsubscribe = created.frame.subscribe(() => {
                status.set({ ...status.getSnapshot(), frame: created.frame.getSnapshot() });
            });
            if (container !== undefined)
                unmount = created.presentation.mount(container);
        }
        const target = browser.parseAddress(ROCKWELL_RESOURCES[resource], window.location.origin);
        if (!target.ok)
            throw new Error('Rockwell resource URL was refused');
        status.set({ ...status.getSnapshot(), connected: true, failed: false });
        page.frame.loadUrl(target.target);
    };
    const disconnect = () => {
        if (disconnecting !== undefined)
            return disconnecting;
        status.set({ ...status.getSnapshot(), busy: true, failed: false });
        disconnecting = (async () => {
            try {
                await close();
                await browser.clearDesktopStorage('rockwell-resources');
                status.set({ connected: false, busy: false, failed: false, frame: browser.emptyFrame() });
            }
            catch (error) {
                console.error('Rockwell browser disconnection failed', error);
                status.set({ connected: false, busy: false, failed: true, frame: browser.emptyFrame() });
            }
            finally {
                disconnecting = undefined;
            }
        })();
        return disconnecting;
    };
    return {
        status, open, disconnect,
        mount(id) {
            container = id;
            if (page !== undefined)
                unmount = page.presentation.mount(id);
            return () => { container = undefined; unmount?.(); unmount = undefined; };
        },
        back: () => { page?.frame.goBack(); },
        forward: () => { page?.frame.goForward(); },
        reload: () => { page?.frame.reload(); },
        async dispose() { disposed = true; await disconnecting; await close(); },
    };
}
//# sourceMappingURL=rockwell.js.map