import './MiniDetail.scss';

import React from 'react';
import PropTypes from 'prop-types';

import { Container, Sub1 } from '@vbd/vui';

import MiniDetailItem from './MiniDetailItem';

const MiniDetail = function ({ data })
{
    if (data)
    {
        return (
            <Container className="mini-detail">
                <Sub1>{data.title}</Sub1>
                <Container className="mini-detail-analytic">
                    {
                        data.items?.map(item =>
                            <MiniDetailItem
                                hasPercent
                                key={`${item.type}-${item.color}`}
                                type={item.type ?? ''}
                                title={item.name ?? ''}
                                color={item.color}
                                unit={item.unit ?? ''}
                                numbers={item.value}
                                percent={item.percent}
                            />,
                        )

                    }
                </Container>

                <MiniDetailItem
                    hasPercent={false}
                    title="Tổng"
                    numbers={data.total ?? 0}
                    unit={data.unit ?? ''}
                />
            </Container>
        );
    }
    else
    {
        return (<Container />);
    }
};

MiniDetail.propTypes = {
    data: PropTypes.shape({
        type: PropTypes.string,
        title: PropTypes.string,
        items: PropTypes.array,
    }),
};
export default MiniDetail;
