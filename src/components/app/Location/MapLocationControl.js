import './MapLocationControl.scss';

import React, { Component, createRef } from 'react';
import { inject, observer } from 'mobx-react';

import { Button, FAIcon, AdvanceSelect, FormControlLabel, Container, Sub2, T } from '@vbd/vui';

import { Constants } from 'constant/Constants';
import { DirectionService } from 'services/direction.service';

class MapLocationControl extends Component
{
    mapStore = this.props.appStore.mapStore;

    directionService = new DirectionService();

    advanceRef = createRef();

    state = {
        locations: [],
        location: {},
        options: [],
        optionSelected: {},
        keySearch: '',
        noneSelectContent: '',
        errorText: '',
    };

    static getDerivedStateFromProps(nextProps, prevState)
    {
        // this is here because QueryBuilderRule use value as a state and it set state whenever it's parent call fillRuleStatus
        if (nextProps.value !== prevState.keySearch && nextProps.onTextChange)
        {
            return { keySearch: nextProps.value }; // return new state
        }

        return null; // don't change state
    }


    componentDidMount()
    {
        this.setLocation(this.props.location);

        // for add none select text and get first options
        this.handleTextChange(this.props.value);
    }

    setNoneSelectValue = (options, keySearch) =>
    {
        let content;

        if (!keySearch || keySearch.length < 3)
        {
            content = 'Nhập giá trị cần tìm';
        }
        else if (options?.length > 0)
        {
            content = 'Kết quả dưới đây là địa chỉ gần đúng. Bạn có thể chỉnh sửa nếu muốn.';
        }
        else if (keySearch?.length >= 3)
        {
            content = 'Không tìm thấy kết quả nào. Bạn có thể tự chọn vị trí trên bản đồ';
        }

        this.setState({ noneSelectContent: content });
    };

    setLocation = (location) =>
    {
        const { renderInputDisplay, value } = this.props;

        if (location)
        {
            if (!location.id)
            {
                location.id = location.latitude + ',' + location.longitude;
            }

            const initLabel = [location.address, location.city, location.country].filter((x) => x).join(', ');
            const label = renderInputDisplay ? renderInputDisplay(initLabel) : initLabel;
            const options = [{ id: location.id, label, provider: location.provider }];

            this.setState({
                location,
                options: initLabel ? options : [],
                keySearch: value || label || '',
            });
        }
        else
        {
            this.setState({ location: {}, options: [], keySearch: this.props.value || '' });
        }
    };

    setLocationOnly = (location) =>
    {
        if (location)
        {
            if (!location.id)
            {
                location.id = location.latitude + ',' + location.longitude;
            }
            this.setState({ location });

        }
        else
        {
            this.setState({ location: {} });
        }
    };

    formatLocation = (idOption) =>
    {
        const { locations } = this.state;
        const { location } = this.props;

        // check locations in init
        const loc = locations?.length === 0 ? location : locations.find((loc) => loc.id === idOption);

        return {
            longitude: loc?.longitude || location?.longitude || '',
            latitude: loc?.latitude || location?.latitude || '',
            address: loc?.address || '',
            city: loc?.province || '',
            country: loc?.country || '',
        };
    };

    checkCoordinate = (value) =>
    {
        const matches = /^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/.exec(value);
        return !!(matches && matches.length);
    };


    handleTextChange = async (keySearch) =>
    {
        const { renderDropdownDisplay, renderInputDisplay, onGeoCodeSearch } = this.props;

        let options = [];
        let locations = [];

        const isCoordinate = this.checkCoordinate(keySearch);

        if (this.props.onTextChange)
        {
            this.props.onTextChange(keySearch);
        }
        else
        {
            this.setState({ keySearch });
        }

        if (keySearch && keySearch.length >= 3)
        {
            const res = onGeoCodeSearch ? await onGeoCodeSearch(keySearch, this.mapStore.bounds) : await this.directionService.searchAllDebounced(keySearch, this.mapStore.bounds);

            if (res.docs)
            {
                const newOptions = res.docs.map((doc) =>
                {
                    if (!doc.id)
                    {
                        doc.id = doc.longitude + '-' + doc.latitude;
                    }

                    const label = [doc.name || '', doc.address].concat(doc.provider ? [`  (${doc.provider})`] : []).filter((item) => item).join(', ');
                    const subTitle = doc.address && [doc.address || ''].concat(doc.provider ? [`  (${doc.provider})`] : []).filter((item) => item).join(', ');
                    const dropdownActions = isCoordinate ? [] : this.renderDropdownActions(doc.id);

                    return {
                        id: doc.id,
                        provider: doc.provider,
                        inputDisplay: renderInputDisplay ? renderInputDisplay(doc) : label,
                        dropdownDisplay: renderDropdownDisplay ? renderDropdownDisplay(doc.name, subTitle, dropdownActions) : label,
                    };
                });

                locations = res.docs;
                options = newOptions;
            }
        }

        this.setState({ options, locations });
        this.setNoneSelectValue(options, keySearch);
    };

