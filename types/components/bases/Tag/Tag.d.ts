import './Tag.scss';
import React from 'react';
export declare type TagProps = {
    text?: React.ReactNode;
    onCloseClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    color?: string;
    size?: 'small' | 'medium' | 'large';
    textStyle?: React.CSSProperties;
    isRound?: boolean;
    textCase?: 'default' | 'title' | 'upper' | 'lower' | 'sentence';
    className?: string;
};
export declare const Tag: React.FC<TagProps>;
//# sourceMappingURL=Tag.d.ts.map