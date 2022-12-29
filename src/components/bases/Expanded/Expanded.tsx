import React from 'react';
import { Property } from 'csstype';

export type ExpandedProps = {
    className?: string
    flex?: boolean
    padding?: Property.Padding
    margin?: Property.Margin
}

export const Expanded: React.FC<ExpandedProps> = (props) =>
{
    const { flex = true, padding = '0 0 0 0', margin = '0 0 0 0', className, children } = props;

    return (
        <div
            className={className}
            style={{
                flex: 1,
                width: '100%',
                height: '100%',
                display: flex ? 'flex' : 'block',
                padding,
                margin,
            }}
        >
            {children}
        </div>
    );
};
