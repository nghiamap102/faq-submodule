import React from 'react';

import {
    Container,
    Resizable,
} from '@vbd/vui';

import { FaceImportContent } from './components/FaceImportContent';
import { FaceImportSession } from './components/FaceImportSession';
import { FaceImportProvider } from './FaceImportContext';

import '../FaceAlert.scss';

export const FaceImport: React.FC = (props) =>
{
    return (
        <Container className={'face-alert-container'}>
            <FaceImportProvider>
                <Resizable
                    defaultSizes={[450]}
                    minSizes={[320]}
                >
                    <FaceImportSession />
                    <FaceImportContent />
                </Resizable>
            </FaceImportProvider>
        </Container>
    );
};
