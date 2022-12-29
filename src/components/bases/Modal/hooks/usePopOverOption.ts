import { useState, useLayoutEffect } from 'react';

import { IUsePopOverOption, IPerfectScrollbarSize } from '../model/usePopOverOptionType';

const usePopOverOption: IUsePopOverOption = (params) =>
{
    const { isResponsive, header, width, maxHeight, wrappedEl } = params;

    const [psSize, setPsSize] = useState<IPerfectScrollbarSize>({});
    
    useLayoutEffect(() =>
    {
        const newPsSize = isResponsive ? getPsSizeResponsive(header) : getNormalPsSize(wrappedEl, width, maxHeight);
        setPsSize(newPsSize);
    }, [header, isResponsive, maxHeight, width, wrappedEl]);

    const getPsSizeResponsive = (header?: string) :IPerfectScrollbarSize =>
    {
        const responsiveWidth = window.innerWidth - 100;
        const responsiveHeight = window.innerHeight - 150;
        return { minWidth: responsiveWidth, maxWidth: responsiveWidth, maxHeight: responsiveHeight + (header ? -25 : 0) };
    };

    const getNormalPsSize = (wrappedEl: HTMLElement | null, width?: number, maxHeight?: number) :IPerfectScrollbarSize =>
    {
        const DEFAULT_MIN_WIDTH = 150;
        const rect = wrappedEl?.getBoundingClientRect();
        return { minWidth: DEFAULT_MIN_WIDTH, ...(rect?.width && { width: rect.width }), ...(width && { width }), ...(maxHeight && { maxHeight }) };
    };

    return { psSize };
};

export default usePopOverOption;
