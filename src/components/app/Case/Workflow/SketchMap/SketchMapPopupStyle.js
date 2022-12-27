import './SketchMapPopupStyle.scss';

import FullLineImage from 'images/full-line.png';
import DashLineImage from 'images/dash-line.png';
import DotLineImage from 'images/dot-line.png';

import LeftArrowLineImage from 'images/full-line-arrow-left.png';
import RightArrowLineImage from 'images/full-line-arrow-right.png';
import BothArrowLineImage from 'images/full-line-arrow-both.png';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';

import {
    Container, Image,
    AdvanceSelect, CheckBox, FormControlLabel, Input,
    FAIcon,
    Tabs, Tab,
    withModal,
} from '@vbd/vui';

import MarkerMediaStyle from 'components/app/IncidentPanel/MarkerMediaStyle';

import { Constants } from 'constant/Constants';
import { DirectionService } from 'services/direction.service';
import { CommonHelper } from 'helper/common.helper';

class SketchMapPopupStyle extends Component
{
    state = {
        pointSettingActiveTab: 'point-icon-setting-tab',
    };
    sketchMapStore = this.props.appStore.sketchMapStore;
    mapStore = this.props.appStore.mapStore;
    directionService = new DirectionService();

    handleOnInputWidth = (value) =>
    {
        const control = this.sketchMapStore.stylingControl;
        control.showControl.width = parseFloat(value);

        this.sketchMapStore.setStylingControl(control, true);

        if (control.type === 'LineString')
        {
            this.sketchMapStore.setControlProps(control, { width: control.showControl.width });
        }
    };

    handleOnInputOpacity = (value) =>
    {
        const control = this.sketchMapStore.stylingControl;
        control.showControl.opacity = parseFloat(value);

        this.sketchMapStore.setStylingControl(control, true);

        if (control.type === 'Polygon')
        {
            this.sketchMapStore.setControlProps(control, { opacity: control.showControl.opacity });
        }
    };

    handleOnChooseColor = (color) =>
    {
        const control = this.sketchMapStore.stylingControl;
        control.showControl.color = color;
        this.sketchMapStore.setStylingControl(control, true);

        if (control.type !== 'Label')
        {
            this.sketchMapStore.setControlProps(control, { color });
        }
    };

    handleOnInputFontSize = (value) =>
    {
        const control = this.sketchMapStore.stylingControl;
        control.showControl.fontSize = parseFloat(value);

        this.sketchMapStore.setStylingControl(control, true);
    };

    handleOnStyleLineChange = (e) =>
    {
        const control = this.sketchMapStore.stylingControl;
        control.showControl.styleLine = e;

        this.sketchMapStore.setStylingControl(control, true);

        if (control.type !== 'Label')
        {
            this.sketchMapStore.setStyleLine(control);
        }
    };

    handleOnStyleArrowLineChange = (e) =>
    {
        const control = this.sketchMapStore.stylingControl;
        control.showControl.styleArrowLine = e;

        this.sketchMapStore.setStylingControl(control, true);
        this.sketchMapStore.drawArrow(control, window.map, control.mapControl.features[0]);

        if (control.type === 'LineString' && control.showControl.styleArrowLine === 'Normal')
        {
            this.sketchMapStore.removeArrow(control, window.map);
        }
    };

    handleClose = () =>
    {
        this.sketchMapStore.setStylingControl();
    };

    onHookToRoadChange = async (value) =>
    {
        const rs = await this.sketchMapStore.updateControlDirectionPath(this.mapStore.map, value, this.directionService);
        if (rs && rs.status !== 200)
        {
            this.props.toast({ message: 'Có một vài điểm không thể hút vào đường!', type: 'error' });
        }
    };

