import React from 'react';
import clsx from 'clsx';

import { Col2 } from 'components/bases/Layout/Column';
import { Row2 } from 'components/bases/Layout/Row';
import { Overlay } from 'components/bases/Modal/Overlay';
import { Spinner, ISize } from 'components/bases/Modal/Spinner';
import { Typography } from 'components/bases/Text/Text';
import { TypographyVariant } from 'components/bases/Text/model/textType';
import ConditionalWrapper from 'components/bases/HOC/ConditionalWrapper';

import './Loading.scss';

export type LoadingProps = {
    className?: string
    fullscreen?: boolean
    spinnerSize?: ISize
    text?: string
    direction?: 'row' | 'column'
    overlay?: boolean
}

const MAPPED_TEXT_SIZE: Record<ISize, TypographyVariant> = {
    xs: 'TB2',
    sm: 'TB1',
    md: 'Sub1',
    lg: 'HD6',
    xl: 'HD5',
    xxl: 'HD4',
};

export const Loading = (props: LoadingProps): React.ReactElement =>
{
    const { className, fullscreen, spinnerSize, text, direction = 'column', overlay } = props;

    const classNames = clsx('loading', overlay && 'loading--overlay', className);
    const size = !spinnerSize ? (fullscreen ? 'xl' : 'md') : spinnerSize;
    const Wrapper = direction === 'column' ? Col2 : Row2;

    const Inner = () => (
        <Wrapper
            className={fullscreen ? '' : classNames}
            height="full"
            justify="center"
            items="center"
            gap={direction === 'row' ? 2 : undefined}
        >
            <Spinner size={size} />
            {text && <Typography variant={MAPPED_TEXT_SIZE[size]}>{text}</Typography>}
        </Wrapper>
    );

    return (
        <ConditionalWrapper
            condition={fullscreen}
            wrapper={(children) => (
                <Overlay
                    className={classNames}
                    fullscreen
                >{children}
                </Overlay>
            )}
        >
            <Inner />
        </ConditionalWrapper>
    );
};
