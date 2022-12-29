import React from 'react';

export type IframeProps = {
    src: string
    className?: string
    frameBorder?: number
    width?: string
    height?: string
    background?: string
}

export const Iframe = (props: IframeProps):JSX.Element =>
{
    const { className, width, height, background, src, frameBorder = 0 } = props;

    return (
        <iframe
            className={className}
            frameBorder={frameBorder}
            style={{ width, height, background }}
            src={src}
        />
    );
};
