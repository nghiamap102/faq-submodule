import React from 'react';
import { IPopOverPositionSize } from '../model/usePopOverOptionType';
import { Placement } from '../model/overlayType';
declare type HookParams = {
    /**
     * The html wrapped element to detect wrapped element size.
     */
    wrappedElement: HTMLElement | null;
    /**
     * The html anchor element for calculate where wrapped element should locale.
     */
    anchorElement?: HTMLElement | null;
    /**
     * The coordinate point (x,y) for wrapped element locate
     *
     * @example anchorPosition = {x: 50, y: 50}
     */
    anchorPosition?: IPopOverPositionSize;
    /**
    * Assure dynamic wrappedElement position will be re-calculate when their size change (width, heigh) (exp: AdvanceSelect with search mode enabled).
    *
    * @example anchorPosition = {x: 50, y: 50}
    */
    dynamicContent?: boolean;
    /**
     * Define how wrapped element should render. Format: '${direction}-${alignment}`
     *
     * {@link https://ant.design/components/popover/#header Ant-design's popover placement system}.
     * @default bottom-left
     */
    placement?: Placement;
};
interface HookReturn {
    overlayMainStyle: Pick<React.CSSProperties, 'bottom' | 'top' | 'left'>;
    scrollBarStyle: Pick<React.CSSProperties, 'maxHeight'> | null;
}
declare type Hook = (args: HookParams) => HookReturn;
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
export declare const useAnchorHandle: Hook;
export {};
//# sourceMappingURL=useAnchorHandle.d.ts.map