import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import { Container } from '@vbd/vui';

import { FilePopup } from 'components/app/File/FilePopup';

class FileManager extends Component
{
    popupStore = this.props.appStore.popupStore;

    render()
    {
        return (
            <Container>
                {this.popupStore?.imagePopup
                    ? (
                            <FilePopup
                                title={this.popupStore.imagePopup.Title}
                                url={this.popupStore.imagePopup.url}
                                mimeType={this.popupStore.imagePopup.MimeType.MimeType}
                                id={this.popupStore.imagePopup.Id}
                                onClose={this.popupStore.clearImagePopup}
                            />
                        )
                    : null
                }
            </Container>
        );
    }
}

FileManager = inject('appStore')(observer(FileManager));
export { FileManager };
