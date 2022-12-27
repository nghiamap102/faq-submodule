import './EmptyData.scss';

import React, { Component } from 'react';
import { T } from '@vbd/vui';

export class EmptyData extends Component
{
    render()
    {
        return (
            <div className={'empty-data'}>
                <T>Không tìm thấy dữ liệu</T>
            </div>
        );
    }
}
