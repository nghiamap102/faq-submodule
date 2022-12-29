import React from 'react';
import './Spinner.scss';
export declare type ISize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
export declare type SpinnerProps = {
    className?: string;
    color?: 'primary' | 'success' | 'info' | 'warning' | 'danger';
    size?: ISize;
};
export declare const Spinner: (props: SpinnerProps) => React.ReactElement;
//# sourceMappingURL=Spinner.d.ts.map