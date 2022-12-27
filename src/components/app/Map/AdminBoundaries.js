import './AdminBoundaries.scss';

import React, { Component, createRef } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer, Provider } from 'mobx-react';
import PropTypes from 'prop-types';
import { GeoJSONLayer } from 'react-mapbox-gl';

import { Container, ContextMenu, MapControlButton } from '@vbd/vui';

import { Constants } from 'constant/Constants';

class AdminBoundaries extends Component
{
    abStore = this.props.appStore.adminBoundariesStore;
    mapStore = this.props.appStore.mapStore;
    adminType = [Constants.TYPE_PROVINCE, Constants.TYPE_DISTRICT, Constants.TYPE_WARD];

    state = {
        isExpand: false,
    };

    buttonRef = createRef(null);

    constructor(props)
    {
        super(props);

        this.abStore.init();
    }

    componentDidUpdate(prevProps)
    {
        if (this.props?.location !== prevProps?.location && this.state.isExpand)
        {
            this.togglePopup();
        }
    }

    togglePopup = () =>
    {
        this.setState({ isExpand: !this.state.isExpand });
    };

    showMenu = async (level, admin) =>
    {
        const { lastSelected, selectedPath, setBreadcrumb, getChildByParentId } = this.abStore;

        let admins;
        if (lastSelected && lastSelected.level === level)
        {
            // cached child
            admins = this.currentChild;
        }
        else
        {
            // set breadcrumb, index also a level
            setBreadcrumb(level, admin);

            // no more child for this level
            const type = this.adminType[level];
            if (!type)
            {
                return;
            }

            // get children
            const data = await getChildByParentId(type, admin.AdministrativeID);
            if (data)
            {
                admins = data;
                this.currentChild = admins;
            }
        }

        if (admins && admins.length)
        {
            // build child action
            const actions = admins.map((p) =>
            {
                return {
                    label: p.Title,
                    onClick: () =>
                    {
                        this.handleSelect(level + 1, p);
                    },
                };
            });

            if (selectedPath && selectedPath.length)
            {
                // build parents action
                actions.unshift(
                    ...selectedPath.filter((s) => s.level < 3).map((s) =>
                    {
                        return {
                            label: s.admin.Title,
                            onClick: () =>
                            {
                                this.handleSelect(s.level, s.admin);
                            },
                        };
                    }),
                    {
                        separator: true,
                    },
                );
            }

            this.abStore.setActions(actions);
        }
    };

    handleToggleArea = async () =>
    {
        const { lastSelected } = this.abStore;
        if (lastSelected)
        {
            await this.showMenu(lastSelected.level, lastSelected.admin);
        }
        else
        {
            await this.showMenu(0, { AdministrativeID: 0, Title: this.props.title });
        }

        this.togglePopup();
    };

    handleSelect = (level, admin) =>
    {
        // show boundaries
        this.abStore.getAdminArea(this.adminType[level - 1], admin.AdministrativeID).then(() =>
        {
            this.showMenu(level, admin);
        });
    };

    render()
    {
        const rect = this.buttonRef.current?.getBoundingClientRect();

        return (
            <Container className="admin-boundaries-container">

                <GeoJSONLayer
                    id={Constants.ADMINISTRATIVE_BOUNDARIES_LAYER_ID}
                    data={{
                        'type': 'FeatureCollection',
                        'features': [
                            {
                                'type': 'Feature',
                                'geometry': {
                                    'type': this.abStore.area.type || 'Polygon',
                                    'coordinates': this.abStore.area.data || [],
                                },
                            },
                        ],
                    }}
                    linePaint={{
                        'line-width': Constants.ADMINISTRATIVE_BOUNDARIES_OUTLINE_WIDTH,
                        'line-color': Constants.ADMINISTRATIVE_BOUNDARIES_OUTLINE_COLOR,
                    }}
                    fillPaint={{
                        'fill-color': Constants.ADMINISTRATIVE_BOUNDARIES_POLYGON_COLOR,
                        'fill-opacity': Constants.ADMINISTRATIVE_BOUNDARIES_POLYGON_OPACITY,
                    }}
                />

                <MapControlButton
                    innerRef={this.buttonRef}
                    active={this.state.isExpand}
                    icon="sitemap"
                    onClick={this.handleToggleArea}
                />

                {
                    this.abStore.actions?.length >= 0 && this.state.isExpand && (
                        <Provider appState={this.props.appStore}>
                            <ContextMenu
                                id={'admin-boundaries'}
                                header={'Ranh giới hành chính'}
                                isTopLeft={false}
                                position={{ x: rect.left - 8, y: rect.top }}
                                width={250}
                                maxHeight={400}
                                actions={this.abStore.actions}
                                isCloseOnAction={false}
                                onClose={() => this.setState({ isExpand: false })}
                            />
                        </Provider>
                    )}
            </Container>
        );
    }
}

AdminBoundaries.propTypes = {
    title: PropTypes.string,
};

AdminBoundaries.defaultProps = {
    title: 'Việt Nam',
};

AdminBoundaries = inject('appStore')(observer(AdminBoundaries));
AdminBoundaries = withRouter(AdminBoundaries);
export { AdminBoundaries };