    renderColor()
    {
        const controlColor = this.sketchMapStore.stylingControl.showControl.color;

        return (
            <FormControlLabel
                label={'Màu sắc'}
                direction={'column'}
                control={(
                    <table>
                        <tbody>
                            {
                                Constants.COLORS.map((row, i) => (
                                    <tr
                                        key={i}
                                        role="row"
                                    >
                                        {
                                            row.map((color, j) => (
                                                <td
                                                    key={`${i}${j}`}
                                                    onClick={this.props.disabled ? null : () => this.handleOnChooseColor(color)}
                                                >
                                                    <Container
                                                        className={'color-picker ' + (controlColor === color ? 'selected ' : '') + (this.props.disabled ? 'disabled' : '')}
                                                        style={{ backgroundColor: color }}
                                                    />
                                                </td>
                                            ),
                                            )
                                        }
                                    </tr>
                                ),
                                )
                            }
                        </tbody>
                    </table>
                )}
            />
        );
    }

    renderWidth()
    {
        const defaultValue = this.sketchMapStore.stylingControl.showControl.width;

        return (
            <FormControlLabel
                label={'Độ rộng của đường viền'}
                direction={'column'}
                control={(
                    <Input
                        disabled={this.props.disabled}
                        type="range"
                        min="1"
                        max="10"
                        step="1"
                        value={defaultValue}
                        onChange={this.handleOnInputWidth}
                    />
                )}
            />
        );
    }

    renderFontSize()
    {
        const defaultValue = this.sketchMapStore.stylingControl.showControl.fontSize;

        return (
            <FormControlLabel
                label={'Kích thước chữ'}
                direction={'column'}
                control={(
                    <Input
                        disabled={this.props.disabled}
                        type="range"
                        min="8"
                        max="24"
                        step="1"
                        value={defaultValue}
                        onChange={this.handleOnInputFontSize}
                    />
                )}
            />
        );
    }

    renderOpacity()
    {
        const defaultValue = this.sketchMapStore.stylingControl.showControl.opacity;

        return (
            <FormControlLabel
                label={'Độ trong suốt'}
                direction={'column'}
                control={(
                    <Input
                        disabled={this.props.disabled}
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.05"
                        value={defaultValue}
                        onChange={this.handleOnInputOpacity}
                    />
                )}
            />
        );
    }

    renderStyleLine()
    {
        const defaultValue = this.sketchMapStore.stylingControl.showControl.styleLine;
        const options = [
            { id: 'Normal', label: <Image src={FullLineImage} /> },
            { id: 'Dash', label: <Image src={DashLineImage} /> },
            { id: 'Dot', label: <Image src={DotLineImage} /> },
        ];

        return (
            <FormControlLabel
                label={'Loại đường'}
                control={(
                    <AdvanceSelect
                        disabled={this.props.disabled}
                        placeholder="Chọn loại đường"
                        options={options}
                        width={'100%'}
                        value={defaultValue}
                        onChange={this.handleOnStyleLineChange}
                    />
                )}
            />
        );
    }

    renderStyleArrowLine()
    {
        const defaultValue = this.sketchMapStore.stylingControl.showControl.styleArrowLine;
        const options = [
            { id: 'Normal', label: <Image src={FullLineImage} /> },
            { id: 'Left', label: <Image src={LeftArrowLineImage} /> },
            { id: 'Right', label: <Image src={RightArrowLineImage} /> },
            { id: 'Both', label: <Image src={BothArrowLineImage} /> },
        ];

        return (

            <FormControlLabel
                label={'Loại mũi tên'}
                control={(
                    <AdvanceSelect
                        disabled={this.props.disabled}
                        value={defaultValue}
                        placeholder="Chọn loại mũi tên"
                        options={options}
                        width={'100%'}
                        onChange={this.handleOnStyleArrowLineChange}
                    />
                )}
            />
        );
    }

    renderHookToRoad()
    {
        const control = this.sketchMapStore.getSelectedControl();
        return (
            <CheckBox
                disabled={this.props.disabled}
                label="Hút vào đường"
                checked={control && control.hookToRoad}
                onChange={this.onHookToRoadChange}
            />
        );
    }

