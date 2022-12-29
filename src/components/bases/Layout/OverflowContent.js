import './OverflowContent.scss';

import React from 'react';
import { ScrollView } from 'components/bases/ScrollView/ScrollView';

export const OverflowContent = (props) =>
{
    return (
        <ScrollView className="overflow-container">
            {props.children}
        </ScrollView>
    );
};
