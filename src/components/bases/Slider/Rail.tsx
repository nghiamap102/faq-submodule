import React, { CSSProperties } from 'react';

import './Rail.scss';

export type RailProps = {
    style?: CSSProperties;
}
export const Rail = (props: RailProps): JSX.Element =>
{
    const { style } = props;
    return (
        <div
            className={'slider__rail'}
            style={style}
        />
    );
};
