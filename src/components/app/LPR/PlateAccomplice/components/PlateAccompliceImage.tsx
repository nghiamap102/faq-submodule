import { useState, useRef } from 'react';

import ProfileImage from 'images/profile.png';

import { ImageReader, Image, Button, Container, Input, FormControlLabel, InputGroup, InputAppend, FormGroup } from '@vbd/vui';

interface PlateAccompliceImageProps {
    onImageChange: (file: File, orientation: number) => void;
    required?: boolean
}

const imageReader = ImageReader();

export function PlateAccompliceImage(props: PlateAccompliceImageProps)
{

    const [imageName, setImageName] = useState('');
    const [image, setImage] = useState(ProfileImage);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = async () =>
    {
        const file = imageInputRef.current?.files?.[0];
        if (!file)
        {
            return;
        }
        const { image, orientation } = await imageReader.read(file);
        setImage(image);
        setImageName(file.name);
        props.onImageChange(file, orientation);
    };
    return (
        <FormGroup>
            <FormControlLabel
                label={'Tải ảnh'}
                required={props.required}
                control={(
                    <InputGroup>
                        <Input
                            placeholder={'Chọn 1 ảnh...'}
                            value={imageName}
                            disabled
                        />

                        <InputAppend>
                            <Button
                                icon={'upload'}
                                size='sm'
                                onlyIcon
                                onClick={(e) =>
                                {
                                    e.preventDefault();
                                    imageInputRef?.current?.click();
                                }}
                            />
                        </InputAppend>
                    </InputGroup>
                )}
            />
            <Input
                ref={imageInputRef}
                className={'hide'}
                type={'file'}
                accept={'image/png, image/jpeg'}
                onChange={handleImageChange}
            />

            <Container className={'face-reg-img'}>
                <Image
                    width={'18rem'}
                    height={'18rem'}
                    fitMode={'contain'}
                    background={'#303030'}
                    src={image}
                    canEnlarge
                />
            </Container>
        </FormGroup>
    );
}
