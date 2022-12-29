import { CSSProperties } from 'react';
import { BorderProperty, SpacingProperty, SizingProperty, PositionProperty, TypographyProperty, BackgroundProperty, OpacityProperty } from '../types';
export declare type SxSelector = {
    [key: string]: SxHasNotSelector;
};
export declare type SxHasNotSelector = BorderProperty & SpacingProperty & SizingProperty & PositionProperty & TypographyProperty & BackgroundProperty & OpacityProperty;
export declare type Sx = SxHasNotSelector | SxSelector;
export declare type SxFamiliarProps = typeof borderKeys | typeof spacingOutsideBoxKeys | typeof spacingInsideBoxKeys | typeof sizingKeys | typeof positionKeys | typeof textKeys | typeof backgroundKeys | typeof opacityKeys;
export declare const borderWidth: readonly ["border", "borderTop", "borderRight", "borderBottom", "borderLeft"];
export declare const borderRadius: readonly ["borderRadius", "borderTopRadius", "borderRightRadius", "borderBottomRadius", "borderLeftRadius", "borderTopLeftRadius", "borderTopRightRadius", "borderBottomRightRadius", "borderBottomLeftRadius"];
export declare const borderKeys: readonly ["border", "borderTop", "borderRight", "borderBottom", "borderLeft", "borderRadius", "borderTopRadius", "borderRightRadius", "borderBottomRadius", "borderLeftRadius", "borderTopLeftRadius", "borderTopRightRadius", "borderBottomRightRadius", "borderBottomLeftRadius", "borderColor", "borderOpacity"];
export declare const spacingOutsideBoxKeys: readonly ["m", "mx", "my", "mt", "mr", "mb", "ml"];
export declare const spaceBetweenReverse: readonly ["spaceBetweenXReverse", "spaceBetweenYReverse"];
export declare const spacingInsideBoxKeys: readonly ["p", "px", "py", "pt", "pr", "pb", "pl", "spaceBetweenX", "spaceBetweenY", "spaceBetweenXReverse", "spaceBetweenYReverse"];
export declare const spacingKeys: ("p" | "px" | "mx" | "my" | "spaceBetweenXReverse" | "spaceBetweenYReverse" | "spaceBetweenX" | "spaceBetweenY" | "m" | "mt" | "mr" | "mb" | "ml" | "py" | "pt" | "pr" | "pb" | "pl")[];
export declare const sizingKeys: readonly ["width", "minWidth", "maxWidth", "height", "minHeight", "maxHeight"];
export declare const positions: readonly ["inset", "insetX", "insetY", "top", "right", "bottom", "left"];
export declare const positionKeys: readonly ["position", "inset", "insetX", "insetY", "top", "right", "bottom", "left"];
export declare const textKeys: readonly ["color", "fontSize", "fontStyle", "fontWeight", "textOpacity", "textAlign", "textDecoration", "textTransform", "textOverflow", "textTruncate", "lineHeight", "letterSpacing", "verticalAlign", "whiteSpace", "workBreak", "listStyleType", "listStylePosition"];
export declare const backgroundKeys: readonly ["bgColor", "bgOpacity"];
export declare const opacityKeys: readonly ["opacity"];
declare type UseSx = (sx?: Sx) => {
    sxClass?: string;
    sxOutsideBoxClass?: string;
    sxInsideBoxClass?: string;
    jssOutsideBoxStyled?: CSSProperties;
    jssInsideBoxStyled?: CSSProperties;
    jssStyled?: CSSProperties;
};
/**
 * Convert `sx` system to an object of class names and object styles.
 * @param sx sx prop - Define custom style and responsive.
 * @returns Collection of class names and CSSProperties.
 */
export declare const useSx: UseSx;
export {};
//# sourceMappingURL=useSx.d.ts.map