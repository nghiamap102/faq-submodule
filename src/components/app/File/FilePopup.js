import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Popup, Image, Container, TB1, Link, Iframe, T } from '@vbd/vui';

export class FilePopup extends Component
{
    renderNotFind = () =>
    {
        const { url } = this.props;

        return (
            <Container>
                <TB1>
                    <T>Không thể xem trực tiếp trên trình duyệt.</T>
                    <T>Vui lòng bấm vào </T><Link href={url} target={'_blank'}><T>đây</T></Link> <T>để tải xuống</T>.
                </TB1>
            </Container>
        );
    };

    renderImage = () =>
    {
        const { url } = this.props;

        return (
            <Image
                src={url}
                fitMode={'contain'}
                width={'100%'}
                height={'100%'}
            />
        );
    };

    renderIframe = () =>
    {
        const { url } = this.props;

        return (
            <Iframe
                width={'100%'}
                height={'100%'}
                src={url}
            />
        );
    };

    renderContent = () =>
    {
        const { mimeType } = this.props;


        if (!mimeType)
        {
            return this.renderNotFind();
        }
        else if (mimeType.includes('image'))
        {
            return this.renderImage();
        }
        else if (mimeType === 'application/pdf' ||
            mimeType.includes('text/') ||
            mimeType.includes('video/') ||
            mimeType === 'application/vnd.google-earth.kmz')
        {
            return this.renderIframe();
        }
        else
        {
            return this.renderNotFind();
        }
    };

    render()
    {
        const { title, onClose, id } = this.props;

        return (
            id && (
                <Popup
                    title={title}
                    onClose={onClose}
                    width={'70vw'}
                    height={'70vh'}
                    padding={'4px'}
                    className={'file-container'}
                >
                    {this.renderContent()}
                </Popup>
            )
        );
    }
}

FilePopup.propTypes = {
    onClose: PropTypes.func,
    title: PropTypes.string,
    url: PropTypes.string,
    mimeType: PropTypes.string,
    id: PropTypes.string,
};

FilePopup.defaultProps = {
    onClose: () =>
    {
    },
    title: '',
    url: '',
    mimeType: '',
    id: '',
};

