import React, { useLayoutEffect, useEffect, useState } from 'react';

import { IPopOverPositionSize, IPopOverStyle } from '../model/usePopOverOptionType';
import { Placement } from '../model/overlayType';

type HookParams = {
    /**
     * The html wrapped element to detect wrapped element size.
     */
    wrappedElement: HTMLElement | null
    /**
     * The html anchor element for calculate where wrapped element should locale.
     */
    anchorElement?: HTMLElement | null
    /**
     * The coordinate point (x,y) for wrapped element locate
     *
     * @example anchorPosition = {x: 50, y: 50}
     */
    anchorPosition?: IPopOverPositionSize
     /**
     * Assure dynamic wrappedElement position will be re-calculate when their size change (width, heigh) (exp: AdvanceSelect with search mode enabled).
     *
     * @example anchorPosition = {x: 50, y: 50}
     */
    dynamicContent?: boolean
    /**
     * Define how wrapped element should render. Format: '${direction}-${alignment}`
     *
     * {@link https://ant.design/components/popover/#header Ant-design's popover placement system}.
     * @default bottom-left
     */
    placement?: Placement
}

interface HookReturn
{
    overlayMainStyle: Pick<React.CSSProperties, 'bottom' | 'top' | 'left'>
    scrollBarStyle: Pick<React.CSSProperties, 'maxHeight'> | null
}

type Hook = (args: HookParams) => HookReturn

interface Complement
{
    complementX: number
    complementY: number
}

type Direction = Extract<Placement, 'top' | 'bottom' | 'left' | 'right'>
type OutOfScreen = {vertical: boolean, horizontal: boolean}

/**
 * Hook to calculate AnchorOverlay's wrapped element position.
 *
 * Placement system is base on ant-design popover: {@link https://ant.design/components/popover/#header Ant-design's popover placement system}.
 * Supported feature:
 * - Automatically flip wrapped element in out of screen cases.
 * - Automatically align wrapped element if wrapped element's height is longer than anchor coordinate and related screen's border distance.
 * - Automatically add scroll-bar (vertically) when wrapped element's height is longer than view-port's height (vertical alignment case).
 * - Automatically add scroll-bar (vertically) when wrapped element's height is longer than the longest distance between anchor coordinate and screen's border (vertical direction case).

 * @example
 * const { overlayMainStyle, scrollBarStyle } = useAnchorHandle({ wrappedElement, anchorElement, anchorPosition, placement });
 * @returns overlayMainStyle and scrollbarStyle
 */
