import React from 'react';

import { Container } from '@vbd/vui';

import { FaceIndexContextProvider } from './FaceIndexContext';
import { FaceIndexData } from './components/FaceIndexData';

export type FaceIndexProps = {}

export const FaceIndex: React.FC<FaceIndexProps> = (props) =>
{
    return (
        <Container className={'face-alert-container'}>
            <FaceIndexContextProvider>
                <FaceIndexData />
            </FaceIndexContextProvider>
        </Container>
    );
};
