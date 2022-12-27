import './AvatarInfo.scss';
import unknownFace from 'images/faceImage/unknown-face.jpg';

import React, { Component } from 'react';

import {
    Container, Row, Column,
    Sub1, Sub2,
} from '@vbd/vui';
import { FAIcon } from '@vbd/vicon';

import { FileImage } from 'extends/ffms/pages/base/File/FileImage';

export class AvatarInfo extends Component
{
    render()
    {
        const { employee_full_name, employee_email, employee_username, employee_image } = this.props.data;
        return (
            <Column
                className={'ai-container'}
                crossAxisAlignment={'center'}
            >
                <Container
                    className={'ai-image-container'}
                >
                    <FileImage
                        className={'ai-photo'}
                        altSrc={unknownFace}
                        info={employee_image}
                    />
                </Container>
                <Sub1 className={'sub sub1 ellipsis'}>{employee_full_name}</Sub1>
                <Sub2>{employee_username}</Sub2>
                <Row
                    mainAxisAlignment={'center'}
                    crossAxisAlignment={'center'}
                    itemMargin={'sm'}
                >
                    <FAIcon
                        icon={'envelope'}
                        size={'1rem'}
                    />
                    <Sub2>{employee_email}</Sub2>
                </Row>
            </Column>
        );
    }
}


export default AvatarInfo;
