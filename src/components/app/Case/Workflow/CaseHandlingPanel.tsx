import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { inject, observer, Provider } from 'mobx-react';

import { WorkflowPanel } from './WorkflowPanel';

import {
    PanelHeader, PanelBody,
    Tab, Tabs,
    Confirm,
    useMergeState,
} from '@vbd/vui';

import { CaseDetailPanel } from '../CaseDetailPanel';
import { SketchMap } from './SketchMap/SketchMap';
import { CaseActivity } from './CaseActivity/CaseActivity';

type CaseWorkflowPanelProps = {
    appStore?: any
    caseHandlingStore?: any
}

let CaseHandlingPanel: React.FC<CaseWorkflowPanelProps> = (props) =>
{
    const mapStore = props.appStore.mapStore;
    const caseHandlingStore = props.caseHandlingStore;

    const {
        tabSelected,
        setTabSelected,
        wfData,
        handlingCase,
        caseActivities,
        reload,
        onWfDoneStep,
        onPostMessage,
        onWfForceChange,
        handleComplete,
        formatCaseData,
    } = caseHandlingStore;

    const { params } = useRouteMatch<any>();
    const [mapReady, setMapReady] = useState(false);
    const [detailData, setDetailData] = useState();
    const [completeConfirmModel, setCompleteConfirmModel] = useMergeState({ open: false, loading: false });

    useEffect(() =>
    {
        if (handlingCase)
        {
            formatCaseData(handlingCase).then((rs: any) =>
            {
                setDetailData(rs);
            });
        }
    }, [handlingCase]);

    useEffect(() =>
    {
        if (params.id)
        {
            reload(params.id);
        }
    }, []);

    useEffect(() =>
    {
        if (mapStore.map)
        {
            setMapReady(true);
        }
    }, [mapStore.map]);

    const handleTabSelect = (activeTab: any) =>
    {
        setTabSelected(activeTab);
    };

    const onSketchControlChange = () =>
    {

    };

    const onComplete = () =>
    {
        if (wfData.items.filter((item: any) => !item.isInitial && !item.isFinal).find((item: any) => !item.isDone))
        {
            setCompleteConfirmModel({ open: true });
        }
        else
        {
            handleComplete();
        }
    };

    const onCancel = () =>
    {
        window.location.href = '/station/case';
    };

    return (
        <>
            {
                caseHandlingStore.wfData?.headerInfo && mapReady && (
                    <>
                        <PanelHeader>
                            {wfData.headerInfo.TENVUVIEC}
                        </PanelHeader>

                        <PanelBody>
                            <Tabs
                                selected={tabSelected}
                                onSelect={(activeTab: any) => handleTabSelect(activeTab)}
                            >
                                <Tab
                                    id="detail"
                                    title="Chi tiết"
                                    active
                                >
                                    <CaseDetailPanel data={detailData} />
                                </Tab>

                                <Tab
                                    id="wf"
                                    title="Quy trình"
                                    active
                                >
                                    <WorkflowPanel
                                        data={wfData}
                                        onDoneChecked={onWfDoneStep}
                                        onPost={onPostMessage}
                                        onForceChange={onWfForceChange}
                                        onComplete={onComplete}
                                        onCancel={onCancel}
                                    />
                                </Tab>

                                <Tab
                                    id="tools"
                                    title="Công cụ"
                                >
                                    <SketchMap
                                        disabled={false}
                                        wfData={wfData}
                                        onSketchControlChange={onSketchControlChange}
                                    />
                                </Tab>
                                <Tab
                                    id="events"
                                    title="Sự kiện"
                                >
                                    <CaseActivity
                                        activities={caseActivities}
                                    />
                                </Tab>
                            </Tabs>
                        </PanelBody>
                    </>
                )
            }
            {
                completeConfirmModel.open && (
                    <Confirm
                        title={'Xác nhận hoàn thành'}
                        message={'Vẫn còn tác vụ chưa xử lý, xác nhận hoàn thành vụ việc này?'}
                        cancelText={'Hủy'}
                        okText={'Tiếp tục'}
                        loading={completeConfirmModel.loading}
                        onCancel={() =>
                        {
                            setCompleteConfirmModel({ open: false });
                        }}
                        onOk={() =>
                        {
                            handleComplete();
                            setCompleteConfirmModel({ open: false });
                        }}
                    />
                )
            }
        </>
    );
};

CaseHandlingPanel = inject('appStore', 'caseHandlingStore')(observer(CaseHandlingPanel));

export default inject('appStore')(observer((props: any) =>
{
    const caseHandlingStore = props.appStore.caseHandlingStore;
    return (
        <Provider caseHandlingStore={caseHandlingStore}>
            <CaseHandlingPanel
                {
                    ...props
                }
            />
        </Provider>
    );
}));
