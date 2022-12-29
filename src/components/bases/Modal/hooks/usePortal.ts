import { useState, useRef, useLayoutEffect } from 'react';

import { UsePortal } from '../model/overlayType';

/**
 * Hook to create a React Portal.
 * Automatically handles creating and tearing-down the root elements (no SRR
 * makes this trivial), so there is no need to ensure the parent target already
 * exists.
 * @example
 * const target = usePortal(id, [id]);
 * return createPortal(children, target);
 * @param {String} id The id of the target container, e.g 'modal' or 'spotlight'
 * @returns {HTMLElement} The DOM node to use as the Portal target.
 */

const usePortal: UsePortal = (params) =>
{
    const { id } = params;

    const rootElemRef = useRef<HTMLDivElement | null>(null);

    const [isMounted, setMount] = useState(false);

    useLayoutEffect(() =>
    {
        // * ============= Setup element ==============
        // Look for existing target dom element to append to
        const existingParent = document.querySelector(`#${id}`) || document.getElementById('modal-root');
        // Parent is either a new root or the existing dom element
        const parentElem = existingParent || createRootElement(id) || 'modal-root';

        // If there is no existing DOM element, add a new one.
        !existingParent && addRootElement(parentElem);

        // Add the detached element to the parent
        rootElemRef.current && parentElem.appendChild(rootElemRef.current);

        setMount(true);

        return () =>
        {
            // * ============= Remove Element ==============
            rootElemRef.current?.remove();
            if (!parentElem.childElementCount)
            {
                parentElem.remove();
            }
        };
    }, [id]);

    /**
     * It's important we evaluate this lazily:
     * - We need first render to contain the DOM element, so it shouldn't happen
     *   in useEffect. We would normally put this in the constructor().
     * - We can't do 'const rootElemRef = useRef(document.createElement('div))',
     *   since this will run every single render (that's a lot).
     * - We want the ref to consistently point to the same DOM element and only
     *   ever run once.
     * @link https://reactjs.org/docs/hooks-faq.html#how-to-create-expensive-objects-lazily
     */

    const getRootElem = () =>
    {
        if (!rootElemRef.current)
        {
            rootElemRef.current = document.createElement('div');
        }
        return rootElemRef.current;
    };

    return {
        isMounted,
        target: getRootElem(),
    };
};

const createRootElement = (id?: string) =>
{
    const rootContainer = document.createElement('div');
    rootContainer.setAttribute('id', id || 'modal-root');
    return rootContainer;
};

/**
 * Appends element as last child of body.
 * @param {HTMLElement} rootElem
 */
const addRootElement = (rootElem: Element | HTMLDivElement) =>
{
    const appContainer = document.getElementById('appContainer');
    if (!appContainer)
    {
        return;
    }

    appContainer.appendChild(rootElem);
};

export default usePortal;
