import { useContext } from 'react';

import { ModalContext, ModalContextValue } from '../ModalContext';

export const useModal = (): ModalContextValue =>
{
    const modal = useContext(ModalContext);
    if (!modal)
    {
        throw new Error('useModal must be within ModalProvider');
    }
    return modal;
};
