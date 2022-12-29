import './ImageInput.scss';

import React, { useEffect, useRef, useState } from 'react';

import ProfileImage from 'images/profile.png';

// import { FormControlLabel, InputGroup, InputAppend } from 'components/bases/Form';
import { FormControlLabel } from 'components/bases/Form/FormControlLabel';
import { InputGroup } from 'components/bases/Form/InputGroup/InputGroup';
import { InputAppend } from 'components/bases/Form/InputGroup/InputAppend';
import { Image } from 'components/bases/Image/Image';
import { Row2 } from 'components/bases/Layout';
import { Button, EmptyButton } from 'components/bases/Button';
import { ImageReader } from 'components/bases/Image/ImageReader';

import { Input } from './Input';

export type ImageInputProps = {
    value?: string;
    imageSrc?: string;
    onChange?: (file: File | null, image: string, orientation: number, width: number, height: number) => void;
    label?: string;
}

const imageReader = ImageReader();

export const ImageInput: React.FC<ImageInputProps> = (props) =>
{
    const { value, onChange, label, imageSrc } = props;

    const inputRef = useRef<HTMLInputElement>(null);

    const [imagePath, setImagePath] = useState(value);
    const [imageData, setImageData] = useState(imageSrc);

    useEffect(() =>
    {
        setImagePath(value);
        setImageData(imageSrc);
    }, [value, imageSrc]);

    const handleRemove = () =>
    {
        if (inputRef.current)
        {
            inputRef.current.value = '';
        }

        handleChange();
    };

    const handleChange = async () =>
    {
        const files = inputRef.current?.files;

        if (files && files[0])
        {
            const { image, width, height, orientation } = await imageReader.read(files[0]);

            setImageData(image);
            setImagePath(files[0].name);

            onChange && onChange(files[0], image, orientation, width, height);
        }
        else
        {
            setImageData('');
            setImagePath('');

            onChange && onChange(null, '', 1, 0, 0);
        }
    };

    return (
        <>
            <FormControlLabel
                label={label}
                control={(
                    <InputGroup>
                        <Input
                            placeholder={'Chọn 1 ảnh...'}
                            value={imagePath}
                            disabled
                        />

                        <InputAppend>
                            <Row2>
                                <EmptyButton
                                    icon={'trash-alt'}
                                    size="sm"
                                    onlyIcon
                                    onClick={handleRemove}
                                />
                                <Button
                                    icon={'upload'}
                                    size="sm"
                                    onlyIcon
                                    onClick={(e) => inputRef?.current?.click()}
                                />
                            </Row2>
                        </InputAppend>
                    </InputGroup>
                )}
            />

            <Input
                ref={inputRef}
                className={'hide'}
                type={'file'}
                accept={'image/png, image/jpeg'}
                onChange={handleChange}
            />

            <Image
                width={'18rem'}
                height={'18rem'}
                className={'face-reg-img'}
                fitMode={'contain'}
                background={'#303030'}
                src={imageData || ProfileImage}
                canEnlarge
            />
        </>
    );
};
