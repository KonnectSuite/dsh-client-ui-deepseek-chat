/** Atomic settings changes for optional remembered Playwright authentication. */
import type { ConfigForm } from '@deepseek-ai/dsh-client-ui-settings/client';
/** Browser provider values read by the Rockwell controls. */
export interface PlaywrightPreference {
    readonly mode: 'launch' | 'attach';
    readonly persistent?: boolean;
    readonly headless?: boolean;
    readonly userDataDir?: string;
}
/** Select remembered sign-in with a visible browser or restore isolated launches.
 * @param form - browser provider's settings form.
 * @param enabled - whether website authentication should survive browser shutdown.
 * @returns whether the host accepted the atomic update. */
export declare function setRememberedPlaywright(form: ConfigForm<PlaywrightPreference>, enabled: boolean): Promise<boolean>;
//# sourceMappingURL=playwright-preference.d.ts.map