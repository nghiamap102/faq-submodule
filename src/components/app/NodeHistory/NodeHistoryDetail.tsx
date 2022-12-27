import './NodeHistoryDetail.scss';

import React from 'react';

import {
    BorderPanel, PanelHeader, PanelBody,
    ScrollView,
    DescriptionItem, DescriptionGroup,
} from '@vbd/vui';

export type NodeHistoryDetailProps = {
    data: any,
    labelWidth?: string
}

export const NodeHistoryDetail: React.FC<NodeHistoryDetailProps> = (props) =>
{
    const { data, labelWidth = '30px' } = props;

    const isNullUndefinedEmpty = (value: any) =>
    {
        return value === null || value === undefined || value === '';
    };

    const renderDetail = () =>
    {
        return Object.keys(data.LayerData).map((key: string) => (
            <DescriptionItem
                key={key}
                label={data.LayerData[key]?.DisplayName || key}
                labelWidth={labelWidth}
            >
                {
                    data.PreValue && key in data.PreValue && (
                        <div className={'history-pre-value'}>
                            {isNullUndefinedEmpty(data.PreValue[key]) ? 'Không có dữ liệu' : data.PreValue[key]}
                            {/* {data.PreValue[key]} */}
                        </div>
                    )
                }
                <div>
                    {isNullUndefinedEmpty(data.LayerData[key]?.Value) ? 'Không có dữ liệu' : data.LayerData[key]?.Value}
                </div>
            </DescriptionItem>
        ));
    };

    return (
        <BorderPanel flex={1}>
            <PanelHeader>
                Thông tin chi tiết
            </PanelHeader>
            <PanelBody>
                {data && data.LayerData && (
                    <ScrollView>
                        <DescriptionGroup>
                            {renderDetail()}
                        </DescriptionGroup>
                    </ScrollView>
                )}
            </PanelBody>
        </BorderPanel>
    );
};
