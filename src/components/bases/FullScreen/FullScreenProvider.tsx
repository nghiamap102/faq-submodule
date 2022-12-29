import { useRef } from 'react';
import { FullScreen, FullScreenHandle, useFullScreenHandle } from 'react-full-screen';

import { FullScreenContext } from './FullScreenContext';

import './FullScreen.scss';

export const FullScreenProvider: React.FC = ({ children }) =>
{
    const fullScreenRef = useRef<HTMLElement | null>(null);
    const handleFullScreen = useFullScreenHandle();
    const isFullScreen = handleFullScreen?.active;

    const toggleFullScreen = () => isFullScreen ? handleFullScreen.exit() : handleFullScreen.enter();

    const handleChange = (state: boolean, handle: FullScreenHandle) =>
    {
        if (!state && fullScreenRef.current)
        {
            fullScreenRef.current.className = fullScreenRef.current.className.replace(' fullscreen-apply', '');
        }
    };

    return (
        <FullScreenContext.Provider value={{ toggleFullScreen, isFullScreen }}>
            <FullScreen
                handle={handleFullScreen}
                onChange={handleChange}
            >
                {children}
            </FullScreen>
        </FullScreenContext.Provider>
    );
};
