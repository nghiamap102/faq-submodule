import './Spinner.scss';
import spinnerImage from 'images/loading.gif';

import React, { Component } from 'react';

import { Overlay } from 'components/bases/Modal/Overlay';
import { Image } from 'components/bases/Image/Image';

export class FullScreenSpinner extends Component
{
    render ()
    {
        return (
            <Overlay
                className={'spinner'}
                width={'100px'}
                height={'100px'}
                fullscreen
            >
                <Image
                    src={spinnerImage}
                    height={'100px'}
                    width={'100px'}
                />
            </Overlay>
        );
    }
}