    handleJumpMap = (idOption) =>
    {
        if (!idOption || idOption === -1)
        {
            return;
        }

        const loc = this.formatLocation(idOption);
        this.props.onSelectionChange(loc);
    };

    handleSelectionChange = (id) =>
    {
        if (!id || id === -1)
        {
            return;
        }

        const { options } = this.state;

        const loc = this.formatLocation(id);
        const refreshOptions = options.find((option) => option.id === id);

        this.props.onSelectionChange(loc);
        this.props.onTextChange && this.props.onTextChange(refreshOptions.inputDisplay);

        this.setState({
            options: [refreshOptions],
            optionSelected: refreshOptions,
            ...!this.props.onTextChange && { keySearch: refreshOptions.inputDisplay },
        });
    };

    handleModifyLocation = (e, id) =>
    {
        e.stopPropagation();
        this.handleJumpMap(id);

        // this.advanceRef.current.onBlur(Constants.BLUR_TYPE.HANDLE_BUTTON);
    };

    handleMakerClick = (e) =>
    {
        e.stopPropagation();

        // this.advanceRef.current.onBlur(Constants.BLUR_TYPE.HANDLE_BUTTON);
    };

    handleOnblur = (blurType, callback) =>
    {
        const { onTextChange } = this.props;
        const { keySearch, optionSelected } = this.state;

        if (blurType)
        {
            switch (blurType)
            {
                case Constants.BLUR_TYPE.BACKGROUND:
                {
                    if (!keySearch)
                    {
                        this.setState({ optionSelected: null });
                    }

                    if (onTextChange)
                    {
                        onTextChange(optionSelected?.inputDisplay || keySearch);
                    }
                    else
                    {
                        this.setState(({ keySearch: optionSelected?.inputDisplay || keySearch }));
                    }
                    break;
                }
                case Constants.BLUR_TYPE.HANDLE_BUTTON:
                {
                    this.setState({ optionSelected: null });
                    break;
                }
            }

        }
        callback && callback();
    };


    renderDropdownActions = (id) => [
        <Button
            key={'modify-button-address'}
            className={'action-button'}
            text={'Modify'}
            onClick={(e) => this.handleModifyLocation(e, id)}
        />,
    ];

    renderExpandIcon = () =>
    {
        return (
            <FAIcon
                size={'1.2rem'}
                icon={'map-marker-alt'}
                className={'map-location-expand-icon'}
                onClick={this.handleMakerClick}
            />
        );
    };


    render()
    {
        const { options, keySearch, noneSelectContent, isDirty } = this.state;
        const { placeholder, disabled, clearable, dirty, labelLocation, label, direction, renderPopupCommandText, required, errorText } = this.props;

        return (
            <Container className={'map-location-control'}>
                <FormControlLabel
                    {...{ label, direction, labelLocation, required }}
                    control={(
                        <AdvanceSelect
                            // ref={this.advanceRef}
                            options={options}
                            value={keySearch}
                            noneSelectValue={renderPopupCommandText ? renderPopupCommandText(noneSelectContent) : noneSelectContent}
                            expandIcon={this.renderExpandIcon()}
                            searchable
                            clearable
                            onSearch={this.handleTextChange}
                            onChange={this.handleSelectionChange}
                            // onBlur={this.handleOnblur}

                            {...{ dirty, disabled, clearable, placeholder }}
                        />
                    )}
                />
                {
                    (errorText) && (
                        <Sub2
                            color={'danger'}
                            style={{ marginBottom: '2px' }}

                        >
                            <T>{errorText}</T>&nbsp;
                        </Sub2>
                    )}

            </Container>
        );
    }
}

MapLocationControl.defaultProps = {
    label: 'Vị trí',
    direction: 'column',
    placeholder: 'Nhập địa chỉ',

    disabled: false,
    clearable: false,

    renderDropdownDisplay: null,
    renderInputDisplay: null, // must return string
    renderPopupCommandText: null, // text show above list popup

    onTextChange: null,
};

MapLocationControl = inject('appStore')(observer(MapLocationControl));
export default MapLocationControl;
