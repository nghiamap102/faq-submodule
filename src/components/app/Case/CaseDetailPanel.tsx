import React from 'react';
import { POIContent } from '../PopupContent/POIPopup';
import { ScrollView } from '@vbd/vui';

type CaseDetailPanelProps = {
    data: any
}

export const CaseDetailPanel: React.FC<CaseDetailPanelProps> = (props) =>
{
    const { data } = props;
    return (
        <ScrollView>
            {
                data && (
                    <POIContent
                        labelWidth={'120px'}
                        contents={data}
                    />
                )}
        </ScrollView>
    );
};
