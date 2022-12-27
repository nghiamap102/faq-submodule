import React from 'react';

import { Container } from '@vbd/vui';

import { PlateImportContent } from './components/PlateImportContent';
import { PlateImportSessionComponent } from './components/PlateImportSessionComponent';
import { PlateImportProvider } from './PlateImportContext';

export const PlateImport: React.FC = () =>
{
    return (
        <PlateImportProvider>
            <Container className={'plate-alert-container'}>
                <PlateImportSessionComponent />
                <PlateImportContent />
            </Container>
        </PlateImportProvider>
    );
};
