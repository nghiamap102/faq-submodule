import React from 'react';
import clsx from 'clsx';

import { Row2 } from 'components/bases/Layout/Row';

import './MapButtonGroup.scss';

export const MapButtonGroup: React.FC<{className: string}> = ({ children, className }) =>
{
    return (
        <Row2 className={clsx('map-group-button', 'map-control', className)}>
            {children}
        </Row2>
    );
};
