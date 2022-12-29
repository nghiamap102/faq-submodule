import { FunctionComponent } from 'react';
import { Meta, Story } from '@storybook/react';
import { FlexProps } from '../../../../components/bases/Layout';
import { PopOverProps } from '../PopOver';
import { Placement } from '../model/overlayType';
declare const _default: Meta<import("@storybook/react").Args>;
export default _default;
export declare const Basic: Story<PopOverProps>;
declare type CustomProps = {
    popupContent: string | FunctionComponent;
    popupWidth?: FlexProps['width'];
    popupHeight?: FlexProps['height'];
    placementList?: Placement[][];
};
export declare const CustomPlacement: Story<{
    anchorEl: import("react").MutableRefObject<HTMLDivElement | null>;
    displayRaw?: boolean | undefined;
} & Pick<import("..").OverlayProps, "className" | "backdrop" | "onBackgroundClick" | "onBackgroundMouseMove" | "width" | "height"> & Pick<import("..").AnchorOverlayProps, "placement" | "dynamicContent"> & CustomProps>;
export declare const AutoFlipBehavior: Story<{
    anchorEl: import("react").MutableRefObject<HTMLDivElement | null>;
    displayRaw?: boolean | undefined;
} & Pick<import("..").OverlayProps, "className" | "backdrop" | "onBackgroundClick" | "onBackgroundMouseMove" | "width" | "height"> & Pick<import("..").AnchorOverlayProps, "placement" | "dynamicContent"> & CustomProps>;
export declare const AutoAlignBehavior: Story<{
    anchorEl: import("react").MutableRefObject<HTMLDivElement | null>;
    displayRaw?: boolean | undefined;
} & Pick<import("..").OverlayProps, "className" | "backdrop" | "onBackgroundClick" | "onBackgroundMouseMove" | "width" | "height"> & Pick<import("..").AnchorOverlayProps, "placement" | "dynamicContent"> & CustomProps>;
export declare const AutoFitScreen: Story<{
    anchorEl: import("react").MutableRefObject<HTMLDivElement | null>;
    displayRaw?: boolean | undefined;
} & Pick<import("..").OverlayProps, "className" | "backdrop" | "onBackgroundClick" | "onBackgroundMouseMove" | "width" | "height"> & Pick<import("..").AnchorOverlayProps, "placement" | "dynamicContent"> & CustomProps>;
export declare const AutoFitSpace: Story<{
    anchorEl: import("react").MutableRefObject<HTMLDivElement | null>;
    displayRaw?: boolean | undefined;
} & Pick<import("..").OverlayProps, "className" | "backdrop" | "onBackgroundClick" | "onBackgroundMouseMove" | "width" | "height"> & Pick<import("..").AnchorOverlayProps, "placement" | "dynamicContent"> & CustomProps>;
export declare const HandleDynamicContent: Story<PopOverProps>;
//# sourceMappingURL=PopOver.stories.d.ts.map