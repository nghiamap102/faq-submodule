import React, { createContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

import HttpClient from 'helper/http.helper';
import { Loading } from 'components/bases/Modal/Loading';
import { Theme } from '../Theme/ThemeContext';
import { ThemeConfig } from '../Theme/model';

const http = new HttpClient();

export type TenantContext = {
    config: TenantConfig
}

export type TenantConfig = Partial<{
  home: string
  theme: string
  language: string
  locale: string
  favicon: string
  logo: string
  themeList: Theme[]
  themeConfig: ThemeConfig
  mapStyleList: {
      id: string
      label: string
  }[],
  status: number
  product: string
  country: string
  sysId: string
  baseMapApi: string[]
  title: string
  subtitle: string
  ga: {
    trackingId: string
  },
  vdms: Record<string, unknown>
  c4i2: Record<string, unknown>
}>

export const TenantContext = createContext<TenantContext>({} as TenantContext);

type TenantProviderProps = {
    apiURL?: string
}
const TenantProvider:React.FC<TenantProviderProps> = ({ apiURL, children }) =>
{
    const [tenantConfig, setTenantConfig] = useState<TenantConfig>({} as TenantConfig);
    const [loading, setLoading] = useState(true);

    useEffect(() =>
    {
        if (apiURL)
        {
            http.get(apiURL).then((config) =>
            {
                // if config has public access token, write it down
                if (config?.vdms?.publicAccessToken)
                {
                    Cookies.set('vdmsPublicAccesstoken', config.vdms.publicAccessToken);
                }

                setTenantConfig(config);
                setLoading(false);
            });
        }
        else
        {
            setLoading(false);
        }
    }, []);

    return (
        <TenantContext.Provider value={{ config: tenantConfig }}>
            {loading ? <Loading fullscreen /> : children}
        </TenantContext.Provider>
    );
};

export { TenantProvider };
