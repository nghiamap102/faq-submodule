import React, { Fragment, useContext } from 'react';
import moment from 'moment';
import { observer } from 'mobx-react';

import {
    Button,
    Row, Column,
    ListItem,
    Tag,
    T,
    useModal,
    EmptyData,
    ScrollView,
} from '@vbd/vui';

import { StatusColors } from 'components/app/FaceAlert/FaceImport/components/FaceImportContent';

import { usePlateImportSessions } from '../usePlateImportSessions';
import { deletePlateSession } from '../PlateImportService';
import { PlateImportContext } from '../PlateImportContext';

export let PlateImportSessionList: React.FC = () =>
{
    const { sessionPageIndex, setCurrentSession, currentSession, sessionPageSize, setSessionPageIndex } = useContext(PlateImportContext);
    const { sessions, refetchSessions: refetch } = usePlateImportSessions(sessionPageIndex, sessionPageSize);
    const { confirm, toast } = useModal();

    if (!sessions)
    {
        return <EmptyData />;
    }

    return (
        <ScrollView>
            {sessions.map((session: any, index: number) =>
            {
                const isActive = session.id === currentSession?.id;
                const statusColor = StatusColors.find(({ id }) => id === session.status);
                const color = statusColor?.color;
                const label = statusColor?.label;

                return (
                    <Fragment key={`${session.id}-${index}`}>
                        <ListItem
                            label={`${session.name}`}
                            sub={(
                                <>
                                    <Tag
                                        text={label}
                                        color={color}
                                    />
                                    <div>
                                        <T>Tải lên vào ngày</T>: {moment(session.createdAt).format('DD/MM/YYYY HH:mm')}
                                    </div>
                                </>
                            )}
                            active={isActive}
                            iconClass={'file-excel'}
                            trailing={(
                                <div style={{ alignSelf: 'flex-start' }}>
                                    {session.file && (
                                        <Button
                                            style={{ backgroundColor: 'unset', color: 'var(--contrast-color)' }}
                                            size='sm'
                                            icon='download'
                                            onlyIcon
                                            onClick={(e) =>
                                            {
                                                const byteArray = new Uint8Array((session.file as {data: any}).data);
                                                const blob = new Blob([byteArray], { type: 'application/xlsx' });
                                                const link = document.createElement('a');

                                                link.href = window.URL.createObjectURL(blob);
                                                link.download = session.name;
                                                link.click();
                                            }}
                                        />
                                    )}
                                    <Button
                                        size='sm'
                                        style={{ backgroundColor: 'unset', color: 'var(--contrast-color)' }}
                                        icon='trash-alt'
                                        onlyIcon
                                        onClick={(e) =>
                                        {
                                            confirm({
                                                message: `Xóa tác vụ ${session.name}?`, onOk: async () =>
                                                {
                                                    await deletePlateSession(session.id);
                                                    toast({ type: 'success', message: 'Thành công' });

                                                    const { data: response } = await refetch();
                                                    setCurrentSession(undefined);
                                                    !response?.data.length && sessionPageIndex > 1 && setSessionPageIndex(sessionPageIndex - 1);
                                                },
                                            });
                                        }}
                                    />
                                </div>
                            )}
                            onClick={() =>
                            {
                                setCurrentSession(session);
                            }}
                        />

                        <Row
                            mainAxisAlignment='space-between'
                            style={{ backgroundColor: 'var(--prim-highlight)' }}
                        >
                            <Column
                                crossAxisAlignment='center'
                                style={{ padding: '0.5rem' }}
                                border
                            >
                                <T>Tổng số dữ liệu</T>
                                <div>{session.total || 0}</div>
                            </Column>
                            <Column
                                crossAxisAlignment='center'
                                style={{ padding: '0.5rem' }}
                                border
                            >
                                <T>Tổng số lỗi</T>
                                <div>{session.failureCount || 0}</div>
                            </Column>

                        </Row>
                    </Fragment>

                );
            })}

        </ScrollView>
    );
};

PlateImportSessionList = observer(PlateImportSessionList);
