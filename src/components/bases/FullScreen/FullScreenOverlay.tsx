import { useContext, useEffect, useState } from 'react';

import { Overlay } from 'components/bases/Modal';

import { FullScreenContext, FullScreenOverlayContext } from './FullScreenContext';

import './FullScreen.scss';

export const FullScreenOverlay: React.FC = ({ children }) =>
{
    const [isFullScreen, setIsFullScreen] = useState(false);
    const { isFullScreen: isAppFullScreen, toggleFullScreen: appToggleFullScreen } = useContext(FullScreenContext);

    useEffect(() =>
    {
        !isAppFullScreen && isFullScreen && setIsFullScreen(isAppFullScreen);
        if (!isAppFullScreen && isFullScreen)
        {
            setIsFullScreen(isAppFullScreen);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAppFullScreen]);

    const toggleFullScreen = () =>
    {
        appToggleFullScreen();
        setIsFullScreen(!isFullScreen);
    };

    return (
        <FullScreenOverlayContext.Provider value={{ isFullScreen, toggleFullScreen }}>
            {
                isFullScreen
                    ? (
                            <Overlay
                                key='Overlay'
                                fullscreen
                            >
                                {children}
                            </Overlay>
                        )
                    : children
            }
        </FullScreenOverlayContext.Provider>
    );
};
