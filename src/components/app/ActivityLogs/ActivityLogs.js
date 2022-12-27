import './ActivityLogs.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';

import {
    FlexPanel, PanelBody, PanelHeader,
    Container, Row,
    FAIcon,
    Paging,
    DataToolBar,
    ListItem,
    EmptyData,
} from '@vbd/vui';

import { CommonHelper } from 'helper/common.helper';

import ActivityLogsList from './ActivityLogsList';

class ActivityLogs extends Component
{
    constructor(props)
    {
        super(props);
        this.props.appStore.activityLogsStore.init();
    }

    activityLogsStore = this.props.appStore.activityLogsStore;

    handleChangePage = (page) =>
    {
        page = page || this.activityLogsStore.paging.currentPage;

        this.activityLogsStore.getLogsData(page);
    };

    handleFilter = (filterFields) =>
    {
        this.activityLogsStore.setPaging({ currentPage: 1 });

        if (filterFields)
        {
            this.activityLogsStore.clearLogsObject();
            this.activityLogsStore.hideLogsDetail();
        }

        this.activityLogsStore.setFilterInfo(filterFields);
        this.activityLogsStore.getLogsData();
    };

    render()
    {
        const { paging, layerLogsProps } = this.activityLogsStore;
        const logs = CommonHelper.clone(this.activityLogsStore.logs);

        const fields = Object.keys(layerLogsProps).map((field) => layerLogsProps[field]);

        return (
            <FlexPanel flex={1}>
                <DataToolBar
                    fields={fields}
                    fieldsShow={this.activityLogsStore.fieldsShow}
                    onFilter={this.handleFilter}
                />

                {
                    logs?.length
                        ? (
                                <>
                                    <PanelHeader>
                                        <Row crossAxisSize={'min'}>
                                            <Container style={{ paddingRight: '1rem' }}>
                                                <Paging
                                                    total={paging.total}
                                                    currentPage={paging.currentPage}
                                                    pageSize={paging.pageSize}
                                                    onChange={this.handleChangePage}
                                                />
                                            </Container>
                                        </Row>
                                    </PanelHeader>
                                    <PanelBody scroll>
                                        <ActivityLogsList
                                            data={logs}
                                            currentPage={paging.currentPage}
                                            pageSize={paging.pageSize}
                                        />
                                    </PanelBody>
                                </>
                            )
                        : <EmptyData />
                }

            </FlexPanel>
        );
    }
}

ActivityLogs = inject('appStore')(observer(ActivityLogs));
export { ActivityLogs };

class ActivityLogsItem extends Component
{
    handleLogChoosing = () =>
    {
        const { data, onSelectLog } = this.props;
        onSelectLog(data?.Id);
    };

    getDetailLogField = (logKey, value) =>
    {
        return this.props?.onConvertLogFieldData(value, logKey);
    };

    renderDetailField = (fieldName) =>
    {
        const fieldValue = this.props.data[fieldName];

        const label = this.props.layerLogsProps[fieldName]?.DisplayName;
        const value = fieldValue ? this.getDetailLogField(fieldName, fieldValue) : 'Không có dữ liệu';

        return label && <Container key={fieldName}>{label}: {value}</Container>;
    };

    render()
    {
        const { data } = this.props;

        return (
            <ListItem
                icon={(
                    <FAIcon
                        className={'icon'}
                        icon={'exclamation-circle'}
                        type={'solid'}
                        size={'1.5rem'}
                        color={'gray'}
                    />
                )}
                label={data?.Title}
            />
        );
    }
}

ActivityLogsItem.propTypes = {
    data: PropTypes.object,
    layerLogsProps: PropTypes.object,
    onSelectLog: PropTypes.func,
    onConvertLogFieldData: PropTypes.func,
    active: PropTypes.bool,
};

ActivityLogsItem.defaultProps = {
    data: {},
};
