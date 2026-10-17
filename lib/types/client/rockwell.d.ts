/** Retained Rockwell guest and local account disconnection lifecycle. */
import { type SnapshotStore } from '@deepseek-ai/dsh-client-store';
import type { BrowserFrameState, BrowserPageService } from '@deepseek-ai/dsh-client-ui-sidebar-browser/client';
/** Official resource entry points; authentication is performed by the user on the website. */
export declare const ROCKWELL_RESOURCES: {
    readonly knowledgebase: "https://support.rockwellautomation.com/";
    readonly downloads: "https://compatibility.rockwellautomation.com/Pages/home.aspx";
    readonly samples: "https://www.rockwellautomation.com/en-us/support/product/product-downloads/application-code-library/sample-code.html";
};
/** Local browser status; connected does not establish Rockwell authentication. */
export interface RockwellConnectionStatus {
    readonly connected: boolean;
    readonly busy: boolean;
    readonly failed: boolean;
    readonly frame: BrowserFrameState;
}
/** Account guest operations bound to one plugin registration. */
export interface RockwellConnection {
    readonly status: SnapshotStore<RockwellConnectionStatus>;
    /** Open an official resource in the account guest. */
    readonly open: (resource: keyof typeof ROCKWELL_RESOURCES) => void;
    /** Close the guest and clear local account data. */
    readonly disconnect: () => Promise<void>;
    /** Attach the retained guest to the viewport and return its unmount callback. */
    readonly mount: (id: string) => () => void;
    /** Navigate backward in the current guest. */
    readonly back: () => void;
    /** Navigate forward in the current guest. */
    readonly forward: () => void;
    /** Reload the current guest. */
    readonly reload: () => void;
    /** Release the guest without erasing the local account. */
    readonly dispose: () => Promise<void>;
}
/** Create an idle account connection with owned guest teardown.
 * @param browser - Desktop page provider.
 * @returns account page operations and observable status. */
export declare function createRockwellConnection(browser: BrowserPageService): RockwellConnection;
//# sourceMappingURL=rockwell.d.ts.map