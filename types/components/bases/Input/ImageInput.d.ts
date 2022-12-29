import './ImageInput.scss';
import React from 'react';
export declare type ImageInputProps = {
    value?: string;
    imageSrc?: string;
    onChange?: (file: File | null, image: string, orientation: number, width: number, height: number) => void;
    label?: string;
};
export declare const ImageInput: React.FC<ImageInputProps>;
//# sourceMappingURL=ImageInput.d.ts.map