import { Sub2 } from '@vbd/vui';
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Container } from '@vbd/vui';
import Circle from './Circle';
import { numberToText } from 'extends/ffms/services/utilities/helper';
import { createRef } from 'react';

const MiniDetailItem = function (props)
{
    const { title, numbers, unit, percent, color, hasPercent } = props;

    const refText = createRef();

    useEffect(() =>
    {
        return watchTextChange();
    }, []);

    const watchTextChange = () =>
    {
        try
        {
            // The mutation observer
            const ob = new MutationObserver(function (mutations)
            {
                mutations.forEach(function(mutation)
                {
                    mutation.target.classList.remove('text-change');
                    setTimeout(function()
                    {
                        mutation.target.classList.add('text-change');
                    }, 0);
                });
            });
            return ob.observe(refText.current, {
                attributes: true,
                attributeFilter: ['value']
            });
        }
        catch (error)
        {
            // console.log('Browser not support');
        }
    };

    
    return (
        <Container className="mini-detail-item">
            {color ?
                <Circle
                    color={color}
                    className='circle-color'
                /> : ''}
            <span className="mini-detail-item-title">{title ? title : ''}</span>
            {hasPercent && <Sub2 className="mini-detail-item-percent">{`(${percent}%)`}</Sub2>}
            <Sub2 className="mini-detail-item-subTitle">{unit ? unit : ''}</Sub2>
            <div
                ref={refText}
                className="mini-detail-item-number"
                value={numberToText(numbers)}
            >{numbers ? numberToText(numbers) : 0}</div>
        </Container>
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
