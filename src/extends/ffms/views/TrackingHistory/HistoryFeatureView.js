import './HistoryFeatureView.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { PanelBody, PanelHeader, ScrollView } from '@vbd/vui';

import { RouterParamsHelper } from 'helper/router.helper';
import { HistoryTreeView } from 'extends/ffms/views/TrackingHistory/HistoryTreeView';
import { DataTypes } from 'helper/data.helper';

class HistoryFeatureView extends Component
{
    featureBarStore = this.props.appStore.featureBarStore;
    historyStore = this.props.fieldForceStore.historyStore;

    async componentDidMount()
    {
        // Restore params & set to url
        if (this.historyStore.urlParams && Object.values(this.historyStore.urlParams).length !== 0)
        {
            RouterParamsHelper.setParams(null, this.props, this.historyStore.urlParams);
        }

        const dataRefs = await this.props.fieldForceStore.loadDataReferences(['employee-types', 'device-statuses']);
        this.historyStore.setEmpTypes(dataRefs['employee-types']);
        this.historyStore.setStatuses(dataRefs['device-statuses']);
        
        if (this.props.location.search)
        {
            this.historyStore.isLoadingFromParams(true);
            this.loadParams();
        }
        else
        {
            // TODO: will optimize later, use `loadParams` instead
            const initialParams = {};
            if (this.historyStore.selectedEmp && this.historyStore.selectedEmp.employee_username)
            {
                initialParams['username'] = this.historyStore.selectedEmp.employee_username;
            }

            if (this.historyStore.currentFilter['from'])
            {
                initialParams['from'] = this.historyStore.currentFilter['from'].valueOf();
            }

            if (this.historyStore.currentFilter['to'])
            {
                initialParams['to'] = this.historyStore.currentFilter['to'].valueOf();
            }
            const { username, from, to } = initialParams;
            await this.historyStore.setFilters(username, from, to);
    
            this.historyStore.selectHistory();
            this.historyStore.getGPSLogByDay(new Date(initialParams['from']), initialParams['username']);

            RouterParamsHelper.setParams(this.historyStore.urlParams, this.props, initialParams);
        }
    }

    componentDidUpdate = (prevProps) =>
    {
        const locationSearch = RouterParamsHelper.shouldLocationChanged(this.props.location, prevProps.location);
        if (locationSearch)
        {
            this.loadParams(locationSearch);
        }
    };

    loadParams = async (search) =>
    {
        const qs = RouterParamsHelper.getParams(this.props.location.search, {
            username: DataTypes.String,
            from: DataTypes.Number,
            to: DataTypes.Number,
        });

        for (const key in qs)
        {
            this.historyStore.urlParams[key] = qs[key];
        }

        const { username, from, to } = qs;

        if (username)
        {
            await this.historyStore.setFilters(username, from, to);
        }
    
        if (from && to)
        {
            this.historyStore.selectHistoryDebounced();
            this.historyStore.getGPSLogByDay(new Date(from), username);
        }
    };


    handleClose = () =>
    {
        this.props.history.push('/' + this.props.history.location.pathname.split('/')[1]);
    };

    handleFilterBtnClick = () =>
    {
        this.historyStore.toggleFilterPanel();
    };

    render()
    {
        return (
            <>
                <PanelHeader actions={[{ icon: 'times', onClick: this.handleClose }]}>
                    Lịch trình
                </PanelHeader>

                <PanelBody className={'history-feature-panel'}>
                    <ScrollView options={{ suppressScrollX: true }}>
                        <HistoryTreeView
                            onFilterChange={this.props.onFilterChange}
                            history={this.props.history}
                        />
                    </ScrollView>
                </PanelBody>
            </>
        );
    }
}

HistoryFeatureView.propTypes = {
    onFilterChange: PropTypes.func,
};

HistoryFeatureView = inject('appStore', 'fieldForceStore')(observer(HistoryFeatureView));
HistoryFeatureView = withRouter(HistoryFeatureView);
export { HistoryFeatureView };
