import React, { useContext } from 'react';
import { inject, observer } from 'mobx-react';

import {
    PanelHeader,
    PanelFooter,
    TB1,
    Image,
    Container,
    Popup, PopupFooter,
    Button, EmptyButton,
    FlexPanel, PanelBody,
    ScrollView,
    DescriptionItem, DescriptionGroup,
} from '@vbd/vui';

import { EventService } from 'services/event.service';
import Moment from 'react-moment';
import { CaseContext, CaseFormMode } from '../Case/CaseContext';
import CaseFormPopup from '../Case/CaseFormPopup';

const Enum = require('constant/app-enum');

type EventDetailPanelProps = {
    appStore: any,
}
const _EventDetailPanel: React.FC<EventDetailPanelProps> = (props) =>
{
    const { appStore } = props;

    const { caseForm, setCaseState } = useContext<any>(CaseContext);

    const eventStore = appStore.eventStore;
    const eventSvc = new EventService(appStore);

    const handleCloseDetail = () =>
    {
        eventStore.setDetail(undefined);
        eventStore.setStateDetail(false);
    };

    const handleDeleteDetail = () =>
    {
        eventStore.setDeleteState(true);
    };

    const handleAttachment = () =>
    {
        eventStore.attachToIncident(eventStore.event.id);
    };

    const handleAddCase = () =>
    {
        setCaseState({
            caseForm: {
                open: true,
                mode: CaseFormMode.NEW,
                data: null,
                eventId: eventStore.event.id,
            },
        });
    };

    const handleCancelDelete = () =>
    {
        eventStore.setDeleteState(false);
    };

    const handleConfirmDelete = () =>
    {
        eventStore.setDeleteState(false);
        eventSvc.del(eventStore.event.id).then((rs) =>
        {
            // alert('Delete Event successfully');
            // should use toast instead

            eventSvc.gets().then((rs) =>
            {
                if (rs.result === Enum.APIStatus.Success)
                {
                    eventStore.replace(rs.data);
                }
            });
            eventStore.setStateDetail(false);
            eventStore.setDetail(undefined);
        });
    };

    const panelHeaderActions = [
        {
            icon: 'trash-alt',
            onClick: handleDeleteDetail,
        },
        {
            icon: 'times',
            onClick: handleCloseDetail,
        },
    ];

    return (
        <FlexPanel
            className='event-detail'
            flex={1}
        >
            <PanelHeader actions={panelHeaderActions}>
                Chi tiết đối tượng
            </PanelHeader>

            <PanelBody>
                <ScrollView>
                    <Container className='section'>
                        <PanelHeader>
                            Thông tin chung
                        </PanelHeader>

                        <PanelBody>
                            <DescriptionGroup>
                                <DescriptionItem
                                    label='Sự kiện'
                                    direction='column'
                                >
                                    <TB1>{eventStore.event.messageData.Title}</TB1>
                                </DescriptionItem>

                                <DescriptionItem
                                    label='Hình ảnh'
                                    direction='column'
                                >
                                    {eventStore.event.messageData.Images && eventStore.event.messageData.Images.map((src: string, index: number) => (
                                        <Image
                                            key={index}
                                            width='5rem'
                                            src={src}
                                            canEnlarge
                                        />
                                    ))}
                                </DescriptionItem>

                                <DescriptionItem
                                    label='Thời gian cập nhật'
                                    direction='column'
                                >
                                    <TB1>
                                        <Moment format={'L LTS'}>{eventStore.event.messageData.Timestamp}</Moment>
                                    </TB1>
                                </DescriptionItem>
                            </DescriptionGroup>

                        </PanelBody>
                    </Container>

                    <Container className='section'>
                        <PanelHeader>
                            Thông tin đặc biệt
                        </PanelHeader>

                        <PanelBody>
                            <DescriptionGroup>
                                {
                                    eventStore.event.messageData.Metadata && Object.keys(eventStore.event.messageData.Metadata).map((d) =>
                                    {
                                        const type = d.substr(0, d.indexOf('_'));
                                        const label = d.substr(d.indexOf('_') + 1).replace(/_/g, ' ');

                                        return (
                                            eventStore.event.messageData.Metadata[d] && (
                                                <DescriptionItem
                                                    key={d}
                                                    label={`${label}`}
                                                    direction='column'
                                                >
                                                    <TB1 key={d}>
                                                        {eventStore.event.messageData.Metadata[d]}
                                                        {type === 'percent' ? '%' : ''}
                                                    </TB1>
                                                </DescriptionItem>
                                            ));
                                    })
                                }
                            </DescriptionGroup>
                        </PanelBody>

                    </Container>
                </ScrollView>
            </PanelBody>

            <PanelFooter
                actions={[
                    {
                        text: 'Bổ sung', onClick: handleAttachment,
                    },
                    {
                        text: 'Tạo vụ việc',
                        onClick: handleAddCase,
                    },
                ]}
            />

            {
                eventStore.isDeleting && (
                    <Popup
                        title="Xóa sự kiện"
                        width="400px"
                        padding={'2rem'}
                        onClose={handleCancelDelete}
                    >
                        <TB1>Bạn có chắc chắn muốn xóa sự kiện này không ?</TB1>

                        <PopupFooter>
                            <EmptyButton
                                text="Hủy"
                                onClick={handleCancelDelete}
                            />
                            <Button
                                color="danger"
                                text="Xóa"
                                onClick={handleConfirmDelete}
                            />
                        </PopupFooter>
                    </Popup>
                )}


            {caseForm.open && (
                <CaseFormPopup
                    formType={caseForm.mode}
                    data={caseForm.data}
                    eventId={caseForm.eventId}
                    callback={() =>
                    {
                        setCaseState({ caseForm: { ...caseForm, open: false } });
                    }}
                    onClose={() =>
                    {
                        setCaseState({ caseForm: { ...caseForm, open: false } });
                    }}
                />
            )}

        </FlexPanel>
    );
};

const EventDetailPanel = inject('appStore')(observer(_EventDetailPanel));
export default EventDetailPanel;
