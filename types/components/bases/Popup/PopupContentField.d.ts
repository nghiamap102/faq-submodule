import React from 'react';
import { Property } from 'csstype';
import './PopupContentField.scss';
export declare const ContainField: React.FC;
export declare type PopupFieldProps = {
    className?: string;
    layout?: 'horizontal' | 'vertical';
};
export declare const Field: React.FC<PopupFieldProps>;
export declare type PopupLabelProps = {
    width?: Property.Width;
};
export declare const Label: React.FC<PopupLabelProps>;
export declare type PopupInfoProps = {
    className?: string;
    color?: Property.Color;
};
export declare const Info: React.FC<PopupInfoProps>;
//# sourceMappingURL=PopupContentField.d.ts.map