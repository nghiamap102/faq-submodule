import './FeatureText.scss';
import React from 'react';
export declare type FeatureTextProps = {
    id?: string;
    className?: string;
    content?: string;
    active?: boolean;
    badgeCount?: number;
    title?: string;
    onClick?: (props: FeatureTextProps, event: React.MouseEvent<HTMLElement>) => void;
};
export declare const FeatureText: React.FC<FeatureTextProps>;
//# sourceMappingURL=FeatureText.d.ts.map