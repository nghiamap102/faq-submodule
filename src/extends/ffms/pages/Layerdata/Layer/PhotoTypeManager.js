import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';

import { Container, Button } from '@vbd/vui';
import PhotoType from 'extends/ffms/pages/Layerdata/Layer/PhotoType';

export class PhotoTypeManager extends Component
{
    managerLayerStore = this.props.fieldForceStore.managerLayerStore;
    comSvc = this.props.fieldForceStore.comSvc;

    state = {
        saving: false,
        photoTypeData: null,
    };

    componentDidMount = () =>
    {
        const sorted = this.props.data.sort((a, b) =>
        {
            return (a.phototype_id > b.phototype_id) ? 1 : -1;
        });
        this.setState({
            photoTypeData: sorted,
        });
    };

    handleDataChange = (id, field, value) =>
    {
        const photoTypeData = this.state.photoTypeData;
        if (photoTypeData)
        {
            var foundIndex = photoTypeData.findIndex(x => x.phototype_id == id);
            if (foundIndex > -1)
            {
                photoTypeData[foundIndex][field] = value;
            }
        }
        this.setState({ photoTypeData });
    }

    handleSaveClick = async () =>
    {
        this.setState({ saving: true });

        await Promise.all(this.state.photoTypeData.map((data) =>
        {
            return this.comSvc.updateLayerDataByNodeId('PHOTO_TYPE', data.Id, data);
        }));

        this.setState({ saving: false });
    }

    render()
    {
        const photoTypeData = this.state.photoTypeData || [];
        return (
            <Container className={'layer-manager-content'}>
                {
                    photoTypeData && photoTypeData.length > 0 ?
                        <>
                            {
                                photoTypeData.map((item) =>
                                {
                                    return (
                                        <PhotoType
                                            key={item.Id}
                                            data={item}
                                            onChange={this.handleDataChange}
                                        />
                                    );
                                })
                            }

                            <Container className={'layer-manager-tool footer'}>
                                <Button
                                    color={'success'}
                                    icon={'save'}
                                    text={'Lưu thay đổi'}
                                    isLoading={this.state.saving}
                                    onClick={this.handleSaveClick}
                                />
                            </Container>
                        </> : null
                }
            </Container>
        );
    }
}


PhotoTypeManager = inject('appStore', 'fieldForceStore')(observer(PhotoTypeManager));
PhotoTypeManager = withRouter(PhotoTypeManager);
export default PhotoTypeManager;
