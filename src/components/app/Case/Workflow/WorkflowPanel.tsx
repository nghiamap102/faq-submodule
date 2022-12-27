import React from 'react';

import {
    FlexPanel, PanelBody,
    PanelFooter,
    ScrollView,
} from '@vbd/vui';

import { WorkflowItem } from './WorkflowItem';
import { WorkflowInformation } from './WorkflowInformation';

import './WorklowPanel.scss';

type WorkflowPanelProps = {
    data?: any,
    onPost?: Function,
    onDoneChecked?: Function,
    onStartEvent?: Function,
    onForceChange?: Function,
    onComplete?: Function,
    onCancel?: Function,
    disableForceSelect?: boolean
}

const WorkflowPanel: React.FC<WorkflowPanelProps> = (props) =>
{
    const {
        data,
        onPost,
        onDoneChecked,
        onStartEvent = () =>
        {
        },
        onForceChange,
        onComplete = () =>
        {
        },
        onCancel = () =>
        {
        },
        disableForceSelect = false,
    } = props;

    const caseInfo = data.headerInfo;

    return (
        <FlexPanel className={'wf-panel'}>
            <PanelBody className="id-items">
                {
                    data && (
                        <ScrollView>
                            <WorkflowInformation
                                information={caseInfo}
                                level={data.level}
                                disabled={disableForceSelect}
                                onForceChange={onForceChange}
                            />

                            {/* filter out useless init and final wf item */}
                            {Array.isArray(data.items) && data.items
                                .filter((item: any) => !item.isInitial && !item.isFinal)
                                .map((item: any, index: number) => (
                                    <WorkflowItem
                                        key={index}
                                        {...item}
                                        itemNumber={index + 1}
                                        itemId={item.Id}
                                        caseId={caseInfo.Id}
                                        wfCode={caseInfo.wfCode}
                                        wfProcessId={caseInfo.wfInstanceId}
                                        posts={item.posts}
                                        onPost={onPost}
                                        onDoneChecked={onDoneChecked}
                                        onStartEvent={onStartEvent}
                                        // handleWFProcess={this.props.handleWFProcess}
                                    >
                                        {item.tools}
                                    </WorkflowItem>
                                ))
                            }
                        </ScrollView>
                    )}
            </PanelBody>

            <PanelFooter
                actions={[
                    {
                        text: 'Hủy',
                        onClick: onCancel,
                    },
                    {
                        disabled: data.headerInfo.TRANGTHAI === 'Đã xử lý',
                        text: data.headerInfo.TRANGTHAI === 'Đã xử lý' ? 'Đã hoàn thành' : 'Hoàn thành',
                        onClick: onComplete,
                    },
                ]}
            />
        </FlexPanel>
    );
};

export { WorkflowPanel };
