import './EventPanel.scss';

import React, { useContext, useEffect, useRef, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { Animated } from 'react-animated-css';
import Moment from 'react-moment';
import UIfx from 'uifx';

import {
    withModal,
    ListItem,
    Container,
    Popup, PopupFooter,
    Button, EmptyButton,
    PanelHeader,
    AdvanceSelect,
    FormControlLabel,
    TB1,
    WebSocketService,
    FAIcon,
    ScrollView,
} from '@vbd/vui';

import { EventService } from 'services/event.service';
import { CaseService } from 'services/case.service';
import { CaseContext } from '../Case/CaseContext';

const notificationSound = require('assets/sounds/notification.mp3');

const tick = new UIfx(
    notificationSound,
    {
        volume: 1,
        throttleMs: 100,
    },
);

const Enum = require('constant/app-enum');

type EventPanelProps = {
    appStore: any,
    toast: any
}
const _EventPanel: React.FC<EventPanelProps> = (props) =>
{
    const { appStore } = props;
    const { eventStore, mapStore } = appStore;

    const { getCaseData } = useContext<any>(CaseContext);
    const [caseOptions, setCaseOptions] = useState<any>([]);

    const eventSvc = new EventService(appStore);
    const caseSvc = new CaseService();

    let wsSubbed = useRef<boolean>(false).current;

    useEffect(() =>
    {
        eventSvc.gets().then((rs: any) =>
        {
            if (rs?.result === Enum.APIStatus.Success)
            {
                eventStore.replace(rs.data);
            }
            else
            {
                eventStore.replace([]);
            }
        });

        if (!wsSubbed)
        {
            wsSubbed = true;
            WebSocketService.subscribeChanel('event', handleIncomingEvent);
        }
    }, []);

    const handleIncomingEvent = (event: any) =>
    {
        eventStore.update(event);

        if (eventStore.isMute === '0')
        {
            tick.play();

            props.toast({
                type: 'info',
                message: `Sự kiện mới: ${event.messageData.Title}`,
                onClick: () => handleEventChoosing(event.id, event.messageData),
            });
        }
    };

    const handleEventChoosing = (id: any, eventData: any) =>
    {
        eventStore.setDetail({ id: id, messageData: eventData });
        eventStore.setStateDetail(true);

        if (mapStore.map)
        {
            // go to location
            mapStore.map.flyTo({
                center: eventData.Shape.coordinates,
                zoom: 15,
            });
        }
    };

    const handleAttachDataChange = (event: any, dataType: any) =>
    {
        eventStore.attachToIncidentDataChange(dataType, event);
    };

    const handleAttachCloseClicked = () =>
    {
        eventStore.closeAttachToIncident();
    };

    const handleAttachClicked = () =>
    {
        if (!eventStore.attachEvent.incidentId)
        {
            props.toast({ type: 'error', message: 'Bạn chưa chọn loại sự cố' });
            return;
        }

        caseSvc.addAttachment(eventStore.attachEvent.eventId, eventStore.attachEvent.incidentId).then((rs) =>
        {
            if (rs?.result === Enum.APIStatus.Success)
            {
                eventSvc.gets().then((rs) =>
                {
                    if (rs?.result === Enum.APIStatus.Success)
                    {
                        eventStore.replace(rs.data);
                    }
                });

                eventStore.closeAttachToIncident();
                eventStore.setStateDetail(false);
                eventStore.setDetail(undefined);
            }
        });
    };

    const handleNotificationStateChange = () =>
    {
        eventStore.setMuteState(eventStore.isMute === '1' ? '0' : '1');
    };

    const panelHeaderActions = [{
        icon: eventStore.isMute === '1' ? 'bell-slash' : 'bell',
        tooltip: eventStore.isMute === '1' ? 'Bật thông báo' : 'Tắt thông báo',
        onClick: handleNotificationStateChange,
    }];

    const handleSearchCase = async (searchKey: string) =>
    {
        if (searchKey)
        {
            const query = {
                returnFields: ['*'],
                count: -1,
                filterQuery: [],
                start: 0,
                searchKey: searchKey,
            };
            const caseData = await getCaseData(null, query);
            if (caseData?.cases)
            {
                setCaseOptions(caseData.cases.map((c:any)=>
                {
                    return {
                        id: c.Id,
                        label: c.TENVUVIEC,
                    };
                }));
            }
            else
            {
                setCaseOptions([]);
            }
        }
        else
        {
            setCaseOptions([]);
        }
    };

    return (
        <>
            <PanelHeader actions={panelHeaderActions}>Sự kiện</PanelHeader>

            <ScrollView>
                <Container className={'event-list'}>
                    {eventStore.events.map((event: any) => (
                        <EventItem
                            key={event.id}
                            data={event.messageData}
                            active={event.active}
                            getTime={event.getTime}
                            id={event.id}
                            onClick={handleEventChoosing}
                        />
                    ))}
                </Container>
            </ScrollView>

            {eventStore.attachEvent && (
                <Popup
                    title="Bổ sung vào vụ việc"
                    width="400px"
                    onClose={handleAttachCloseClicked}
                >
                    <FormControlLabel
                        label={'Vụ việc'}
                        control={(
                            <AdvanceSelect
                                options={caseOptions}
                                value={eventStore.attachEvent.incidentId}
                                placeholder={'Tìm vụ việc...'}
                                searchMode={'remote'}
                                textChangeDelay = {300}
                                searchable
                                onRemoteFetch = {handleSearchCase}
                                onChange={(value) => handleAttachDataChange(value, 'incidentId')}
                            />
                        )}
                    />

                    <PopupFooter>
                        <EmptyButton
                            text="Hủy"
                            onClick={handleAttachCloseClicked}
                        />
                        <Button
                            color="primary"
                            text="Thêm"
                            onClick={handleAttachClicked}
                        />
                    </PopupFooter>
                </Popup>
            )}
        </>
    );
};

const EventPanel = withModal(inject('appStore')(observer(_EventPanel)));
export default EventPanel;

type EventItemProps = {
    id: string,
    data: any,
    onClick (id: string, data: any): void,
    getTime: Date,
    active: boolean
}
const EventItem: React.FC<EventItemProps> = (props) =>
{
    const {
        id,
        data,
        onClick,
        getTime,
        active,
    } = props;
    const handleEventChoosing = () =>
    {
        if (onClick)
        {
            onClick(id, data);
        }
    };

    const renderSubEvent = () =>
    {
        return (
            <Container className={'event-list-info'}>
                <TB1><Moment format={'L LTS'}>{props.data.Timestamp}</Moment></TB1>
                {
                    Object.keys(props.data.Metadata).filter((key) => props.data.Metadata[key]).slice(0, 3).map((d) =>
                    {
                        const type = d.substr(0, d.indexOf('_'));
                        const info = props.data.Metadata[d];

                        return (
                            <Container
                                key={d}
                                className={'sub'}
                            >
                                {info}{type === 'percent' ? '%' : ''}
                            </Container>
                        );
                    })
                }
            </Container>
        );
    };

    const render = () =>
    {
        let flash = false;
        if (getTime && (new Date().getTime() - getTime.getTime() < 30000)) // get time less than 30s, flash it
        {
            flash = true;
        }

        const content = (
            <ListItem
                icon={(
                    <FAIcon
                        className={'icon'}
                        icon={data.Source === 'car_detector' ? 'car' : 'podcast'}
                        type={'solid'}
                        size={'1.5rem'}
                    />
                )}
                label={(
                    <>
                        <TB1>{data.Title}</TB1>
                        <TB1>{data.Source}</TB1>
                    </>
                )}
                sub={renderSubEvent()}
                active={active}
            />
        );

        if (flash)
        {
            return (
                <Animated
                    animationIn="bounceInDown"
                    animationInDuration={1000}
                >
                    <Container
                        className={'event-list-item flash'}
                        onClick={handleEventChoosing}
                    >
                        {content}
                    </Container>
                </Animated>
            );
        }
        else
        {
            return (
                <Container
                    className={'event-list-item'}
                    onClick={handleEventChoosing}
                >
                    {content}
                </Container>
            );
        }
    };
    return (
        <>
            {render()}
        </>
    );
};
