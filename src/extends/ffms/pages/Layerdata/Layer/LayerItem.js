import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { Container, Spacer } from '@vbd/vui';
import { SVG } from '@vbd/vicon';

import LayerService from 'services/layer.service';
import { AuthHelper } from 'helper/auth.helper';
import { AppConstant } from 'constant/app-constant';

export class LayerItem extends Component
{
    layerSvc = new LayerService();

    handleClick = () =>
    {
        const { data, onSelect } = this.props;
        if (data)
        {
            onSelect(data);
        }
    };

    getIconUrl = (LayerName) =>
    {
        return `${AppConstant.vdms.url}/app/render/GetLayerIcon.ashx?LayerName=${LayerName}&access_token=${AuthHelper.getVDMSToken()}`;
    }

    render()
    {
        const { data } = this.props;
        const { highLightClass } = this.props;

        return (
            <Container
                className={`layer-tree-item ${highLightClass}`}
                crossAxisSize={'min'}
                onClick={this.handleClick}
            >
                {/* {
                    icon ? icon :
                        <Image
                            width={'20px'}
                            height={'20px'}
                            className={'img-layer'}
                            canEnlarge={false}
                            src={this.getIconUrl(data.LayerName)}
                            altSrc={unknownImage}
                        />
                } */}
                {/* <SVG name={`extends/ffms/pages/Layerdata/Layer/Icons/${data.LayerName.toLowerCase()}`} /> */}
                {/* TODO: fix this  */}
                {/* <SVG
                    className={'img-layer'}
                    name={`${data.LayerName.toLowerCase()}`}
                    width={'1.5rem'}
                    height={'1.5rem'}
                    fill={'rgba(var(--contrast-color-rgb), 0.5)'}
                /> */}

                {
                    data.Caption || data.LayerName
                }
                {
                    this.props.trailControl ? <Spacer /> : ''
                }
                {
                    this.props.trailControl ?? ''
                }
            </Container>
        );
    }
}

LayerItem.propTypes = {
    data: PropTypes.object,
    highLightClass: PropTypes.string,
    onSelect: PropTypes.func,
};

LayerItem.defaultProps = {
    data: {},
    highLightClass: '',
    onSelect: () =>
    {
    },
};

LayerItem = inject('appStore', 'fieldForceStore')(observer(LayerItem));
LayerItem = withRouter(LayerItem);
export default LayerItem;
