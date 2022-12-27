import './PlateAccompliceSessionItem.scss';

import moment from 'moment';
import { EmptyData } from 'components/bases/Data/EmptyData';
import { useModal, Row, ListItem, Tag, T, Button, EmptyButton } from '@vbd/vui';
import { StatusColors } from '../../../FaceAlert/FaceImport/components/FaceImportContent';

export interface PlateAccompliceSession {
    id: string;
    status: string;
    plateNumber: string;
    query: any;
    createdAt: Date;
}
interface PlateAccompliceSessionsProps {
    sessions?: PlateAccompliceSession[],
    selectedSessionId?: string;
    onSelectSession?: (session: PlateAccompliceSession) => void;
    onDeleteSessionId: (id: string) => void;
}

export function PlateAccompliceSessions(props: PlateAccompliceSessionsProps) {
    const { confirm, toast } = useModal();
    const { selectedSessionId, sessions, onSelectSession, onDeleteSessionId } = props;
    if (!sessions) {
        return <EmptyData />;
    }
    return (
        <>
            {sessions.map((session) => {
                const isActive = session.id === selectedSessionId;
                const statusColor = StatusColors.find(({ id }) => id === session.status);
                const color = statusColor?.color;
                const label = statusColor?.label;
                return (
                    <Row
                        key={session.id}
                        border
                    >
                        <ListItem
                            className='plate-accomplice-session-item'
                            label={session.query?.plateNumber || 'Chưa xác định'}
                            sub={(
                                <>
                                    <Tag
                                        text={label}
                                        color={color}
                                    />
                                    <div>
                                        <T>Tạo vào ngày</T>: {moment(session.createdAt).format('DD/MM/YYYY HH:mm')}
                                    </div>
                                </>
                            )}
                            active={isActive}
                            menuIconClass='trash'
                            menuIconType='solid'
                            menuIconColor='red'

                            iconClass={'image'}
                            menuIcons={(
                                <div style={{ alignSelf: 'flex-start' }}>
                                    <Button
                                        size='sm'
                                        style={{ backgroundColor: 'unset', color: 'var(--contrast-color)' }}
                                        icon='trash-alt'
                                        onlyIcon
                                        onClick={() => {
                                            confirm({
                                                message: 'Xóa ' + session.plateNumber, onOk: async () => {
                                                    onDeleteSessionId?.(session.id);
                                                    toast({ type: 'success', message: 'Thành công' });
                                                }
                                            });
                                        }}
                                    />
                                </div>
                            )}
                            trailing={(
                                <EmptyButton
                                    size='sm'
                                    icon='trash-alt'
                                    onlyIcon
                                    onClick={() => {
                                        confirm({
                                            message: `Xóa tác vụ ${session.plateNumber}?`,
                                            onOk: () => props.onDeleteSessionId(session.id),
                                        });
                                    }}
                                />
                            )}
                            onClick={() => {
                                onSelectSession?.(session);
                            }}
                        />
                    </Row>
                );
            })}
        </>
    );
}
