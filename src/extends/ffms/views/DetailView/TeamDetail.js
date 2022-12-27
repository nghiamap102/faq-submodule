import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import {
    Container, HD5, Sub2,
    withI18n, withModal,
} from '@vbd/vui';

import { isEmpty } from 'helper/data.helper';
import TabBar from 'extends/ffms/pages/base/TabBar';
import Loading from 'extends/ffms/pages/base/Loading';
import AccountsDetailPanel from 'extends/ffms/views/DetailView/AccountsDetailPanel';
import DisplayDetail from 'extends/ffms/views/DetailView/DisplayDetail';


class TeamDetail extends Component
{
    fieldForceStore = this.props.fieldForceStore;
    managerLayerStore = this.props.fieldForceStore.managerLayerStore;

    tabs = [
        { id: 1, title: 'Thông tin chi tiết', hash: '#detail' },
        { id: 2, title: 'Danh sách người dùng', hash: '#users' },
    ];
    state = {
        tabActive: 1,
        tabs: [],
    }

    componentDidMount()
    {
        const { location } = this.props;
        this.setState({
            tabs: this.tabs.map((tab) => ({ ...tab, link: location.pathname + location.search + tab.hash })),
        });
        this.activeTab();
    }

    activeTab = () =>
    {
        const tab = this.state.tabs.find(item => item.hash === this.managerLayerStore.hashParam.hash);
        if (tab)
        {
            this.setState({ tabActive: tab.id });
            this.managerLayerStore.setMainTab(tab.id);
        }
    }

    onChangeTab = (id) =>
    {
        this.setState({ tabActive: id });
        this.managerLayerStore.setMainTab(id);
    }

    render()
    {
        const { tabs } = this.state;
        const { data, layer, properties } = this.props;

        return (
            <>
                <Container className='detail-panel-header' >
                    <HD5>{data?.Title}</HD5>
                    <Sub2>{data?.Description}</Sub2>
                </Container>
                {
                    !tabs || isEmpty(tabs) ? <Loading /> : <Container className={'detail-panel'}>
                        <TabBar
                            title=''
                            tabs={tabs}
                            defaultIndex={this.managerLayerStore.mainTab}
                            onChange={this.onChangeTab}
                            className={'detail-panel-tabs'}
                        />
                        <Container className='detail-panel-body'>
                            {
                                this.managerLayerStore.mainTab && this.managerLayerStore.mainTab === 1 &&
                                <DisplayDetail
                                    data={data}
                                    properties={properties}
                                    viewConfig={{
                                        hideMapLocation: true,
                                        hideOtherInfo: false,
                                        otherInfoTitle: 'Thông tin cơ bản',
                                    }}
                                />
                            }
                            {
                                this.managerLayerStore.mainTab && this.managerLayerStore.mainTab === 2 &&
                                <AccountsDetailPanel
                                    data={data}
                                    layer={layer}
                                />
                            }
                        </Container>
                    </Container>
                }
            </>
        );
    }
}

TeamDetail.propTypes = {
    data: PropTypes.any,
    layer: PropTypes.any,
    properties: PropTypes.array,
};
TeamDetail.defaultProps = {
    properties: [],
};

TeamDetail = inject('appStore', 'fieldForceStore')(observer(TeamDetail));
TeamDetail = withModal(withI18n(withRouter(TeamDetail)));
export default TeamDetail;
