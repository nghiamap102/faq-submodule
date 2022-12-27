import './LayerSwitcherItem.scss';

import unknownImage from 'images/ic-default.svg';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { AuthHelper } from 'helper/auth.helper';

import { Container, CheckBox, T, Image } from '@vbd/vui';
import { FAIcon } from '@vbd/vicon';

import { AppConstant } from 'constant/app-constant';

export class LayerSwitcherItem extends Component
{
    state = { isExpand: false };

    componentDidMount = () =>
    {
        this.setState({
            isExpand: this.props.data.expanded,
        });
    };

    toggleExpand = () =>
    {
        this.state.isExpand ? this.props.onCollapse(this.props.data) : this.props.onExpand(this.props.data);
        this.setState({ isExpand: !this.state.isExpand });
    };

    handleChecked = () =>
    {
        const nextValue = this.props.data.checkingType === 1 ? 0 : 1;
        this.props.onChange({ data: this.props.data, value: nextValue, type: 0 });
    };

    handleChildChecked = (event) =>
    {
        this.props.onChange({ data: event.data, value: event.value, type: 1 });
    };

    iconColor = (layer) =>
    {
        let color = '';

        switch (layer.jobStatus)
        {
            case 1:
                color = 'greenyellow';
                break;
            case 2:
                color = 'yellow';
                break;
            case 4:
                color = 'darkgray';
                break;
            default:
        }

        // switch (layer.empType)
        // {
        //     case 1:
        //         color = 'red';
        //         break;
        //     case 2:
        //         color = 'green';
        //         break;
        //     case 4:
        //         color = 'blue';
        //         break;
        //     default:
        // }

        return color;
    };

    renderLayerIcon = (layer) =>
    {
        if (layer.iconName)
        {
            return (
                <FAIcon
                    type={'duotone'}
                    icon={layer.iconName}
                    color={layer.iconColor || this.iconColor(layer)}
                    size={'1.2rem'}
                />
            );
        }

        let iconPath = layer.iconPath;
        if (iconPath)
        {
            iconPath += `&access_token=${AuthHelper.getVDMSToken()}`;
        }
        else if (layer.Name)
        {
            iconPath = `${AppConstant.vdms.url}/app/render/GetLayerIcon.ashx?LayerName=${layer.Name.toUpperCase()}&access_token=${AuthHelper.getVDMSToken()}`;
        }

        return (
            <Image
                width={'20px'}
                height={'20px'}
                className={'img-layer'}
                canEnlarge={false}
                src={iconPath}
                altSrc={unknownImage}
            />
        );
    };

    render()
    {
        const layerChild = [];
        const disableAll = this.props.disableAll || false;

        if (Array.isArray(this.props.data.childes) && this.props.data.childes.length > 0)
        {
            for (const c of this.props.data.childes)
            {
                layerChild.push(
                    <LayerSwitcherItem
                        data={c}
                        key={c.Id}
                        onChange={this.handleChildChecked}
                        onExpand={this.props.onExpand}
                        disableAll={disableAll}
                        onCollapse={this.props.onCollapse}
                    />,
                );
            }
        }

        return (
            <Container className='lwi-ic'>
                <Container className='lwi-main'>
                    <Container className='lwi-expander'>
                        {
                            this.props.data.Type === 'folder' &&
                            (
                                <Container>
                                    {
                                        this.state.isExpand ?
                                            <FAIcon
                                                icon='angle-down'
                                                type='regular'
                                                size='16px'
                                                color='var(--gray)'
                                                onClick={this.toggleExpand}
                                            /> :
                                            <FAIcon
                                                icon='angle-right'
                                                type='regular'
                                                size='16px'
                                                color='var(--gray)'
                                                onClick={this.toggleExpand}
                                            />
                                    }
                                </Container>
                            )
                        }
                    </Container>

                    <Container className='lwi-checker'>
                        {
                            this.props.data.checkingType === 0 &&
                            <CheckBox onChange={this.handleChecked} disabled={disableAll}/>
                        }
                        {
                            this.props.data.checkingType === 1 &&
                            <CheckBox
                                checked
                                onChange={this.handleChecked}
                                disabled={disableAll}
                            />
                        }
                        {
                            this.props.data.checkingType === 2 &&
                            <CheckBox
                                checked
                                indeterminate
                                onChange={this.handleChecked}
                                disabled={disableAll}
                            />
                        }
                    </Container>
                    {
                        this.renderLayerIcon(this.props.data)
                    }
                    <Container
                        className='lwi-title'
                        onClick={this.handleChecked}
                    >
                        <T>{this.props.data.Title}</T>
                    </Container>

                </Container>

                {
                    this.state.isExpand && <Container className='lwi-children'>
                        {layerChild}
                    </Container>
                }
            </Container>
        );
    }
}

LayerSwitcherItem.propTypes = {
    className: PropTypes.string,
    data: PropTypes.object,
    onChange: PropTypes.func,
    onExpand: PropTypes.func,
    onCollapse: PropTypes.func,
    disableAll: PropTypes.bool,
};

LayerSwitcherItem.defaultProps = {
    className: '',
    data: {},
    onChange: () =>
    {

    },
    onExpand: () =>
    {

    },
    onCollapse: () =>
    {

    },
};

LayerSwitcherItem = inject('appStore')(observer(LayerSwitcherItem));
