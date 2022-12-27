import React, { useEffect, createRef } from 'react';
import PropTypes from 'prop-types';

import { Sub2, Row } from '@vbd/vui';

import Circle from './Circle';

import { numberToText } from 'extends/ffms/services/utilities/helper';

const MiniDetailItem = function (props)
{
    const { title, numbers, unit, percent, color, hasPercent } = props;

    const refText = createRef();

    useEffect(() =>
    {
        return watchTextChange();
    }, []);

    // for animation text change
    // TODO: this feature should be a component
    const watchTextChange = () =>
    {
        try
        {
            // The mutation observer
            const ob = new MutationObserver(function (mutations)
            {
                mutations.forEach(function (mutation)
                {
                    mutation.target.classList.remove('text-change');
                    setTimeout(function ()
                    {
                        mutation.target.classList.add('text-change');
                    }, 0);
                });
            });

            return ob.observe(refText.current, {
                attributes: true,
                attributeFilter: ['value'],
            });
        }
        catch (error)
        {
            // Browser not support;
        }
    };

    return (
        <Row className="mini-detail-item" mainAxisAlignment="space-between" flex={1}>
            <Row>
                {color ?
                    <Circle
                        color={color}
                        className="circle-color"
                    /> : ''
                }
                <Sub2 className="mini-detail-item-title">{title ? title : ''}</Sub2>
            </Row>
            <Row mainAxisAlignment='end' flex={0}>
                <div
                    ref={refText}
                    className="mini-detail-item-number"
                    value={numberToText(numbers)}
                >
                    {numbers ? numberToText(numbers) : 0}
                </div>
                <Sub2 className="mini-detail-item-subTitle">{unit ? unit : ''}</Sub2>
                {hasPercent && <Sub2 className="mini-detail-item-percent">{`(${percent}%)`}</Sub2>}
            </Row>
        </Row>
    );
};

MiniDetailItem.propTypes = {
    type: PropTypes.string,
    title: PropTypes.string,
    numbers: PropTypes.number,
    color: PropTypes.string,
    percent: PropTypes.number,
    unit: PropTypes.string,
    hasPercent: PropTypes.bool,
};

export default MiniDetailItem;
