import { createContext } from 'react';

export type FullScreenContextProps = {
    toggleFullScreen: () => void;
    isFullScreen: boolean;
}

export const FullScreenContext = createContext<FullScreenContextProps>({
    toggleFullScreen: () => undefined,
    isFullScreen: false,
});

export const FullScreenOverlayContext = createContext<FullScreenContextProps>({
    toggleFullScreen: () => undefined,
    isFullScreen: false,
});
