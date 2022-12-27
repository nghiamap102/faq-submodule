import { Fragment, useContext } from 'react';
import moment from 'moment';
import { observer } from 'mobx-react';

import {
    Row, Column,
    ScrollView,
    ListItem,
    Tag,
    EmptyButton,
    useModal,
    T,
} from '@vbd/vui';

import { FaceImportContext, SessionTypes } from '../FaceImportContext';
import { FaceImportService } from '../FaceImportService';

import { StatusColors } from './FaceImportContent';

let SessionList = () =>
{
    const { sessions, reloadSessions, currentSession, setCurrentSession, setPageIndex, sessionPageIndex, setSessionPageIndex } = useContext(FaceImportContext);
    const { confirm, toast } = useModal();

    return (
        <ScrollView>
            {
                sessions?.map((session) =>
                {
                    const isActive = session.id === currentSession?.id;
                    const statusColor = StatusColors.find(({ id }) => id === session.status);
                    const color = statusColor?.color;
                    const label = statusColor?.label;
                    return (
                        <Fragment key={session.id}>
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
                                iconClass={session.type === SessionTypes.Gallery ? 'file-excel' : 'folder'}
                                trailing={(
                                    <Row>
                                        {session.file && (
                                            <EmptyButton
                                                size='sm'
                                                icon='download'
                                                onlyIcon
                                                onClick={() =>
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
                                        <EmptyButton
                                            size='sm'
                                            icon='trash-alt'
                                            onlyIcon
                                            onClick={() =>
                                            {
                                                confirm({
                                                    message: `Xóa tác vụ ${session.name}?`, onOk: async () =>
                                                    {
                                                        await FaceImportService.deleteSession(session.id);
                                                        toast({ type: 'success', message: 'Thành công' });
                                                        const sessions = await reloadSessions();
                                                        setCurrentSession(undefined);
                                                        !sessions.length && sessionPageIndex > 1 && setSessionPageIndex(sessionPageIndex - 1);
                                                    },
                                                });
                                            }}
                                        />
                                    </Row>
                                )}
                                onClick={() =>
                                {
                                    setCurrentSession(session);
                                    setPageIndex(0);
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
                })
            }
        </ScrollView>
    );
};

SessionList = observer(SessionList);
export { SessionList };
