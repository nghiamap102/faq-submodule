import './EmptyData.scss';

import React from 'react';
import { T } from 'components/bases/Translate/Translate';

export const EmptyData = ():JSX.Element =>
{
    return (
        <div className={'empty-data'}>
            <T>Không tìm thấy dữ liệu</T>
        </div>
    );
};
