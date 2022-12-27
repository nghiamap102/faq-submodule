import PropTypes from 'prop-types';
import React, { Component } from 'react';

import {
    Container, TB1, Column, Popup, PanelBody,
} from '@vbd/vui';

import { QRCode } from 'extends/ffms/components/QRCodeViewer/QRCode';

export class QRCodeViewer extends Component
{
    render()
    {
        const { handleQRCodePopup } = this.props;

        return (
            <Popup
                title={'Thông tin website'}
                width={'18rem'}
                onClose={handleQRCodePopup}
                isShowContentOnly
            >
                <Container className={'qr-popup'}>
                    <PanelBody>
                        <Column>
                            <QRCode
                                text={this.props.text}
                                errorCorrectionLevel={'H'}
                                downloadable
                            />
                            <TB1 className='text-center'>Quét hoặc lưu mã QR này để truy cập trên thiết bị di động</TB1>
                        </Column>
                    </PanelBody>
                </Container>

            </Popup>
                    
        );
    }
}

QRCodeViewer.propTypes = {
    handleQRCodePopup: PropTypes.func,
    text: PropTypes.string,
};
