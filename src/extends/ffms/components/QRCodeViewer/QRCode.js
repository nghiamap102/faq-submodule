import './QRCodeViewer.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import QrCode from 'qrcode';

import { Column, Button, Image } from '@vbd/vui';

export class QRCode extends Component
{
    state = {
        data: null,
    }

    async componentDidMount()
    {
        const data = await QrCode.toDataURL(this.props.text, { errorCorrectionLevel: this.props.errorCorrectionLevel });
        if (data)
        {
            this.setState({
                data,
            });
        }
    }
    
    handleDownloadCode = () =>
    {
        var a = document.createElement('a');
        a.href = this.state.data;
        a.download = 'qr-code.png';
        a.click();
    }

    render()
    {
        return (
            <Column
                // className={'flex-fix'}
                crossAxisAlignment={'center'}
                crossAxisSize={'max'}
                itemMargin={'md'}
            >
                { this.state.data && (
                    <Image
                        width="100%"
                        src={this.state.data}
                    />
                )
                }
                {this.props.downloadable && (
                    <Button
                        className="full-width"
                        color={'primary-color'}
                        icon={'save'}
                        iconSize={'1rem'}
                        text={'Tải mã QR về máy'}
                        onClick={this.handleDownloadCode}
                    />
                )}
            </Column>
        );
    }
}

QRCode.propTypes = {
    downloadable: PropTypes.bool,
    errorCorrectionLevel: PropTypes.string,
    text: PropTypes.string,
};
