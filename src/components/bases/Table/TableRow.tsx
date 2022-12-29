import React from 'react';

import './Table.scss';

export const TableRow: React.FC<JSX.IntrinsicElements['tr']> = (props) =>
{
    const { children, ...restProps } = props;
    return (
        <tr {...restProps}>
            {children}
        </tr>
    );
};
