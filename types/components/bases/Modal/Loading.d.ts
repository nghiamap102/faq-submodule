import React from 'react';
import { ISize } from '../../../components/bases/Modal/Spinner';
import './Loading.scss';
export declare type LoadingProps = {
    className?: string;
    fullscreen?: boolean;
    spinnerSize?: ISize;
    text?: string;
    direction?: 'row' | 'column';
    overlay?: boolean;
};
export declare const Loading: (props: LoadingProps) => React.ReactElement;
//# sourceMappingURL=Loading.d.ts.map