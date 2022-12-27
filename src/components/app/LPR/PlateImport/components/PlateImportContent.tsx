import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react';

import {
    Container,
    Button,
    Column,
    BorderPanel,
} from '@vbd/vui';

import { ImportStatus } from 'components/app/FaceAlert/FaceImport/FaceImportContext';

import { PlateImportContext } from '../PlateImportContext';
import { startPlateSession } from '../PlateImportService';
import { usePlateImportSessions } from '../usePlateImportSessions';

import { PlateImportContentGallery } from './PlateImportContentGallery';

export let PlateImportContent: React.FC = () =>
{
    const { sessionPageIndex, currentSession, sessionPageSize } = useContext(PlateImportContext);
    const { refetchSessions: refetch } = usePlateImportSessions(sessionPageIndex, sessionPageSize);
    const [disabled, setDisabled] = useState(false);

    useEffect(() =>
    {
        setDisabled(currentSession?.status !== ImportStatus.Uploaded);
    }, [currentSession]);

    return (
        <BorderPanel
            className={'plate-alert-content'}
            flex={1}
        >
            <Container className={'plate-alert-tool'}>
                <Container className={'plate-alert-actions'}>
                    <Button
                        color={'success'}
                        text={'Bắt đầu'}
                        disabled={disabled}
                        onClick={async () =>
                        {
                            setDisabled(true);
                            currentSession && await startPlateSession(currentSession.id);
                            refetch();
                        }}
                    />
                </Container>
            </Container>
            <Column>
                <PlateImportContentGallery />
            </Column>
        </BorderPanel>
    );
};

PlateImportContent = observer(PlateImportContent);