    handleOnChooseIcon(icon)
    {
        const control = this.sketchMapStore.stylingControl;
        control.showControl.icon = icon;
        control.showControl.markerType = 'icon';
        control.isUseImageIcon = false;

        this.sketchMapStore.setStylingControl(control, true);

        if (control.type !== 'Label')
        {
            this.sketchMapStore.setControlProps(control, {
                iconText: CommonHelper.getFontAwesomeStringFromClassName(control.showControl.icon),
                markerType: control.showControl.markerType,
            });
        }
    }

    renderIconChooser(disabled)
    {
        const controlIcon = this.sketchMapStore.stylingControl.showControl.icon;

        return (
            <FormControlLabel
                label={'Biểu tượng'}
                direction={'column'}
                control={(
                    <table>
                        <tbody>
                            {
                                Constants.POPULAR_ICONS.map((row, i) => (
                                    <tr
                                        key={i}
                                        role="row"
                                    >
                                        {
                                            row.map((icon, j) => (
                                                <td
                                                    key={icon}
                                                    onClick={disabled ? null : () => this.handleOnChooseIcon(icon)}
                                                >
                                                    <Container
                                                        className={'icon-chooser ' + (controlIcon === icon ? 'selected ' : '') + (disabled ? 'disabled' : '')}
                                                    >
                                                        <FAIcon
                                                            icon={icon}
                                                            size="1rem"
                                                        />
                                                    </Container>
                                                </td>
                                            ),
                                            )
                                        }
                                    </tr>
                                ),
                                )
                            }
                        </tbody>
                    </table>
                )}
            />
        );
    }

    onPointSettingTabSelected = (tabSelected) =>
    {
        const control = this.sketchMapStore.stylingControl;
        const type = tabSelected === 'point-icon-setting-tab'
            ? 'icon'
            : control.showControl.media && control.showControl.media.type.split('/')[0] === 'video' ? 'video' : 'image';
        this.sketchMapStore.setMarkerType(type);
    };

    renderPointSettingTab()
    {
        const control = this.sketchMapStore.stylingControl;
        const activeTab = control.showControl.markerType === 'icon' ? 'point-icon-setting-tab' : 'point-media-setting-tab';
        return (
            <Tabs
                selected={activeTab}
                onSelect={!this.props.disabled
                    ? this.onPointSettingTabSelected
                    : () =>
                        {
                        }}
            >
                <Tab
                    id="point-icon-setting-tab"
                    title="Biểu tượng"
                >
                    {
                        this.renderIconChooser(this.props.disabled)
                    }
                </Tab>
                <Tab
                    id="point-media-setting-tab"
                    title="Ảnh/ video"
                >
                    <MarkerMediaStyle disabled={this.props.disabled} />
                </Tab>
            </Tabs>
        );
    }

    render()
    {
        return (
            <>
                {
                    this.sketchMapStore.stylingControl && this.renderColor()
                }

                {
                    this.sketchMapStore.stylingControl && this.sketchMapStore.stylingControl.type === 'Point' && this.renderPointSettingTab()
                }

                {
                    this.sketchMapStore.stylingControl && this.sketchMapStore.stylingControl.type === 'Label' && this.renderFontSize()
                }

                {
                    this.sketchMapStore.stylingControl && this.sketchMapStore.stylingControl.type === 'Polygon' && this.renderOpacity()
                }

                {
                    this.sketchMapStore.stylingControl && this.sketchMapStore.stylingControl.type === 'LineString' && (
                        <>
                            {this.renderWidth()}
                            {this.renderStyleLine()}
                            {this.renderStyleArrowLine()}
                            {this.renderHookToRoad()}
                        </>
                    )}
            </>
        );
    }
}

SketchMapPopupStyle.propTypes = {
    disabled: PropTypes.bool,
};

SketchMapPopupStyle.defaultProps = {
    disabled: false,
};

SketchMapPopupStyle = withModal(inject('appStore')(observer(SketchMapPopupStyle)));
export default SketchMapPopupStyle;
