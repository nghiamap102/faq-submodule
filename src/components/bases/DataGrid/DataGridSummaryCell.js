import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { DataGridCell } from 'components/bases/DataGrid/DataGridCell';
import clsx from 'clsx';

export const DataGridSummaryCell = (props) =>
{
    const { col, style, items, className } = props;
    const { label, formula } = col.summary || {};
    const [result, setResult] = useState('');

    const colItems = items.map(row => row[col.id]);

    const sum = () => colItems.reduce((pre, cur) => pre += cur, 0);

    const calcSummary = async () =>
    {
        if (typeof (formula) === 'function')
        {
            return setResult(await formula(colItems));
        }

        if (typeof (formula) === 'string')
        {
            switch (formula)
            {
                case 'average':
                    return setResult(sum() / (colItems.length));
                default:
                    return setResult(sum());
            }
        }
    };

    useEffect(() =>
    {
        calcSummary();
    }, [formula]);

    return (
        <div
            className={clsx('dg-footer-item', className)}
            style={style}
        >
            <div className='dg-cell'>
                {
                    formula && (
                        <>
                            {label ? label + ': ' : ''}
                            <DataGridCell
                                definition={col}
                                content={`${result}`}
                            />
                        </>
                    )}
            </div>
        </div>
    );
};

DataGridSummaryCell.propTypes = {
    col: PropTypes.object,
    style: PropTypes.object,
    items: PropTypes.array,
    className: PropTypes.string,
};
