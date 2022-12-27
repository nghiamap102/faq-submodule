import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Moment from 'react-moment';
import appEnum from 'constant/app-enum';

import {
    Row, Expanded, Container, Spacer,
    BorderPanel, PanelBody, PanelHeader,
    FAIcon,
    Field, Info, Label,
    withModal,
    Resizable, withResizeMap,
} from '@vbd/vui';

import { SpatialSearchMap } from 'components/app/SpatialSearch/SpatialSearchMap';
import { MarkerPopupStore } from 'components/app/stores/MarkerPopupStore';

import { SpaceRainService } from '../SpaceRainService';
import { SpaceRainSearchGraph } from './SpaceRainSearchGraph';
import SpaceRainSearchRequest from './SpaceRainSearchRequest';

const SpaceRainDetail = (props) =>
{
    return (
        <Container>
            {
                props.data.ssid && (
                    <Field>
                        <Label width={'80px'}>Tên WAP</Label>
                        <Info>{props.data.ssid}</Info>
                    </Field>
                )}
            {
                props.data.wap && (
                    <Field>
                        <Label width={'80px'}>Mã WAP</Label>
                        <Info>{props.data.wap}</Info>
                    </Field>
                )}
            {
                props.data.plate && (
                    <Field>
                        <Label width={'80px'}>Biển số</Label>
                        <Info>{props.data.plate}</Info>
                    </Field>
                )}
            {
                props.data.mac && (
                    <Field>
                        <Label width={'80px'}>Thiết bị khớp</Label>
                        <Info>{props.data.mac}</Info>
                    </Field>
                )}
            <Field>
                <Label width={'80px'}>Hệ thống</Label>
                <Info>{props.data.sys}</Info>
            </Field>
            <Field>
                <Label width={'80px'}>Toạ độ</Label>
                <Info>{props.data.x}, {props.data.y}</Info>
            </Field>
            <Field>
                <Label width={'80px'}>Thời gian phát hiện</Label>
                <Info><Moment format={'L LTS'}>{props.data.capturedAt}</Moment></Info>
            </Field>
        </Container>
    );
};

class SpaceRainSearch extends Component
{
    spacerainSearchStore = this.props.appStore.spacerainStore.spacerainSearchStore;
    spatialSearchStore = this.props.appStore.spacerainStore.spacerainSearchStore.spatialSearchStore;
    markerPopupStore = new MarkerPopupStore();

    svc = new SpaceRainService();

    constructor(props)
    {
        super(props);

        this.state = {
            isLoading: false,
        };
    }

    componentDidMount()
    {
        this.spatialSearchStore.popupContent = <SpaceRainDetail />;
    }

    handleSearchStateChange = (key, value) =>
    {
        this.spacerainSearchStore.setSearchState(key, value);
    };

    handleSearch = () =>
    {
        this.spacerainSearchStore.resetExpanded();
        this.spacerainSearchStore.setData([]);

        this.setState({ isLoading: true });
        this.svc.search(this.spacerainSearchStore.searchState).then((rs) =>
        {
            if (rs.result === appEnum.APIStatus.Success)
            {
                this.spacerainSearchStore.setData(rs.data);
            }
            else
            {
                this.props.toast({ type: 'error', message: rs.message });
            }
            this.setState({ isLoading: false });
        });
    };

    handleSearchNode = (searchNodeState) =>
    {
        const searchState = {
            ...this.spacerainSearchStore.searchState,
            ...searchNodeState,
        };

        this.svc.search(searchState).then((rs) =>
        {
            if (rs.result === appEnum.APIStatus.Success)
            {
                this.spacerainSearchStore.addData(rs.data);
                this.spacerainSearchStore.setExpanded(searchNodeState.id, true);
                this.forceUpdate();
            }
            else
            {
                this.props.toast({ type: 'error', message: rs.message });
            }
        });
    };

    handleViewModeChange = (viewMode) =>
    {
        this.spacerainSearchStore.setViewMode(viewMode);

        if (viewMode !== 'LIST')
        {
            setTimeout(() =>
            {
                this.spatialSearchStore.map.resize();
            }, 300);
        }
    };

    handleResize = (sizes) =>
    {
        const { run, map } = this.props;
        map && run();
    };

    handleMapRender = (newMap) =>
    {
        const { map, onMap, onDelay } = this.props;
        if (newMap !== map)
        {
            newMap.resize();
            onMap(newMap);
            onDelay(300);
        }
    };

    render()
    {
        return (
            <Resizable
                defaultSizes={[320]}
                minSizes={[300, 700]}
                className="spacerain-search"
                onResizeEnd={this.handleResize}
            >
                <SpaceRainSearchRequest
                    store={this.spacerainSearchStore}
                    onSearch={this.handleSearch}
                    onSearchStateChange={this.handleSearchStateChange}
                />

                <BorderPanel
                    flex={1}
                >
                    <PanelHeader>
                        <Row className={'plate-detection-toolbar'}>
                            <FAIcon
                                icon={'list'}
                                size={'1.25rem'}
                                color={this.spacerainSearchStore.viewMode === 'LIST' ? 'var(--contrast-color)' : ''}
                                onClick={this.handleViewModeChange.bind(this, 'LIST')}
                            />
                            <Spacer size={'1.5rem'} />
                            <FAIcon
                                icon={'columns'}
                                size={'1.25rem'}
                                color={this.spacerainSearchStore.viewMode === 'SPLIT' ? 'var(--contrast-color)' : ''}
                                onClick={this.handleViewModeChange.bind(this, 'SPLIT')}
                            />
                        </Row>
                    </PanelHeader>
                    <PanelBody>
                        <Resizable onResizeEnd={this.handleResize}>
                            {
                                this.spacerainSearchStore.viewMode !== 'MAP' && (
                                    <Expanded>
                                        <SpaceRainSearchGraph
                                            data={this.spacerainSearchStore.data}
                                            isLoading={this.state.isLoading}
                                            rootValue={this.spacerainSearchStore.rootValue}
                                            expandedObjects={this.spacerainSearchStore.expandedNodes}
                                            onSearchNode={this.handleSearchNode}
                                        />
                                    </Expanded>
                                )}
                            {
                                <Expanded className={`map-view ${this.spacerainSearchStore.viewMode === 'LIST' ? 'hidden' : ''}`}>
                                    <SpatialSearchMap
                                        store={this.spatialSearchStore}
                                        popupStore={this.markerPopupStore}
                                        onClick={this.handleMapClicked}
                                        onMapRender={this.handleMapRender}
                                    />
                                </Expanded>
                            }

                        </Resizable>
                    </PanelBody>
                </BorderPanel>
            </Resizable>
        );
    }
}

SpaceRainSearch = withResizeMap(withModal(inject('appStore')(observer(SpaceRainSearch))));
export { SpaceRainSearch };
