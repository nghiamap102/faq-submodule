import React, { ComponentType } from 'react';

import { useModal } from './hooks/useModal';

export const withModal = <P extends Record<string, unknown>>(Component: ComponentType<P>) =>
{
    // eslint-disable-next-line react/display-name
    return (props: P): JSX.Element =>
    {
        const modal = useModal();
        return <Component {...{ ...modal, ...props }} />;
    };
};
