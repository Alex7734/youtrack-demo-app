import type { HostAPI } from '../../../@types/globals';

export interface ToggleFlagResponse {
    enabled: boolean;
}

export interface ToggleFlagRequest {
    enabled: boolean;
}

export class ToggleService {
    constructor(private host: HostAPI) { }

    async loadFlag(): Promise<boolean> {
        try {
            const response = await this.host.fetchApp<ToggleFlagResponse>('backend/test-management-flag', {
                method: 'GET'
            });

            return response?.enabled === true;
        } catch (err) {
            return false;
        }
    }

    async saveFlag(enabled: boolean): Promise<void> {
        await this.host.fetchApp('backend/test-management-flag', {
            method: 'POST',
            body: { enabled } as ToggleFlagRequest
        });
    }
}

