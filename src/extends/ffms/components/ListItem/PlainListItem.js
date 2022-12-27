import './PlainListItem.scss';

import React, { Component } from 'react';
import { ListItem } from '@vbd/vui';

export class PlainListItem extends Component
{
    render()
    {
        return (
            <ListItem
                disableSelection
                splitter={false}
                {...this.props}
            />
        );
    }
}
