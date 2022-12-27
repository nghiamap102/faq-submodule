import { POIContent } from '../PopupContent/POIPopup';
import React from 'react';

type CasePopupContentProps = {
    data?: any
}

export const CasePopupContent: React.FC<CasePopupContentProps> = ({ data }) =>
{
    return <POIContent contents={data} />;
};