export const useAnchorHandle: Hook = (params) =>
{
    const { anchorElement, wrappedElement, anchorPosition, dynamicContent, placement = 'bottom-left' } = params;

    const [overlayStyle, setOverlayStyle] = useState<React.CSSProperties>({});
    const [scrollBarStyle, setScrollBarStyle] = useState<React.CSSProperties | null>(null);
    const [observerSize, setObserverSize] = useState({ width: 0, height: 0 });

    useEffect(() =>
    {
        if (!dynamicContent || !wrappedElement)
        {
            return;
        }
        
        const resizeObserver = new ResizeObserver((entries) =>
        {
            for (const entry of entries)
            {
                if (entry.contentRect)
                {
                    setObserverSize({ width: entry.contentRect.width, height: entry.contentRect.height });
                }
            }
        });
        resizeObserver.observe(wrappedElement);
        return () => resizeObserver.unobserve(wrappedElement);
    }, [wrappedElement, dynamicContent]);

    useLayoutEffect(() =>
    {
        if (!wrappedElement)
        {
            return setOverlayStyle({});
        }

        const anchorCoordinate = getAnchorCoordinate(anchorPosition, anchorElement);
        const wrappedElementCoordinate = getWrappedElementCoordinateByPlacement(wrappedElement, anchorCoordinate, placement);

        const suitablePlacement = getSuitablePlacementByCoordinate(placement, wrappedElement, wrappedElementCoordinate);
        // Automatically flip wrapped element in out of screen cases.
        const suitableCoordinate = getWrappedElementCoordinateByPlacement(wrappedElement, anchorCoordinate, suitablePlacement);

        // Automatically attach wrapped element (horizontally) to nearest screen border (of flipped placement) if original & flipped placement out of screen.
        const isStillOutOfScreen = checkOutOfScreen(wrappedElement, suitableCoordinate);
        const adjustments: React.CSSProperties = {};
        if (isStillOutOfScreen?.horizontal)
        {
            const { left } = suitableCoordinate;
            const horizontalAttach = !!left && (left < 0 && 'left' || left + wrappedElement.offsetWidth > window.innerWidth && 'right');
            wrappedElement.setAttribute('data-placement', suitablePlacement);
            if (horizontalAttach)
            {
                adjustments[horizontalAttach] = 0;
                adjustments[flipItem(horizontalAttach)] = undefined; // Remove opposite property
            }
        }

        // Automatically attach wrapped element (vertically) to nearest screen border if wrapped element's height is longer than anchor coordinate and related screen's border distance.
        // Automatically add scroll-bar (vertically) when wrapped element's height is longer than view-port's height (vertical alignment case).
        const VERTICAL_ALIGNMENT_CASES: Placement[] = ['left-top', 'left-bottom', 'right-top', 'right-bottom', 'left', 'right'];
        if (VERTICAL_ALIGNMENT_CASES.includes(placement) && checkOutOfScreen(wrappedElement, wrappedElementCoordinate))
        {
            const { horizontal } = checkOutOfScreen(wrappedElement, wrappedElementCoordinate) as OutOfScreen;
            const { left, top } = !horizontal ? wrappedElementCoordinate : getWrappedElementCoordinateByPlacement(wrappedElement, anchorCoordinate, suitablePlacement);

            const verticalAttach = !!top && (top < 0 && 'top' || top + wrappedElement.offsetHeight > window.innerHeight && 'bottom');
            if (verticalAttach)
            {
                setScrollBarStyle({ maxHeight: window.innerHeight });
                setOverlayStyle(prev => ({ ...prev, left, [`${verticalAttach}`]: 0 , maxHeight: '100%', ...adjustments }));
                return;
            }
        }

        // Automatically add scroll-bar (vertically) when wrapped element's height is longer than
        // the longest distance between anchor coordinate and screen's border (vertical direction case).
        const HORIZONTAL_DIRECTION_CASES: Placement[] = ['top-left', 'top', 'top-right', 'bottom-left', 'bottom', 'bottom-right'];
        if (HORIZONTAL_DIRECTION_CASES.includes(suitablePlacement) && getPlacementDirection(suitablePlacement) !== getPlacementDirection(placement))
        {
            const { detectedPlacement, maxHeight } = compareVerticalViewPortDistance(anchorCoordinate, suitablePlacement);
            const [detectedDirection] = detectedPlacement.split('-');
            const detectedCoordinate = getWrappedElementCoordinateByPlacement(wrappedElement, anchorCoordinate, detectedPlacement);
            const isOutOfScreen = checkOutOfScreen(wrappedElement, detectedCoordinate);

            if (isOutOfScreen?.vertical)
            {
                setOverlayStyle(prev => ({ ...prev, ...detectedCoordinate, maxHeight, [`${detectedDirection}`]: 0, ...adjustments }));
                setScrollBarStyle({ maxHeight });
                return;
            }
        }

        if (suitablePlacement === placement)
        {
            setOverlayStyle(prev => ({ ...prev, ...wrappedElementCoordinate, ...adjustments }));
            return;
        }

        setOverlayStyle(prev => ({ ...prev, ...suitableCoordinate, ...adjustments }));
    }, [wrappedElement, anchorElement, anchorPosition, placement, observerSize]);

    return { overlayMainStyle: overlayStyle, scrollBarStyle };
};

const getWrappedElementCoordinateByPlacement = (wrappedElement: HTMLElement | null, anchorCoordinate: IPopOverPositionSize, placement: Placement): IPopOverStyle =>
{
    const anchorCoordinateByPlacement = generateAnchorCoordinateByPlacement(anchorCoordinate, placement);
    const wrappedElementCoordinateByPlacement = generateCoordinateByWrappedElement(wrappedElement, placement, anchorCoordinateByPlacement);
    return wrappedElementCoordinateByPlacement;
};

const getSuitablePlacementByCoordinate = (placement: Placement, wrappedElement: HTMLElement | null, wrappedElementCoordinate: IPopOverStyle) =>
{
    const isOutOfScreen = checkOutOfScreen(wrappedElement, wrappedElementCoordinate);
    const suitablePlacement = detectSuitablePlacement(placement, isOutOfScreen);
    return suitablePlacement;
};

const getPlacementDirection = (placement: Placement) =>
{
    const [direction] = placement.split('-');
    return direction as Direction;
};

const generateAnchorCoordinateByPlacement = (anchorCoordinate: IPopOverPositionSize, placement: Placement) =>
{
    const { x, y = 0, width, height } = anchorCoordinate;
    const { complementX, complementY } = placementCalculator({ placement, width, height });
    return { ...(isDefined(x) && { left: x + complementX }), ...(isDefined(y) && { top: y + complementY }) };
};

