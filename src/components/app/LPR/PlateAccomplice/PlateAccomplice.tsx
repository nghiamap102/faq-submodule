import React, { useState } from 'react';

import { Container, Paging, useModal, PanelFooter, Button, BorderPanel, FlexPanel, PanelBody } from '@vbd/vui';
import { PlateAccompliceSessions } from './components/PlateAccompliceSessions';
import { PlateAccompliceAddSessionPopup } from './components/PlateAccompliceAddSessionPopup';
import { useQuery } from 'react-query';
import { PlateAccompliceService } from './PlateAccompliceService';
import { PlateAccompliceItems } from './components/PlateAccompliceItems';


export function PlateAccomplice(): React.ReactNode
{
    const { toast } = useModal();
    const [isOpenAddPopup, setIsOpenAddPopup] = useState(false);
    const [sessionPageIndex, setSessionPageIndex] = useState(1);
    const [sessionPageSize] = useState(25);
    const [selectedSessionId, setSelectedSessionId] = useState<string>();
    const { data: dataSessions, refetch: refetchSessions } = useQuery('face-history-sessions', () => PlateAccompliceService.getSessions({ pageIndex: sessionPageIndex, pageSize: sessionPageSize }));
    
    return (
        <Container className={'plate-alert-container'}>
            {isOpenAddPopup && (
                <PlateAccompliceAddSessionPopup onClose={() =>
                {
                    setIsOpenAddPopup(false);
                    refetchSessions();
                }}
                />
            )}
            <FlexPanel width={'20rem'}>
                <PanelBody scroll>
                    <Button
                        style={{ margin: '1rem' }}
                        text='Tìm kiếm'
                        onClick={() =>setIsOpenAddPopup(true)}
                    />

                    <PlateAccompliceSessions
                        sessions={dataSessions?.sessions}
                        selectedSessionId={selectedSessionId}
                        onSelectSession={(session) => setSelectedSessionId(session.id)}
                        onDeleteSessionId={async (id) =>
                        {
                            await PlateAccompliceService.deleteSession(id);
                            toast({ type: 'success', message: 'Xóa tác vụ thành công' });
                            if (id === selectedSessionId)
                            {
                                setSelectedSessionId('');
                            }
                            refetchSessions();
                        }}
                    />
                </PanelBody>

                <PanelFooter>
                    <Paging
                        total={dataSessions?.total}
                        currentPage={sessionPageIndex}
                        pageSize={sessionPageSize}
                        onChange={(value: number) =>
                        {
                            setSessionPageIndex(value);
                        }}
                    />
                </PanelFooter>
            </FlexPanel>
            <BorderPanel>
                <PanelBody scroll>
                    <PlateAccompliceItems sessionId={selectedSessionId} />
                </PanelBody>
            </BorderPanel>
        </Container>
    );
}
