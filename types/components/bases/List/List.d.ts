import React from 'react';
import './ListItem.scss';
declare type IconType = 'solid' | 'regular' | 'light';
declare type IconPosition = 'top' | 'middle' | 'bottom';
export declare type ListItemProps = {
    className?: string;
    active?: boolean;
    isImportant?: boolean;
    iconUrl?: string;
    iconClass?: string;
    iconColor?: string;
    iconType?: IconType;
    iconTypeSvg?: boolean;
    icon?: React.ReactNode;
    label?: React.ReactNode;
    sub?: React.ReactNode;
    disableSelection?: boolean;
    splitter?: boolean;
    iconPosition?: IconPosition;
    trailing?: React.ReactNode;
    onClick?: () => void;
    direction?: 'row' | 'column';
};
export declare const ListItem: (props: ListItemProps) => JSX.Element;
export {};
//# sourceMappingURL=List.d.ts.map