const generateCoordinateByWrappedElement = (wrappedElement: HTMLElement | null, placement: Placement, anchorCoordinate: IPopOverStyle) =>
{
    if (!wrappedElement)
    {
        return anchorCoordinate;
    }
    const [direction, alignment] = placement.split('-') as [Direction, Direction | undefined];
    const { width, height } = wrappedElement.getBoundingClientRect();

    const complementX = !alignment && (['bottom', 'top'].includes(direction)) ? -(width / 2) : direction === 'left' || alignment === 'right' ? -width : 0;
    const complementY = !alignment && (['left', 'right'].includes(direction)) ? -(height / 2) : direction === 'top' || alignment === 'bottom' ? -height : 0;
    return {
        ...(isDefined(anchorCoordinate.left) && { left: anchorCoordinate.left + complementX }),
        ...(isDefined(anchorCoordinate.top) && { top: anchorCoordinate.top + complementY }),
    };
};

const checkOutOfScreen = (wrappedElement: HTMLElement | null, wrappedElementCoordinate: IPopOverStyle): OutOfScreen | undefined =>
{
    const { left = 0, top = 0 } = wrappedElementCoordinate;
    const { height, width } = wrappedElement?.getBoundingClientRect() ?? {};
    const isOutOfScreenHorizontal = left + (width ?? 0) > window.innerWidth || left < 0;
    const isOutOfScreenVertical = top + (height ?? 0) > window.innerHeight || top < 0;
    if (!isOutOfScreenVertical && !isOutOfScreenHorizontal)
    {
        return;
    }
    return { vertical: isOutOfScreenVertical, horizontal: isOutOfScreenHorizontal };
};

const isDefined = <T>(value: T | undefined): value is T => typeof value !== 'undefined';

const detectSuitablePlacement = (placement: Placement, isOutOfScreen: OutOfScreen | undefined): Placement =>
{
    if (!isOutOfScreen)
    {
        return placement;
    }
    const HORIZONTAL_DIR: Direction[] = ['left', 'right'];
    const VERTICAL_DIR: Direction[] = ['top', 'bottom'];
    const [direction, alignment] = placement.split('-') as [Direction, Direction | undefined];

    const flippedDirection = (isOutOfScreen.horizontal && HORIZONTAL_DIR.includes(direction)) ||
        (isOutOfScreen.vertical && VERTICAL_DIR.includes(direction))
        ? flipItem(direction)
        : direction;
    
    if (!alignment) {return flippedDirection;}

    const flippedAlignment = (isOutOfScreen.horizontal && HORIZONTAL_DIR.includes(alignment)) ||
        (isOutOfScreen.vertical && VERTICAL_DIR.includes(alignment))
        ? flipItem(alignment)
        : alignment;

    return `${flippedDirection}-${flippedAlignment}` as Placement;
};

const flipItem = (item: Direction): Direction =>
{
    const MAPPED_OPPOSITE_DIRECTION: Record<Direction, Direction> = {
        top: 'bottom',
        bottom: 'top',
        left: 'right',
        right: 'left',
    };
    return MAPPED_OPPOSITE_DIRECTION[item];
};

const getAnchorCoordinate = (anchorPosition?: IPopOverPositionSize, anchorEl?: HTMLElement | null) => anchorEl?.getBoundingClientRect() ?? anchorPosition ?? {};

type PlacementCalculator = (params: {placement: Placement, width?: number, height?: number}) => Complement
const placementCalculator: PlacementCalculator = (params) =>
{
    const { placement, width = 0, height = 0 } = params;
    const MAPPED_COMPLEMENT: Record<Placement, Complement> = {
        'bottom-left': { complementX: 0, complementY: height },
        'bottom': { complementX: width / 2, complementY: height },
        'bottom-right': { complementX: width, complementY: height },
        'top-left': { complementX: 0, complementY: 0 },
        'top': { complementX: width / 2, complementY: 0 },
        'top-right': { complementX: width, complementY: 0 },
        'left-top': { complementX: 0, complementY: 0 },
        'left': { complementX: 0, complementY: height / 2 },
        'left-bottom': { complementX: 0, complementY: height },
        'right-top': { complementX: width, complementY: 0 },
        'right': { complementX: width, complementY: height / 2 },
        'right-bottom': { complementX: width, complementY: height },
    };
    return MAPPED_COMPLEMENT[placement];
};

type CompareVerticalViewPortDistance = (anchorCoordinate: IPopOverPositionSize, placement: Placement) => {detectedPlacement: Placement, maxHeight: number}
const compareVerticalViewPortDistance: CompareVerticalViewPortDistance = (anchorCoordinate, placement) =>
{
    const { y: topDistance = 0, height = 0 } = anchorCoordinate;
    const bottomDistance = window.innerHeight - (topDistance + height);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, alignment] = placement.split('-') as [Direction, Exclude<Direction, 'top' | 'bottom'> | undefined];
    const isBottomLonger = bottomDistance > topDistance;
    const newDirection = isBottomLonger ? 'bottom' : 'top';
    const newPlacement = !alignment ? newDirection : [newDirection, alignment].join('-');
    const maxHeight = isBottomLonger ? bottomDistance : topDistance;
    return { detectedPlacement: newPlacement as Placement, maxHeight };
};
