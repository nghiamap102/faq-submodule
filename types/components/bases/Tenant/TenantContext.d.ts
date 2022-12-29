import React from 'react';
import { Theme } from '../Theme/ThemeContext';
import { ThemeConfig } from '../Theme/model';
export declare type TenantContext = {
    config: TenantConfig;
};
export declare type TenantConfig = Partial<{
    home: string;
    theme: string;
    language: string;
    locale: string;
    favicon: string;
    logo: string;
    themeList: Theme[];
    themeConfig: ThemeConfig;
    mapStyleList: {
        id: string;
        label: string;
    }[];
    status: number;
    product: string;
    country: string;
    sysId: string;
    baseMapApi: string[];
    title: string;
    subtitle: string;
    ga: {
        trackingId: string;
    };
    vdms: Record<string, unknown>;
    c4i2: Record<string, unknown>;
}>;
export declare const TenantContext: React.Context<TenantContext>;
declare type TenantProviderProps = {
    apiURL?: string;
};
declare const TenantProvider: React.FC<TenantProviderProps>;
export { TenantProvider };
//# sourceMappingURL=TenantContext.d.ts.map