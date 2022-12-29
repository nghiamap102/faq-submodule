import React from 'react';

import './Table.scss';

export const TableRowCell: React.FC<JSX.IntrinsicElements['td']> = (props) =>
{
    const { children, align = 'center', ...restProps } = props;
    return (
        <td
            align={align}
            {...restProps}
        >
            {children}
        </td>
    );
};
