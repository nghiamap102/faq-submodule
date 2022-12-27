import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { createContext, useContext } from 'react';

import { ImportSession } from 'components/app/FaceAlert/FaceImport/FaceImportContext';

export class PlateImportStore
{
    @observable
    sessionPageIndex = 1;
    @action
    setSessionPageIndex = (value: number) => this.sessionPageIndex = value;

    @observable
    sessionPageSize = 10;
    @action
    setSessionPageSize = (value: number) => this.sessionPageSize = value;

    @observable
    galleryPageIndex = 1;
    @action
    setGalleryPageIndex= (value: number) => this.galleryPageIndex = value;

    @observable
    galleryPageSize = 20;
    @action
    setGalleryPageSize = (value: number) => this.galleryPageSize = value;

    @observable
    currentSession?: ImportSession;
    @action
    setCurrentSession = (value?: ImportSession) =>
    {
        this.currentSession = value;
    };
}

export const PlateImportContext = createContext<PlateImportStore>(new PlateImportStore());
export let PlateImportProvider: React.FC = (props) =>
{
    const store = useContext(PlateImportContext);

    return <PlateImportContext.Provider value={store}>{props.children}</PlateImportContext.Provider>;
};
PlateImportProvider = observer(PlateImportProvider);
