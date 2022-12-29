import React from 'react';
import { Property } from 'csstype';
import { FAIcon } from '@vbd/vicon';

import { T } from 'components/bases/Translate/Translate';
import { Row2, Col2 } from 'components/bases/Layout';
import { Container } from 'components/bases/Container/Container';
import { ScrollView } from 'components/bases/ScrollView/ScrollView';

import './Table.scss';

export type TableProps = {
    headers?: TableHeader[]
    className?: string
    isFixedHeader?: boolean
    isLoading?: boolean
}
type TableHeader = {
    isUseChild?: boolean
    child?: React.ReactElement
    width?: Property.Width
    col?: number
    label?: string
    subCols?: Pick<TableHeader, 'label'>[]
    align?: 'center' | 'left' | 'right';
}

export const Table: React.FC<TableProps> = (props) =>
{
    const { headers, isFixedHeader, className, isLoading, children } = props;

    return (
        <ScrollView className={className}>
            <table className={`table-panel ${isFixedHeader ? 'fixed-header' : ''}`}>
                <thead>
                    <tr>
                        {
                            Array.isArray(headers) && headers.map((h, index) =>
                                h.isUseChild
                                    ? (
                                            <th
                                                key={index}
                                                style={{ width: h.width }}
                                                colSpan={h.col}
                                                align={h.align ? h.align : 'center'}
                                            >
                                                {h.child}
                                            </th>
                                        )
                                    : (
                                            <th
                                                key={index}
                                                style={{ width: h.width }}
                                                colSpan={h.col || h.subCols?.length}
                                                align={h.align ? h.align : 'center'}
                                            >
                                                <Container><T>{h.label}</T></Container>
                                                {
                                                    h.subCols &&
                                            (
                                                <Row2
                                                    justify={'around'}
                                                    gap={2}
                                                    sx={{ p: 2 }}
                                                >
                                                    {h.subCols.map((sub, index) => <Container key={index}>{sub.label}</Container>)}
                                                </Row2>
                                            )
                                                }
                                            </th>
                                        ),
                            )
                        }
                    </tr>
                </thead>

                {
                    !isLoading && children && (
                        <tbody>
                            {children}
                        </tbody>
                    )}

            </table>

            {
                !isLoading &&
                    (
                        !children ||
                        (Array.isArray(children) && children.length === 0) ||
                        typeof children === 'boolean'
                    ) && (
                    <div
                        style={{
                            width: '100%',
                            top: '50%',
                            textAlign: 'center',
                            paddingTop: '2rem',
                            position: 'absolute',
                        }}
                    >
                        <div style={{ opacity: '0.7' }}>Không có dữ liệu</div>
                    </div>
                )}

            {
                isLoading && (
                    <Col2
                        justify='center'
                        items='center'
                    >
                        <FAIcon
                            icon={'spinner-third'}
                            type={'duotone'}
                            size={'3rem'}
                            spin
                        />
                    </Col2>
                )}
        </ScrollView>
    );
};
