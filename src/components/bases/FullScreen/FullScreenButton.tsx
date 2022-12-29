import { useContext } from 'react';

import { IconButtonProps, IconButton } from 'components/bases/Button/Button';

import { FullScreenOverlayContext } from './FullScreenContext';

export type FullScreenButtonProps = IconButtonProps
export const FullScreenButton = (props: FullScreenButtonProps): JSX.Element =>
{
    const { isFullScreen, toggleFullScreen } = useContext(FullScreenOverlayContext);

    return (
        <IconButton
            {...props}
            variant='fill'
            icon={isFullScreen ? 'compress' : 'expand'}
            onClick={toggleFullScreen}
        />
    );
};

