import React from 'react';

import './Separator.scss';

export type SeparatorProps = {
  className?: string;
  displayAs?: 'forward-slash' | 'backslash' | 'arrow';
  weight?: 'bold' | 'bolder' | 'lighter' | 'normal';
}

export const Separator: React.FC<SeparatorProps> = (props) =>
{
    const { className = '', displayAs, weight = 'normal' } = props;

    let display = undefined;

    if (displayAs === 'forward-slash')
    {
        display = '/';
    }

    if (displayAs === 'backslash')
    {
        display = '\\';
    }

    if (displayAs === 'arrow')
    {
        display = '›';
    }

    return (
        <div className={`${className} separator-container`}>
            <span className={`separator-${weight}`}>{display ?? props.children}</span>
        </div>
    );
};
