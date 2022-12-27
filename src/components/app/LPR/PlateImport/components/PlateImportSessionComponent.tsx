import { observer } from 'mobx-react';
import React, { useContext } from 'react';

import {
    Paging,
    FlexPanel, PanelBody, PanelFooter,
} from '@vbd/vui';

import { PlateImportContext } from '../PlateImportContext';
import { createPlateSession } from '../PlateImportService';
import { usePlateImportSessions } from '../usePlateImportSessions';

import { PlateImportDownloadButton } from './PlateImportDownloadButton';
import { PlateImportSessionList } from './PlateImportSessionList';
import { PlateImportUploadButton } from './PlateImportUploadButton';

export interface PlateImportSession
{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    status: string;
    name: string;
    total: number;
    file?: string | {type: 'Buffer', data: number[]};
    failureCount?: number;
    successCount?: number;
}

export let PlateImportSessionComponent: React.FC = () =>
{
    const { sessionPageIndex, sessionPageSize, setSessionPageIndex, setCurrentSession } = useContext(PlateImportContext);
    const { totalSessions: total, refetchSessions } = usePlateImportSessions(sessionPageIndex, sessionPageSize);

    const onUploadPlateImportSession = async (name: string, excel: string, watchList: string[]) =>
    {
        const newSessions = await createPlateSession({ name, file: excel, watchList });
        const { data: result } = await refetchSessions();

        if (!result?.data)
        {
            return;
        }

        const sessions = result.data;
        setCurrentSession(sessions.find((session: any) => newSessions.id === session.id));
    };

    return (
        <FlexPanel width={'25rem'}>
            <PanelBody>
                <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--border)' }}>
                    <PlateImportUploadButton onLoad={onUploadPlateImportSession} />
                    <PlateImportDownloadButton />
                </div>
                <PlateImportSessionList />
                <PanelFooter>
                    <Paging
                        total={total}
                        currentPage={sessionPageIndex}
                        pageSize={sessionPageSize}
                        onChange={(value: number) =>
                        {
                            setSessionPageIndex(value);
                        }}
                    />
                </PanelFooter>
            </PanelBody>
        </FlexPanel>
    );
};

PlateImportSessionComponent = observer(PlateImportSessionComponent);
